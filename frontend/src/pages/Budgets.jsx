// Budgets.jsx — Fully Responsive
import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useConfirm } from '../context/ConfirmContext';
import BudgetModal from '../components/Modals/BudgetModal';
import {
  Box, Grid, Card, CardContent, Typography, Button,
  LinearProgress, Chip,
} from '@mui/material';
import { Plus, Target, AlertTriangle, CheckCircle, Trash2, Calendar } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { format, differenceInDays } from 'date-fns';

const STATUS_CONFIG = {
  exceeded: { color: '#ef4444', bg: '#fee2e2', label: 'Exceeded',   icon: AlertTriangle },
  warning:  { color: '#f59e0b', bg: '#fef3c7', label: 'Near limit', icon: AlertTriangle },
  good:     { color: '#10b981', bg: '#d1fae5', label: 'On track',   icon: CheckCircle },
};

const getBudgetStatus = ({ spent, limit, end_date }) => {
  const now = new Date();
  if (end_date && new Date(end_date) < now) return 'exceeded'; // Or a new 'expired' status
  const pct = (spent / limit) * 100;
  if (pct >= 100) return 'exceeded';
  if (pct >= 80)  return 'warning';
  return 'good';
};

const Budgets = () => {
  const { budgets, deleteBudget } = useFinance();
  const { confirm } = useConfirm();
  const { formatAmount, currency } = useCurrency();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredId, setHoveredId]     = useState(null);

  const totalBudgeted = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent    = budgets.reduce((s, b) => s + b.spent, 0);
  const totalLeft     = totalBudgeted - totalSpent;
  const overallPct    = totalBudgeted > 0 ? Math.min((totalSpent / totalBudgeted) * 100, 100) : 0;

  return (
    <Box sx={{ pt: { xs: 3, md: 4 } }}>

      {/* ─── Header ───────────────────────────────── */}
      <Box sx={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        mb: { xs: 3, md: 4 }, flexWrap: 'wrap', gap: 2,
      }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="text.primary"
            fontFamily='"Plus Jakarta Sans", sans-serif'
            sx={{ letterSpacing: '-0.02em', mb: 0.5, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
            Budgets
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
            {budgets.length} active budget{budgets.length !== 1 ? 's' : ''}
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
          New Budget
        </Button>
      </Box>

      {/* ─── Summary card ─────────────────────────── */}
      {budgets.length > 0 && (
        <Card sx={{ mb: { xs: 3, md: 4 }, borderRadius: { xs: '12px', md: '16px' }, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
          <CardContent sx={{ p: { xs: '16px !important', md: '24px !important' } }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '4fr 5fr 3fr' }, gap: { xs: 2, md: 3 }, alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}
                  sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.7rem' }}>
                  Overall Spending
                </Typography>
                <Typography variant="h5" fontWeight={800} color="text.primary"
                  fontFamily='"Plus Jakarta Sans", sans-serif'
                  sx={{ mt: 0.5, fontSize: { xs: '1.1rem', md: '1.5rem' } }}>
                  {formatAmount(totalSpent, currency.code)}
                  <Typography component="span" variant="body2" color="text.secondary" fontWeight={400}>
                    {' '} / {formatAmount(totalBudgeted, currency.code)}
                  </Typography>
                </Typography>
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>{overallPct.toFixed(1)}% used</Typography>
                  <Typography variant="caption" color={totalLeft >= 0 ? '#10b981' : '#ef4444'} fontWeight={600}>
                    {formatAmount(Math.abs(totalLeft), currency.code)} {totalLeft >= 0 ? 'left' : 'over'}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate" value={overallPct}
                  sx={{
                    height: 8, borderRadius: '8px', bgcolor: (theme) => theme.palette.mode === 'dark' ? '#333' : '#f1f3f6',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: overallPct >= 100 ? '#ef4444' : overallPct >= 80 ? '#f59e0b' : '#10b981',
                      borderRadius: '8px',
                    },
                  }}
                />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {Object.entries(
                    budgets.reduce((acc, b) => {
                      const s = getBudgetStatus(b);
                      acc[s] = (acc[s] || 0) + 1;
                      return acc;
                    }, {})
                  ).map(([status, count]) => {
                    const cfg = STATUS_CONFIG[status];
                    return (
                      <Chip key={status} label={`${count} ${cfg.label}`} size="small"
                        sx={{ bgcolor: cfg.bg, color: cfg.color, fontWeight: 600, borderRadius: '8px', fontSize: '0.7rem' }} />
                    );
                  })}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* ─── Budget cards ─────────────────────────── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: { xs: 2, md: 3 } }}>
        {budgets.map((budget) => {
          const status  = getBudgetStatus(budget);
          const cfg     = STATUS_CONFIG[status];
          const pct     = Math.min((budget.spent / budget.limit) * 100, 100);
          const isHover = hoveredId === budget.id;

          return (
            <Box key={budget.id}>
              <Card
                onMouseEnter={() => setHoveredId(budget.id)}
                onMouseLeave={() => setHoveredId(null)}
                sx={{
                  borderRadius: { xs: '12px', md: '16px' },
                  border: (theme) => '1px solid ' + (status === 'exceeded' ? (theme.palette.mode === 'dark' ? '#7f1d1d' : '#fecaca') : theme.palette.divider),
                  boxShadow: status === 'exceeded'
                    ? '0 4px 16px rgba(239,68,68,0.12)'
                    : '0 1px 3px rgba(16,24,40,0.06)',
                  transition: 'all 0.25s ease',
                  '&:hover': { boxShadow: '0 8px 32px rgba(16,24,40,0.10)', transform: 'translateY(-2px)' },
                  position: 'relative',
                }}
              >
                <CardContent sx={{ p: { xs: '16px !important', md: '24px !important' } }}>
                  {/* Card header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                      <Box sx={{
                        width: { xs: 34, md: 40 }, height: { xs: 34, md: 40 },
                        borderRadius: '10px', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(244,63,110,0.15)' : '#fff1f3',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <Target size={18} color="#f43f6e" />
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={700} color="text.primary"
                          sx={{ fontSize: { xs: '0.85rem', md: '1rem' } }}>
                          {budget.category}
                        </Typography>
                        <Chip label={cfg.label} size="small"
                          sx={{ bgcolor: cfg.bg, color: cfg.color, fontWeight: 600, height: 18, fontSize: '0.62rem', borderRadius: '5px' }} />
                        {budget.end_date && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            <Calendar size={10} color="#98a2b3" />
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                              {format(new Date(budget.start_date), 'MMM d')} - {format(new Date(budget.end_date), 'MMM d')}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <Button
                        size="small"
                        onClick={() => confirm({
                          title: 'Delete Budget',
                          message: `Are you sure you want to delete the ${budget.category} budget? This will not delete your transactions.`,
                          onConfirm: () => deleteBudget(budget.id)
                        })}
                        sx={{
                          minWidth: 0, p: 0.5,
                          color: '#cbd1db', borderRadius: '8px',
                          '&:hover': { color: '#ef4444', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(239,68,68,0.15)' : '#fee2e2' },
                          transition: 'all 0.2s ease',
                          mb: 0.5,
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                      {budget.end_date && (
                        <Typography variant="caption" fontWeight={600} color={differenceInDays(new Date(budget.end_date), new Date()) < 3 ? '#ef4444' : '#98a2b3'} sx={{ fontSize: '0.6rem', mt: 0.5 }}>
                          {differenceInDays(new Date(budget.end_date), new Date()) > 0 
                            ? `${differenceInDays(new Date(budget.end_date), new Date())}d left`
                            : 'Expired'}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Big remaining amount */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}
                      sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.62rem' }}>
                      Remaining
                    </Typography>
                    <Typography variant="h4" fontWeight={800}
                      color={budget.limit - budget.spent < 0 ? '#ef4444' : 'text.primary'}
                      fontFamily='"Plus Jakarta Sans", sans-serif'
                      sx={{ letterSpacing: '-0.02em', lineHeight: 1.1, mt: 0.25, fontSize: { xs: '1.4rem', md: '2.125rem' } }}>
                      {formatAmount(Math.max(0, budget.limit - budget.spent), currency.code)}
                    </Typography>
                  </Box>

                  {/* Progress */}
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ fontSize: { xs: '0.68rem', md: '0.75rem' } }}>
                        {formatAmount(budget.spent, currency.code)} spent
                      </Typography>
                      <Typography variant="caption" fontWeight={700} color={cfg.color} sx={{ fontSize: { xs: '0.68rem', md: '0.75rem' } }}>
                        {pct.toFixed(0)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate" value={pct}
                      sx={{
                        height: 8, borderRadius: '8px', bgcolor: (theme) => theme.palette.mode === 'dark' ? '#333' : '#f1f3f6',
                        '& .MuiLinearProgress-bar': { bgcolor: cfg.color, borderRadius: '8px' },
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                      of {formatAmount(budget.limit, currency.code)} budget
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          );
        })}
      </Box>

      {/* ─── Empty state ──────────────────────────── */}
      {budgets.length === 0 && (
        <Box sx={{ textAlign: 'center', py: { xs: 6, md: 10 } }}>
          <Box sx={{ fontSize: '3rem', mb: 2 }}>🎯</Box>
          <Typography variant="h5" fontWeight={700} color="text.primary" mb={1} sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
            No budgets yet
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3} sx={{ px: 2 }}>
            Set spending limits per category to stay on track.
          </Typography>
          <Button
            variant="contained" startIcon={<Plus size={18} />}
            onClick={() => setIsModalOpen(true)}
            sx={{
              background: 'linear-gradient(135deg, #f43f6e, #fb7292)',
              borderRadius: '12px', px: 4, py: 1.5,
            }}
          >
            Create your first budget
          </Button>
        </Box>
      )}

      <BudgetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Box>
  );
};

export default Budgets;
