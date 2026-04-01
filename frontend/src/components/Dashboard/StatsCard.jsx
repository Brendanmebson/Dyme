// StatsCard.jsx — Fully Responsive
import React from 'react';
import { Box, Card, CardContent, Typography, Avatar } from '@mui/material';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({
  title,
  value,
  change,
  icon: Icon,
  iconBg    = '#fff1f3',
  iconColor = '#f43f6e',
}) => {
  const hasChange  = change !== undefined && change !== null;
  const isPositive = change >= 0;

  return (
    <Card
      sx={{
        borderRadius: { xs: '12px', md: '16px' },
        p: 0,
        border: '1px solid', borderColor: 'divider',
        boxShadow: '0 1px 3px rgba(16,24,40,0.06), 0 4px 16px rgba(16,24,40,0.04)',
        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
        cursor: 'default',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 8px 32px rgba(16,24,40,0.10)',
          borderColor: '#fecdd6',
        },
      }}
    >
      <CardContent sx={{ p: { xs: '14px !important', md: '20px !important' } }}>
        {/* Top row: label + icon */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: { xs: 1.25, md: 2 } }}>
          <Typography
            variant="caption"
            fontWeight={600}
            color="#667085"
            sx={{
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontSize: { xs: '0.6rem', md: '0.7rem' },
              lineHeight: 1.3,
              pr: 0.5,
            }}
          >
            {title}
          </Typography>
          <Avatar
            sx={{
              bgcolor: iconBg,
              color: iconColor,
              width: { xs: 32, md: 40 },
              height: { xs: 32, md: 40 },
              borderRadius: '10px',
              flexShrink: 0,
              mt: -0.5,
            }}
          >
            <Icon size={18} />
          </Avatar>
        </Box>

        {/* Value */}
        <Typography
          variant="h4"
          fontWeight={800}
          color="#101828"
          fontFamily='"Plus Jakarta Sans", sans-serif'
          sx={{
            letterSpacing: '-0.02em',
            mb: 0.75,
            lineHeight: 1.1,
            fontSize: { xs: '1.1rem', sm: '1.35rem', md: '2.125rem' },
            wordBreak: 'break-all',
          }}
        >
          {value}
        </Typography>

        {/* Change badge */}
        {hasChange && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
            <Box
              sx={{
                display: 'flex', alignItems: 'center', gap: 0.25,
                bgcolor: isPositive ? '#d1fae5' : '#fee2e2',
                color:   isPositive ? '#065f46' : '#991b1b',
                borderRadius: '6px', px: 0.75, py: 0.25,
              }}
            >
              {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              <Typography variant="caption" fontWeight={600} fontSize="0.65rem">
                {isPositive ? '+' : ''}{change}%
              </Typography>
            </Box>
            <Typography variant="caption" color="#98a2b3" fontSize="0.65rem" sx={{ display: { xs: 'none', sm: 'block' } }}>
              vs last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
