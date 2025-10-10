import { useRouter } from 'next/router';
import { Button, Spin } from 'antd';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Path } from '@/utils/enum';
import { LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import { NAV_ITEMS, filterNavByRole } from '@/config/navigation';
import UserProfile from './UserProfile';
import NavigationMenu from './NavigationMenu';
import Home, { Props as HomeSidebarProps } from './Home';
import Modeling, { Props as ModelingSidebarProps } from './Modeling';
import Knowledge from './Knowledge';
import APIManagement from './APIManagement';
import LearningSection from '@/components/learning';

const Layout = styled.div`
  position: relative;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(249, 250, 251, 0.98) 100%
  );
  border-right: 1px solid rgba(229, 231, 235, 0.8);
  box-shadow: 2px 0 20px rgba(0, 0, 0, 0.05);
  overflow-x: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(102, 126, 234, 0.4) 50%,
      transparent 100%
    );
  }
`;

const Content = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px 16px;
  position: relative;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--border-secondary);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--text-muted);
  }
`;

const StyledButton = styled(Button)`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  margin: 6px 12px;
  border-radius: 12px;
  color: var(--text-secondary) !important;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;

  .anticon {
    font-size: 18px;
    transition: all 0.3s ease;
  }

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
      rgba(16, 185, 129, 0.1),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover,
  &:focus {
    background: var(--bg-hover) !important;
    color: var(--accent-600) !important;
    transform: translateX(6px);
    border-color: rgba(16, 185, 129, 0.2);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);

    &::before {
      left: 100%;
    }

    .anticon {
      transform: scale(1.1);
      color: var(--accent-500);
    }
  }

  &:active {
    transform: translateX(4px) scale(0.98);
  }
`;

type Props = (ModelingSidebarProps | HomeSidebarProps) & {
  onOpenSettings?: () => void;
};

export default function Sidebar(props: Props) {
  const { onOpenSettings } = props;
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  const _onSettingsClick = (event) => {
    onOpenSettings && onOpenSettings();
    event.target.blur();
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Check if we're on legacy pages (Home, Modeling, Knowledge, API Management)
  const isLegacyPage =
    router.pathname.startsWith(Path.Home) ||
    router.pathname.startsWith(Path.Modeling) ||
    router.pathname.startsWith(Path.Knowledge) ||
    router.pathname.startsWith(Path.APIManagement);

  // Filter navigation items based on user role
  const filteredNavItems = user ? filterNavByRole(NAV_ITEMS, user.role) : [];

  // Redirect unauthenticated users to login on new pages
  useEffect(() => {
    if (!user && !loading && !isLegacyPage && router.pathname !== '/login') {
      router.push('/login');
    }
  }, [user, loading, isLegacyPage, router]);

  const getSidebarContent = () => {
    if (router.pathname.startsWith(Path.Home)) {
      return <Home {...(props as HomeSidebarProps)} />;
    }

    if (router.pathname.startsWith(Path.Modeling)) {
      return <Modeling {...(props as ModelingSidebarProps)} />;
    }

    if (router.pathname.startsWith(Path.Knowledge)) {
      return <Knowledge />;
    }

    if (router.pathname.startsWith(Path.APIManagement)) {
      return <APIManagement />;
    }

    return null;
  };

  return (
    <Layout className="d-flex flex-column">
      {/* User Profile Section */}
      {user && !isLegacyPage && <UserProfile user={user} />}

      <Content>
        {isLegacyPage ? (
          /* Legacy sidebar content for Home/Modeling/Knowledge/API pages */
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {getSidebarContent()}
          </motion.div>
        ) : (
          /* New modern navigation menu */
          <>
            {loading && (
              <div className="p-4 text-center text-gray-500">
                <Spin size="small" /> Loading...
              </div>
            )}

            {!loading && user && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <NavigationMenu items={filteredNavItems} />
              </motion.div>
            )}
          </>
        )}
      </Content>

      {isLegacyPage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <LearningSection />
        </motion.div>
      )}

      {/* Bottom Actions */}
      <motion.div
        className="border-t border-gray-4 pt-2 mt-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {user && (
          <StyledButton type="text" block onClick={handleLogout}>
            <LogoutOutlined className="text-md" />
            Logout
          </StyledButton>
        )}
      </motion.div>
    </Layout>
  );
}
