/**
 * User Profile Page
 */

import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  Space,
  Tag,
  Typography,
} from 'antd';
import { MailOutlined, SaveOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageLayout from '@/components/layouts/PageLayout';

const { Title, Text } = Typography;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await updateProfile({
        first_name: values.firstName,
        last_name: values.lastName,
        phone: values.phone,
        company: values.company,
        bio: values.bio,
      });
    } catch (_error) {
      // Error handled by context
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const initials =
    `${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`.toUpperCase() ||
    user.email.charAt(0).toUpperCase();

  return (
    <ProtectedRoute>
      <PageLayout title="Profile">
        <Container>
          <ProfileHeader>
            <Avatar
              size={80}
              style={{ backgroundColor: '#667eea', fontSize: 32 }}
            >
              {initials}
            </Avatar>
            <ProfileInfo>
              <Title level={3} style={{ margin: 0 }}>
                {user.full_name || user.email}
              </Title>
              <Space style={{ marginTop: 8 }}>
                <Tag color="blue">{user.role}</Tag>
                <Tag color={user.status === 'active' ? 'green' : 'orange'}>
                  {user.status}
                </Tag>
              </Space>
            </ProfileInfo>
          </ProfileHeader>

          <StyledCard title="Personal Information">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                firstName: user.first_name || '',
                lastName: user.last_name || '',
                phone: user.phone || '',
                company: user.company || '',
                bio: user.bio || '',
              }}
            >
              <Space
                size="large"
                style={{ width: '100%' }}
                direction="vertical"
              >
                <div style={{ display: 'flex', gap: 16 }}>
                  <Form.Item
                    name="firstName"
                    label="First Name"
                    style={{ flex: 1 }}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="First name"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    name="lastName"
                    label="Last Name"
                    style={{ flex: 1 }}
                  >
                    <Input placeholder="Last name" size="large" />
                  </Form.Item>
                </div>

                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Please enter a valid email' },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="you@example.com"
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SaveOutlined />}
                    size="large"
                  >
                    Save Changes
                  </Button>
                </Form.Item>
              </Space>
            </Form>
          </StyledCard>

          <StyledCard title="Account Information">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Text type="secondary">Member Since</Text>
                <br />
                <Text strong>
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </div>

              {user.last_login && (
                <div>
                  <Text type="secondary">Last Login</Text>
                  <br />
                  <Text strong>
                    {new Date(user.last_login).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </div>
              )}
            </Space>
          </StyledCard>
        </Container>
      </PageLayout>
    </ProtectedRoute>
  );
};

export default ProfilePage;
