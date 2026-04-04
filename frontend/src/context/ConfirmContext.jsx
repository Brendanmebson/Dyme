import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button, Typography, Box
} from '@mui/material';
import { Trash2, AlertTriangle } from 'lucide-react';

const ConfirmContext = createContext();

export const useConfirm = () => useContext(ConfirmContext);

export const ConfirmProvider = ({ children }) => {
  const [state, setState] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  const confirm = useCallback(({ title, message, onConfirm }) => {
    setState({
      open: true,
      title: title || 'Delete Confirmation',
      message: message || 'Are you sure you want to delete this?',
      onConfirm,
    });
  }, []);

  const handleClose = () => {
    setState(prev => ({ ...prev, open: false }));
  };

  const handleConfirm = async () => {
    try {
      if (state.onConfirm) {
        await state.onConfirm();
      }
    } catch (err) {
      console.error('Action failed:', err);
    } finally {
      handleClose();
    }
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <Dialog
        open={state.open}
        onClose={handleClose}
        PaperProps={{
          sx: { borderRadius: '20px', p: 1, maxWidth: '400px' }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: 3 }}>
          <Box sx={{ 
            bgcolor: 'rgba(239, 68, 68, 0.1)', 
            color: '#ef4444', 
            p: 1, 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertTriangle size={24} />
          </Box>
          <Typography variant="h6" fontWeight={800} fontFamily='"Plus Jakarta Sans", sans-serif'>
            {state.title}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <DialogContentText sx={{ color: 'text.secondary', fontWeight: 500 }}>
            {state.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={handleClose} 
            variant="outlined"
            sx={{ 
              borderRadius: '12px', 
              flex: 1, 
              textTransform: 'none', 
              fontWeight: 600,
              borderColor: 'divider',
              color: 'text.secondary'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            variant="contained"
            color="error"
            sx={{ 
              borderRadius: '12px', 
              flex: 1, 
              textTransform: 'none', 
              fontWeight: 600,
              bgcolor: '#ef4444',
              '&:hover': { bgcolor: '#dc2626' },
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmContext.Provider>
  );
};
