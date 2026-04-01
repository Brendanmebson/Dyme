// src/pages/Settings.jsx
import React, { useState } from 'react';
import {
  Box, Typography, Divider, Paper, Switch, FormControlLabel,
  Button, Alert, Select, MenuItem, FormControl, InputLabel,
  Chip,
} from '@mui/material';
import {
  Globe, Bell, Shield, Palette, Check, CreditCard,
} from 'lucide-react';
import { keyframes } from '@mui/material/styles';
import { useCurrency, CURRENCIES } from '../context/CurrencyContext';
import { useAppTheme } from '../context/ThemeContext';

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
        <Typography variant="h6" fontWeight={700} color="#101828"
          fontFamily='"Plus Jakarta Sans", sans-serif' sx={{ lineHeight: 1.2 }}>
          {title}
        </Typography>
        {subtitle && <Typography variant="caption" color="#98a2b3">{subtitle}</Typography>}
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
      <Typography variant="body2" fontWeight={600} color="#344054">{label}</Typography>
      {description && <Typography variant="caption" color="#98a2b3">{description}</Typography>}
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
  const { currency, setCurrency } = useCurrency();
  const { mode, toggleTheme } = useAppTheme();
  const [saved, setSaved] = useState(false);

  // Notifications
  const [notifs, setNotifs] = useState({
    transactions: true,
    budgetAlerts: true,
    weeklyReport: false,
    monthlyReport: true,
    lowBalance:    true,
  });

  // Preferences
  const [prefs, setPrefs] = useState({
    compactMode:    false,
    animations:     true,
    autoCategories: true,
  });

  const [selectedCurrency, setSelectedCurrency] = useState(currency.code);

  const handleSave = () => {
    setCurrency(selectedCurrency);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <Box sx={{ pt: { xs: 3, md: 4 }, maxWidth: 720 }}>
      {/* Header */}
      <Box sx={{ mb: 4, animation: `${fadeUp} 0.3s ease` }}>
        <Typography variant="h4" fontWeight={800} color="#101828"
          fontFamily='"Plus Jakarta Sans", sans-serif'
          sx={{ letterSpacing: '-0.02em', mb: 0.5 }}>
          Settings
        </Typography>
        <Typography variant="body2" color="#667085">
          Customize your Dyme experience.
        </Typography>
      </Box>

      {/* Currency */}
      <Section title="Currency & Region" subtitle="Control how money is displayed" icon={Globe} iconColor="#3b82f6" delay={50}>
        <Typography variant="body2" color="#667085" sx={{ mb: 2 }}>
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
                border: selectedCurrency === c.code ? '2px solid #f43f6e' : '2px solid #e4e7ed',
                bgcolor: selectedCurrency === c.code ? '#fff1f3' : '#fafafa',
                transition: 'all 0.2s ease',
                '&:hover': { borderColor: '#fda4b5', bgcolor: '#fff1f3' },
                minWidth: 110,
              }}
            >
              <Typography sx={{ fontSize: '1.3rem' }}>{c.flag}</Typography>
              <Box>
                <Typography variant="body2" fontWeight={700}
                  color={selectedCurrency === c.code ? '#f43f6e' : '#344054'}>
                  {c.code}
                </Typography>
                <Typography variant="caption" color="#98a2b3" sx={{ display: 'block', lineHeight: 1 }}>
                  {c.symbol} · {c.name.split(' ')[0]}
                </Typography>
              </Box>
              {selectedCurrency === c.code && (
                <Box sx={{ ml: 'auto', color: '#f43f6e' }}><Check size={14} /></Box>
              )}
            </Box>
          ))}
        </Box>

        {saved && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: '10px' }}>
            Currency updated to {CURRENCIES[selectedCurrency]?.name}!
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained" onClick={handleSave}
            startIcon={saved ? <Check size={16} /> : <Globe size={16} />}
            sx={{
              background: saved
                ? 'linear-gradient(135deg, #10b981, #34d399)'
                : 'linear-gradient(135deg, #f43f6e, #fb7292)',
              borderRadius: '12px', px: 3, py: 1.25, fontWeight: 600, textTransform: 'none',
              boxShadow: '0 4px 16px rgba(244,63,110,0.2)',
              '&:hover': { transform: 'translateY(-1px)' },
              transition: 'all 0.3s ease',
            }}
          >
            {saved ? 'Saved!' : 'Save Currency'}
          </Button>
        </Box>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" subtitle="Choose what you want to be notified about" icon={Bell} iconColor="#f59e0b" delay={150}>
        <ToggleRow
          label="Transaction Alerts"
          description="Get notified for every new transaction"
          checked={notifs.transactions}
          onChange={(v) => setNotifs((p) => ({ ...p, transactions: v }))}
        />
        <ToggleRow
          label="Budget Alerts"
          description="Warn me when I'm close to a budget limit"
          checked={notifs.budgetAlerts}
          onChange={(v) => setNotifs((p) => ({ ...p, budgetAlerts: v }))}
        />
        <ToggleRow
          label="Low Balance Warning"
          description="Alert me when balance drops below threshold"
          checked={notifs.lowBalance}
          onChange={(v) => setNotifs((p) => ({ ...p, lowBalance: v }))}
        />
        <ToggleRow
          label="Weekly Summary"
          description="Receive a weekly spending report"
          checked={notifs.weeklyReport}
          onChange={(v) => setNotifs((p) => ({ ...p, weeklyReport: v }))}
        />
        <ToggleRow
          label="Monthly Report"
          description="Full monthly financial overview"
          checked={notifs.monthlyReport}
          onChange={(v) => setNotifs((p) => ({ ...p, monthlyReport: v }))}
        />
      </Section>

      {/* Preferences */}
      <Section title="Preferences" subtitle="Personalise how Dyme looks and behaves" icon={Palette} iconColor="#7c3aed" delay={250}>
        <ToggleRow
          label="Dark Mode"
          description="Switch to a dark appearance"
          checked={mode === 'dark'}
          onChange={toggleTheme}
        />
        <ToggleRow
          label="Compact Mode"
          description="Show more data with less spacing"
          checked={prefs.compactMode}
          onChange={(v) => setPrefs((p) => ({ ...p, compactMode: v }))}
        />
        <ToggleRow
          label="Animations"
          description="Enable smooth transitions and animations"
          checked={prefs.animations}
          onChange={(v) => setPrefs((p) => ({ ...p, animations: v }))}
        />
        <ToggleRow
          label="Auto-categorise Transactions"
          description="Automatically suggest categories for new transactions"
          checked={prefs.autoCategories}
          onChange={(v) => setPrefs((p) => ({ ...p, autoCategories: v }))}
        />
      </Section>

      {/* Security */}
      <Section title="Security" subtitle="Manage your account security" icon={Shield} iconColor="#10b981" delay={350}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            p: 2, borderRadius: '12px', bgcolor: 'background.default', border: '1px solid', borderColor: 'divider',
          }}>
            <Box>
              <Typography variant="body2" fontWeight={600} color="#344054">Two-Factor Authentication</Typography>
              <Typography variant="caption" color="#98a2b3">Add an extra layer of security</Typography>
            </Box>
            <Chip label="Not Set Up" size="small" sx={{ bgcolor: '#fee2e2', color: '#ef4444', fontWeight: 600, fontSize: '0.72rem' }} />
          </Box>
          <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            p: 2, borderRadius: '12px', bgcolor: 'background.default', border: '1px solid', borderColor: 'divider',
          }}>
            <Box>
              <Typography variant="body2" fontWeight={600} color="#344054">Active Sessions</Typography>
              <Typography variant="caption" color="#98a2b3">1 active session on this device</Typography>
            </Box>
            <Chip label="1 Active" size="small" sx={{ bgcolor: '#d1fae5', color: '#10b981', fontWeight: 600, fontSize: '0.72rem' }} />
          </Box>
        </Box>
      </Section>
    </Box>
  );
};

export default Settings;
