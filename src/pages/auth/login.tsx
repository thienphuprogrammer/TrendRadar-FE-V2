/**
 * Login Page
 */

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Form, Input, Button, Card, Typography, Divider, Space, Alert } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useAuth } from '@/contexts/AuthContext';
import GuestRoute from '@/components/auth/GuestRoute';
import { Logo } from '@/components/Logo';

const { Title, Text } = Typography;

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
  max-width: 450px;
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

const ForgotPasswordLink = styled.div`
  text-align: right;
  margin-bottom: 16px;
`;

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { login, error: authError, clearError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    clearError();

    try {
      await login({
        email: values.email,
        password: values.password,
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

          <StyledTitle level={2}>Welcome Back</StyledTitle>
          <Subtitle>Sign in to your Wren AI account</Subtitle>

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
            name="login"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
          >
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
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
                size="large"
                autoComplete="current-password"
              />
            </Form.Item>

            <ForgotPasswordLink>
              <Link href="/auth/forgot-password">
                <a style={{ color: '#667eea' }}>Forgot password?</a>
              </Link>
            </ForgotPasswordLink>

            <Form.Item>
              <StyledButton type="primary" htmlType="submit" loading={loading}>
                Sign In
              </StyledButton>
            </Form.Item>
          </Form>

          <Divider plain>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Or continue with
            </Text>
          </Divider>

          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Button
              size="large"
              block
              icon={<span style={{ fontSize: 18 }}>🔐</span>}
              style={{ borderRadius: 8 }}
            >
              SSO Login
            </Button>
          </Space>

          <Footer>
            <Text type="secondary">Don't have an account? </Text>
            <Link href="/auth/register">
              <a style={{ color: '#667eea', fontWeight: 500 }}>Sign up</a>
            </Link>
          </Footer>
        </StyledCard>
      </Container>
    </GuestRoute>
  );
};

export default LoginPage;

