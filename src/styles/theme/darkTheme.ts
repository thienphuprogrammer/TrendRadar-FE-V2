/**
 * Dark Theme Configuration
 */

import { colors, typography, spacing, borderRadius, shadows, zIndex, transitions } from './tokens';

export const darkTheme = {
  name: 'dark',

  // Colors
  colors: {
    // Primary (slightly lighter for dark mode)
    primary: colors.primary[400],
    primaryHover: colors.primary[300],
    primaryActive: colors.primary[200],
    primaryLight: colors.primary[900],

    // Secondary
    secondary: colors.secondary[400],
    secondaryHover: colors.secondary[300],
    secondaryActive: colors.secondary[200],
    secondaryLight: colors.secondary[900],

    // Semantic
    success: colors.success[400],
    successHover: colors.success[300],
    successLight: colors.success[900],

    warning: colors.warning[400],
    warningHover: colors.warning[300],
    warningLight: colors.warning[900],

    error: colors.error[400],
    errorHover: colors.error[300],
    errorLight: colors.error[900],

    info: colors.info[400],
    infoHover: colors.info[300],
    infoLight: colors.info[900],

    // Text (inverted for dark mode)
    textPrimary: colors.gray[50],
    textSecondary: colors.gray[300],
    textTertiary: colors.gray[400],
    textDisabled: colors.gray[600],
    textInverse: colors.gray[900],

    // Background (dark)
    backgroundPrimary: colors.gray[900],
    backgroundSecondary: colors.gray[800],
    backgroundTertiary: colors.gray[700],

    // Border (lighter for dark mode)
    borderLight: colors.gray[800],
    borderDefault: colors.gray[700],
    borderDark: colors.gray[600],

    // UI (adjusted for dark mode)
    overlay: 'rgba(0, 0, 0, 0.7)',
    hover: 'rgba(255, 255, 255, 0.04)',
    pressed: 'rgba(255, 255, 255, 0.08)',
    selected: 'rgba(139, 92, 246, 0.16)',
    focus: 'rgba(139, 92, 246, 0.24)',

    // Gray scale (inverted)
    gray50: colors.gray[900],
    gray100: colors.gray[800],
    gray200: colors.gray[700],
    gray300: colors.gray[600],
    gray400: colors.gray[500],
    gray500: colors.gray[400],
    gray600: colors.gray[300],
    gray700: colors.gray[200],
    gray800: colors.gray[100],
    gray900: colors.gray[50],
  },
  
  // Typography
  ...typography,
  
  // Spacing
  spacing,
  
  // Border radius
  borderRadius,
  
  // Shadows (darker for dark mode)
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)',
    base: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.4)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.4)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
    none: 'none',
  },
  
  // Z-index
  zIndex,
  
  // Transitions
  transitions,
} as const;

export type DarkTheme = typeof darkTheme;

