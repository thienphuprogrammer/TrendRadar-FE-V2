import React, { ReactNode } from 'react';
import { ApolloError } from '@apollo/client';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Button, Alert, Empty } from 'antd';
import { ReloadOutlined, WarningOutlined } from '@ant-design/icons';
import { handleGraphQLError } from '@/utils/errorHandling';

interface QueryErrorBoundaryProps {
  children: ReactNode;
  error?: ApolloError | Error | null;
  loading?: boolean;
  hasData?: boolean;
  fallback?: ReactNode;
  retry?: () => void;
  showRetry?: boolean;
  emptyMessage?: string;
  errorMessage?: string;
  silent?: boolean; // New prop to control silent mode
}

const ErrorContainer = styled(motion.div)`
  padding: 48px 24px;
  text-align: center;
`;

const StyledAlert = styled(Alert)`
  &&.ant-alert {
    background: var(--bg-primary);
    border-color: var(--border-primary);
    
    .ant-alert-message {
      color: var(--text-primary);
    }
    
    .ant-alert-description {
      color: var(--text-secondary);
    }
  }
`;

const RetryButton = styled(Button)`
  margin-top: 16px;
`;

const EmptyContainer = styled.div`
  padding: 48px 24px;
`;

/**
 * QueryErrorBoundary - Handles GraphQL query errors and empty states gracefully
 * 
 * @param children - Content to render when no error
 * @param error - Error object from Apollo or other sources
 * @param loading - Loading state
 * @param hasData - Whether data exists (for empty state)
 * @param fallback - Custom fallback component
 * @param retry - Retry function
 * @param showRetry - Whether to show retry button
 * @param emptyMessage - Custom message for empty state
 * @param errorMessage - Custom error message
 * 
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useQuery(QUERY);
 * 
 * return (
 *   <QueryErrorBoundary
 *     error={error}
 *     loading={loading}
 *     hasData={data?.items?.length > 0}
 *     retry={refetch}
 *     emptyMessage="No items found"
 *   >
 *     <ItemsList items={data.items} />
 *   </QueryErrorBoundary>
 * );
 * ```
 */
export default function QueryErrorBoundary({
  children,
  error,
  loading = false,
  hasData = true,
  fallback,
  retry,
  showRetry = true,
  emptyMessage = 'No data available',
  errorMessage,
  silent = true, // Silent by default
}: QueryErrorBoundaryProps) {
  // Show loading state
  if (loading) {
    return <>{children}</>;
  }

  // Show error state
  if (error) {
    // Use custom fallback if provided
    if (fallback) {
      return <>{fallback}</>;
    }

    // Silent mode - just render children with default data
    if (silent) {
      if (process.env.NODE_ENV === 'development') {
        const errorInfo = handleGraphQLError(error);
        console.error('QueryErrorBoundary silent error:', errorInfo.message);
      }
      return <>{children}</>;
    }

    // Non-silent mode - show error UI
    const errorInfo = handleGraphQLError(error);
    const displayMessage = errorMessage || errorInfo.message;

    return (
      <ErrorContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <StyledAlert
          message="Unable to Load Data"
          description={displayMessage}
          type="warning"
          icon={<WarningOutlined />}
          showIcon
        />
        {showRetry && retry && (
          <RetryButton
            type="primary"
            icon={<ReloadOutlined />}
            onClick={retry}
          >
            Retry
          </RetryButton>
        )}
      </ErrorContainer>
    );
  }

  // Show empty state
  if (!hasData) {
    return (
      <EmptyContainer>
        <Empty
          description={emptyMessage}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </EmptyContainer>
    );
  }

  // Show children if everything is ok
  return <>{children}</>;
}

/**
 * InlineErrorBoundary - Compact error display for inline use
 */
export const InlineErrorBoundary = styled.div`
  padding: 12px 16px;
  background: rgba(255, 193, 7, 0.1);
  border-left: 3px solid #ffc107;
  border-radius: 4px;
  color: var(--text-secondary);
  font-size: 14px;
  margin: 12px 0;
  
  .dark & {
    background: rgba(255, 193, 7, 0.05);
  }
`;

/**
 * SilentErrorBoundary - Catches errors but shows children with default data
 * Use when you want the UI to continue rendering even if queries fail
 */
interface SilentErrorBoundaryProps {
  children: ReactNode;
  error?: any;
  fallbackContent?: ReactNode;
  logErrors?: boolean;
}

export function SilentErrorBoundary({
  children,
  error,
  fallbackContent,
  logErrors = true,
}: SilentErrorBoundaryProps) {
  if (error) {
    if (logErrors) {
      console.warn('SilentErrorBoundary caught error:', error);
    }
    
    if (fallbackContent) {
      return <>{fallbackContent}</>;
    }
  }

  return <>{children}</>;
}
