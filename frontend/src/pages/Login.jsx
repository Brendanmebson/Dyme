// src/pages/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import {
  Eye, EyeOff, AlertCircle, ArrowRight, Sparkles,
  BarChart3, Target, TrendingUp, UserPlus, LogIn, ArrowLeft,
} from 'lucide-react';
import {
  Box, Typography, TextField, Button, IconButton,
  InputAdornment, Alert, CircularProgress, Tabs, Tab,
} from '@mui/material';
import { keyframes } from '@mui/material/styles';
import ThemeToggle from '../components/ThemeToggle';
import logofull from '../assets/Dyme logo full.png';
import logofullWhite from '../assets/Dyme logo full(white).png';

const float1 = keyframes`0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-20px) rotate(5deg)}`;
const float2 = keyframes`0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-14px) rotate(-4deg)}`;
const slideUp = keyframes`from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}`;

const FEATURES = [
  { icon: BarChart3, label: 'Real-time spending insights' },
  { icon: Target, label: 'Smart budget tracking' },
  { icon: TrendingUp, label: 'Visual analytics & reports' },
];

// ── Reusable field ──────────────────────────────────────────────
const Field = ({ label, type = 'text', value, onChange, required, endAdornment }) => (
  <TextField
    fullWidth label={label} type={type}
    value={value} onChange={onChange} required={required}
    sx={{ mb: 2.5 }}
    InputProps={{ endAdornment }}
  />
);

// ── Login form ──────────────────────────────────────────────────
const LoginForm = ({ onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(email, password);
    if (!result.success) { setError(result.error); setLoading(false); }
    else onSuccess();
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" icon={<AlertCircle size={18} />}
          sx={{ mb: 2.5, borderRadius: '12px', border: '1px solid #fee2e2' }}>
          {error}
        </Alert>
      )}

      <Field label="Email address" type="email" value={email}
        onChange={(e) => setEmail(e.target.value)} required />

      <Field
        label="Password" type={showPw ? 'text' : 'password'}
        value={password} onChange={(e) => setPassword(e.target.value)} required
        endAdornment={
          <InputAdornment position="end">
            <IconButton onClick={() => setShowPw(!showPw)} edge="end">
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </IconButton>
          </InputAdornment>
        }
      />

      <Button type="submit" fullWidth variant="contained" disabled={loading}
        endIcon={!loading && <ArrowRight size={18} />}
        sx={{
          py: 1.5, borderRadius: '12px', fontSize: '1rem',
          background: 'linear-gradient(135deg, #f43f6e, #fb7292)',
          boxShadow: '0 4px 16px rgba(244,63,110,0.3)',
          '&:hover': { boxShadow: '0 8px 24px rgba(244,63,110,0.4)' },
        }}>
        {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Sign in'}
      </Button>
    </Box>
  );
};

// ── Register form ───────────────────────────────────────────────
const RegisterForm = ({ onSuccess }) => {
  const { register } = useAuth();
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      return setError('Passwords do not match');
    }
    setLoading(true);
    setError('');
    const result = await register({
      full_name: form.full_name,
      email: form.email,
      password: form.password,
    });
    if (!result.success) { setError(result.error); setLoading(false); }
    else onSuccess();
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" icon={<AlertCircle size={18} />}
          sx={{ mb: 2.5, borderRadius: '12px', border: '1px solid #fee2e2' }}>
          {error}
        </Alert>
      )}

      <Field label="Full name" value={form.full_name} onChange={set('full_name')} required />
      <Field label="Email address" type="email" value={form.email} onChange={set('email')} required />
      <Field
        label="Password (min 8 chars)" type={showPw ? 'text' : 'password'}
        value={form.password} onChange={set('password')} required
        endAdornment={
          <InputAdornment position="end">
            <IconButton onClick={() => setShowPw(!showPw)} edge="end">
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </IconButton>
          </InputAdornment>
        }
      />
      <Field label="Confirm password" type={showPw ? 'text' : 'password'}
        value={form.confirm} onChange={set('confirm')} required />

      <Button type="submit" fullWidth variant="contained" disabled={loading}
        endIcon={!loading && <UserPlus size={18} />}
        sx={{
          py: 1.5, borderRadius: '12px', fontSize: '1rem',
          background: 'linear-gradient(135deg, #f43f6e, #fb7292)',
          boxShadow: '0 4px 16px rgba(244,63,110,0.3)',
          '&:hover': { boxShadow: '0 8px 24px rgba(244,63,110,0.4)' },
        }}>
        {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Create account'}
      </Button>
    </Box>
  );
};

