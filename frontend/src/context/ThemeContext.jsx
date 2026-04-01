import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getDesignTokens } from '../designSystem';

const ThemeContext = createContext();

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useAppTheme must be used within AppThemeProvider');
  return context;
};

export const AppThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => localStorage.getItem('dyme_theme') || 'light');

  useEffect(() => {
    localStorage.setItem('dyme_theme', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
