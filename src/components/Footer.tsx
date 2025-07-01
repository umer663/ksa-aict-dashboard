import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

// Constants for layout measurements
const SIDEBAR_WIDTH = 240; // Match the drawer width from Sidebar
const FOOTER_HEIGHT = 30; // Reduced height further

const currentYear = new Date().getFullYear();

const FooterContainer = styled('footer')({
  backgroundColor: '#1976d2',
  padding: '8px 0',
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  width: '100%',
  height: FOOTER_HEIGHT,
  boxShadow: 'none',
  zIndex: 1100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [`@media (min-width: 900px)`]: {
    left: SIDEBAR_WIDTH,
    width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1976d2',
    zIndex: -1
  }
});

const MotionTypography = styled(motion(Typography))({});

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <Typography
        variant="body2"
        sx={{
          fontSize: '0.75rem',
          color: '#fff',
          fontWeight: 400
        }}
      >
        © {currentYear} Made with ❤️ by Team AICT. All rights reserved.
      </Typography>
    </FooterContainer>
  );
};

export default Footer; 