// ── Main Login page ─────────────────────────────────────────────
const Login = () => {
  const navigate = useNavigate();
  const { mode } = useAppTheme();
  const [tab, setTab] = useState(0);

  const onLoginSuccess = () => navigate('/dashboard');
  const onRegisterSuccess = () => navigate('/onboarding');

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, bgcolor: 'background.default' }}>

      {/* ─── Back Button ─── */}
      <IconButton
        onClick={() => navigate('/landing')}
        sx={{
          position: 'absolute', top: { xs: 20, md: 32 }, left: { xs: 20, md: 32 },
          zIndex: 10,
          bgcolor: { xs: 'transparent', md: 'rgba(255,255,255,0.15)' },
          color: { xs: '#555', md: '#fff' },
          border: '1px solid',
          borderColor: { xs: '#e2e2e2', md: 'rgba(255,255,255,0.25)' },
          backdropFilter: 'blur(4px)',
          transition: 'all 0.2s ease',
          '&:hover': { bgcolor: { xs: '#f4f4f4', md: 'rgba(255,255,255,0.25)' }, transform: 'translateY(-1px)' }
        }}
      >
        <ArrowLeft size={20} />
      </IconButton>

      {/* ─── Theme Toggle ─── */}
      <Box sx={{ position: 'absolute', top: { xs: 20, md: 32 }, right: { xs: 20, md: 32 }, zIndex: 10 }}>
        <ThemeToggle sx={{
          bgcolor: { xs: 'transparent', md: 'rgba(255,255,255,0.15)' },
          border: '1px solid',
          borderColor: { xs: '#e2e2e2', md: 'rgba(255,255,255,0.25)' },
          backdropFilter: 'blur(4px)',
          '&:hover': { bgcolor: { xs: '#f4f4f4', md: 'rgba(255,255,255,0.25)' } }
        }} />
      </Box>

      {/* ─── Left brand panel ─── */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' }, flex: { md: '0 0 48%' },
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        background: '#f43f6e', p: { xs: 4, md: 6 }, py: { xs: 5, md: 6 },
      }}>
        <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', top: '10%', left: '10%', width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.08)', animation: `${float1} 6s ease-in-out infinite` }} />
        <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', bottom: '15%', right: '8%', width: 140, height: 140, borderRadius: '40%', bgcolor: 'rgba(255,255,255,0.06)', animation: `${float2} 8s ease-in-out infinite` }} />

        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', color: '#fff' }}>
          <Box sx={{ mb: 1, mx: 'auto' }}>
            <Box component="img" src={logofull} alt="Dyme"
              sx={{ height: { xs: 55, md: 84 }, width: 'auto', filter: 'brightness(0) invert(1)' }} />
          </Box>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.75)', fontWeight: 400, mb: { xs: 2.5, md: 4 }, maxWidth: 340, mx: 'auto', fontSize: { xs: '0.9rem', md: '1.25rem' } }}>
            The smarter way to track your money, built for real life.
          </Typography>
          {FEATURES.map(({ icon: Icon, label }) => (
            <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: { xs: 1, md: 1.5 }, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '10px', px: 2, py: { xs: 1, md: 1.25 }, backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.15)', maxWidth: 320, mx: 'auto' }}>
              <Icon size={15} color="rgba(255,255,255,0.9)" strokeWidth={1.5} />
              <Typography variant="body2" color="rgba(255,255,255,0.9)" fontWeight={500} sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ─── Right form panel ─── */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: { xs: 3, md: 6 }, bgcolor: 'background.paper', minHeight: '100vh' }}>
        <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 4, animation: `${slideUp} 0.4s ease` }}>
          <Box component="img" src={mode === 'dark' ? logofullWhite : logofull} alt="Dyme" sx={{ height: 80, width: 'auto' }} />
        </Box>

        <Box sx={{ width: '100%', maxWidth: 420, animation: `${slideUp} 0.4s ease` }}>

          {/* Tab switcher */}
          <Tabs
            value={tab} onChange={(_, v) => setTab(v)}
            sx={{
              mb: 3, borderRadius: '14px',
              bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', p: 0.5,
              '& .MuiTabs-indicator': { display: 'none' },
              '& .MuiTab-root': {
                flex: 1, borderRadius: '10px', fontWeight: 600, fontSize: '0.875rem',
                color: 'text.secondary', transition: 'all 0.2s ease', minHeight: 40,
              },
              '& .Mui-selected': {
                bgcolor: 'background.paper', color: 'primary.main',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              },
            }}
          >
            <Tab icon={<LogIn size={15} />} iconPosition="start" label="Sign in" />
            <Tab icon={<UserPlus size={15} />} iconPosition="start" label="Create account" />
          </Tabs>

          <Box sx={{ display: tab === 0 ? 'block' : 'none' }}>
            <Typography variant="h4" fontWeight={800} color="text.primary"
              fontFamily='"Plus Jakarta Sans", sans-serif'
              sx={{ letterSpacing: '-0.02em', mb: 0.5, fontSize: { xs: '1.6rem', md: '2.125rem' } }}>
              Welcome back
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontSize: { xs: '0.875rem', md: '1rem' } }}>
              Sign in to your account to continue.
            </Typography>
            <LoginForm onSuccess={onLoginSuccess} />
          </Box>

          <Box sx={{ display: tab === 1 ? 'block' : 'none' }}>
            <Typography variant="h4" fontWeight={800} color="text.primary"
              fontFamily='"Plus Jakarta Sans", sans-serif'
              sx={{ letterSpacing: '-0.02em', mb: 0.5, fontSize: { xs: '1.6rem', md: '2.125rem' } }}>
              Create your account
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontSize: { xs: '0.875rem', md: '1rem' } }}>
              Start tracking your finances for free.
            </Typography>
            <RegisterForm onSuccess={onRegisterSuccess} />
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 3 }}>
            By continuing, you agree to our Terms of Service.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
