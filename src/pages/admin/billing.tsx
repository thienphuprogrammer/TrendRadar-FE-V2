import { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Table,
  Tag,
  Progress,
  Badge,
} from 'antd';
import {
  CreditCardOutlined,
  RocketOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import ProtectedRoute from '@/components/ProtectedRoute';
import { PageLayout } from '@/components/layouts/PageLayout';

interface UsageMetric {
  key: string;
  metric: string;
  used: number;
  limit: number;
  unit: string;
}

interface PaymentHistory {
  key: string;
  date: string;
  amount: number;
  status: string;
  invoice: string;
}

export default function BillingPage() {
  const [currentPlan] = useState({
    name: 'Professional',
    price: 299,
    billingCycle: 'monthly',
    nextBilling: '2025-11-10',
  });

  const [usage] = useState<UsageMetric[]>([
    {
      key: '1',
      metric: 'API Calls',
      used: 45000,
      limit: 100000,
      unit: 'calls',
    },
    { key: '2', metric: 'Storage', used: 12.5, limit: 50, unit: 'GB' },
    { key: '3', metric: 'Users', used: 8, limit: 25, unit: 'users' },
    { key: '4', metric: 'Dashboards', used: 15, limit: 50, unit: 'dashboards' },
  ]);

  const [paymentHistory] = useState<PaymentHistory[]>([
    {
      key: '1',
      date: '2025-10-10',
      amount: 299,
      status: 'paid',
      invoice: 'INV-2025-10',
    },
    {
      key: '2',
      date: '2025-09-10',
      amount: 299,
      status: 'paid',
      invoice: 'INV-2025-09',
    },
    {
      key: '3',
      date: '2025-08-10',
      amount: 299,
      status: 'paid',
      invoice: 'INV-2025-08',
    },
  ]);

  const usageColumns = [
    {
      title: 'Metric',
      dataIndex: 'metric',
      key: 'metric',
    },
    {
      title: 'Usage',
      key: 'usage',
      render: (_: any, record: UsageMetric) => {
        const percentage = (record.used / record.limit) * 100;
        return (
          <div>
            <div style={{ marginBottom: '4px' }}>
              {record.used.toLocaleString()} / {record.limit.toLocaleString()}{' '}
              {record.unit}
            </div>
            <Progress
              percent={percentage}
              status={
                percentage > 90
                  ? 'exception'
                  : percentage > 70
                    ? 'normal'
                    : 'success'
              }
              showInfo={false}
            />
          </div>
        );
      },
    },
  ];

  const paymentColumns = [
    { title: 'Date', dataIndex: 'date', key: 'date' },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'paid' ? 'success' : 'warning'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Invoice',
      dataIndex: 'invoice',
      key: 'invoice',
      render: (invoice: string) => (
        <Button type="link" size="small">
          Download {invoice}
        </Button>
      ),
    },
  ];

  const plans = [
    {
      name: 'Starter',
      price: 99,
      features: ['10 Users', '25K API Calls', '10 GB Storage', 'Email Support'],
    },
    {
      name: 'Professional',
      price: 299,
      features: [
        '25 Users',
        '100K API Calls',
        '50 GB Storage',
        'Priority Support',
      ],
      current: true,
    },
    {
      name: 'Enterprise',
      price: 999,
      features: [
        'Unlimited Users',
        '1M API Calls',
        '500 GB Storage',
        'Dedicated Support',
      ],
    },
  ];

  return (
    <ProtectedRoute allowedRoles={['Admin', 'Owner']}>
      <PageLayout>
        <div style={{ padding: '24px' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '24px' }}>
            <CreditCardOutlined /> Billing & Plan
          </h1>

          {/* Current Plan */}
          <Card title="Current Plan" style={{ marginBottom: '24px' }}>
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title="Plan"
                  value={currentPlan.name}
                  prefix={<RocketOutlined />}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Monthly Cost"
                  value={currentPlan.price}
                  prefix="$"
                  suffix="/ mo"
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Next Billing"
                  value={currentPlan.nextBilling}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Status"
                  value="Active"
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<CheckCircleOutlined />}
                />
              </Col>
            </Row>
          </Card>

          {/* Usage Metrics */}
          <Card title="Usage Overview" style={{ marginBottom: '24px' }}>
            <Table
              columns={usageColumns}
              dataSource={usage}
              pagination={false}
            />
          </Card>

          {/* Available Plans */}
          <Card title="Available Plans" style={{ marginBottom: '24px' }}>
            <Row gutter={16}>
              {plans.map((plan) => (
                <Col xs={24} md={8} key={plan.name}>
                  <Card
                    style={{
                      textAlign: 'center',
                      border: plan.current ? '2px solid #1890ff' : undefined,
                    }}
                  >
                    {plan.current && (
                      <Badge.Ribbon text="Current Plan" color="blue">
                        <div style={{ height: '20px' }} />
                      </Badge.Ribbon>
                    )}
                    <h3>{plan.name}</h3>
                    <div style={{ fontSize: '32px', margin: '16px 0' }}>
                      <strong>${plan.price}</strong>
                      <span style={{ fontSize: '16px', color: '#888' }}>
                        /mo
                      </span>
                    </div>
                    <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
                      {plan.features.map((feature, idx) => (
                        <li key={idx} style={{ marginBottom: '8px' }}>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      type={plan.current ? 'default' : 'primary'}
                      block
                      style={{ marginTop: '16px' }}
                      disabled={plan.current}
                    >
                      {plan.current ? 'Current Plan' : 'Upgrade'}
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          {/* Payment History */}
          <Card title="Payment History">
            <Table
              columns={paymentColumns}
              dataSource={paymentHistory}
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}
