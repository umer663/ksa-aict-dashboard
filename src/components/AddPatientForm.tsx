import { useState } from 'react';
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
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Add as AddIcon, Save as SaveIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const AddPatientForm = () => {
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [diseases, setDiseases] = useState<string[]>([]);
  const [newDisease, setNewDisease] = useState('');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState('');

  const [formData, setFormData] = useState({
    personal_info: {
      first_name: '',
      last_name: '',
      date_of_birth: '',
      gender: '',
      contact_number: '',
      email: '',
      address: {
        street: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
      },
    },
    medical_history: {
      chronic_diseases: [] as string[],
      medications: [{ medication_name: '', dosage: '', frequency: '' }],
      allergies: [] as string[],
    },
    current_health_status: {
      height_cm: '',
      weight_kg: '',
      blood_pressure: '',
      heart_rate: '',
    },
    lifestyle: {
      smoking: false,
      alcohol_consumption: false,
      exercise_frequency: '',
      dietary_habits: '',
    },
  });

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
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

  const handleAddDisease = () => {
    if (newDisease && !diseases.includes(newDisease)) {
      setDiseases([...diseases, newDisease]);
      setFormData((prev) => ({
        ...prev,
        medical_history: {
          ...prev.medical_history,
          chronic_diseases: [...diseases, newDisease],
        },
      }));
      setNewDisease('');
    }
  };

  const handleAddAllergy = () => {
    if (newAllergy && !allergies.includes(newAllergy)) {
      setAllergies([...allergies, newAllergy]);
      setFormData((prev) => ({
        ...prev,
        medical_history: {
          ...prev.medical_history,
          allergies: [...allergies, newAllergy],
        },
      }));
      setNewAllergy('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Get existing patients from localStorage
    const existingPatients = JSON.parse(localStorage.getItem('patients') || '[]');
    
    // Add new patient with ID and date
    const newPatient = {
      ...formData,
      patient_id: `PAT${Date.now()}`,
      date_of_visit: new Date().toISOString(),
    };
    
    // Save to localStorage
    localStorage.setItem('patients', JSON.stringify([...existingPatients, newPatient]));
    
    setOpenSnackbar(true);
    setTimeout(() => {
      navigate('/patient-history');
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        {/* Personal Information */}
        <StyledPaper>
          <Typography variant="h6" gutterBottom color="primary">
            Personal Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="First Name"
                value={formData.personal_info.first_name}
                onChange={(e) => handleInputChange('personal_info', 'first_name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Last Name"
                value={formData.personal_info.last_name}
                onChange={(e) => handleInputChange('personal_info', 'last_name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="date"
                label="Date of Birth"
                InputLabelProps={{ shrink: true }}
                value={formData.personal_info.date_of_birth}
                onChange={(e) => handleInputChange('personal_info', 'date_of_birth', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
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
        </StyledPaper>

        {/* Contact Information */}
        <StyledPaper>
          <Typography variant="h6" gutterBottom color="primary">
            Contact Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Contact Number"
                value={formData.personal_info.contact_number}
                onChange={(e) => handleInputChange('personal_info', 'contact_number', e.target.value)}
                placeholder="e.g., +1 234-567-8900"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
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
                required
                fullWidth
                label="Street Address"
                value={formData.personal_info.address.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                placeholder="123 Main Street"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="City"
                value={formData.personal_info.address.city}
                onChange={(e) => handleAddressChange('city', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="State/Province"
                value={formData.personal_info.address.state}
                onChange={(e) => handleAddressChange('state', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Postal Code"
                value={formData.personal_info.address.postal_code}
                onChange={(e) => handleAddressChange('postal_code', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Country"
                value={formData.personal_info.address.country}
                onChange={(e) => handleAddressChange('country', e.target.value)}
              />
            </Grid>
          </Grid>
        </StyledPaper>

        {/* Medical History */}
        <StyledPaper>
          <Typography variant="h6" gutterBottom color="primary">
            Medical History
          </Typography>
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
                      setDiseases(diseases.filter((d) => d !== disease));
                    }}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
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
                      setAllergies(allergies.filter((a) => a !== allergy));
                    }}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </StyledPaper>

        {/* Current Health Status */}
        <StyledPaper>
          <Typography variant="h6" gutterBottom color="primary">
            Current Health Status
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Height (cm)"
                value={formData.current_health_status.height_cm}
                onChange={(e) => handleInputChange('current_health_status', 'height_cm', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Weight (kg)"
                value={formData.current_health_status.weight_kg}
                onChange={(e) => handleInputChange('current_health_status', 'weight_kg', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Blood Pressure"
                placeholder="120/80"
                value={formData.current_health_status.blood_pressure}
                onChange={(e) => handleInputChange('current_health_status', 'blood_pressure', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Heart Rate (bpm)"
                value={formData.current_health_status.heart_rate}
                onChange={(e) => handleInputChange('current_health_status', 'heart_rate', e.target.value)}
              />
            </Grid>
          </Grid>
        </StyledPaper>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={<SaveIcon />}
          >
            Save Patient History
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Patient history saved successfully!
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default AddPatientForm; 