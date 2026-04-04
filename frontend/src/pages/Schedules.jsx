import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useCurrency } from '../context/CurrencyContext';
import { useConfirm } from '../context/ConfirmContext';
import ScheduleModal from '../components/Modals/ScheduleModal';
import { 
  Box, Typography, Button, Card, CardContent, Grid, 
  Avatar, Chip, IconButton, Tooltip, LinearProgress,
  List, ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction
} from '@mui/material';
import { 
  Plus, Calendar, MoreVertical, Trash2, CheckCircle2,
  AlertCircle, TrendingUp, HandCoins, Clock, Timer
} from 'lucide-react';
import { format, parseISO, isAfter, startOfDay } from 'date-fns';

const Schedules = () => {
  const { schedules, deleteSchedule, addTransaction, updateSchedule } = useFinance();
  const { formatAmount } = useCurrency();
  const { confirm } = useConfirm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const handleMarkReceived = async (schedule) => {
    confirm({
      title: 'Confirm Income',
      message: `Did you receive ${formatAmount(schedule.amount, schedule.currency)} from ${schedule.name}?`,
      onConfirm: async () => {
        // 1. Create Transaction
        await addTransaction({
          type: 'income',
          amount: schedule.amount,
          currency: schedule.currency || 'USD',
          category: 'Income',
          description: `Income from ${schedule.name}`,
          destination: 'account',
          date: new Date().toISOString(),
        });

        // 2. Update Schedule last_received_date (and next_expected_date if recurring)
        const updates = { last_received_date: new Date().toISOString() };
        // Simple logic: if monthly, push next date 1 month
        if (schedule.frequency === 'monthly' && schedule.next_expected_date) {
            const next = new Date(schedule.next_expected_date);
            next.setMonth(next.getMonth() + 1);
            updates.next_expected_date = next.toISOString();
        }
        await updateSchedule(schedule.id, updates);
      }
    });
  };

  const handleDelete = (id) => {
    confirm({
      title: 'Delete Schedule',
      message: 'Are you sure you want to delete this income schedule?',
      onConfirm: () => deleteSchedule(id)
    });
  };

  return (
    <Box sx={{ pt: { xs: 3, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="text.primary" 
            fontFamily='"Plus Jakarta Sans", sans-serif' sx={{ mb: 0.5 }}>
            Income Schedules
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track your salary, freelance gigs, and other expected income.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => setIsModalOpen(true)}
          sx={{
            background: 'linear-gradient(135deg, #10b981, #34d399)',
            borderRadius: '12px', px: 3, py: 1.25, fontWeight: 600,
            boxShadow: '0 4px 16px rgba(16,185,129,0.25)',
            '&:hover': { boxShadow: '0 8px 24px rgba(16,185,129,0.35)' },
          }}
        >
          Add Schedule
        </Button>
      </Box>

      <Grid container spacing={3}>
        {schedules.length === 0 ? (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'background.paper', borderRadius: '20px', border: '1px dashed', borderColor: 'divider' }}>
              <TrendingUp size={48} color="#98a2b3" style={{ marginBottom: 16 }} />
              <Typography variant="h6" fontWeight={700} color="text.primary" gutterBottom>
                No income schedules yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Automate your income tracking by setting up recurring or project-based schedules.
              </Typography>
              <Button variant="outlined" onClick={() => setIsModalOpen(true)} sx={{ borderRadius: '10px' }}>
                Set up your first schedule
              </Button>
            </Box>
          </Grid>
        ) : (
          schedules.map((s) => {
            const isUnstructured = s.frequency === 'unstructured';
            const isOverdue = s.next_expected_date && isAfter(startOfDay(new Date()), parseISO(s.next_expected_date));

            return (
              <Grid item xs={12} sm={6} lg={4} key={s.id}>
                <Card sx={{ 
                  borderRadius: '20px', border: '1px solid', borderColor: 'divider',
                  transition: 'all 0.3s ease', position: 'relative', overflow: 'visible',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.08)' }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                        <Box sx={{ 
                          width: 40, height: 40, borderRadius: '12px', 
                          bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          {isUnstructured ? <HandCoins size={20} /> : <Clock size={20} />}
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={800} color="text.primary">
                            {s.name}
                          </Typography>
                          <Chip 
                            label={s.frequency.replace('_', ' ')} 
                            size="small" 
                            sx={{ 
                              height: 20, fontSize: '0.65rem', fontWeight: 700, 
                              bgcolor: 'rgba(0,0,0,0.05)', borderRadius: '6px' 
                            }} 
                          />
                        </Box>
                      </Box>
                      <IconButton size="small" onClick={() => handleDelete(s.id)}>
                        <Trash2 size={16} color="#98a2b3" />
                      </IconButton>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h5" fontWeight={800} color="#10b981" sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                        {formatAmount(s.amount, s.currency)}
                      </Typography>
                      {s.next_expected_date && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <Calendar size={12} color={isOverdue ? '#ef4444' : '#98a2b3'} />
                          <Typography variant="caption" color={isOverdue ? '#ef4444' : 'text.secondary'} fontWeight={600}>
                            Expected: {format(parseISO(s.next_expected_date), 'MMM d, yyyy')} {isOverdue && '(Overdue)'}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {s.last_received_date && (
                      <Box sx={{ mb: 2, p: 1.5, bgcolor: 'action.hover', borderRadius: '12px' }}>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 600 }}>
                          Last Received
                        </Typography>
                        <Typography variant="body2" fontWeight={700}>
                          {format(parseISO(s.last_received_date), 'MMM d, yyyy')}
                        </Typography>
                      </Box>
                    )}

                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<CheckCircle2 size={18} />}
                      onClick={() => handleMarkReceived(s)}
                      sx={{ 
                        borderRadius: '12px', py: 1.25, textTransform: 'none', fontWeight: 700,
                        bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' },
                        boxShadow: '0 4px 12px rgba(16,185,129,0.2)'
                      }}
                    >
                      Mark as Received
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>

      <ScheduleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        schedule={selectedSchedule}
      />
    </Box>
  );
};

export default Schedules;
