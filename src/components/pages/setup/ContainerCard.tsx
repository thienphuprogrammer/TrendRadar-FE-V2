import styled from 'styled-components';
import { Card, Steps } from 'antd';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

const Container = styled.div<{ maxWidth?: number }>`
  max-width: ${(props) => props.maxWidth || 1200}px;
  margin: 40px auto;
  padding: 0 24px;
`;

const StyledCard = styled(Card)<{ $isDark: boolean }>`
  && {
    background: ${props => props.$isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)'} !important;
    backdrop-filter: blur(20px);
    border: 1px solid ${props => props.$isDark ? 'rgba(55, 65, 81, 0.3)' : 'rgba(226, 232, 240, 0.3)'} !important;
    border-radius: 24px !important;
    box-shadow: ${props => props.$isDark 
      ? '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(16, 185, 129, 0.1)' 
      : '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(16, 185, 129, 0.05)'} !important;
    overflow: hidden;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(16, 185, 129, 0.3) 50%, 
        transparent 100%);
    }
    
    .ant-card-body {
      background: transparent !important;
      padding: 32px !important;
    }
  }
`;

const ModernSteps = styled(Steps)`
  &.ant-steps {
    margin-bottom: 32px !important;
    
    .ant-steps-item {
      .ant-steps-item-icon {
        width: 40px !important;
        height: 40px !important;
        border-radius: 12px !important;
        background: var(--bg-tertiary) !important;
        border: 2px solid var(--border-primary) !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        
        .ant-steps-icon {
          font-size: 16px !important;
          color: var(--text-secondary) !important;
        }
      }
      
      &.ant-steps-item-active {
        .ant-steps-item-icon {
          background: var(--accent-gradient) !important;
          border-color: var(--accent-500) !important;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3) !important;
          
          .ant-steps-icon {
            color: white !important;
          }
        }
      }
      
      &.ant-steps-item-finish {
        .ant-steps-item-icon {
          background: var(--accent-gradient) !important;
          border-color: var(--accent-500) !important;
          
          .ant-steps-icon {
            color: white !important;
          }
        }
      }
      
      .ant-steps-item-title {
        color: var(--text-primary) !important;
        font-weight: 600 !important;
        font-size: 16px !important;
      }
      
      .ant-steps-item-description {
        color: var(--text-tertiary) !important;
        font-size: 14px !important;
      }
    }
    
    .ant-steps-item-tail {
      &::after {
        background: var(--border-primary) !important;
        height: 2px !important;
        border-radius: 1px !important;
      }
    }
  }
`;

const ContentWrapper = styled(motion.div)`
  position: relative;
  z-index: 1;
`;

interface Props {
  step: number;
  children: React.ReactNode;
  maxWidth?: number;
}

export default function ContainerCard(props: Props) {
  const { step, maxWidth } = props;
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const cardStyle = {
    background: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    borderColor: isDark ? 'rgba(55, 65, 81, 0.3)' : 'rgba(226, 232, 240, 0.3)',
  };

  return (
    <Container maxWidth={maxWidth}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <StyledCard $isDark={isDark} style={cardStyle}>
          <ModernSteps current={step}>
            <Steps.Step 
              title="Connect Data Source" 
              description="Choose your data source or sample dataset"
            />
            <Steps.Step 
              title="Select Tables" 
              description="Choose tables to create data models"
            />
            <Steps.Step 
              title="Define Relationships" 
              description="Set up relationships between models"
            />
          </ModernSteps>
          <ContentWrapper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {props.children}
          </ContentWrapper>
        </StyledCard>
      </motion.div>
    </Container>
  );
}
