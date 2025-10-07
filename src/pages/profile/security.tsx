/**
 * Security Settings Page
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Space,
  Table,
  Popconfirm,
  Tag,
  Divider,
} from 'antd';
import { LockOutlined, DeleteOutlined, DesktopOutlined, MobileOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useAuth } from '@/contexts/AuthContext';
import { authClient } from '@/lib/api/authClient';
import { SessionInfo } from '@/types/auth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageLayout from '@/components/layouts/PageLayout';

const { Title, Text } = Typography;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
`;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SecurityPage: React.FC = () => {
  const { changePassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [form] = Form.useForm();

  const loadSessions = async () => {
    setLoadingSessions(true);
    try {
      const data = await authClient.getSessions();
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      form.resetFields();
    } catch (error) {
      // Error handled by context
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId: number) => {
    try {
      await authClient.revokeSession(sessionId);
      loadSessions();
    } catch (error: any) {
      console.error('Failed to revoke session:', error);
    }
  };

  const handleRevokeAllSessions = async () => {
    try {
      await authClient.revokeAllSessions();
      loadSessions();
    } catch (error: any) {
      console.error('Failed to revoke sessions:', error);
    }
  };

  const columns = [
    {
      title: 'Device',
      dataIndex: 'userAgent',
      key: 'userAgent',
      render: (userAgent: string) => (
        <Space>
          {userAgent?.toLowerCase().includes('mobile') ? (
            <MobileOutlined />
          ) : (
            <DesktopOutlined />
          )}
          <Text>{userAgent || 'Unknown Device'}</Text>
        </Space>
      ),
    },
    {
      title: 'IP Address',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
    },
    {
      title: 'Last Activity',
      dataIndex: 'lastActivityAt',
      key: 'lastActivityAt',
      render: (date: string) =>
        new Date(date).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: SessionInfo) => (
        <Popconfirm
          title="Revoke this session?"
          description="This will log out the device."
          onConfirm={() => handleRevokeSession(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger size="small" icon={<DeleteOutlined />}>
            Revoke
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <ProtectedRoute>
      <PageLayout>
        <Container>
          <Title level={2}>Security Settings</Title>

          <StyledCard title="Change Password">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
            >
              <Form.Item
                name="oldPassword"
                label="Current Password"
                rules={[{ required: true, message: 'Please enter your current password' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Current password"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[
                  { required: true, message: 'Please enter your new password' },
                  { min: 8, message: 'Password must be at least 8 characters' },
                ]}
                hasFeedback
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="New password"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm New Password"
                dependencies={['newPassword']}
                hasFeedback
                rules={[
                  { required: true, message: 'Please confirm your password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Confirm new password"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} size="large">
                  Update Password
                </Button>
              </Form.Item>
            </Form>
          </StyledCard>

          <StyledCard
            title="Active Sessions"
            extra={
              <Popconfirm
                title="Revoke all sessions?"
                description="This will log out all devices except the current one."
                onConfirm={handleRevokeAllSessions}
                okText="Yes"
                cancelText="No"
              >
                <Button danger size="small">
                  Revoke All
                </Button>
              </Popconfirm>
            }
          >
            <Table
              columns={columns}
              dataSource={sessions}
              loading={loadingSessions}
              rowKey="id"
              pagination={false}
            />
          </StyledCard>
        </Container>
      </PageLayout>
    </ProtectedRoute>
  );
};

export default SecurityPage;

