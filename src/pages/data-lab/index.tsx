import { useState } from 'react';
import { Card, Upload, Button, Table, message, Tag, Row, Col } from 'antd';
import { UploadOutlined, FileExcelOutlined, SaveOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PageLayout } from '@/components/layouts/PageLayout';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';

const { Dragger } = Upload;

interface SchemaColumn {
  name: string;
  type: string;
  sampleValue: any;
}

interface ChartSuggestion {
  type: string;
  title: string;
  x: string;
  y: string;
}

export default function DataLabPage() {
  const { token } = useAuth();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [schema, setSchema] = useState<SchemaColumn[]>([]);
  const [chartSuggestions, setChartSuggestions] = useState<ChartSuggestion[]>([]);
  const [uploadedFileId, setUploadedFileId] = useState<number | null>(null);

  const handleUpload = async (file: File) => {
    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      message.error('File size must be less than 10MB');
      return false;
    }

    // Check file type
    const isCSVorXLSX = file.type === 'text/csv' ||
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel';

    if (!isCSVorXLSX) {
      message.error('You can only upload CSV or XLSX files');
      return false;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/data-lab/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      const { schema, chartSuggestions } = response.data;

      // Transform schema to match frontend format
      const schemaColumns: SchemaColumn[] = schema.columns.map((col: string, index: number) => ({
        name: col,
        type: 'string', // TODO: Detect actual type from preview data
        sampleValue: schema.preview[0]?.[col] || '-'
      }));

      setSchema(schemaColumns);
      setChartSuggestions(chartSuggestions);
      setUploadedFileId(Date.now()); // Use timestamp as temp ID
      message.success(`File uploaded successfully! ${schema.rowCount} rows detected.`);
    } catch (error: any) {
      message.error(error.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }

    return false; // Prevent auto upload
  };

  const saveToDashboard = async (suggestion: ChartSuggestion) => {
    try {
      await axios.post(
        '/api/data-lab/save-chart',
        {
          fileId: uploadedFileId,
          chartConfig: suggestion
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      message.success('Chart saved to dashboard');
    } catch (error) {
      message.error('Failed to save chart');
    }
  };

  const schemaColumns = [
    {
      title: 'Column Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Data Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'number' ? 'blue' : type === 'date' ? 'green' : 'default'}>
          {type}
        </Tag>
      )
    },
    {
      title: 'Sample Value',
      dataIndex: 'sampleValue',
      key: 'sampleValue',
      render: (val: any) => String(val)
    }
  ];

  return (
    <ProtectedRoute allowedRoles={['Admin', 'Owner', 'Analyst']}>
      <PageLayout>
        <div style={{ padding: '24px' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '24px' }}>
            <FileExcelOutlined /> Data Lab
          </h1>

          <Card title="Upload Data" style={{ marginBottom: '24px' }}>
            <Dragger
              fileList={fileList}
              beforeUpload={handleUpload}
              onRemove={() => {
                setFileList([]);
                setSchema([]);
                setChartSuggestions([]);
                setUploadedFileId(null);
              }}
              maxCount={1}
              accept=".csv,.xlsx,.xls"
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
              </p>
              <p className="ant-upload-text">
                Click or drag file to upload
              </p>
              <p className="ant-upload-hint">
                Support for CSV and XLSX files (Max 10MB)
              </p>
            </Dragger>
          </Card>

          {schema.length > 0 && (
            <Card title="Schema Preview" style={{ marginBottom: '24px' }}>
              <Table
                columns={schemaColumns}
                dataSource={schema}
                pagination={false}
                size="small"
              />
            </Card>
          )}

          {chartSuggestions.length > 0 && (
            <Card title="Chart Suggestions" style={{ marginBottom: '24px' }}>
              <Row gutter={[16, 16]}>
                {chartSuggestions.map((suggestion, index) => (
                  <Col xs={24} md={8} key={index}>
                    <Card
                      size="small"
                      title={suggestion.title}
                      extra={
                        <Button
                          size="small"
                          type="primary"
                          icon={<SaveOutlined />}
                          onClick={() => saveToDashboard(suggestion)}
                        >
                          Save
                        </Button>
                      }
                    >
                      <div style={{ padding: '20px', background: '#f5f5f5', textAlign: 'center' }}>
                        <Tag color="blue">{suggestion.type}</Tag>
                        <div style={{ marginTop: '10px', fontSize: '12px' }}>
                          X: {suggestion.x} | Y: {suggestion.y}
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          )}
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}


