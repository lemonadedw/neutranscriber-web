import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // If no saved preference, use system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isSystemMode, setIsSystemMode] = useState(() => {
    // If no saved theme, we're in system mode
    return !localStorage.getItem('theme');
  });

  useEffect(() => {
    // Apply theme to document element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Only save to localStorage if user has manually toggled (not in system mode)
    if (!isSystemMode) {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode, isSystemMode]);

  useEffect(() => {
    // Listen for system theme changes only when in system mode
    if (isSystemMode) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleSystemThemeChange = (e) => {
        setIsDarkMode(e.matches);
      };

      // Add listener
      mediaQuery.addEventListener('change', handleSystemThemeChange);

      // Set initial value based on current system preference
      setIsDarkMode(mediaQuery.matches);

      // Cleanup
      return () => {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      };
    }
  }, [isSystemMode]);

  const toggleDarkMode = () => {
    // When user manually toggles, exit system mode
    setIsSystemMode(false);
    setIsDarkMode(prev => !prev);
  };

  const resetToSystemMode = () => {
    // Reset to system mode
    setIsSystemMode(true);
    localStorage.removeItem('theme');
    setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
  };

  return (
    <ThemeContext.Provider value={{
      isDarkMode,
      toggleDarkMode,
      isSystemMode,
      resetToSystemMode
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};