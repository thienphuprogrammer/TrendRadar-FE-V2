/**
 * Theme Toggle Component
 * Switch between light and dark modes
 */

import React from 'react';
import { Switch, Tooltip } from 'antd';
import { BulbFilled, BulbOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useTheme } from '@/contexts/ThemeContext';

const ToggleContainer = styled.div<{
  children?: React.ReactNode;
  role?: string;
  'aria-label'?: string;
}>`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconWrapper = styled.span<{
  children?: React.ReactNode;
  className?: string;
  'aria-hidden'?: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: color 0.3s;

  &.active {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

interface ThemeToggleProps {
  showLabel?: boolean;
  size?: 'small' | 'default';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  showLabel = false,
  size = 'default',
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Tooltip title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
      <ToggleContainer role="group" aria-label="Theme toggle">
        <IconWrapper className={!isDark ? 'active' : ''} aria-hidden="true">
          <BulbFilled />
        </IconWrapper>
        <Switch
          checked={isDark}
          onChange={toggleTheme}
          size={size}
          checkedChildren={showLabel ? 'Dark' : undefined}
          unCheckedChildren={showLabel ? 'Light' : undefined}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        />
        <IconWrapper className={isDark ? 'active' : ''} aria-hidden="true">
          <BulbOutlined />
        </IconWrapper>
      </ToggleContainer>
    </Tooltip>
  );
};

export default ThemeToggle;
