import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Divider, Paper, Switch,
  Button, Alert, CircularProgress,
} from '@mui/material';
import {
  Globe, Shield, Palette, Check, CreditCard, Zap, User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import { useCurrency, CURRENCIES } from '../context/CurrencyContext';
import { useAppTheme } from '../context/ThemeContext';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { bankingService } from '../services/banking.service';
import api from '../services/api';

const fadeUp = keyframes`from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}`;

const Section = ({ title, subtitle, icon: Icon, iconColor = '#f43f6e', children, delay = 0 }) => (
  <Paper elevation={0} sx={{
    border: '1px solid', borderColor: 'divider', borderRadius: '20px', p: { xs: 3, md: 4 },
    animation: `${fadeUp} 0.4s ease both`, animationDelay: `${delay}ms`,
    mb: 3,
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
      <Box sx={{
        width: 36, height: 36, borderRadius: '10px',
        bgcolor: `${iconColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={18} color={iconColor} />
      </Box>
      <Box>
        <Typography variant="h6" fontWeight={700} color="text.primary"
          fontFamily='"Plus Jakarta Sans", sans-serif' sx={{ lineHeight: 1.2 }}>
          {title}
        </Typography>
        {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
      </Box>
    </Box>
    <Divider sx={{ borderColor: 'divider', mb: 3 }} />
    {children}
  </Paper>
);

const ToggleRow = ({ label, description, checked, onChange }) => (
  <Box sx={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    py: 1.5, borderBottom: '1px solid #f9fafb',
    '&:last-child': { borderBottom: 'none', pb: 0 },
  }}>
    <Box>
      <Typography variant="body2" fontWeight={600} color="text.primary">{label}</Typography>
      {description && <Typography variant="caption" color="text.secondary">{description}</Typography>}
    </Box>
    <Switch
      checked={checked} onChange={(e) => onChange(e.target.checked)}
      sx={{
        '& .MuiSwitch-switchBase.Mui-checked': { color: '#f43f6e' },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#f43f6e' },
      }}
    />
  </Box>
);

const Settings = () => {
  const navigate = useNavigate();
  const { user, localAvatar } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const { refreshData } = useFinance();
  const { mode, toggleTheme } = useAppTheme();
  
  const [saved, setSaved] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(currency.code);
  const [refreshing, setRefreshing] = useState(false);
  const [bankStatus, setBankStatus] = useState({ connected: false, provider: null, name: '' });
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    bankingService.getStatus()
      .then(setBankStatus)
      .catch(() => setBankStatus({ connected: false }));
  }, []);

  const handleSaveCurrency = () => {
    setCurrency(selectedCurrency);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDisconnectBank = async () => {
    if (!window.confirm('Are you sure you want to disconnect your bank import? This will not delete your data.')) return;
    setDisconnecting(true);
    try {
      await api.delete('/banking/disconnect'); 
      setBankStatus({ connected: false });
      await refreshData();
    } catch (err) {
      console.error('Failed to disconnect bank:', err);
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <Box sx={{ pt: { xs: 3, md: 4 }, maxWidth: 720 }}>
      {/* Header */}
      <Box sx={{ mb: 4, animation: `${fadeUp} 0.3s ease` }}>
        <Typography variant="h4" fontWeight={800} color="text.primary"
          fontFamily='"Plus Jakarta Sans", sans-serif'
          sx={{ letterSpacing: '-0.02em', mb: 0.5 }}>
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your account preferences and functional connections.
        </Typography>
      </Box>

      {/* Profile Summary */}
      <Section title="Profile Overview" subtitle="Quick view of your account" icon={User} iconColor="#f43f6e" delay={50}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 1 }}>
          <Avatar
            src={localAvatar || user?.avatar_url || user?.user_metadata?.avatar_url || undefined}
            sx={{
              width: 64, height: 64, borderRadius: '20px',
              border: '4px solid', borderColor: 'background.paper',
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              background: 'linear-gradient(135deg, #f43f6e, #fb7292)',
              fontSize: '1.5rem', fontWeight: 800
            }}
          >
            {user?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>
              {user?.full_name || 'Dyme User'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              {user?.email}
            </Typography>
            <Button
              size="small" variant="outlined"
              onClick={() => navigate('/dashboard/profile')}
              sx={{
                borderRadius: '10px', textTransform: 'none', fontWeight: 600,
                borderColor: 'divider', color: 'text.primary', px: 2
              }}
            >
              Edit Profile Info
            </Button>
          </Box>
        </Box>
      </Section>

      {/* Currency */}
      <Section title="Currency & Region" subtitle="Control how money is displayed" icon={Globe} iconColor="#3b82f6" delay={100}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Select your preferred currency. This affects all amounts shown across the dashboard.
        </Typography>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 3 }}>
          {Object.values(CURRENCIES).map((c) => (
            <Box
              key={c.code}
              onClick={() => setSelectedCurrency(c.code)}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                px: 2, py: 1.25, borderRadius: '12px', cursor: 'pointer',
                border: '2px solid',
                borderColor: selectedCurrency === c.code ? '#f43f6e' : 'divider',
                bgcolor: selectedCurrency === c.code ? ((theme) => theme.palette.mode === 'dark' ? 'rgba(244,63,110,0.1)' : '#fff1f3') : 'background.default',
                transition: 'all 0.2s ease',
                '&:hover': { borderColor: '#fda4b5', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(244,63,110,0.15)' : '#fff1f3' },
                minWidth: 110,
              }}
            >
              <Typography sx={{ fontSize: '1.3rem' }}>{c.flag}</Typography>
              <Box>
                <Typography variant="body2" fontWeight={700}
                  color={selectedCurrency === c.code ? '#f43f6e' : 'text.primary'}>
                  {c.code}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1 }}>
                  {c.symbol} · {c.name.split(' ')[0]}
                </Typography>
              </Box>
              {selectedCurrency === c.code && (
                <Box sx={{ ml: 'auto', color: '#f43f6e' }}><Check size={14} /></Box>
              )}
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained" onClick={handleSaveCurrency}
            startIcon={saved ? <Check size={16} /> : <Globe size={16} />}
            sx={{
              background: saved ? '#10b981' : 'linear-gradient(135deg, #f43f6e, #fb7292)',
              borderRadius: '12px', px: 3, py: 1.25, fontWeight: 600, textTransform: 'none',
              transition: 'all 0.3s ease',
            }}
          >
            {saved ? 'Saved!' : 'Save Currency'}
          </Button>
        </Box>
      </Section>

      {/* Bank Connection */}
      <Section title="Bank Connection" subtitle="Status of your automatic or manual imports" icon={CreditCard} iconColor="#10b981" delay={200}>
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          p: 2, borderRadius: '16px', bgcolor: 'background.default',
          border: '1px solid', borderColor: 'divider'
        }}>
          <Box>
            <Typography variant="body2" fontWeight={700}>
              {bankStatus.connected ? (bankStatus.bank_name || 'Manual Import') : 'No Bank Connected'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {bankStatus.connected 
                ? `Successfully synced via ${bankStatus.provider === 'manual_import' ? 'statement data' : 'bank account'}.`
                : 'Import a CSV or Excel statement to see your data here.'}
            </Typography>
          </Box>
          {bankStatus.connected && (
            <Button
              size="small" color="error" variant="text"
              disabled={disconnecting}
              onClick={handleDisconnectBank}
              sx={{ fontWeight: 700, textTransform: 'none', borderRadius: '8px' }}
            >
              {disconnecting ? 'Disconnecting...' : 'Disconnect'}
            </Button>
          )}
        </Box>
      </Section>

      {/* Appearance */}
      <Section title="Appearance" subtitle="Personalise how Dyme looks" icon={Palette} iconColor="#7c3aed" delay={300}>
        <ToggleRow
          label="Dark Mode"
          description="Switch between light and dark themes"
          checked={mode === 'dark'}
          onChange={toggleTheme}
        />
      </Section>

      {/* Data Management */}
      <Section title="Data & Privacy" subtitle="Manage your account data" icon={Shield} iconColor="#f43f6e" delay={400}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1 }}>
          <Box>
            <Typography variant="body2" fontWeight={600}>Refresh Application Data</Typography>
            <Typography variant="caption" color="text.secondary">Force a manual sync of all transactions and budgets.</Typography>
          </Box>
          <Button
            size="small" variant="outlined"
            onClick={handleManualRefresh}
            disabled={refreshing}
            startIcon={refreshing ? <CircularProgress size={14} color="inherit" /> : <Zap size={14} />}
            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, borderColor: 'divider', color: refreshing ? 'text.secondary' : 'text.primary' }}
          >
            {refreshing ? 'Refreshing...' : 'Refresh Now'}
          </Button>
        </Box>
      </Section>
    </Box>
  );
};

export default Settings;
