import { useState } from 'react';
import { Card, Form, Input, Button, Select, Row, Col, Tag, Modal, Calendar, Badge, Space, message } from 'antd';
import { EditOutlined, CopyOutlined, CalendarOutlined, SendOutlined } from '@ant-design/icons';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PageLayout } from '@/components/layouts/PageLayout';
import { useAuth } from '@/hooks/useAuth';
import { hasPermission } from '@/apollo/server/rbac/permissions';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

interface ContentVariant {
  id: string;
  content: string;
  tone: string;
  performance?: number;
}

interface ScheduledContent {
  id: string;
  date: string;
  platform: string;
  content: string;
  status: 'draft' | 'scheduled' | 'published';
}

export default function ContentStudioPage() {
  const { user, token } = useAuth();
  const [form] = Form.useForm();
  const [generating, setGenerating] = useState(false);
  const [variants, setVariants] = useState<ContentVariant[]>([]);
  const [scheduledContent, setScheduledContent] = useState<ScheduledContent[]>([
    {
      id: '1',
      date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
      platform: 'TikTok',
      content: 'Check out our new arrivals! 🔥 #trending',
      status: 'scheduled'
    },
    {
      id: '2',
      date: dayjs().add(3, 'day').format('YYYY-MM-DD'),
      platform: 'Instagram',
      content: 'Flash sale alert! Limited time only ⚡',
      status: 'scheduled'
    }
  ]);
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const canCreateContent = user && hasPermission(user.role as any, 'ContentStudio', 'create');

  const generateVariants = async (values: any) => {
    if (!canCreateContent) {
      message.warning('You do not have permission to generate content');
      return;
    }

    setGenerating(true);
    
    try {
      // Mock A/B variant generation - replace with actual LLM API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const baseContent = values.baseContent;
      const tone = values.tone;
      const count = values.variantCount || 3;

      const mockVariants: ContentVariant[] = [];

      // Generate variants based on tone
      const toneModifiers = {
        Professional: ['Discover', 'Explore', 'Learn about'],
        Casual: ['Check out', 'Hey!', 'Don\'t miss'],
        Trendy: ['🔥 Lit alert', '✨ Vibe check', '💯 No cap']
      };

      const modifiers = toneModifiers[tone as keyof typeof toneModifiers] || ['Check out'];

      for (let i = 0; i < Math.min(count, 5); i++) {
        const modifier = modifiers[i % modifiers.length];
        mockVariants.push({
          id: `variant-${i}`,
          content: `${modifier}: ${baseContent}`,
          tone,
          performance: Math.floor(60 + Math.random() * 35) // Mock performance score
        });
      }

      setVariants(mockVariants);
      message.success(`Generated ${mockVariants.length} content variants`);
    } catch (error) {
      message.error('Failed to generate variants');
    } finally {
      setGenerating(false);
    }
  };

  const scheduleContent = (variant: ContentVariant) => {
    if (!selectedDate) {
      message.warning('Please select a date from the calendar');
      return;
    }

    Modal.confirm({
      title: 'Schedule Content',
      content: (
        <Form layout="vertical">
          <Form.Item label="Platform">
            <Select defaultValue="TikTok" id="schedule-platform">
              <Option value="TikTok">TikTok</Option>
              <Option value="Instagram">Instagram</Option>
              <Option value="Shopee">Shopee</Option>
              <Option value="Facebook">Facebook</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date">
            <Input disabled value={selectedDate.format('YYYY-MM-DD')} />
          </Form.Item>
        </Form>
      ),
      onOk: () => {
        const platformSelect = document.getElementById('schedule-platform') as HTMLSelectElement;
        const platform = platformSelect?.value || 'TikTok';

        const newScheduled: ScheduledContent = {
          id: `scheduled-${Date.now()}`,
          date: selectedDate.format('YYYY-MM-DD'),
          platform,
          content: variant.content,
          status: 'scheduled'
        };

        setScheduledContent([...scheduledContent, newScheduled]);
        message.success(`Content scheduled for ${selectedDate.format('MMM DD, YYYY')}`);
        setSelectedDate(null);
      }
    });
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    message.success('Content copied to clipboard');
  };

  const getListData = (value: Dayjs) => {
    const dateStr = value.format('YYYY-MM-DD');
    const items = scheduledContent.filter(item => item.date === dateStr);
    return items.map(item => ({
      type: 'success' as const,
      content: `${item.platform}: ${item.content.substring(0, 20)}...`
    }));
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {listData.map((item, index) => (
          <li key={index}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <ProtectedRoute allowedRoles={['Admin', 'Owner', 'Analyst']}>
      <PageLayout
        title="Content Studio"
        icon={<EditOutlined />}
        description="Create, optimize, and schedule social media content"
      >
        <div style={{ padding: '24px' }}>
          <Row gutter={[24, 24]}>
            {/* Caption Composer */}
            <Col xs={24} lg={12}>
              <Card title="Caption Composer">
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={generateVariants}
                  initialValues={{ tone: 'Professional', variantCount: 3 }}
                >
                  <Form.Item
                    name="baseContent"
                    label="Base Content"
                    rules={[{ required: true, message: 'Please enter base content' }]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="Enter your base content idea..."
                      data-testid="base-content-input"
                    />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="tone" label="Tone">
                        <Select data-testid="tone-select">
                          <Option value="Professional">Professional</Option>
                          <Option value="Casual">Casual</Option>
                          <Option value="Trendy">Trendy</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="variantCount" label="Number of Variants">
                        <Select data-testid="variant-count-select">
                          <Option value={3}>3 Variants</Option>
                          <Option value={5}>5 Variants</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<CopyOutlined />}
                      loading={generating}
                      block
                      disabled={!canCreateContent}
                      data-testid="generate-variants-btn"
                    >
                      Generate A/B Variants
                    </Button>
                  </Form.Item>
                </Form>
              </Card>

              {/* Generated Variants */}
              {variants.length > 0 && (
                <Card
                  title="Generated Variants"
                  style={{ marginTop: '24px' }}
                  data-testid="variants-card"
                >
                  {variants.map((variant, index) => (
                    <Card.Grid
                      key={variant.id}
                      style={{ width: '100%', padding: '16px' }}
                      data-testid={`variant-${index}`}
                    >
                      <div style={{ marginBottom: '12px' }}>
                        <Space>
                          <Tag color="blue">Variant {index + 1}</Tag>
                          <Tag color="green">
                            Performance: {variant.performance}%
                          </Tag>
                        </Space>
                      </div>
                      <div
                        style={{
                          background: '#f5f5f5',
                          padding: '12px',
                          borderRadius: '8px',
                          marginBottom: '12px'
                        }}
                      >
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                          {variant.content}
                        </pre>
                      </div>
                      <Space>
                        <Button
                          size="small"
                          icon={<CopyOutlined />}
                          onClick={() => copyToClipboard(variant.content)}
                          data-testid={`copy-variant-${index}-btn`}
                        >
                          Copy
                        </Button>
                        <Button
                          size="small"
                          type="primary"
                          icon={<CalendarOutlined />}
                          onClick={() => {
                            setCalendarModalVisible(true);
                            // Store selected variant for scheduling
                            form.setFieldsValue({ selectedVariant: variant });
                          }}
                          data-testid={`schedule-variant-${index}-btn`}
                        >
                          Schedule
                        </Button>
                      </Space>
                    </Card.Grid>
                  ))}
                </Card>
              )}
            </Col>

            {/* Content Calendar */}
            <Col xs={24} lg={12}>
              <Card
                title="Content Calendar"
                extra={
                  <Button
                    icon={<CalendarOutlined />}
                    onClick={() => setCalendarModalVisible(true)}
                    data-testid="open-calendar-btn"
                  >
                    View Calendar
                  </Button>
                }
              >
                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  {scheduledContent.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: '12px',
                        borderBottom: '1px solid #f0f0f0',
                        marginBottom: '8px'
                      }}
                      data-testid={`scheduled-content-${item.id}`}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <Space>
                          <Tag color="blue">{item.platform}</Tag>
                          <Tag color={item.status === 'scheduled' ? 'orange' : item.status === 'published' ? 'green' : 'default'}>
                            {item.status}
                          </Tag>
                        </Space>
                        <span style={{ color: '#888', fontSize: '12px' }}>
                          {dayjs(item.date).format('MMM DD, YYYY')}
                        </span>
                      </div>
                      <div style={{ fontSize: '14px' }}>{item.content}</div>
                    </div>
                  ))}

                  {scheduledContent.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                      No scheduled content yet
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          </Row>

          {/* Calendar Modal */}
          <Modal
            title="Content Calendar"
            open={calendarModalVisible}
            onCancel={() => {
              setCalendarModalVisible(false);
              setSelectedDate(null);
            }}
            footer={null}
            width={800}
          >
            <Calendar
              dateCellRender={dateCellRender}
              onSelect={(date) => {
                setSelectedDate(date);
                const selectedVariant = form.getFieldValue('selectedVariant');
                if (selectedVariant) {
                  scheduleContent(selectedVariant);
                  setCalendarModalVisible(false);
                }
              }}
            />
          </Modal>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}
