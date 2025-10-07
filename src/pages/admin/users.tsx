/**
 * Admin User Management Page
 */

import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { useAuth } from '@/contexts/AuthContext';
import { authClient } from '@/lib/api/authClient';
import { User, UserRole, UserStatus } from '@/types/auth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageLayout from '@/components/layouts/PageLayout';

const { Title } = Typography;
const { Option } = Select;

const Container = styled.div`
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Filters = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

const StyledCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const UserManagementPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    role: undefined as string | undefined,
    status: undefined as string | undefined,
  });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await authClient.getUsers({
        search: filters.search || undefined,
        role: filters.role,
        status: filters.status,
      });
      setUsers(data);
    } catch (error: any) {
      message.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [filters]);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    form.setFieldsValue({
      role: user.role,
      status: user.status,
    });
    setEditModalVisible(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      const values = await form.validateFields();

      // Update role
      if (values.role !== selectedUser.role) {
        await authClient.updateUserRole(selectedUser.id, values.role);
      }

      // Update status
      if (values.status !== selectedUser.status) {
        await authClient.updateUserStatus(selectedUser.id, values.status);
      }

      message.success('User updated successfully');
      setEditModalVisible(false);
      loadUsers();
    } catch (error: any) {
      message.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await authClient.deleteUser(userId);
      message.success('User deleted successfully');
      loadUsers();
    } catch (error: any) {
      message.error('Failed to delete user');
    }
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'red',
      developer: 'purple',
      analyst: 'blue',
      viewer: 'green',
      seller: 'orange',
    };
    return colors[role] || 'default';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'green',
      inactive: 'default',
      pending: 'orange',
      suspended: 'red',
    };
    return colors[status] || 'default';
  };

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a: User, b: User) => a.email.localeCompare(b.email),
    },
    {
      title: 'Name',
      key: 'name',
      render: (_: any, record: User) =>
        record.firstName && record.lastName
          ? `${record.firstName} ${record.lastName}`
          : '-',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      filters: Object.values(UserRole).map((role) => ({
        text: role,
        value: role,
      })),
      onFilter: (value: any, record: User) => record.role === value,
      render: (role: string) => (
        <Tag color={getRoleColor(role)}>{role.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: Object.values(UserStatus).map((status) => ({
        text: status,
        value: status,
      })),
      onFilter: (value: any, record: User) => record.status === value,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: User, b: User) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date: string) =>
        new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
            disabled={record.id === currentUser?.id}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete user?"
            description="This action cannot be undone."
            onConfirm={() => handleDeleteUser(record.id)}
            okText="Yes"
            cancelText="No"
            disabled={record.id === currentUser?.id}
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              disabled={record.id === currentUser?.id}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <ProtectedRoute requiredRoles={[UserRole.ADMIN]}>
      <PageLayout>
        <Container>
          <Header>
            <Title level={2}>User Management</Title>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={loadUsers}
            >
              Refresh
            </Button>
          </Header>

          <StyledCard>
            <Filters>
              <Input
                placeholder="Search by email or name"
                prefix={<SearchOutlined />}
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                style={{ width: 300 }}
                allowClear
              />
              <Select
                placeholder="Filter by role"
                value={filters.role}
                onChange={(role) => setFilters({ ...filters, role })}
                style={{ width: 150 }}
                allowClear
              >
                {Object.values(UserRole).map((role) => (
                  <Option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Option>
                ))}
              </Select>
              <Select
                placeholder="Filter by status"
                value={filters.status}
                onChange={(status) => setFilters({ ...filters, status })}
                style={{ width: 150 }}
                allowClear
              >
                {Object.values(UserStatus).map((status) => (
                  <Option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Option>
                ))}
              </Select>
            </Filters>

            <Table
              columns={columns}
              dataSource={users}
              loading={loading}
              rowKey="id"
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} users`,
              }}
            />
          </StyledCard>

          <Modal
            title="Edit User"
            open={editModalVisible}
            onOk={handleUpdateUser}
            onCancel={() => setEditModalVisible(false)}
            okText="Save"
          >
            {selectedUser && (
              <div style={{ marginBottom: 16 }}>
                <strong>Email:</strong> {selectedUser.email}
                <br />
                <strong>Name:</strong>{' '}
                {selectedUser.firstName && selectedUser.lastName
                  ? `${selectedUser.firstName} ${selectedUser.lastName}`
                  : '-'}
              </div>
            )}

            <Form form={form} layout="vertical">
              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: 'Please select a role' }]}
              >
                <Select>
                  {Object.values(UserRole).map((role) => (
                    <Option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select a status' }]}
              >
                <Select>
                  {Object.values(UserStatus).map((status) => (
                    <Option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        </Container>
      </PageLayout>
    </ProtectedRoute>
  );
};

export default UserManagementPage;
