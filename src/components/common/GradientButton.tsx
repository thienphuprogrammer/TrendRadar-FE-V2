import React from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from 'antd';
import styled from 'styled-components';

interface GradientButtonProps extends Omit<ButtonProps, 'type'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  gradient?: 'accent' | 'blue' | 'purple';
  size?: 'small' | 'middle' | 'large';
  icon?: React.ReactNode;
  children?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const StyledButton = styled(motion.button)<{
  $variant: string;
  $gradient: string;
  $size: string;
  $loading: boolean;
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  ${props => {
    const sizeStyles = {
      small: {
        padding: '6px 12px',
        fontSize: '12px',
        height: '28px',
      },
      middle: {
        padding: '8px 16px',
        fontSize: '14px',
        height: '36px',
      },
      large: {
        padding: '12px 24px',
        fontSize: '16px',
        height: '44px',
      },
    };
    return sizeStyles[props.$size as keyof typeof sizeStyles];
  }}

  ${props => {
    if (props.$variant === 'primary') {
      const gradients = {
        accent: 'var(--accent-gradient)',
        blue: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
        purple: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      };
      return `
        background: ${gradients[props.$gradient as keyof typeof gradients]};
        color: white;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
      `;
    } else if (props.$variant === 'secondary') {
      return `
        background: var(--bg-primary);
        color: var(--accent-600);
        border: 1px solid var(--accent-300);
      `;
    } else {
      return `
        background: transparent;
        color: var(--text-secondary);
        border: 1px solid transparent;
      `;
    }
  }}

  ${props => props.$loading && `
    cursor: not-allowed;
    opacity: 0.7;
  `}

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover:not(:disabled) {
    ${props => {
      if (props.$variant === 'primary') {
        return `
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
        `;
      } else if (props.$variant === 'secondary') {
        return `
          background: var(--accent-50);
          border-color: var(--accent-400);
          transform: translateY(-1px);
        `;
      } else {
        return `
          background: var(--bg-hover);
          color: var(--text-primary);
        `;
      }
    }}
  }

  &:hover:not(:disabled)::before {
    left: 100%;
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default function GradientButton({
  variant = 'primary',
  gradient = 'accent',
  size = 'middle',
  icon,
  children,
  loading = false,
  disabled = false,
  onClick,
  ...props
}: GradientButtonProps) {
  return (
    <StyledButton
      $variant={variant}
      $gradient={gradient}
      $size={size}
      $loading={loading}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      {...props}
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        icon && <span>{icon}</span>
      )}
      {children}
    </StyledButton>
  );
}
