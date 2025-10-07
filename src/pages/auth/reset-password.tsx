/**
 * Reset Password Page
 */

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Alert, Button, Card, Form, Input, Result, Typography } from 'antd';
import { LockOutlined } from '@ant-design/icons';
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

const ResetPasswordPage: React.FC = () => {
  const router = useRouter();
  const { token } = router.query;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: { password: string }) => {
    if (!token || typeof token !== 'string') {
      setError('Invalid reset token');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await authClient.confirmPasswordReset({
        token,
        newPassword: values.password,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          'Failed to reset password. Please try again.',
      );
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
              title="Password Reset Successful"
              subTitle="Your password has been successfully reset. You can now log in with your new password."
              extra={[
                <Link href="/auth/login" key="login" legacyBehavior>
                  <StyledButton type="primary">Go to Login</StyledButton>
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

          <StyledTitle level={2}>Reset Password</StyledTitle>
          <Subtitle>Enter your new password below</Subtitle>

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
            name="reset-password"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="password"
              label="New Password"
              rules={[
                { required: true, message: 'Please enter your new password' },
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
              label="Confirm New Password"
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
                Reset Password
              </StyledButton>
            </Form.Item>
          </Form>
        </StyledCard>
      </Container>
    </GuestRoute>
  );
};

export default ResetPasswordPage;
