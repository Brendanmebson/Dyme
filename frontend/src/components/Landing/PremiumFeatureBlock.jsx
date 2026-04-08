import React from 'react';
import { Box, Typography, Button, Container, useTheme } from '@mui/material';
import { keyframes } from '@mui/material/styles';

const floatA = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

const PremiumFeatureBlock = ({ 
  layout = 'vertical', 
  icon: Icon, 
  featureName, 
  title, 
  description, 
  color = '#f43f6e',
  imageSide = 'left'
}) => {
  const theme = useTheme();
  const isVertical = layout === 'vertical';

  // ─── VERTICAL Layout (Landing Page) ──────────────────────
  // Phone sits on top of the card, half-overlapping from the top
  if (isVertical) {
    const phoneH = 480; // px
    const overlap = 240; // how much phone hangs above the card

    return (
      <Box sx={{ 
        // extra top margin so the overhanging phone doesn't collide with the card above
        mt: `${overlap}px`,
        width: '100%',
        position: 'relative',
      }}>
        {/* Card */}
        <Box sx={{
          width: '100%',
          borderRadius: '32px',
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : `${color}08`,
          border: '1px solid',
          borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : `${color}18`,
          pt: `${overlap + 32}px`,  // space for overhanging phone
          pb: 5,
          px: { xs: 3, md: 4 },
          position: 'relative',
          overflow: 'visible',       // allow phone to poke above
        }}>
          {/* Arc background shapes */}
          <Box sx={{
            position: 'absolute',
            top: -60,
            left: -60,
            width: 280,
            height: 280,
            opacity: theme.palette.mode === 'dark' ? 0.12 : 0.08,
            pointerEvents: 'none',
          }}>
            <svg width="100%" height="100%" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="75"  stroke={color} strokeWidth="18" fill="none" />
              <circle cx="100" cy="100" r="105" stroke={color} strokeWidth="2"  fill="none" strokeDasharray="10 8" />
              <circle cx="100" cy="100" r="130" stroke={color} strokeWidth="1"  fill="none" strokeDasharray="5 12" />
            </svg>
          </Box>

          {/* Icon pill */}
          <Box sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 3,
            px: 2, py: '6px',
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#fff',
            borderRadius: '100px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          }}>
            <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: `${color}15`, color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={16} strokeWidth={2.5} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: 'text.primary' }}>
              {featureName}
            </Typography>
          </Box>

          {/* Title */}
          <Typography sx={{
            fontFamily: '"Syne", sans-serif',
            fontWeight: 800,
            fontSize: { xs: '1.8rem', md: '2.4rem' },
            lineHeight: 1.15,
            color: 'text.primary',
            mb: 2,
            letterSpacing: '-0.02em',
          }}>
            {title}
          </Typography>

          {/* Description */}
          <Typography sx={{ fontSize: '0.975rem', color: 'text.secondary', lineHeight: 1.7, mb: 4 }}>
            {description}
          </Typography>

          {/* CTA */}
          <Button
            variant="contained"
            sx={{
              bgcolor: color,
              color: '#fff',
              borderRadius: '100px',
              px: 4, py: 1.6,
              fontWeight: 800,
              fontSize: '0.9rem',
              textTransform: 'none',
              boxShadow: `0 8px 24px ${color}35`,
              '&:hover': { bgcolor: color, opacity: 0.88, transform: 'translateY(-2px)' },
              transition: 'all 0.2s',
            }}
          >
            Create A Dyme Account
          </Button>
        </Box>

        {/* iPhone mockup — absolutely positioned, hanging above card */}
        <Box sx={{
          position: 'absolute',
          top: `-${overlap}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          width: { xs: 200, md: 230 },
          height: { xs: phoneH, md: phoneH },
          bgcolor: theme.palette.mode === 'dark' ? '#27272a' : '#f4f4f5',
          borderRadius: '44px',
          border: '10px solid #1a1a1a',
          overflow: 'hidden',
          boxShadow: `0 32px 80px -16px ${color}30, 0 0 0 1px rgba(255,255,255,0.05)`,
          zIndex: 2,
          animation: `${floatA} 5s ease-in-out infinite`,
        }}>
          {/* Dynamic Island */}
          <Box sx={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: { xs: 70, md: 84 }, height: { xs: 20, md: 24 }, bgcolor: '#000', borderRadius: '14px', zIndex: 10, boxShadow: 'inset 0 0 2px rgba(255,255,255,0.1)' }} />
        </Box>
      </Box>
    );
  }

  // ─── HORIZONTAL Layout (Features Page) ───────────────────
  return (
    <Box sx={{ py: { xs: 4, md: 6 }, width: '100%' }}>
      <Container maxWidth="lg">
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: imageSide === 'left' ? 'row' : 'row-reverse' },
          alignItems: 'center',
          gap: { xs: 6, md: 10 },
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : `${color}05`,
          borderRadius: '40px',
          p: { xs: 4, md: 8 },
          border: '1px solid',
          borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : `${color}10`,
        }}>
          {/* Phone */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{
              width: { xs: 240, md: 280 },
              height: { xs: 460, md: 540 },
              bgcolor: theme.palette.mode === 'dark' ? '#27272a' : '#f4f4f5',
              borderRadius: '48px',
              border: '10px solid #1a1a1a',
              overflow: 'hidden',
              boxShadow: `0 40px 100px -20px ${color}25`,
              animation: `${floatA} 5s ease-in-out infinite`,
              position: 'relative',
            }}>
              {/* Dynamic Island */}
              <Box sx={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: { xs: 70, md: 84 }, height: { xs: 20, md: 24 }, bgcolor: '#000', borderRadius: '14px', zIndex: 10, boxShadow: 'inset 0 0 2px rgba(255,255,255,0.1)' }} />
            </Box>
          </Box>

          {/* Text */}
          <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            {/* Arc background */}
            <Box sx={{ position: 'absolute', top: -60, left: -60, width: 260, height: 260, opacity: 0.08, pointerEvents: 'none' }}>
              <svg width="100%" height="100%" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="75"  stroke={color} strokeWidth="18" fill="none" />
                <circle cx="100" cy="100" r="105" stroke={color} strokeWidth="2"  fill="none" strokeDasharray="10 8" />
              </svg>
            </Box>

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              {/* Icon pill */}
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, mb: 3, px: 2, py: '6px', bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#fff', borderRadius: '100px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: `${color}15`, color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} strokeWidth={2.5} />
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: 'text.primary' }}>{featureName}</Typography>
              </Box>

              <Typography sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: { xs: '2rem', md: '3rem' }, lineHeight: 1.1, color: 'text.primary', mb: 2.5, letterSpacing: '-0.02em' }}>
                {title}
              </Typography>

              <Typography sx={{ fontSize: '1.05rem', color: 'text.secondary', lineHeight: 1.7, mb: 5, maxWidth: 420 }}>
                {description}
              </Typography>

              <Button
                variant="contained"
                sx={{ bgcolor: color, color: '#fff', borderRadius: '100px', px: 4, py: 1.6, fontWeight: 800, fontSize: '0.9rem', textTransform: 'none', boxShadow: `0 8px 24px ${color}35`, '&:hover': { bgcolor: color, opacity: 0.88, transform: 'translateY(-2px)' }, transition: 'all 0.2s' }}
              >
                Create A Dyme Account
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default PremiumFeatureBlock;
