/**
 * User Menu Component
 * Displays user avatar and dropdown menu
 */

import React from 'react';
import { useRouter } from 'next/router';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown, Menu, Space, Typography } from 'antd';
import {
  LockOutlined,
  LogoutOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

const { Text } = Typography;

const UserInfo = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
`;

const UserName = styled(Text)`
  display: block;
  font-weight: 500;
  color: #1a1a1a;
`;

const UserEmail = styled(Text)`
  display: block;
  font-size: 12px;
  color: #666;
`;

const StyledAvatar = styled(Avatar)`
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;

const UserMenu: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
  };

  const initials =
    `${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`.toUpperCase() ||
    user.email.charAt(0).toUpperCase();

  const items: MenuProps['items'] = [
    {
      key: 'user-info',
      type: 'group',
      label: (
        <UserInfo>
          <UserName>{user.full_name || user.email}</UserName>
          <UserEmail>{user.email}</UserEmail>
        </UserInfo>
      ),
    },
    { type: 'divider' },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'My Profile',
      onClick: () => router.push('/profile'),
    },
    {
      key: 'security',
      icon: <LockOutlined />,
      label: 'Security',
      onClick: () => router.push('/profile/security'),
    },
    ...(user.role === UserRole.ADMIN
      ? [
          { type: 'divider' as const },
          {
            key: 'admin',
            icon: <TeamOutlined />,
            label: 'User Management',
            onClick: () => router.push('/admin/users'),
          },
        ]
      : []),
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Log Out',
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Dropdown
      overlay={<Menu items={items} />}
      trigger={['click']}
      placement="bottomRight"
    >
      <Space
        style={{ cursor: 'pointer' }}
        role="button"
        tabIndex={0}
        aria-label="User menu"
        aria-haspopup="true"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.currentTarget.click();
          }
        }}
      >
        <StyledAvatar
          size={36}
          style={{ backgroundColor: '#667eea' }}
          aria-label={`User avatar: ${user.email}`}
        >
          {initials}
        </StyledAvatar>
      </Space>
    </Dropdown>
  );
};

export default UserMenu;
