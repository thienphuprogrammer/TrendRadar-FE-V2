import { useState } from 'react';
import { Card, Form, Select, DatePicker, Input, Button, Table, Tag, message } from 'antd';
import { FileTextOutlined, FilePdfOutlined, MailOutlined } from '@ant-design/icons';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PageLayout } from '@/components/layouts/PageLayout';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface Report {
  key: string;
  name: string;
  type: string;
  format: string;
  createdAt: string;
}

export default function ReportsPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [reports] = useState<Report[]>([
    { key: '1', name: 'Weekly Summary', type: 'weekly_summary', format: 'PDF', createdAt: '2025-10-08' },
    { key: '2', name: 'Monthly Trends', type: 'monthly_trends', format: 'PPT', createdAt: '2025-10-01' },
  ]);

  const handleExport = async (values: any) => {
    setLoading(true);
    try {
      // Mock data for report generation
      const reportData = {
        title: `${values.template.replace('_', ' ').toUpperCase()} Report`,
        data: {
          metrics: [
            { name: 'Total Revenue', value: '$124,580' },
            { name: 'Trend Score', value: '87.5' },
            { name: 'Active Campaigns', value: '12' },
            { name: 'Engagement Rate', value: '64%' }
          ],
          trends: [
            { hashtag: '#TrendingNow', mentions: 12500, sentiment: 0.85, platform: 'TikTok' },
            { hashtag: '#ViralProduct', mentions: 9800, sentiment: 0.72, platform: 'Instagram' },
            { hashtag: '#BestDeals', mentions: 7200, sentiment: 0.68, platform: 'Twitter' },
          ],
          summary: 'This report provides a comprehensive overview of key business metrics and trending topics for the selected period.'
        },
        format: values.format,
        template: values.template
      };

      const response = await axios.post(
        '/api/reports/export',
        reportData,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      // Determine file extension
      let extension = values.format.toLowerCase();
      if (extension === 'ppt') extension = 'pptx';
      
      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportData.title.replace(/\s+/g, '_')}_${Date.now()}.${extension}`;
      link.click();
      message.success(`${values.format} report exported successfully`);
    } catch (error) {
      message.error('Failed to export report');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    {
      title: 'Format',
      dataIndex: 'format',
      key: 'format',
      render: (format: string) => <Tag>{format}</Tag>
    },
    { title: 'Created', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Button size="small" type="link">Download</Button>
      )
    }
  ];

  return (
    <ProtectedRoute>
      <PageLayout>
        <div style={{ padding: '24px' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '24px' }}>
            <FileTextOutlined /> Reports & Export
          </h1>

          <Card title="Generate New Report" style={{ marginBottom: '24px' }}>
            <Form layout="vertical" onFinish={handleExport}>
              <Form.Item name="template" label="Template" rules={[{ required: true }]}>
                <Select placeholder="Select template">
                  <Option value="weekly_summary">Weekly Summary</Option>
                  <Option value="monthly_trends">Monthly Trends</Option>
                  <Option value="custom">Custom Report</Option>
                </Select>
              </Form.Item>

              <Form.Item name="dateRange" label="Date Range" rules={[{ required: true }]}>
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item name="format" label="Format" rules={[{ required: true }]}>
                <Select placeholder="Select format">
                  <Option value="PDF"><FilePdfOutlined /> PDF</Option>
                  <Option value="PPT">PowerPoint</Option>
                  <Option value="CSV">CSV</Option>
                </Select>
              </Form.Item>

              <Form.Item name="recipients" label="Email Recipients (optional)">
                <Input placeholder="email1@example.com, email2@example.com" prefix={<MailOutlined />} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Generate Report
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <Card title="Report History">
            <Table columns={columns} dataSource={reports} />
          </Card>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}


