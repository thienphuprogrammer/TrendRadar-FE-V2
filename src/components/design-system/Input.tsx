import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      variant = 'default',
      size = 'md',
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseClasses =
      'w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1';

    const variantClasses = {
      default:
        'border border-secondary-300 rounded-lg bg-white focus:border-primary-500 focus:ring-primary-500',
      filled:
        'border-0 rounded-lg bg-secondary-100 focus:bg-white focus:ring-primary-500 focus:shadow-sm',
      outlined:
        'border-2 border-secondary-300 rounded-lg bg-transparent focus:border-primary-500 focus:ring-primary-500',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-3 text-lg',
    };

    const errorClasses = error
      ? 'border-error-500 focus:border-error-500 focus:ring-error-500'
      : '';

    const iconPaddingClasses = {
      left: leftIcon
        ? size === 'sm'
          ? 'pl-9'
          : size === 'md'
            ? 'pl-10'
            : 'pl-12'
        : '',
      right: rightIcon
        ? size === 'sm'
          ? 'pr-9'
          : size === 'md'
            ? 'pr-10'
            : 'pr-12'
        : '',
    };

    const classes = clsx(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      errorClasses,
      iconPaddingClasses.left,
      iconPaddingClasses.right,
      className,
    );

    const iconSizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    return (
      <div className="w-full">
        {label && (
          <motion.label
            htmlFor={inputId}
            className="block text-sm font-medium text-secondary-700 mb-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}

        <div className="relative">
          {leftIcon && (
            <div
              className={clsx(
                'absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400',
                iconSizeClasses[size],
              )}
            >
              {leftIcon}
            </div>
          )}

          <motion.input
            ref={ref}
            id={inputId}
            className={classes}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            whileFocus={{ scale: 1.01 }}
            {...props}
          />

          {rightIcon && (
            <div
              className={clsx(
                'absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400',
                iconSizeClasses[size],
              )}
            >
              {rightIcon}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <motion.div
            className={clsx(
              'mt-1 text-sm',
              error ? 'text-error-600' : 'text-secondary-500',
            )}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            {error || helperText}
          </motion.div>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
