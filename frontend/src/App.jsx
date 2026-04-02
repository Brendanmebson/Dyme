// App.jsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, GlobalStyles, Box, CircularProgress } from '@mui/material';
import { AuthProvider }     from './context/AuthContext';
import { FinanceProvider }  from './context/FinanceContext';
import { CurrencyProvider } from './context/CurrencyContext';
import ProtectedRoute  from './components/ProtectedRoute';
import Layout          from './components/Layout/Layout';
import LandingPage      from './pages/LandingPage';
import ScrollToTop      from './components/Common/ScrollToTop';
import { AppThemeProvider } from './context/ThemeContext';

// Lazy load other views
const Login        = lazy(() => import('./pages/Login'));
const Onboarding   = lazy(() => import('./pages/Onboarding'));
const Dashboard    = lazy(() => import('./pages/Dashboard'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Budgets      = lazy(() => import('./pages/Budgets'));
const Analytics    = lazy(() => import('./pages/Analytics'));
const Reports      = lazy(() => import('./pages/Reports'));
const Profile      = lazy(() => import('./pages/Profile'));
const Settings     = lazy(() => import('./pages/Settings'));
const About        = lazy(() => import('./pages/About'));
const Features     = lazy(() => import('./pages/Features'));
const FAQs         = lazy(() => import('./pages/FAQs'));

// const theme = createTheme(muiTheme); // Removed static theme

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', bgcolor: '#fafaf8' }}>
    <CircularProgress sx={{ color: '#f43f6e' }} />
  </Box>
);

const globalStyles = (
  <GlobalStyles
    styles={{
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
    <AppThemeProvider>
      <CssBaseline />
      {globalStyles}
      <AuthProvider>
        <CurrencyProvider>
          <FinanceProvider>
            <Router>
              <ScrollToTop />
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Public */}
                  <Route path="/"           element={<LandingPage />} />
                  <Route path="/about"      element={<About />} />
                  <Route path="/features"   element={<Features />} />
                  <Route path="/faqs"       element={<FAQs />} />
                  <Route path="/login"      element={<Login />} />

                  {/* Post-signup onboarding (protected) */}
                  <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />

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
              </Suspense>
            </Router>
          </FinanceProvider>
        </CurrencyProvider>
      </AuthProvider>
    </AppThemeProvider>
  );
}

export default App;
