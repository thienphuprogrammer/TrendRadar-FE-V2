import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import csv from 'csv-parser';
import xlsx from 'xlsx';
import { authenticateUser } from '@/apollo/server/auth/authMiddleware';
import { hasPermission } from '@/apollo/server/rbac/permissions';

export const config = {
  api: {
    bodyParser: false,
  },
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface ParsedData {
  columns: string[];
  rows: any[];
  rowCount: number;
}

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

    // Check RBAC permission (Analyst+ can upload)
    if (!hasPermission(user.role as any, 'DataLab', 'create')) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    // Parse multipart form data
    const form = formidable({
      maxFileSize: MAX_FILE_SIZE,
      keepExtensions: true,
    });

    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>(
      (resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve([fields, files]);
        });
      }
    );

    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
    
    if (!uploadedFile) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = uploadedFile.filepath;
    const fileExtension = uploadedFile.originalFilename?.split('.').pop()?.toLowerCase();

    let parsedData: ParsedData;

    // Parse CSV
    if (fileExtension === 'csv') {
      parsedData = await parseCSV(filePath);
    }
    // Parse XLSX
    else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      parsedData = await parseXLSX(filePath);
    } else {
      // Clean up
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'Unsupported file format. Only CSV and XLSX are allowed.' });
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    // Generate chart suggestions based on column types
    const chartSuggestions = generateChartSuggestions(parsedData);

    return res.status(200).json({
      schema: {
        columns: parsedData.columns,
        rowCount: parsedData.rowCount,
        preview: parsedData.rows.slice(0, 5), // First 5 rows
      },
      chartSuggestions,
    });

  } catch (error: any) {
    console.error('File upload error:', error);
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds 10MB limit' });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function parseCSV(filePath: string): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    const rows: any[] = [];
    let columns: string[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('headers', (headers) => {
        columns = headers;
      })
      .on('data', (row) => {
        rows.push(row);
      })
      .on('end', () => {
        resolve({
          columns,
          rows,
          rowCount: rows.length,
        });
      })
      .on('error', reject);
  });
}

async function parseXLSX(filePath: string): Promise<ParsedData> {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data: any[] = xlsx.utils.sheet_to_json(worksheet);

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return {
    columns,
    rows: data,
    rowCount: data.length,
  };
}

function generateChartSuggestions(data: ParsedData): any[] {
  const suggestions = [];

  // Analyze column types
  const numericColumns: string[] = [];
  const categoricalColumns: string[] = [];
  const dateColumns: string[] = [];

  data.columns.forEach((col) => {
    const sampleValues = data.rows.slice(0, 10).map((row) => row[col]);
    
    // Check if mostly numeric
    const numericCount = sampleValues.filter((val) => !isNaN(parseFloat(val))).length;
    if (numericCount > sampleValues.length * 0.8) {
      numericColumns.push(col);
    }
    // Check if date-like
    else if (sampleValues.some((val) => !isNaN(Date.parse(val)))) {
      dateColumns.push(col);
    }
    // Otherwise categorical
    else {
      categoricalColumns.push(col);
    }
  });

  // Suggestion 1: Time series line chart (if date + numeric)
  if (dateColumns.length > 0 && numericColumns.length > 0) {
    suggestions.push({
      type: 'line',
      title: 'Time Series Trend',
      xAxis: dateColumns[0],
      yAxis: numericColumns[0],
      description: `Track ${numericColumns[0]} over ${dateColumns[0]}`,
    });
  }

  // Suggestion 2: Bar chart (categorical + numeric)
  if (categoricalColumns.length > 0 && numericColumns.length > 0) {
    suggestions.push({
      type: 'bar',
      title: 'Category Comparison',
      xAxis: categoricalColumns[0],
      yAxis: numericColumns[0],
      description: `Compare ${numericColumns[0]} by ${categoricalColumns[0]}`,
    });
  }

  // Suggestion 3: Pie chart (categorical distribution)
  if (categoricalColumns.length > 0) {
    suggestions.push({
      type: 'pie',
      title: 'Distribution',
      field: categoricalColumns[0],
      description: `${categoricalColumns[0]} distribution`,
    });
  }

  return suggestions.slice(0, 3); // Return top 3 suggestions
}

