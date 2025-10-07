/**
 * Theme System
 * Exports all theme-related modules
 */

export * from './tokens';
export * from './lightTheme';
export * from './darkTheme';

import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';

export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

export type Theme = typeof lightTheme | typeof darkTheme;
export type ThemeName = keyof typeof themes;
