// Analytics.jsx — Fully Responsive
import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useCurrency } from '../context/CurrencyContext';
import SpendingChart from '../components/Charts/SpendingChart';
import MonthlyChart from '../components/Charts/MonthlyChart';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { format, subMonths } from 'date-fns';
import {
  Box, Grid, Typography, Card, CardContent,
  ToggleButton, ToggleButtonGroup, Divider, Chip,
} from '@mui/material';

const InsightCard = ({ label, value, sub, icon: Icon, iconColor, iconBg }) => (
  <Card sx={{
    borderRadius: { xs: '12px', md: '16px' },
    border: '1px solid #e4e7ed', boxShadow: 'none', height: '100%',
    transition: 'all 0.25s ease',
    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 32px rgba(16,24,40,0.08)' },
  }}>
    <CardContent sx={{ p: { xs: '14px !important', md: '24px !important' } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: { xs: 1, md: 2 } }}>
        <Typography variant="caption" fontWeight={600} color="#667085"
          sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: { xs: '0.6rem', md: '0.7rem' }, lineHeight: 1.3, pr: 0.5 }}>
          {label}
        </Typography>
        <Box sx={{
          width: { xs: 30, md: 36 }, height: { xs: 30, md: 36 },
          borderRadius: '10px', bgcolor: iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={16} color={iconColor} />
        </Box>
      </Box>
      <Typography variant="h5" fontWeight={800} color="#101828"
        fontFamily='"Plus Jakarta Sans", sans-serif'
        sx={{ letterSpacing: '-0.02em', mb: sub ? 0.5 : 0, fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }, wordBreak: 'break-all' }}>
        {value}
      </Typography>
      {sub && <Typography variant="caption" color="#98a2b3" fontWeight={500} sx={{ fontSize: { xs: '0.65rem', md: '0.75rem' } }}>{sub}</Typography>}
    </CardContent>
  </Card>
);

