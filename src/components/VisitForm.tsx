import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Grid, MenuItem, IconButton
} from '@mui/material';
import { Save as SaveIcon, Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { fetchAllDoctors } from '../services/authService';
import { Medication } from '../models/types';
import dayjs from 'dayjs';

export interface VisitFormProps {
  onSave: (visit: any) => Promise<void>;
  lastVisit?: any;
  loading?: boolean;
  error?: string;
  success?: string;
  onClose?: () => void;
  user: any;
  canCreate: boolean;
}

const defaultMedication: Medication = { medication_name: '', dosage: '', frequency: '' };

const VisitForm: React.FC<VisitFormProps> = ({ onSave, lastVisit, loading = false, error = '', success = '', onClose, user, canCreate }) => {
  const [form, setForm] = useState({
    visit_id: '', // Added visit_id field to match sample data
    visitDate: dayjs().format('YYYY-MM-DD'),
    doctorId: '',
    symptoms: '',
    diagnosis: '',
    recommendations: '',
    medications: [defaultMedication],
  });
  const [doctors, setDoctors] = useState<{ uid: string; name: string }[]>([]);

  useEffect(() => {
    fetchAllDoctors().then((allDoctors) => {
      if (user?.role === 'Therapist') {
        const therapist = allDoctors.find((doc: any) => doc.email === user.email);
        setDoctors(therapist ? [{ uid: therapist.uid, name: therapist.name }] : []);
        setForm(prev => ({ ...prev, doctorId: therapist ? therapist.uid : '' }));
      } else if (user?.role === 'SuperAdmin' || user?.role === 'Admin') {
        setDoctors(allDoctors);
      } else {
        setDoctors([]);
      }
    });
  }, [user]);

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleMedicationChange = (idx: number, field: keyof Medication, value: string) => {
    setForm(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) =>
        i === idx ? { ...med, [field]: value } : med
      ),
    }));
  };

  const addMedication = () => {
    setForm(prev => ({
      ...prev,
      medications: [...prev.medications, defaultMedication],
    }));
  };

  const removeMedication = (idx: number) => {
    setForm(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Generate visit_id if not provided
    const visitData = {
      ...form,
      visit_id: form.visit_id || `V${Date.now()}`, // Generate unique visit_id if not provided
    };
    await onSave(visitData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Add New Visit
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Visit Date"
              type="date"
              value={form.visitDate}
              onChange={e => handleChange('visitDate', e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
              disabled={!canCreate}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Doctor"
              select
              value={form.doctorId}
              onChange={e => handleChange('doctorId', e.target.value)}
              fullWidth
              margin="normal"
              required
              disabled={!canCreate}
            >
              {doctors.map((doctor) => (
                <MenuItem key={doctor.uid} value={doctor.uid}>
                  {doctor.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Symptoms"
              value={form.symptoms}
              onChange={e => handleChange('symptoms', e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={3}
              required
              disabled={!canCreate}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Diagnosis"
              value={form.diagnosis}
              onChange={e => handleChange('diagnosis', e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={2}
              disabled={!canCreate}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Recommendations"
              value={form.recommendations}
              onChange={e => handleChange('recommendations', e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={3}
              required
              disabled={!canCreate}
            />
          </Grid>
        </Grid>

        {/* Medications Section */}
        <Typography variant="h6" sx={{ mt: 3, mb: 2 }} color="primary">
          Medications
        </Typography>
        
        {form.medications.map((medication, idx) => (
          <Grid container spacing={2} key={idx} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Medication Name"
                value={medication.medication_name}
                onChange={e => handleMedicationChange(idx, 'medication_name', e.target.value)}
                fullWidth
                margin="normal"
                disabled={!canCreate}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Dosage"
                value={medication.dosage}
                onChange={e => handleMedicationChange(idx, 'dosage', e.target.value)}
                fullWidth
                margin="normal"
                disabled={!canCreate}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Frequency"
                value={medication.frequency}
                onChange={e => handleMedicationChange(idx, 'frequency', e.target.value)}
                fullWidth
                margin="normal"
                disabled={!canCreate}
              />
            </Grid>
            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
              {canCreate && (
                <IconButton
                  onClick={() => removeMedication(idx)}
                  color="error"
                  disabled={form.medications.length === 1}
                >
                  <RemoveIcon />
                </IconButton>
              )}
            </Grid>
          </Grid>
        ))}
        
        {canCreate && (
          <Button
            startIcon={<AddIcon />}
            onClick={addMedication}
            variant="outlined"
            sx={{ mb: 2 }}
          >
            Add Medication
          </Button>
        )}
      </Paper>

      {canCreate && (
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {onClose && (
            <Button onClick={onClose} variant="outlined">
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Visit'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default VisitForm; 