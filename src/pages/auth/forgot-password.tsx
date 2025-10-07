/**
 * Forgot Password Page
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { Form, Input, Button, Card, Typography, Alert, Result } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { authClient } from '@/lib/api/authClient';
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

const BackLink = styled.div`
  text-align: center;
  margin-top: 24px;
`;

const ForgotPasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    setError(null);

    try {
      await authClient.requestPasswordReset({ email: values.email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <GuestRoute>
        <Container>
          <StyledCard>
            <Result
              status="success"
              title="Check Your Email"
              subTitle={
                <>
                  We've sent a password reset link to your email address.
                  <br />
                  Please check your inbox and follow the instructions.
                </>
              }
              extra={[
                <Link href="/auth/login" key="login">
                  <StyledButton type="primary">Back to Login</StyledButton>
                </Link>,
              ]}
            />
          </StyledCard>
        </Container>
      </GuestRoute>
    );
  }

  return (
    <GuestRoute>
      <Container>
        <StyledCard>
          <LogoContainer>
            <Logo size={48} />
          </LogoContainer>

          <StyledTitle level={2}>Forgot Password?</StyledTitle>
          <Subtitle>
            Enter your email address and we'll send you a link to reset your password
          </Subtitle>

          {error && (
            <Alert
              message={error}
              type="error"
              closable
              onClose={() => setError(null)}
              style={{ marginBottom: 24 }}
            />
          )}

          <Form
            form={form}
            name="forgot-password"
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

            <Form.Item style={{ marginTop: 32 }}>
              <StyledButton type="primary" htmlType="submit" loading={loading}>
                Send Reset Link
              </StyledButton>
            </Form.Item>
          </Form>

          <BackLink>
            <Link href="/auth/login">
              <a style={{ color: '#667eea', fontSize: 14 }}>
                <ArrowLeftOutlined /> Back to Login
              </a>
            </Link>
          </BackLink>
        </StyledCard>
      </Container>
    </GuestRoute>
  );
};

export default ForgotPasswordPage;

