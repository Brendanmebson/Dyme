// Transactions.jsx — Fully Responsive
// On mobile: table replaced by card list for readability
import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import TransactionModal from '../components/Modals/TransactionModal';
import { Plus, Search, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import {
  Box, Typography, Button, TextField, Select, MenuItem,
  InputAdornment, IconButton, Chip, Paper, Table, TableHead,
  TableRow, TableCell, TableBody, Pagination, Grid, Card, CardContent,
  Avatar, useMediaQuery, useTheme,
} from '@mui/material';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const TYPE_COLORS = {
  income:  { bg: '#d1fae5', text: '#065f46' },
  expense: { bg: '#fee2e2', text: '#991b1b' },
};

const CATEGORY_COLORS = {
  'Food & Dining': '#f59e0b', 'Transportation': '#3b82f6', 'Shopping': '#8b5cf6',
  'Entertainment': '#ec4899', 'Bills & Utilities': '#ef4444', 'Healthcare': '#10b981',
  'Travel': '#06b6d4', 'Education': '#6366f1', 'Salary': '#10b981', 'Other': '#98a2b3',
};

const Transactions = () => {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { transactions, deleteTransaction, categories } = useFinance();
  const { format: formatCurrency } = useCurrency();
  const [isModalOpen, setIsModalOpen]       = useState(false);
  const [searchTerm, setSearchTerm]         = useState('');
  const [filterType, setFilterType]         = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage]       = useState(1);
  const itemsPerPage = 10;

  const filtered = transactions.filter((t) => {
    const matchSearch   = t.description.toLowerCase().includes(searchTerm.toLowerCase())
      || t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType     = filterType     === 'all' || t.type     === filterType;
    const matchCategory = filterCategory === 'all' || t.category === filterCategory;
    return matchSearch && matchType && matchCategory;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start      = (currentPage - 1) * itemsPerPage;
  const paginated  = filtered.slice(start, start + itemsPerPage);

  return (
    <Box sx={{ pt: { xs: 3, md: 4 } }}>

      {/* ─── Header ─────────────────────────── */}
      <Box sx={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        mb: { xs: 3, md: 4 }, flexWrap: 'wrap', gap: 2,
      }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="#101828"
            fontFamily='"Plus Jakarta Sans", sans-serif'
            sx={{ letterSpacing: '-0.02em', mb: 0.5, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
            Transactions
          </Typography>
          <Typography variant="body2" color="#667085" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
            {filtered.length} transactions found
          </Typography>
        </Box>
        <Button
          variant="contained" startIcon={<Plus size={16} />}
          onClick={() => setIsModalOpen(true)}
          size="small"
          sx={{
            background: 'linear-gradient(135deg, #f43f6e, #fb7292)',
            borderRadius: '12px', px: { xs: 2, md: 3 }, py: { xs: 1, md: 1.25 },
            fontSize: { xs: '0.8rem', md: '0.875rem' },
            boxShadow: '0 4px 16px rgba(244,63,110,0.25)',
            '&:hover': { boxShadow: '0 8px 24px rgba(244,63,110,0.35)' },
          }}
        >
          Add Transaction
        </Button>
      </Box>

      {/* ─── Filter bar ─────────────────────── */}
      <Card sx={{ mb: 3, borderRadius: { xs: '12px', md: '16px' }, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <CardContent sx={{ py: { xs: 2, md: 2.5 }, px: { xs: 2, md: 3 } }}>
          <Grid container spacing={{ xs: 1.5, md: 2 }} alignItems="center">
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth size="small"
                placeholder="Search by name or category…"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Search size={15} color="#98a2b3" /></InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <Select
                value={filterType} size="small" fullWidth
                onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6} md={4}>
              <Select
                value={filterCategory} size="small" fullWidth
                onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ─── Mobile: card list ──────────────── */}
      {isMobile ? (
        <Box>
          {paginated.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
              <Typography fontSize="2rem" mb={1}>💸</Typography>
              <Typography variant="body2" fontWeight={500}>No transactions found</Typography>
              <Typography variant="caption">Try adjusting your filters</Typography>
            </Box>
          ) : (
            paginated.map((t) => {
              const isIncome = t.type === 'income';
              const catColor = CATEGORY_COLORS[t.category] || '#98a2b3';
              return (
                <Card key={t.id} sx={{
                  mb: 1.5, borderRadius: '12px', border: '1px solid', borderColor: 'divider',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#fafbfc' },
                }}>
                  <CardContent sx={{ p: '14px !important' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {/* Icon */}
                      <Avatar sx={{
                        width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
                        bgcolor: isIncome ? '#d1fae5' : '#fff1f3',
                        color:   isIncome ? '#10b981' : '#f43f6e',
                      }}>
                        {isIncome ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      </Avatar>

                      {/* Details */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={600} color="#101828" noWrap sx={{ fontSize: '0.82rem' }}>
                          {t.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25, flexWrap: 'wrap' }}>
                          <Chip label={t.category} size="small" sx={{
                            height: 18, fontSize: '0.6rem', fontWeight: 600,
                            bgcolor: `${catColor}18`, color: catColor,
                            border: `1px solid ${catColor}30`, borderRadius: '5px',
                          }} />
                          <Typography variant="caption" color="#98a2b3" sx={{ fontSize: '0.65rem' }}>
                            {format(new Date(t.date), 'MMM d, yyyy')}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Amount + delete */}
                      <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                        <Typography variant="body2" fontWeight={700}
                          color={isIncome ? '#10b981' : '#ef4444'}
                          sx={{ fontSize: '0.85rem' }}>
                          {isIncome ? '+' : '-'}{formatCurrency(t.amount, t.currency)}
                        </Typography>
                        <IconButton size="small"
                          onClick={() => deleteTransaction(t.id)}
                          sx={{
                            color: '#cbd1db', borderRadius: '6px', p: 0.25, mt: 0.25,
                            '&:hover': { color: '#ef4444', bgcolor: '#fee2e2' },
                            transition: 'all 0.2s ease',
                          }}>
                          <Trash2 size={13} />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              );
            })
          )}
        </Box>
      ) : (
        /* ─── Desktop: table ──────────────────── */
        <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'background.default', '& th': { borderBottom: '1px solid', borderColor: 'divider', py: 2 } }}>
                {['Date', 'Description', 'Category', 'Type', 'Amount', ''].map((h, i) => (
                  <TableCell key={i}
                    align={h === 'Amount' ? 'right' : h === '' ? 'center' : 'left'}
                    sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                    <Typography fontSize="2rem" mb={1}>💸</Typography>
                    <Typography variant="body2" fontWeight={500}>No transactions found</Typography>
                    <Typography variant="caption">Try adjusting your filters</Typography>
                  </TableCell>
                </TableRow>
              ) : paginated.map((t) => {
                const tc = TYPE_COLORS[t.type];
                return (
                  <TableRow key={t.id} sx={{
                    '& td': { borderBottom: '1px solid #f8f9fb', py: 1.75 },
                    '&:hover': { bgcolor: '#fafbfc' },
                    '&:last-child td': { borderBottom: 'none' },
                    transition: 'background 0.15s ease',
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
                        label={t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                        size="small"
                        sx={{ bgcolor: tc.bg, color: tc.text, fontWeight: 600, fontSize: '0.72rem', borderRadius: '6px' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={700}
                        color={t.type === 'income' ? '#10b981' : '#ef4444'}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, t.currency)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small"
                        onClick={() => deleteTransaction(t.id)}
                        sx={{
                          color: '#cbd1db', borderRadius: '8px',
                          '&:hover': { color: '#ef4444', bgcolor: '#fee2e2' },
                          transition: 'all 0.2s ease',
                        }}>
                        <Trash2 size={16} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 2, borderTop: '1px solid #f1f3f6' }}>
              <Typography variant="caption" color="#98a2b3">
                {start + 1}–{Math.min(start + itemsPerPage, filtered.length)} of {filtered.length}
              </Typography>
              <Pagination
                count={totalPages} page={currentPage}
                onChange={(_, v) => setCurrentPage(v)}
                size="small" color="primary"
                sx={{ '& .MuiPaginationItem-root': { borderRadius: '8px' } }}
              />
            </Box>
          )}
        </Paper>
      )}

      {/* ─── Mobile pagination ───────────────── */}
      {isMobile && totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages} page={currentPage}
            onChange={(_, v) => setCurrentPage(v)}
            size="small" color="primary"
            sx={{ '& .MuiPaginationItem-root': { borderRadius: '8px' } }}
          />
        </Box>
      )}

      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Box>
  );
};

export default Transactions;
