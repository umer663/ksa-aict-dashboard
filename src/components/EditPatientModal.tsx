import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { EditPatientModalProps, PatientData, Address } from '../models/types';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxWidth: '800px',
    width: '100%',
  },
}));

const steps = [
  'Therapist Information',
  'Personal Information',
  'Contact Details',
  'Current Health Status',
  'Medical History',
  'Clinical Notes'
];

const EditPatientModal = ({ open, onClose, patient, onSave }: EditPatientModalProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<PatientData>(patient);
  const [diseases, setDiseases] = useState<string[]>(patient.medical_history.chronic_diseases || []);
  const [newDisease, setNewDisease] = useState('');
  const [allergies, setAllergies] = useState<string[]>(patient.medical_history.allergies || []);
  const [newAllergy, setNewAllergy] = useState('');
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    setFormData(patient);
    setDiseases(patient.medical_history.chronic_diseases || []);
    setAllergies(patient.medical_history.allergies || []);
  }, [patient]);

  const handleInputChange = (
    section: 'personal_info' | 'medical_history' | 'lifestyle' | 'current_health_status',
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setFormData((prev) => ({
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

  // Handle text area changes for bullet point fields
  const handleTextAreaChange = (field: keyof PatientData, value: string) => {
    // Split by newlines but keep empty lines for now
    const lines = value.split('\n');
    
    setFormData(prev => ({
      ...prev,
      [field]: lines
    }));
  };

  // Convert array to display text for text areas
  const getDisplayText = (field: keyof PatientData): string => {
    const value = formData[field];
    if (Array.isArray(value)) {
      return value.join('\n');
    }
    return '';
  };

  const handleAddDisease = () => {
    if (newDisease && !diseases.includes(newDisease)) {
      const updatedDiseases = [...diseases, newDisease];
      setDiseases(updatedDiseases);
      setFormData((prev) => ({
        ...prev,
        medical_history: {
          ...prev.medical_history,
          chronic_diseases: updatedDiseases,
        },
      }));
      setNewDisease('');
    }
  };

  const handleAddAllergy = () => {
    if (newAllergy && !allergies.includes(newAllergy)) {
      const updatedAllergies = [...allergies, newAllergy];
      setAllergies(updatedAllergies);
      setFormData((prev) => ({
        ...prev,
        medical_history: {
          ...prev.medical_history,
          allergies: updatedAllergies,
        },
      }));
      setNewAllergy('');
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSave = async () => {
    try {
      // Filter out empty lines from text area fields before saving
      const cleanedFormData = {
        ...formData,
        doctor_notes: Array.isArray(formData.doctor_notes) ? formData.doctor_notes.filter(line => line.trim() !== '') : [],
        presenting_complains: Array.isArray(formData.presenting_complains) ? formData.presenting_complains.filter(line => line.trim() !== '') : [],
        history_of_presenting_complains: Array.isArray(formData.history_of_presenting_complains) ? formData.history_of_presenting_complains.filter(line => line.trim() !== '') : [],
        family_medical_history: Array.isArray(formData.family_medical_history) ? formData.family_medical_history.filter(line => line.trim() !== '') : [],
        diagnosis: Array.isArray(formData.diagnosis) ? formData.diagnosis.filter(line => line.trim() !== '') : [],
        treatment_plan: Array.isArray(formData.treatment_plan) ? formData.treatment_plan.filter(line => line.trim() !== '') : [],
        follow_up_plans: Array.isArray(formData.follow_up_plans) ? formData.follow_up_plans.filter(line => line.trim() !== '') : [],
      };

      // Add timestamp for audit
      const updatedPatient = {
        ...cleanedFormData,
        last_modified: new Date().toISOString(),
      };
      
      await onSave(updatedPatient);
      setSaveStatus('success');
      setTimeout(() => {
        onClose();
        setSaveStatus(null);
      }, 1500);
    } catch (error) {
      setSaveStatus('error');
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: // Therapist Information
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Therapist Name"
                value={formData.therapist_name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, therapist_name: e.target.value }))}
                placeholder="Enter therapist name"
              />
            </Grid>
          </Grid>
        );

      case 1: // Personal Information
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.personal_info.first_name}
                onChange={(e) => handleInputChange('personal_info', 'first_name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.personal_info.last_name}
                onChange={(e) => handleInputChange('personal_info', 'last_name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date of Birth"
                InputLabelProps={{ shrink: true }}
                value={formData.personal_info.date_of_birth}
                onChange={(e) => handleInputChange('personal_info', 'date_of_birth', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={formData.personal_info.gender}
                  label="Gender"
                  onChange={(e) => handleInputChange('personal_info', 'gender', e.target.value)}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 2: // Contact Details
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Number"
                value={formData.personal_info.contact_number}
                onChange={(e) => handleInputChange('personal_info', 'contact_number', e.target.value)}
                placeholder="e.g., +1 234-567-8900"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="email"
                label="Email Address"
                value={formData.personal_info.email}
                onChange={(e) => handleInputChange('personal_info', 'email', e.target.value)}
                placeholder="example@email.com"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="primary" sx={{ mb: 2 }}>
                Address Information
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street Address"
                value={formData.personal_info.address.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                placeholder="123 Main Street"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                value={formData.personal_info.address.city}
                onChange={(e) => handleAddressChange('city', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="State/Province"
                value={formData.personal_info.address.state}
                onChange={(e) => handleAddressChange('state', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Postal Code"
                value={formData.personal_info.address.postal_code}
                onChange={(e) => handleAddressChange('postal_code', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                value={formData.personal_info.address.country}
                onChange={(e) => handleAddressChange('country', e.target.value)}
              />
            </Grid>
          </Grid>
        );

      case 3: // Current Health Status
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Height (cm)"
                value={formData.current_health_status.height_cm}
                onChange={(e) => handleInputChange('current_health_status', 'height_cm', Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Weight (kg)"
                value={formData.current_health_status.weight_kg}
                onChange={(e) => handleInputChange('current_health_status', 'weight_kg', Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Blood Pressure"
                value={formData.current_health_status.blood_pressure}
                onChange={(e) => handleInputChange('current_health_status', 'blood_pressure', e.target.value)}
                placeholder="120/80"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Heart Rate (bpm)"
                value={formData.current_health_status.heart_rate}
                onChange={(e) => handleInputChange('current_health_status', 'heart_rate', Number(e.target.value))}
              />
            </Grid>
          </Grid>
        );

      case 4: // Medical History
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  fullWidth
                  label="Add Chronic Disease"
                  value={newDisease}
                  onChange={(e) => setNewDisease(e.target.value)}
                />
                <Button
                  variant="contained"
                  onClick={handleAddDisease}
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
              </Stack>
              <Box sx={{ mt: 2 }}>
                {diseases.map((disease) => (
                  <Chip
                    key={disease}
                    label={disease}
                    onDelete={() => {
                      const updatedDiseases = diseases.filter((d) => d !== disease);
                      setDiseases(updatedDiseases);
                      setFormData((prev) => ({
                        ...prev,
                        medical_history: {
                          ...prev.medical_history,
                          chronic_diseases: updatedDiseases,
                        },
                      }));
                    }}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            </Grid>

            {/* Medications Input */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="primary" sx={{ mb: 2 }}>
                Current Medications
              </Typography>
              <TextField
                fullWidth
                value={Array.isArray(formData.medical_history.medications) 
                  ? formData.medical_history.medications.map(med => 
                      typeof med === 'string' ? med : med.medication_name
                    ).join(', ')
                  : ''
                }
                onChange={(e) => {
                  const medicationNames = e.target.value.split(',').map(med => med.trim()).filter(med => med);
                  const medications = medicationNames.map(name => ({
                    medication_name: name,
                    dosage: '',
                    frequency: '',
                    start_date: new Date().toISOString()
                  }));
                  setFormData((prev) => ({
                    ...prev,
                    medical_history: {
                      ...prev.medical_history,
                      medications,
                    },
                  }));
                }}
                placeholder="Enter medications separated by commas"
                multiline
                rows={2}
                helperText="Enter each medication separated by a comma"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  fullWidth
                  label="Add Allergy"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                />
                <Button
                  variant="contained"
                  onClick={handleAddAllergy}
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
              </Stack>
              <Box sx={{ mt: 2 }}>
                {allergies.map((allergy) => (
                  <Chip
                    key={allergy}
                    label={allergy}
                    onDelete={() => {
                      const updatedAllergies = allergies.filter((a) => a !== allergy);
                      setAllergies(updatedAllergies);
                      setFormData((prev) => ({
                        ...prev,
                        medical_history: {
                          ...prev.medical_history,
                          allergies: updatedAllergies,
                        },
                      }));
                    }}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        );

      case 5: // Clinical Notes
        return (
          <Grid container spacing={3}>
            {/* Presenting Complains */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="primary" sx={{ mb: 2 }}>
                Presenting Complains
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={getDisplayText('presenting_complains')}
                onChange={(e) => handleTextAreaChange('presenting_complains', e.target.value)}
                placeholder="Enter each complain on a new line (press Enter for bullet points)"
                helperText="Each line will become a bullet point. Press Enter to add new points."
              />
            </Grid>

            {/* History of Presenting Complains */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="primary" sx={{ mb: 2 }}>
                History of Presenting Complains
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={getDisplayText('history_of_presenting_complains')}
                onChange={(e) => handleTextAreaChange('history_of_presenting_complains', e.target.value)}
                placeholder="Enter each history point on a new line (press Enter for bullet points)"
                helperText="Each line will become a bullet point. Press Enter to add new points."
              />
            </Grid>

            {/* Family Medical History */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="primary" sx={{ mb: 2 }}>
                Family Medical History
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={getDisplayText('family_medical_history')}
                onChange={(e) => handleTextAreaChange('family_medical_history', e.target.value)}
                placeholder="Enter each family history point on a new line (press Enter for bullet points)"
                helperText="Each line will become a bullet point. Press Enter to add new points."
              />
            </Grid>

            {/* Diagnosis */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="primary" sx={{ mb: 2 }}>
                Diagnosis
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={getDisplayText('diagnosis')}
                onChange={(e) => handleTextAreaChange('diagnosis', e.target.value)}
                placeholder="Enter each diagnosis on a new line (press Enter for bullet points)"
                helperText="Each line will become a bullet point. Press Enter to add new points."
              />
            </Grid>

            {/* Doctor's Notes */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="primary" sx={{ mb: 2 }}>
                Doctor's Notes
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={getDisplayText('doctor_notes')}
                onChange={(e) => handleTextAreaChange('doctor_notes', e.target.value)}
                placeholder="Enter each note on a new line (press Enter for bullet points)"
                helperText="Each line will become a bullet point. Press Enter to add new points."
              />
            </Grid>

            {/* Treatment Plan */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="primary" sx={{ mb: 2 }}>
                Treatment Plan
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={getDisplayText('treatment_plan')}
                onChange={(e) => handleTextAreaChange('treatment_plan', e.target.value)}
                placeholder="Enter each treatment step on a new line (press Enter for bullet points)"
                helperText="Each line will become a bullet point. Press Enter to add new points."
              />
            </Grid>

            {/* Follow Up Plans */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="primary" sx={{ mb: 2 }}>
                Follow Up Plans
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={getDisplayText('follow_up_plans')}
                onChange={(e) => handleTextAreaChange('follow_up_plans', e.target.value)}
                placeholder="Enter each follow up plan on a new line (press Enter for bullet points)"
                helperText="Each line will become a bullet point. Press Enter to add new points."
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Edit Patient Information</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Stepper activeStep={activeStep} sx={{ py: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {saveStatus && (
          <Alert 
            severity={saveStatus} 
            sx={{ mb: 2 }}
          >
            {saveStatus === 'success' ? 'Changes saved successfully!' : 'Error saving changes'}
          </Alert>
        )}

        {renderStepContent(activeStep)}
      </DialogContent>
      <DialogActions>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleSave}
            startIcon={<SaveIcon />}
          >
            Save Changes
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
          >
            Next
          </Button>
        )}
      </DialogActions>
    </StyledDialog>
  );
};

export default EditPatientModal; 