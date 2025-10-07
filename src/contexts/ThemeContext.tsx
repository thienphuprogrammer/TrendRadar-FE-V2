/**
 * Theme Context
 * Provides theme state and toggle functionality
 */

import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { Theme, ThemeName, themes } from '@/styles/theme';
import { themeStorage } from '@/lib/utils/storage';

interface ThemeContextType {
  theme: ThemeName;
  toggleTheme: () => void;
  setTheme: (theme: ThemeName) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeName;
  onThemeChange?: (theme: ThemeName) => void;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'light',
  onThemeChange,
}) => {
  const [themeName, setThemeName] = useState<ThemeName>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // Load theme from storage on mount
  useEffect(() => {
    const storedTheme = themeStorage.get();
    if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
      setThemeName(storedTheme);
    }
    setMounted(true);
  }, []);

  // Save theme to storage when it changes
  useEffect(() => {
    if (!mounted) return;

    themeStorage.set(themeName);

    // Update document class for CSS
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(themeName);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const color = themeName === 'dark' ? '#111827' : '#ffffff';
      metaThemeColor.setAttribute('content', color);
    }

    // Notify parent of theme change
    if (onThemeChange) {
      onThemeChange(themeName);
    }
  }, [themeName, mounted, onThemeChange]);

  const toggleTheme = useCallback(() => {
    setThemeName((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setTheme = useCallback((theme: ThemeName) => {
    setThemeName(theme);
  }, []);

  const currentTheme: Theme = themes[themeName];

  const value: ThemeContextType = {
    theme: themeName,
    toggleTheme,
    setTheme,
    isDark: themeName === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      <StyledThemeProvider theme={currentTheme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

/**
 * Hook to use theme context
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
