/**
 * Modern Badge/Tag Component
 * Colorful badges for status indicators
 */

import React, { ReactNode } from 'react';
import styled from 'styled-components';

type BadgeVariant =
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'default';

const StyledBadge = styled.span<{ $variant: BadgeVariant }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  gap: 6px;
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return `
          background: ${theme.colors.primaryLight};
          color: ${theme.colors.primary};
        `;
      case 'success':
        return `
          background: ${theme.colors.successLight};
          color: ${theme.colors.success};
        `;
      case 'warning':
        return `
          background: ${theme.colors.warningLight};
          color: ${theme.colors.warning};
        `;
      case 'error':
        return `
          background: ${theme.colors.errorLight};
          color: ${theme.colors.error};
        `;
      case 'info':
        return `
          background: ${theme.colors.infoLight};
          color: ${theme.colors.info};
        `;
      default:
        return `
          background: ${theme.colors.backgroundTertiary};
          color: ${theme.colors.textSecondary};
        `;
    }
  }}
`;

const Dot = styled.span<{ $variant: BadgeVariant }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return `background: ${theme.colors.primary};`;
      case 'success':
        return `background: ${theme.colors.success};`;
      case 'warning':
        return `background: ${theme.colors.warning};`;
      case 'error':
        return `background: ${theme.colors.error};`;
      case 'info':
        return `background: ${theme.colors.info};`;
      default:
        return `background: ${theme.colors.textSecondary};`;
    }
  }}
`;

interface ModernBadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

export const ModernBadge: React.FC<ModernBadgeProps> = ({
  children,
  variant = 'default',
  dot = false,
  className,
}) => {
  return (
    <StyledBadge $variant={variant} className={className}>
      {dot && <Dot $variant={variant} />}
      {children}
    </StyledBadge>
  );
};

export default ModernBadge;
