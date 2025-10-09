import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Button, Empty } from 'antd';
import { ReloadOutlined, WarningOutlined } from '@ant-design/icons';

interface ErrorFallbackProps {
  error?: Error | string;
  onRetry?: () => void;
  title?: string;
  description?: string;
  showDetails?: boolean;
}

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  min-height: 300px;
  background: var(--bg-secondary);
  border-radius: 12px;
  text-align: center;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  margin-bottom: 24px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  font-size: 36px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 12px;
`;

const Description = styled.p`
  font-size: 14px;
  color: var(--text-tertiary);
  margin: 0 0 24px;
  max-width: 400px;
`;

const ErrorDetails = styled.details`
  margin-top: 16px;
  padding: 12px;
  background: var(--bg-tertiary);
  border-radius: 6px;
  max-width: 500px;
  text-align: left;

  summary {
    cursor: pointer;
    font-weight: 600;
    color: var(--text-secondary);
    font-size: 12px;
  }

  pre {
    margin-top: 8px;
    font-size: 11px;
    color: var(--text-muted);
    white-space: pre-wrap;
    word-break: break-word;
  }
`;

export default function ErrorFallback({
  error,
  onRetry,
  title = 'Failed to load data',
  description = 'Something went wrong while loading. Please try again.',
  showDetails = false,
}: ErrorFallbackProps) {
  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <IconWrapper>
        <WarningOutlined />
      </IconWrapper>
      <Title>{title}</Title>
      <Description>{description}</Description>
      {onRetry && (
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={onRetry}
          size="large"
        >
          Try Again
        </Button>
      )}
      {showDetails && errorMessage && (
        <ErrorDetails>
          <summary>Error Details</summary>
          <pre>{errorMessage}</pre>
        </ErrorDetails>
      )}
    </Container>
  );
}
