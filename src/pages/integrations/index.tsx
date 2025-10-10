import { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Tag, Modal, message } from 'antd';
import {  ApiOutlined, SyncOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PageLayout } from '@/components/layouts/PageLayout';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';

interface Integration {
  id: number;
  provider: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
}

export default function IntegrationsPage() {
  const { token } = useAuth();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    setLoading(true);
    try {
      // Mock data
      const mockIntegrations: Integration[] = [
        { id: 1, provider: 'TikTok', status: 'connected', lastSync: '2025-10-09T12:00:00Z' },
        { id: 2, provider: 'Shopee', status: 'disconnected', lastSync: undefined },
        { id: 3, provider: 'Google Analytics', status: 'connected', lastSync: '2025-10-09T10:00:00Z' },
        { id: 4, provider: 'POS System', status: 'error', lastSync: '2025-10-08T15:00:00Z' },
        { id: 5, provider: 'Instagram', status: 'connected', lastSync: '2025-10-09T11:30:00Z' }
      ];
      setIntegrations(mockIntegrations);
    } catch (error) {
      message.error('Failed to fetch integrations');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (provider: string) => {
    try {
      await axios.post(
        '/api/integrations/connect',
        { provider },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(`${provider} connected successfully`);
      fetchIntegrations();
    } catch (error) {
      message.error(`Failed to connect ${provider}`);
    }
  };

  const handleSync = async (id: number, provider: string) => {
    try {
      await axios.post(
        `/api/integrations/${id}/sync`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(`${provider} sync initiated`);
      fetchIntegrations();
    } catch (error) {
      message.error('Sync failed');
    }
  };

  const handleDelete = (id: number, provider: string) => {
    Modal.confirm({
      title: `Disconnect ${provider}?`,
      content: 'This will remove the integration and stop data syncing.',
      onOk: async () => {
        try {
          await axios.delete(`/api/integrations/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          message.success(`${provider} disconnected`);
          fetchIntegrations();
        } catch (error) {
          message.error('Failed to disconnect');
        }
      }
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'error':
        return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
      default:
        return <CloseCircleOutlined style={{ color: '#d9d9d9' }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'success';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  return (
    <ProtectedRoute allowedRoles={['Admin', 'Owner', 'Analyst']}>
      <PageLayout>
        <div style={{ padding: '24px' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '24px' }}>
            <ApiOutlined /> Integrations
          </h1>

          <Row gutter={[16, 16]}>
            {integrations.map((integration) => (
              <Col xs={24} sm={12} lg={8} key={integration.id}>
                <Card
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {getStatusIcon(integration.status)}
                      {integration.provider}
                    </div>
                  }
                  extra={
                    <Badge
                      status={getStatusColor(integration.status) as any}
                      text={integration.status}
                    />
                  }
                  actions={[
                    integration.status === 'connected' ? (
                      <Button
                        type="text"
                        icon={<SyncOutlined />}
                        onClick={() => handleSync(integration.id, integration.provider)}
                      >
                        Sync
                      </Button>
                    ) : (
                      <Button
                        type="text"
                        onClick={() => handleConnect(integration.provider)}
                      >
                        Connect
                      </Button>
                    ),
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(integration.id, integration.provider)}
                    >
                      Delete
                    </Button>
                  ]}
                >
                  {integration.lastSync ? (
                    <div>
                      <small style={{ color: '#888' }}>Last synced:</small>
                      <div>{new Date(integration.lastSync).toLocaleString()}</div>
                    </div>
                  ) : (
                    <div style={{ color: '#888' }}>Never synced</div>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}


