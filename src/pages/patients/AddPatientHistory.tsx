import { Box, Typography } from '@mui/material';
import AddPatientForm from '../../components/AddPatientForm';
import { useOutletContext } from 'react-router-dom';

const AddPatientHistory = () => {
  const { user } = useOutletContext<{ user: any }>();
  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          mb: 4,
          color: 'primary.main',
          fontWeight: 500,
        }}
      >
        Add Patient History
      </Typography>
      <AddPatientForm />
    </Box>
  );
};

export default AddPatientHistory; 