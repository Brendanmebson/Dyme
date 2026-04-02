import React from 'react';
import { Box, Typography, Container, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ChevronDown as ChevronDownIcon } from 'lucide-material'; // Wait, I used lucide-react before
import { ChevronDown as ChevronDownIconLucide } from 'lucide-react';
import LandingNavbar from '../components/Landing/LandingNavbar';
import LandingFooter from '../components/Landing/LandingFooter';

const FAQS = [
  {
    q: "Is Dyme really free?",
    a: "Yes! Our core features, including manual transaction tracking and CSV imports, are completely free forever. We offer a Pro plan for users who want advanced automation and deeper insights."
  },
  {
    q: "How do I add my transactions?",
    a: "Currently, you can easily import your bank statements via CSV or enter transactions manually. We are working hard to bring secure, automated bank synchronization in the near future!"
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. Dyme handles your data with bank-grade 256-bit AES encryption. Since we currently use CSV and manual entry, your bank credentials never even enter our system."
  },
  {
    q: "Can I use Dyme on multiple devices?",
    a: "Yes. Simply log in with your account on any device (phone, tablet, or web) to access your synced data in real-time."
  },
  {
    q: "How do I cancel my Pro subscription?",
    a: "You can cancel anytime from your settings page. You'll retain Pro access until the end of your current billing cycle."
  }
];

const FAQs = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <LandingNavbar />

      <Box component="main" sx={{ pt: { xs: '100px', md: '120px' }, pb: { xs: 8, md: 10 }, flex: 1 }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, mb: 1, display: 'block' }}>
              COMMON QUESTIONS
            </Typography>
            <Typography variant="h2" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, mb: 2, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
              FAQs
            </Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            {FAQS.map((faq, i) => (
              <Accordion
                key={i}
                sx={{
                  mb: 1.5,
                  borderRadius: '16px !important',
                  '&:before': { display: 'none' },
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper'
                }}
              >
                <AccordionSummary
                  expandIcon={<ChevronDownIconLucide size={18} />}
                  sx={{ px: 3, py: 0.5 }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>{faq.q}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pb: 2.5 }}>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6, fontSize: '0.95rem' }}>
                    {faq.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Container>
      </Box>

      <LandingFooter />
    </Box>
  );
};

export default FAQs;
