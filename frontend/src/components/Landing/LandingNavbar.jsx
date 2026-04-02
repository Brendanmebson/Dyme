import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { Menu, X } from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import ThemeToggle from '../ThemeToggle';
import logofull from '../../assets/Dyme logo full.png';
import logofullWhite from '../../assets/Dyme logo full(white).png';

const LandingNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const currentLogoFull = isDark ? logofullWhite : logofull;

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Handle hash scroll after navigation
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          const top = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }, 100);
      }
    } else if (location.pathname !== '/') {
        window.scrollTo(0, 0);
    }
  }, [location]);

  const scrollTo = (id) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'About', path: '/about' },
    { label: 'Features', path: '/features' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'FAQs', path: '/faqs' },
  ];

  const handleNavClick = (link) => {
    setMobileMenuOpen(false);
    if (link.path) {
      if (location.pathname === link.path) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
          navigate(link.path);
      }
    } else if (link.id) {
      scrollTo(link.id);
    }
  };

  const DymeLogo = ({ height = 50, priority = "auto" }) => (
    <Box
      component="img"
      src={currentLogoFull}
      alt="Dyme"
      fetchpriority={priority}
      sx={{ height, width: 'auto', display: 'block' }}
    />
  );

  return (
    <>
      <Box
        component="nav"
        sx={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
          px: { xs: 3, md: 6 }, py: 1.5,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'all 0.3s',
          bgcolor: scrolled ? (theme) => theme.palette.mode === 'dark' ? 'rgba(18, 18, 18, 0.88)' : 'rgba(250,250,248,0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
        }}
      >
        <Box onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
          <DymeLogo height={50} priority="high" />
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, alignItems: 'center' }}>
          {navLinks.map((link) => (
            <Typography
              key={link.label}
              onClick={() => handleNavClick(link)}
              sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'text.secondary', cursor: 'pointer', transition: 'color 0.2s', '&:hover': { color: 'text.primary' } }}
            >
              {link.label}
            </Typography>
          ))}
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1.5, alignItems: 'center' }}>
          <ThemeToggle />
          <Button onClick={() => navigate('/login')} sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.875rem', px: 2, borderRadius: '8px' }}>Login</Button>
          <Button onClick={() => navigate('/login')} sx={{ bgcolor: 'text.primary', color: 'background.paper', fontWeight: 600, fontSize: '0.875rem', px: 2.5, py: 0.85, borderRadius: '9px', '&:hover': { bgcolor: '#1a1a1a', transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(0,0,0,0.15)' }, transition: 'all 0.2s' }}>Join free</Button>
        </Box>

        <Box
          onClick={() => setMobileMenuOpen(true)}
          sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', cursor: 'pointer', p: 1, color: 'text.primary' }}
        >
          <Menu size={24} color="currentColor" />
        </Box>
      </Box>

      {/* Mobile Menu Backdrop */}
      <Box
        onClick={() => setMobileMenuOpen(false)}
        sx={{
          position: 'fixed', inset: 0, zIndex: 9998,
          bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(18, 18, 18, 0.5)' : 'rgba(250,250,248,0.5)',
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
          top: 0, left: 0, right: 0,
          bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(18, 18, 18, 0.85)' : 'rgba(250,250,248,0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          px: 3, pt: 1.5, pb: 4,
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ThemeToggle />
            <Box onClick={() => setMobileMenuOpen(false)} sx={{ cursor: 'pointer', p: 1, color: 'text.primary' }}>
              <X size={28} color="currentColor" />
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1, px: 1, mb: 4 }}>
          {navLinks.map((link) => (
            <Typography
              key={link.label}
              onClick={() => handleNavClick(link)}
              sx={{ fontSize: '1.8rem', fontWeight: 700, color: 'text.primary', cursor: 'pointer', letterSpacing: '-0.02em', '&:hover': { color: '#f43f6e' } }}
            >
              {link.label}
            </Typography>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: '100%', mt: 'auto' }}>
          <Button
            fullWidth
            onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
            sx={{ color: 'text.primary', border: '1.5px solid', borderColor: 'divider', fontWeight: 700, fontSize: '0.95rem', py: 1.5, borderRadius: '12px' }}
          >
            Login
          </Button>
          <Button
            fullWidth
            onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
            sx={{ bgcolor: 'text.primary', color: 'background.paper', fontWeight: 700, fontSize: '0.95rem', py: 1.5, borderRadius: '12px', '&:hover': { bgcolor: '#1a1a1a' } }}
          >
            Sign up
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default LandingNavbar;
