import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DownOutlined } from '@ant-design/icons';
import * as Icons from '@ant-design/icons';

interface NavGroupProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export default function NavGroup({ title, icon, children, defaultExpanded = false }: NavGroupProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  // @ts-ignore - Dynamic icon loading
  const IconComponent = Icons[icon] || Icons.FolderOutlined;

  return (
    <div className="mb-2">
      <motion.div
        whileHover={{ x: 2 }}
        className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-50 transition-all"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <IconComponent className="text-base" />
        <span className="flex-1 text-sm font-semibold">
          {title}
        </span>
        <motion.div
          animate={{ rotate: isExpanded ? 0 : -90 }}
          transition={{ duration: 0.2 }}
        >
          <DownOutlined style={{ fontSize: '10px' }} />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden ml-4 mt-1"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

