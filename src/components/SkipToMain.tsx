/**
 * Skip to Main Content Link
 * Accessibility feature for keyboard navigation
 */

import React from 'react';

export const SkipToMain: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="skip-to-main"
      style={{
        position: 'absolute',
        top: '-40px',
        left: 0,
        background: '#8b5cf6',
        color: 'white',
        padding: '8px 16px',
        textDecoration: 'none',
        borderRadius: '0 0 4px 0',
        zIndex: 9999,
        fontWeight: 500,
      }}
      onFocus={(e) => {
        e.currentTarget.style.top = '0';
      }}
      onBlur={(e) => {
        e.currentTarget.style.top = '-40px';
      }}
    >
      Skip to main content
    </a>
  );
};

export default SkipToMain;
