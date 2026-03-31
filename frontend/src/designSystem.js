// ============================================================
// PIGGYSPEND — DESIGN SYSTEM v2.0 (2026 Edition)
// ============================================================
// Aesthetic: Soft Luxury × Fintech Clarity
// Font stack: "Plus Jakarta Sans" (display) + "DM Sans" (body)
// ============================================================

export const tokens = {
  // ─── COLOR PALETTE ───────────────────────────────────────
  colors: {
    // Primary — warm rose / coral pink
    primary: {
      50:  '#fff1f3',
      100: '#ffe4e9',
      200: '#fecdd6',
      300: '#fda4b5',
      400: '#fb7292',
      500: '#f43f6e',   // brand pink
      600: '#e11d56',
      700: '#be1248',
      800: '#9f123f',
      900: '#881337',
    },
    // Neutral — cool slate for text + UI chrome
    neutral: {
      0:   '#ffffff',
      50:  '#f8f9fb',
      100: '#f1f3f6',
      200: '#e4e7ed',
      300: '#cbd1db',
      400: '#98a2b3',
      500: '#667085',
      600: '#475467',
      700: '#344054',
      800: '#1d2939',
      900: '#101828',
    },
    // Accent — soft violet
    accent: {
      light: '#ede9fe',
      DEFAULT: '#7c3aed',
      dark: '#5b21b6',
    },
    // Semantic
    success: { light: '#d1fae5', DEFAULT: '#10b981', dark: '#065f46' },
    error:   { light: '#fee2e2', DEFAULT: '#ef4444', dark: '#991b1b' },
    warning: { light: '#fef3c7', DEFAULT: '#f59e0b', dark: '#92400e' },
    info:    { light: '#dbeafe', DEFAULT: '#3b82f6', dark: '#1e40af' },

    // Glass / surface
    glass: 'rgba(255, 255, 255, 0.72)',
    glassDark: 'rgba(255, 241, 243, 0.60)',
  },

  // ─── TYPOGRAPHY ──────────────────────────────────────────
  typography: {
    fontFamily: {
      display: '"Plus Jakarta Sans", "DM Sans", sans-serif',
      body:    '"DM Sans", "Plus Jakarta Sans", sans-serif',
      mono:    '"JetBrains Mono", "Fira Code", monospace',
    },
    fontSize: {
      xs:   '0.75rem',   // 12px
      sm:   '0.875rem',  // 14px
      base: '1rem',      // 16px
      lg:   '1.125rem',  // 18px
      xl:   '1.25rem',   // 20px
      '2xl':'1.5rem',    // 24px
      '3xl':'1.875rem',  // 30px
      '4xl':'2.25rem',   // 36px
      '5xl':'3rem',      // 48px
    },
    fontWeight: { regular: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
    lineHeight: { tight: 1.2, snug: 1.4, normal: 1.6, relaxed: 1.75 },
    letterSpacing: { tight: '-0.02em', normal: '0', wide: '0.02em', wider: '0.06em' },
  },

  // ─── SPACING ─────────────────────────────────────────────
  spacing: {
    // Base: 4px
    1: '4px',  2: '8px',  3: '12px', 4: '16px', 5: '20px',
    6: '24px', 8: '32px', 10:'40px', 12:'48px', 16:'64px',
    20:'80px', 24:'96px',
  },

  // ─── BORDER RADIUS ───────────────────────────────────────
  radius: {
    sm:   '8px',
    md:   '12px',
    lg:   '16px',
    xl:   '20px',
    '2xl':'24px',
    '3xl':'32px',
    full: '9999px',
  },

  // ─── SHADOWS ─────────────────────────────────────────────
  shadows: {
    xs:   '0 1px 2px rgba(16,24,40,0.05)',
    sm:   '0 2px 8px rgba(16,24,40,0.08)',
    md:   '0 4px 16px rgba(16,24,40,0.10)',
    lg:   '0 8px 32px rgba(16,24,40,0.12)',
    xl:   '0 16px 48px rgba(16,24,40,0.15)',
    pink: '0 8px 32px rgba(244,63,110,0.20)',
    pinkHover: '0 16px 40px rgba(244,63,110,0.30)',
    card: '0 1px 3px rgba(16,24,40,0.08), 0 4px 16px rgba(16,24,40,0.06)',
    cardHover: '0 8px 32px rgba(16,24,40,0.12), 0 2px 8px rgba(16,24,40,0.08)',
  },

  // ─── TRANSITIONS ─────────────────────────────────────────
  transitions: {
    fast:   'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    normal: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    slow:   'all 0.40s cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};

// ─── MUI THEME ───────────────────────────────────────────────
export const muiTheme = {
  palette: {
    mode: 'light',
    primary:   { main: '#f43f6e', light: '#fb7292', dark: '#be1248', contrastText: '#fff' },
    secondary: { main: '#7c3aed', light: '#ede9fe', dark: '#5b21b6', contrastText: '#fff' },
    success:   { main: '#10b981', light: '#d1fae5', dark: '#065f46' },
    error:     { main: '#ef4444', light: '#fee2e2', dark: '#991b1b' },
    warning:   { main: '#f59e0b', light: '#fef3c7', dark: '#92400e' },
    info:      { main: '#3b82f6', light: '#dbeafe', dark: '#1e40af' },
    background: { default: '#f8f9fb', paper: '#ffffff' },
    text: { primary: '#101828', secondary: '#667085', disabled: '#98a2b3' },
    divider: '#e4e7ed',
  },
  typography: {
    fontFamily: '"DM Sans", "Plus Jakarta Sans", sans-serif',
    h1: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, letterSpacing: '-0.015em' },
    h4: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    body1: { lineHeight: 1.6 },
    body2: { lineHeight: 1.5 },
    button: { fontWeight: 600, letterSpacing: '0.01em', textTransform: 'none' },
  },
  shape: { borderRadius: 12 },
  shadows: [
    'none',
    '0 1px 2px rgba(16,24,40,0.05)',
    '0 2px 8px rgba(16,24,40,0.08)',
    '0 4px 16px rgba(16,24,40,0.10)',
    '0 4px 16px rgba(16,24,40,0.10)',
    '0 8px 24px rgba(16,24,40,0.12)',
    '0 8px 24px rgba(16,24,40,0.12)',
    '0 12px 32px rgba(16,24,40,0.14)',
    '0 12px 32px rgba(16,24,40,0.14)',
    '0 16px 48px rgba(16,24,40,0.15)',
    '0 16px 48px rgba(16,24,40,0.15)',
    '0 20px 60px rgba(16,24,40,0.16)',
    '0 20px 60px rgba(16,24,40,0.16)',
    '0 24px 64px rgba(16,24,40,0.18)',
    '0 24px 64px rgba(16,24,40,0.18)',
    '0 28px 72px rgba(16,24,40,0.18)',
    '0 28px 72px rgba(16,24,40,0.18)',
    '0 32px 80px rgba(16,24,40,0.20)',
    '0 32px 80px rgba(16,24,40,0.20)',
    '0 36px 88px rgba(16,24,40,0.20)',
    '0 36px 88px rgba(16,24,40,0.20)',
    '0 40px 96px rgba(16,24,40,0.22)',
    '0 40px 96px rgba(16,24,40,0.22)',
    '0 44px 104px rgba(16,24,40,0.22)',
    '0 44px 104px rgba(16,24,40,0.22)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          padding: '10px 20px',
          fontWeight: 600,
          fontSize: '0.9rem',
          boxShadow: 'none',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': { boxShadow: '0 4px 16px rgba(244,63,110,0.25)', transform: 'translateY(-1px)' },
          '&:active': { transform: 'translateY(0)' },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #f43f6e 0%, #fb7292 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #e11d56 0%, #f43f6e 100%)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 1px 3px rgba(16,24,40,0.08), 0 4px 16px rgba(16,24,40,0.06)',
          border: '1px solid rgba(228,231,237,0.8)',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(16,24,40,0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: '8px', fontWeight: 500 } },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            '& fieldset': { borderColor: '#e4e7ed' },
            '&:hover fieldset': { borderColor: '#f43f6e' },
            '&.Mui-focused fieldset': { borderColor: '#f43f6e', borderWidth: '1.5px' },
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: { root: { borderRadius: '8px', height: '8px' } },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { borderRight: '1px solid #e4e7ed' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { boxShadow: '0 1px 0 rgba(228,231,237,1)', backdropFilter: 'blur(12px)' },
      },
    },
  },
};
