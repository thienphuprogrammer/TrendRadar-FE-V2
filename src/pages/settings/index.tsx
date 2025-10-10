import { useState } from 'react';
import { Card, Form, Input, Button, Select, Switch, message, Divider } from 'antd';
import { SettingOutlined, LockOutlined, GlobalOutlined } from '@ant-design/icons';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PageLayout } from '@/components/layouts/PageLayout';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';

const { Option } = Select;

export default function SettingsPage() {
  const { user, token, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordForm] = Form.useForm();

  const handleProfileUpdate = async (values: any) => {
    setLoading(true);
    try {
      await axios.put(
        '/api/user/profile',
        values,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success('Profile updated successfully');
      await refreshUser();
    } catch (error) {
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values: any) => {
    setLoading(true);
    try {
      await axios.post(
        '/api/user/change-password',
        values,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success('Password changed successfully');
      passwordForm.resetFields();
    } catch (error: any) {
      message.error(error.response?.data?.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesUpdate = async (values: any) => {
    setLoading(true);
    try {
      await axios.put(
        '/api/user/preferences',
        values,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success('Preferences updated successfully');
    } catch (error) {
      message.error('Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <PageLayout>
        <div style={{ padding: '24px', maxWidth: '800px' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '24px' }}>
            <SettingOutlined /> Settings
          </h1>

          {/* Profile */}
          <Card title="Profile" style={{ marginBottom: '16px' }}>
            <Form
              layout="vertical"
              onFinish={handleProfileUpdate}
              initialValues={{
                name: user?.name,
                email: user?.email
              }}
            >
              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                <Input disabled />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Update Profile
                </Button>
              </Form.Item>
            </Form>
          </Card>

          {/* Security */}
          <Card title={<><LockOutlined /> Security</>} style={{ marginBottom: '16px' }}>
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handlePasswordChange}
            >
              <Form.Item
                name="currentPassword"
                label="Current Password"
                rules={[{ required: true }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[{ required: true, min: 6 }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label="Confirm New Password"
                dependencies={['newPassword']}
                rules={[
                  { required: true },
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
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Change Password
                </Button>
              </Form.Item>
            </Form>

            <Divider />

            <Form.Item label="Two-Factor Authentication">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Enable 2FA for additional security</span>
                <Switch />
              </div>
            </Form.Item>
          </Card>

          {/* Preferences */}
          <Card title={<><GlobalOutlined /> Preferences</>}>
            <Form
              layout="vertical"
              onFinish={handlePreferencesUpdate}
              initialValues={{
                language: 'EN',
                timezone: 'UTC'
              }}
            >
              <Form.Item name="language" label="Language">
                <Select>
                  <Option value="EN">English</Option>
                  <Option value="ES">Spanish</Option>
                  <Option value="FR">French</Option>
                  <Option value="ZH_CN">Chinese (Simplified)</Option>
                </Select>
              </Form.Item>
              <Form.Item name="timezone" label="Timezone">
                <Select>
                  <Option value="UTC">UTC</Option>
                  <Option value="America/New_York">Eastern Time</Option>
                  <Option value="America/Los_Angeles">Pacific Time</Option>
                  <Option value="Europe/London">London</Option>
                  <Option value="Asia/Tokyo">Tokyo</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Save Preferences
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}


