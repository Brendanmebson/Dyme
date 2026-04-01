// src/components/Layout/Header.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { Settings, LogOut, User, ChevronDown, Menu as MenuIcon } from 'lucide-react';
import { keyframes } from '@mui/material/styles';
import { useAuth } from '../../context/AuthContext';
import CurrencyPicker from '../CurrencyPicker';

const pulse = keyframes`0%,100%{transform:scale(1)}50%{transform:scale(1.08)}`;

// Get initials from a name
const getInitials = (name = '') =>
  name.split(' ').filter(Boolean).map((w) => w[0]).join('').toUpperCase().slice(0, 2) || '?';

const Header = ({
  drawerWidth = 240, collapsedWidth = 72,
  mobileWidth = 64, collapsed = false, mobileOpen = false,
  onMobileToggle,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate  = useNavigate();
  const { user, logout, localAvatar } = useAuth();

  // Sidebar always occupies collapsedWidth in layout; it overlaps on hover
  const currentDrawerWidth = collapsedWidth;

  const handleLogout = async () => {
    setAnchorEl(null);
    await logout();
    navigate('/login');
  };

  const fullName    = user?.full_name ?? user?.user_metadata?.full_name ?? '';
  const displayName = fullName || user?.email || 'Account';
  const initials    = getInitials(fullName || user?.email || '');

  return (
    <AppBar
      position="fixed" elevation={0}
      sx={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(228,231,237,0.9)',
        height: '73px', color: 'text.primary',
        zIndex: (theme) => theme.zIndex.drawer - 1,
        width: {
          xs: `calc(100% - ${mobileWidth}px)`,
          md: `calc(100% - ${currentDrawerWidth}px)`,
        },
        ml: {
          xs: `${mobileWidth}px`,
          md: `${currentDrawerWidth}px`,
        },
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1), margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 }, minHeight: '64px !important', gap: 2 }}>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onMobileToggle}
            sx={{
              display: { xs: 'flex', md: 'none' },
              bgcolor: 'background.paper',
              border: '1px solid', borderColor: 'divider',
              borderRadius: '10px',
              p: 1,
              '&:hover': { bgcolor: 'background.default' }
            }}
          >
            <MenuIcon size={20} color="#101828" />
          </IconButton>
          
          <Typography variant="caption" sx={{
            color: 'text.secondary', fontWeight: 500,
            display: { xs: 'none', sm: 'block' },
          }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Currency picker */}
          <CurrencyPicker />

          {/* Profile */}
          <Box
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer',
              borderRadius: '12px', px: 1.5, py: 0.75,
              '&:hover': { bgcolor: '#fff1f3' },
              transition: 'all 0.2s ease',
            }}
          >
            <Avatar
              src={localAvatar || user?.avatar_url || user?.user_metadata?.avatar_url || undefined}
              sx={{
                width: 36, height: 36, fontSize: '0.8rem', fontWeight: 700,
                background: 'linear-gradient(135deg, #f43f6e, #fb7292)',
                boxShadow: '0 2px 8px rgba(244,63,110,0.35)',
              }}
            >
              {initials}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" fontWeight={600} color="#344054" lineHeight={1.2}>{displayName}</Typography>
              <Typography variant="caption" color="#98a2b3">{user?.email}</Typography>
            </Box>
            <ChevronDown size={16} color="#98a2b3" />
          </Box>

          <Menu
            anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
            PaperProps={{
              sx: {
                mt: 1.5, borderRadius: '16px', minWidth: 210,
                boxShadow: '0 16px 48px rgba(16,24,40,0.15)',
                border: '1px solid', borderColor: 'divider',
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="body2" fontWeight={600} color="#344054" noWrap>{displayName}</Typography>
              <Typography variant="caption" color="#98a2b3" noWrap>{user?.email}</Typography>
            </Box>
            <Divider sx={{ mx: 1, borderColor: 'divider' }} />
            <MenuItem
              onClick={() => { setAnchorEl(null); navigate('/dashboard/profile'); }}
              sx={{ gap: 1.5, borderRadius: '8px', mx: 1, my: 0.5 }}
            >
              <User size={16} color="#667085" />
              <Typography variant="body2" fontWeight={500}>Profile</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => { setAnchorEl(null); navigate('/dashboard/settings'); }}
              sx={{ gap: 1.5, borderRadius: '8px', mx: 1, mb: 0.5 }}
            >
              <Settings size={16} color="#667085" />
              <Typography variant="body2" fontWeight={500}>Settings</Typography>
            </MenuItem>
            <Divider sx={{ mx: 1, my: 0.5, borderColor: 'divider' }} />
            <MenuItem
              onClick={handleLogout}
              sx={{ gap: 1.5, borderRadius: '8px', mx: 1, mb: 1, color: '#f43f6e', '&:hover': { bgcolor: '#fff1f3' } }}
            >
              <LogOut size={16} />
              <Typography variant="body2" fontWeight={500} color="inherit">Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
