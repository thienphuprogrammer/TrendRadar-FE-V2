import Link from 'next/link';
import { motion } from 'framer-motion';
import * as Icons from '@ant-design/icons';
import { Tag } from 'antd';

interface NavItemProps {
  icon: string;
  label: string;
  path: string;
  active: boolean;
  badge?: string;
  onClick?: () => void;
}

export default function NavItem({
  icon,
  label,
  path,
  active,
  badge,
  onClick,
}: NavItemProps) {
  // @ts-ignore - Dynamic icon loading
  const IconComponent = Icons[icon] || Icons.AppstoreOutlined;

  const content = (
    <motion.div
      whileHover={{ x: 4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
        transition-all duration-200 relative overflow-hidden group
        ${
          active
            ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 shadow-sm border border-blue-200'
            : 'text-gray-700 hover:bg-gray-50'
        }
      `}
      onClick={onClick}
    >
      {/* Active indicator */}
      {active && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r"
          initial={false}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}

      {/* Icon */}
      <div
        className={`
        flex items-center justify-center w-8 h-8 rounded-lg
        transition-all duration-200
        ${
          active
            ? 'bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600'
            : 'bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600'
        }
      `}
      >
        <IconComponent className="text-base" />
      </div>

      {/* Label */}
      <span
        className={`flex-1 text-sm font-medium ${active ? 'font-semibold' : ''}`}
      >
        {label}
      </span>

      {/* Badge */}
      {badge && (
        <Tag
          color={badge === 'Beta' ? 'blue' : 'gold'}
          style={{
            fontSize: '9px',
            padding: '0 6px',
            lineHeight: '16px',
            fontWeight: 600,
          }}
        >
          {badge}
        </Tag>
      )}
    </motion.div>
  );

  return path ? (
    <Link href={path} style={{ textDecoration: 'none' }}>
      {content}
    </Link>
  ) : (
    content
  );
}
