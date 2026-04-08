import React from 'react';
import { Box, Typography, Container, Button, useTheme } from '@mui/material';
import LandingNavbar from '../components/Landing/LandingNavbar';
import LandingFooter from '../components/Landing/LandingFooter';
import PremiumFeatureBlock from '../components/Landing/PremiumFeatureBlock';
import {
  LayoutGrid, ArrowRightLeft, HandCoins, Clock, Target, ArrowRight, Calendar, TrendingUp, FileText
} from 'lucide-react';
// ─── Mockup Screenshots ───────────────────────────────────
import mockupDashboard from '../assets/mockups/iPhone-13-PRO-dymedashboard.vercel.app (1).png';
import mockupBudgets from '../assets/mockups/iPhone-13-PRO-dymedashboard.vercel.app (4).png';
import mockupTransactions from '../assets/mockups/iPhone-13-PRO-dymedashboard.vercel.app (5).png';
import mockupLoans from '../assets/mockups/iPhone-13-PRO-dymedashboard.vercel.app (6).png';
import mockupSubscriptions from '../assets/mockups/iPhone-13-PRO-dymedashboard.vercel.app (8).png';
import mockupAnalytics from '../assets/mockups/iPhone-13-PRO-dymedashboard.vercel.app (10).png';

const Features = () => {
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      <LandingNavbar />

      {/* Hero */}
      <Box sx={{ pt: { xs: '100px', md: '120px' }, pb: { xs: 6, md: 8 }, textAlign: 'center', position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', height: '100%', background: (theme) => `radial-gradient(circle at 50% 20%, rgba(244,63,110,0.06) 0%, transparent 60%)`, zIndex: 0 }} />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, px: { xs: 3, sm: 4, md: 6 } }}>
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '0.15em', mb: 1, display: 'block', fontSize: '0.7rem' }}>CAPABILITIES</Typography>
          <Typography sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: { xs: '2.2rem', md: '3.5rem' }, mb: 2, lineHeight: 1.1 }}>The complete toolkit <br /> for your wealth.</Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.95rem', md: '1.15rem' }, maxWidth: 640, mx: 'auto', mb: 3, lineHeight: 1.6 }}>Dyme combines sophisticated technology with human-centric design for total financial control.</Typography>
        </Container>
      </Box>

      {/* Feature Sections */}
      <Box component="main" sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: { xs: 8, md: 4 }, px: { xs: 3, md: 6 }, pb: 12, maxWidth: '1400px', mx: 'auto', width: '100%' }}>        <PremiumFeatureBlock
        layout="vertical"
        icon={LayoutGrid}
        featureName="Dashboard"
        title="Your money, at a glance."
        description="Get a real-time overview of your net worth, monthly income, spending, and financial health — all in one view."
      />
        <PremiumFeatureBlock
          layout="vertical"
          icon={Target}
          featureName="Budgets"
          title="Spend smarter, live better."
          description="Set monthly limits per category and receive proactive nudges before you overspend. Goal-setting made simple."
        />
        <PremiumFeatureBlock
          layout="vertical"
          icon={ArrowRightLeft}
          featureName="Transactions"
          title="Every penny, accounted for."
          description="Clean, searchable, and beautifully organized. Track every expense and income with precision and ease."
        />
        <PremiumFeatureBlock
          layout="vertical"
          icon={HandCoins}
          featureName="Loans & Debts"
          title="Simplify your debts."
          description="Keep a transparent record of money lent to friends or borrowed from others. Integrated repayment tracking."
        />
        <PremiumFeatureBlock
          layout="vertical"
          icon={Calendar}
          featureName="Schedules"
          title="Automate your income."
          description="Set up recurring or project-based income schedules to never miss an expected payment."
        />
        <PremiumFeatureBlock
          layout="vertical"
          icon={Clock}
          featureName="Subscriptions"
          title="No more surprise bills."
          description="A bird's-eye view of all your recurring costs. Get alerts before renewals and track your monthly burn rate."
        />
        <PremiumFeatureBlock
          layout="vertical"
          icon={TrendingUp}
          featureName="Analytics"
          title="Deep financial insights."
          description="Visualize your spending habits with interactive charts and detailed breakdowns of your net worth."
        />
        <PremiumFeatureBlock
          layout="vertical"
          icon={FileText}
          featureName="Reports"
          title="Exportable Summaries."
          description="Generate professional PDF or CSV reports for your personal review or tax filing needs."
        />
      </Box>

      {/* Final CTA */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#0a0a0f', color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, px: { xs: 3, md: 6 } }}>
          <Typography variant="h2" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, mb: 3, fontSize: { xs: '2rem', md: '3rem' } }}>Achieve financial <br /> freedom today.</Typography>
          <Button variant="contained" endIcon={<ArrowRight size={20} />} sx={{ px: { xs: 4, md: 5 }, py: 2, borderRadius: '16px', fontWeight: 800, fontSize: { xs: '1rem', md: '1.1rem' }, bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}>
            Start for Free
          </Button>
          <Typography sx={{ mt: 2, color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 600 }}>No credit card required</Typography>
        </Container>
      </Box>

      <LandingFooter />
    </Box>
  );
};

export default Features;
