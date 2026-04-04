// SpendingChart.jsx — Fully Responsive
import React from 'react';
import { Card, CardContent, Box, Typography, LinearProgress, useMediaQuery, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useCurrency } from '../../context/CurrencyContext';

const PALETTE = ['#f43f6e', '#7c3aed', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#06b6d4', '#84cc16'];

const CustomTooltip = ({ active, payload }) => {
  const { format: formatCurrency } = useCurrency();
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <Box sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: '12px', px: 2, py: 1.5, boxShadow: '0 8px 24px rgba(16,24,40,0.12)' }}>
      <Typography variant="caption" fontWeight={700} color="text.secondary">{name}</Typography>
      <Typography variant="body2" fontWeight={700} color="text.primary">{formatCurrency(value)}</Typography>
    </Box>
  );
};

const SpendingChart = ({ data }) => {
  const theme    = useTheme();
  const { format: formatCurrency } = useCurrency();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const total    = data?.reduce((s, d) => s + d.amount, 0) || 0;
  const donutSize = isMobile ? 130 : 160;
  const innerR    = isMobile ? 38 : 50;
  const outerR    = isMobile ? 58 : 72;

  return (
    <Card sx={{
      borderRadius: { xs: '12px', md: '16px' },
      border: '1px solid', borderColor: 'divider',
      boxShadow: '0 1px 3px rgba(16,24,40,0.06)',
      height: '100%',
    }}>
      <Box sx={{ px: { xs: 2, md: 3 }, pt: { xs: 2, md: 3 }, pb: 1 }}>
        <Typography
          variant="h6" fontWeight={700} color="text.primary"
          fontFamily='"Plus Jakarta Sans", sans-serif'
          sx={{ fontSize: { xs: '0.95rem', md: '1.25rem' } }}
        >
          Spending by Category
        </Typography>
        <Typography variant="caption" color="text.secondary">This month's breakdown</Typography>
      </Box>

      <CardContent sx={{ pt: 1, px: { xs: 2, md: 2 }, pb: { xs: '12px !important', md: '16px !important' } }}>
        {data?.length > 0 ? (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 2, md: 2 },
            flexDirection: 'row',
          }}>
            {/* Donut */}
            <Box sx={{ position: 'relative', flexShrink: 0 }}>
              <ResponsiveContainer width={donutSize} height={donutSize}>
                <PieChart>
                  <Pie
                    data={data} cx="50%" cy="50%"
                    innerRadius={innerR} outerRadius={outerR}
                    dataKey="amount" paddingAngle={3} strokeWidth={0}
                  >
                    {data.map((_, i) => (
                      <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Center label */}
              <Box sx={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
                textAlign: 'center', pointerEvents: 'none',
              }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: '0.6rem', display: 'block' }}>TOTAL</Typography>
                <Typography variant="body2" fontWeight={800} color="text.primary" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                   {formatCurrency(total)}
                </Typography>
              </Box>
            </Box>

            {/* Legend */}
            <Box sx={{ flex: 1, width: '100%' }}>
              {data.slice(0, 6).map((d, i) => {
                const pct = total > 0 ? (d.amount / total) * 100 : 0;
                return (
                  <Box key={d.category} sx={{ mb: { xs: 1, md: 1.5 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: PALETTE[i % PALETTE.length], flexShrink: 0 }} />
                        <Typography variant="caption" color="text.primary" fontWeight={500} noWrap sx={{ maxWidth: { xs: 90, md: 110 }, fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
                          {d.category}
                        </Typography>
                      </Box>
                      <Typography variant="caption" fontWeight={700} color="text.primary" sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
                        {formatCurrency(d.amount)}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate" value={pct}
                      sx={{
                        height: { xs: 3, md: 4 }, borderRadius: '4px', bgcolor: theme.palette.mode === 'dark' ? '#333' : '#f1f3f6',
                        '& .MuiLinearProgress-bar': { bgcolor: PALETTE[i % PALETTE.length], borderRadius: '4px' },
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          </Box>
        ) : (
          <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography fontSize="2rem" mb={1}>🥧</Typography>
              <Typography variant="body2">No spending data yet</Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default SpendingChart;
