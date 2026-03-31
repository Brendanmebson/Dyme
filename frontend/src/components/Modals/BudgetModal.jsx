// BudgetModal.jsx — Revamped
// Changes:
//   • MUI Dialog (not raw div)
//   • Consistent with TransactionModal styling
//   • Visual category icons on each option
//   • Limit input with dollar prefix

import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Button, TextField, Select, MenuItem, FormControl,
  InputLabel, Typography, IconButton,
} from '@mui/material';
import { X } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

const DEFAULT = { category: '', limit: '' };

const BudgetModal = ({ isOpen, onClose }) => {
  const { addBudget, categories } = useFinance();
  const { currency, rates } = useCurrency();
  const [form, setForm] = useState(DEFAULT);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.category || !form.limit) return;
    
    // Convert input limit (in current currency) to BASE_CURRENCY (USD)
    let limitInUSD = parseFloat(form.limit);
    if (rates[currency.code] && rates[currency.code] !== 0) {
      limitInUSD = limitInUSD / rates[currency.code];
    }

    addBudget({ ...form, limit: limitInUSD });
    setForm(DEFAULT);
    onClose();
  };

  return (
    <Dialog
      open={isOpen} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px', boxShadow: '0 24px 64px rgba(16,24,40,0.18)',
          border: '1px solid #e4e7ed',
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, pt: 3, pb: 2 }}>
        <Box>
          <Typography variant="h6" fontWeight={700} color="#101828" fontFamily='"Plus Jakarta Sans", sans-serif'>
            Create Budget
          </Typography>
          <Typography variant="caption" color="#98a2b3">Set a spending limit for a category</Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ borderRadius: '10px', '&:hover': { bgcolor: '#f8f9fb' } }}>
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 0 }}>
        <Box component="form" id="budget-form" onSubmit={handleSubmit}>
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
            fullWidth label="Monthly Budget Limit" type="number"
            inputProps={{ step: '0.01', min: '0' }}
            value={form.limit}
            onChange={(e) => setForm({ ...form, limit: e.target.value })}
            required sx={{ mb: 1 }}
            InputProps={{ startAdornment: <Typography sx={{ mr: 0.5, color: '#98a2b3' }}>{currency.symbol}</Typography> }}
            helperText={`Set how much you want to spend in this category per month (in ${currency.code})`}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
        <Button onClick={onClose} variant="outlined"
          sx={{ flex: 1, borderRadius: '12px', py: 1.25, borderColor: '#e4e7ed', color: '#667085', '&:hover': { borderColor: '#cbd1db' } }}>
          Cancel
        </Button>
        <Button type="submit" form="budget-form" variant="contained"
          sx={{
            flex: 1, borderRadius: '12px', py: 1.25,
            background: 'linear-gradient(135deg, #f43f6e, #fb7292)',
            boxShadow: '0 4px 16px rgba(244,63,110,0.25)',
          }}>
          Create Budget
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BudgetModal;
