import { motion } from 'framer-motion';
import styled from 'styled-components';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
}

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const sizes = {
  sm: 24,
  md: 40,
  lg: 56,
};

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'var(--primary-600)',
  text 
}: LoadingSpinnerProps) {
  const spinnerSize = sizes[size];
  
  return (
    <SpinnerContainer>
      <svg
        width={spinnerSize}
        height={spinnerSize}
        viewBox="0 0 50 50"
        style={{ overflow: 'visible' }}
      >
        <motion.circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0, rotate: 0 }}
          animate={{
            pathLength: [0, 0.8, 0],
            rotate: 360,
          }}
          transition={{
            pathLength: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            },
            rotate: {
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            },
          }}
          strokeDasharray="0 1"
        />
      </svg>
      
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            color: 'var(--text-secondary)',
            fontSize: '14px',
            margin: 0,
          }}
        >
          {text}
        </motion.p>
      )}
    </SpinnerContainer>
  );
}
