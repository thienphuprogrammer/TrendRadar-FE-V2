import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'orange';
  loading?: boolean;
  onClick?: () => void;
}

const colorSchemes = {
  blue: {
    gradient: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
    light: 'rgba(14, 165, 233, 0.1)',
    icon: '#0ea5e9',
  },
  green: {
    gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
    light: 'rgba(34, 197, 94, 0.1)',
    icon: '#22c55e',
  },
  yellow: {
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    light: 'rgba(245, 158, 11, 0.1)',
    icon: '#f59e0b',
  },
  red: {
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    light: 'rgba(239, 68, 68, 0.1)',
    icon: '#ef4444',
  },
  purple: {
    gradient: 'linear-gradient(135deg, #a855f7, #9333ea)',
    light: 'rgba(168, 85, 247, 0.1)',
    icon: '#a855f7',
  },
  orange: {
    gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
    light: 'rgba(249, 115, 22, 0.1)',
    icon: '#f97316',
  },
};

const CardWrapper = styled(motion.div)<{ $clickable: boolean }>`
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  padding: 24px;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: ${props => props.color ? colorSchemes[props.color].light : 'transparent'};
    border-radius: 50%;
    transform: translate(30%, -30%);
    opacity: 0.5;
  }

  &:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-4px);
    border-color: ${props => props.color ? colorSchemes[props.color].icon : 'var(--border-secondary)'};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const IconWrapper = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => colorSchemes[props.$color].gradient};
  color: white;
  font-size: 24px;
  box-shadow: 0 4px 12px ${props => colorSchemes[props.$color].light};
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: var(--text-tertiary);
  margin-bottom: 8px;
`;

const Value = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 12px;
`;

const TrendWrapper = styled.div<{ $isPositive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.$isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${props => props.$isPositive ? '#16a34a' : '#dc2626'};

  .anticon {
    font-size: 14px;
  }
`;

const LoadingSkeleton = styled.div`
  width: 100%;
  height: 100px;
  background: linear-gradient(
    90deg,
    var(--bg-tertiary) 25%,
    var(--bg-hover) 50%,
    var(--bg-tertiary) 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s ease-in-out infinite;
  border-radius: 8px;

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

export default function StatsCard({
  title,
  value,
  icon,
  trend,
  color = 'blue',
  loading = false,
  onClick,
}: StatsCardProps) {
  if (loading) {
    return (
      <CardWrapper
        $clickable={false}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <LoadingSkeleton />
      </CardWrapper>
    );
  }

  return (
    <CardWrapper
      $clickable={!!onClick}
      color={color}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={onClick ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
    >
      <CardHeader>
        <div>
          <Title>{title}</Title>
          <Value>{value}</Value>
          {trend && (
            <TrendWrapper $isPositive={trend.isPositive}>
              {trend.isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              {Math.abs(trend.value)}%
            </TrendWrapper>
          )}
        </div>
        {icon && (
          <IconWrapper $color={color}>
            {icon}
          </IconWrapper>
        )}
      </CardHeader>
    </CardWrapper>
  );
}
