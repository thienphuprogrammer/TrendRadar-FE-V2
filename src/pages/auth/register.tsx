/**
 * Register Page
 */

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Form, Input, Button, Card, Typography, Space, Alert, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import GuestRoute from '@/components/auth/GuestRoute';
import { Logo } from '@/components/Logo';

const { Title, Text } = Typography;
const { Option } = Select;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border-radius: 12px;

  .ant-card-body {
    padding: 48px 40px;
  }
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const StyledTitle = styled(Title)`
  text-align: center;
  margin-bottom: 8px !important;
  color: #1a1a1a;
`;

const Subtitle = styled(Text)`
  display: block;
  text-align: center;
  color: #666;
  margin-bottom: 32px;
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 24px;
  color: #666;
`;

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const { register, error: authError, clearError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setLoading(true);
    clearError();

    try {
      await register({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        role: values.role || UserRole.VIEWER,
      });
    } catch (error) {
      // Error handled by context
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuestRoute>
      <Container>
        <StyledCard>
          <LogoContainer>
            <Logo size={48} />
          </LogoContainer>

          <StyledTitle level={2}>Create Account</StyledTitle>
          <Subtitle>Get started with Wren AI</Subtitle>

          {authError && (
            <Alert
              message={authError}
              type="error"
              closable
              onClose={clearError}
              style={{ marginBottom: 24 }}
            />
          )}

          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
          >
            <Space.Compact style={{ width: '100%' }}>
              <Form.Item
                name="firstName"
                label="First Name"
                style={{ width: '50%', marginBottom: 16 }}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="First name"
                  size="large"
                  autoComplete="given-name"
                />
              </Form.Item>

              <Form.Item
                name="lastName"
                label="Last Name"
                style={{ width: '50%', marginBottom: 16 }}
              >
                <Input
                  placeholder="Last name"
                  size="large"
                  autoComplete="family-name"
                />
              </Form.Item>
            </Space.Compact>

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
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="role"
              label="Role"
              initialValue={UserRole.VIEWER}
              tooltip="Your role in the organization"
            >
              <Select size="large">
                <Option value={UserRole.VIEWER}>Viewer</Option>
                <Option value={UserRole.ANALYST}>Analyst</Option>
                <Option value={UserRole.DEVELOPER}>Developer</Option>
                <Option value={UserRole.ADMIN}>Admin</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please enter your password' },
                { min: 8, message: 'Password must be at least 8 characters' },
              ]}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Create a strong password"
                size="large"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm your password"
                size="large"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item style={{ marginTop: 32 }}>
              <StyledButton type="primary" htmlType="submit" loading={loading}>
                Create Account
              </StyledButton>
            </Form.Item>
          </Form>

          <Footer>
            <Text type="secondary">Already have an account? </Text>
            <Link href="/auth/login">
              <a style={{ color: '#667eea', fontWeight: 500 }}>Sign in</a>
            </Link>
          </Footer>
        </StyledCard>
      </Container>
    </GuestRoute>
  );
};

export default RegisterPage;

