// TransactionModal.jsx — Revamped
// Changes:
//   • Replaced raw divs + Tailwind with MUI Dialog (proper accessibility, backdrop)
//   • Gradient submit button matching design system
//   • Income/Expense type selector as segmented control (not plain select)
//   • Clean input labels and spacing

import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Button, TextField, Select, MenuItem, FormControl,
  InputLabel, Typography, ToggleButton, ToggleButtonGroup,
  IconButton,
} from '@mui/material';
import { X, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { format } from 'date-fns';

const DEFAULT_FORM = () => ({
  type: 'expense',
  amount: '',
  category: '',
  description: '',
  date: format(new Date(), 'yyyy-MM-dd'),
});

const TransactionModal = ({ isOpen, onClose }) => {
  const { addTransaction, categories } = useFinance();
  const { currency, rates } = useCurrency();
  const [form, setForm] = useState(DEFAULT_FORM());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || !form.category || !form.description) return;
    
    // Store the raw amount in the user's current currency — no conversion
    // Convert YYYY-MM-DD to ISO string for the backend
    const isoDate = new Date(form.date).toISOString();

    addTransaction({
      ...form,
      amount: parseFloat(form.amount),
      currency: currency.code,
      date: isoDate,
    });
    setForm(DEFAULT_FORM());
    onClose();
  };

  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other Income'];

  return (
    <Dialog
      open={isOpen} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px', boxShadow: '0 24px 64px rgba(16,24,40,0.18)',
          border: '1px solid', borderColor: 'divider', overflow: 'hidden',
        },
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, pt: 3, pb: 2 }}>
        <Box>
          <Typography variant="h6" fontWeight={700} color="#101828" fontFamily='"Plus Jakarta Sans", sans-serif'>
            Add Transaction
          </Typography>
          <Typography variant="caption" color="#98a2b3">Fill in the details below</Typography>
        </Box>
        <IconButton onClick={onClose} size="small"
          sx={{ borderRadius: '10px', '&:hover': { bgcolor: 'background.default' } }}>
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 0 }}>
        <Box component="form" id="tx-form" onSubmit={handleSubmit}>

          {/* Type toggle */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" fontWeight={600} color="#667085"
              sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.7rem', display: 'block', mb: 1 }}>
              Transaction Type
            </Typography>
            <ToggleButtonGroup
              value={form.type} exclusive
              onChange={(_, v) => v && setForm({ ...form, type: v, category: '' })}
              sx={{ width: '100%' }}
            >
              {[
                { value: 'expense', label: 'Expense', icon: TrendingDown, color: '#ef4444' },
                { value: 'income',  label: 'Income',  icon: TrendingUp,   color: '#10b981' },
              ].map(({ value, label, icon: Icon, color }) => (
                <ToggleButton key={value} value={value}
                  sx={{
                    flex: 1, py: 1.5, borderRadius: '12px !important',
                    border: '1px solid #e4e7ed !important',
                    gap: 1, fontWeight: 600, color: 'text.secondary',
                    '&.Mui-selected': {
                      bgcolor: form.type === value ? `${color}12` : 'transparent',
                      color,
                      border: `1px solid ${color}40 !important`,
                    },
                    '&:first-of-type': { mr: 1 },
                  }}
                >
                  <Icon size={16} /> {label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          {/* Amount */}
          <TextField
            fullWidth label="Amount" type="number" inputProps={{ step: '0.01', min: '0' }}
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required sx={{ mb: 2.5 }}
            InputProps={{ startAdornment: <Typography sx={{ mr: 0.5, color: 'text.secondary' }}>{currency.symbol}</Typography> }}
          />

          {/* Category */}
          <FormControl fullWidth sx={{ mb: 2.5 }} required>
            <InputLabel>Category</InputLabel>
            <Select
              value={form.category} label="Category"
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {(form.type === 'expense' ? categories : incomeCategories).map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Date Picker */}
          <TextField
            fullWidth label="Date" type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required sx={{ mb: 2.5 }}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <Box sx={{ mr: 1, color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
                  <Calendar size={18} />
                </Box>
              ),
            }}
          />

          {/* Description */}
          <TextField
            fullWidth label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required sx={{ mb: 1 }}
            placeholder="e.g. Lunch at Chipotle"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
        <Button onClick={onClose} variant="outlined"
          sx={{ flex: 1, borderRadius: '12px', py: 1.25, borderColor: 'divider', color: 'text.secondary', '&:hover': { borderColor: '#cbd1db', bgcolor: 'background.default' } }}>
          Cancel
        </Button>
        <Button type="submit" form="tx-form" variant="contained"
          sx={{
            flex: 1, borderRadius: '12px', py: 1.25,
            background: 'linear-gradient(135deg, #f43f6e, #fb7292)',
            boxShadow: '0 4px 16px rgba(244,63,110,0.25)',
            '&:hover': { boxShadow: '0 8px 24px rgba(244,63,110,0.35)' },
          }}>
          Add Transaction
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionModal;
