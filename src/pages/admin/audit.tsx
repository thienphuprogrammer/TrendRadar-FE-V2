import { useState, useEffect } from 'react';
import { Table, Card, Select, DatePicker, Button, Tag, Input } from 'antd';
import { FileSearchOutlined, DownloadOutlined } from '@ant-design/icons';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PageLayout } from '@/components/layouts/PageLayout';
import { useAuth } from '@/hooks/useAuth';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;

interface AuditLog {
  key: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  resourceId?: number;
  details: string;
  ipAddress: string;
}

export default function AuditLogPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    action: 'all',
    resource: 'all',
    dateRange: null as any,
    search: '',
  });

  useEffect(() => {
    fetchAuditLogs();
  }, [filters]);

  const fetchAuditLogs = async () => {
    setLoading(true);
    // Mock data - replace with actual API call
    const mockLogs: AuditLog[] = [
      {
        key: '1',
        timestamp: '2025-10-10 14:30:25',
        user: 'admin@example.com',
        action: 'CREATE',
        resource: 'user',
        resourceId: 5,
        details: 'Created new user: analyst2@example.com',
        ipAddress: '192.168.1.100',
      },
      {
        key: '2',
        timestamp: '2025-10-10 12:15:10',
        user: 'owner@example.com',
        action: 'UPDATE',
        resource: 'integration',
        resourceId: 3,
        details: 'Updated TikTok integration settings',
        ipAddress: '192.168.1.101',
      },
      {
        key: '3',
        timestamp: '2025-10-10 10:45:00',
        user: 'analyst@example.com',
        action: 'EXPORT',
        resource: 'dashboard',
        resourceId: 1,
        details: 'Exported dashboard as PDF',
        ipAddress: '192.168.1.102',
      },
      {
        key: '4',
        timestamp: '2025-10-09 16:20:30',
        user: 'admin@example.com',
        action: 'DELETE',
        resource: 'user',
        resourceId: 4,
        details: 'Deleted user: temp@example.com',
        ipAddress: '192.168.1.100',
      },
      {
        key: '5',
        timestamp: '2025-10-09 09:10:15',
        user: 'owner@example.com',
        action: 'APPLY',
        resource: 'action',
        resourceId: 12,
        details: 'Applied restock suggestion for Product A',
        ipAddress: '192.168.1.101',
      },
    ];
    setLogs(mockLogs);
    setLoading(false);
  };

  const exportToCSV = () => {
    const csv = [
      ['Timestamp', 'User', 'Action', 'Resource', 'Details', 'IP Address'].join(
        ',',
      ),
      ...logs.map((log) =>
        [
          log.timestamp,
          log.user,
          log.action,
          log.resource,
          log.details,
          log.ipAddress,
        ].join(','),
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit_log_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      CREATE: 'green',
      UPDATE: 'blue',
      DELETE: 'red',
      EXPORT: 'orange',
      APPLY: 'purple',
      LOGIN: 'cyan',
      LOGOUT: 'default',
    };
    return colors[action] || 'default';
  };

  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      sorter: (a: AuditLog, b: AuditLog) =>
        a.timestamp.localeCompare(b.timestamp),
      width: 180,
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      width: 200,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 100,
      render: (action: string) => (
        <Tag color={getActionColor(action)}>{action}</Tag>
      ),
    },
    {
      title: 'Resource',
      dataIndex: 'resource',
      key: 'resource',
      width: 120,
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
    },
    {
      title: 'IP Address',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 140,
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
            <h1 style={{ fontSize: '24px', margin: 0 }}>
              <FileSearchOutlined /> Audit Log
            </h1>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={exportToCSV}
            >
              Export CSV
            </Button>
          </div>

          {/* Filters */}
          <Card style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Select
                style={{ width: 150 }}
                value={filters.action}
                onChange={(value) => setFilters({ ...filters, action: value })}
                placeholder="Action"
              >
                <Option value="all">All Actions</Option>
                <Option value="CREATE">CREATE</Option>
                <Option value="UPDATE">UPDATE</Option>
                <Option value="DELETE">DELETE</Option>
                <Option value="EXPORT">EXPORT</Option>
                <Option value="APPLY">APPLY</Option>
              </Select>

              <Select
                style={{ width: 150 }}
                value={filters.resource}
                onChange={(value) =>
                  setFilters({ ...filters, resource: value })
                }
                placeholder="Resource"
              >
                <Option value="all">All Resources</Option>
                <Option value="user">User</Option>
                <Option value="dashboard">Dashboard</Option>
                <Option value="integration">Integration</Option>
                <Option value="action">Action</Option>
              </Select>

              <RangePicker
                value={filters.dateRange}
                onChange={(dates) =>
                  setFilters({ ...filters, dateRange: dates })
                }
              />

              <Search
                placeholder="Search details..."
                style={{ width: 250 }}
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                allowClear
              />
            </div>
          </Card>

          {/* Audit Log Table */}
          <Card>
            <Table
              columns={columns}
              dataSource={logs}
              loading={loading}
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} records`,
              }}
              scroll={{ x: 1200 }}
            />
          </Card>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}