const Analytics = () => {
  const { getMonthlyData, getSpendingByCategory } = useFinance();
  const { format: formatCurrency } = useCurrency();
  const [period, setPeriod] = useState('6months');
  const months = period === '6months' ? 6 : 12;

  const monthlyChartData = Array.from({ length: months }, (_, i) => {
    const date = subMonths(new Date(), months - 1 - i);
    const { income, expenses } = getMonthlyData(date);
    return { month: format(date, 'MMM'), income, expenses, net: income - expenses };
  });

  const spendingData   = getSpendingByCategory();
  const totalIncome    = monthlyChartData.reduce((s, m) => s + m.income, 0);
  const totalExpenses  = monthlyChartData.reduce((s, m) => s + m.expenses, 0);
  const avgIncome      = totalIncome   / monthlyChartData.length;
  const avgExpenses    = totalExpenses / monthlyChartData.length;
  const savingsRate    = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  const topCategory    = spendingData.reduce((max, cat) => (cat.amount > (max?.amount || 0) ? cat : max), null);

  return (
    <Box sx={{ pt: { xs: 3, md: 4 } }}>

      {/* ─── Header ─────────────────────────────── */}
      <Box sx={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        mb: { xs: 3, md: 4 }, flexWrap: 'wrap', gap: 2,
      }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="#101828"
            fontFamily='"Plus Jakarta Sans", sans-serif'
            sx={{ letterSpacing: '-0.02em', mb: 0.5, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
            Analytics
          </Typography>
          <Typography variant="body2" color="#667085" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
            Your financial performance at a glance
          </Typography>
        </Box>

        {/* Period toggle */}
        <ToggleButtonGroup
          value={period} exclusive
          onChange={(_, v) => v && setPeriod(v)}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              borderRadius: '10px !important', border: '1px solid #e4e7ed !important',
              px: { xs: 1.5, md: 2.5 }, py: 0.75,
              fontWeight: 600, fontSize: { xs: '0.72rem', md: '0.8rem' }, color: '#667085',
              '&.Mui-selected': { bgcolor: '#fff1f3', color: '#f43f6e', border: '1px solid #fecdd6 !important' },
              '&:first-of-type': { mr: 0.5 },
            },
          }}
        >
          <ToggleButton value="6months">6 months</ToggleButton>
          <ToggleButton value="12months">12 months</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* ─── Insight cards ─────────────────────── */}
      <Grid container spacing={{ xs: 1.5, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
        <Grid item xs={12} sm={6} lg={3}>
          <InsightCard label="Avg Monthly Income" value={formatCurrency(avgIncome)}
            icon={TrendingUp} iconColor="#10b981" iconBg="#d1fae5"
            sub={`Over ${months} months`} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <InsightCard label="Avg Monthly Expenses" value={formatCurrency(avgExpenses)}
            icon={TrendingDown} iconColor="#ef4444" iconBg="#fee2e2"
            sub={`Over ${months} months`} />
        </Grid>
        <Grid item xs={6} sm={6} lg={3}>
          <InsightCard label="Savings Rate" value={`${savingsRate.toFixed(1)}%`}
            icon={DollarSign} iconColor="#7c3aed" iconBg="#ede9fe"
            sub={savingsRate >= 20 ? '🎉 Excellent!' : savingsRate >= 10 ? '👍 Good' : '⚠️ Could be higher'} />
        </Grid>
        <Grid item xs={6} sm={6} lg={3}>
          <InsightCard label="Top Spending" value={topCategory?.category || 'N/A'}
            icon={Target} iconColor="#f59e0b" iconBg="#fef3c7"
            sub={topCategory ? `${formatCurrency(topCategory.amount)} total` : 'No data yet'} />
        </Grid>
      </Grid>

      {/* ─── Charts ────────────────────────────── */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
        <Grid item xs={12} lg={7}>
          <MonthlyChart data={monthlyChartData} />
        </Grid>
        <Grid item xs={12} lg={5}>
          <SpendingChart data={spendingData} />
        </Grid>
      </Grid>

      {/* ─── Detailed Insights ─────────────────── */}
      <Card sx={{ borderRadius: { xs: '12px', md: '16px' }, border: '1px solid #e4e7ed', boxShadow: 'none' }}>
        <Box sx={{
          px: { xs: 2, md: 3 }, pt: { xs: 2, md: 3 }, pb: 2,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1,
        }}>
          <Typography variant="h6" fontWeight={700} color="#101828"
            fontFamily='"Plus Jakarta Sans", sans-serif'
            sx={{ fontSize: { xs: '0.95rem', md: '1.25rem' } }}>
            Detailed Insights
          </Typography>
          <Chip label={`${months}-month view`} size="small"
            sx={{ bgcolor: '#f8f9fb', color: '#667085', fontWeight: 600, borderRadius: '8px', border: '1px solid #e4e7ed' }} />
        </Box>
        <Divider sx={{ borderColor: '#f1f3f6' }} />
        <CardContent sx={{ p: 0 }}>
          <Grid container>
            {/* Spending by category */}
            <Grid item xs={12} md={6} sx={{ borderRight: { md: '1px solid #f1f3f6' }, borderBottom: { xs: '1px solid #f1f3f6', md: 'none' } }}>
              <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Typography variant="subtitle2" fontWeight={700} color="#344054" sx={{ mb: 2 }}>
                  Spending Patterns
                </Typography>
                {spendingData.length === 0 ? (
                  <Typography variant="body2" color="#98a2b3" sx={{ py: 2, textAlign: 'center' }}>No spending data</Typography>
                ) : (
                  spendingData.slice(0, 6).map((cat, i) => {
                    const maxAmt = spendingData[0]?.amount || 1;
                    const pct    = (cat.amount / maxAmt) * 100;
                    const COLORS = ['#f43f6e', '#7c3aed', '#10b981', '#f59e0b', '#3b82f6', '#ec4899'];
                    return (
                      <Box key={cat.category} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: COLORS[i % COLORS.length], flexShrink: 0 }} />
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2" fontWeight={500} color="#344054" sx={{ fontSize: { xs: '0.78rem', md: '0.875rem' } }}>
                              {cat.category}
                            </Typography>
                            <Typography variant="body2" fontWeight={700} color="#101828" sx={{ fontSize: { xs: '0.78rem', md: '0.875rem' } }}>
                              {formatCurrency(cat.amount)}
                            </Typography>
                          </Box>
                          <Box sx={{ height: 4, borderRadius: '4px', bgcolor: '#f1f3f6', overflow: 'hidden' }}>
                            <Box sx={{ height: '100%', width: `${pct}%`, bgcolor: COLORS[i % COLORS.length], borderRadius: '4px', transition: 'width 0.6s ease' }} />
                          </Box>
                        </Box>
                      </Box>
                    );
                  })
                )}
              </Box>
            </Grid>

            {/* Monthly trend */}
            <Grid item xs={12} md={6}>
              <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Typography variant="subtitle2" fontWeight={700} color="#344054" sx={{ mb: 2 }}>
                  Recent Monthly Net
                </Typography>
                {monthlyChartData.slice(-5).reverse().map((m) => {
                  const isPositive = m.net >= 0;
                  return (
                    <Box key={m.month}
                      sx={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        py: 1.25, borderBottom: '1px solid #f8f9fb',
                        '&:last-child': { borderBottom: 'none' },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: isPositive ? '#10b981' : '#ef4444', flexShrink: 0 }} />
                        <Typography variant="body2" fontWeight={500} color="#344054" sx={{ fontSize: { xs: '0.78rem', md: '0.875rem' } }}>{m.month}</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" fontWeight={700} color={isPositive ? '#10b981' : '#ef4444'} sx={{ fontSize: { xs: '0.78rem', md: '0.875rem' } }}>
                          {isPositive ? '+' : ''}{formatCurrency(Math.abs(m.net))}
                        </Typography>
                        <Typography variant="caption" color="#98a2b3" sx={{ fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                          {isPositive ? 'surplus' : 'deficit'}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Analytics;
