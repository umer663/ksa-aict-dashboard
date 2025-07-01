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
};

const PatientForm = ({ patient, mode = 'add', onSave, saving = false, error = '', success = '', onClose }: PatientFormProps) => {
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
  };

  const handleFillSample = () => {
    setForm(samplePatient);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 1000, mx: 'auto', mt: 4 }}>
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
        {mode === 'add' && (
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
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Chronic Diseases (one per line)"
              value={form.medical_history.chronic_diseases.join('\n')}
              onChange={e => setForm(prev => ({
                ...prev,
                medical_history: {
                  ...prev.medical_history,
                  chronic_diseases: e.target.value.split('\n'),
                }
              }))}
              fullWidth
              margin="normal"
              multiline
              minRows={2}
              maxRows={6}
              disabled={mode === 'view'}
            />
            {form.medical_history.chronic_diseases.length > 0 && (
              <ul style={{ marginTop: 8 }}>
                {form.medical_history.chronic_diseases.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Allergies (one per line)"
              value={form.medical_history.allergies.join('\n')}
              onChange={e => setForm(prev => ({
                ...prev,
                medical_history: {
                  ...prev.medical_history,
                  allergies: e.target.value.split('\n'),
                }
              }))}
              fullWidth
              margin="normal"
              multiline
              minRows={2}
              maxRows={6}
              disabled={mode === 'view'}
            />
            {form.medical_history.allergies.length > 0 && (
              <ul style={{ marginTop: 8 }}>
                {form.medical_history.allergies.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Family Medical History (one per line)"
              value={form.medical_history.family_medical_history.join('\n')}
              onChange={e => setForm(prev => ({
                ...prev,
                medical_history: {
                  ...prev.medical_history,
                  family_medical_history: e.target.value.split('\n'),
                }
              }))}
              fullWidth
              margin="normal"
              multiline
              minRows={6}
              maxRows={10}
              disabled={mode === 'view'}
            />
            {form.medical_history.family_medical_history.length > 0 && (
              <ul style={{ marginTop: 8 }}>
                {form.medical_history.family_medical_history.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
          </Grid>
        </Grid>
        {/* Previous Surgeries dynamic list */}
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2">Previous Surgeries</Typography>
        {form.medical_history.previous_surgeries.map((surgery, idx) => (
          <Box key={idx} sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
            <TextField
              label="Surgery Name"
              value={surgery.surgery_name}
              onChange={e => {
                const updated = [...form.medical_history.previous_surgeries];
                updated[idx] = { ...updated[idx], surgery_name: e.target.value };
                setForm(prev => ({
                  ...prev,
                  medical_history: { ...prev.medical_history, previous_surgeries: updated }
                }));
              }}
              size="small"
              disabled={mode === 'view'}
            />
            <TextField
              label="Surgery Date"
              type="date"
              value={surgery.surgery_date}
              onChange={e => {
                const updated = [...form.medical_history.previous_surgeries];
                updated[idx] = { ...updated[idx], surgery_date: e.target.value };
                setForm(prev => ({
                  ...prev,
                  medical_history: { ...prev.medical_history, previous_surgeries: updated }
                }));
              }}
              size="small"
              InputLabelProps={{ shrink: true }}
              disabled={mode === 'view'}
            />
            {mode !== 'view' && (
              <Button color="error" onClick={() => {
                const updated = form.medical_history.previous_surgeries.filter((_, i) => i !== idx);
                setForm(prev => ({
                  ...prev,
                  medical_history: { ...prev.medical_history, previous_surgeries: updated }
                }));
              }}>Remove</Button>
            )}
          </Box>
        ))}
        {mode !== 'view' && (
          <Button
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            onClick={() => setForm(prev => ({
              ...prev,
              medical_history: {
                ...prev.medical_history,
                previous_surgeries: [...prev.medical_history.previous_surgeries, { surgery_name: '', surgery_date: '' }]
              }
            }))}
          >Add Surgery</Button>
        )}
        {/* Medications dynamic list */}
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2">Medications</Typography>
        {form.medical_history.medications.map((med, idx) => (
          <Box key={idx} sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
            <TextField
              label="Medication Name"
              value={med.medication_name}
              onChange={e => {
                const updated = [...form.medical_history.medications];
                updated[idx] = { ...updated[idx], medication_name: e.target.value };
                setForm(prev => ({
                  ...prev,
                  medical_history: { ...prev.medical_history, medications: updated }
                }));
              }}
              size="small"
              disabled={mode === 'view'}
            />
            <TextField
              label="Dosage"
              value={med.dosage}
              onChange={e => {
                const updated = [...form.medical_history.medications];
                updated[idx] = { ...updated[idx], dosage: e.target.value };
                setForm(prev => ({
                  ...prev,
                  medical_history: { ...prev.medical_history, medications: updated }
                }));
              }}
              size="small"
              disabled={mode === 'view'}
            />
            <TextField
              label="Frequency"
              value={med.frequency}
              onChange={e => {
                const updated = [...form.medical_history.medications];
                updated[idx] = { ...updated[idx], frequency: e.target.value };
                setForm(prev => ({
                  ...prev,
                  medical_history: { ...prev.medical_history, medications: updated }
                }));
              }}
              size="small"
              disabled={mode === 'view'}
            />
            {mode !== 'view' && (
              <Button color="error" onClick={() => {
                const updated = form.medical_history.medications.filter((_, i) => i !== idx);
                setForm(prev => ({
                  ...prev,
                  medical_history: { ...prev.medical_history, medications: updated }
                }));
              }}>Remove</Button>
            )}
          </Box>
        ))}
        {mode !== 'view' && (
          <Button
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            onClick={() => setForm(prev => ({
              ...prev,
              medical_history: {
                ...prev.medical_history,
                medications: [...prev.medical_history.medications, { medication_name: '', dosage: '', frequency: '' }]
              }
            }))}
          >Add Medication</Button>
        )}
        <Divider sx={{ my: 2 }} />
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