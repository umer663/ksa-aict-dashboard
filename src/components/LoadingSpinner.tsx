import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 40, message }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 120, width: '100%' }}>
    <CircularProgress size={size} />
    {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
  </Box>
);

export default LoadingSpinner; 