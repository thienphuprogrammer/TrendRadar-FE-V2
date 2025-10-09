import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface ColorTagProps {
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'orange' | 'pink' | 'gray';
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outlined' | 'soft';
  icon?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const colorSchemes = {
  blue: {
    solid: { bg: '#0ea5e9', text: '#ffffff', border: '#0ea5e9' },
    outlined: { bg: 'transparent', text: '#0ea5e9', border: '#0ea5e9' },
    soft: { bg: 'rgba(14, 165, 233, 0.1)', text: '#0284c7', border: 'rgba(14, 165, 233, 0.3)' },
  },
  green: {
    solid: { bg: '#22c55e', text: '#ffffff', border: '#22c55e' },
    outlined: { bg: 'transparent', text: '#22c55e', border: '#22c55e' },
    soft: { bg: 'rgba(34, 197, 94, 0.1)', text: '#16a34a', border: 'rgba(34, 197, 94, 0.3)' },
  },
  yellow: {
    solid: { bg: '#f59e0b', text: '#ffffff', border: '#f59e0b' },
    outlined: { bg: 'transparent', text: '#f59e0b', border: '#f59e0b' },
    soft: { bg: 'rgba(245, 158, 11, 0.1)', text: '#d97706', border: 'rgba(245, 158, 11, 0.3)' },
  },
  red: {
    solid: { bg: '#ef4444', text: '#ffffff', border: '#ef4444' },
    outlined: { bg: 'transparent', text: '#ef4444', border: '#ef4444' },
    soft: { bg: 'rgba(239, 68, 68, 0.1)', text: '#dc2626', border: 'rgba(239, 68, 68, 0.3)' },
  },
  purple: {
    solid: { bg: '#a855f7', text: '#ffffff', border: '#a855f7' },
    outlined: { bg: 'transparent', text: '#a855f7', border: '#a855f7' },
    soft: { bg: 'rgba(168, 85, 247, 0.1)', text: '#9333ea', border: 'rgba(168, 85, 247, 0.3)' },
  },
  orange: {
    solid: { bg: '#f97316', text: '#ffffff', border: '#f97316' },
    outlined: { bg: 'transparent', text: '#f97316', border: '#f97316' },
    soft: { bg: 'rgba(249, 115, 22, 0.1)', text: '#ea580c', border: 'rgba(249, 115, 22, 0.3)' },
  },
  pink: {
    solid: { bg: '#ec4899', text: '#ffffff', border: '#ec4899' },
    outlined: { bg: 'transparent', text: '#ec4899', border: '#ec4899' },
    soft: { bg: 'rgba(236, 72, 153, 0.1)', text: '#db2777', border: 'rgba(236, 72, 153, 0.3)' },
  },
  gray: {
    solid: { bg: '#6b7280', text: '#ffffff', border: '#6b7280' },
    outlined: { bg: 'transparent', text: '#6b7280', border: '#6b7280' },
    soft: { bg: 'rgba(107, 114, 128, 0.1)', text: '#4b5563', border: 'rgba(107, 114, 128, 0.3)' },
  },
};

const sizes = {
  sm: { padding: '4px 8px', fontSize: '11px', iconSize: '12px', height: '22px' },
  md: { padding: '6px 12px', fontSize: '13px', iconSize: '14px', height: '28px' },
  lg: { padding: '8px 16px', fontSize: '14px', iconSize: '16px', height: '36px' },
};

const StyledTag = styled(motion.span)<{
  $color: string;
  $variant: string;
  $size: string;
  $hasClose: boolean;
}>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: ${props => sizes[props.$size].padding};
  height: ${props => sizes[props.$size].height};
  font-size: ${props => sizes[props.$size].fontSize};
  font-weight: 600;
  border-radius: 6px;
  background: ${props => colorSchemes[props.$color][props.$variant].bg};
  color: ${props => colorSchemes[props.$color][props.$variant].text};
  border: 1px solid ${props => colorSchemes[props.$color][props.$variant].border};
  transition: all 0.3s ease;
  cursor: ${props => props.$hasClose ? 'default' : 'inherit'};
  white-space: nowrap;

  .tag-icon {
    display: flex;
    align-items: center;
    font-size: ${props => sizes[props.$size].iconSize};
  }

  .tag-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    margin-left: 4px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
    opacity: 0.7;

    &:hover {
      opacity: 1;
      background: rgba(0, 0, 0, 0.1);
      transform: scale(1.2);
    }
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

export default function ColorTag({
  color = 'blue',
  children,
  size = 'md',
  variant = 'soft',
  icon,
  onClose,
  className,
}: ColorTagProps) {
  return (
    <StyledTag
      $color={color}
      $variant={variant}
      $size={size}
      $hasClose={!!onClose}
      className={className}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      whileHover={{ scale: 1.05 }}
    >
      {icon && <span className="tag-icon">{icon}</span>}
      {children}
      {onClose && (
        <span className="tag-close" onClick={onClose}>
          ✕
        </span>
      )}
    </StyledTag>
  );
}
