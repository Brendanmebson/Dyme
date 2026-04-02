import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container } from '@mui/material';
import FooterBackground from './FooterBackground';
import logo from '../../assets/Dyme logo.png';

const LandingFooter = () => {
  const navigate = useNavigate();

  const footerSections = [
    {
      heading: 'Product',
      links: [
        { label: 'Features', path: '/features' },
        { label: 'Pricing', id: 'pricing' },
        { label: 'Changelog', path: '#' },
        { label: 'Roadmap', path: '#' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About', path: '/about' },
        { label: 'FAQs', path: '/faqs' },
        { label: 'Blog', path: '#' },
        { label: 'Careers', path: '#' },
      ],
    },
    {
      heading: 'Legal',
      links: [
        { label: 'Privacy Policy', path: '#' },
        { label: 'Terms of Service', path: '#' },
        { label: 'Cookie Policy', path: '#' },
        { label: 'Security', path: '#' },
      ],
    },
  ];

  const handleLinkClick = (link) => {
    if (link.path && link.path !== '#') {
      navigate(link.path);
    } else if (link.id) {
      if (window.location.pathname !== '/') {
        navigate(`/#${link.id}`);
      } else {
        const el = document.getElementById(link.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    }
  };

  return (
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
      <FooterBackground />

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
            <Typography sx={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.32)', lineHeight: 1.85, mb: 2 }}>
              Dyme Finance - Reshaping Personal Finance for Everyone. 
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.25)', mb: 4, lineHeight: 1.6 }}>
               Email: support@dymefinance.ai <br />
               Address: Lagos, Nigeria
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
          {footerSections.map(({ heading, links }) => (
            <Box key={heading} sx={{ flex: '1 1 120px' }}>
              <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', mb: 3 }}>
                {heading}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {links.map((link) => (
                  <Typography
                    key={link.label}
                    onClick={() => handleLinkClick(link)}
                    sx={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.38)', cursor: 'pointer', fontWeight: 400, transition: 'all 0.2s ease', width: 'fit-content', '&:hover': { color: '#fff', transform: 'translateX(3px)' } }}
                  >
                    {link.label}
                  </Typography>
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Bottom bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, pt: 5 }}>
          <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.18)' }}>
            © {new Date().getFullYear()} Dyme Finance. All rights reserved.
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
  );
};

export default LandingFooter;
