import { Box, Typography, Paper } from '@mui/material';

const Tutorials = () => {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Tutorials
        </Typography>
        <Typography variant="body1">
          Welcome to the Tutorials page! Here you will find helpful guides and resources to get the most out of the platform.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Tutorials;
