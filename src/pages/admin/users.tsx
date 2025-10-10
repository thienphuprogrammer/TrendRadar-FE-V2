import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tag,
  Space,
} from 'antd';
import {
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PageLayout } from '@/components/layouts/PageLayout';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';

const { Option } = Select;

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  status: string;
  lastLoginAt?: string;
  createdAt: string;
}

export default function UserManagementPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: 1, limit: 100 }
      });
      setUsers(response.data.users);
    } catch (error: any) {
      if (error.response?.status === 403) {
        message.error('Access denied: Admin privileges required');
      } else {
        message.error('Failed to fetch users');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (values: any) => {
    try {
      if (editingUser) {
        // Update user
        await axios.put(`/api/admin/users/${editingUser.id}`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success('User updated successfully');
      } else {
        // Create user
        await axios.post('/api/admin/users', values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success('User created successfully');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingUser(null);
      fetchUsers();
    } catch (error: any) {
      message.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (userId: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      content: 'This action cannot be undone.',
      onOk: async () => {
        try {
          await axios.delete(`/api/admin/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          message.success('User deleted successfully');
          fetchUsers();
        } catch (error) {
          message.error('Failed to delete user');
        }
      },
    });
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag
          color={
            role === 'Admin'
              ? 'red'
              : role === 'Owner'
                ? 'orange'
                : role === 'Analyst'
                  ? 'blue'
                  : 'default'
          }
        >
          {role}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>{status}</Tag>
      ),
    },
    { title: 'Created', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingUser(record);
              form.setFieldsValue(record);
              setModalVisible(true);
            }}
          />
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <ProtectedRoute allowedRoles={['Admin']}>
      <PageLayout>
        <div style={{ padding: '24px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '24px',
            }}
          >
            <h1 style={{ fontSize: '24px', margin: 0 }}>User Management</h1>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => {
                setEditingUser(null);
                form.resetFields();
                setModalVisible(true);
              }}
            >
              Add User
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={users}
            loading={loading}
            rowKey="id"
          />

          <Modal
            title={editingUser ? 'Edit User' : 'Create User'}
            open={modalVisible}
            onCancel={() => {
              setModalVisible(false);
              setEditingUser(null);
              form.resetFields();
            }}
            onOk={() => form.submit()}
          >
            <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate}>
              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, type: 'email' }]}
              >
                <Input disabled={!!editingUser} />
              </Form.Item>
              {!editingUser && (
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true, min: 6 }]}
                >
                  <Input.Password />
                </Form.Item>
              )}
              <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                <Select>
                  <Option value="Admin">Admin</Option>
                  <Option value="Owner">Owner</Option>
                  <Option value="Analyst">Analyst</Option>
                  <Option value="Viewer">Viewer</Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}
