// src/components/Layout/Sidebar.jsx
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home, CreditCard, Target, BarChart3, TrendingUp,
  ChevronLeft, Sparkles, User, Settings,
} from 'lucide-react';
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Avatar, Typography, Tooltip, IconButton, Box, Divider,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import logofull from '../../assets/Dyme logo full.png';
import logo from '../../assets/Dyme logo.png';
import { useAuth } from '../../context/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const MOBILE_WIDTH = 64;

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, color: '#f43f6e' },
  { name: 'Transactions', href: '/dashboard/transactions', icon: CreditCard, color: '#7c3aed' },
  { name: 'Budgets', href: '/dashboard/budgets', icon: Target, color: '#10b981' },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3, color: '#f59e0b' },
  { name: 'Reports', href: '/dashboard/reports', icon: TrendingUp, color: '#3b82f6' },
];

const bottomNav = [
  { name: 'Profile', href: '/dashboard/profile', icon: User, color: '#667085' },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings, color: '#667085' },
];


const ActivePill = styled(Box)(({ color }) => ({
  position: 'absolute',
  left: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  width: '3px',
  height: '24px',
  borderRadius: '0 4px 4px 0',
  background: color,
}));

const Sidebar = ({ drawerWidth = 240, collapsed, onCollapse, mobileOpen, onMobileToggle }) => {
  const location = useLocation();
  const { user } = useAuth();
  const desktopWidth = collapsed ? 72 : drawerWidth;

  const fullName = user?.full_name ?? user?.user_metadata?.full_name ?? '';
  const initials = fullName
    ? fullName.split(' ').filter(Boolean).map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';
  const displayName = fullName || 'Guest';
  const displayEmail = user?.email ?? '';

  const NavItems = ({ isCollapsed, onItemClick, items = navigation }) => (
    <List sx={{ px: isCollapsed ? 1 : 1.5, pt: isCollapsed ? 1 : 0.5, pb: 0 }}>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;

        const btn = (
          <ListItemButton
            component={NavLink}
            to={item.href}
            onClick={onItemClick}
            sx={{
              borderRadius: '12px',
              mb: 0.5, px: 1.5, py: 1.25,
              position: 'relative',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              bgcolor: isActive ? `${item.color}12` : 'transparent',
              color: isActive ? item.color : '#667085',
              border: isActive ? `1px solid ${item.color}25` : '1px solid transparent',
              transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
              '&:hover': {
                bgcolor: `${item.color}10`, color: item.color,
                border: `1px solid ${item.color}20`,
                '& .nav-icon': { transform: 'scale(1.1)' },
              },
            }}
          >
            {isActive && <ActivePill color={item.color} />}
            <ListItemIcon sx={{ minWidth: 0, mr: isCollapsed ? 0 : 1.5, color: 'inherit' }}>
              <Icon size={20} className="nav-icon" style={{ transition: 'transform 0.2s ease' }} />
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{ fontWeight: isActive ? 600 : 500, fontSize: '0.9rem' }}
                sx={{ animation: `${slideIn} 0.15s ease` }}
              />
            )}
            {isActive && !isCollapsed && (
              <Box sx={{
                width: 6, height: 6, borderRadius: '50%',
                bgcolor: item.color, ml: 'auto', flexShrink: 0,
                boxShadow: `0 0 6px ${item.color}`,
              }} />
            )}
          </ListItemButton>
        );

        return isCollapsed ? (
          <Tooltip title={item.name} placement="right" key={item.name}
            componentsProps={{ tooltip: { sx: { bgcolor: '#101828', fontSize: '0.8rem', borderRadius: '8px', px: 1.5 } } }}>
            <Box>{btn}</Box>
          </Tooltip>
        ) : (
          <Box key={item.name}>{btn}</Box>
        );
      })}
    </List>
  );

  const mobileStripContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#fff', overflow: 'hidden', alignItems: 'center' }}>
      <Box
        onClick={onMobileToggle}
        sx={{
          width: '100%', display: 'flex', justifyContent: 'center',
          py: 2.5, borderBottom: '1px solid #f1f3f6',
          minHeight: '72px', alignItems: 'center', cursor: 'pointer',
          '&:hover': { bgcolor: '#fff1f3' },
          transition: 'background 0.2s ease',
        }}
      >
        <Box sx={{ width: 36, height: 32, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', p: 0.5 }}>
          <Box component="img" src={logo} alt="Dyme" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </Box>
      </Box>

      <NavItems isCollapsed={true} onItemClick={undefined} items={navigation} />
      <Box sx={{ flex: 1 }} />
      <Divider sx={{ borderColor: '#f1f3f6', width: '100%' }} />
      <NavItems isCollapsed={true} onItemClick={undefined} items={bottomNav} />

      <Divider sx={{ borderColor: '#f1f3f6', width: '100%' }} />
      <Box sx={{ py: 2 }}>
        <Avatar
          src={user?.avatar_url || user?.user_metadata?.avatar_url || undefined}
          sx={{ width: 32, height: 32, fontSize: '0.75rem', fontWeight: 700, background: 'linear-gradient(135deg, #f43f6e, #fb7292)', boxShadow: '0 2px 8px rgba(244,63,110,0.3)' }}>
          {initials}
        </Avatar>
      </Box>
    </Box>
  );

  const mobileDrawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#fff', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 2.5, borderBottom: '1px solid #f1f3f6', minHeight: '72px' }}>
        <Box component="img" src={logofull} alt="Dyme" sx={{ height: 28, width: 'auto' }} />
        <IconButton onClick={onMobileToggle} size="small" sx={{ borderRadius: '8px', p: 0.75, color: '#98a2b3', '&:hover': { bgcolor: '#fff1f3', color: '#f43f6e' } }}>
          <ChevronLeft size={16} />
        </IconButton>
      </Box>

      <NavItems isCollapsed={false} onItemClick={onMobileToggle} items={navigation} />

      <Box sx={{ flex: 1 }} />


      <Divider sx={{ borderColor: '#f1f3f6' }} />
      <Box sx={{ px: 2, py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar
          src={user?.avatar_url || user?.user_metadata?.avatar_url || undefined}
          sx={{ width: 36, height: 36, fontSize: '0.8rem', fontWeight: 700, background: 'linear-gradient(135deg, #f43f6e, #fb7292)', boxShadow: '0 2px 8px rgba(244,63,110,0.3)', flexShrink: 0 }}>
          {initials}
        </Avatar>
        <Box sx={{ animation: `${slideIn} 0.15s ease`, overflow: 'hidden' }}>
          <Typography variant="body2" fontWeight={600} color="#344054" noWrap>{displayName}</Typography>
          <Typography variant="caption" color="#98a2b3" noWrap>{displayEmail}</Typography>
        </Box>
      </Box>
    </Box>
  );

  const desktopContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#fff', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', px: collapsed ? 1 : 2.5, py: 2.5, borderBottom: '1px solid #f1f3f6', minHeight: '72px' }}>
        {!collapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, animation: `${slideIn} 0.2s ease` }}>
            <Box component="img" src={logofull} alt="Dyme" sx={{ height: 28, width: 'auto' }} />
          </Box>
        )}
        {collapsed && (
          <Box sx={{ width: 36, height: 36, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', p: 0.5 }}>
            <Box component="img" src={logo} alt="Dyme" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </Box>
        )}
      </Box>

      <NavItems isCollapsed={collapsed} onItemClick={undefined} items={navigation} />

      <Box sx={{ flex: 1 }} />

      <Divider sx={{ borderColor: '#f1f3f6', mx: collapsed ? 1 : 0, mb: 0.5 }} />
      <NavItems isCollapsed={collapsed} onItemClick={undefined} items={bottomNav} />


      <Divider sx={{ borderColor: '#f1f3f6' }} />
      <Box sx={{ px: collapsed ? 1 : 2, py: 2, display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 1.5, justifyContent: collapsed ? 'center' : 'flex-start' }}>
        <Avatar
          src={user?.avatar_url || user?.user_metadata?.avatar_url || undefined}
          sx={{ width: 36, height: 36, fontSize: '0.8rem', fontWeight: 700, background: 'linear-gradient(135deg, #f43f6e, #fb7292)', boxShadow: '0 2px 8px rgba(244,63,110,0.3)', flexShrink: 0 }}>
          {initials}
        </Avatar>
        {!collapsed && (
          <Box sx={{ animation: `${slideIn} 0.15s ease`, overflow: 'hidden' }}>
            <Typography variant="body2" fontWeight={600} color="#344054" noWrap>{displayName}</Typography>
            <Typography variant="caption" color="#98a2b3" noWrap>{displayEmail}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer variant="permanent" sx={{ display: { xs: 'block', md: 'none' }, width: MOBILE_WIDTH, flexShrink: 0, '& .MuiDrawer-paper': { width: MOBILE_WIDTH, boxSizing: 'border-box', borderRight: '1px solid #e4e7ed', bgcolor: '#fff', overflowX: 'hidden' } }}>
        {mobileStripContent}
      </Drawer>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileToggle}
        ModalProps={{ keepMounted: true }}
        slotProps={{ backdrop: { sx: { backdropFilter: 'blur(4px)', bgcolor: 'rgba(16, 24, 40, 0.4)' } } }}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', borderRight: '1px solid #e4e7ed', bgcolor: '#fff', boxShadow: '20px 0 50px rgba(0,0,0,0.1)' } }}>
        {mobileDrawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        onMouseEnter={() => onCollapse(false)}
        onMouseLeave={() => onCollapse(true)}
        sx={{
          display: { xs: 'none', md: 'block' },
          width: 72,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: desktopWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid #e4e7ed',
            bgcolor: '#fff',
            transition: 'width 0.2s ease',
            overflowX: 'hidden',
            boxShadow: !collapsed ? '4px 0 24px rgba(0,0,0,0.08)' : 'none',
            zIndex: (theme) => theme.zIndex.drawer + 2
          }
        }}>
        {desktopContent}
      </Drawer>
    </>
  );
};

export default Sidebar;