import { Typography } from 'antd';
import { motion } from 'framer-motion';

interface PageLayoutProps {
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  children: React.ReactNode;
  titleExtra?: string | React.ReactNode;
}

export default function PageLayout(props: PageLayoutProps) {
  const { title, titleExtra, description, children } = props;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="px-6 py-4"
    >
      <div className="d-flex align-center justify-space-between mb-3">
        <Typography.Title 
          level={4} 
          className="text-medium mb-0"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </Typography.Title>
        {titleExtra}
      </div>
      {description && (
        <Typography.Text style={{ color: 'var(--text-secondary)' }}>
          {description}
        </Typography.Text>
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mt-3"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
