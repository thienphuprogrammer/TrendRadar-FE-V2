/**
 * Modern Button Component
 * Enhanced button with gradients and animations
 */

import React, { ReactNode } from 'react';
import styled from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth?: boolean;
  $loading?: boolean;
}>`
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};
  white-space: nowrap;

  ${({ $fullWidth }) => $fullWidth && 'width: 100%;'}
  ${({ $loading }) => $loading && 'opacity: 0.6; pointer-events: none;'}

  /* Size variants */
  ${({ $size }) => {
    switch ($size) {
      case 'small':
        return `
          padding: 8px 16px;
          font-size: 13px;
          height: 32px;
        `;
      case 'large':
        return `
          padding: 12px 24px;
          font-size: 16px;
          height: 48px;
        `;
      default:
        return `
          padding: 10px 20px;
          font-size: 14px;
          height: 40px;
        `;
    }
  }}

  /* Style variants */
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryActive} 100%);
          color: white;

          &:hover:not(:disabled) {
            background: linear-gradient(135deg, ${theme.colors.primaryHover} 0%, ${theme.colors.primaryActive} 100%);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
          }

          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
      case 'secondary':
        return `
          background: ${theme.colors.backgroundTertiary};
          color: ${theme.colors.textPrimary};

          &:hover:not(:disabled) {
            background: ${theme.colors.backgroundSecondary};
          }
        `;
      case 'outline':
        return `
          background: transparent;
          border: 2px solid ${theme.colors.borderDefault};
          color: ${theme.colors.textPrimary};

          &:hover:not(:disabled) {
            border-color: ${theme.colors.primary};
            color: ${theme.colors.primary};
            background: ${theme.colors.primaryLight};
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: ${theme.colors.textPrimary};

          &:hover:not(:disabled) {
            background: ${theme.colors.hover};
          }
        `;
      case 'danger':
        return `
          background: ${theme.colors.error};
          color: white;

          &:hover:not(:disabled) {
            background: ${theme.colors.errorHover};
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
          }
        `;
      default:
        return '';
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const LoadingSpinner = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

interface ModernButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const ModernButton: React.FC<ModernButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  onClick,
  type = 'button',
  className,
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $loading={loading}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      className={className}
    >
      {loading && <LoadingSpinner />}
      {!loading && icon}
      {children}
    </StyledButton>
  );
};

export default ModernButton;
