import { Avatar, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import type { User } from '@/hooks/useAuth';

interface UserProfileProps {
  user: User | null;
}

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'Admin':
      return '#f5222d';
    case 'Owner':
      return '#fa8c16';
    case 'Analyst':
      return '#1890ff';
    case 'Viewer':
      return '#52c41a';
    default:
      return '#d9d9d9';
  }
};

export default function UserProfile({ user }: UserProfileProps) {
  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-4 border-b border-gray-200"
      style={{
        background:
          'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="flex items-center gap-3">
        <Avatar
          size={48}
          icon={<UserOutlined />}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
          }}
        >
          {user.name.charAt(0).toUpperCase()}
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-900 truncate">
            {user.name}
          </div>
          <div className="text-xs text-gray-500 truncate">{user.email}</div>
          <Tag
            color={getRoleBadgeColor(user.role)}
            style={{
              marginTop: '4px',
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {user.role}
          </Tag>
        </div>
      </div>
    </motion.div>
  );
}
