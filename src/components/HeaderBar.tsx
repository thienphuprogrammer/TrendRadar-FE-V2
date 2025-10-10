import { useRouter } from 'next/router';
import { Button, Layout, Space } from 'antd';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import LogoBar from '@/components/LogoBar';
import { Path } from '@/utils/enum';
import Deploy from '@/components/deploy/Deploy';

// Dynamic import to avoid SSR hydration issues
const ThemeToggle = dynamic(() => import('@/components/ThemeToggle'), {
  ssr: false,
  loading: () => <div style={{ width: '60px', height: '30px' }} />,
});

const { Header } = Layout;

const StyledButton = styled(Button)<{ $isHighlight: boolean }>`
  background: ${(props) =>
    props.$isHighlight ? 'var(--accent-gradient)' : 'transparent'};
  font-weight: ${(props) => (props.$isHighlight ? '600' : '500')};
  border: ${(props) =>
    props.$isHighlight
      ? '1px solid rgba(16, 185, 129, 0.3)'
      : '1px solid transparent'};
  color: ${(props) => (props.$isHighlight ? 'white' : 'var(--text-secondary)')};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover,
  &:focus {
    background: ${(props) =>
      props.$isHighlight ? 'var(--accent-gradient)' : 'var(--bg-hover)'};
    color: ${(props) => (props.$isHighlight ? 'white' : 'var(--accent-600)')};
    border-color: ${(props) =>
      props.$isHighlight
        ? 'rgba(16, 185, 129, 0.4)'
        : 'rgba(16, 185, 129, 0.2)'};
    transform: translateY(-2px);
    box-shadow: ${(props) =>
      props.$isHighlight
        ? '0 8px 20px rgba(16, 185, 129, 0.3)'
        : '0 4px 12px rgba(16, 185, 129, 0.15)'};

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-1px) scale(0.98);
  }
`;

const StyledHeader = styled(Header)`
  height: 64px;
  border-bottom: 1px solid var(--border-primary);
  background: var(--bg-primary);
  padding: 16px 24px;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(16, 185, 129, 0.2) 50%,
      transparent 100%
    );
  }

  .dark & {
    background: var(--bg-secondary);
    box-shadow: var(--shadow-lg);
  }
`;

export default function HeaderBar() {
  const router = useRouter();
  const { pathname } = router;
  const showNav = !pathname.startsWith(Path.Onboarding);
  const isModeling = pathname.startsWith(Path.Modeling);

  return (
    <StyledHeader>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="d-flex justify-space-between align-center"
      >
        <Space size={[48, 0]}>
          <LogoBar />
          {showNav && (
            <Space size={[16, 0]}>
              <StyledButton
                shape="round"
                size="small"
                $isHighlight={pathname.startsWith(Path.Home)}
                onClick={() => router.push(Path.Home)}
                data-testid="nav-home-button"
              >
                Home
              </StyledButton>
              <StyledButton
                shape="round"
                size="small"
                $isHighlight={pathname.startsWith(Path.Modeling)}
                onClick={() => router.push(Path.Modeling)}
                data-testid="nav-modeling-button"
              >
                Modeling
              </StyledButton>
              <StyledButton
                shape="round"
                size="small"
                $isHighlight={pathname.startsWith(Path.Knowledge)}
                onClick={() => router.push(Path.KnowledgeQuestionSQLPairs)}
                data-testid="nav-knowledge-button"
              >
                Knowledge
              </StyledButton>
              <StyledButton
                shape="round"
                size="small"
                $isHighlight={pathname.startsWith(Path.APIManagement)}
                onClick={() => router.push(Path.APIManagementHistory)}
                data-testid="nav-api-button"
              >
                API
              </StyledButton>
            </Space>
          )}
        </Space>
        <Space size={[16, 0]}>
          {isModeling && <Deploy />}
          <ThemeToggle />
        </Space>
      </motion.div>
    </StyledHeader>
  );
}
