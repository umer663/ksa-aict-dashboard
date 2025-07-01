import { Box, Typography } from '@mui/material';
import AddPatientForm from '../../components/AddPatientForm';
import { useOutletContext } from 'react-router-dom';
import { createPatient } from '../../services/authService';
import { useState } from 'react';
import { PatientData } from '../../models/types';

const AddPatientHistory = () => {
  const { user } = useOutletContext<{ user: any }>();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSave = async (patient: PatientData) => {
    try {
      await createPatient(patient);
      setSuccess('Patient created successfully!');
    } catch (err) {
      setError('Failed to save patient');
    }
  };

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
      <AddPatientForm onSave={handleSave} success={success} error={error} mode="add" />
    </Box>
  );
};

export default AddPatientHistory; 