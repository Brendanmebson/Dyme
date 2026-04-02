import React from 'react';
import { Box, Typography, Container, Button, useTheme } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import {
  BarChart3, Shield, Target, TrendingUp,
  CreditCard, Link2, Zap, ArrowRight, Check,
  Smartphone, Monitor, Layers, PieChart
} from 'lucide-react';
import LandingNavbar from '../components/Landing/LandingNavbar';
import LandingFooter from '../components/Landing/LandingFooter';

// ─── Keyframes ───────────────────────────────────────────
const floatA = keyframes`
  0%,100% { transform: translateY(0px) rotate(0deg); }
  50%      { transform: translateY(-14px) rotate(1deg); }
`;
const blobDrift = keyframes`
  0%,100% { border-radius: 60% 40% 55% 45% / 45% 55% 45% 55%; transform: scale(1); }
  33%      { border-radius: 50% 50% 40% 60% / 55% 45% 55% 45%; transform: scale(1.05); }
  66%      { border-radius: 40% 60% 55% 45% / 50% 50% 50% 50%; transform: scale(0.97); }
`;

const FeatureSection = ({ title, desc, icon: Icon, color, imageSide = 'left', mockup, points }) => {
  const theme = useTheme();
  return (
    <Box sx={{ py: { xs: 5, md: 8 }, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4, md: 6 } }}>
        <Box sx={{ display: 'flex', gap: { xs: 4, md: 8 }, alignItems: 'center', flexDirection: { xs: 'column', md: imageSide === 'left' ? 'row' : 'row-reverse' }, textAlign: { xs: 'center', md: 'left' } }}>
          {/* Mockup area */}
          <Box sx={{ flex: 1, position: 'relative', width: '100%', minHeight: { xs: 200, md: 280 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ position: 'absolute', inset: 0, background: `radial-gradient(circle, ${color}10 0%, transparent 70%)` }} />
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              {mockup}
            </Box>
          </Box>

          {/* Text area */}
          <Box sx={{ flex: 1, width: '100%' }}>
            <Box sx={{ mb: 2, width: 48, height: 48, borderRadius: '14px', bgcolor: `${color}15`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: { xs: 'auto', md: 0 } }}>
              <Icon size={24} />
            </Box>
            <Typography variant="h3" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' }, lineHeight: 1.1 }}>{title}</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1rem', lineHeight: 1.7, mb: 3, maxWidth: { xs: '100%', md: 'none' }, mx: { xs: 'auto', md: 0 } }}>{desc}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, alignItems: { xs: 'center', md: 'flex-start' } }}>
              {points.map(item => (
                <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                  <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: 'success.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={11} strokeWidth={3} />
                  </Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: 'text.primary' }}>{item}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

const Features = () => {
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      <LandingNavbar />

      {/* Hero */}
      <Box sx={{ pt: { xs: '100px', md: '120px' }, pb: { xs: 6, md: 8 }, textAlign: 'center', position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', height: '100%', background: (theme) => `radial-gradient(circle at 50% 20%, rgba(244,63,110,0.06) 0%, transparent 60%)`, zIndex: 0 }} />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, px: { xs: 3, sm: 4, md: 6 } }}>
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '0.15em', mb: 1, display: 'block', fontSize: '0.7rem' }}>CAPABILITIES</Typography>
          <Typography sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: { xs: '2.2rem', md: '3.5rem' }, mb: 2, lineHeight: 1.1 }}>The complete toolkit <br /> for your wealth.</Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.95rem', md: '1.15rem' }, maxWidth: 640, mx: 'auto', mb: 3, lineHeight: 1.6 }}>Dyme combines sophisticated technology with human-centric design for total financial control.</Typography>
        </Container>
      </Box>

      {/* Feature Sections */}
      <Box component="main">
        <FeatureSection
          title="Real-time Analytics"
          desc="Watch your spending patterns evolve. Our intelligent engine categorizes transactions instantly and generates insights you can actually use."
          icon={BarChart3}
          color="#f43f6e"
          imageSide="left"
          points={['Smart auto-categorization', 'Interactive spend charts', 'Historical trend analysis']}
          mockup={
            <Box sx={{ width: { xs: '85%', sm: 260, md: 280 }, bgcolor: 'background.paper', p: 2.5, borderRadius: '24px', boxShadow: '0 24px 64px rgba(0,0,0,0.1)', border: '1px solid', borderColor: 'divider', animation: `${floatA} 6s infinite` }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, fontSize: '1rem' }}>Spend Over Time</Typography>
              <Box sx={{ height: { xs: 80, md: 100 }, display: 'flex', alignItems: 'flex-end', gap: 1, mb: 2 }}>
                {[40, 70, 45, 90, 60, 80].map((h, i) => (
                  <Box key={i} sx={{ flex: 1, height: `${h}%`, bgcolor: i === 3 ? 'primary.main' : (theme.palette.mode === 'dark' ? 'rgba(244,63,110,0.15)' : 'primary.50'), borderRadius: '3px' }} />
                ))}
              </Box>
              <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', textAlign: 'center', fontWeight: 600 }}>Avg: $420.00</Typography>
            </Box>
          }
        />

        <FeatureSection
          title="Manual & CSV Sync"
          desc="The power of total control. Import bank statements via CSV or record transactions manually with zero lag. Automated sync is coming soon."
          icon={Link2}
          color="#10b981"
          imageSide="right"
          points={['Universal CSV Parser', 'Instant Manual Entry', 'Automated Sync (Coming Soon)']}
          mockup={
            <Box sx={{ width: { xs: '85%', sm: 240, md: 280 }, bgcolor: 'background.paper', p: 3, borderRadius: '24px', boxShadow: '0 24px 64px rgba(0,0,0,0.1)', border: '1px solid', borderColor: 'divider', animation: `${floatA} 7s infinite 0.5s` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ width: 36, height: 36, bgcolor: 'primary.main', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.8rem' }}>CSV</Box>
                <Box sx={{ flex: 1, height: 2, bgcolor: 'divider' }} />
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', mb: 1 }}>Statement Uploaded</Typography>
              <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>Success: 42 records.</Typography>
            </Box>
          }
        />

        <FeatureSection
          title="Smart Budgets"
          desc="Set it and forget it. Dyme tracks your progress towards your goals and gently nudges you when you're getting close to your limits."
          icon={Target}
          color="#3b82f6"
          imageSide="left"
          points={['Category-specific limits', 'Proactive push alerts', 'Rollover budget options']}
          mockup={
            <Box sx={{ width: { xs: '80%', sm: 220, md: 240 }, bgcolor: 'background.paper', p: 2.5, borderRadius: '20px', boxShadow: '0 24px 64px rgba(0,0,0,0.1)', border: '1px solid', borderColor: 'divider', animation: `${floatA} 7s infinite 0.5s` }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, fontSize: '1rem' }}>Groceries</Typography>
              <Box sx={{ width: '100%', height: 10, bgcolor: 'divider', borderRadius: '10px', mb: 1.5, position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '85%', bgcolor: '#f59e0b', borderRadius: '10px' }} />
              </Box>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, textAlign: 'center' }}>85% of $1,000 used</Typography>
            </Box>
          }
        />

        <FeatureSection
          title="Multi-Device Sync"
          desc="Dyme is everywhere you are. Start tracking on your mobile, analyze on your tablet, and export reports from your desktop."
          icon={Smartphone}
          color="#9333ea"
          imageSide="right"
          points={['Cloud-native architecture', 'Universal Importer', 'Real-time State Sync']}
          mockup={
            <Box sx={{ position: 'relative', width: { xs: '80%', sm: 200, md: 240 }, height: 160 }}>
              <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: '45%', height: '70%', bgcolor: 'primary.main', borderRadius: '16px', boxShadow: '0 20px 40px rgba(244,63,110,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, animation: `${floatA} 8s infinite` }}>
                <Smartphone size={28} color="white" />
              </Box>
              <Box sx={{ position: 'absolute', top: 0, right: 0, width: '60%', height: '80%', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, animation: `${floatA} 8s infinite reverse` }}>
                <Monitor size={32} color={theme.palette.text.secondary} />
              </Box>
            </Box>
          }
        />
      </Box>

      {/* Final CTA */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#0a0a0f', color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, px: { xs: 3, md: 6 } }}>
          <Typography variant="h2" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, mb: 3, fontSize: { xs: '2rem', md: '3rem' } }}>Achieve financial <br /> freedom today.</Typography>
          <Button variant="contained" endIcon={<ArrowRight size={20} />} sx={{ px: { xs: 4, md: 5 }, py: 2, borderRadius: '16px', fontWeight: 800, fontSize: { xs: '1rem', md: '1.1rem' }, bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}>
            Start for Free
          </Button>
          <Typography sx={{ mt: 2, color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 600 }}>No credit card required</Typography>
        </Container>
      </Box>

      <LandingFooter />
    </Box>
  );
};

export default Features;
