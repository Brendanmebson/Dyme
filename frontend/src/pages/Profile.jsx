// src/pages/Profile.jsx
import React, { useState, useRef } from 'react';
import {
  Box, Typography, Avatar, Button, TextField, Divider,
  CircularProgress, Alert, Tooltip, Paper,
} from '@mui/material';
import { Camera, Check, Lock, User, Mail, Eye, EyeOff, Pencil } from 'lucide-react';
import { keyframes } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service.js';
import AvatarEditDialog from '../components/Modals/AvatarEditDialog';

const fadeUp = keyframes`from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}`;

const Section = ({ title, subtitle, children, delay = 0 }) => (
  <Paper elevation={0} sx={{
    border: '1px solid', borderColor: 'divider', borderRadius: '20px', p: { xs: 3, md: 4 },
    animation: `${fadeUp} 0.4s ease both`, animationDelay: `${delay}ms`,
    mb: 3,
  }}>
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" fontWeight={700} color="text.primary"
        fontFamily='"Plus Jakarta Sans", sans-serif' sx={{ mb: 0.5 }}>
        {title}
      </Typography>
      {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
    </Box>
    <Divider sx={{ borderColor: 'divider', mb: 3 }} />
    {children}
  </Paper>
);

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    '& fieldset': { borderColor: 'divider' },
    '&:hover fieldset': { borderColor: '#fda4b5' },
    '&.Mui-focused fieldset': { borderColor: '#f43f6e' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#f43f6e' },
};

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const fileRef = useRef();

  const fullName     = user?.full_name ?? user?.user_metadata?.full_name ?? '';
  const displayEmail = user?.email ?? '';

  const [name, setName]         = useState(fullName);
  const [avatar, setAvatar]     = useState(user?.avatar_url || user?.user_metadata?.avatar_url || null);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [profileError, setProfileError] = useState('');

  const [currentPw, setCurrentPw]   = useState('');
  const [newPw, setNewPw]           = useState('');
  const [confirmPw, setConfirmPw]   = useState('');
  const [showPw, setShowPw]         = useState({ current: false, new: false, confirm: false });
  const [pwSaving, setPwSaving]     = useState(false);
  const [pwSaved, setPwSaved]       = useState(false);
  const [pwError, setPwError]       = useState('');

  // Sync with context if it changes from outside
  React.useEffect(() => {
    if (user) {
      setName(user.full_name ?? user.user_metadata?.full_name ?? '');
      setAvatar(user.avatar_url || null);
    }
  }, [user]);

  const initials = fullName
    ? fullName.split(' ').filter(Boolean).map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const handleAvatarSave = async (dataUrl) => {
    setAvatar(dataUrl);
    try {
      await updateProfile({ avatar_url: dataUrl });
    } catch (err) {
      console.error('Failed to update avatar in context:', err);
      // Revert if failed
      setAvatar(user?.avatar_url || null);
    }
  };

  const handleProfileSave = async () => {
    setSaving(true);
    setProfileError('');
    try {
      const updates = { full_name: name };
      // If you have Supabase Storage wired up, upload avatarFile here and pass avatar_url
      await updateProfile(updates);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setProfileError(err?.response?.data?.error || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async () => {
    setPwError('');
    if (newPw.length < 8) { setPwError('Password must be at least 8 characters'); return; }
    if (newPw !== confirmPw) { setPwError('Passwords do not match'); return; }
    setPwSaving(true);
    try {
      await authService.changePassword(newPw);
      setPwSaved(true);
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      setTimeout(() => setPwSaved(false), 2500);
    } catch (err) {
      setPwError(err?.response?.data?.error || 'Failed to update password');
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <Box sx={{ pt: { xs: 3, md: 4 }, maxWidth: 720 }}>
      {/* Page header */}
      <Box sx={{ mb: 4, animation: `${fadeUp} 0.3s ease` }}>
        <Typography variant="h4" fontWeight={800} color="text.primary"
          fontFamily='"Plus Jakarta Sans", sans-serif'
          sx={{ letterSpacing: '-0.02em', mb: 0.5 }}>
          My Profile
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your personal information and security settings.
        </Typography>
      </Box>

      {/* Avatar + name card */}
      <Section title="Profile Information" subtitle="Update your display name and profile picture." delay={50}>
        {/* Avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4, flexWrap: 'wrap' }}>
          <Box sx={{ position: 'relative', flexShrink: 0 }}>
            <Avatar
              src={avatar || undefined}
              sx={{
                width: 88, height: 88, fontSize: '1.6rem', fontWeight: 800,
                background: 'linear-gradient(135deg, #f43f6e, #fb7292)',
                boxShadow: '0 8px 24px rgba(244,63,110,0.3)',
                border: '3px solid #fff',
              }}
            >
              {!avatar && initials}
            </Avatar>
            <Tooltip title="Change photo">
              <Button
                onClick={() => setAvatarDialogOpen(true)}
                size="small"
                sx={{
                  position: 'absolute', bottom: -4, right: -4,
                  bgcolor: '#f43f6e', color: '#fff', minWidth: 30, height: 30, p: 0,
                  border: '2px solid #fff', borderRadius: '50%',
                  '&:hover': { bgcolor: '#e11d56' },
                  boxShadow: '0 2px 8px rgba(244,63,110,0.4)',
                }}
              >
                <Camera size={13} />
              </Button>
            </Tooltip>
          </Box>
          <Box>
            <Typography variant="body1" fontWeight={600} color="text.primary">{fullName || 'Your Name'}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>{displayEmail}</Typography>
            <Button
              variant="outlined" size="small" startIcon={<Pencil size={13} />}
              onClick={() => setAvatarDialogOpen(true)}
              sx={{
                borderRadius: '8px', borderColor: 'divider', color: 'text.secondary',
                fontSize: '0.78rem', fontWeight: 600, textTransform: 'none',
                '&:hover': { borderColor: '#f43f6e', color: '#f43f6e', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(244,63,110,0.15)' : '#fff1f3' },
              }}
            >
              Upload Photo
            </Button>
          </Box>
        </Box>

        {/* Fields */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Full Name" fullWidth value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{ startAdornment: <User size={16} color="#98a2b3" style={{ marginRight: 8 }} /> }}
            sx={inputSx}
          />
          <TextField
            label="Email Address" fullWidth value={displayEmail} disabled
            InputProps={{ startAdornment: <Mail size={16} color="#98a2b3" style={{ marginRight: 8 }} /> }}
            helperText="Email cannot be changed here."
            sx={inputSx}
          />
        </Box>

        {profileError && <Alert severity="error" sx={{ mt: 2, borderRadius: '10px' }}>{profileError}</Alert>}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant="contained" onClick={handleProfileSave}
            disabled={saving}
            startIcon={saved ? <Check size={16} /> : saving ? <CircularProgress size={14} color="inherit" /> : null}
            sx={{
              background: saved
                ? 'linear-gradient(135deg, #10b981, #34d399)'
                : 'linear-gradient(135deg, #f43f6e, #fb7292)',
              borderRadius: '12px', px: 3, py: 1.25, fontWeight: 600, textTransform: 'none',
              boxShadow: saved ? '0 4px 16px rgba(16,185,129,0.25)' : '0 4px 16px rgba(244,63,110,0.25)',
              transition: 'all 0.3s ease',
              '&:hover': { transform: 'translateY(-1px)' },
            }}
          >
            {saved ? 'Saved!' : 'Save Changes'}
          </Button>
        </Box>
      </Section>

      {/* Password change */}
      <Section title="Change Password" subtitle="Keep your account secure with a strong password." delay={150}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {[
            { label: 'Current Password', key: 'current', value: currentPw, setter: setCurrentPw },
            { label: 'New Password',     key: 'new',     value: newPw,     setter: setNewPw     },
            { label: 'Confirm Password', key: 'confirm', value: confirmPw, setter: setConfirmPw },
          ].map(({ label, key, value, setter }) => (
            <TextField
              key={key} label={label} fullWidth
              type={showPw[key] ? 'text' : 'password'}
              value={value} onChange={(e) => setter(e.target.value)}
              InputProps={{
                startAdornment: <Lock size={16} color="#98a2b3" style={{ marginRight: 8 }} />,
                endAdornment: (
                  <Button size="small" sx={{ minWidth: 0, p: 0.5 }} onClick={() => setShowPw((p) => ({ ...p, [key]: !p[key] }))}>
                    {showPw[key] ? <EyeOff size={16} color="#98a2b3" /> : <Eye size={16} color="#98a2b3" />}
                  </Button>
                ),
              }}
              sx={inputSx}
            />
          ))}
        </Box>

        {pwError && <Alert severity="error" sx={{ mt: 2, borderRadius: '10px' }}>{pwError}</Alert>}
        {pwSaved && <Alert severity="success" sx={{ mt: 2, borderRadius: '10px' }}>Password updated successfully!</Alert>}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant="contained" onClick={handlePasswordSave}
            disabled={pwSaving || !newPw || !confirmPw}
            startIcon={pwSaved ? <Check size={16} /> : pwSaving ? <CircularProgress size={14} color="inherit" /> : <Lock size={16} />}
            sx={{
              background: pwSaved
                ? 'linear-gradient(135deg, #10b981, #34d399)'
                : 'linear-gradient(135deg, #f43f6e, #fb7292)',
              borderRadius: '12px', px: 3, py: 1.25, fontWeight: 600, textTransform: 'none',
              boxShadow: '0 4px 16px rgba(244,63,110,0.25)',
              '&:hover': { transform: 'translateY(-1px)' },
              '&:disabled': { opacity: 0.5 },
            }}
          >
            {pwSaved ? 'Password Updated!' : 'Update Password'}
          </Button>
        </Box>
      </Section>

      {/* Avatar Edit Dialog */}
      <AvatarEditDialog
        open={avatarDialogOpen}
        onClose={() => setAvatarDialogOpen(false)}
        onSave={handleAvatarSave}
        currentAvatar={avatar}
      />
    </Box>
  );
};

export default Profile;
