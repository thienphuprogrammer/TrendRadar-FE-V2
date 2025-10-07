import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Layout, Space } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import LogoBar from '@/components/LogoBar';
import UserMenu from '@/components/UserMenu';
import ThemeToggle from '@/components/ThemeToggle';
import MobileSidebar from '@/components/MobileSidebar';
import { Path } from '@/utils/enum';
import Deploy from '@/components/deploy/Deploy';
import { useIsMobile } from '@/hooks/useMediaQuery';

const { Header } = Layout;

const StyledButton = styled(Button)<{ $isHighlight: boolean }>`
  background: ${(props) =>
    props.$isHighlight ? 'rgba(255, 255, 255, 0.20)' : 'transparent'};
  font-weight: ${(props) => (props.$isHighlight ? '700' : 'normal')};
  border: none;
  color: var(--gray-1);

  &:hover,
  &:focus {
    background: ${(props) =>
      props.$isHighlight
        ? 'rgba(255, 255, 255, 0.20)'
        : 'rgba(255, 255, 255, 0.05)'};
    color: var(--gray-1);
  }
`;

const StyledHeader = styled(Header)`
  height: 48px;
  border-bottom: 1px solid var(--gray-5);
  background: var(--gray-10);
  padding: 10px 16px;
  display: flex;
  align-items: center;
`;

const MobileMenuButton = styled(Button)`
  display: none;

  @media (max-width: 768px) {
    display: inline-flex;
  }
`;

const DesktopNav = styled.nav<{
  children?: React.ReactNode;
  role?: string;
  'aria-label'?: string;
}>`
  @media (max-width: 768px) {
    display: none;
  }
`;

export default function HeaderBar() {
  const router = useRouter();
  const { pathname } = router;
  const showNav = !pathname.startsWith(Path.Onboarding);
  const isModeling = pathname.startsWith(Path.Modeling);
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <StyledHeader role="banner">
        <div
          className="d-flex justify-space-between align-center"
          style={{ marginTop: -2, width: '100%' }}
        >
          <Space size={[16, 0]}>
            {isMobile && showNav && (
              <MobileMenuButton
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              />
            )}
            <LogoBar />
            {showNav && !isMobile && (
              <DesktopNav role="navigation" aria-label="Main navigation">
                <Space size={[16, 0]}>
                  <StyledButton
                    shape="round"
                    size="small"
                    $isHighlight={pathname.startsWith(Path.Home)}
                    onClick={() => router.push(Path.Home)}
                    aria-current={
                      pathname.startsWith(Path.Home) ? 'page' : undefined
                    }
                    aria-label="Navigate to Home"
                  >
                    Home
                  </StyledButton>
                  <StyledButton
                    shape="round"
                    size="small"
                    $isHighlight={pathname.startsWith(Path.Modeling)}
                    onClick={() => router.push(Path.Modeling)}
                    aria-current={
                      pathname.startsWith(Path.Modeling) ? 'page' : undefined
                    }
                    aria-label="Navigate to Modeling"
                  >
                    Modeling
                  </StyledButton>
                  <StyledButton
                    shape="round"
                    size="small"
                    $isHighlight={pathname.startsWith(Path.Knowledge)}
                    onClick={() => router.push(Path.KnowledgeQuestionSQLPairs)}
                    aria-current={
                      pathname.startsWith(Path.Knowledge) ? 'page' : undefined
                    }
                    aria-label="Navigate to Knowledge"
                  >
                    Knowledge
                  </StyledButton>
                  <StyledButton
                    shape="round"
                    size="small"
                    $isHighlight={pathname.startsWith(Path.APIManagement)}
                    onClick={() => router.push(Path.APIManagementHistory)}
                    aria-current={
                      pathname.startsWith(Path.APIManagement)
                        ? 'page'
                        : undefined
                    }
                    aria-label="Navigate to API Management"
                  >
                    API
                  </StyledButton>
                </Space>
              </DesktopNav>
            )}
          </Space>
          <Space size={[16, 0]} role="group" aria-label="User actions">
            {isModeling && <Deploy />}
            <ThemeToggle size="small" />
            <UserMenu />
          </Space>
        </div>
      </StyledHeader>

      {isMobile && (
        <MobileSidebar
          visible={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
