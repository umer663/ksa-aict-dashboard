import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

// Constants for layout measurements
const SIDEBAR_WIDTH = 240;
const FOOTER_HEIGHT = 40; // Reduced height

const currentYear = new Date().getFullYear();

const FooterContainer = styled('footer')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(3, 0),
  position: 'fixed',
  bottom: 0,
  width: '100%',
  boxShadow: '0px -2px 4px rgba(0, 0, 0, 0.05)',
  zIndex: theme.zIndex.appBar - 1,
}));

const MotionTypography = styled(motion(Typography))({});

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <MotionTypography
            variant="body2"
            color="text.secondary"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            © {currentYear} AICT Dashboard. All rights reserved.
          </MotionTypography>
          <MotionTypography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            Version 1.0.0
          </MotionTypography>
        </Box>
      </Container>
    </FooterContainer>
  );
};

export default Footer; 