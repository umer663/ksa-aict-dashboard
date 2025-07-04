import { Box, Typography } from '@mui/material';
import AddPatientForm from '../../components/AddPatientForm';
import { useOutletContext } from 'react-router-dom';
import { createPatient } from '../../services/authService';
import { useState } from 'react';
import { PatientData } from '../../models/types';
import { useAppConfig } from '../../context/AppConfigContext';

const AddPatientHistory = () => {
  const { user } = useOutletContext<{ user: any }>();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const appConfig = useAppConfig();
  const nonRemoveableUsers = appConfig?.nonRemoveableUsers || [];
  const isNonRemoveable = nonRemoveableUsers.includes(user.email);
  const canCreate = isNonRemoveable || user?.permissions?.['add-patient']?.create === true;

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
      {canCreate && <AddPatientForm onSave={handleSave} success={success} error={error} mode="add" canCreateOrUpdate={canCreate} />}
      {!canCreate && <Typography color="error">You do not have permission to add patients.</Typography>}
    </Box>
  );
};

export default AddPatientHistory; 