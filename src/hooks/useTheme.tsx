import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check for saved theme preference first
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    
    if (savedTheme) {
      // Use saved preference
      setThemeState(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      // Check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = systemPrefersDark ? 'dark' : 'light';
      
      setThemeState(systemTheme);
      document.documentElement.classList.toggle('dark', systemTheme === 'dark');
      
      // Save system preference
      localStorage.setItem('theme', systemTheme);
    }
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't manually set a preference
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      if (!savedTheme) {
        const newTheme = e.matches ? 'dark' : 'light';
        setThemeState(newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        localStorage.setItem('theme', newTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Return default values instead of throwing error during SSR or before mount
    return {
      theme: 'light' as Theme,
      toggleTheme: () => {},
      setTheme: () => {},
    };
  }
  return context;
};
