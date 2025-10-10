import { useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Input, Button, Card, Alert, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import Head from 'next/head';

const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError(null);

    try {
      await login(values.email, values.password);

      // Redirect to original page or home
      const redirect = router.query.redirect as string;
      router.push(redirect || '/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - TrendRadarAI</title>
      </Head>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Card
          style={{
            width: 450,
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            borderRadius: '8px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <Title level={2} style={{ marginBottom: '8px' }}>
              TrendRadar AI
            </Title>
            <Text type="secondary">Sign in to your account</Text>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
              style={{ marginBottom: '20px' }}
            />
          )}

          <Form
            name="login"
            onFinish={handleLogin}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Email"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div
            style={{
              marginTop: '30px',
              padding: '20px',
              background: '#f5f5f5',
              borderRadius: '6px',
            }}
          >
            <Text strong style={{ display: 'block', marginBottom: '10px' }}>
              Test Accounts:
            </Text>
            <Text style={{ fontSize: '12px', display: 'block' }}>
              👑 Admin: admin@example.com / admin123
            </Text>
            <Text style={{ fontSize: '12px', display: 'block' }}>
              🏢 Owner: owner@example.com / owner123
            </Text>
            <Text style={{ fontSize: '12px', display: 'block' }}>
              📊 Analyst: analyst@example.com / analyst123
            </Text>
            <Text style={{ fontSize: '12px', display: 'block' }}>
              👀 Viewer: viewer@example.com / viewer123
            </Text>
          </div>
        </Card>
      </div>
    </>
  );
}
