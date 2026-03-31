// RecentTransactions.jsx — Fully Responsive
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Avatar,
  Button, Chip,
} from '@mui/material';
import { ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';

import { useCurrency } from '../../context/CurrencyContext';

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  if (isToday(d))     return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMM d');
};

const CATEGORY_COLORS = {
  'Food & Dining':     '#f59e0b',
  'Transportation':    '#3b82f6',
  'Shopping':          '#8b5cf6',
  'Entertainment':     '#ec4899',
  'Bills & Utilities': '#ef4444',
  'Healthcare':        '#10b981',
  'Travel':            '#06b6d4',
  'Education':         '#6366f1',
  'Salary':            '#10b981',
  'Other':             '#98a2b3',
};

const RecentTransactions = ({ transactions, compact = false }) => {
  const navigate = useNavigate();
  const { format: formatCurrency } = useCurrency();
  const recent   = transactions.slice(0, compact ? 4 : 6);

  return (
    <Card
      sx={{
        borderRadius: { xs: '12px', md: '16px' },
        border: '1px solid #e4e7ed',
        boxShadow: '0 1px 3px rgba(16,24,40,0.06)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box sx={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        px: { xs: 2, md: 3 }, py: { xs: 2, md: 2.5 },
        borderBottom: '1px solid #f1f3f6',
      }}>
        <Typography
          variant="h6" fontWeight={700} color="#101828"
          fontFamily='"Plus Jakarta Sans", sans-serif'
          sx={{ fontSize: { xs: '0.95rem', md: '1.25rem' } }}
        >
          Recent Transactions
        </Typography>
        <Button
          endIcon={<ArrowRight size={14} />}
          onClick={() => navigate('/dashboard/transactions')}
          size="small"
          sx={{
            color: '#f43f6e', fontWeight: 600, borderRadius: '8px',
            fontSize: { xs: '0.75rem', md: '0.8rem' },
            '&:hover': { bgcolor: '#fff1f3' },
          }}
        >
          View all
        </Button>
      </Box>

      <CardContent sx={{ p: 0 }}>
        {recent.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: compact ? 3 : 8, color: '#98a2b3' }}>
            <Typography fontSize={compact ? '1.5rem' : '2.5rem'} mb={1}>💸</Typography>
            <Typography variant="body2" fontWeight={500}>No transactions yet</Typography>
            {!compact && <Typography variant="caption">Add one to get started</Typography>}
          </Box>
        ) : (
          recent.map((tx, idx) => {
            const isIncome = tx.type === 'income';
            const catColor = CATEGORY_COLORS[tx.category] || '#98a2b3';

            return (
              <Box
                key={tx.id}
                sx={{
                  display: 'flex', alignItems: 'center',
                  gap: compact ? 1 : { xs: 1.25, md: 2 },
                  px: compact ? 1.5 : { xs: 2, md: 3 },
                  py: compact ? 1.25 : { xs: 1.5, md: 2 },
                  borderBottom: idx < recent.length - 1 ? '1px solid #f8f9fb' : 'none',
                  transition: 'background 0.15s ease',
                  '&:hover': { bgcolor: '#fafbfc' },
                }}
              >
                {/* Icon */}
                <Avatar
                  sx={{
                    width: compact ? 28 : { xs: 34, md: 40 },
                    height: compact ? 28 : { xs: 34, md: 40 },
                    borderRadius: '8px', flexShrink: 0,
                    bgcolor: isIncome ? '#d1fae5' : '#fff1f3',
                    color:   isIncome ? '#10b981' : '#f43f6e',
                  }}
                >
                  {isIncome ? <ArrowUpRight size={compact ? 13 : 16} /> : <ArrowDownRight size={compact ? 13 : 16} />}
                </Avatar>

                {/* Description + category */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2" fontWeight={600} color="#344054" noWrap
                    sx={{ fontSize: compact ? '0.72rem' : { xs: '0.8rem', md: '0.875rem' } }}
                  >
                    {tx.description}
                  </Typography>
                  {!compact && (
                    <Chip
                      label={tx.category}
                      size="small"
                      sx={{
                        mt: 0.25, height: 18, fontSize: '0.6rem', fontWeight: 600,
                        bgcolor: `${catColor}18`, color: catColor,
                        border: `1px solid ${catColor}30`, borderRadius: '5px',
                      }}
                    />
                  )}
                  {compact && (
                    <Typography variant="caption" color="#98a2b3" sx={{ fontSize: '0.62rem' }} noWrap>
                      {formatDate(tx.date)}
                    </Typography>
                  )}
                </Box>

                {/* Amount (+ date for non-compact) */}
                <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                  <Typography
                    variant="body2" fontWeight={700}
                    color={isIncome ? '#10b981' : '#ef4444'}
                    sx={{ fontSize: compact ? '0.75rem' : { xs: '0.8rem', md: '0.875rem' } }}
                  >
                    {isIncome ? '+' : '-'}{formatCurrency(tx.amount, tx.currency)}
                  </Typography>
                  {!compact && (
                    <Typography variant="caption" color="#98a2b3" sx={{ fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                      {formatDate(tx.date)}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
