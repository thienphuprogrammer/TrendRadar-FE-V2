import { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Select,
  DatePicker,
  Spin,
  Button,
  message,
} from 'antd';
import {
  ArrowUpOutlined,
  DollarOutlined,
  TrophyOutlined,
  SmileOutlined,
  SaveOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PageLayout } from '@/components/layouts/PageLayout';
import { useAuth } from '@/hooks/useAuth';
import { hasPermission } from '@/apollo/server/rbac/permissions';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';

// Dynamic import for charts to avoid SSR issues
const Line = dynamic(
  () => import('@ant-design/plots').then((mod) => mod.Line),
  { ssr: false },
);
const Column = dynamic(
  () => import('@ant-design/plots').then((mod) => mod.Column),
  { ssr: false },
);

const { RangePicker } = DatePicker;
const { Option } = Select;

type DayjsRangePickerProps = React.ComponentProps<typeof RangePicker>;

interface KPI {
  metric: string;
  value: number;
  timestamp: string;
}

interface Trend {
  id: number;
  hashtag: string;
  mentions: number;
  sentiment: number;
  platform: string;
}

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [hotTrends, setHotTrends] = useState<Trend[]>([]);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(7, 'days'),
    dayjs(),
  ]);
  const [channel, setChannel] = useState<string>('all');
  const [region, setRegion] = useState<string>('all');
  const [chartData, setChartData] = useState<any[]>([]);
  const [layoutConfig, setLayoutConfig] = useState<any>(null);

  const canManageLayout =
    user && hasPermission(user.role as any, 'Dashboard', 'update');

  useEffect(() => {
    fetchDashboardData();

    // Load saved layout config
    if (user && canManageLayout) {
      const savedLayout = localStorage.getItem(`dashboard_layout_${user.id}`);
      if (savedLayout) {
        try {
          setLayoutConfig(JSON.parse(savedLayout));
        } catch (e) {
          console.error('Failed to load layout config:', e);
        }
      }
    }

    // Auto-refresh hot trends every 5 minutes
    const interval = setInterval(
      () => {
        fetchHotTrends();
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, channel, region, token]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchKPIs(), fetchHotTrends(), fetchChartData()]);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    // Generate mock trend data for last 30 days
    const days = 30;
    const mockData = [];
    const baseDate = dayjs();

    for (let i = days - 1; i >= 0; i--) {
      mockData.push({
        date: baseDate.subtract(i, 'day').format('YYYY-MM-DD'),
        revenue: 10000 + Math.random() * 5000,
        trendScore: 60 + Math.random() * 30,
        mentions: 1000 + Math.random() * 2000,
      });
    }

    setChartData(mockData);
  };

  const saveLayout = () => {
    if (user && canManageLayout) {
      const layout = {
        dateRange: [
          dateRange[0].format('YYYY-MM-DD'),
          dateRange[1].format('YYYY-MM-DD'),
        ],
        channel,
        region,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(
        `dashboard_layout_${user.id}`,
        JSON.stringify(layout),
      );
      message.success('Layout saved successfully');
    }
  };

  const shareLayout = () => {
    if (layoutConfig) {
      const shareUrl = `${window.location.origin}/dashboard?layout=${btoa(JSON.stringify(layoutConfig))}`;
      navigator.clipboard.writeText(shareUrl);
      message.success('Share link copied to clipboard');
    }
  };

  const fetchKPIs = async () => {
    // Mock data for now - replace with actual API call
    const mockKPIs: KPI[] = [
      {
        metric: 'revenue',
        value: 123456.78,
        timestamp: new Date().toISOString(),
      },
      {
        metric: 'trend_score',
        value: 78.9,
        timestamp: new Date().toISOString(),
      },
      { metric: 'sentiment', value: 0.72, timestamp: new Date().toISOString() },
    ];
    setKpis(mockKPIs);
  };

  const fetchHotTrends = async () => {
    // Mock data for now - replace with actual API call
    const mockTrends: Trend[] = [
      {
        id: 1,
        hashtag: '#flashsale',
        mentions: 5400,
        sentiment: 0.62,
        platform: 'TikTok',
      },
      {
        id: 2,
        hashtag: '#newarrival',
        mentions: 2100,
        sentiment: 0.81,
        platform: 'Instagram',
      },
      {
        id: 3,
        hashtag: '#trending',
        mentions: 4200,
        sentiment: 0.74,
        platform: 'TikTok',
      },
      {
        id: 4,
        hashtag: '#viral',
        mentions: 3800,
        sentiment: 0.68,
        platform: 'Facebook',
      },
      {
        id: 5,
        hashtag: '#hotdeal',
        mentions: 2900,
        sentiment: 0.76,
        platform: 'Shopee',
      },
    ];
    setHotTrends(mockTrends);
  };

  const getKPIValue = (metric: string) => {
    const kpi = kpis.find((k) => k.metric === metric);
    return kpi?.value || 0;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  if (loading) {
    return (
      <PageLayout title="Dashboard">
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" />
        </div>
      </PageLayout>
    );
  }

  return (
    <ProtectedRoute>
      <PageLayout title="Dashboard">
        <div style={{ padding: '24px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}
          >
            <h1 style={{ fontSize: '24px', margin: 0 }}>Dashboard</h1>
            {canManageLayout && (
              <div>
                <Button
                  icon={<SaveOutlined />}
                  onClick={saveLayout}
                  style={{ marginRight: '8px' }}
                >
                  Save Layout
                </Button>
                <Button
                  icon={<ShareAltOutlined />}
                  onClick={shareLayout}
                  disabled={!layoutConfig}
                >
                  Share
                </Button>
              </div>
            )}
          </div>

          {/* Filters */}
          <Row gutter={16} style={{ marginBottom: '24px' }}>
            <Col>
              <RangePicker
                value={dateRange as any}
                onChange={(dates: any) => {
                  if (dates) {
                    setDateRange([dates[0], dates[1]]);
                  }
                }}
              />
            </Col>
            <Col>
              <Select
                style={{ width: 150 }}
                value={channel}
                onChange={setChannel}
                placeholder="Channel"
              >
                <Option value="all">All Channels</Option>
                <Option value="tiktok">TikTok</Option>
                <Option value="instagram">Instagram</Option>
                <Option value="facebook">Facebook</Option>
              </Select>
            </Col>
            <Col>
              <Select
                style={{ width: 150 }}
                value={region}
                onChange={setRegion}
                placeholder="Region"
              >
                <Option value="all">All Regions</Option>
                <Option value="north">North</Option>
                <Option value="south">South</Option>
                <Option value="east">East</Option>
                <Option value="west">West</Option>
              </Select>
            </Col>
          </Row>

          {/* KPI Tiles */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Revenue"
                  value={getKPIValue('revenue')}
                  precision={2}
                  formatter={(value) => formatCurrency(Number(value))}
                  prefix={<DollarOutlined />}
                  suffix={
                    <span style={{ fontSize: '14px', color: '#52c41a' }}>
                      <ArrowUpOutlined /> 12.5%
                    </span>
                  }
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Trend Score"
                  value={getKPIValue('trend_score')}
                  precision={1}
                  prefix={<TrophyOutlined />}
                  suffix={
                    <span style={{ fontSize: '14px', color: '#52c41a' }}>
                      <ArrowUpOutlined /> 5.2%
                    </span>
                  }
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Sentiment"
                  value={getKPIValue('sentiment') * 100}
                  precision={0}
                  suffix="%"
                  prefix={<SmileOutlined />}
                  valueStyle={{
                    color:
                      getKPIValue('sentiment') > 0.7 ? '#52c41a' : '#faad14',
                  }}
                />
              </Card>
            </Col>
          </Row>

          {/* Hot Trends */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card
                title="Hot Trends Now"
                extra={
                  <span style={{ fontSize: '12px', color: '#888' }}>
                    Auto-refresh: 5min
                  </span>
                }
              >
                <div>
                  {hotTrends.map((trend) => (
                    <div
                      key={trend.id}
                      style={{
                        padding: '12px',
                        borderBottom: '1px solid #f0f0f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <strong>{trend.hashtag}</strong>
                        <div style={{ fontSize: '12px', color: '#888' }}>
                          {trend.platform}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div>{trend.mentions.toLocaleString()} mentions</div>
                        <div
                          style={{
                            fontSize: '12px',
                            color:
                              trend.sentiment > 0.7 ? '#52c41a' : '#faad14',
                          }}
                        >
                          {(trend.sentiment * 100).toFixed(0)}% positive
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="Revenue Trend (30 days)">
                {chartData.length > 0 && (
                  <Line
                    data={chartData}
                    xField="date"
                    yField="revenue"
                    smooth={true}
                    color="#1890ff"
                    height={300}
                    xAxis={{
                      type: 'time',
                      label: {
                        formatter: (v: string) => dayjs(v).format('MMM DD'),
                      },
                    }}
                    yAxis={{
                      label: {
                        formatter: (v: string) => `$${(Number(v) / 1000).toFixed(0)}k`,
                      },
                    }}
                    point={{
                      size: 3,
                      shape: 'circle',
                    }}
                    tooltip={{
                      formatter: (datum: any) => {
                        return {
                          name: 'Revenue',
                          value: `$${datum.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
                        };
                      },
                    }}
                  />
                )}
              </Card>
            </Col>
          </Row>

          {/* Additional Charts */}
          <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
            <Col xs={24}>
              <Card title="Trend Score & Mentions (30 days)">
                {chartData.length > 0 && (
                  <Column
                    data={chartData}
                    xField="date"
                    yField="mentions"
                    height={300}
                    color="#52c41a"
                    xAxis={{
                      type: 'time',
                      label: {
                        formatter: (v: string) => dayjs(v).format('MMM DD'),
                      },
                    }}
                    yAxis={{
                      label: {
                        formatter: (v: string) => `${(Number(v) / 1000).toFixed(1)}k`,
                      },
                    }}
                    tooltip={{
                      formatter: (datum: any) => {
                        return {
                          name: 'Mentions',
                          value: datum.mentions.toLocaleString(),
                        };
                      },
                    }}
                  />
                )}
              </Card>
            </Col>
          </Row>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}
