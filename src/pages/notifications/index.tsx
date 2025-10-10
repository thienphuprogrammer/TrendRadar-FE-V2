import { useState, useEffect } from 'react';
import { List, Card, Badge, Button, Modal, Form, Input, Select, Switch, Tag } from 'antd';
import { BellOutlined, SettingOutlined, DeleteOutlined } from '@ant-design/icons';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PageLayout } from '@/components/layouts/PageLayout';
import { useAuth } from '@/hooks/useAuth';

const { Option } = Select;

interface Notification {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', type: 'trend', message: '#flashsale exceeded threshold (5000 mentions)', isRead: false, createdAt: '2 hours ago' },
    { id: '2', type: 'system', message: 'Weekly report is ready for download', isRead: true, createdAt: '1 day ago' },
    { id: '3', type: 'integration', message: 'TikTok sync completed successfully', isRead: true, createdAt: '2 days ago' }
  ]);
  const [settingsVisible, setSettingsVisible] = useState(false);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <ProtectedRoute>
      <PageLayout>
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '24px', margin: 0 }}>
              <BellOutlined /> Notifications
              {unreadCount > 0 && (
                <Badge count={unreadCount} style={{ marginLeft: '12px' }} />
              )}
            </h1>
            <Button
              icon={<SettingOutlined />}
              onClick={() => setSettingsVisible(true)}
            >
              Settings
            </Button>
          </div>

          <Card>
            <List
              itemLayout="horizontal"
              dataSource={notifications}
              renderItem={(item) => (
                <List.Item
                  style={{
                    background: item.isRead ? 'transparent' : '#f0f5ff',
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '8px'
                  }}
                  actions={[
                    !item.isRead && (
                      <Button
                        type="link"
                        size="small"
                        onClick={() => markAsRead(item.id)}
                      >
                        Mark as read
                      </Button>
                    ),
                    <Button
                      type="link"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => deleteNotification(item.id)}
                    />
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <div>
                        <Tag color="blue">{item.type}</Tag>
                        {item.message}
                      </div>
                    }
                    description={item.createdAt}
                  />
                </List.Item>
              )}
            />
          </Card>

          <Modal
            title="Notification Settings"
            open={settingsVisible}
            onCancel={() => setSettingsVisible(false)}
            footer={null}
          >
            <Form layout="vertical">
              <Form.Item label="Alert Type">
                <Select defaultValue="all">
                  <Option value="all">All Notifications</Option>
                  <Option value="trend">Trend Alerts</Option>
                  <Option value="system">System Alerts</Option>
                  <Option value="integration">Integration Alerts</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Threshold (mentions)">
                <Input type="number" defaultValue={5000} />
              </Form.Item>

              <Form.Item label="Channel">
                <Select defaultValue="in_app">
                  <Option value="in_app">In-App</Option>
                  <Option value="email">Email</Option>
                  <Option value="sms">SMS</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Mute Notifications">
                <Switch />
              </Form.Item>

              <Form.Item>
                <Button type="primary" block>
                  Save Settings
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}


