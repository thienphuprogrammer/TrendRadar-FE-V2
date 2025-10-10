import { Drawer, Typography, Row, Col, Tag } from 'antd';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { getAbsoluteTime } from '@/utils/time';
import { DrawerAction } from '@/hooks/useDrawerAction';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import JsonCodeBlock from '@/components/code/JsonCodeBlock';
import { ApiHistoryResponse } from '@/apollo/client/graphql/__types__';

const StyledDrawer = styled(Drawer)`
  .ant-drawer-content {
    background: var(--bg-primary);
  }
  
  .ant-drawer-header {
    background: linear-gradient(135deg, 
      rgba(16, 185, 129, 0.05) 0%, 
      rgba(5, 150, 105, 0.05) 100%);
    border-bottom: 1px solid var(--border-primary);
    
    .ant-drawer-title {
      font-size: 20px;
      font-weight: 700;
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
  
  .ant-drawer-body {
    padding: 24px;
  }
`;

const SectionContainer = styled(motion.div)`
  margin-bottom: 32px;
  padding: 20px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--accent-300);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
  }
`;

const SectionTitle = styled(Typography.Text)`
  &.ant-typography {
    display: block !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    color: var(--text-secondary) !important;
    margin-bottom: 12px !important;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const InfoGrid = styled(Row)`
  gap: 16px 0;
`;

const InfoItem = styled(Col)`
  .info-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-tertiary);
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .info-value {
    font-size: 14px;
    color: var(--text-primary);
    font-weight: 500;
  }
`;

const CodeSection = styled.div`
  .code-block {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-primary);
    border-radius: 8px;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 3px;
      height: 100%;
      background: var(--accent-gradient);
    }
  }
`;

type Props = DrawerAction<ApiHistoryResponse> & {
  loading?: boolean;
};

export default function DetailsDrawer(props: Props) {
  const { visible, onClose, defaultValue } = props;

  const {
    threadId,
    apiType,
    createdAt,
    durationMs,
    statusCode,
    headers,
    requestPayload,
    responsePayload,
  } = defaultValue || {};

  const getStatusTag = (status: number) => {
    const isSuccess = status >= 200 && status < 300;
    return (
      <Tag
        icon={isSuccess ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
        color={isSuccess ? 'success' : 'error'}
      >
        {status}
      </Tag>
    );
  };

  return (
    <StyledDrawer
      visible={visible}
      title="API Request Details"
      width={760}
      closable
      destroyOnClose
      onClose={onClose}
      footer={null}
    >
      <SectionContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SectionTitle>Request Information</SectionTitle>
        <InfoGrid>
          <InfoItem xs={24} sm={12}>
            <span className="info-label">API Type</span>
            <div className="info-value">
              <Tag color="blue">{apiType?.toLowerCase()}</Tag>
            </div>
          </InfoItem>
          <InfoItem xs={24} sm={12}>
            <span className="info-label">Thread ID</span>
            <div className="info-value">{threadId || '-'}</div>
          </InfoItem>
          <InfoItem xs={24} sm={12}>
            <span className="info-label">Created At</span>
            <div className="info-value">{getAbsoluteTime(createdAt)}</div>
          </InfoItem>
          <InfoItem xs={24} sm={12}>
            <span className="info-label">Duration</span>
            <div className="info-value">{durationMs} ms</div>
          </InfoItem>
          <InfoItem xs={24} sm={12}>
            <span className="info-label">Status Code</span>
            <div className="info-value">{getStatusTag(statusCode)}</div>
          </InfoItem>
        </InfoGrid>
      </SectionContainer>

      <SectionContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <SectionTitle>Request Headers</SectionTitle>
        <CodeSection>
          <JsonCodeBlock
            code={headers}
            backgroundColor="var(--bg-tertiary)"
            maxHeight="300"
            copyable
          />
        </CodeSection>
      </SectionContainer>

      <SectionContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <SectionTitle>Request Payload</SectionTitle>
        <CodeSection>
          <JsonCodeBlock
            code={requestPayload}
            backgroundColor="var(--bg-tertiary)"
            maxHeight="400"
            copyable
          />
        </CodeSection>
      </SectionContainer>

      <SectionContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <SectionTitle>Response Payload</SectionTitle>
        <CodeSection>
          <JsonCodeBlock
            code={responsePayload}
            backgroundColor="var(--bg-tertiary)"
            maxHeight="400"
            copyable
          />
        </CodeSection>
      </SectionContainer>
    </StyledDrawer>
  );
}
