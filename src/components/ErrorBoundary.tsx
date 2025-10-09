import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Button, Result } from 'antd';
import { ReloadOutlined, HomeOutlined } from '@ant-design/icons';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

const ErrorContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  background: var(--bg-secondary);
`;

const ErrorCard = styled.div`
  max-width: 600px;
  width: 100%;
  padding: 48px;
  background: var(--bg-primary);
  border-radius: 16px;
  box-shadow: var(--shadow-xl);
  text-align: center;

  .error-icon {
    font-size: 64px;
    margin-bottom: 24px;
  }

  .error-title {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 12px;
  }

  .error-message {
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 32px;
    line-height: 1.6;
  }

  .error-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
  }

  .error-details {
    margin-top: 24px;
    padding: 16px;
    background: var(--bg-tertiary);
    border-radius: 8px;
    text-align: left;
    max-height: 200px;
    overflow-y: auto;

    pre {
      margin: 0;
      font-size: 12px;
      color: var(--text-tertiary);
      white-space: pre-wrap;
      word-break: break-word;
    }
  }
`;

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ErrorCard>
            <div className="error-icon">⚠️</div>
            <h1 className="error-title">Something went wrong</h1>
            <p className="error-message">
              We're sorry, but something unexpected happened. Don't worry, your data is safe.
              Try refreshing the page or go back to the home page.
            </p>
            <div className="error-actions">
              <Button
                type="primary"
                size="large"
                icon={<ReloadOutlined />}
                onClick={this.handleReload}
              >
                Reload Page
              </Button>
              <Button
                size="large"
                icon={<HomeOutlined />}
                onClick={this.handleGoHome}
              >
                Go Home
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary style={{ cursor: 'pointer', marginBottom: '8px', fontWeight: 600 }}>
                  Error Details (Development Only)
                </summary>
                <pre>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </ErrorCard>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
