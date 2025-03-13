import { Box, Typography } from '@mui/material';
import { Copyright } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

// Constants for layout measurements
const SIDEBAR_WIDTH = 240;
const FOOTER_HEIGHT = 40; // Reduced height

const FooterContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 2), // Reduced vertical padding
  position: 'fixed',
  bottom: 0,
  right: 0,
  height: FOOTER_HEIGHT,
  width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
  zIndex: theme.zIndex.drawer - 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderTop: `1px solid ${theme.palette.divider}`,
  backdropFilter: 'blur(8px)',
  backgroundColor: theme.palette.background.default, // Change to match your theme
  boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    boxShadow: '0px -4px 15px rgba(0, 0, 0, 0.15)',
  },
}));

const AnimatedTypography = styled(motion(Typography))({
  display: 'flex',
  alignItems: 'center',
  gap: '4px', // Reduced gap
  fontWeight: 500,
  cursor: 'default',
  fontSize: '0.8rem', // Slightly smaller font size
});

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <AnimatedTypography
        variant="body2"
        color="text.secondary"
        component={motion.div}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Copyright sx={{ fontSize: '1rem' }} /> {/* Adjusted icon size */}
        </motion.div>
        {currentYear} All rights reserved
      </AnimatedTypography>
    </FooterContainer>
  );
};

export default Footer; 