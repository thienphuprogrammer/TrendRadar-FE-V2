import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

export default function LogoBar() {
  const { theme } = useTheme();
  
  // Use different logo based on theme
  const logoSrc = theme === 'dark' 
    ? '/images/logo-white-with-text.svg'
    : '/images/logo-white-with-text.svg'; // Could add dark logo variant here

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
      className="cursor-pointer"
    >
      <Image
        src={logoSrc}
        alt="TrendRadarAI"
        width={125}
        height={30}
        priority
      />
    </motion.div>
  );
}
