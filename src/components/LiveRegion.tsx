/**
 * Live Region Component
 * For announcing dynamic content to screen readers
 */

import React, { useEffect, useState } from 'react';

interface LiveRegionProps {
  message: string;
  politeness?: 'polite' | 'assertive' | 'off';
  clearAfter?: number;
}

export const LiveRegion: React.FC<LiveRegionProps> = ({
  message,
  politeness = 'polite',
  clearAfter = 5000,
}) => {
  const [currentMessage, setCurrentMessage] = useState(message);

  useEffect(() => {
    setCurrentMessage(message);

    if (clearAfter && message) {
      const timer = setTimeout(() => {
        setCurrentMessage('');
      }, clearAfter);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [message, clearAfter]);

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      style={{
        position: 'absolute',
        left: '-10000px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
    >
      {currentMessage}
    </div>
  );
};

export default LiveRegion;
