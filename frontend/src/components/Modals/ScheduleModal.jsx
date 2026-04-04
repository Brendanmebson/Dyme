import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Box, Typography, Button, TextField, MenuItem, 
  InputAdornment, IconButton, CircularProgress
} from '@mui/material';
import { useFinance } from '../../context/FinanceContext';
import { useCurrency } from '../../context/CurrencyContext';
import { X, Check, Calendar, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const FREQUENCY_OPTIONS = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'bi_weekly', label: 'Bi-Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'unstructured', label: 'Unstructured (Project-based)' },
];

const ScheduleModal = ({ isOpen, onClose, schedule = null }) => {
  const { addSchedule, updateSchedule } = useFinance();
  const { currency } = useCurrency();
  
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    currency: currency.code,
    frequency: 'monthly',
    next_expected_date: format(new Date(), 'yyyy-MM-dd'),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (schedule) {
      setFormData({
        ...schedule,
        next_expected_date: schedule.next_expected_date ? schedule.next_expected_date.split('T')[0] : format(new Date(), 'yyyy-MM-dd'),
      });
    } else {
      setFormData({
        name: '',
        amount: '',
        currency: currency.code,
        frequency: 'monthly',
        next_expected_date: format(new Date(), 'yyyy-MM-dd'),
      });
    }
  }, [schedule, currency]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.amount) {
      setError('Please fill in Name and Amount');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (schedule) {
        await updateSchedule(schedule.id, {
          ...formData,
          amount: Number(formData.amount),
        });
      } else {
        await addSchedule({
          ...formData,
          amount: Number(formData.amount),
          next_expected_date: formData.frequency === 'unstructured' ? null : new Date(formData.next_expected_date).toISOString(),
        });
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save schedule');
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
        {schedule ? 'Edit Schedule' : 'New Income Schedule'}
        <IconButton onClick={onClose} size="small"><X size={20} /></IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField 
            label="Income Source"
            placeholder="e.g. Monthly Salary, Freelance Gig"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            fullWidth
            required
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Expected Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
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
              <MenuItem value="GBP">GBP</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
            </TextField>
          </Box>

          <TextField
            select
            label="Frequency"
            value={formData.frequency}
            onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
            fullWidth
          >
            {FREQUENCY_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>

          {formData.frequency !== 'unstructured' && (
            <TextField
              label="Next Expected Date"
              type="date"
              value={formData.next_expected_date}
              onChange={(e) => setFormData(prev => ({ ...prev, next_expected_date: e.target.value }))}
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start"><Calendar size={18} color="#98a2b3" /></InputAdornment>,
              }}
              InputLabelProps={{ shrink: true }}
            />
          )}

          <Typography variant="caption" color="text.secondary" display="block">
            {formData.frequency === 'unstructured' 
              ? 'Unstructured income will appear on your dashboard as a prompt periodically.'
              : 'Recurring income will automatically notify you when the expected date approaches.'}
          </Typography>

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
            background: 'linear-gradient(135deg, #10b981, #34d399)',
            borderRadius: '10px', px: 3, fontWeight: 600, textTransform: 'none',
            boxShadow: '0 4px 16px rgba(16,185,129,0.25)',
          }}
        >
          {schedule ? 'Save Changes' : 'Create Schedule'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleModal;
