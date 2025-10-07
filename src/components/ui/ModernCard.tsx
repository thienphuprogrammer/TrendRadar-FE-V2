/**
 * Modern Card Component
 * Beautiful card with hover effects and modern design
 */

import React, { ReactNode } from 'react';
import styled from 'styled-components';

const CardWrapper = styled.div<{ $hoverable?: boolean }>`
  background: ${({ theme }) => theme.colors.backgroundPrimary};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid ${({ theme }) => theme.colors.borderLight};

  ${({ $hoverable }) =>
    $hoverable &&
    `
    cursor: pointer;
    &:hover {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }
  `}
`;

const CardHeader = styled.div<{ $borderless?: boolean }>`
  padding: 20px 24px;
  ${({ $borderless, theme }) =>
    !$borderless && `border-bottom: 1px solid ${theme.colors.borderLight};`}
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CardBody = styled.div<{ $padding?: string }>`
  padding: ${({ $padding }) => $padding || '24px'};
`;

const CardFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
`;

interface ModernCardProps {
  children: ReactNode;
  title?: string | ReactNode;
  footer?: ReactNode;
  hoverable?: boolean;
  borderless?: boolean;
  bodyPadding?: string;
  className?: string;
  onClick?: () => void;
}

export const ModernCard: React.FC<ModernCardProps> = ({
  children,
  title,
  footer,
  hoverable = false,
  borderless = false,
  bodyPadding,
  className,
  onClick,
}) => {
  return (
    <CardWrapper $hoverable={hoverable} className={className} onClick={onClick}>
      {title && <CardHeader $borderless={borderless}>{title}</CardHeader>}
      <CardBody $padding={bodyPadding}>{children}</CardBody>
      {footer && <CardFooter>{footer}</CardFooter>}
    </CardWrapper>
  );
};

export default ModernCard;

