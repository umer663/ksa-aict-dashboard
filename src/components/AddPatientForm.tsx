import { useState, useEffect } from 'react';
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
import { PatientData, PersonalInfo, Address, MedicalHistory, CurrentHealthStatus } from '../models/types';
import { createPatient } from '../services/authService';
import { v4 as uuidv4 } from 'uuid';

export interface PatientFormProps {
  patient?: PatientData;
  mode?: 'add' | 'edit' | 'view';
  onSave: (patient: PatientData) => Promise<void>;
  saving?: boolean;
  error?: string;
  success?: string;
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
const defaultMedicalHistory: MedicalHistory = {
  chronic_diseases: [],
  previous_surgeries: [],
    medications: [],
    allergies: [],
  family_medical_history: [],
};
const defaultCurrentHealthStatus: CurrentHealthStatus = {
  height_cm: 0,
  weight_kg: 0,
  blood_pressure: '',
  heart_rate: 0,
  current_symptoms: [],
};

const defaultPatient: PatientData = {
  patient_id: uuidv4(),
  personal_info: defaultPersonalInfo,
  medical_history: defaultMedicalHistory,
  lifestyle: {
    smoking: false,
    alcohol_consumption: false,
    exercise_frequency: '',
    dietary_habits: '',
  },
  current_health_status: defaultCurrentHealthStatus,
  doctor_notes: [],
  presenting_complains: [],
  history_of_presenting_complains: [],
  family_medical_history: [],
  diagnosis: [],
  treatment_plan: [],
  follow_up_plans: [],
  therapist_name: '',
  date_of_visit: '',
  last_modified: '',
  created_by: '',
};

const PatientForm = ({ patient, mode = 'add', onSave, saving = false, error = '', success = '' }: PatientFormProps) => {
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

  const samplePatient: PatientData = {
    patient_id: 'sample-id-123',
    personal_info: {
      first_name: 'Ali',
      last_name: 'Khan',
      date_of_birth: '1990-05-15',
    gender: 'Male',
      contact_number: '03001234567',
      email: 'ali.khan@email.com',
      address: {
        street: '123 Main Street',
        city: 'Lahore',
        state: '',
        postal_code: '',
        country: 'Pakistani',
      },
    },
    medical_history: {
      chronic_diseases: ['Diabetes'],
      previous_surgeries: [],
      medications: [{ medication_name: 'Metformin', dosage: '500mg', frequency: 'Twice a day' }],
      allergies: ['Penicillin (Rash, Mild)'],
      family_medical_history: [],
    },
    lifestyle: {
      smoking: false,
      alcohol_consumption: false,
      exercise_frequency: '',
      dietary_habits: '',
    },
    current_health_status: {
      height_cm: 0,
      weight_kg: 0,
      blood_pressure: '',
      heart_rate: 0,
      current_symptoms: [],
    },
    doctor_notes: ['Patient is stable.'],
    presenting_complains: [],
    history_of_presenting_complains: [],
    family_medical_history: [],
    diagnosis: [],
    treatment_plan: [],
    follow_up_plans: [],
    therapist_name: '',
    date_of_visit: '',
    last_modified: '',
    created_by: '',
  };

  const handleFillSample = () => {
    setForm(samplePatient);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 1000, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom color="primary">
          {mode === 'add' ? 'Add New Patient' : mode === 'edit' ? 'Edit Patient' : 'Patient Details'}
        </Typography>
        {mode !== 'view' && (
        <Button variant="outlined" color="secondary" sx={{ mb: 2 }} onClick={handleFillSample}>
          Fill with Sample Data
        </Button>
        )}
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
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1">Medical History</Typography>
        <Button variant="outlined" size="small" onClick={() => alert('Add Medical History functionality here')}>Add Medical History</Button>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1">Medications</Typography>
        <Button variant="outlined" size="small" onClick={() => alert('Add Medication functionality here')}>Add Medication</Button>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1">Allergies</Typography>
        <Button variant="outlined" size="small" onClick={() => alert('Add Allergy functionality here')}>Add Allergy</Button>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1">Appointments</Typography>
        <Button variant="outlined" size="small" onClick={() => alert('Add Appointment functionality here')}>Add Appointment</Button>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1">Clinical Visits</Typography>
        <Button variant="outlined" size="small" onClick={() => alert('Add Clinical Visit functionality here')}>Add Clinical Visit</Button>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1">Lab Results</Typography>
        <Button variant="outlined" size="small" onClick={() => alert('Add Lab Result functionality here')}>Add Lab Result</Button>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1">Imaging Reports</Typography>
        <Button variant="outlined" size="small" onClick={() => alert('Add Imaging Report functionality here')}>Add Imaging Report</Button>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1">Immunizations</Typography>
        <Button variant="outlined" size="small" onClick={() => alert('Add Immunization functionality here')}>Add Immunization</Button>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1">Emergency Contacts</Typography>
        <Button variant="outlined" size="small" onClick={() => alert('Add Emergency Contact functionality here')}>Add Emergency Contact</Button>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1">Insurance Details</Typography>
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
};

export default PatientForm; 