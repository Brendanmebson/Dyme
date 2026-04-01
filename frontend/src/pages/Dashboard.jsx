// src/pages/Dashboard.jsx
import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth }    from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import StatsCard from '../components/Dashboard/StatsCard';
import RecentTransactions from '../components/Dashboard/RecentTransactions';
import SpendingChart from '../components/Charts/SpendingChart';
import MonthlyChart from '../components/Charts/MonthlyChart';
import { DollarSign, TrendingUp, TrendingDown, Wallet, ArrowUpRight } from 'lucide-react';
import { Box, Typography, Grid, Button, CircularProgress } from '@mui/material';
import { subMonths, format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const buildMonthlyChartData = (getMonthlyData) =>
  Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), 5 - i);
    const { income, expenses } = getMonthlyData(date);
    return { month: format(date, 'MMM'), income, expenses };
  });

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { format: formatCurrency, currency } = useCurrency();
  const { transactions = [], getMonthlyData, getSpendingByCategory, loading } = useFinance();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#f43f6e' }} />
      </Box>
    );
  }

  const monthlyData  = getMonthlyData?.() || { income: 0, expenses: 0, transactions: [] };
  const spendingData = getSpendingByCategory?.() || [];
  const chartData    = buildMonthlyChartData(getMonthlyData);
  const totalBalance = monthlyData.income - monthlyData.expenses;

  const fullName  = user?.full_name ?? user?.user_metadata?.full_name ?? '';
  const firstName = fullName.split(' ')[0] || 'there';

  const stats = [
    {
      title: 'Total Balance',
      value: formatCurrency(totalBalance),
      change: null, icon: Wallet,
      iconBg: '#fff1f3', iconColor: '#f43f6e',
    },
    {
      title: 'Monthly Income',
      value: formatCurrency(monthlyData.income),
      change: null, icon: TrendingUp,
      iconBg: '#d1fae5', iconColor: '#10b981',
    },
    {
      title: 'Monthly Expenses',
      value: formatCurrency(monthlyData.expenses),
      change: null, icon: TrendingDown,
      iconBg: '#fee2e2', iconColor: '#ef4444',
    },
    {
      title: 'Transactions',
      value: monthlyData.transactions?.length || 0,
      change: null, icon: DollarSign,
      iconBg: '#dbeafe', iconColor: '#3b82f6',
    },
  ];

  return (
    <Box sx={{ pt: { xs: 3, md: 4 } }}>
      {/* Header */}
      <Box sx={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        mb: { xs: 3, md: 4 }, flexWrap: 'wrap', gap: 2,
      }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
            <Typography variant="h4" fontWeight={800} color="#101828"
              fontFamily='"Plus Jakarta Sans", sans-serif'
              sx={{ letterSpacing: '-0.02em', fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
              {getGreeting()}, {firstName} 👋
            </Typography>
            {/* Currency badge */}
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.5,
              px: 1.25, py: 0.4, borderRadius: '20px',
              bgcolor: '#fff1f3', border: '1px solid #fecdd6',
            }}>
              <Typography sx={{ fontSize: '0.9rem' }}>{currency.flag}</Typography>
              <Typography variant="caption" fontWeight={700} color="#f43f6e">
                {currency.code}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" color="#667085" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
            Here's what's happening with your money today.
          </Typography>
        </Box>
        <Button variant="contained" endIcon={<ArrowUpRight size={16} />}
          onClick={() => navigate('/dashboard/transactions')} size="small"
          sx={{
            background: 'linear-gradient(135deg, #f43f6e, #fb7292)',
            borderRadius: '12px', px: { xs: 2, md: 3 }, py: { xs: 1, md: 1.25 },
            fontSize: { xs: '0.8rem', md: '0.875rem' },
            boxShadow: '0 4px 16px rgba(244,63,110,0.25)', textTransform: 'none', fontWeight: 600,
            '&:hover': { boxShadow: '0 8px 24px rgba(244,63,110,0.35)', transform: 'translateY(-1px)' },
          }}>
          Add Transaction
        </Button>
      </Box>

      {/* Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: { xs: 1.5, md: 3 }, mb: { xs: 3, md: 4 } }}>
        {stats.map((card, idx) => (
          <Box key={idx} sx={{ minWidth: 0 }}>
            <StatsCard {...card} />
          </Box>
        ))}
      </Box>

      {/* Charts row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '7fr 5fr' }, gap: { xs: 2, md: 3 }, mb: { xs: 2, md: 3 } }}>
        <Box sx={{ minWidth: 0 }}>
          <MonthlyChart data={chartData} />
        </Box>
        <Box sx={{ display: { xs: 'block', lg: 'none' }, minWidth: 0 }}>
          <RecentTransactions transactions={transactions} compact />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <SpendingChart data={spendingData} />
        </Box>
      </Box>

      {/* Recent transactions (desktop) */}
      <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
        <RecentTransactions transactions={transactions} />
      </Box>
    </Box>
  );
};

export default Dashboard;
