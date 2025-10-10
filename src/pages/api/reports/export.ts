import type { NextApiRequest, NextApiResponse } from 'next';
import PDFDocument from 'pdfkit';
import PptxGenJS from 'pptxgenjs';
import { authenticateUser } from '@/apollo/server/auth/authMiddleware';
import { hasPermission } from '@/apollo/server/rbac/permissions';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Authenticate user
    const user = await authenticateUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check RBAC permission (Analyst+ can export reports)
    if (!hasPermission(user.role as any, 'Reports', 'export')) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    const { format, data, title, template } = req.body;

    if (!format || !['PDF', 'PPT', 'CSV'].includes(format)) {
      return res.status(400).json({ error: 'Invalid format. Must be PDF, PPT, or CSV' });
    }

    // Generate report based on format
    switch (format) {
      case 'PDF':
        return await generatePDF(res, {title, data, template});
      
      case 'PPT':
        return await generatePPT(res, {title, data, template});
      
      case 'CSV':
        return await generateCSV(res, {title, data});
      
      default:
        return res.status(400).json({ error: 'Unsupported format' });
    }

  } catch (error: any) {
    console.error('Report export error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function generatePDF(
  res: NextApiResponse,
  options: { title: string; data: any; template?: string }
) {
  const { title, data } = options;
  
  // Create PDF document
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${title || 'report'}.pdf"`);

  // Pipe PDF to response
  doc.pipe(res);

  // Add title
  doc.fontSize(24).font('Helvetica-Bold').text(title || 'TrendRadar Report', {
    align: 'center'
  });
  
  doc.moveDown();
  doc.fontSize(10).font('Helvetica').text(`Generated on: ${new Date().toLocaleDateString()}`, {
    align: 'right'
  });

  doc.moveDown(2);

  // Add content based on template
  if (data?.metrics) {
    doc.fontSize(16).font('Helvetica-Bold').text('Key Metrics');
    doc.moveDown(0.5);

    data.metrics.forEach((metric: any) => {
      doc.fontSize(12).font('Helvetica');
      doc.text(`• ${metric.name}: ${metric.value}`, { indent: 20 });
      doc.moveDown(0.3);
    });

    doc.moveDown();
  }

  if (data?.trends) {
    doc.fontSize(16).font('Helvetica-Bold').text('Top Trends');
    doc.moveDown(0.5);

    data.trends.slice(0, 10).forEach((trend: any, index: number) => {
      doc.fontSize(11).font('Helvetica');
      doc.text(`${index + 1}. ${trend.name || trend.hashtag}`, { indent: 20 });
      doc.fontSize(9).font('Helvetica-Oblique');
      doc.text(`   Mentions: ${trend.mentions || 0} | Sentiment: ${((trend.sentiment || 0) * 100).toFixed(0)}%`, { indent: 30 });
      doc.moveDown(0.4);
    });
  }

  if (data?.summary) {
    doc.moveDown();
    doc.fontSize(16).font('Helvetica-Bold').text('Executive Summary');
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica').text(data.summary, { align: 'justify' });
  }

  // Footer
  doc.fontSize(8).font('Helvetica-Oblique').text(
    'This report was generated automatically by TrendRadar',
    50,
    doc.page.height - 50,
    { align: 'center' }
  );

  // Finalize PDF
  doc.end();
}

async function generatePPT(
  res: NextApiResponse,
  options: { title: string; data: any; template?: string }
) {
  const { title, data } = options;

  const pptx = new PptxGenJS();

  // Slide 1: Title Slide
  const slide1 = pptx.addSlide();
  slide1.background = { color: '1890FF' };
  slide1.addText(title || 'TrendRadar Report', {
    x: 0.5,
    y: 2.0,
    w: 9,
    h: 1.5,
    fontSize: 44,
    bold: true,
    color: 'FFFFFF',
    align: 'center'
  });
  slide1.addText(`Generated on: ${new Date().toLocaleDateString()}`, {
    x: 0.5,
    y: 4.0,
    w: 9,
    fontSize: 14,
    color: 'FFFFFF',
    align: 'center'
  });

  // Slide 2: Key Metrics
  if (data?.metrics) {
    const slide2 = pptx.addSlide();
    slide2.addText('Key Metrics', {
      x: 0.5,
      y: 0.5,
      fontSize: 32,
      bold: true,
      color: '1890FF'
    });

    const metricsData = data.metrics.map((m: any) => [
      { text: m.name, options: { bold: true } },
      { text: String(m.value), options: { align: 'right' } }
    ]);

    slide2.addTable(metricsData, {
      x: 1.0,
      y: 1.5,
      w: 8.0,
      fontSize: 14,
      border: { pt: 1, color: 'CCCCCC' },
      fill: { color: 'F3F4F6' }
    });
  }

  // Slide 3: Top Trends
  if (data?.trends) {
    const slide3 = pptx.addSlide();
    slide3.addText('Top Trends', {
      x: 0.5,
      y: 0.5,
      fontSize: 32,
      bold: true,
      color: '1890FF'
    });

    const trendsData = [
      [
        { text: 'Rank', options: { bold: true, fill: { color: '1890FF' }, color: 'FFFFFF' } },
        { text: 'Trend', options: { bold: true, fill: { color: '1890FF' }, color: 'FFFFFF' } },
        { text: 'Mentions', options: { bold: true, fill: { color: '1890FF' }, color: 'FFFFFF' } }
      ],
      ...data.trends.slice(0, 10).map((trend: any, i: number) => [
        String(i + 1),
        trend.name || trend.hashtag,
        String(trend.mentions || 0)
      ])
    ];

    slide3.addTable(trendsData, {
      x: 0.5,
      y: 1.5,
      w: 9.0,
      fontSize: 12,
      border: { pt: 1, color: 'CCCCCC' }
    });
  }

  // Generate PPT buffer
  const buffer = await pptx.write({ outputType: 'nodebuffer' }) as Buffer;

  // Set response headers
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
  res.setHeader('Content-Disposition', `attachment; filename="${title || 'report'}.pptx"`);

  // Send buffer
  res.send(buffer);
}

async function generateCSV(
  res: NextApiResponse,
  options: { title: string; data: any }
) {
  const { title, data } = options;

  // Convert trends data to CSV format
  const rows = [
    ['Rank', 'Trend', 'Mentions', 'Sentiment Score', 'Platform'].join(',')
  ];

  if (data?.trends) {
    data.trends.forEach((trend: any, index: number) => {
      rows.push([
        index + 1,
        `"${(trend.name || trend.hashtag || '').replace(/"/g, '""')}"`,
        trend.mentions || 0,
        trend.sentiment || 0,
        trend.platform || 'N/A'
      ].join(','));
    });
  }

  const csvContent = rows.join('\n');

  // Set response headers
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${title || 'report'}.csv"`);

  // Send CSV
  res.send(csvContent);
}

