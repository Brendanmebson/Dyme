// MonthlyChart.jsx — Fully Responsive
import React from 'react';
import { Card, CardContent, Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { useCurrency } from '../../context/CurrencyContext';

const CustomTooltip = ({ active, payload, label }) => {
  const { format: formatCurrency } = useCurrency();
  if (!active || !payload?.length) return null;
  return (
    <Box
      sx={{
        bgcolor: '#fff', border: '1px solid #e4e7ed',
        borderRadius: '12px', px: 2, py: 1.5,
        boxShadow: '0 8px 24px rgba(16,24,40,0.12)',
      }}
    >
      <Typography variant="caption" fontWeight={700} color="#344054" sx={{ mb: 1, display: 'block' }}>
        {label}
      </Typography>
      {payload.map((p) => (
        <Box key={p.dataKey} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: p.color }} />
          <Typography variant="caption" color="#667085">
            {p.name}: <strong style={{ color: '#101828' }}>{formatCurrency(p.value)}</strong>
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

const MonthlyChart = ({ data }) => {
  const theme  = useTheme();
  const { currency } = useCurrency();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card sx={{
      borderRadius: { xs: '12px', md: '16px' },
      border: '1px solid #e4e7ed',
      boxShadow: '0 1px 3px rgba(16,24,40,0.06)',
      height: '100%',
    }}>
      <Box sx={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        px: { xs: 2, md: 3 }, pt: { xs: 2, md: 3 }, pb: 1,
        flexWrap: 'wrap', gap: 1,
      }}>
        <Box>
          <Typography
            variant="h6" fontWeight={700} color="#101828"
            fontFamily='"Plus Jakarta Sans", sans-serif'
            sx={{ fontSize: { xs: '0.95rem', md: '1.25rem' } }}
          >
            Monthly Overview
          </Typography>
          <Typography variant="caption" color="#98a2b3">Income vs Expenses trend</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {[{ color: '#10b981', label: 'Income' }, { color: '#f43f6e', label: 'Expenses' }].map((l) => (
            <Box key={l.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: l.color }} />
              <Typography variant="caption" color="#667085" fontWeight={500}>{l.label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <CardContent sx={{ pt: 1, px: { xs: 1, md: 2 }, pb: { xs: '12px !important', md: '16px !important' } }}>
        {data?.length > 0 ? (
          <ResponsiveContainer width="100%" height={isMobile ? 200 : 260}>
            <AreaChart data={data} margin={{ top: 4, right: 4, left: isMobile ? -24 : -16, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f43f6e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f43f6e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f6" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: isMobile ? 10 : 12, fill: '#98a2b3', fontWeight: 500 }}
                axisLine={false} tickLine={false}
              />
                <YAxis
                  tick={{ fontSize: isMobile ? 10 : 12, fill: '#98a2b3' }}
                  axisLine={false} tickLine={false}
                  tickFormatter={(v) => `${currency.symbol}${v}`}
                />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e4e7ed' }} />
              <Area type="monotone" dataKey="income"   name="Income"   stroke="#10b981" strokeWidth={2} fill="url(#incomeGrad)"  dot={false} activeDot={{ r: 4, fill: '#10b981' }} />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f43f6e" strokeWidth={2} fill="url(#expenseGrad)" dot={false} activeDot={{ r: 4, fill: '#f43f6e' }} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <Box sx={{ height: isMobile ? 200 : 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#98a2b3' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography fontSize="2rem" mb={1}>📊</Typography>
              <Typography variant="body2">No data yet</Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyChart;
