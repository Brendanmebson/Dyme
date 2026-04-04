// src/components/Notifications/NotificationPanel.jsx
import React from 'react';
import { 
  Box, Typography, Button, List, ListItem, 
  ListItemText, ListItemAvatar, Avatar, Divider, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { X, Check, Trash2, Bell, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { formatDistanceToNow, parseISO } from 'date-fns';

const NotificationItem = ({ notification, onMarkDone, onDelete }) => {
  const isUnread = notification.status === 'unread';
  const isDone = notification.status === 'done';

  const getIcon = () => {
    switch (notification.type) {
      case 'subscription': return <Calendar size={18} color="#f43f6e" />;
      case 'income_prompt': return <DollarSign size={18} color="#10b981" />;
      default: return <Bell size={18} color="#6366f1" />;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case 'subscription': return 'rgba(244,63,110,0.1)';
      case 'income_prompt': return 'rgba(16,185,129,0.1)';
      default: return 'rgba(99,102,241,0.1)';
    }
  };

  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        px: 2.5,
        py: 2,
        bgcolor: isUnread ? 'action.hover' : 'transparent',
        transition: 'background-color 0.2s',
        '&:hover': { bgcolor: 'action.selected' },
        opacity: isDone ? 0.6 : 1,
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: getBgColor(), width: 40, height: 40 }}>
          {getIcon()}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="subtitle2" fontWeight={isUnread ? 800 : 600} color="text.primary">
              {notification.title}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              {formatDistanceToNow(parseISO(notification.created_at), { addSuffix: true })}
            </Typography>
          </Box>
        }
        secondary={
          <Box sx={{ mt: 0.5 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              {notification.message}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {!isDone && (
                <Button 
                  size="small" 
                  variant="contained" 
                  startIcon={<Check size={14} />}
                  onClick={() => onMarkDone(notification.id)}
                  sx={{ 
                    borderRadius: '8px', 
                    textTransform: 'none', 
                    fontSize: '0.75rem',
                    bgcolor: 'success.main',
                    '&:hover': { bgcolor: 'success.dark' }
                  }}
                >
                  Mark as Done
                </Button>
              )}
              <Button 
                size="small" 
                onClick={() => onDelete(notification.id)}
                sx={{ minWidth: 0, p: 0.5, color: 'text.disabled', '&:hover': { color: 'error.main' } }}
              >
                <Trash2 size={16} />
              </Button>
            </Box>
          </Box>
        }
      />
    </ListItem>
  );
};

const NotificationPanel = ({ onClose }) => {
  const { notifications, loading, markAsDone, deleteNotification } = useNotifications();
  const [deleteId, setDeleteId] = React.useState(null);

  const activeNotifications = notifications.filter(n => n.status !== 'done');
  const doneNotifications = notifications.filter(n => n.status === 'done');

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteNotification(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', maxHeight: 500 }}>
      {/* Header */}
      <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight={800}>Notifications</Typography>
        <Button size="small" onClick={onClose} sx={{ minWidth: 0, p: 0.5 }}><X size={20} /></Button>
      </Box>

      {/* List */}
      <Box sx={{ overflowY: 'auto', flex: 1 }}>
        {loading && notifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress size={24} sx={{ color: '#f43f6e' }} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
              <Bell size={24} color="text.disabled" />
            </Box>
            <Typography variant="body2" color="text.secondary">All caught up! No notifications.</Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {activeNotifications.map((n, idx) => (
              <React.Fragment key={n.id}>
                <NotificationItem 
                  notification={n} 
                  onMarkDone={markAsDone}
                  onDelete={(id) => setDeleteId(id)}
                />
                {idx < activeNotifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
            
            {doneNotifications.length > 0 && (
              <>
                <Box sx={{ bgcolor: 'action.hover', px: 2.5, py: 1 }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase' }}>Completed</Typography>
                </Box>
                {doneNotifications.map((n, idx) => (
                  <React.Fragment key={n.id}>
                    <NotificationItem 
                      notification={n} 
                      onMarkDone={markAsDone}
                      onDelete={(id) => setDeleteId(id)}
                    />
                    {idx < doneNotifications.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </>
            )}
          </List>
        )}
      </Box>

      {/* Footer */}
      <Box sx={{ p: 1.5, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
        <Button size="small" onClick={onClose} sx={{ textTransform: 'none', color: 'text.secondary' }}>Close Panel</Button>
      </Box>

      {/* Delete Confirmation */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle sx={{ fontWeight: 800 }}>Delete Notification?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary"> Are you sure you want to delete this notification? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error" sx={{ borderRadius: '8px' }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotificationPanel;
