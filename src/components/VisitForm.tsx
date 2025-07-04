import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Grid, MenuItem, IconButton
} from '@mui/material';
import { Save as SaveIcon, Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { fetchAllDoctors } from '../services/authService';
import dayjs from 'dayjs';

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

export interface VisitFormProps {
  onSave: (visit: any) => Promise<void>;
  lastVisit?: any;
  loading?: boolean;
  error?: string;
  success?: string;
  onClose?: () => void;
  user: any; // Add user prop
}

const defaultMedication: Medication = { name: '', dosage: '', frequency: '' };

const VisitForm: React.FC<VisitFormProps> = ({ onSave, lastVisit, loading = false, error = '', success = '', onClose, user }) => {
  const [form, setForm] = useState({
    visitDate: dayjs().format('YYYY-MM-DD'),
    doctorId: '',
    symptoms: '',
    diagnosis: '',
    recommendations: '',
    medications: [defaultMedication],
    followUpDate: '',
  });
  const [doctors, setDoctors] = useState<{ uid: string; name: string }[]>([]);

  useEffect(() => {
    fetchAllDoctors().then((allDoctors) => {
      if (user?.role === 'Therapist') {
        // Only show the logged-in therapist
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
    await onSave(form);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
      <Paper sx={{ p: 3, mb: 4, position: 'relative' }}>
        <Typography variant="h6" gutterBottom color="primary">
          Add New Visit / Encounter
        </Typography>
        {lastVisit && (
          <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Last Visit Summary:</Typography>
            <Typography variant="body2"><b>Date:</b> {lastVisit.visitDate}</Typography>
            <Typography variant="body2"><b>Doctor:</b> {lastVisit.doctorName || lastVisit.doctorId}</Typography>
            <Typography variant="body2"><b>Diagnosis:</b> {lastVisit.diagnosis}</Typography>
            <Typography variant="body2"><b>Recommendations:</b> {lastVisit.recommendations}</Typography>
            <Typography variant="body2"><b>Medications:</b> {lastVisit.medications?.map((m: Medication) => `${m.name} (${m.dosage}, ${m.frequency})`).join(', ')}</Typography>
          </Box>
        )}
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
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Doctor"
              value={form.doctorId}
              onChange={e => handleChange('doctorId', e.target.value)}
              fullWidth
              margin="normal"
              required
              disabled={user?.role === 'Therapist'} // Therapist cannot change doctor
            >
              {doctors.map(doc => (
                <MenuItem key={doc.uid} value={doc.uid}>{doc.name}</MenuItem>
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
              minRows={2}
              required
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
              minRows={2}
              required
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
              minRows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mt: 2 }}>Medications</Typography>
            {form.medications.map((med, idx) => (
              <Grid container spacing={1} key={idx} alignItems="center" sx={{ mb: 1 }}>
                <Grid item xs={3}>
                  <TextField
                    label="Name"
                    value={med.name}
                    onChange={e => handleMedicationChange(idx, 'name', e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Dosage"
                    value={med.dosage}
                    onChange={e => handleMedicationChange(idx, 'dosage', e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Frequency"
                    value={med.frequency}
                    onChange={e => handleMedicationChange(idx, 'frequency', e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3}>
                  <IconButton onClick={() => removeMedication(idx)} disabled={form.medications.length === 1}>
                    <RemoveIcon />
                  </IconButton>
                  {idx === form.medications.length - 1 && (
                    <IconButton onClick={addMedication}>
                      <AddIcon />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Follow-up Date"
              type="date"
              value={form.followUpDate}
              onChange={e => handleChange('followUpDate', e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" size="large" startIcon={<SaveIcon />} disabled={loading}>
            {loading ? 'Saving...' : 'Save Visit'}
          </Button>
        </Box>
        {success && <Typography color="success.main" sx={{ mt: 2 }}>{success}</Typography>}
        {error && <Typography color="error.main" sx={{ mt: 2 }}>{error}</Typography>}
      </Paper>
    </Box>
  );
};

export default VisitForm; 