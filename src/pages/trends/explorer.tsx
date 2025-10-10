import { useState, useEffect } from 'react';
import { Table, Card, Select, Button, Tag } from 'antd';
import { DownloadOutlined, FireOutlined } from '@ant-design/icons';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PageLayout } from '@/components/layouts/PageLayout';
import { useAuth } from '@/hooks/useAuth';
import { hasPermission } from '@/apollo/server/rbac/permissions';

const { Option } = Select;

interface TrendData {
  key: string;
  hashtag: string;
  mentions: number;
  sentiment: number;
  growth: number;
  platform: string;
}

export default function TrendExplorerPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [posFilter, setPosFilter] = useState<string>('all');

  const canExport = user && hasPermission(user.role as any, 'TrendExplorer', 'export');

  useEffect(() => {
    fetchTrends();
  }, [posFilter]);

  const fetchTrends = async () => {
    setLoading(true);
    // Mock data
    const mockData: TrendData[] = [
      { key: '1', hashtag: '#flashsale', mentions: 5400, sentiment: 0.62, growth: 15.2, platform: 'TikTok' },
      { key: '2', hashtag: '#newarrival', mentions: 4200, sentiment: 0.81, growth: 8.5, platform: 'Instagram' },
      { key: '3', hashtag: '#trending', mentions: 3800, sentiment: 0.74, growth: 12.1, platform: 'TikTok' },
      { key: '4', hashtag: '#viral', mentions: 3500, sentiment: 0.68, growth: -3.2, platform: 'Facebook' },
      { key: '5', hashtag: '#hotdeal', mentions: 2900, sentiment: 0.76, growth: 22.4, platform: 'Shopee' }
    ];
    setTrends(mockData);
    setLoading(false);
  };

  const exportToCSV = () => {
    const csv = [
      ['Hashtag', 'Mentions', 'Sentiment', 'Growth', 'Platform'].join(','),
      ...trends.map(t => [t.hashtag, t.mentions, t.sentiment, t.growth, t.platform].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trends_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const columns = [
    {
      title: 'Hashtag',
      dataIndex: 'hashtag',
      key: 'hashtag',
      sorter: (a: TrendData, b: TrendData) => a.hashtag.localeCompare(b.hashtag),
      render: (text: string) => <strong>{text}</strong>
    },
    {
      title: 'Mentions',
      dataIndex: 'mentions',
      key: 'mentions',
      sorter: (a: TrendData, b: TrendData) => a.mentions - b.mentions,
      render: (num: number) => num.toLocaleString()
    },
    {
      title: 'Sentiment',
      dataIndex: 'sentiment',
      key: 'sentiment',
      sorter: (a: TrendData, b: TrendData) => a.sentiment - b.sentiment,
      render: (val: number) => (
        <Tag color={val > 0.7 ? 'green' : val > 0.5 ? 'orange' : 'red'}>
          {(val * 100).toFixed(0)}%
        </Tag>
      )
    },
    {
      title: 'Growth',
      dataIndex: 'growth',
      key: 'growth',
      sorter: (a: TrendData, b: TrendData) => a.growth - b.growth,
      render: (val: number) => (
        <span style={{ color: val > 0 ? '#52c41a' : '#f5222d' }}>
          {val > 0 ? '+' : ''}{val.toFixed(1)}%
        </span>
      )
    },
    {
      title: 'Platform',
      dataIndex: 'platform',
      key: 'platform',
      filters: [
        { text: 'TikTok', value: 'TikTok' },
        { text: 'Instagram', value: 'Instagram' },
        { text: 'Facebook', value: 'Facebook' },
        { text: 'Shopee', value: 'Shopee' }
      ],
      onFilter: (value: any, record: TrendData) => record.platform === value
    }
  ];

  return (
    <ProtectedRoute>
      <PageLayout>
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '24px', margin: 0 }}>
              <FireOutlined /> Trend Explorer
            </h1>
            {canExport && (
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={exportToCSV}
              >
                Export CSV
              </Button>
            )}
          </div>

          <Card style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <span>POS Filter:</span>
              <Select
                style={{ width: 200 }}
                value={posFilter}
                onChange={setPosFilter}
              >
                <Option value="all">All Categories</Option>
                <Option value="fashion">Fashion</Option>
                <Option value="beauty">Beauty</Option>
                <Option value="electronics">Electronics</Option>
                <Option value="food">Food & Beverage</Option>
              </Select>
            </div>
          </Card>

          <Card>
            <Table
              columns={columns}
              dataSource={trends}
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>

          <Card title="4-Week Forecast" style={{ marginTop: '16px' }}>
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
              ML Forecast Chart (Mock visualization)
            </div>
          </Card>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}


