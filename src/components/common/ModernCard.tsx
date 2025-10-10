import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface ModernCardProps {
  children: React.ReactNode;
  variant?: 'data' | 'analytics' | 'insights' | 'default';
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  hoverable?: boolean;
  selected?: boolean;
}

const CardContainer = styled(motion.div)<{
  $variant: string;
  $hoverable: boolean;
  $selected: boolean;
}>`
  position: relative;
  padding: 20px;
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  cursor: ${(props) => (props.$hoverable ? 'pointer' : 'default')};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  ${(props) =>
    props.$selected &&
    `
    background: var(--accent-gradient);
    color: white;
    border-color: rgba(16, 185, 129, 0.3);
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.2);
  `}

  ${(props) =>
    props.$hoverable &&
    !props.$selected &&
    `
    &:hover {
      background: var(--bg-hover);
      border-color: var(--accent-300);
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(16, 185, 129, 0.15);
    }
  `}

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${(props) => {
      switch (props.$variant) {
        case 'data':
          return 'var(--accent-gradient)';
        case 'analytics':
          return 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
        case 'insights':
          return 'linear-gradient(135deg, #8b5cf6, #7c3aed)';
        default:
          return 'var(--accent-gradient)';
      }
    }};
    opacity: ${(props) => (props.$selected ? '1' : '0')};
    transition: opacity 0.3s ease;
  }

  ${(props) =>
    props.$hoverable &&
    `
    &:hover::before {
      opacity: 1;
    }
  `}
`;

const GradientOverlay = styled.div<{ $variant: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${(props) => {
    switch (props.$variant) {
      case 'data':
        return 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(16, 185, 129, 0.1) 0%, transparent 70%)';
      case 'analytics':
        return 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59, 130, 246, 0.1) 0%, transparent 70%)';
      case 'insights':
        return 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(139, 92, 246, 0.1) 0%, transparent 70%)';
      default:
        return 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(16, 185, 129, 0.1) 0%, transparent 70%)';
    }
  }};
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 1;
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
`;

export default function ModernCard({
  children,
  variant = 'default',
  onClick,
  className,
  style,
  hoverable = true,
  selected = false,
}: ModernCardProps) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hoverable) return;

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  };

  return (
    <CardContainer
      $variant={variant}
      $hoverable={hoverable}
      $selected={selected}
      className={className}
      style={style}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      whileHover={hoverable ? { scale: 1.02 } : {}}
      whileTap={hoverable ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <GradientOverlay $variant={variant} />
      <Content>{children}</Content>
    </CardContainer>
  );
}
