import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

export default function LogoBar() {
  const { theme } = useTheme();

  // Use different logo based on theme
  const logoSrc =
    theme === 'dark'
      ? '/images/logo-white-with-text.svg'
      : '/images/logo-dark-with-text.svg'; // Dark logo for light theme

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      whileHover={{
        scale: 1.05,
        filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.3))',
      }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
      style={{
        position: 'relative',
        padding: '4px 8px',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'linear-gradient(135deg, rgba(16, 185, 129, 0.1), transparent)',
          borderRadius: '8px',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        }}
        whileHover={{ opacity: 1 }}
      />
      <Image
        src={logoSrc}
        alt="TrendRadarAI"
        width={125}
        height={30}
        style={{
          height: 'auto',
          filter: theme === 'dark' ? 'none' : 'brightness(0.2)',
          position: 'relative',
          zIndex: 1,
        }}
        priority
      />
    </motion.div>
  );
}
