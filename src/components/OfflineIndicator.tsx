import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { Alert } from 'antd';
import { WifiOutlined, CloudServerOutlined } from '@ant-design/icons';

interface OfflineIndicatorProps {
  isOffline?: boolean;
  message?: string;
  type?: 'offline' | 'degraded' | 'limited';
  autoHide?: boolean;
  hideDelay?: number;
}

const Container = styled(motion.div)`
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 1000;
  max-width: 400px;
`;

const StyledAlert = styled(Alert)`
  &&.ant-alert {
    border-radius: 8px;
    box-shadow: var(--shadow-lg);
    backdrop-filter: blur(10px);
    
    .ant-alert-message {
      font-weight: 600;
    }
  }
`;

const defaultMessages = {
  offline: {
    message: 'Working Offline',
    description: 'Using cached data. Connect to internet for full features.',
    icon: <WifiOutlined />,
    type: 'warning' as const,
  },
  degraded: {
    message: 'Limited Connectivity',
    description: 'Some services are unavailable. Using fallback data.',
    icon: <CloudServerOutlined />,
    type: 'info' as const,
  },
  limited: {
    message: 'Reduced Functionality',
    description: 'Using default data. Some features may be limited.',
    icon: <CloudServerOutlined />,
    type: 'info' as const,
  },
};

/**
 * OfflineIndicator - Shows a banner when the app is using fallback/cached data
 * 
 * @param isOffline - Whether the app is in offline/degraded mode
 * @param message - Custom message to display
 * @param type - Type of degradation (offline, degraded, limited)
 * @param autoHide - Whether to auto-hide after a delay
 * @param hideDelay - Delay before hiding (ms)
 */
export default function OfflineIndicator({
  isOffline = false,
  message,
  type = 'degraded',
  autoHide = true,
  hideDelay = 5000,
}: OfflineIndicatorProps) {
  const [visible, setVisible] = useState(isOffline);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isOffline && !dismissed) {
      setVisible(true);

      if (autoHide) {
        const timer = setTimeout(() => {
          setVisible(false);
        }, hideDelay);

        return () => clearTimeout(timer);
      }
    } else {
      setVisible(false);
    }
  }, [isOffline, autoHide, hideDelay, dismissed]);

  const handleClose = () => {
    setVisible(false);
    setDismissed(true);
  };

  const config = defaultMessages[type];

  return (
    <AnimatePresence>
      {visible && (
        <Container
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <StyledAlert
            message={message || config.message}
            description={config.description}
            type={config.type}
            icon={config.icon}
            closable
            onClose={handleClose}
            showIcon
          />
        </Container>
      )}
    </AnimatePresence>
  );
}

/**
 * Hook to detect network status and API availability
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(true);

  useEffect(() => {
    // Check browser online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // You can extend this to check API health
  // by pinging a health endpoint periodically

  return {
    isOnline,
    apiAvailable,
    isDegraded: !isOnline || !apiAvailable,
  };
}
