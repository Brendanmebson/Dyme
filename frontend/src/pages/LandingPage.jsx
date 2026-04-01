// LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';
import {
  ArrowRight, BarChart3, Shield, Zap, Target, TrendingUp,
  CreditCard, Check, ArrowUpRight, Menu, X,
} from 'lucide-react';
import { keyframes } from '@mui/material/styles';
import logofull from '../assets/Dyme logo full.png';
import logo from '../assets/Dyme logo.png';
import FooterBackground from '../components/Landing/FooterBackground';

// ─── Keyframes ───────────────────────────────────────────
const floatA = keyframes`
  0%,100% { transform: translateY(0px) rotate(0deg); }
  50%      { transform: translateY(-14px) rotate(1deg); }
`;
const floatB = keyframes`
  0%,100% { transform: translateY(0px) rotate(0deg); }
  50%      { transform: translateY(-10px) rotate(-1.5deg); }
`;
const floatC = keyframes`
  0%,100% { transform: translateY(0px); }
  50%      { transform: translateY(-8px); }
`;
const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const fadeSlideRight = keyframes`
  from { opacity: 0; transform: translateX(-24px); }
  to   { opacity: 1; transform: translateX(0); }
`;
const blobDrift = keyframes`
  0%,100% { border-radius: 60% 40% 55% 45% / 45% 55% 45% 55%; transform: scale(1); }
  33%      { border-radius: 50% 50% 40% 60% / 55% 45% 55% 45%; transform: scale(1.05); }
  66%      { border-radius: 40% 60% 55% 45% / 50% 50% 50% 50%; transform: scale(0.97); }
`;
const lineGrow = keyframes`
  from { width: 0; }
  to   { width: 100%; }
`;
const tickIn = keyframes`
  from { opacity: 0; transform: scale(0.4); }
  to   { opacity: 1; transform: scale(1); }
`;

// ─── Data ────────────────────────────────────────────────
const FEATURES = [
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    desc: 'See exactly where your money goes with live charts updated on every transaction.',
  },
  {
    icon: Target,
    title: 'Smart Budgets',
    desc: 'Set monthly limits per category and get notified before you go over.',
  },
  {
    icon: Shield,
    title: 'Bank-grade Security',
    desc: '256-bit AES encryption, biometric login, and zero data selling. Period.',
  },
  {
    icon: Zap,
    title: 'Instant Sync',
    desc: 'Log a purchase in under 4 seconds. Syncs across all your devices instantly.',
  },
  {
    icon: TrendingUp,
    title: 'Monthly Reports',
    desc: 'Downloadable PDF and CSV summaries for personal review or tax filing.',
  },
  {
    icon: CreditCard,
    title: 'Multi-category',
    desc: '12 spending categories built in. Add custom ones to fit your lifestyle.',
  },
];

const PRICING = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    cta: 'Get started free',
    features: [
      '100 transactions/month',
      '3 budget categories',
      'Basic bar charts',
      'CSV export',
      'Mobile app access',
    ],
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$6',
    period: '/mo',
    cta: 'Start 14-day trial',
    features: [
      'Unlimited transactions',
      'Unlimited budgets',
      'Spending insights',
      'Advanced analytics',
      'Priority support',
      'Custom categories',
      'Recurring rules',
    ],
    highlight: true,
    badge: 'Most popular',
  },
  {
    name: 'Family',
    price: '$12',
    period: '/mo',
    cta: 'Get Family plan',
    features: [
      'Everything in Pro',
      'Up to 6 members',
      'Shared budgets',
      'Per-member reports',
      'Family spending overview',
      'Dedicated support',
    ],
    highlight: false,
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah K.',
    role: 'Freelance Designer',
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face',
    text: "Finally a finance app that doesn't feel like filing taxes. I actually open it every morning.",
  },
  {
    name: 'Marcus T.',
    role: 'Software Engineer',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    text: 'Cut my food spend by $210 in my first month just by seeing it laid out clearly. No other app did that.',
  },
  {
    name: 'Priya M.',
    role: 'Product Manager',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face',
    text: "The budget alerts are what sold me. Haven't gone over my grocery budget in 11 weeks straight.",
  },
];

const PROOF_FACES = [
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=60&h=60&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&h=60&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop&crop=face',
];

// ─── Shared styles ───────────────────────────────────────
const sectionHead = {
  fontFamily: '"Syne", "Plus Jakarta Sans", sans-serif',
  fontWeight: 800,
  letterSpacing: '-0.04em',
  lineHeight: 1.08,
  color: '#0d0d0d',
};

const overline = {
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: '#f43f6e',
  mb: 2,
  display: 'block',
};

