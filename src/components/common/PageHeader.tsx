import React from 'react';
import { motion } from 'framer-motion';
import { Typography } from 'antd';
import styled from 'styled-components';

const { Title, Text } = Typography;

interface PageHeaderProps {
  icon?: React.ReactNode;
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  badge?: string;
  action?: React.ReactNode;
  className?: string;
}

const HeaderContainer = styled(motion.div)`
  position: relative;
  margin-bottom: 32px;
  padding: 24px 0;
`;

const BadgeContainer = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(16, 185, 129, 0.1);
  color: var(--accent-600);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 24px;

  .badge-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent-500);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;

const IconContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: var(--accent-gradient);
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
  color: white;
  font-size: 28px;
`;

const TitleWrapper = styled.div`
  flex: 1;
`;

const StyledTitle = styled(Title)`
  &.ant-typography {
    margin: 0 !important;
    font-size: 32px !important;
    font-weight: 700 !important;
    background: var(--accent-gradient) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    background-clip: text !important;
    line-height: 1.2 !important;
  }
`;

const DescriptionWrapper = styled(motion.div)`
  margin-bottom: 24px;
`;

const StyledDescription = styled(Text)`
  &.ant-typography {
    font-size: 16px !important;
    color: var(--text-tertiary) !important;
    line-height: 1.6 !important;
    max-width: 600px;
  }
`;

const ActionWrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(135deg, 
    rgba(16, 185, 129, 0.05) 0%, 
    rgba(5, 150, 105, 0.05) 100%);
  z-index: -1;
  border-radius: 0 0 24px 24px;
`;

export default function PageHeader({
  icon,
  title,
  description,
  badge,
  action,
  className,
}: PageHeaderProps) {
  return (
    <HeaderContainer
      className={className}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <BackgroundPattern />
      
      {badge && (
        <BadgeContainer
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <span className="badge-dot" />
          <span>{badge}</span>
        </BadgeContainer>
      )}

      <TitleContainer>
        {icon && (
          <IconContainer
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            {icon}
          </IconContainer>
        )}
        
        <TitleWrapper>
          <StyledTitle level={1}>
            {title}
          </StyledTitle>
        </TitleWrapper>

        {action && (
          <ActionWrapper
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {action}
          </ActionWrapper>
        )}
      </TitleContainer>

      {description && (
        <DescriptionWrapper
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <StyledDescription>
            {description}
          </StyledDescription>
        </DescriptionWrapper>
      )}
    </HeaderContainer>
  );
}
