import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useCurrency } from '../context/CurrencyContext';
import { useConfirm } from '../context/ConfirmContext';
import LoanModal from '../components/Modals/LoanModal';
import { 
  Box, Typography, Button, Card, CardContent, Grid, 
  Avatar, Chip, IconButton, Tooltip, LinearProgress,
  Tab, Tabs, Paper, Divider
} from '@mui/material';
import { 
  Plus, HandCoins, ArrowDownRight, ArrowUpRight, 
  Trash2, History, Calendar, Calculator, CheckCircle2
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const Loans = () => {
  const { loans, deleteLoan, updateLoan, addTransaction } = useFinance();
  const { formatAmount } = useCurrency();
  const { confirm } = useConfirm();
  const [tab, setTab] = useState(0); // 0: Lent, 1: Borrowed
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  const filteredLoans = loans.filter(l => l.type === (tab === 0 ? 'lent' : 'borrowed'));

  const totalOwedToMe = loans.filter(l => l.type === 'lent').reduce((s, l) => s + l.remaining_amount, 0);
  const totalIOwe     = loans.filter(l => l.type === 'borrowed').reduce((s, l) => s + l.remaining_amount, 0);

  const handleAddRepayment = (loan) => {
    confirm({
      title: 'Log Repayment',
      message: `How much was repaid for "${loan.name}"? (Entering the full remaining amount will close the loan)`,
      onConfirm: async () => {
        // For simplicity, we'll ask for amount in the modal later, 
        // but for now let's just mark the whole thing as paid or open a specific modal.
        // I'll update the LoanModal to also handle repayments.
        setSelectedLoan(loan);
        setIsModalOpen(true);
      }
    });
  };

  const handleDelete = (id) => {
    confirm({
      title: 'Delete Loan Record',
      message: 'Are you sure you want to delete this loan record? This will not affect your transactions.',
      onConfirm: () => deleteLoan(id)
    });
  };

  return (
    <Box sx={{ pt: { xs: 3, md: 4 } }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        gap: 2,
        mb: 4 
      }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="text.primary" 
            fontFamily='"Plus Jakarta Sans", sans-serif' sx={{ mb: 0.5, fontSize: { xs: '1.75rem', md: '2.142rem' } }}>
            Loans & Debts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Keep track of money you've lent to friends or borrowed from others.
          </Typography>
        </Box>
        <Button
          variant="contained"
          fullWidth={{ xs: true, sm: false }}
          startIcon={<Plus size={18} />}
          onClick={() => setIsModalOpen(true)}
          sx={{
            background: 'linear-gradient(135deg, #a855f7, #c084fc)',
            borderRadius: '12px', px: 3, py: 1.25, fontWeight: 600,
            boxShadow: '0 4px 16px rgba(168,85,247,0.25)',
            '&:hover': { boxShadow: '0 8px 24px rgba(168,85,247,0.35)' },
          }}
        >
          Add Loan
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 4, width: '100%', ml: 0 }}>
        <Grid item xs={6}>
          <Card sx={{ borderRadius: '20px', bgcolor: '#f0fdf4', border: '1px solid #d1fae5', boxShadow: 'none', height: '100%', width: '100%' }}>
            <CardContent sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, gap: { xs: 1, md: 2.5 }, p: { xs: 2, md: 3 } }}>
              <Box sx={{ width: { xs: 32, md: 44 }, height: { xs: 32, md: 44 }, borderRadius: '10px', bgcolor: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ArrowUpRight size={18} />
              </Box>
              <Box>
                <Typography variant="caption" fontWeight={700} color="#065f46" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                  Owed to you
                </Typography>
                <Typography variant="h5" fontWeight={800} color="#064e3b" sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}>
                  {formatAmount(totalOwedToMe)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card sx={{ borderRadius: '20px', bgcolor: '#fef2f2', border: '1px solid #fecaca', boxShadow: 'none', height: '100%', width: '100%' }}>
            <CardContent sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, gap: { xs: 1, md: 2.5 }, p: { xs: 2, md: 3 } }}>
              <Box sx={{ width: { xs: 32, md: 44 }, height: { xs: 32, md: 44 }, borderRadius: '10px', bgcolor: '#ef4444', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ArrowDownRight size={18} />
              </Box>
              <Box>
                <Typography variant="caption" fontWeight={700} color="#991b1b" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                  You owe
                </Typography>
                <Typography variant="h5" fontWeight={800} color="#7f1d1d" sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}>
                  {formatAmount(totalIOwe)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: 'none', mb: 4 }}>
        <Tabs 
          value={tab} 
          onChange={(_, v) => setTab(v)} 
          indicatorColor="primary"
          textColor="primary"
          sx={{ 
            px: 2, pt: 1, borderBottom: '1px solid', borderColor: 'divider',
            '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', fontSize: '1rem' }
          }}
        >
          <Tab label="Lent Money" icon={<ArrowUpRight size={18} />} iconPosition="start" />
          <Tab label="Borrowed Money" icon={<ArrowDownRight size={18} />} iconPosition="start" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {filteredLoans.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <HandCoins size={48} color="#98a2b3" style={{ marginBottom: 16 }} />
              <Typography variant="h6" fontWeight={700} color="text.primary">
                No {tab === 0 ? 'lent' : 'borrowed'} loans found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add a new record to start tracking repayments.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredLoans.map((loan) => {
                const progress = ((loan.total_amount - loan.remaining_amount) / loan.total_amount) * 100;
                
                return (
                  <Grid item xs={12} md={6} key={loan.id}>
                    <Card sx={{ 
                      borderRadius: '16px', border: '1px solid', borderColor: 'divider',
                      boxShadow: 'none', transition: 'all 0.2s',
                      '&:hover': { borderColor: tab === 0 ? '#10b981' : '#ef4444', bgcolor: 'action.hover' }
                    }}>
                      <CardContent sx={{ p: 2.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={800}>{loan.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {loan.due_date ? `Due ${format(parseISO(loan.due_date), 'MMM d, yyyy')}` : 'No due date'}
                            </Typography>
                          </Box>
                          <IconButton size="small" onClick={() => handleDelete(loan.id)} sx={{ color: 'text.disabled', '&:hover': { color: '#ef4444' } }}>
                            <Trash2 size={16} />
                          </IconButton>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'flex-end' }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase' }}>Remaining</Typography>
                            <Typography variant="h6" fontWeight={800} color={tab === 0 ? '#10b981' : '#ef4444'}>
                              {formatAmount(loan.remaining_amount, loan.currency)}
                            </Typography>
                          </Box>
                          <Typography variant="caption" fontWeight={800} color="text.secondary">
                            {progress.toFixed(0)}% Repaid
                          </Typography>
                        </Box>

                        <LinearProgress 
                          variant="determinate" 
                          value={progress} 
                          sx={{ 
                            height: 8, borderRadius: '4px', bgcolor: 'divider', mb: 2,
                            '& .MuiLinearProgress-bar': { bgcolor: tab === 0 ? '#10b981' : '#ef4444' }
                          }}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            Original: {formatAmount(loan.total_amount, loan.currency)}
                          </Typography>
                          <Button 
                            size="small" 
                            variant="outlined"
                            startIcon={<History size={14} />}
                            onClick={() => handleAddRepayment(loan)}
                            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}
                          >
                            Repayment
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      </Paper>

      <LoanModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setSelectedLoan(null); }} 
        loan={selectedLoan}
      />
    </Box>
  );
};

export default Loans;
