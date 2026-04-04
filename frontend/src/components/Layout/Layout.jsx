import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { styled, keyframes } from '@mui/material/styles';
import BudgetNotifications from '../BudgetNotifications';

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 72;
const MOBILE_WIDTH = 64;

const fadeSlide = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const PageWrapper = styled(Box)({
  animation: `${fadeSlide} 0.35s cubic-bezier(0.4,0,0.2,1)`,
});

const Layout = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const desktopWidth = collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />

      <Sidebar
        drawerWidth={DRAWER_WIDTH}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        mobileOpen={mobileOpen}
        onMobileToggle={() => setMobileOpen((prev) => !prev)}
      />

      <BudgetNotifications />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          width: '100%', // ✅ changed here
          overflowX: 'hidden',
        }}
      >
        <Header
          drawerWidth={DRAWER_WIDTH}
          collapsedWidth={COLLAPSED_WIDTH}
          mobileWidth={MOBILE_WIDTH}
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onMobileToggle={() => setMobileOpen((prev) => !prev)}
        />

        <PageWrapper
          key={location.pathname}
          sx={{
            flex: 1,
            pt: '64px',
            px: { xs: 2, md: 4 },
            pb: { xs: 4, md: 6 },
            maxWidth: '100%',
          }}
        >
          <Outlet />
        </PageWrapper>
      </Box>
    </Box>
  );
};

export default Layout;