import { Typography } from 'antd';
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface PageLayoutProps {
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  children: React.ReactNode;
  titleExtra?: string | React.ReactNode;
  icon?: React.ReactNode;
  badge?: string;
}

const PageContainer = styled(motion.div)`
  position: relative;
  min-height: 100vh;
  background: var(--bg-secondary);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 300px;
    background: linear-gradient(
      135deg,
      rgba(16, 185, 129, 0.05) 0%,
      rgba(5, 150, 105, 0.05) 100%
    );
    z-index: 0;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  padding: 24px;
`;

const HeaderSection = styled(motion.div)`
  margin-bottom: 32px;
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
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 16px;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
`;

const IconContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--accent-gradient);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
  color: white;
  font-size: 20px;
`;

const StyledTitle = styled(Typography.Title)`
  &.ant-typography {
    margin: 0 !important;
    font-size: 28px !important;
    font-weight: 700 !important;
    background: var(--accent-gradient) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    background-clip: text !important;
    line-height: 1.2 !important;
  }
`;

const DescriptionContainer = styled(motion.div)`
  margin-bottom: 24px;
`;

const StyledDescription = styled(Typography.Text)`
  &.ant-typography {
    font-size: 16px !important;
    color: var(--text-tertiary) !important;
    line-height: 1.6 !important;
    max-width: 600px;
  }
`;

const ChildrenContainer = styled(motion.div)`
  position: relative;
  z-index: 1;
`;

export function PageLayout(props: PageLayoutProps) {
  const { title, titleExtra, description, children, icon, badge } = props;

  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <ContentWrapper>
        <HeaderSection
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
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

          <TitleRow>
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
              <StyledTitle level={1}>{title}</StyledTitle>
            </TitleContainer>
            {titleExtra && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                {titleExtra}
              </motion.div>
            )}
          </TitleRow>

          {description && (
            <DescriptionContainer
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <StyledDescription>{description}</StyledDescription>
            </DescriptionContainer>
          )}
        </HeaderSection>

        <ChildrenContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          {children}
        </ChildrenContainer>
      </ContentWrapper>
    </PageContainer>
  );
}
