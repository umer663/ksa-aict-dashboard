import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

// Constants for layout measurements
const SIDEBAR_WIDTH = 280; // Match the drawer width from Navbar
const FOOTER_HEIGHT = 30; // Reduced height further

const currentYear = new Date().getFullYear();

const FooterContainer = styled('footer')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1, 0), // Reduced padding
  position: 'fixed',
  bottom: 0,
  right: 0,
  width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
  height: FOOTER_HEIGHT,
  boxShadow: '0px -1px 2px rgba(0, 0, 0, 0.05)',
  zIndex: theme.zIndex.appBar - 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const MotionTypography = styled(motion(Typography))({});

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          fontSize: '0.75rem',
        }}
      >
        © {currentYear} AICT Dashboard. All rights reserved.
      </Typography>
    </FooterContainer>
  );
};

export default Footer; 