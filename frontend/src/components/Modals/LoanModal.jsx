import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Box, Typography, Button, TextField, MenuItem, 
  InputAdornment, IconButton, CircularProgress,
  ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { useFinance } from '../../context/FinanceContext';
import { useCurrency } from '../../context/CurrencyContext';
import { X, Check, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format } from 'date-fns';

const LoanModal = ({ isOpen, onClose, loan = null }) => {
  const { addLoan, updateLoan, addTransaction } = useFinance();
  const { currency } = useCurrency();
  
  const [mode, setMode] = useState('add'); // 'add' or 'repayment'
  const [formData, setFormData] = useState({
    name: '',
    total_amount: '',
    type: 'lent',
    currency: currency.code,
    due_date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
  });

  const [repaymentAmount, setRepaymentAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (loan) {
      setMode('repayment');
      setFormData({
        ...loan,
        due_date: loan.due_date ? loan.due_date.split('T')[0] : format(new Date(), 'yyyy-MM-dd'),
      });
      setRepaymentAmount('');
    } else {
      setMode('add');
      setFormData({
        name: '',
        total_amount: '',
        type: 'lent',
        currency: currency.code,
        due_date: format(new Date(), 'yyyy-MM-dd'),
        description: '',
      });
    }
  }, [loan, currency]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      if (mode === 'add') {
        if (!formData.name || !formData.total_amount) throw new Error('Fill in all fields');
        await addLoan({
          ...formData,
          total_amount: Number(formData.total_amount),
          remaining_amount: Number(formData.total_amount),
          due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
        });
      } else {
        // Repayment Logic
        const amt = Number(repaymentAmount);
        if (!amt || amt <= 0) throw new Error('Invalid repayment amount');
        if (amt > loan.remaining_amount) throw new Error('Amount exceeds remaining balance');

        // 1. Create Transaction
        await addTransaction({
          type: loan.type === 'lent' ? 'income' : 'expense',
          amount: amt,
          currency: loan.currency,
          category: 'Debt Repayment',
          description: `Repayment for loan: ${loan.name}`,
          source: loan.type === 'borrowed' ? 'account' : undefined,
          destination: loan.type === 'lent' ? 'account' : undefined,
          date: new Date().toISOString(),
        });

        // 2. Update Loan
        await updateLoan(loan.id, {
          remaining_amount: loan.remaining_amount - amt,
        });
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: '20px', p: 1 }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800 
      }}>
        {mode === 'add' ? 'New Loan Record' : `Repayment: ${loan.name}`}
        <IconButton onClick={onClose} size="small"><X size={20} /></IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {mode === 'add' ? (
            <>
              <ToggleButtonGroup
                value={formData.type}
                exclusive
                onChange={(_, v) => v && setFormData(p => ({ ...p, type: v }))}
                fullWidth
                sx={{ mb: 1 }}
              >
                <ToggleButton value="lent" sx={{ textTransform: 'none', fontWeight: 700, gap: 1 }}>
                  <ArrowUpRight size={18} /> I Lent Money
                </ToggleButton>
                <ToggleButton value="borrowed" sx={{ textTransform: 'none', fontWeight: 700, gap: 1 }}>
                  <ArrowDownRight size={18} /> I Borrowed
                </ToggleButton>
              </ToggleButtonGroup>

              <TextField 
                label="Person / Entity Name"
                placeholder="e.g. John Doe, Bank Loan"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                fullWidth
                required
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Total Amount"
                  type="number"
                  value={formData.total_amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, total_amount: e.target.value }))}
                  sx={{ flex: 1 }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">{currency.symbol}</InputAdornment>,
                  }}
                  required
                />
                <TextField
                  select
                  label="Currency"
                  value={formData.currency}
                  onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                  sx={{ width: 100 }}
                >
                  <MenuItem value="NGN">NGN</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                </TextField>
              </Box>

              <TextField
                label="Expected Due Date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Calendar size={18} color="#98a2b3" /></InputAdornment>,
                }}
                InputLabelProps={{ shrink: true }}
              />
            </>
          ) : (
            <>
              <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: '12px', mb: 1 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>REMAINING BALANCE</Typography>
                <Typography variant="h5" fontWeight={800} color={loan.type === 'lent' ? '#10b981' : '#ef4444'}>
                  {formatAmount(loan.remaining_amount, loan.currency)}
                </Typography>
              </Box>

              <TextField
                label="Repayment Amount"
                type="number"
                value={repaymentAmount}
                onChange={(e) => setRepaymentAmount(e.target.value)}
                fullWidth
                placeholder={`Max: ${loan.remaining_amount}`}
                InputProps={{
                  startAdornment: <InputAdornment position="start">{currency.symbol}</InputAdornment>,
                }}
                autoFocus
              />
              
              <Button 
                variant="text" 
                size="small" 
                onClick={() => setRepaymentAmount(loan.remaining_amount.toString())}
                sx={{ alignSelf: 'flex-start', mt: -1, fontWeight: 700 }}
              >
                Full Repayment
              </Button>
            </>
          )}

          {error && <Typography variant="caption" color="error">{error}</Typography>}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
        <Button onClick={onClose} sx={{ borderRadius: '10px', color: 'text.secondary', fontWeight: 600, textTransform: 'none' }}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <Check size={18} />}
          sx={{ 
            background: mode === 'add' ? 'linear-gradient(135deg, #a855f7, #c084fc)' : 'linear-gradient(135deg, #10b981, #34d399)',
            borderRadius: '10px', px: 3, fontWeight: 600, textTransform: 'none',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          }}
        >
          {mode === 'add' ? 'Create Loan' : 'Log Repayment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoanModal;
