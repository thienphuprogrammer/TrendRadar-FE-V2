import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  asChild?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  asChild = false,
  className,
  children,
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary:
      'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 shadow-sm hover:shadow-md',
    secondary:
      'bg-secondary-100 hover:bg-secondary-200 text-secondary-800 focus:ring-secondary-500 border border-secondary-300',
    ghost:
      'bg-transparent hover:bg-secondary-100 text-secondary-700 hover:text-secondary-900 focus:ring-secondary-500',
    danger:
      'bg-error-600 hover:bg-error-700 text-white focus:ring-error-500 shadow-sm hover:shadow-md',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const widthClasses = fullWidth ? 'w-full' : '';

  const classes = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClasses,
    className,
  );

  const iconElement = icon && (
    <motion.span
      className={clsx(
        'flex items-center',
        iconPosition === 'left' ? 'mr-2' : 'ml-2',
      )}
      animate={loading ? { rotate: 360 } : {}}
      transition={{
        duration: 1,
        repeat: loading ? Infinity : 0,
        ease: 'linear',
      }}
    >
      {icon}
    </motion.span>
  );

  const ButtonComponent = asChild ? motion.div : motion.button;

  return (
    <ButtonComponent
      className={classes}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...(asChild ? {} : props)}
    >
      {iconPosition === 'left' && iconElement}
      {loading ? (
        <motion.span
          className="flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <span className="ml-2">Loading...</span>
        </motion.span>
      ) : (
        children
      )}
      {iconPosition === 'right' && iconElement}
    </ButtonComponent>
  );
};

export default Button;
