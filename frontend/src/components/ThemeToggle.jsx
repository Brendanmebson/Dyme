// src/components/ThemeToggle.jsx
import React from 'react';
import { IconButton } from '@mui/material';
import { Sun, Moon } from 'lucide-react';
import { useAppTheme } from '../context/ThemeContext';

const ThemeToggle = ({ sx = {} }) => {
  const { mode, toggleTheme } = useAppTheme();
  
  return (
    <IconButton onClick={toggleTheme} color="inherit" sx={{ 
      bgcolor: mode === 'dark' ? '#334155' : '#f1f3f6', 
      color: mode === 'dark' ? '#e2e8f0' : '#475569',
      '&:hover': { bgcolor: mode === 'dark' ? '#475569' : '#e2e8f0' },
      borderRadius: '10px',
      p: 1,
      ...sx
    }}>
      {mode === 'dark' ? <Sun size={18} color="#facc15" /> : <Moon size={18} />}
    </IconButton>
  );
};

export default ThemeToggle;