// ─── Logo Component ───────────────────────────────────────
const DymeLogo = ({ height = 50, priority = "auto" }) => (
  <Box
    component="img"
    src={logofull}
    alt="Dyme"
    fetchpriority={priority}
    sx={{ height, width: 'auto', display: 'block' }}
  />
);

// ─── Component ───────────────────────────────────────────
const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const NAV_LINKS = [
    { label: 'Features', id: 'features' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'Why Us', id: 'why-us' },
  ];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <Box sx={{ bgcolor: '#fafaf87a', overflowX: 'hidden', fontFamily: '"DM Sans", "Plus Jakarta Sans", sans-serif' }}>

      {/* ══════════════════════════════════════
          NAV
      ══════════════════════════════════════ */}
      <Box
        component="nav"
        sx={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
          px: { xs: 3, md: 6 }, py: 1.5,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'all 0.3s',
          bgcolor: scrolled ? 'rgba(250,250,248,0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
        }}
      >
        <Box onClick={() => navigate('/landing')} sx={{ cursor: 'pointer' }}>
          <DymeLogo height={50} priority="high" />
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, alignItems: 'center' }}>
          {NAV_LINKS.map(({ label, id }) => (
            <Typography
              key={label}
              onClick={() => scrollTo(id)}
              sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#5a5a5a', cursor: 'pointer', transition: 'color 0.2s', '&:hover': { color: '#0d0d0d' } }}
            >
              {label}
            </Typography>
          ))}
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1.5, alignItems: 'center' }}>
          <Button onClick={() => navigate('/login')} sx={{ color: '#5a5a5a', fontWeight: 600, fontSize: '0.875rem', px: 2, borderRadius: '8px' }}>Login</Button>
          <Button onClick={() => navigate('/login')} sx={{ bgcolor: '#0d0d0d', color: '#fff', fontWeight: 600, fontSize: '0.875rem', px: 2.5, py: 0.85, borderRadius: '9px', '&:hover': { bgcolor: '#1a1a1a', transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(0,0,0,0.15)' }, transition: 'all 0.2s' }}>Join free</Button>
        </Box>

        {/* Mobile Nav Icon */}
        <Box
          onClick={() => setMobileMenuOpen(true)}
          sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', cursor: 'pointer', p: 1, transition: 'transform 0.3s ease, opacity 0.3s', transform: mobileMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)', opacity: mobileMenuOpen ? 0 : 1, pointerEvents: mobileMenuOpen ? 'none' : 'auto' }}
        >
          <Menu size={24} color="#0d0d0d" />
        </Box>
      </Box>

      {/* Mobile Menu Backdrop */}
      <Box
        onClick={() => setMobileMenuOpen(false)}
        sx={{
          position: 'fixed', inset: 0, zIndex: 9998,
          bgcolor: 'rgba(250,250,248,0.5)',
          backdropFilter: mobileMenuOpen ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: mobileMenuOpen ? 'blur(12px)' : 'none',
          opacity: mobileMenuOpen ? 1 : 0,
          pointerEvents: mobileMenuOpen ? 'auto' : 'none',
          transition: 'opacity 0.4s ease, backdrop-filter 0.4s ease',
          display: { xs: 'block', md: 'none' }
        }}
      />

      {/* Mobile Menu Drawer */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bgcolor: 'rgba(250,250,248,0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          px: 3,
          pt: 1.5,
          pb: 4,
          borderBottomLeftRadius: '24px',
          borderBottomRightRadius: '24px',
          transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: mobileMenuOpen ? '0 10px 40px rgba(0,0,0,0.1)' : 'none',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
          <Box onClick={() => setMobileMenuOpen(false)} sx={{ cursor: 'pointer' }}>
            <DymeLogo height={50} priority="high" />
          </Box>
          <Box onClick={() => setMobileMenuOpen(false)} sx={{ cursor: 'pointer', p: 1, transform: mobileMenuOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.4s ease 0.1s' }}>
            <X size={28} color="#0d0d0d" />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1, px: 1, mb: 4 }}>
          {['About', 'Features', 'FAQs'].map((label) => (
            <Typography
              key={label}
              onClick={() => {
                setMobileMenuOpen(false);
                const id = label.toLowerCase();
                scrollTo(id);
              }}
              sx={{ fontSize: '1.8rem', fontWeight: 700, color: '#0d0d0d', cursor: 'pointer', letterSpacing: '-0.02em', '&:hover': { color: '#f43f6e' } }}
            >
              {label}
            </Typography>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: '100%', mt: 'auto' }}>
          <Button
            fullWidth
            onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
            sx={{ color: '#0d0d0d', border: '1.5px solid rgba(0,0,0,0.12)', fontWeight: 700, fontSize: '0.95rem', py: 1.5, borderRadius: '12px' }}
          >
            Login
          </Button>
          <Button
            fullWidth
            onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
            sx={{ bgcolor: '#0d0d0d', color: '#fff', fontWeight: 700, fontSize: '0.95rem', py: 1.5, borderRadius: '12px', '&:hover': { bgcolor: '#1a1a1a' } }}
          >
            Sign up
          </Button>
        </Box>
      </Box>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <Box sx={{ minHeight: '100vh', pt: '90px', pb: 12, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 0, background: 'radial-gradient(ellipse 70% 60% at 100% 20%, rgba(244,63,110,0.10) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 10% 80%, rgba(16,185,129,0.07) 0%, transparent 70%), #fafaf8' }} />
        <Box sx={{ position: 'absolute', top: '-5%', right: '-8%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(244,63,110,0.13) 0%, transparent 70%)', animation: `${blobDrift} 14s ease-in-out infinite`, pointerEvents: 'none', zIndex: 0 }} />
        <Box sx={{ position: 'absolute', bottom: '5%', left: '-5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(16,185,129,0.09) 0%, transparent 70%)', animation: `${blobDrift} 18s ease-in-out infinite 3s`, pointerEvents: 'none', zIndex: 0 }} />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, px: { xs: 3, md: 12 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, lg: 6 }, flexWrap: { xs: 'wrap', lg: 'nowrap' } }}>

            {/* Left */}
            <Box sx={{ flex: '0 0 auto', width: { xs: '100%', lg: '48%' }, pr: { lg: 4 }, pt: { xs: '10px', md: '40px' } }}>
              <Typography component="h1" sx={{ ...sectionHead, fontSize: { xs: '3.8rem', sm: '3.5rem', md: '5rem' }, lineHeight: { xs: 1.1, md: 1.08 }, mb: 3, maxWidth: 560, animation: `${fadeSlideRight} 0.55s ease 0.08s both` }}>
                <Box component="span" sx={{ display: { xs: 'block', sm: 'inline' } }}>Reimagine</Box>{' '}
                <Box component="span" sx={{ position: 'relative', display: { xs: 'inline-block', sm: 'inline-block' }, '&::after': { content: '""', position: 'absolute', bottom: '4px', left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #f43f6e, #ff8fa3)', borderRadius: '2px', animation: `${lineGrow} 0.9s cubic-bezier(0.4,0,0.2,1) 0.6s both` } }}>money.</Box>
                <Box component="br" sx={{ display: { xs: 'none', sm: 'block' } }} />
                <Box component="span" sx={{ color: '#f43f6e', display: { xs: 'block', sm: 'inline' }, mt: { xs: 1, sm: 0 } }}>Simple</Box>{' '}
                <Box component="span" sx={{ display: { xs: 'block', sm: 'inline' } }}>solutions.</Box>
              </Typography>

              <Typography sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, color: '#6b6b6b', lineHeight: 1.7, maxWidth: 440, mb: 5, animation: `${fadeSlideRight} 0.55s ease 0.18s both` }}>
                Automatically track your expenses, set budgets, and achieve your financial goals — beautifully.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 5, animation: `${fadeSlideRight} 0.55s ease 0.26s both` }}>
                <Button onClick={() => navigate('/login')} sx={{ bgcolor: '#0d0d0d', color: '#fff', fontWeight: 700, fontSize: '0.95rem', px: 3.5, py: 1.4, borderRadius: '12px', display: 'flex', alignItems: 'center', gap: 1, boxShadow: '0 4px 20px rgba(0,0,0,0.18)', '&:hover': { bgcolor: '#1f1f1f', transform: 'translateY(-2px)', boxShadow: '0 10px 30px rgba(0,0,0,0.22)' }, transition: 'all 0.22s' }}>
                  Create Account <ArrowRight size={16} />
                </Button>
                <Button onClick={() => navigate('/login')} sx={{ color: '#0d0d0d', fontWeight: 600, fontSize: '0.95rem', px: 3.5, py: 1.4, borderRadius: '12px', border: '1.5px solid rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', gap: 1, '&:hover': { borderColor: '#f43f6e', color: '#f43f6e', bgcolor: 'rgba(244,63,110,0.04)' }, transition: 'all 0.2s' }}>
                  Contact Sales <ArrowUpRight size={15} />
                </Button>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, animation: `${fadeSlideRight} 0.55s ease 0.34s both` }}>
                <Box sx={{ display: 'flex' }}>
                  {PROOF_FACES.map((src, i) => (
                    <Box key={i} sx={{ width: 30, height: 30, borderRadius: '50%', border: '2.5px solid #fafaf8', ml: i > 0 ? '-8px' : 0, zIndex: 5 - i, overflow: 'hidden', flexShrink: 0 }}>
                      <img src={src} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                  ))}
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#0d0d0d' }}>4.8 ★ on the App Store</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#888' }}>Trusted by 8,400+ users worldwide</Typography>
                </Box>
              </Box>
            </Box>

            {/* Right — floating cards */}
            <Box sx={{ flex: '1 1 0', position: 'relative', height: { xs: 420, lg: 540 }, display: { xs: 'none', md: 'block' }, mt: { xs: 6, lg: 0 } }}>
              <Box sx={{ position: 'absolute', top: '5%', left: '12%', width: 260, zIndex: 3, animation: `${floatA} 6s ease-in-out infinite` }}>
                <Box sx={{ bgcolor: '#fff', borderRadius: '24px', boxShadow: '0 24px 64px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                  <Box sx={{ bgcolor: '#f43f6e', px: 2.5, py: 2, color: '#fff' }}>
                    <Typography sx={{ fontSize: '0.7rem', opacity: 0.8, fontWeight: 500, mb: 0.5 }}>Total Savings This Year</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: '"Syne", sans-serif', letterSpacing: '-0.03em' }}>$4,830</Typography>
                      <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '20px', px: 1.5, py: 0.4, fontSize: '0.65rem', fontWeight: 600 }}>↑ 18%</Box>
                    </Box>
                    <Box sx={{ mt: 1.5, height: 36 }}>
                      <svg width="100%" height="36" viewBox="0 0 220 36" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                          </linearGradient>
                        </defs>
                        <path d="M0,28 C30,24 50,30 80,20 C110,10 130,22 160,14 C180,8 200,16 220,10 L220,36 L0,36Z" fill="url(#sparkGrad)" />
                        <path d="M0,28 C30,24 50,30 80,20 C110,10 130,22 160,14 C180,8 200,16 220,10" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" />
                      </svg>
                    </Box>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1 }}>Monthly Income</Typography>
                    <Typography sx={{ fontSize: '1.4rem', fontWeight: 800, color: '#0d0d0d', fontFamily: '"Syne", sans-serif', letterSpacing: '-0.03em', mb: 0.5 }}>$5,200.00</Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>$840 under budget this month</Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ position: 'absolute', top: '38%', left: '2%', width: 200, zIndex: 4, animation: `${floatB} 7s ease-in-out infinite 1s` }}>
                <Box sx={{ bgcolor: '#fff', borderRadius: '18px', boxShadow: '0 16px 48px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)', p: 2 }}>
                  <Typography sx={{ fontSize: '0.65rem', color: '#999', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1.5 }}>Spending This Month</Typography>
                  {[
                    { label: 'Food & Dining', pct: 68, color: '#f43f6e', amount: '$354' },
                    { label: 'Shopping', pct: 42, color: '#7c3aed', amount: '$218' },
                    { label: 'Transport', pct: 28, color: '#3b82f6', amount: '$146' },
                  ].map(({ label, pct, color, amount }) => (
                    <Box key={label} sx={{ mb: 1.25 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.4 }}>
                        <Typography sx={{ fontSize: '0.68rem', color: '#444', fontWeight: 500 }}>{label}</Typography>
                        <Typography sx={{ fontSize: '0.68rem', color: '#888', fontWeight: 500 }}>{amount}</Typography>
                      </Box>
                      <Box sx={{ height: 5, bgcolor: '#f3f3f1', borderRadius: '10px', overflow: 'hidden' }}>
                        <Box sx={{ height: '100%', width: `${pct}%`, bgcolor: color, borderRadius: '10px' }} />
                      </Box>
                    </Box>
                  ))}
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#f43f6e', mt: 1.5, fontFamily: '"Syne", sans-serif' }}>Total spent: $1,247</Typography>
                </Box>
              </Box>

              <Box sx={{ position: 'absolute', top: '28%', right: '2%', width: 218, zIndex: 5, animation: `${floatC} 5s ease-in-out infinite 0.5s` }}>
                <Box sx={{ bgcolor: '#fff', borderRadius: '18px', boxShadow: '0 16px 48px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)', p: 2 }}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#0d0d0d', mb: 1.5 }}>Recent Transactions</Typography>
                  {[
                    { name: 'Whole Foods Market', card: 'Debit •••4821', amount: '-$62.40', color: '#f43f6e', bg: '#fff1f3', initials: 'WF' },
                    { name: 'Uber', card: 'Credit •••9034', amount: '-$14.80', color: '#3b82f6', bg: '#dbeafe', initials: 'UB' },
                  ].map((tx, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: i === 0 ? 1.25 : 0, pb: i === 0 ? 1.25 : 0, borderBottom: i === 0 ? '1px solid #f3f3f1' : 'none' }}>
                      <Box sx={{ width: 32, height: 32, borderRadius: '9px', bgcolor: tx.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700, color: tx.color, flexShrink: 0 }}>{tx.initials}</Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: '#0d0d0d', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.name}</Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: '#aaa' }}>{tx.card}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#f43f6e', flexShrink: 0 }}>{tx.amount}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box sx={{ position: 'absolute', bottom: '4%', left: '6%', right: '6%', zIndex: 2, animation: `${fadeSlideUp} 0.7s ease 0.6s both` }} />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ══════════════════════════════════════
          WHY US
      ══════════════════════════════════════ */}
      <Box id="why-us" sx={{ py: { xs: 10, md: 10 }, bgcolor: '#fff' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 9 }}>
            <Typography sx={{ ...overline }}>Why Us</Typography>
            <Typography sx={{ ...sectionHead, fontSize: { xs: '2rem', md: '3rem' } }}>
              Why they prefer Dyme
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap', mb: 2.5 }}>
            <Box sx={{ flex: '1 1 200px', minWidth: 200, minHeight: 220, bgcolor: '#fff1f3', borderRadius: '20px', border: '1px solid rgba(244,63,110,0.12)', p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.25s', '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 36px rgba(244,63,110,0.10)' } }}>
              <Typography sx={{ fontFamily: '"Syne", sans-serif', fontSize: '3.8rem', fontWeight: 800, letterSpacing: '-0.05em', color: '#f43f6e', lineHeight: 1 }}>8.4k+</Typography>
              <Typography sx={{ fontSize: '0.9rem', color: '#7a2a3a', fontWeight: 500, mt: 2, lineHeight: 1.5 }}>Active users tracking<br />their finances daily</Typography>
            </Box>

            <Box sx={{ flex: '2 1 340px', minHeight: 220, bgcolor: '#fafaf8', borderRadius: '20px', border: '1px solid #ebebea', p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.25s', '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 36px rgba(0,0,0,0.06)' } }}>
              <Typography sx={{ fontSize: '1.15rem', fontWeight: 700, color: '#0d0d0d', maxWidth: 300, lineHeight: 1.45 }}>
                Instant access to your balance — no waiting, no lock-in
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3 }}>
                <Box sx={{ width: 54, height: 54, borderRadius: '16px', bgcolor: '#f43f6e', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 4px 16px rgba(244,63,110,0.3)', p: 0.5 }}>
                  <Box component="img" src={logo} alt="Dyme" loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </Box>
                <Box sx={{ flex: 1, position: 'relative', height: 2, bgcolor: '#f0e0e4' }}>
                  <Box sx={{ position: 'absolute', left: '18%', top: '50%', transform: 'translateY(-50%)', width: 7, height: 7, bgcolor: '#f43f6e', borderRadius: '50%' }} />
                  <Box sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translateY(-50%)', width: 7, height: 7, bgcolor: '#f43f6e', borderRadius: '50%', opacity: 0.45 }} />
                  <Box sx={{ position: 'absolute', left: '78%', top: '50%', transform: 'translateY(-50%)', width: 7, height: 7, bgcolor: '#f43f6e', borderRadius: '50%', opacity: 0.2 }} />
                </Box>
                <Box sx={{ width: 54, height: 54, borderRadius: '16px', bgcolor: '#0d0d0d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>🏦</Box>
              </Box>
            </Box>
          </Box>

          <Box sx={{ bgcolor: '#fafaf8', borderRadius: '20px', border: '1px solid #ebebea', p: 4, display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center', transition: 'all 0.25s', '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 36px rgba(0,0,0,0.06)' } }}>
            <Box sx={{ flex: '0 0 auto', maxWidth: 260 }}>
              <Typography sx={{ fontSize: '1.4rem', fontWeight: 700, color: '#0d0d0d', mb: 1.5, lineHeight: 1.35 }}>
                Your savings grow,<br />automatically.
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: '#999', lineHeight: 1.75 }}>
                Users who stick to their budgets save an average of $3,200 in their first year.
              </Typography>
            </Box>
            <Box sx={{ flex: '1 1 260px', minWidth: 260 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1.5 }}>
                <Box>
                  <Typography sx={{ fontSize: '0.65rem', color: '#bbb', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Avg. Annual Savings</Typography>
                  <Typography sx={{ fontFamily: '"Syne", sans-serif', fontSize: '1.6rem', fontWeight: 800, color: '#0d0d0d', letterSpacing: '-0.04em' }}>$3,200</Typography>
                </Box>
                <Typography sx={{ fontSize: '0.72rem', color: '#f43f6e', fontWeight: 600, bgcolor: 'rgba(244,63,110,0.07)', px: 1.5, py: 0.5, borderRadius: '100px', border: '1px solid rgba(244,63,110,0.15)' }}>
                  ↑ per user / yr
                </Typography>
              </Box>
              <Box sx={{ height: 72 }}>
                <svg width="100%" height="72" viewBox="0 0 400 72" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(244,63,110,0.14)" />
                      <stop offset="100%" stopColor="rgba(244,63,110,0)" />
                    </linearGradient>
                  </defs>
                  <path d="M0,62 C60,58 100,52 140,44 C180,36 220,26 260,18 C300,10 340,6 400,3 L400,72 L0,72Z" fill="url(#chartGrad)" />
                  <path d="M0,62 C60,58 100,52 140,44 C180,36 220,26 260,18 C300,10 340,6 400,3" fill="none" stroke="#f43f6e" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(m => (
                  <Typography key={m} sx={{ fontSize: '0.65rem', color: '#ccc' }}>{m}</Typography>
                ))}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ══════════════════════════════════════
          FEATURES
      ══════════════════════════════════════ */}
      <Box id="features" sx={{ py: { xs: 10, md: 10 }, bgcolor: '#fafaf8' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', gap: { xs: 4, md: 10 }, flexWrap: 'wrap', mb: 10, alignItems: 'flex-start' }}>
            <Box sx={{ flex: '0 0 auto', maxWidth: 480 }}>
              <Typography sx={{ ...overline }}>Features</Typography>
              <Typography sx={{ ...sectionHead, fontSize: { xs: '2.2rem', md: '3.2rem' } }}>
                Everything you need,<br />nothing you don't.
              </Typography>
            </Box>
            <Box sx={{ flex: '1 1 260px', pt: { md: 1.5 } }}>
              <Typography sx={{ fontSize: '1rem', color: '#888', lineHeight: 1.8, maxWidth: 360 }}>
                Dyme is built around simplicity. We cut the bloat, kept the power, and made it actually pleasant to use every day.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', border: '1px solid #e8e8e4', borderRadius: '20px', overflow: 'hidden' }}>
            {FEATURES.map((f, i) => {
              const col = i % 3;
              const row = Math.floor(i / 3);
              const totalRows = Math.ceil(FEATURES.length / 3);
              const isLastRow = row === totalRows - 1;
              const isLastCol = col === 2;
              return (
                <Box
                  key={i}
                  sx={{
                    width: { xs: '100%', sm: '50%', md: '33.333%' },
                    flexShrink: 0,
                    p: { xs: 3, md: 4 },
                    borderBottom: isLastRow ? 'none' : '1px solid #e8e8e4',
                    borderRight: { md: isLastCol ? 'none' : '1px solid #e8e8e4' },
                    bgcolor: '#fff',
                    transition: 'all 0.22s',
                    '&:hover': { bgcolor: '#fff8f9' },
                    cursor: 'default',
                    boxSizing: 'border-box',
                  }}
                >
                  <Box sx={{ mb: 3, width: 44, height: 44, borderRadius: '12px', border: '1.5px solid rgba(244,63,110,0.2)', bgcolor: 'rgba(244,63,110,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f43f6e' }}>
                    <f.icon size={20} strokeWidth={1.5} />
                  </Box>
                  <Typography sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: '0.975rem', color: '#0d0d0d', mb: 1.25 }}>{f.title}</Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#999', lineHeight: 1.75 }}>{f.desc}</Typography>
                  <Box sx={{ mt: 2.5 }}><ArrowUpRight size={15} color="rgba(244,63,110,0.3)" /></Box>
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* ══════════════════════════════════════
          PRICING
      ══════════════════════════════════════ */}
      <Box id="pricing" sx={{ py: { xs: 10, md: 10 }, bgcolor: '#fff' }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 9 }}>
            <Typography sx={{ ...overline }}>Pricing</Typography>
            <Typography sx={{ ...sectionHead, fontSize: { xs: '2rem', md: '3rem' } }}>
              Simple pricing,<br />no surprises.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
            {PRICING.map((plan, i) => (
              <Box key={i} sx={{ flex: '1 1 240px', maxWidth: 340, position: 'relative', bgcolor: plan.highlight ? '#0d0d0d' : '#fafaf8', borderRadius: '20px', border: plan.highlight ? '1px solid #222' : '1px solid #ebebea', p: 4, transition: 'transform 0.25s', '&:hover': { transform: 'translateY(-4px)' } }}>
                {plan.badge && (
                  <Box sx={{ position: 'absolute', top: 20, right: 20, bgcolor: '#f43f6e', color: '#fff', borderRadius: '100px', px: 1.5, py: 0.4, fontSize: '0.63rem', fontWeight: 700, boxShadow: '0 3px 10px rgba(244,63,110,0.3)' }}>{plan.badge}</Box>
                )}
                <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: plan.highlight ? '#f43f6e' : '#bbb', mb: 3 }}>{plan.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 1 }}>
                  <Typography sx={{ fontFamily: '"Syne", sans-serif', fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.06em', color: plan.highlight ? '#fff' : '#0d0d0d', lineHeight: 1 }}>{plan.price}</Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: plan.highlight ? '#555' : '#ccc', fontWeight: 500 }}>{plan.period}</Typography>
                </Box>
                <Box sx={{ height: '1px', bgcolor: plan.highlight ? 'rgba(255,255,255,0.07)' : '#e8e8e4', my: 3 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
                  {plan.features.map(feat => (
                    <Box key={feat} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0, border: plan.highlight ? '1.5px solid rgba(244,63,110,0.5)' : '1.5px solid #d8d8d2', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: `${tickIn} 0.3s ease both` }}>
                        <Check size={9} color={plan.highlight ? '#ff8fa3' : '#aaa'} strokeWidth={3} />
                      </Box>
                      <Typography sx={{ fontSize: '0.855rem', color: plan.highlight ? 'rgba(255,255,255,0.6)' : '#666', fontWeight: 400 }}>{feat}</Typography>
                    </Box>
                  ))}
                </Box>
                <Button fullWidth onClick={() => navigate('/login')} sx={{ borderRadius: '10px', py: 1.3, fontWeight: 600, fontSize: '0.875rem', ...(plan.highlight ? { background: 'linear-gradient(135deg, #f43f6e, #ff6b8a)', color: '#fff', boxShadow: '0 4px 18px rgba(244,63,110,0.35)', '&:hover': { boxShadow: '0 8px 26px rgba(244,63,110,0.45)', transform: 'translateY(-1px)' } } : { bgcolor: '#0d0d0d', color: '#fff', '&:hover': { bgcolor: '#222' } }), transition: 'all 0.2s' }}>{plan.cta}</Button>
              </Box>
            ))}
          </Box>

          <Typography sx={{ fontSize: '0.8rem', color: '#ccc', textAlign: 'center', mt: 4 }}>
            All plans include a 14-day free trial · Cancel any time · No credit card for Free plan (Disclamer just a prototype)
          </Typography>
        </Container>
      </Box>

      {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      <Box sx={{ py: { xs: 10, md: 16 }, bgcolor: '#fafaf8' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', gap: { xs: 4, md: 10 }, flexWrap: 'wrap', mb: 10, alignItems: 'flex-end' }}>
            <Box sx={{ flex: '0 0 auto' }}>
              <Typography sx={{ ...overline }}>Testimonials</Typography>
              <Typography sx={{ ...sectionHead, fontSize: { xs: '2rem', md: '2.8rem' } }}>
                People actually<br />love it.
                <Typography sx={{ fontSize: '1.75rem', color: '#bbb' }}>Don't take our word for it.</Typography>
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {TESTIMONIALS.map((t, i) => (
              <Box key={i} sx={{ flex: '1 1 260px', maxWidth: 380, bgcolor: '#fff', borderRadius: '20px', border: '1px solid #ebebea', p: 4, transition: 'all 0.25s', '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 40px rgba(244,63,110,0.07)', borderColor: 'rgba(244,63,110,0.15)' } }}>
                <Typography sx={{ fontSize: '2.8rem', color: 'rgba(244,63,110,0.15)', fontFamily: 'Georgia, serif', lineHeight: 1, mb: 2, mt: -0.5 }}>"</Typography>
                <Typography sx={{ fontSize: '0.925rem', color: '#555', lineHeight: 1.8, mb: 4 }}>{t.text}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: 3, borderTop: '1px solid #f3f3f1' }}>
                  <Box sx={{ width: 42, height: 42, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid #f3f3f1' }}>
                    <img src={t.photo} alt={t.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#0d0d0d' }}>{t.name}</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#c0c0b8' }}>{t.role}</Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ══════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════ */}
      <Box sx={{ py: { xs: 8, md: 12 }, px: 3, bgcolor: '#fff' }}>
        <Container maxWidth="md">
          <Box sx={{ borderRadius: '35px', overflow: 'hidden', position: 'relative', background: 'linear-gradient(140deg, #0d0d0d 0%, #1a0a10 50%, #200812 100%)', border: '1px solid #2a1018', p: { xs: 6, md: 10 } }}>
            <Box sx={{ position: 'absolute', top: '-20%', right: '-5%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0, 0, 0, 0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
            <Box sx={{ position: 'absolute', bottom: '-15%', left: '-5%', width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,63,110,0.08) 0%, transparent 65%)', pointerEvents: 'none' }} />
            <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', gap: { xs: 4, md: 10 }, flexWrap: 'wrap', alignItems: 'center' }}>
              <Box sx={{ flex: '1 1 300px' }}>
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#f43f6e', mb: 2.5 }}>Start for free</Typography>
                <Typography sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, letterSpacing: '-0.04em', fontSize: { xs: '2rem', md: '2.8rem' }, color: '#fff', lineHeight: 1.1, mb: 2 }}>Start tracking today.</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.95rem', lineHeight: 1.75 }}>No credit card. No setup fees. Just clarity over your money from day one.</Typography>
              </Box>
              <Box sx={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 2, alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
                <Button onClick={() => navigate('/login')} sx={{ background: 'linear-gradient(135deg, #f43f6e, #ff6b8a)', color: '#fff', fontWeight: 700, fontSize: '0.9rem', px: 3.5, py: 1.4, borderRadius: '11px', display: 'inline-flex', alignItems: 'center', gap: 1, boxShadow: '0 6px 24px rgba(244,63,110,0.4)', '&:hover': { boxShadow: '0 10px 32px rgba(244,63,110,0.55)', transform: 'translateY(-2px)' }, transition: 'all 0.22s' }}>
                  Get started free <ArrowRight size={16} />
                </Button>
                <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.8)' }}>Free plan · No card required</Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <Box
        component="footer"
        sx={{
          bgcolor: '#0a0a0f',
          pt: 12, pb: 6,
          px: { xs: 3, md: 8 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background SVG */}
        <FooterBackground />

        {/* Footer Content */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', gap: { xs: 6, md: 14 }, flexWrap: 'wrap', pb: 8, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>

            {/* Brand */}
            <Box sx={{ flex: '0 0 auto', maxWidth: 260 }}>
              <Box sx={{ width: 52, height: 52, borderRadius: '14px', background: 'linear-gradient(135deg,rgba(244,63,110,0.18),rgba(244,63,110,0.06))', border: '1px solid rgba(244,63,110,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', p: 0.75, mb: 2.5 }}>
                <Box component="img" src={logo} alt="Dyme" loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </Box>
              <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', mb: 1, fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '-0.01em' }}>
                Dyme
              </Typography>
              <Typography sx={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.32)', lineHeight: 1.85, mb: 4 }}>
                Your money, finally clear. Track spending, set budgets, and build better habits — all in one place.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.25 }}>
                {[{ label: '𝕏', title: 'X' }, { label: 'in', title: 'LinkedIn' }, { label: 'ig', title: 'Instagram' }].map(({ label, title }) => (
                  <Box key={label} title={title} sx={{ width: 34, height: 34, borderRadius: '9px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.72rem', color: 'rgba(255,255,255,0.38)', fontWeight: 700, transition: 'all 0.2s ease', '&:hover': { borderColor: '#f43f6e', color: '#f43f6e', bgcolor: 'rgba(244,63,110,0.1)', transform: 'translateY(-2px)', boxShadow: '0 4px 16px rgba(244,63,110,0.2)' } }}>
                    {label}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Link columns */}
            {[
              { heading: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
              { heading: 'Company', links: ['Why Us', 'Blog', 'Careers', 'Press'] },
              { heading: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'] },
            ].map(({ heading, links }) => (
              <Box key={heading} sx={{ flex: '1 1 120px' }}>
                <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', mb: 3 }}>
                  {heading}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {links.map((link) => (
                    <Typography key={link} sx={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.38)', cursor: 'pointer', fontWeight: 400, transition: 'all 0.2s ease', width: 'fit-content', '&:hover': { color: '#fff', transform: 'translateX(3px)' } }}>
                      {link}
                    </Typography>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>

          {/* Bottom bar */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, pt: 5 }}>
            <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.18)' }}>
              © 2026 Dyme Inc. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              {['Privacy', 'Terms', 'Cookies'].map((item) => (
                <Typography key={item} sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.22)', cursor: 'pointer', transition: 'color 0.2s', '&:hover': { color: 'rgba(255,255,255,0.6)' } }}>
                  {item}
                </Typography>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

    </Box>
  );
};

export default LandingPage;