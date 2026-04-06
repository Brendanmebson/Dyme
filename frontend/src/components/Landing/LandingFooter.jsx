import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, TextField, Button, InputAdornment, IconButton } from '@mui/material';
import { 
  Twitter, 
  Linkedin, 
  Instagram, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Globe, 
  CheckCircle2, 
  Github 
} from 'lucide-react';
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
        { label: 'Changelog', path: '#', badge: 'New' },
        { label: 'Roadmap', path: '#' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About', path: '/about' },
        { label: 'FAQs', path: '/faqs' },
        { label: 'Blog', path: '#' },
        { label: 'Careers', path: '#', badge: 'Hiring' },
      ],
    },
    {
      heading: 'Resources',
      links: [
        { label: 'Documentation', path: '#' },
        { label: 'Community', path: '#' },
        { label: 'Support', path: '#' },
        { label: 'API Reference', path: '#' },
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
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <FooterBackground />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 8, md: 12 } }}>
        {/* Newsletter Section */}
        <Box sx={{ 
          mb: { xs: 8, md: 12 }, 
          p: { xs: 4, md: 8 }, 
          borderRadius: 4,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
          border: '1px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 4
        }}>
          <Box sx={{ maxWidth: 500 }}>
            <Typography variant="h4" sx={{ 
              color: '#fff', 
              fontWeight: 700, 
              mb: 2, 
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: { xs: '1.5rem', md: '2rem' },
              letterSpacing: '-0.02em'
            }}>
              Stay in the loop with Dyme
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 3 }}>
              Join 2,000+ modern financiers receiving weekly insights on automation and financial health.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle2 size={16} color="#f43f6e" />
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>No spam, ever</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle2 size={16} color="#f43f6e" />
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Weekly insights</Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <TextField
                placeholder="Enter your email"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    bgcolor: 'rgba(255,255,255,0.03)',
                    borderRadius: 2,
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&.Mui-focused fieldset': { borderColor: '#f43f6e' },
                  }
                }}
              />
              <Button 
                variant="contained" 
                sx={{ 
                  bgcolor: '#f43f6e', 
                  color: '#fff',
                  px: 4,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#e33663' }
                }}
              >
                Join
              </Button>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: { xs: 8, md: 12 }, flexWrap: 'wrap', pb: 8 }}>
          {/* Brand */}
          <Box sx={{ flex: '1 1 300px', maxWidth: 350 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ width: 42, height: 42, p: 0.5, bgcolor: 'rgba(244,63,110,0.1)', borderRadius: 2, border: '1px solid rgba(244,63,110,0.2)' }}>
                <Box component="img" src={logo} alt="Dyme" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </Box>
              <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '-0.03em' }}>
                Dyme
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, mb: 4 }}>
              The all-in-one financial dashboard for the modern age. Automate your tracking, visualize your growth, and master your money.
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box sx={{ width: 10, height: 10, bgcolor: '#10b981', borderRadius: '50%', boxShadow: '0 0 12px rgba(16,185,129,0.4)' }} />
              <Typography sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                System Operational
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5 }}>
              {[
                { icon: Twitter, link: '#' },
                { icon: Linkedin, link: '#' },
                { icon: Instagram, link: '#' },
                { icon: Github, link: '#' },
              ].map((social, i) => (
                <IconButton 
                  key={i}
                  size="small"
                  sx={{ 
                    color: 'rgba(255,255,255,0.4)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 2,
                    p: 1.25,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': { 
                      color: '#fff', 
                      bgcolor: 'rgba(255,255,255,0.05)',
                      borderColor: 'rgba(255,255,255,0.2)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <social.icon size={18} strokeWidth={2} />
                </IconButton>
              ))}
            </Box>
          </Box>

          {/* Link columns */}
          {footerSections.map(({ heading, links }) => (
            <Box key={heading} sx={{ flex: '1 1 120px' }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff', mb: 4, opacity: 0.3 }}>
                {heading}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {links.map((link) => (
                  <Box 
                    key={link.label} 
                    onClick={() => handleLinkClick(link)}
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', group: true }}
                  >
                    <Typography
                      sx={{ 
                        fontSize: '0.9rem', 
                        color: 'rgba(255,255,255,0.45)', 
                        fontWeight: 400, 
                        transition: 'all 0.2s',
                        '&:hover': { color: '#fff' } 
                      }}
                    >
                      {link.label}
                    </Typography>
                    {link.badge && (
                      <Box sx={{ 
                        px: 1, 
                        py: 0.25, 
                        borderRadius: 1, 
                        bgcolor: link.badge === 'New' ? 'rgba(244,63,110,0.1)' : 'rgba(124,58,237,0.1)',
                        border: `1px solid ${link.badge === 'New' ? 'rgba(244,63,110,0.2)' : 'rgba(124,58,237,0.2)'}`,
                      }}>
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: link.badge === 'New' ? '#f43f6e' : '#7c3aed', textTransform: 'uppercase' }}>
                          {link.badge}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Bottom bar */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: 3, 
          pt: 8, 
          borderTop: '1px solid rgba(255,255,255,0.05)' 
        }}>
          <Typography sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>
            © {new Date().getFullYear()} Dyme Finance. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255,255,255,0.3)' }}>
                <ShieldCheck size={16} />
                <Typography sx={{ fontSize: '0.85rem' }}>Secure & Encrypted</Typography>
             </Box>
             <Box sx={{ display: 'flex', gap: 3 }}>
                {['Status', 'Privacy', 'Terms'].map((item) => (
                  <Typography 
                    key={item} 
                    sx={{ 
                      fontSize: '0.85rem', 
                      color: 'rgba(255,255,255,0.3)', 
                      cursor: 'pointer', 
                      transition: 'color 0.2s', 
                      '&:hover': { color: '#fff' } 
                    }}
                  >
                    {item}
                  </Typography>
                ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingFooter;
