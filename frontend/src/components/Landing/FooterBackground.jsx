import React from 'react';
import { Box } from '@mui/material';
import logo from '../../assets/Dyme logo.png';

const FooterBackground = () => (
  <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }} aria-hidden="true">
    <svg width="100%" height="100%" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <radialGradient id="rg1" cx="50%" cy="100%" r="65%">
          <stop offset="0%" stopColor="#f43f6e" stopOpacity="0.2" />
          <stop offset="45%" stopColor="#f43f6e" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#f43f6e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="rg2" cx="8%" cy="0%" r="42%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="rg3" cx="92%" cy="0%" r="35%">
          <stop offset="0%" stopColor="#f43f6e" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#f43f6e" stopOpacity="0" />
        </radialGradient>
        <pattern id="dotgrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="0.85" fill="rgba(255,255,255,0.065)" />
        </pattern>
        <linearGradient id="bottomfade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="55%" stopColor="#0a0a0f" stopOpacity="0" />
          <stop offset="100%" stopColor="#0a0a0f" stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect width="1440" height="600" fill="url(#rg1)" />
      <rect width="1440" height="600" fill="url(#rg2)" />
      <rect width="1440" height="600" fill="url(#rg3)" />
      <rect width="1440" height="600" fill="url(#dotgrid)" />
      <circle cx="1380" cy="-30" r="180" fill="none" stroke="rgba(244,63,110,0.07)" strokeWidth="0.8" />
      <circle cx="1380" cy="-30" r="280" fill="none" stroke="rgba(244,63,110,0.05)" strokeWidth="0.5" />
      <circle cx="1380" cy="-30" r="380" fill="none" stroke="rgba(244,63,110,0.03)" strokeWidth="0.5" />
      <circle cx="1380" cy="-30" r="480" fill="none" stroke="rgba(244,63,110,0.02)" strokeWidth="0.5" />
      <circle cx="60" cy="600" r="120" fill="none" stroke="rgba(124,58,237,0.06)" strokeWidth="0.5" />
      <circle cx="60" cy="600" r="200" fill="none" stroke="rgba(124,58,237,0.04)" strokeWidth="0.5" />
      <line x1="-200" y1="0" x2="400" y2="600" stroke="rgba(255,255,255,0.018)" strokeWidth="1" />
      <line x1="0" y1="0" x2="600" y2="600" stroke="rgba(255,255,255,0.018)" strokeWidth="1" />
      <line x1="200" y1="0" x2="800" y2="600" stroke="rgba(255,255,255,0.018)" strokeWidth="1" />
      <line x1="400" y1="0" x2="1000" y2="600" stroke="rgba(255,255,255,0.018)" strokeWidth="1" />
      <line x1="600" y1="0" x2="1200" y2="600" stroke="rgba(255,255,255,0.018)" strokeWidth="1" />
      <line x1="800" y1="0" x2="1400" y2="600" stroke="rgba(255,255,255,0.018)" strokeWidth="1" />
      <line x1="1000" y1="0" x2="1600" y2="600" stroke="rgba(255,255,255,0.018)" strokeWidth="1" />
      <line x1="0" y1="0.5" x2="1440" y2="0.5" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <circle cx="80" cy="55" r="1.1" fill="rgba(244,63,110,0.55)" />
      <circle cx="80" cy="55" r="4" fill="rgba(244,63,110,0.07)" />
      <circle cx="260" cy="35" r="1.1" fill="rgba(244,63,110,0.55)" />
      <circle cx="260" cy="35" r="4" fill="rgba(244,63,110,0.07)" />
      <circle cx="510" cy="25" r="1.1" fill="rgba(244,63,110,0.55)" />
      <circle cx="510" cy="25" r="4" fill="rgba(244,63,110,0.07)" />
      <circle cx="730" cy="48" r="1.1" fill="rgba(244,63,110,0.55)" />
      <circle cx="730" cy="48" r="4" fill="rgba(244,63,110,0.07)" />
      <circle cx="960" cy="28" r="1.1" fill="rgba(244,63,110,0.55)" />
      <circle cx="960" cy="28" r="4" fill="rgba(244,63,110,0.07)" />
      <circle cx="1150" cy="52" r="1.1" fill="rgba(244,63,110,0.55)" />
      <circle cx="1150" cy="52" r="4" fill="rgba(244,63,110,0.07)" />
      <circle cx="1360" cy="38" r="1.1" fill="rgba(244,63,110,0.55)" />
      <circle cx="1360" cy="38" r="4" fill="rgba(244,63,110,0.07)" />
      <circle cx="190" cy="110" r="1.1" fill="rgba(244,63,110,0.4)" />
      <circle cx="650" cy="90" r="1.1" fill="rgba(244,63,110,0.4)" />
      <circle cx="1040" cy="105" r="1.1" fill="rgba(244,63,110,0.4)" />
      <rect x="0" y="479" width="1440" height="1" fill="rgba(244,63,110,0.07)" />
      <rect width="1440" height="600" fill="url(#bottomfade)" />
    </svg>
  </Box>
);

export default FooterBackground;
