import { useState } from 'react';
import { Tabs, Table, Button, Card, Input, Select, Checkbox, message } from 'antd';
import { ThunderboltOutlined, ShoppingOutlined, EditOutlined, CheckSquareOutlined } from '@ant-design/icons';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PageLayout } from '@/components/layouts/PageLayout';
import { useAuth } from '@/hooks/useAuth';
import { hasPermission } from '@/apollo/server/rbac/permissions';
import axios from 'axios';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

interface RestockItem {
  key: string;
  product: string;
  currentStock: number;
  suggestedQty: number;
  confidence: number;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export default function ActionCenterPage() {
  const { user, token } = useAuth();
  const [restockData] = useState<RestockItem[]>([
    { key: '1', product: 'Product A', currentStock: 10, suggestedQty: 50, confidence: 0.92 },
    { key: '2', product: 'Product B', currentStock: 5, suggestedQty: 30, confidence: 0.85 },
    { key: '3', product: 'Product C', currentStock: 15, suggestedQty: 40, confidence: 0.78 }
  ]);

  const [caption, setCaption] = useState('');
  const [tone, setTone] = useState('Professional');
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [generating, setGenerating] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Review trend report', completed: false },
    { id: '2', title: 'Update product inventory', completed: false },
    { id: '3', title: 'Schedule social posts', completed: true }
  ]);

  const canApply = user && hasPermission(user.role, 'ActionCenter', 'apply');

  const generateCaption = async () => {
    setGenerating(true);
    try {
      // Mock LLM call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockGenerated = `${caption}\n\n✨ [Generated with ${tone} tone]\n\nDiscover amazing deals and trending products! Shop now and join thousands of satisfied customers. #TrendingNow #ShopSmart #QualityProducts`;
      setGeneratedCaption(mockGenerated);
      message.success('Caption generated successfully');
    } catch (error) {
      message.error('Failed to generate caption');
    } finally {
      setGenerating(false);
    }
  };

  const scheduleToTikTok = async () => {
    if (!canApply) {
      message.warning('Only Admin and Owner can schedule to platforms');
      return;
    }

    try {
      await axios.post(
        '/api/content/schedule',
        { content: generatedCaption, platform: 'TikTok' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success('Scheduled to TikTok');
    } catch (error) {
      message.error('Failed to schedule');
    }
  };

  const toggleTask = async (taskId: string) => {
    setTasks(prev =>
      prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
    );

    // Log to audit
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      try {
        await axios.post(
          '/api/actions/log',
          { action: 'TASK_COMPLETE', resource: 'task', resourceId: taskId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error('Failed to log task completion');
      }
    }
  };

  const restockColumns = [
    {title: 'Product', dataIndex: 'product', key: 'product'},
    {title: 'Current Stock', dataIndex: 'currentStock', key: 'currentStock'},
    {title: 'Suggested Qty', dataIndex: 'suggestedQty', key: 'suggestedQty'},
    {
      title: 'Confidence',
      dataIndex: 'confidence',
      key: 'confidence',
      render: (val: number) => `${(val * 100).toFixed(0)}%`
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: RestockItem) => (
        <Button type="primary" size="small" disabled={!canApply}>
          Apply
        </Button>
      )
    }
  ];

  return (
    <ProtectedRoute allowedRoles={['Admin', 'Owner', 'Analyst']}>
      <PageLayout>
        <div style={{ padding: '24px' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '24px' }}>
            <ThunderboltOutlined /> Action Center
          </h1>

          <Tabs defaultActiveKey="restock">
            <TabPane
              tab={<span><ShoppingOutlined /> Restock Suggestions</span>}
              key="restock"
            >
              <Card>
                <Table columns={restockColumns} dataSource={restockData} pagination={false} />
              </Card>
            </TabPane>

            <TabPane
              tab={<span><EditOutlined /> Content Generator</span>}
              key="content"
            >
              <Card>
                <div style={{ marginBottom: '16px' }}>
                  <label>Base Caption:</label>
                  <TextArea
                    rows={4}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Enter your base caption..."
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label>Tone:</label>
                  <Select value={tone} onChange={setTone} style={{ width: '100%', marginTop: '8px' }}>
                    <Option value="Professional">Professional</Option>
                    <Option value="Casual">Casual</Option>
                    <Option value="Trendy">Trendy</Option>
                  </Select>
                </div>

                <Button
                  type="primary"
                  onClick={generateCaption}
                  loading={generating}
                  disabled={!caption.trim()}
                  style={{ marginBottom: '16px' }}
                >
                  Generate
                </Button>

                {generatedCaption && (
                  <div>
                    <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                      <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{generatedCaption}</pre>
                    </div>
                    <Button type="primary" onClick={scheduleToTikTok}>
                      Schedule to TikTok {!canApply && '(Pro)'}
                    </Button>
                  </div>
                )}
              </Card>
            </TabPane>

            <TabPane
              tab={<span><CheckSquareOutlined /> Task Checklist</span>}
              key="tasks"
            >
              <Card>
                {tasks.map(task => (
                  <div key={task.id} style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <Checkbox
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                    >
                      <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                        {task.title}
                      </span>
                    </Checkbox>
                  </div>
                ))}
              </Card>
            </TabPane>
          </Tabs>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}


