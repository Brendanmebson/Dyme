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
import { X, TrendingUp, TrendingDown, Calendar, Upload, Zap, ArrowRightLeft } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { bankingService } from '../../services/banking.service';
import { format } from 'date-fns';

const DEFAULT_FORM = () => ({
  type: 'expense',
  amount: '',
  fee: '',
  category: '',
  description: '',
  date: format(new Date(), 'yyyy-MM-dd'),
  source: 'account',
  destination: 'account',
});

const TransactionModal = ({ isOpen, onClose }) => {
  const { addTransaction, categories, refreshData } = useFinance();
  const { currency, rates } = useCurrency();
  const [form, setForm] = useState(DEFAULT_FORM());
  const [uploading, setUploading] = useState(false);

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    if (!lowerName.endsWith('.csv') && !lowerName.endsWith('.xlsx') && !lowerName.endsWith('.xls')) {
      alert('Please upload a valid CSV or Excel statement.');
      return;
    }

    setUploading(true);
    try {
      const res = await bankingService.uploadCSV(file, currency.code);
      alert(res.message || `Imported ${res.count} transactions.`);
      await refreshData();
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to import statement.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalCategory = form.type === 'transfer' ? 'Transfer' : form.category;
    if (!form.amount || !finalCategory || !form.description) return;
    
    setUploading(true);
    try {
      const isoDate = new Date(form.date).toISOString();

      // Submit primary transaction
      await addTransaction({
        type: form.type,
        amount: parseFloat(form.amount),
        category: finalCategory,
        description: form.description,
        currency: currency.code,
        date: isoDate,
        source: form.source,
        destination: form.destination,
      });

      // If transfer and fee > 0, submit secondary expense
      if (form.type === 'transfer' && form.fee && parseFloat(form.fee) > 0) {
        await addTransaction({
          type: 'expense',
          amount: parseFloat(form.fee),
          category: 'Bank Fees',
          description: `${form.description} (Fee)`,
          currency: currency.code,
          date: isoDate,
          source: form.source,
          destination: 'account', 
        });
      }

      setForm(DEFAULT_FORM());
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to add transaction.');
    } finally {
      setUploading(false);
    }
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
          <Typography variant="h6" fontWeight={800} color="text.primary" fontFamily='"Plus Jakarta Sans", sans-serif'
            sx={{ letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 1 }}>
            Add Transaction
          </Typography>
          <Typography variant="caption" color="text.secondary">Enter manually or import a statement</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <input
            type="file" accept=".csv, .xlsx, .xls" id="modal-stmt-upload"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
          <label htmlFor="modal-stmt-upload">
            <Button
              component="span"
              size="small"
              disabled={uploading}
              startIcon={uploading ? <CircularProgress size={14} /> : <Zap size={14} />}
              sx={{
                borderRadius: '10px', textTransform: 'none', fontWeight: 700, fontSize: '0.75rem',
                color: '#f43f6e', bgcolor: 'rgba(244,63,110,0.06)',
                '&:hover': { bgcolor: 'rgba(244,63,110,0.12)' },
                px: 1.5, py: 0.75,
              }}
            >
              {uploading ? 'Importing...' : 'Import Statement'}
            </Button>
          </label>
          <IconButton onClick={onClose} size="small"
            sx={{ borderRadius: '10px', '&:hover': { bgcolor: 'background.default' } }}>
            <X size={18} />
          </IconButton>
        </Box>
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
              onChange={(_, v) => {
                if (v) {
                  let { source, destination } = form;
                  if (v === 'transfer' && source === destination) {
                    source = 'account';
                    destination = 'cash';
                  }
                  setForm({ ...form, type: v, category: '', source, destination });
                }
              }}
              sx={{ width: '100%' }}
            >
              {[
                { value: 'expense', label: 'Expense', icon: TrendingDown, color: '#ef4444' },
                { value: 'income',  label: 'Income',  icon: TrendingUp,   color: '#10b981' },
                { value: 'transfer', label: 'Transfer', icon: ArrowRightLeft, color: '#f59e0b' },
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

          {/* Source / Destination Selectors based on Type */}
          {form.type === 'expense' && (
            <FormControl fullWidth sx={{ mb: 2.5 }}>
              <InputLabel>Source</InputLabel>
              <Select
                value={form.source} label="Source"
                onChange={(e) => setForm({ ...form, source: e.target.value })}
              >
                <MenuItem value="account">Account</MenuItem>
                <MenuItem value="cash">Cash</MenuItem>
              </Select>
            </FormControl>
          )}

          {form.type === 'income' && (
            <FormControl fullWidth sx={{ mb: 2.5 }}>
              <InputLabel>Destination</InputLabel>
              <Select
                value={form.destination} label="Destination"
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
              >
                <MenuItem value="account">Account</MenuItem>
                <MenuItem value="cash">Cash</MenuItem>
              </Select>
            </FormControl>
          )}

          {form.type === 'transfer' && (
            <FormControl fullWidth sx={{ mb: 2.5 }}>
              <InputLabel>Direction</InputLabel>
              <Select
                value={`${form.source}-${form.destination}`} label="Direction"
                onChange={(e) => {
                  const [src, dest] = e.target.value.split('-');
                  setForm({ ...form, source: src, destination: dest });
                }}
              >
                <MenuItem value="account-cash">Account → Cash</MenuItem>
                <MenuItem value="cash-account">Cash → Account</MenuItem>
              </Select>
            </FormControl>
          )}

          {/* Amount */}
          <TextField
            fullWidth label="Amount" type="number" inputProps={{ step: '0.01', min: '0' }}
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required sx={{ mb: 2.5 }}
            InputProps={{ startAdornment: <Typography sx={{ mr: 0.5, color: 'text.secondary' }}>{currency.symbol}</Typography> }}
          />

          {/* Optional Transfer Fee */}
          {form.type === 'transfer' && (
            <TextField
              fullWidth label="Transfer Fee (Optional)" type="number" inputProps={{ step: '0.01', min: '0' }}
              value={form.fee}
              onChange={(e) => setForm({ ...form, fee: e.target.value })}
              sx={{ mb: 2.5 }}
              InputProps={{ startAdornment: <Typography sx={{ mr: 0.5, color: 'text.secondary' }}>{currency.symbol}</Typography> }}
              helperText="This fee will be recorded as a separate expense deducted from the source."
            />
          )}

          {/* Category */}
          {form.type !== 'transfer' && (
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
          )}

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
        <Button type="submit" form="tx-form" variant="contained" disabled={uploading}
          sx={{
            flex: 1, borderRadius: '12px', py: 1.25,
            background: 'linear-gradient(135deg, #f43f6e, #fb7292)',
            boxShadow: '0 4px 16px rgba(244,63,110,0.25)',
            '&:hover': { boxShadow: '0 8px 24px rgba(244,63,110,0.35)' },
          }}>
          {uploading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Add Transaction'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionModal;
