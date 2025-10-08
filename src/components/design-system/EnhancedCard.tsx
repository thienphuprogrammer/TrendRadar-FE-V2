import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface EnhancedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  gradient?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const StyledCard = styled(motion.div)<{ $hoverable?: boolean; $gradient?: boolean }>`
  background: ${props => props.$gradient 
    ? 'linear-gradient(135deg, var(--primary-50) 0%, var(--bg-primary) 100%)'
    : 'var(--bg-primary)'};
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
  cursor: ${props => props.$hoverable ? 'pointer' : 'default'};
  
  .dark & {
    background: ${props => props.$gradient 
      ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, var(--bg-primary) 100%)'
      : 'var(--bg-primary)'};
  }

  ${props => props.$hoverable && `
    &:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-4px);
      border-color: var(--primary-500);
    }
  `}
`;

export default function EnhancedCard({
  children,
  className = '',
  hoverable = false,
  gradient = false,
  onClick,
  style,
}: EnhancedCardProps) {
  return (
    <StyledCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={hoverable ? { scale: 1.02 } : {}}
      className={className}
      $hoverable={hoverable}
      $gradient={gradient}
      onClick={onClick}
      style={style}
    >
      {children}
    </StyledCard>
  );
}
