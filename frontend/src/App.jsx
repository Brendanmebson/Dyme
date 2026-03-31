// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, GlobalStyles } from '@mui/material';
import { AuthProvider }     from './context/AuthContext';
import { FinanceProvider }  from './context/FinanceContext';
import { CurrencyProvider } from './context/CurrencyContext';
import ProtectedRoute  from './components/ProtectedRoute';
import Layout          from './components/Layout/Layout';
import Login           from './pages/Login';
import Dashboard       from './pages/Dashboard';
import Transactions    from './pages/Transactions';
import Budgets         from './pages/Budgets';
import Analytics       from './pages/Analytics';
import Reports         from './pages/Reports';
import Profile         from './pages/Profile';
import Settings        from './pages/Settings';
import LandingPage     from './pages/LandingPage';
import ScrollToTop     from './components/Common/ScrollToTop';
import { muiTheme }    from './designSystem';

const theme = createTheme(muiTheme);

const globalStyles = (
  <GlobalStyles
    styles={{
      '@import': "url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap')",
      '*': { boxSizing: 'border-box' },
      'html, body': {
        margin: 0,
        padding: 0,
        fontFamily: '"DM Sans", sans-serif',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        scrollBehavior: 'smooth',
      },
      '::-webkit-scrollbar': { width: '6px' },
      '::-webkit-scrollbar-track': { background: '#f1f3f6' },
      '::-webkit-scrollbar-thumb': { background: '#fda4b5', borderRadius: '8px' },
      '::-webkit-scrollbar-thumb:hover': { background: '#f43f6e' },
      '::selection': { background: '#fecdd6', color: '#881337' },
    }}
  />
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {globalStyles}
      <AuthProvider>
        <CurrencyProvider>
          <FinanceProvider>
            <Router>
              <ScrollToTop />
              <Routes>
                {/* Public */}
                <Route path="/"      element={<LandingPage />} />
                <Route path="/login" element={<Login />} />

                {/* Protected app shell */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index                element={<Dashboard />} />
                  <Route path="transactions"  element={<Transactions />} />
                  <Route path="budgets"       element={<Budgets />} />
                  <Route path="analytics"     element={<Analytics />} />
                  <Route path="reports"       element={<Reports />} />
                  <Route path="profile"       element={<Profile />} />
                  <Route path="settings"      element={<Settings />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </FinanceProvider>
        </CurrencyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
