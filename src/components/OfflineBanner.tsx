import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { WifiOutlined, CloudOutlined } from '@ant-design/icons';

const Banner = styled(motion.div)`
  position: fixed;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: rgba(245, 158, 11, 0.95);
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 14px;
  font-weight: 500;
  backdrop-filter: blur(8px);

  .icon {
    font-size: 16px;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

interface OfflineBannerProps {
  isOffline?: boolean;
}

export default function OfflineBanner({ isOffline: isOfflineProp }: OfflineBannerProps) {
  const [isOffline, setIsOffline] = useState(isOfflineProp !== undefined ? isOfflineProp : false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if we should show the banner based on prop or browser online status
    const shouldShow = isOfflineProp !== undefined ? isOfflineProp : !navigator.onLine;
    setIsOffline(shouldShow);

    if (shouldShow) {
      setShowBanner(true);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowBanner(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOfflineProp]);

  // Listen to online/offline events if prop is not provided
  useEffect(() => {
    if (isOfflineProp === undefined) {
      const handleOnline = () => {
        setIsOffline(false);
        setShowBanner(false);
      };

      const handleOffline = () => {
        setIsOffline(true);
        setShowBanner(true);
        // Auto-hide after 5 seconds
        setTimeout(() => setShowBanner(false), 5000);
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, [isOfflineProp]);

  return (
    <AnimatePresence>
      {isOffline && showBanner && (
        <Banner
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <CloudOutlined className="icon" />
          <span>Working offline - Using cached data</span>
        </Banner>
      )}
    </AnimatePresence>
  );
}
