import React from 'react';
import { Box, Typography, Container, Button, useTheme, Avatar } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import { ArrowRight, Shield, Target, Zap, Check, Users, Globe, Lock } from 'lucide-react';
import LandingNavbar from '../components/Landing/LandingNavbar';
import LandingFooter from '../components/Landing/LandingFooter';

// ─── Keyframes ───────────────────────────────────────────
const floatA = keyframes`
  0%,100% { transform: translateY(0px) rotate(0deg); }
  50%      { transform: translateY(-14px) rotate(1deg); }
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

const TEAM = [
  { name: 'Kamsiyochukwu B Mebuge', role: 'Founder & Lead Creator', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' }
];

const About = () => {
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      <LandingNavbar />

      {/* Hero section */}
      <Box sx={{ pt: { xs: '120px', md: '160px' }, pb: { xs: 8, md: 12 }, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 0, background: (theme) => `radial-gradient(ellipse 70% 60% at 100% 20%, rgba(244,63,110,0.08) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 10% 80%, rgba(16,185,129,0.05) 0%, transparent 70%), ${theme.palette.mode === 'dark' ? '#121212' : '#fafaf8'}` }} />
        <Box sx={{ position: 'absolute', top: '-5%', right: '-8%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(244,63,110,0.1) 0%, transparent 70%)', animation: `${blobDrift} 14s ease-in-out infinite`, pointerEvents: 'none', zIndex: 0 }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, px: { xs: 3, sm: 4, md: 6 } }}>
          <Box sx={{ textAlign: 'center', maxWidth: 880, mx: 'auto' }}>
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '0.15em', mb: 2, display: 'block', animation: `${fadeSlideRight} 0.5s ease both` }}>
              ABOUT DYME
            </Typography>
            <Typography sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' }, lineHeight: 1.1, mb: 3, letterSpacing: '-0.04em', animation: `${fadeSlideRight} 0.5s ease 0.1s both` }}>
              Reshaping how personal <br /> <Box component="span" sx={{ color: 'primary.main' }}>finance</Box> works.
            </Typography>
            <Typography variant="h5" sx={{ color: 'text.secondary', fontWeight: 500, mb: 5, animation: `${fadeSlideRight} 0.5s ease 0.2s both`, maxWidth: 640, mx: 'auto', lineHeight: 1.6 }}>
              Dyme is built to humanize wealth and eliminate the anxiety of money management.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', animation: `${fadeSlideRight} 0.5s ease 0.3s both` }}>
              <Button variant="contained" endIcon={<ArrowRight size={18} />} sx={{ px: 4, py: 1.6, borderRadius: '14px', fontWeight: 700, fontSize: '1rem' }}>
                Download Dyme
              </Button>
              <Button variant="outlined" sx={{ px: 4, py: 1.6, borderRadius: '14px', border: '2px solid', fontWeight: 700, fontSize: '1rem', borderColor: 'divider' }}>
                Meet the Creator
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Detailed Vision intro */}
      <Box sx={{ py: 6, bgcolor: 'background.default', textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, mb: 2, color: 'text.primary' }}>Dyme Finance - Reshaping Personal Finance</Typography>
          <Box sx={{ width: 60, height: 4, bgcolor: 'primary.main', mx: 'auto', borderRadius: 2 }} />
        </Container>
      </Box>

      {/* Mission & Vision Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper', borderY: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4, md: 6 } }}>
          <Box sx={{ display: 'flex', gap: { xs: 4, md: 6 }, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
            <Box sx={{ flex: 1, p: { xs: 4, md: 6 }, borderRadius: '40px', bgcolor: theme.palette.mode === 'dark' ? 'rgba(244,63,110,0.05)' : 'primary.50', border: '1px solid', borderColor: theme.palette.mode === 'dark' ? 'rgba(244,63,110,0.15)' : 'primary.100', position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,63,110,0.1) 0%, transparent 70%)' }} />
              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, mb: 2, display: 'block' }}>OUR MISSION</Typography>
              <Typography variant="h3" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, mb: 3, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>Eliminating the stress of <br /> money management.</Typography>
              <Typography sx={{ color: 'text.secondary', lineHeight: 1.8, fontSize: '1.1rem' }}>
                Our mission at Dyme is to eliminate the stress of money management for everyone.
                We build powerful, automated tools that give you absolute control over every dollar
                you earn, budget, and spend — helping you build sustainable financial habits effortlessly.
              </Typography>
            </Box>

            <Box sx={{ flex: 1, p: { xs: 4, md: 6 }, borderRadius: '40px', bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)' }} />
              <Typography variant="overline" sx={{ color: 'info.main', fontWeight: 800, mb: 2, display: 'block' }}>OUR VISION</Typography>
              <Typography variant="h3" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, mb: 3, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>Divorced from financial <br /> anxiety.</Typography>
              <Typography sx={{ color: 'text.secondary', lineHeight: 1.8, fontSize: '1.1rem' }}>
                We envision a future where personal finance is completely divorced from anxiety.
                A world where anyone, regardless of their income level, can access premium financial
                tools to plan their spending, automate their bills, and grow their wealth securely.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Team Section */}
      <Box sx={{ py: { xs: 10, md: 16 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4, md: 6 } }}>
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, mb: 2, display: 'block' }}>MEET THE MAKER</Typography>
            <Typography variant="h3" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, mb: 3 }}>Passionate about your money.</Typography>
            <Typography sx={{ color: 'text.secondary', maxWidth: 640, mx: 'auto', fontSize: '1.1rem' }}>
              I am a builder and designer on a mission to reshape how people interact with their money.
              Every pixel and line of code in Dyme is crafted with empathy for your financial well-being.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 320, textAlign: 'center' }}>
              <Box sx={{ position: 'relative', mb: 3, mx: 'auto', width: 200, height: 200, borderRadius: '50%', overflow: 'hidden', p: 1, border: '2px solid', borderColor: 'divider' }}>
                <Avatar src={TEAM[0].photo} sx={{ width: '100%', height: '100%', filter: 'grayscale(0.4)', transition: '0.3s', '&:hover': { filter: 'grayscale(0)' } }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: '"Plus Jakarta Sans", sans-serif', mb: 0.5 }}>{TEAM[0].name}</Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: '1.1rem', fontWeight: 700 }}>Founder & Lead Creator</Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Principles section */}
      <Box sx={{ py: { xs: 10, md: 16 }, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4, md: 6 } }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, mb: 2, display: 'block' }}>PRINCIPLES</Typography>
            <Typography variant="h3" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, mb: 2, fontSize: { xs: '2.2rem', md: '3rem' } }}>What I stand for.</Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: { xs: 3, md: 4 }, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { icon: Target, title: 'Utility First', desc: 'If it doesn\'t help you save, it doesn\'t belong in the app. No clutter, just impact.', color: 'primary.main' },
              { icon: Lock, title: 'Privacy First', desc: 'Secure bank statements via CSV. Your data is encrypted and never sold.', color: '#3b82f6' },
              { icon: Users, title: 'Inclusion', desc: 'Designed for everyone, from individual creators to families.', color: '#10b981' },
              { icon: Globe, title: 'Global Access', desc: 'Support for multiple currencies and regions. Track your money wherever you are.', color: '#f59e0b' }
            ].map((v, i) => (
              <Box key={i} sx={{ flex: '1 1 260px', maxWidth: 400, p: { xs: 4, md: 5 }, borderRadius: '32px', bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 32px rgba(0,0,0,0.06)' } }}>
                <Box sx={{ color: v.color, mb: 3 }}>
                  <v.icon size={32} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '1.25rem' }}>{v.title}</Typography>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.7, fontSize: '0.95rem' }}>{v.desc}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      <LandingFooter />
    </Box>
  );
};

export default About;
