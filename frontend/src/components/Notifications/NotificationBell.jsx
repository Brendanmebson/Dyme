// src/components/Notifications/NotificationBell.jsx
import React, { useState } from 'react';
import { Badge, IconButton, Tooltip, Popover } from '@mui/material';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import NotificationPanel from './NotificationPanel';

const NotificationBell = () => {
  const { unreadCount } = useNotifications();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          color="inherit"
          onClick={handleClick}
          sx={{ 
            color: 'text.secondary',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
          }}
        >
          <Badge badgeContent={unreadCount} color="error" overlap="circular">
            <Bell size={22} />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: { xs: '90vw', sm: 400 },
            maxWidth: '100%',
            borderRadius: '20px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden'
          }
        }}
      >
        <NotificationPanel onClose={handleClose} />
      </Popover>
    </>
  );
};

export default NotificationBell;
