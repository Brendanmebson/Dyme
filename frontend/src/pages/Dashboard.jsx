// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import StatsCard from '../components/Dashboard/StatsCard';
import RecentTransactions from '../components/Dashboard/RecentTransactions';
import SpendingChart from '../components/Charts/SpendingChart';
import MonthlyChart from '../components/Charts/MonthlyChart';
import { DollarSign, TrendingUp, TrendingDown, Wallet, ArrowUpRight, Upload, X, Zap } from 'lucide-react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { subMonths, format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { bankingService } from '../services/banking.service';

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
  const { 
    transactions = [], 
    getMonthlyData, 
    getSpendingByCategory, 
    loading, 
    refreshData 
  } = useFinance();

  const [uploading, setUploading] = useState(false);
  const [bankStatus, setBankStatus] = useState({ connected: false });
  const [bannerDismissed, setBannerDismissed] = useState(
    () => localStorage.getItem('dyme_bank_banner_dismissed') === '1'
  );

  // Sync bank status on mount
  useEffect(() => {
    bankingService.getStatus()
      .then(setBankStatus)
      .catch(() => setBankStatus({ connected: false }));
  }, []);

  const handleFileUpload = async (file) => {
    if (!file) return;
    const lowerName = file.name.toLowerCase();
    if (!lowerName.endsWith('.csv') && !lowerName.endsWith('.xlsx') && !lowerName.endsWith('.xls')) {
      alert('Please upload a valid CSV or Excel bank statement.');
      return;
    }

    setUploading(true);
    try {
      const res = await bankingService.uploadCSV(file, currency.code);
      alert(res.message || `Imported ${res.count} transactions.`);
      await refreshData(); // Triggers FinanceContext to reload all transactions
      setBankStatus({ connected: true, bank_name: 'CSV Import' });
    } catch (err) {
      alert(err.message || 'Failed to import CSV.');
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#f43f6e' }} />
      </Box>
    );
  }

  const monthlyData = getMonthlyData?.() || { income: 0, expenses: 0, transactions: [] };
  const spendingData = getSpendingByCategory?.() || [];
  const chartData = buildMonthlyChartData(getMonthlyData);
  const totalBalance = monthlyData.income - monthlyData.expenses;

  const fullName = user?.full_name ?? user?.user_metadata?.full_name ?? '';
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
            <Typography variant="h4" fontWeight={800} color="text.primary"
              fontFamily='"Plus Jakarta Sans", sans-serif'
              sx={{ letterSpacing: '-0.02em', fontSize: { xs: '1.2rem', md: '2.125rem' } }}>
              {getGreeting()}, {firstName} 👋
            </Typography>
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.5,
              px: 1.25, py: 0.4, borderRadius: '20px',
              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(244,63,110,0.1)' : '#fff1f3', border: (theme) => theme.palette.mode === 'dark' ? '1px solid rgba(244,63,110,0.2)' : '1px solid #fecdd6',
            }}>
              <Typography sx={{ fontSize: '0.9rem' }}>{currency?.flag}</Typography>
              <Typography variant="caption" fontWeight={700} color="#f43f6e">
                {currency?.code}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
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

      {/* Bank Link Banner (Drag & Drop Zone) */}
      {!bannerDismissed && bankStatus && !bankStatus.connected && (
        <Box
          onDragOver={onDragOver}
          onDrop={onDrop}
          sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2,
            mb: 4, px: 3, py: 2.5, borderRadius: '20px',
            background: (theme) => theme.palette.mode === 'dark' ? 'rgba(244,63,110,0.06)' : 'linear-gradient(135deg, rgba(244,63,110,0.06), rgba(244,63,110,0.02))',
            border: '2px dashed rgba(244,63,110,0.2)',
            transition: 'all 0.2s',
            position: 'relative',
            '&:hover': { borderColor: '#f43f6e', bgcolor: 'rgba(244,63,110,0.04)' },
          }}
        >
          {uploading && (
            <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(255,255,255,0.85)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, borderRadius: '20px' }}>
              <CircularProgress size={20} sx={{ color: '#f43f6e' }} />
              <Typography fontWeight={700} sx={{ color: '#f43f6e' }}>Syncing data...</Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: '14px', bgcolor: 'rgba(244,63,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Upload size={24} color="#f43f6e" strokeWidth={2.5} />
            </Box>
            <Box>
              <Typography fontWeight={700} fontSize="1rem" color="text.primary">
                🏦 Instant CSV Bank Sync
              </Typography>
              <Typography fontSize="0.8rem" color="text.secondary">
                Drag and drop your bank's CSV statement here to instantly update your dashboard.
              </Typography>
              <Typography fontSize="0.7rem" color="#f43f6e" fontWeight={800} sx={{ mt: 0.5, textTransform: 'uppercase' }}>
                ⚡ Automatic bank linking coming soon
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <input
              type="file" accept=".csv, .xlsx, .xls" id="dash-csv-upload"
              style={{ display: 'none' }}
              onChange={(e) => handleFileUpload(e.target.files[0])}
            />
            <label htmlFor="dash-csv-upload">
              <Button
                component="span"
                variant="contained"
                size="small"
                startIcon={<Zap size={14} />}
                sx={{ borderRadius: '10px', fontWeight: 800, px: 2.5, py: 1, background: 'linear-gradient(135deg, #f43f6e, #ff6b8a)', boxShadow: '0 4px 12px rgba(244,63,110,0.3)', textTransform: 'none' }}
              >
                Import Statement
              </Button>
            </label>
            <Button
              size="small" variant="text"
              onClick={() => { setBannerDismissed(true); localStorage.setItem('dyme_bank_banner_dismissed', '1'); }}
              sx={{ color: 'text.disabled', minWidth: 0, p: 1 }}
            >
              <X size={16} />
            </Button>
          </Box>
        </Box>
      )}

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
