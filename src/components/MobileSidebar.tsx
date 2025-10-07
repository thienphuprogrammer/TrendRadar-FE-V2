/**
 * Mobile Sidebar Component
 * Drawer-based sidebar for mobile devices
 */

import React from 'react';
import { Drawer } from 'antd';
import {
  HomeOutlined,
  DatabaseOutlined,
  BookOutlined,
  ApiOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Path } from '@/utils/enum';

const MenuItem = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 4px;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.textPrimary};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primaryLight : 'transparent'};
  font-weight: ${({ $active }) => ($active ? 500 : 400)};

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
  }

  .anticon {
    font-size: 18px;
  }
`;

const MenuSection = styled.div`
  padding: 8px;
`;

const SectionTitle = styled.div`
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.textTertiary};
  margin-top: 16px;
  margin-bottom: 8px;
`;

interface MobileSidebarProps {
  visible: boolean;
  onClose: () => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ visible, onClose }) => {
  const router = useRouter();
  const { pathname } = router;

  const navigate = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MenuFoldOutlined />
          <span>Menu</span>
        </div>
      }
      placement="left"
      onClose={onClose}
      open={visible}
      width={280}
    >
      <MenuSection>
        <SectionTitle>Main</SectionTitle>
        <MenuItem
          $active={pathname.startsWith(Path.Home)}
          onClick={() => navigate(Path.Home)}
        >
          <HomeOutlined />
          <span>Home</span>
        </MenuItem>
        <MenuItem
          $active={pathname.startsWith(Path.Modeling)}
          onClick={() => navigate(Path.Modeling)}
        >
          <DatabaseOutlined />
          <span>Modeling</span>
        </MenuItem>
        <MenuItem
          $active={pathname.startsWith(Path.Knowledge)}
          onClick={() => navigate(Path.KnowledgeQuestionSQLPairs)}
        >
          <BookOutlined />
          <span>Knowledge</span>
        </MenuItem>
        <MenuItem
          $active={pathname.startsWith(Path.APIManagement)}
          onClick={() => navigate(Path.APIManagementHistory)}
        >
          <ApiOutlined />
          <span>API</span>
        </MenuItem>
      </MenuSection>
    </Drawer>
  );
};

export default MobileSidebar;

