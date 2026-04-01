import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, Box, Typography } from '@mui/material';
import { useFinance } from '../context/FinanceContext';
import { AlertCircle, CalendarOff } from 'lucide-react';

const BudgetNotifications = () => {
  const { budgets } = useFinance();
  const [notifications, setNotifications] = useState([]);
  const [dismissedIds, setDismissedIds] = useState(new Set());

  useEffect(() => {
    const newNotifications = [];
    const now = new Date();

    budgets.forEach(budget => {
      // 1. Check for supassed limit
      if (budget.spent > budget.limit && !dismissedIds.has(`${budget.id}-limit`)) {
        newNotifications.push({
          id: `${budget.id}-limit`,
          type: 'error',
          title: 'Budget Exceeded',
          message: `Category: ${budget.category}. You have exceeded your limit!`,
          icon: <AlertCircle size={18} />
        });
      }

      // 2. Check for expiry
      if (budget.end_date && new Date(budget.end_date) < now && !dismissedIds.has(`${budget.id}-expiry`)) {
        newNotifications.push({
          id: `${budget.id}-expiry`,
          type: 'warning',
          title: 'Budget Expired',
          message: `The duration for your ${budget.category} budget has ended.`,
          icon: <CalendarOff size={18} />
        });
      }
    });

    if (newNotifications.length > 0) {
      setNotifications(prev => [...prev, ...newNotifications]);
    }
  }, [budgets, dismissedIds]);

  const handleClose = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setDismissedIds(prev => new Set(prev).add(id));
  };

  if (notifications.length === 0) return null;

  // Show the most recent notification
  const current = notifications[0];

  return (
    <Snackbar
      open={true}
      autoHideDuration={6000}
      onClose={() => handleClose(current.id)}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ mt: 8 }}
    >
      <Alert
        onClose={() => handleClose(current.id)}
        severity={current.type}
        icon={current.icon}
        variant="filled"
        sx={{
          borderRadius: '12px',
          width: '100%',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          bgcolor: current.type === 'error' ? '#ef4444' : '#f59e0b',
          '& .MuiAlert-message': { width: '100%' }
        }}
      >
        <Box>
          <Typography variant="subtitle2" fontWeight={700}>{current.title}</Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>{current.message}</Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default BudgetNotifications;
