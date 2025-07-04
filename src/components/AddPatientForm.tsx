import React, { useState, useEffect, forwardRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Alert,
  Snackbar,
  FormHelperText,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Add as AddIcon, Save as SaveIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { PatientData, PersonalInfo, Address } from '../models/types';
import { createPatient } from '../services/authService';
import { v4 as uuidv4 } from 'uuid';

export interface PatientFormProps {
  patient?: PatientData;
  mode?: 'add' | 'edit' | 'view';
  onSave: (patient: PatientData) => Promise<void>;
  saving?: boolean;
  error?: string;
  success?: string;
  onClose?: () => void;
}

const defaultAddress: Address = {
  street: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
};
const defaultPersonalInfo: PersonalInfo = {
  first_name: '',
  last_name: '',
  date_of_birth: '',
  gender: '',
  contact_number: '',
  email: '',
  address: defaultAddress,
};

const defaultPatient: PatientData = {
  patient_id: uuidv4(),
  personal_info: defaultPersonalInfo,
};

const PatientForm = forwardRef<HTMLDivElement, PatientFormProps>(({ patient, mode = 'add', onSave, saving = false, error = '', success = '', onClose }, ref) => {
  const [form, setForm] = useState<PatientData>(patient || defaultPatient);

  useEffect(() => {
    if (patient) setForm(patient);
  }, [patient]);

  const [localError, setLocalError] = useState('');
  const [localSuccess, setLocalSuccess] = useState('');

  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: any) => {
    setForm((prev) => ({
      ...prev,
      personal_info: {
        ...prev.personal_info,
        [field]: value,
      },
    }));
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setForm((prev) => ({
      ...prev,
      personal_info: {
        ...prev.personal_info,
        address: {
          ...prev.personal_info.address,
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setLocalSuccess('');
    try {
      await onSave(form);
      setLocalSuccess(mode === 'add' ? 'Patient created successfully!' : 'Patient updated successfully!');
    } catch (err) {
      setLocalError('Failed to save patient');
    }
  };

  return (
    <Box ref={ref} component="form" onSubmit={handleSubmit} sx={{ maxWidth: 1000, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3, mb: 4, position: 'relative' }}>
        {mode === 'edit' && onClose && (
          <Button
            aria-label="Close Edit Patient"
            onClick={onClose}
            sx={{ position: 'absolute', top: 8, right: 8, minWidth: 0, padding: 0, fontSize: 24, lineHeight: 1 }}
          >
            &times;
          </Button>
        )}
        <Typography variant="h6" gutterBottom color="primary">
          {mode === 'add' ? 'Add New Patient' : mode === 'edit' ? 'Edit Patient' : 'Patient Details'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="First Name"
              value={form.personal_info.first_name}
              onChange={e => handlePersonalInfoChange('first_name', e.target.value)}
              fullWidth
              margin="normal"
              required
              disabled={mode === 'view'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Last Name"
              value={form.personal_info.last_name}
              onChange={e => handlePersonalInfoChange('last_name', e.target.value)}
              fullWidth
              margin="normal"
              required
              disabled={mode === 'view'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Date of Birth"
              type="date"
              value={form.personal_info.date_of_birth}
              onChange={e => handlePersonalInfoChange('date_of_birth', e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
              disabled={mode === 'view'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Gender"
              value={form.personal_info.gender}
              onChange={e => handlePersonalInfoChange('gender', e.target.value)}
              fullWidth
              margin="normal"
              required
              disabled={mode === 'view'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Contact Number"
              value={form.personal_info.contact_number}
              onChange={e => handlePersonalInfoChange('contact_number', e.target.value)}
              fullWidth
              margin="normal"
              disabled={mode === 'view'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Email"
              value={form.personal_info.email}
              onChange={e => handlePersonalInfoChange('email', e.target.value)}
              fullWidth
              margin="normal"
              disabled={mode === 'view'}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Street Address"
              value={form.personal_info.address.street}
              onChange={e => handleAddressChange('street', e.target.value)}
              fullWidth
              margin="normal"
              disabled={mode === 'view'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="City"
              value={form.personal_info.address.city}
              onChange={e => handleAddressChange('city', e.target.value)}
              fullWidth
              margin="normal"
              disabled={mode === 'view'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="State/Province"
              value={form.personal_info.address.state}
              onChange={e => handleAddressChange('state', e.target.value)}
              fullWidth
              margin="normal"
              disabled={mode === 'view'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Postal Code"
              value={form.personal_info.address.postal_code}
              onChange={e => handleAddressChange('postal_code', e.target.value)}
              fullWidth
              margin="normal"
              disabled={mode === 'view'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Country"
              value={form.personal_info.address.country}
              onChange={e => handleAddressChange('country', e.target.value)}
              fullWidth
              margin="normal"
              disabled={mode === 'view'}
            />
          </Grid>
        </Grid>
        {mode !== 'view' && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" size="large" startIcon={<SaveIcon />} disabled={saving}>
              {saving ? 'Saving...' : mode === 'add' ? 'Save Patient' : 'Update Patient'}
          </Button>
        </Box>
        )}
        {(success || localSuccess) && <Alert severity="success" sx={{ mt: 2 }}>{success || localSuccess}</Alert>}
        {(error || localError) && <Alert severity="error" sx={{ mt: 2 }}>{error || localError}</Alert>}
      </Paper>
    </Box>
  );
});

export default PatientForm; 