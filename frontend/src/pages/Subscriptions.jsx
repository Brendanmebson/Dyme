import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useCurrency } from '../context/CurrencyContext';
import { useConfirm } from '../context/ConfirmContext';
import SubscriptionModal from '../components/Modals/SubscriptionModal';
import {
  Box, Typography, Button, Card, CardContent, Grid,
  Avatar, Chip, Tooltip, LinearProgress
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import {
  Plus, Clock, MoreVertical, Trash2, StopCircle,
  AlertTriangle, CheckCircle, ExternalLink
} from 'lucide-react';
import { format, differenceInDays, parseISO } from 'date-fns';

const Subscriptions = () => {
  const { subscriptions, deleteSubscription, updateSubscription } = useFinance();
  const { formatAmount } = useCurrency();
  const { confirm } = useConfirm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);

  const getStatus = (nextDate) => {
    const daysLeft = differenceInDays(parseISO(nextDate), new Date());
    if (daysLeft < 0) return { label: 'Overdue', color: '#ef4444', bg: '#fee2e2', icon: AlertTriangle };
    if (daysLeft <= 3) return { label: 'Due Soon', color: '#ef4444', bg: '#fee2e2', icon: AlertTriangle };
    if (daysLeft <= 7) return { label: 'Approaching', color: '#f59e0b', bg: '#fef3c7', icon: AlertTriangle };
    return { label: 'Active', color: '#10b981', bg: '#d1fae5', icon: CheckCircle };
  };

  const handleEndSubscription = (sub) => {
    confirm({
      title: 'End Subscription',
      message: `Are you sure you want to end your ${sub.name} subscription? It will no longer be marked as recurring.`,
      onConfirm: () => updateSubscription(sub.id, { is_recurring: false })
    });
  };

  const handleDeleteSubscription = (sub) => {
    confirm({
      title: 'Delete Subscription',
      message: `Are you sure you want to delete ${sub.name}? This will remove it from your tracking entirely.`,
      onConfirm: () => deleteSubscription(sub.id)
    });
  };

  const openEditModal = (sub) => {
    setSelectedSub(sub);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedSub(null);
    setIsModalOpen(false);
  };

  return (
    <Box sx={{ pt: { xs: 3, md: 4 } }}>
      {/* Header */}
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
            Subscriptions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your recurring payments and upcoming renewals.
          </Typography>
        </Box>
        <Button
          variant="contained"
          fullWidth={{ xs: true, sm: false }}
          startIcon={<Plus size={18} />}
          onClick={() => setIsModalOpen(true)}
          sx={{
            background: 'linear-gradient(135deg, #f43f6e, #fb7292)',
            borderRadius: '12px', px: 3, py: 1.25, fontWeight: 600,
            boxShadow: '0 4px 16px rgba(244,63,110,0.25)',
            '&:hover': { boxShadow: '0 8px 24px rgba(244,63,110,0.35)' },
          }}
        >
          Add Subscription
        </Button>
      </Box>

      {/* Grid */}
      <Grid container spacing={3}>
        {subscriptions.length === 0 ? (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'background.paper', borderRadius: '20px', border: '1px dashed', borderColor: 'divider' }}>
              <Clock size={48} color="#98a2b3" style={{ marginBottom: 16 }} />
              <Typography variant="h6" fontWeight={700} color="text.primary" gutterBottom>
                No active subscriptions
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Keep track of your Vercel, Netflix, and other recurring costs in one place.
              </Typography>
              <Button variant="outlined" onClick={() => setIsModalOpen(true)} sx={{ borderRadius: '10px' }}>
                Add your first one
              </Button>
            </Box>
          </Grid>
        ) : (
          subscriptions.map((sub) => {
            const status = getStatus(sub.next_billing_date);
            const daysLeft = differenceInDays(parseISO(sub.next_billing_date), new Date());

            return (
              <Grid item xs={12} sm={6} lg={4} key={sub.id}>
                <Card sx={{
                  borderRadius: '20px', border: '1px solid', borderColor: 'divider',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.08)' }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, gap: 1 }}>
                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', overflow: 'hidden' }}>
                        <Avatar
                          src={sub.logo_url}
                          sx={{
                            width: { xs: 40, md: 48 }, height: { xs: 40, md: 48 }, borderRadius: '12px',
                            bgcolor: (theme) => theme.palette.mode === 'dark' ? '#2d2d2d' : '#f8f9fa',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            color: 'text.primary', fontWeight: 800, flexShrink: 0
                          }}
                        >
                          {sub.name[0].toUpperCase()}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="subtitle1" fontWeight={800} color="text.primary" noWrap>
                            {sub.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                            {sub.frequency.replace('_', ' ')}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={status.label}
                        size="small"
                        icon={<status.icon size={12} color={status.color} />}
                        sx={{
                          bgcolor: status.bg, color: status.color,
                          fontWeight: 700, borderRadius: '8px', border: 'none',
                          flexShrink: 0,
                          '& .MuiChip-icon': { color: 'inherit' },
                          '& .MuiChip-label': { px: 1 }
                        }}
                      />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Renewal Price
                      </Typography>
                      <Typography variant="h5" fontWeight={800} color="text.primary" sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                        {formatAmount(sub.price, sub.currency)}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                          Next Billing: {format(parseISO(sub.next_billing_date), 'MMM d, yyyy')}
                        </Typography>
                        <Typography variant="caption" color={daysLeft <= 7 ? '#ef4444' : 'text.secondary'} fontWeight={700}>
                          {daysLeft < 0 ? 'Overdue' : daysLeft === 0 ? 'Today' : `${daysLeft} days left`}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={Math.max(0, Math.min(100, (30 - daysLeft) / 30 * 100))}
                        sx={{
                          height: 6, borderRadius: '3px', bgcolor: 'divider',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: status.color,
                            borderRadius: '3px'
                          }
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="End Subscription">
                        <IconButton
                          size="small"
                          onClick={() => handleEndSubscription(sub)}
                          disabled={!sub.is_recurring}
                          sx={{
                            borderRadius: '10px', border: '1px solid', borderColor: 'divider',
                            color: 'text.secondary', '&:hover': { color: '#f59e0b', bgcolor: '#fffbeb' }
                          }}
                        >
                          <StopCircle size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteSubscription(sub)}
                          sx={{
                            borderRadius: '10px', border: '1px solid', borderColor: 'divider',
                            color: '#ef4444', '&:hover': { bgcolor: '#fee2e2' }
                          }}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </Tooltip>
                      <Box sx={{ flex: 1 }} />
                      <Button
                        size="small"
                        variant="text"
                        endIcon={<ExternalLink size={14} />}
                        onClick={() => openEditModal(sub)}
                        sx={{
                          textTransform: 'none', fontWeight: 700, color: '#f43f6e',
                          '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                        }}
                      >
                        Manage
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>

      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        subscription={selectedSub}
      />
    </Box>
  );
};

export default Subscriptions;
