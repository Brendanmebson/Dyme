// Reports.jsx — Fully Responsive
// On mobile: table replaced by card list
import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useCurrency } from '../context/CurrencyContext';
import {
  format, startOfWeek, endOfWeek, startOfMonth, endOfMonth,
  startOfYear, endOfYear,
} from 'date-fns';
import { Download, Calendar, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import {
  Box, Typography, Button, Paper, Grid, Select, MenuItem,
  FormControl, InputLabel, LinearProgress, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, Divider,
  Card, CardContent, useMediaQuery, useTheme, Avatar,
} from '@mui/material';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const PERIOD_OPTIONS = [
  { value: 'weekly',  label: 'This Week' },
  { value: 'monthly', label: 'This Month' },
  { value: 'yearly',  label: 'This Year' },
];

const CATEGORY_COLORS = ['#f43f6e','#7c3aed','#10b981','#f59e0b','#3b82f6','#ec4899','#06b6d4','#84cc16','#ef4444'];

const Reports = () => {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { transactions, categories, getConvertedAmount } = useFinance();
  const { format: formatCurrency } = useCurrency();
  const [reportType, setReportType]             = useState('monthly');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType]         = useState('all');

  const getDateRange = () => {
    const now = new Date();
    switch (reportType) {
      case 'weekly':  return { start: startOfWeek(now),  end: endOfWeek(now) };
      case 'monthly': return { start: startOfMonth(now), end: endOfMonth(now) };
      case 'yearly':  return { start: startOfYear(now),  end: endOfYear(now) };
      default:        return { start: startOfMonth(now), end: endOfMonth(now) };
    }
  };

  const { start, end } = getDateRange();

  const filtered = transactions.filter((t) => {
    const d = new Date(t.date);
    return d >= start && d <= end
      && (selectedCategory === 'all' || t.category === selectedCategory)
      && (selectedType      === 'all' || t.type     === selectedType);
  });

  const totalIncome   = filtered.filter(t => t.type === 'income').reduce((s, t) => s + getConvertedAmount(t.amount, t.currency), 0);
  const totalExpenses = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + getConvertedAmount(t.amount, t.currency), 0);
  const net           = totalIncome - totalExpenses;

  const categoryBreakdown = categories
    .map((cat) => {
      const catTxns = filtered.filter(t => t.category === cat && t.type === 'expense');
      return { category: cat, total: catTxns.reduce((s, t) => s + getConvertedAmount(t.amount, t.currency), 0), count: catTxns.length };
    })
    .filter(i => i.total > 0)
    .sort((a, b) => b.total - a.total);

  const exportCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = filtered.map(t => [
      format(new Date(t.date), 'yyyy-MM-dd'),
      `"${t.description}"`, t.category, t.type, t.amount.toFixed(2),
    ].join(','));
    const csv  = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

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
            sx={{ letterSpacing: '-0.02em', mb: 0.75, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
            Reports
          </Typography>
          <Chip
            icon={<Calendar size={11} />}
            label={`${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`}
            size="small"
            sx={{ bgcolor: '#f8f9fb', color: '#667085', fontWeight: 500, border: '1px solid #e4e7ed', borderRadius: '8px', fontSize: '0.72rem' }}
          />
        </Box>
        <Button
          variant="contained" startIcon={<Download size={16} />}
          onClick={exportCSV}
          size="small"
          sx={{
            background: 'linear-gradient(135deg, #f43f6e, #fb7292)',
            borderRadius: '12px', px: { xs: 2, md: 3 }, py: { xs: 1, md: 1.25 },
            fontSize: { xs: '0.8rem', md: '0.875rem' },
            boxShadow: '0 4px 16px rgba(244,63,110,0.25)',
            '&:hover': { boxShadow: '0 8px 24px rgba(244,63,110,0.35)' },
          }}
        >
          Export CSV
        </Button>
      </Box>

      {/* ─── Filters ────────────────────────────── */}
      <Card sx={{ mb: { xs: 3, md: 4 }, borderRadius: { xs: '12px', md: '16px' }, border: '1px solid #e4e7ed', boxShadow: 'none' }}>
        <CardContent sx={{ py: { xs: 2, md: 2.5 }, px: { xs: 2, md: 3 } }}>
          <Grid container spacing={{ xs: 1.5, md: 2 }} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Period</InputLabel>
                <Select value={reportType} label="Period" onChange={e => setReportType(e.target.value)}>
                  {PERIOD_OPTIONS.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select value={selectedCategory} label="Category" onChange={e => setSelectedCategory(e.target.value)}>
                  <MenuItem value="all">All Categories</MenuItem>
                  {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select value={selectedType} label="Type" onChange={e => setSelectedType(e.target.value)}>
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="income">Income</MenuItem>
                  <MenuItem value="expense">Expense</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ─── Summary cards ──────────────────────── */}
      <Grid container spacing={{ xs: 1.5, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
        {[
          { label: 'Total Income',   value: formatCurrency(totalIncome),   color: '#10b981', bg: '#d1fae5', icon: TrendingUp },
          { label: 'Total Expenses', value: formatCurrency(totalExpenses), color: '#ef4444', bg: '#fee2e2', icon: TrendingDown },
          { label: 'Net Amount',     value: `${net >= 0 ? '+' : ''}${formatCurrency(Math.abs(net))}`, color: net >= 0 ? '#10b981' : '#ef4444', bg: net >= 0 ? '#d1fae5' : '#fee2e2', icon: DollarSign },
        ].map((s) => (
          <Grid item xs={12} sm={4} key={s.label}>
            <Card sx={{
              borderRadius: { xs: '12px', md: '16px' }, border: '1px solid #e4e7ed', boxShadow: 'none',
              transition: 'all 0.25s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(16,24,40,0.08)' },
            }}>
              <CardContent sx={{ p: { xs: '14px !important', md: '24px !important' } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Typography variant="caption" color="#98a2b3" fontWeight={600}
                    sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: { xs: '0.6rem', md: '0.7rem' } }}>
                    {s.label}
                  </Typography>
                  <Box sx={{
                    width: { xs: 30, md: 36 }, height: { xs: 30, md: 36 },
                    borderRadius: '10px', bgcolor: s.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <s.icon size={16} color={s.color} />
                  </Box>
                </Box>
                <Typography variant="h4" fontWeight={800} color={s.color}
                  fontFamily='"Plus Jakarta Sans", sans-serif'
                  sx={{ letterSpacing: '-0.02em', fontSize: { xs: '1.2rem', md: '2.125rem' }, wordBreak: 'break-all' }}>
                  {s.value}
                </Typography>
                <Typography variant="caption" color="#98a2b3" sx={{ fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                  {filtered.length} transactions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ─── Category breakdown ─────────────────── */}
      {categoryBreakdown.length > 0 && (
        <Card sx={{ mb: { xs: 3, md: 4 }, borderRadius: { xs: '12px', md: '16px' }, border: '1px solid #e4e7ed', boxShadow: 'none' }}>
          <Box sx={{ px: { xs: 2, md: 3 }, pt: { xs: 2, md: 3 }, pb: 2 }}>
            <Typography variant="h6" fontWeight={700} color="#101828"
              fontFamily='"Plus Jakarta Sans", sans-serif'
              sx={{ fontSize: { xs: '0.95rem', md: '1.25rem' } }}>
              Expense Breakdown by Category
            </Typography>
          </Box>
          <Divider sx={{ borderColor: '#f1f3f6' }} />
          <CardContent sx={{ px: { xs: 2, md: 3 }, pt: { xs: 2, md: 3 } }}>
            {categoryBreakdown.map((item, i) => {
              const pct   = totalExpenses > 0 ? (item.total / totalExpenses) * 100 : 0;
              const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
              return (
                <Box key={item.category} sx={{ mb: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
                      <Typography variant="body2" fontWeight={600} color="#344054" sx={{ fontSize: { xs: '0.78rem', md: '0.875rem' } }}>
                        {item.category}
                      </Typography>
                      <Typography variant="caption" color="#98a2b3" sx={{ display: { xs: 'none', sm: 'block' } }}>
                        ({item.count} txns)
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" fontWeight={700} color="#101828" sx={{ fontSize: { xs: '0.78rem', md: '0.875rem' } }}>
                        {formatCurrency(item.total)}
                      </Typography>
                      <Typography variant="caption" color="#98a2b3" sx={{ fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                        {pct.toFixed(1)}%
                      </Typography>
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate" value={pct}
                    sx={{
                      height: 6, borderRadius: '6px', bgcolor: '#f1f3f6',
                      '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: '6px' },
                    }}
                  />
                </Box>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* ─── Transactions: mobile cards / desktop table ─── */}
      <Paper elevation={0} sx={{ borderRadius: { xs: '12px', md: '16px' }, border: '1px solid #e4e7ed', overflow: 'hidden' }}>
        <Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 2.5 }, borderBottom: '1px solid #f1f3f6' }}>
          <Typography variant="h6" fontWeight={700} color="#101828"
            fontFamily='"Plus Jakarta Sans", sans-serif'
            sx={{ fontSize: { xs: '0.95rem', md: '1.25rem' } }}>
            Detailed Transactions
          </Typography>
        </Box>

        {isMobile ? (
          /* ─── Mobile card list ─── */
          <Box sx={{ p: 2 }}>
            {filtered.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6, color: '#98a2b3' }}>
                <Typography fontSize="1.8rem" mb={1}>📋</Typography>
                <Typography variant="body2" fontWeight={500}>No transactions in this period</Typography>
              </Box>
            ) : filtered.map((t) => {
              const isIncome = t.type === 'income';
              return (
                <Box key={t.id} sx={{
                  display: 'flex', alignItems: 'center', gap: 1.5,
                  py: 1.5, borderBottom: '1px solid #f8f9fb',
                  '&:last-child': { borderBottom: 'none' },
                }}>
                  <Avatar sx={{
                    width: 32, height: 32, borderRadius: '9px', flexShrink: 0,
                    bgcolor: isIncome ? '#d1fae5' : '#fff1f3',
                    color:   isIncome ? '#10b981' : '#f43f6e',
                  }}>
                    {isIncome ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} color="#101828" noWrap sx={{ fontSize: '0.8rem' }}>
                      {t.description}
                    </Typography>
                    <Typography variant="caption" color="#98a2b3" sx={{ fontSize: '0.65rem' }}>
                      {t.category} · {format(new Date(t.date), 'MMM d, yyyy')}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                    <Typography variant="body2" fontWeight={700}
                      color={isIncome ? '#10b981' : '#ef4444'}
                      sx={{ fontSize: '0.82rem' }}>
                      {isIncome ? '+' : '-'}{formatCurrency(t.amount, t.currency)}
                    </Typography>
                    <Chip
                      label={t.type === 'income' ? 'Income' : 'Expense'}
                      size="small"
                      sx={{
                        bgcolor: isIncome ? '#d1fae5' : '#fee2e2',
                        color:   isIncome ? '#065f46' : '#991b1b',
                        fontWeight: 600, fontSize: '0.58rem', borderRadius: '5px', height: 16,
                      }}
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>
        ) : (
          /* ─── Desktop table ─── */
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8f9fb', '& th': { borderBottom: '1px solid #e4e7ed', py: 1.75 } }}>
                  {['Date', 'Description', 'Category', 'Type', 'Amount'].map((h) => (
                    <TableCell key={h}
                      align={h === 'Amount' ? 'right' : 'left'}
                      sx={{ color: '#667085', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 8, color: '#98a2b3' }}>
                      <Typography fontSize="1.8rem" mb={1}>📋</Typography>
                      <Typography variant="body2" fontWeight={500}>No transactions in this period</Typography>
                    </TableCell>
                  </TableRow>
                ) : filtered.map((t) => (
                  <TableRow key={t.id} sx={{
                    '& td': { borderBottom: '1px solid #f8f9fb', py: 1.5 },
                    '&:hover': { bgcolor: '#fafbfc' },
                    '&:last-child td': { borderBottom: 'none' },
                  }}>
                    <TableCell>
                      <Typography variant="body2" color="#344054" fontWeight={500}>
                        {format(new Date(t.date), 'MMM d, yyyy')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} color="#101828">{t.description}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="#667085">{t.category}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={t.type === 'income' ? 'Income' : 'Expense'}
                        size="small"
                        sx={{
                          bgcolor: t.type === 'income' ? '#d1fae5' : '#fee2e2',
                          color:   t.type === 'income' ? '#065f46' : '#991b1b',
                          fontWeight: 600, fontSize: '0.72rem', borderRadius: '6px',
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={700}
                        color={t.type === 'income' ? '#10b981' : '#ef4444'}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, t.currency)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default Reports;
