// BudgetModal.jsx — Revamped
// Changes:
//   • MUI Dialog (not raw div)
//   • Consistent with TransactionModal styling
//   • Visual category icons on each option
//   • Limit input with dollar prefix

import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Button, TextField, Select, MenuItem, FormControl,
  InputLabel, Typography, Checkbox, FormControlLabel,
  List, ListItem, ListItemText, CircularProgress, Divider,
} from '@mui/material';
import { X, Calendar, History, ChevronRight, ChevronLeft } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { format, addMonths } from 'date-fns';
import { transactionsService } from '../../services/transactions.service';

const DEFAULT = () => ({
  category: '',
  limit: '',
  period: 'monthly',
  start_date: format(new Date(), 'yyyy-MM-dd'),
  end_date: format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
  selected_transaction_ids: [],
});

const BudgetModal = ({ isOpen, onClose }) => {
  const { addBudget, categories } = useFinance();
  const { currency, rates, format: formatCurrency } = useCurrency();
  const [form, setForm] = useState(DEFAULT());
  const [step, setStep] = useState(1); // 1: Info, 2: Transactions
  
  const [historicalTransactions, setHistoricalTransactions] = useState([]);
  const [loadingTxs, setLoadingTxs] = useState(false);

  // Fetch transactions when category changes
  useEffect(() => {
    if (form.category && step === 2) {
      const fetchTxs = async () => {
        setLoadingTxs(true);
        try {
          const data = await transactionsService.getAll({ 
            category: form.category,
            type: 'expense',
            limit: 100 
          });
          setHistoricalTransactions(data.transactions);
        } catch (err) {
          console.error('Failed to fetch transactions:', err);
        } finally {
          setLoadingTxs(false);
        }
      };
      fetchTxs();
    }
  }, [form.category, step]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!form.category || !form.limit) return;
    
    let limitRaw = parseFloat(form.limit);

    addBudget({ 
      ...form, 
      limit: limitRaw,
      start_date: new Date(form.start_date).toISOString(),
      end_date: new Date(form.end_date).toISOString(),
    });
    
    handleClose();
  };

  const handleClose = () => {
    setForm(DEFAULT());
    setStep(1);
    setHistoricalTransactions([]);
    onClose();
  };

  const toggleTx = (id) => {
    setForm(prev => ({
      ...prev,
      selected_transaction_ids: prev.selected_transaction_ids.includes(id)
        ? prev.selected_transaction_ids.filter(i => i !== id)
        : [...prev.selected_transaction_ids, id]
    }));
  };

  return (
    <Dialog
      open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px', boxShadow: '0 24px 64px rgba(16,24,40,0.18)',
          border: '1px solid', borderColor: 'divider', overflow: 'hidden'
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, pt: 3, pb: 2 }}>
        <Box>
          <Typography variant="h6" fontWeight={700} color="#101828" fontFamily='"Plus Jakarta Sans", sans-serif'>
            {step === 1 ? 'Create Budget' : 'Include Transactions'}
          </Typography>
          <Typography variant="caption" color="#98a2b3">
            {step === 1 ? 'Set a spending limit for a category' : `Select existing ${form.category} transactions to count towards this budget`}
          </Typography>
        </Box>
        <Button onClick={handleClose} size="small" sx={{ minWidth: 0, p: 0.5, borderRadius: '10px', '&:hover': { bgcolor: 'background.default' } }}>
          <X size={18} />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 1, minHeight: 400 }}>
        {step === 1 ? (
          <Box component="form" id="budget-form" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
            <FormControl fullWidth sx={{ mb: 2.5, mt: 1 }} required>
              <InputLabel>Category</InputLabel>
              <Select value={form.category} label="Category"
                onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth label="Budget Limit" type="number"
              inputProps={{ step: '0.01', min: '0' }}
              value={form.limit}
              onChange={(e) => setForm({ ...form, limit: e.target.value })}
              required sx={{ mb: 2.5 }}
              InputProps={{ startAdornment: <Typography sx={{ mr: 0.5, color: 'text.secondary' }}>{currency.symbol}</Typography> }}
              helperText={`Total allowed spending in ${currency.code}`}
            />

            <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
              <TextField
                fullWidth label="Start Date" type="date"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                required InputLabelProps={{ shrink: true }}
                InputProps={{ startAdornment: <Calendar size={16} style={{ marginRight: 8, color: 'text.secondary' }} /> }}
              />
              <TextField
                fullWidth label="End Date" type="date"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                required InputLabelProps={{ shrink: true }}
                InputProps={{ startAdornment: <Calendar size={16} style={{ marginRight: 8, color: 'text.secondary' }} /> }}
              />
            </Box>

            <FormControl fullWidth sx={{ mb: 1 }}>
              <InputLabel>Renewal Period</InputLabel>
              <Select value={form.period} label="Renewal Period"
                onChange={(e) => setForm({ ...form, period: e.target.value })}>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
                <MenuItem value="one-time">One-time (No renewal)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        ) : (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {loadingTxs ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress size={32} color="secondary" /></Box>
            ) : historicalTransactions.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="body2" color="#98a2b3">No previous transactions found for this category.</Typography>
              </Box>
            ) : (
              <Box>
                <Typography variant="caption" fontWeight={600} color="#667085" sx={{ mb: 1.5, display: 'block', textTransform: 'uppercase' }}>
                  Choose transactions to include in current spending:
                </Typography>
                <List sx={{ 
                  maxHeight: 300, overflow: 'auto', bgcolor: 'background.default', borderRadius: '12px', 
                  border: '1px solid', borderColor: 'divider', mb: 2 
                }}>
                  {historicalTransactions.map((tx) => (
                    <React.Fragment key={tx.id}>
                      <ListItem 
                        button onClick={() => toggleTx(tx.id)}
                        sx={{ py: 1, px: 2, '&:hover': { bgcolor: 'background.paper' } }}
                      >
                        <Checkbox 
                          checked={form.selected_transaction_ids.includes(tx.id)} 
                          sx={{ color: '#f43f6e', '&.Mui-checked': { color: '#f43f6e' } }}
                        />
                        <ListItemText 
                          primary={tx.description} 
                          secondary={format(new Date(tx.date), 'MMM d, yyyy')}
                          primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }}
                          secondaryTypographyProps={{ fontSize: '0.75rem' }}
                        />
                        <Typography fontWeight={700} color="#101828" variant="body2">
                          {formatCurrency(tx.amount, tx.currency)}
                        </Typography>
                      </ListItem>
                      <Divider component="li" sx={{ borderColor: 'divider', opacity: 0.5 }} />
                    </React.Fragment>
                  ))}
                </List>
                <Typography variant="caption" color="#98a2b3">
                  Selected: {form.selected_transaction_ids.length} transactions
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
        {step === 1 ? (
          <>
            <Button onClick={handleClose} variant="outlined"
              sx={{ flex: 1, borderRadius: '12px', py: 1.25, borderColor: 'divider', color: 'text.secondary' }}>
              Cancel
            </Button>
            <Button 
              onClick={() => setStep(2)} disabled={!form.category || !form.limit}
              variant="contained" endIcon={<ChevronRight size={16} />}
              sx={{
                flex: 1, borderRadius: '12px', py: 1.25,
                background: 'linear-gradient(135deg, #f43f6e, #fb7292)',
                boxShadow: '0 4px 16px rgba(244,63,110,0.25)',
              }}>
              Next Step
            </Button>
          </>
        ) : (
          <>
            <Button 
              onClick={() => setStep(1)} variant="outlined" startIcon={<ChevronLeft size={16} />}
              sx={{ flex: 1, borderRadius: '12px', py: 1.25, borderColor: 'divider', color: 'text.secondary' }}>
              Back
            </Button>
            <Button onClick={handleSubmit} variant="contained"
              sx={{
                flex: 1, borderRadius: '12px', py: 1.25,
                background: 'linear-gradient(135deg, #f43f6e, #fb7292)',
                boxShadow: '0 4px 16px rgba(244,63,110,0.25)',
              }}>
              Create Budget
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};


export default BudgetModal;
