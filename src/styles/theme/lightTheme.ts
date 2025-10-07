/**
 * Light Theme Configuration
 */

import { colors, typography, spacing, borderRadius, shadows, zIndex, transitions } from './tokens';

export const lightTheme = {
  name: 'light',
  
  // Colors
  colors: {
    // Primary
    primary: colors.primary[500],
    primaryHover: colors.primary[600],
    primaryActive: colors.primary[700],
    primaryLight: colors.primary[50],
    
    // Secondary
    secondary: colors.secondary[500],
    secondaryHover: colors.secondary[600],
    secondaryActive: colors.secondary[700],
    secondaryLight: colors.secondary[50],
    
    // Semantic
    success: colors.success[500],
    successHover: colors.success[600],
    successLight: colors.success[50],
    
    warning: colors.warning[500],
    warningHover: colors.warning[600],
    warningLight: colors.warning[50],
    
    error: colors.error[500],
    errorHover: colors.error[600],
    errorLight: colors.error[50],
    
    info: colors.info[500],
    infoHover: colors.info[600],
    infoLight: colors.info[50],
    
    // Text
    textPrimary: colors.text.primary,
    textSecondary: colors.text.secondary,
    textTertiary: colors.text.tertiary,
    textDisabled: colors.text.disabled,
    textInverse: colors.text.inverse,
    
    // Background
    backgroundPrimary: colors.background.primary,
    backgroundSecondary: colors.background.secondary,
    backgroundTertiary: colors.background.tertiary,
    
    // Border
    borderLight: colors.border.light,
    borderDefault: colors.border.default,
    borderDark: colors.border.dark,
    
    // UI
    overlay: colors.ui.overlay,
    hover: colors.ui.hover,
    pressed: colors.ui.pressed,
    selected: colors.ui.selected,
    focus: colors.ui.focus,
    
    // Gray scale
    gray50: colors.gray[50],
    gray100: colors.gray[100],
    gray200: colors.gray[200],
    gray300: colors.gray[300],
    gray400: colors.gray[400],
    gray500: colors.gray[500],
    gray600: colors.gray[600],
    gray700: colors.gray[700],
    gray800: colors.gray[800],
    gray900: colors.gray[900],
  },
  
  // Typography
  ...typography,
  
  // Spacing
  spacing,
  
  // Border radius
  borderRadius,
  
  // Shadows
  shadows,
  
  // Z-index
  zIndex,
  
  // Transitions
  transitions,
} as const;

export type LightTheme = typeof lightTheme;

