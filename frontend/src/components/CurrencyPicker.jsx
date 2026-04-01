// src/components/CurrencyPicker.jsx
import React, { useState } from 'react';
import { Box, Menu, MenuItem, Typography, Tooltip } from '@mui/material';
import { ChevronDown } from 'lucide-react';
import { useCurrency, CURRENCIES } from '../context/CurrencyContext';

const CurrencyPicker = () => {
  const { currency, setCurrency } = useCurrency();
  const [anchor, setAnchor] = useState(null);

  return (
    <>
      <Tooltip title="Switch currency">
        <Box
          onClick={(e) => setAnchor(e.currentTarget)}
          sx={{
            display: 'flex', alignItems: 'center', gap: 0.75,
            cursor: 'pointer', borderRadius: '10px',
            px: 1.25, py: 0.75,
            border: '1px solid', borderColor: 'divider',
            bgcolor: 'background.default',
            '&:hover': { bgcolor: '#fff1f3', borderColor: '#fda4b5' },
            transition: 'all 0.2s ease',
            userSelect: 'none',
          }}
        >
          <Typography sx={{ fontSize: '1.1rem', lineHeight: 1 }}>{currency.flag}</Typography>
          <Typography variant="caption" fontWeight={700} color="#344054" sx={{ letterSpacing: '0.02em' }}>
            {currency.code}
          </Typography>
          <ChevronDown size={13} color="#98a2b3" />
        </Box>
      </Tooltip>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        PaperProps={{
          sx: {
            mt: 1.5, borderRadius: '14px', minWidth: 190,
            boxShadow: '0 16px 48px rgba(16,24,40,0.12)',
            border: '1px solid', borderColor: 'divider', overflow: 'hidden',
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.25, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" color="#98a2b3" fontWeight={700}
            sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.68rem' }}>
            Select Currency
          </Typography>
        </Box>
        {Object.values(CURRENCIES).map((c) => (
          <MenuItem
            key={c.code}
            onClick={() => { setCurrency(c.code); setAnchor(null); }}
            selected={currency.code === c.code}
            sx={{
              gap: 1.5, mx: 1, my: 0.25, borderRadius: '8px',
              '&.Mui-selected': { bgcolor: '#fff1f3', color: '#f43f6e' },
              '&:hover': { bgcolor: '#fff1f3' },
            }}
          >
            <Typography sx={{ fontSize: '1.1rem' }}>{c.flag}</Typography>
            <Box>
              <Typography variant="body2" fontWeight={600} color="inherit">{c.code}</Typography>
              <Typography variant="caption" color="#98a2b3">{c.name}</Typography>
            </Box>
            <Typography variant="body2" fontWeight={700} color="#98a2b3" sx={{ ml: 'auto' }}>
              {c.symbol}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default CurrencyPicker;
