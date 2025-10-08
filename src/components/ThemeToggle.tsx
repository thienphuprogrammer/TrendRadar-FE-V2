import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import styled from 'styled-components';

const ToggleButton = styled(motion.button)`
  position: relative;
  width: 60px;
  height: 30px;
  border-radius: 15px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  overflow: hidden;
  
  &.light {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  }
  
  &.dark {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2);
  }
`;

const ToggleThumb = styled(motion.div)`
  position: absolute;
  top: 3px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <ToggleButton
      className={theme}
      onClick={toggleTheme}
      whileTap={{ scale: 0.95 }}
      data-testid="theme-toggle-button"
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <ToggleThumb
        animate={{
          x: theme === 'dark' ? 33 : 3,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        {theme === 'light' ? '☀️' : '🌙'}
      </ToggleThumb>
    </ToggleButton>
  );
}
