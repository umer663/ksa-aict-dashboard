import { Box, Typography, Button } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import { useNavigate } from 'react-router-dom';

const UnderConstruction = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ textAlign: 'center', mt: 10 }}>
      <BuildIcon sx={{ fontSize: 80, color: 'warning.main', mb: 2 }} />
      <Typography variant="h3" gutterBottom>Under Construction</Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        This feature is currently under development. Please check back later.
      </Typography>
      {/* <Button variant="contained" color="primary" onClick={() => navigate('/dashboard')}>
        Go to Dashboard
      </Button> */}
    </Box>
  );
};

export default UnderConstruction; 