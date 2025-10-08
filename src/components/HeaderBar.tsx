import { useRouter } from 'next/router';
import { Button, Layout, Space } from 'antd';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import LogoBar from '@/components/LogoBar';
import { Path } from '@/utils/enum';
import Deploy from '@/components/deploy/Deploy';
import ThemeToggle from '@/components/ThemeToggle';

const { Header } = Layout;

const StyledButton = styled(Button)<{ $isHighlight: boolean }>`
  background: ${(props) =>
    props.$isHighlight ? 'rgba(14, 165, 233, 0.15)' : 'transparent'};
  font-weight: ${(props) => (props.$isHighlight ? '600' : 'normal')};
  border: ${(props) =>
    props.$isHighlight ? '1px solid rgba(14, 165, 233, 0.3)' : '1px solid transparent'};
  color: ${(props) =>
    props.$isHighlight ? 'var(--primary-600)' : 'var(--text-secondary)'};
  transition: all 0.3s ease;

  &:hover,
  &:focus {
    background: ${(props) =>
      props.$isHighlight
        ? 'rgba(14, 165, 233, 0.2)'
        : 'var(--bg-hover)'};
    color: var(--primary-600);
    border-color: rgba(14, 165, 233, 0.3);
    transform: translateY(-1px);
  }
`;

const StyledHeader = styled(Header)`
  height: 56px;
  border-bottom: 1px solid var(--border-primary);
  background: var(--bg-primary);
  padding: 12px 24px;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  
  .dark & {
    background: var(--bg-secondary);
  }
`;

export default function HeaderBar() {
  const router = useRouter();
  const { pathname } = router;
  const showNav = !pathname.startsWith(Path.Onboarding);
  const isModeling = pathname.startsWith(Path.Modeling);

  return (
    <StyledHeader>
      <div
        className="d-flex justify-space-between align-center"
        style={{ marginTop: -2 }}
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
              >
                Home
              </StyledButton>
              <StyledButton
                shape="round"
                size="small"
                $isHighlight={pathname.startsWith(Path.Modeling)}
                onClick={() => router.push(Path.Modeling)}
              >
                Modeling
              </StyledButton>
              <StyledButton
                shape="round"
                size="small"
                $isHighlight={pathname.startsWith(Path.Knowledge)}
                onClick={() => router.push(Path.KnowledgeQuestionSQLPairs)}
              >
                Knowledge
              </StyledButton>
              <StyledButton
                shape="round"
                size="small"
                $isHighlight={pathname.startsWith(Path.APIManagement)}
                onClick={() => router.push(Path.APIManagementHistory)}
              >
                API
              </StyledButton>
            </Space>
          )}
        </Space>
        {isModeling && (
          <Space size={[16, 0]}>
            <Deploy />
          </Space>
        )}
      </div>
    </StyledHeader>
  );
}
