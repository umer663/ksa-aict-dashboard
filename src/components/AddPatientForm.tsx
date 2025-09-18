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
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Add as AddIcon, Save as SaveIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { PatientData, PersonalInfo, Address, Medication, Surgery } from '../models/types';
import { createPatient } from '../services/authService';

export interface PatientFormProps {
  patient?: PatientData;
  mode?: 'add' | 'edit' | 'view';
  onSave: (patient: PatientData) => Promise<void>;
  saving?: boolean;
  error?: string;
  success?: string;
  onClose?: () => void;
  canCreateOrUpdate?: boolean;
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
  bloodType: '',
};

const defaultMedication: Medication = {
  medication_name: '',
  dosage: '',
  frequency: '',
};

const defaultSurgery: Surgery = {
  surgery_name: '',
  surgery_date: '',
};

const defaultMedicalHistory = {
  chronic_diseases: [],
  previous_surgeries: [],
  medications: [],
  allergies: [],
  family_medical_history: [],
};

const defaultPatient: PatientData = {
  personal_info: defaultPersonalInfo,
  medical_history: defaultMedicalHistory,
};

const PatientForm = forwardRef<HTMLDivElement, PatientFormProps>(({ patient, mode = 'add', onSave, saving = false, error = '', success = '', onClose, canCreateOrUpdate }, ref) => {
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

  const handleMedicalHistoryChange = (field: keyof typeof defaultMedicalHistory, value: any) => {
    setForm((prev) => ({
      ...prev,
      medical_history: {
        ...prev.medical_history,
        [field]: value,
      },
    }));
  };

  const handleMedicationChange = (idx: number, field: keyof Medication, value: string) => {
    setForm((prev) => ({
      ...prev,
      medical_history: {
        ...prev.medical_history,
        medications: prev.medical_history.medications.map((med, i) =>
          i === idx ? { ...med, [field]: value } : med
        ),
      },
    }));
  };

  const addMedication = () => {
    setForm((prev) => ({
      ...prev,
      medical_history: {
        ...prev.medical_history,
        medications: [...prev.medical_history.medications, defaultMedication],
      },
    }));
  };

  const removeMedication = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      medical_history: {
        ...prev.medical_history,
        medications: prev.medical_history.medications.filter((_, i) => i !== idx),
      },
    }));
  };

  const handleSurgeryChange = (idx: number, field: keyof Surgery, value: string) => {
    setForm((prev) => ({
      ...prev,
      medical_history: {
        ...prev.medical_history,
        previous_surgeries: prev.medical_history.previous_surgeries.map((surgery, i) =>
          i === idx ? { ...surgery, [field]: value } : surgery
        ),
      },
    }));
  };

  const addSurgery = () => {
    setForm((prev) => ({
      ...prev,
      medical_history: {
        ...prev.medical_history,
        previous_surgeries: [...prev.medical_history.previous_surgeries, defaultSurgery],
      },
    }));
  };

  const removeSurgery = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      medical_history: {
        ...prev.medical_history,
        previous_surgeries: prev.medical_history.previous_surgeries.filter((_, i) => i !== idx),
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
    <Box ref={ref} component="form" onSubmit={handleSubmit} sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
      {/* Personal Information Section */}
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
          Personal Information
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
              select
              value={form.personal_info.gender}
              onChange={e => handlePersonalInfoChange('gender', e.target.value)}
              fullWidth
              margin="normal"
              required
              disabled={mode === 'view'}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
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
              type="email"
              value={form.personal_info.email}
              onChange={e => handlePersonalInfoChange('email', e.target.value)}
              fullWidth
              margin="normal"
              disabled={mode === 'view'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Blood Type"
              select
              value={form.personal_info.bloodType || ''}
              onChange={e => handlePersonalInfoChange('bloodType', e.target.value)}
              fullWidth
              margin="normal"
              disabled={mode === 'view'}
            >
              <MenuItem value="A+">A+</MenuItem>
              <MenuItem value="A-">A-</MenuItem>
              <MenuItem value="B+">B+</MenuItem>
              <MenuItem value="B-">B-</MenuItem>
              <MenuItem value="AB+">AB+</MenuItem>
              <MenuItem value="AB-">AB-</MenuItem>
              <MenuItem value="O+">O+</MenuItem>
              <MenuItem value="O-">O-</MenuItem>
            </TextField>
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
      </Paper>

      {/* Medical History Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Medical History
        </Typography>
        
        {/* Chronic Diseases */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Chronic Diseases
          </Typography>
          <TextField
            label="Enter chronic diseases (comma-separated)"
            value={form.medical_history.chronic_diseases.join(', ')}
            onChange={e => handleMedicalHistoryChange('chronic_diseases', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
            fullWidth
            margin="normal"
            placeholder="e.g. Diabetes, Hypertension, Asthma"
            disabled={mode === 'view'}
          />
        </Box>

        {/* Allergies */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Allergies
          </Typography>
          <TextField
            label="Enter allergies (comma-separated)"
            value={form.medical_history.allergies.join(', ')}
            onChange={e => handleMedicalHistoryChange('allergies', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
            fullWidth
            margin="normal"
            placeholder="e.g. Penicillin, Latex, Shellfish"
            disabled={mode === 'view'}
          />
        </Box>

        {/* Family Medical History */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Family Medical History
          </Typography>
          <TextField
            label="Enter family medical history (comma-separated)"
            value={form.medical_history.family_medical_history.join(', ')}
            onChange={e => handleMedicalHistoryChange('family_medical_history', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
            fullWidth
            margin="normal"
            placeholder="e.g. Diabetes, Heart Disease, Cancer"
            disabled={mode === 'view'}
          />
        </Box>

        {/* Current Medications */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Current Medications
          </Typography>
          {form.medical_history.medications.map((medication, idx) => (
            <Grid container spacing={2} key={idx} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Medication Name"
                  value={medication.medication_name}
                  onChange={e => handleMedicationChange(idx, 'medication_name', e.target.value)}
                  fullWidth
                  margin="normal"
                  disabled={mode === 'view'}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Dosage"
                  value={medication.dosage}
                  onChange={e => handleMedicationChange(idx, 'dosage', e.target.value)}
                  fullWidth
                  margin="normal"
                  disabled={mode === 'view'}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Frequency"
                  value={medication.frequency}
                  onChange={e => handleMedicationChange(idx, 'frequency', e.target.value)}
                  fullWidth
                  margin="normal"
                  disabled={mode === 'view'}
                />
              </Grid>
              <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
                {mode !== 'view' && (
                  <IconButton
                    onClick={() => removeMedication(idx)}
                    color="error"
                    disabled={form.medical_history.medications.length === 1}
                  >
                    <RemoveIcon />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}
          {mode !== 'view' && (
            <Button
              startIcon={<AddIcon />}
              onClick={addMedication}
              variant="outlined"
              sx={{ mb: 2 }}
            >
              Add Medication
            </Button>
          )}
        </Box>

        {/* Previous Surgeries */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Previous Surgeries
          </Typography>
          {form.medical_history.previous_surgeries.map((surgery, idx) => (
            <Grid container spacing={2} key={idx} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Surgery Name"
                  value={surgery.surgery_name}
                  onChange={e => handleSurgeryChange(idx, 'surgery_name', e.target.value)}
                  fullWidth
                  margin="normal"
                  disabled={mode === 'view'}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Surgery Date"
                  type="date"
                  value={surgery.surgery_date}
                  onChange={e => handleSurgeryChange(idx, 'surgery_date', e.target.value)}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  disabled={mode === 'view'}
                />
              </Grid>
              <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
                {mode !== 'view' && (
                  <IconButton
                    onClick={() => removeSurgery(idx)}
                    color="error"
                    disabled={form.medical_history.previous_surgeries.length === 1}
                  >
                    <RemoveIcon />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}
          {mode !== 'view' && (
            <Button
              startIcon={<AddIcon />}
              onClick={addSurgery}
              variant="outlined"
              sx={{ mb: 2 }}
            >
              Add Surgery
            </Button>
          )}
        </Box>
      </Paper>

      {/* Submit Button */}
      {mode !== 'view' && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" size="large" startIcon={<SaveIcon />} disabled={saving || !canCreateOrUpdate}>
            {saving ? 'Saving...' : mode === 'add' ? 'Save Patient' : 'Update Patient'}
          </Button>
        </Box>
      )}
      
      {/* Success/Error Messages */}
      {(success || localSuccess) && <Alert severity="success" sx={{ mt: 2 }}>{success || localSuccess}</Alert>}
      {(error || localError) && <Alert severity="error" sx={{ mt: 2 }}>{error || localError}</Alert>}
    </Box>
  );
});

export default PatientForm; 