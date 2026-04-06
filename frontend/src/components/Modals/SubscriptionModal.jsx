import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Box, Typography, Button, TextField, MenuItem, 
  InputAdornment, Autocomplete, Avatar, Switch, FormControlLabel,
  CircularProgress, useMediaQuery, useTheme, Slide
} from '@mui/material';
import { useFinance } from '../../context/FinanceContext';
import { useCurrency } from '../../context/CurrencyContext';
import { X, Check, Search, Calendar, Globe } from 'lucide-react';
import { addMonths, format, parseISO } from 'date-fns';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const POPULAR_SERVICES = [
  { name: 'Netflix', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg', category: 'Entertainment' },
  { name: 'Spotify', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg', category: 'Entertainment' },
  { name: 'Amazon Prime', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Amazon_icon.png', category: 'Shopping' },
  { name: 'YouTube Premium', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg', category: 'Entertainment' },
  { name: 'Vercel', logo: 'https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png', category: 'Professional' },
  { name: 'Supabase', logo: 'https://supabase.com/favicons/favicon-196x196.png', category: 'Professional' },
  { name: 'Google One', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Google_One_logo.svg', category: 'Utilities' },
  { name: 'Apple One', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', category: 'Utilities' },
  { name: 'ChatGPT Plus', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg', category: 'Productivity' },
  { name: 'LinkedIn Premium', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png', category: 'Professional' },
  { name: 'Disney+', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg', category: 'Entertainment' },
];

const FREQUENCY_OPTIONS = [
  { value: '1_month', label: '1 Month' },
  { value: '2_months', label: '2 Months' },
  { value: '3_months', label: '3 Months' },
  { value: '1_year', label: '1 Year' },
  { value: 'custom', label: 'Custom Duration' },
];

const SubscriptionModal = ({ isOpen, onClose, subscription = null }) => {
  const { addSubscription, updateSubscription } = useFinance();
  const { currency } = useCurrency();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    currency: currency.code,
    frequency: '1_month',
    is_recurring: true,
    next_billing_date: format(new Date(), 'yyyy-MM-dd'),
    logo_url: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (subscription) {
      setFormData({
        ...subscription,
        next_billing_date: sub.next_billing_date.split('T')[0],
      });
    } else {
      setFormData({
        name: '',
        amount: '',
        currency: currency.code,
        frequency: '1_month',
        is_recurring: true,
        next_billing_date: format(new Date(), 'yyyy-MM-dd'),
        logo_url: '',
      });
    }
  }, [subscription, currency]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.amount) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (subscription) {
        await updateSubscription(subscription.id, {
          ...formData,
          amount: Number(formData.amount),
        });
      } else {
        await addSubscription({
          ...formData,
          amount: Number(formData.amount),
          next_billing_date: new Date(formData.next_billing_date).toISOString(),
        });
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save subscription');
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
      fullScreen={isMobile}
      TransitionComponent={isMobile ? Transition : undefined}
      PaperProps={{
        sx: { 
          borderRadius: isMobile ? 0 : '20px', 
          p: isMobile ? 0 : 1 
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800 
      }}>
        {subscription ? 'Edit Subscription' : 'Add Subscription'}
        <Button onClick={onClose} size="small" sx={{ minWidth: 0, p: 0.5 }}><X size={20} /></Button>
      </DialogTitle>

      <DialogContent sx={{ mt: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Service Search / Selection */}
          {!subscription && (
            <Autocomplete
              options={POPULAR_SERVICES}
              getOptionLabel={(option) => option.name}
              onChange={(_, newValue) => {
                if (newValue) {
                  setFormData(prev => ({ 
                    ...prev, 
                    name: newValue.name, 
                    logo_url: newValue.logo 
                  }));
                }
              }}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Search Service" 
                  placeholder="e.g. Netflix, Vercel..."
                  helperText="Search from pre-existing or type your own"
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                  <Avatar src={option.logo} sx={{ width: 24, height: 24, mr: 1.5, borderRadius: '6px' }} />
                  {option.name} ({option.category})
                </Box>
              )}
              freeSolo
              onInputChange={(_, newInputValue) => {
                setFormData(prev => ({ ...prev, name: newInputValue }));
              }}
            />
          )}

          {subscription && (
            <TextField 
              label="Subscription Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              fullWidth
            />
          )}

          {/* Price & Currency */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              sx={{ flex: 1 }}
              InputProps={{
                startAdornment: <InputAdornment position="start">{currency.symbol}</InputAdornment>,
              }}
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

          {/* Frequency */}
          <TextField
            select
            label="Billing Frequency"
            value={formData.frequency}
            onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
            fullWidth
          >
            {FREQUENCY_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>

          {/* Next Billing Date */}
          <TextField
            label="Next Billing Date"
            type="date"
            value={formData.next_billing_date}
            onChange={(e) => setFormData(prev => ({ ...prev, next_billing_date: e.target.value }))}
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start"><Calendar size={18} color="#98a2b3" /></InputAdornment>,
            }}
            InputLabelProps={{ shrink: true }}
          />

          {/* Recurring Toggle */}
          <FormControlLabel
            control={
              <Switch 
                checked={formData.is_recurring} 
                onChange={(e) => setFormData(prev => ({ ...prev, is_recurring: e.target.checked }))} 
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="body2" fontWeight={600}>Recurring Subscription</Typography>
                <Typography variant="caption" color="text.secondary">Automatically track this payment every cycle</Typography>
              </Box>
            }
          />

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
            background: 'linear-gradient(135deg, #f43f6e, #fb7292)',
            borderRadius: '10px', px: 3, fontWeight: 600, textTransform: 'none',
            boxShadow: '0 4px 16px rgba(244,63,110,0.25)',
          }}
        >
          {subscription ? 'Update Subscription' : 'Add Subscription'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubscriptionModal;
