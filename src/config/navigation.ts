import type { Role } from '@/apollo/server/rbac/permissions';

export interface NavItem {
  key: string;
  label: string;
  path: string;
  roles: Role[] | 'All';
  icon: string;
  children?: NavItem[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    roles: 'All',
    icon: 'DashboardOutlined'
  },
  {
    key: 'trends',
    label: 'Trend Explorer',
    path: '/trends/explorer',
    roles: 'All',
    icon: 'LineChartOutlined'
  },
  {
    key: 'actions',
    label: 'Action Center',
    path: '/actions',
    roles: ['Admin', 'Owner', 'Analyst'],
    icon: 'ThunderboltOutlined'
  },
  {
    key: 'chatbot',
    label: 'Trend Chatbot',
    path: '/chatbot',
    roles: 'All',
    icon: 'CommentOutlined'
  },
  {
    key: 'datalab',
    label: 'Data Lab',
    path: '/data-lab',
    roles: ['Admin', 'Owner', 'Analyst'],
    icon: 'ExperimentOutlined'
  },
  {
    key: 'content',
    label: 'Content Studio',
    path: '/content/studio',
    roles: ['Admin', 'Owner', 'Analyst'],
    icon: 'EditOutlined'
  },
  {
    key: 'reports',
    label: 'Reports & Export',
    path: '/reports',
    roles: 'All',
    icon: 'FileTextOutlined'
  },
  {
    key: 'notifications',
    label: 'Notifications',
    path: '/notifications',
    roles: 'All',
    icon: 'BellOutlined'
  },
  {
    key: 'integrations',
    label: 'Integrations',
    path: '/integrations',
    roles: ['Admin', 'Owner', 'Analyst'],
    icon: 'ApiOutlined'
  },
  {
    key: 'settings',
    label: 'Settings',
    path: '/settings',
    roles: 'All',
    icon: 'SettingOutlined'
  },
  {
    key: 'admin',
    label: 'Admin',
    path: '/admin',
    roles: ['Admin', 'Owner'],
    icon: 'ToolOutlined',
    children: [
      {
        key: 'admin-users',
        label: 'User Management',
        path: '/admin/users',
        roles: ['Admin'],
        icon: 'TeamOutlined'
      },
      {
        key: 'admin-billing',
        label: 'Billing & Plan',
        path: '/admin/billing',
        roles: ['Admin', 'Owner'],
        icon: 'CreditCardOutlined'
      },
      {
        key: 'admin-audit',
        label: 'Audit Log',
        path: '/admin/audit',
        roles: ['Admin'],
        icon: 'FileSearchOutlined'
      }
    ]
  }
];

/**
 * Check if a user has access to a nav item based on role
 */
export function hasNavAccess(userRole: Role, allowedRoles: Role[] | 'All'): boolean {
  if (allowedRoles === 'All') {
    return true;
  }
  return allowedRoles.includes(userRole);
}

/**
 * Filter nav items by user role
 */
export function filterNavByRole(items: NavItem[], userRole: Role): NavItem[] {
  return items
    .filter((item) => hasNavAccess(userRole, item.roles))
    .map((item) => {
      if (item.children) {
        return {
          ...item,
          children: filterNavByRole(item.children, userRole)
        };
      }
      return item;
    })
    .filter((item) => !item.children || item.children.length > 0);
}


