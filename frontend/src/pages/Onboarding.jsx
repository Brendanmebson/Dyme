// src/pages/Onboarding.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, LinearProgress, 
  TextField, Chip, CircularProgress, Tooltip,
} from '@mui/material';
import { keyframes } from '@mui/material/styles';
import {
  ArrowRight, ArrowLeft, Check, Globe, Sparkles,
  Target, Wallet, TrendingUp, PiggyBank, CreditCard, FileText, Upload, HelpCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { bankingService } from '../services/banking.service';
import logofull from '../assets/Dyme logo full.png';

const fadeUp = keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;
const pulse  = keyframes`0%,100%{transform:scale(1)}50%{transform:scale(1.04)}`;

const TOTAL_STEPS = 4;

// ── Step 1: Goals ─────────────────────────────────────────────────
const GOALS = [
  { id: 'save',   icon: PiggyBank,   label: 'Save more money',       desc: 'Build an emergency fund or savings habit' },
  { id: 'track',  icon: Wallet,      label: 'Track my spending',      desc: 'Know exactly where my money goes' },
  { id: 'budget', icon: Target,      label: 'Stick to a budget',      desc: 'Set limits and stay within them' },
  { id: 'invest', icon: TrendingUp,  label: 'Invest & grow wealth',   desc: 'Make my money work for me' },
  { id: 'debt',   icon: CreditCard,  label: 'Get out of debt',        desc: 'Pay off loans and credit cards faster' },
];

const GoalsStep = ({ data, onChange }) => (
  <Box>
    <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#f43f6e', mb: 1.5 }}>
      Step 1 of 4 — Your Goal
    </Typography>
    <Typography variant="h4" fontWeight={800} sx={{ mb: 1, letterSpacing: '-0.03em', fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
      What's your #1 financial goal?
    </Typography>
    <Typography color="text.secondary" sx={{ mb: 4, fontSize: '0.95rem' }}>
      We'll personalise Dyme around what matters most to you.
    </Typography>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {GOALS.map(({ id, icon: Icon, label, desc }) => {
        const selected = data.goal === id;
        return (
          <Box
            key={id}
            onClick={() => onChange({ goal: id })}
            sx={{
              display: 'flex', alignItems: 'center', gap: 2,
              p: 2, borderRadius: '14px', cursor: 'pointer',
              border: '1.5px solid',
              borderColor: selected ? '#f43f6e' : 'divider',
              bgcolor: selected ? 'rgba(244,63,110,0.04)' : 'background.paper',
              transition: 'all 0.18s ease',
              '&:hover': { borderColor: '#f43f6e', bgcolor: 'rgba(244,63,110,0.04)' },
            }}
          >
            <Box sx={{
              width: 42, height: 42, borderRadius: '11px', flexShrink: 0,
              bgcolor: selected ? '#f43f6e' : 'rgba(244,63,110,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.18s ease',
            }}>
              <Icon size={18} color={selected ? '#fff' : '#f43f6e'} strokeWidth={1.8} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={700} fontSize="0.9rem" color="text.primary">{label}</Typography>
              <Typography fontSize="0.78rem" color="text.secondary">{desc}</Typography>
            </Box>
            {selected && (
              <Box sx={{ width: 22, height: 22, borderRadius: '50%', bgcolor: '#f43f6e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Check size={12} color="#fff" strokeWidth={3} />
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  </Box>
);

// ── Step 2: Habits ────────────────────────────────────────────────
const QUESTIONS = [
  { id: 'awareness', q: 'How well do you know where your money goes each month?', low: "Not at all 😅", high: "Very well 📊" },
  { id: 'savings',   q: 'How consistently do you save money each month?',         low: "Rarely 😬",    high: "Always 💪" },
  { id: 'stress',    q: 'How much does money stress you out?',                    low: "Constantly 😓", high: "Never 😎" },
];

const RatingRow = ({ q, low, high, value, onSelect }) => (
  <Box sx={{ mb: 4 }}>
    <Typography fontWeight={600} fontSize="0.95rem" color="text.primary" sx={{ mb: 2 }}>{q}</Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography fontSize="0.72rem" color="text.secondary" sx={{ minWidth: 70 }}>{low}</Typography>
      <Box sx={{ display: 'flex', gap: 1, flex: 1, justifyContent: 'center' }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Box
            key={n}
            onClick={() => onSelect(n)}
            sx={{
              width: 42, height: 42, borderRadius: '10px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.9rem',
              border: '1.5px solid',
              borderColor: value === n ? '#f43f6e' : 'divider',
              bgcolor: value === n ? '#f43f6e' : 'background.paper',
              color: value === n ? '#fff' : 'text.primary',
              transition: 'all 0.15s ease',
              '&:hover': { borderColor: '#f43f6e', transform: 'scale(1.08)' },
            }}
          >
            {n}
          </Box>
        ))}
      </Box>
      <Typography fontSize="0.72rem" color="text.secondary" sx={{ minWidth: 70, textAlign: 'right' }}>{high}</Typography>
    </Box>
  </Box>
);

const HabitsStep = ({ data, onChange }) => (
  <Box>
    <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#f43f6e', mb: 1.5 }}>
      Step 2 of 4 — Quick Check
    </Typography>
    <Typography variant="h4" fontWeight={800} sx={{ mb: 1, letterSpacing: '-0.03em', fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
      Quick money check-in
    </Typography>
    <Typography color="text.secondary" sx={{ mb: 4.5, fontSize: '0.95rem' }}>
      5 seconds each — totally honest, no judgment.
    </Typography>
    {QUESTIONS.map((item) => (
      <RatingRow
        key={item.id}
        q={item.q}
        low={item.low}
        high={item.high}
        value={data.habits?.[item.id]}
        onSelect={(val) => onChange({ habits: { ...(data.habits || {}), [item.id]: val } })}
      />
    ))}
  </Box>
);

// ── Step 3: Profile ───────────────────────────────────────────────
const CURRENCIES = [
  { code: 'USD', label: '$ US Dollar' },
  { code: 'GBP', label: '£ British Pound' },
  { code: 'EUR', label: '€ Euro' },
  { code: 'NGN', label: '₦ Nigerian Naira' },
  { code: 'GHS', label: '₵ Ghanaian Cedi' },
];

const ProfileStep = ({ data, onChange }) => (
  <Box>
    <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#f43f6e', mb: 1.5 }}>
      Step 3 of 4 — Your Profile
    </Typography>
    <Typography variant="h4" fontWeight={800} sx={{ mb: 1, letterSpacing: '-0.03em', fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
      Make it yours
    </Typography>
    <Typography color="text.secondary" sx={{ mb: 4, fontSize: '0.95rem' }}>
      What should we call you? And what currency do you use?
    </Typography>

    <TextField
      fullWidth
      label="Nickname (e.g. Brendan, B-Money 💸)"
      value={data.nickname || ''}
      onChange={(e) => onChange({ nickname: e.target.value })}
      sx={{ mb: 3 }}
    />

    <Typography fontWeight={700} fontSize="0.85rem" color="text.primary" sx={{ mb: 1.5 }}>
      Primary currency
    </Typography>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {CURRENCIES.map(({ code, label }) => {
        const selected = data.currency === code;
        return (
          <Chip
            key={code}
            label={label}
            onClick={() => onChange({ currency: code })}
            sx={{
              fontWeight: 600, fontSize: '0.8rem',
              border: '1.5px solid',
              borderColor: selected ? '#f43f6e' : 'divider',
              bgcolor: selected ? 'rgba(244,63,110,0.08)' : 'background.paper',
              color: selected ? '#f43f6e' : 'text.primary',
              '&:hover': { borderColor: '#f43f6e' },
              transition: 'all 0.15s',
            }}
          />
        );
      })}
    </Box>
  </Box>
);

// ── Step 4: Bank Import (CSV HERO) ────────────────────────────────

const CSVUploadButton = ({ onSuccess }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await bankingService.uploadCSV(file);
      onSuccess(`Imported ${res.count} transactions`);
    } catch (err) {
      alert(err.message || 'Failed to parse bank statement. Ensure it is a valid CSV.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <input
        type="file" accept=".csv" id="csv-upload"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <label htmlFor="csv-upload">
        <Button
          fullWidth component="span"
          disabled={uploading}
          variant="contained"
          size="large"
          startIcon={uploading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <Upload size={18} />}
          sx={{
            py: 1.8, borderRadius: '16px', fontWeight: 800, fontSize: '1rem',
            background: 'linear-gradient(135deg, #f43f6e, #ff6b8a)',
            boxShadow: '0 4px 20px rgba(244,63,110,0.3)',
            '&:hover': { boxShadow: '0 8px 30px rgba(244,63,110,0.4)', transform: 'translateY(-2px)' },
            textTransform: 'none',
          }}
        >
          {uploading ? 'Parsing Statement...' : 'Import Bank Statement (CSV)'}
        </Button>
      </label>
      
      <Box sx={{ mt: 2.5, p: 2, borderRadius: '12px', bgcolor: 'rgba(0,0,0,0.03)', display: 'flex', gap: 1.5, alignItems: 'center' }}>
        <HelpCircle size={16} color="#666" />
        <Typography fontSize="0.75rem" color="text.secondary">
          <b>How to:</b> Open your bank app, download your "Statement" as a CSV file, and select it here. Works for 100% of banks.
        </Typography>
      </Box>
    </Box>
  );
};

const BankStep = ({ onSuccess, onSkip }) => {
  const [connected, setConnected] = useState(false);
  const [bankName, setBankName] = useState('');

  const handleSuccess = (name) => {
    setBankName(name);
    setConnected(true);
  };

  if (connected) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(16,185,129,0.1)', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3, animation: `${pulse} 1.5s ease-in-out infinite` }}>
          <Check size={36} color="#10b981" strokeWidth={2.5} />
        </Box>
        <Typography variant="h5" fontWeight={800} color="text.primary" sx={{ mb: 1, letterSpacing: '-0.02em' }}>
          {bankName}!
        </Typography>
        <Typography color="text.secondary" fontSize="0.9rem" sx={{ mb: 4 }}>
          Your financial birds-eye view is ready.
        </Typography>
        <Button
          fullWidth
          variant="contained"
          onClick={onSuccess}
          endIcon={<ArrowRight size={18} />}
          sx={{ py: 1.6, borderRadius: '14px', fontWeight: 700, background: 'linear-gradient(135deg, #f43f6e, #ff6b8a)', boxShadow: '0 4px 20px rgba(244,63,110,0.3)' }}
        >
          See my dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#f43f6e', mb: 1.5 }}>
        Step 4 of 4 — Universal Sync
      </Typography>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 1, letterSpacing: '-0.03em', fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
        See your real money
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4.5, fontSize: '0.95rem' }}>
        No complex sign-ups. No fees. Just upload your statement CSV and Dyme handles the rest.
      </Typography>

      <CSVUploadButton onSuccess={handleSuccess} />

      <Box sx={{ mt: 3, p: 2, borderRadius: '12px', border: '1px solid', borderColor: 'divider', bgcolor: 'rgba(0,0,0,0.02)', textAlign: 'center' }}>
        <Typography fontSize="0.75rem" fontWeight={700} color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          ⚡ Automatic Bank Linking
        </Typography>
        <Typography fontSize="0.72rem" color="text.secondary">
          Coming soon for all major banks.
        </Typography>
      </Box>

      <Button
        fullWidth
        variant="text"
        onClick={onSkip}
        sx={{ mt: 2, color: 'text.secondary', fontSize: '0.85rem', fontWeight: 500, py: 1 }}
      >
        Skip for now — I'll enter transactions manually
      </Button>
    </Box>
  );
};

// ── Main Onboarding ───────────────────────────────────────────────
const Onboarding = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    goal: '',
    habits: {},
    nickname: user?.full_name?.split(' ')[0] || '',
    currency: 'USD',
  });

  const update = (patch) => setData((prev) => ({ ...prev, ...patch }));

  const canNext = () => {
    if (step === 1) return !!data.goal;
    if (step === 2) return Object.keys(data.habits || {}).length >= QUESTIONS.length;
    if (step === 3) return !!data.nickname && !!data.currency;
    return false;
  };

  const saveProfileAndFinish = async () => {
    setSaving(true);
    try {
      await updateProfile({
        full_name: data.nickname || user?.full_name,
        currency: data.currency,
      });
    } catch (e) {
      console.warn('Profile update error:', e);
    } finally {
      setSaving(false);
      navigate('/dashboard');
    }
  };

  const progress = ((step - 1) / TOTAL_STEPS) * 100;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>

      {/* ── Left Accent Panel ── */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' }, flexDirection: 'column', justifyContent: 'space-between',
        flex: '0 0 340px', bgcolor: '#f43f6e', p: 6, position: 'relative', overflow: 'hidden',
      }}>
        <Box sx={{ position: 'absolute', top: '-10%', left: '-10%', width: 260, height: 260, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.08)' }} />
        <Box sx={{ position: 'absolute', bottom: '5%', right: '-8%', width: 180, height: 180, borderRadius: '40%', bgcolor: 'rgba(255,255,255,0.06)' }} />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box component="img" src={logofull} alt="Dyme" sx={{ height: 52, filter: 'brightness(0) invert(1)', mb: 6 }} />
          <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.5rem', fontWeight: 800, fontFamily: '"Plus Jakarta Sans", sans-serif', lineHeight: 1.3, letterSpacing: '-0.02em', mb: 2 }}>
            Let's set up your<br />financial dashboard
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: 1.7 }}>
            4 quick steps to get Dyme working for you. Takes under 2 minutes.
          </Typography>
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {[
            { n: 1, label: 'Your Goal' },
            { n: 2, label: 'Money Quiz' },
            { n: 3, label: 'Your Profile' },
            { n: 4, label: 'Bank Import' },
          ].map(({ n, label }) => (
            <Box key={n} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
              <Box sx={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.78rem',
                bgcolor: step > n ? '#fff' : (step === n ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)'),
                color: step > n ? '#f43f6e' : (step === n ? '#f43f6e' : 'rgba(255,255,255,0.7)'),
                transition: 'all 0.3s',
              }}>
                {step > n ? <Check size={13} strokeWidth={3} /> : n}
              </Box>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: step === n ? 700 : 500, color: step === n ? '#fff' : 'rgba(255,255,255,0.55)', transition: 'all 0.3s' }}>
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── Right Content ── */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: { xs: 3, md: 6 }, maxWidth: { md: 620 }, mx: { md: 'auto' }, py: { xs: 5, md: 7 } }}>

        <LinearProgress
          variant="determinate" value={progress}
          sx={{ display: { md: 'none' }, mb: 4, borderRadius: 4, height: 4, bgcolor: 'divider', '& .MuiLinearProgress-bar': { bgcolor: '#f43f6e', borderRadius: 4 } }}
        />

        <Box sx={{ flex: 1, animation: `${fadeUp} 0.35s ease both` }} key={step}>
          {step === 1 && <GoalsStep data={data} onChange={update} />}
          {step === 2 && <HabitsStep data={data} onChange={update} />}
          {step === 3 && <ProfileStep data={data} onChange={update} />}
          {step === 4 && (
            <BankStep
              onSuccess={saveProfileAndFinish}
              onSkip={saveProfileAndFinish}
            />
          )}
        </Box>

        {step < 4 && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 5, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button
              startIcon={<ArrowLeft size={16} />}
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 1}
              sx={{ color: 'text.secondary', fontWeight: 600, '&:disabled': { opacity: 0.3 } }}
            >
              Back
            </Button>

            <Typography sx={{ fontSize: '0.78rem', color: 'text.disabled' }}>
              {step} of {TOTAL_STEPS}
            </Typography>

            <Button
              endIcon={saving ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <ArrowRight size={16} />}
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext() || saving}
              variant="contained"
              sx={{
                px: 3, py: 1.2, borderRadius: '11px', fontWeight: 700,
                background: 'linear-gradient(135deg, #f43f6e, #ff6b8a)',
                boxShadow: '0 4px 16px rgba(244,63,110,0.3)',
                '&:hover': { boxShadow: '0 8px 24px rgba(244,63,110,0.4)', transform: 'translateY(-1px)' },
                '&:disabled': { background: '#e5e7eb', boxShadow: 'none', color: '#aaa' },
                transition: 'all 0.2s',
              }}
            >
              Next
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Onboarding;
