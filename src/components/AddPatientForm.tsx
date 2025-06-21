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
  FormHelperText,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Add as AddIcon, Save as SaveIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { PatientData } from '../models/types';

// Styled component for consistent paper styling throughout the form
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

// Type definition for form data excluding patient_id which is generated on submission
type FormDataType = Omit<PatientData, 'patient_id'>;

// Validation patterns for form fields
const PATTERNS = {
  // Allows only letters, spaces, and hyphens for names
  NAME: /^[A-Za-z\s-]+$/,
  // Standard email validation pattern
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  // Validates phone numbers in various formats
  PHONE: /^(\+\d{1,3}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
  // Validates postal/zip codes (supports various formats)
  POSTAL_CODE: /^[A-Za-z0-9\s-]{3,10}$/,
};

const AddPatientForm = () => {
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [diseases, setDiseases] = useState<string[]>([]);
  const [newDisease, setNewDisease] = useState('');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState('');

  // State to track validation errors for each field
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // State to track if form has been submitted (for validation display)
  const [submitted, setSubmitted] = useState(false);

  // Initialize form data with default values
  const [formData, setFormData] = useState<FormDataType>({
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
      chronic_diseases: [],
      previous_surgeries: [],
      medications: [],
      allergies: [],
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
    doctor_notes: [],
    presenting_complains: [],
    history_of_presenting_complains: [],
    family_medical_history: [],
    diagnosis: [],
    treatment_plan: [],
    follow_up_plans: [],
    therapist_name: '',
    date_of_visit: new Date().toISOString(),
  });

  // Validate a specific field and return error message if invalid
  const validateField = (field: string, value: any): string => {
    // Skip validation for empty optional fields
    if (value === '' && !['first_name', 'last_name', 'date_of_birth', 'gender', 'email'].includes(field)) {
      return '';
    }

    switch (field) {
      case 'first_name':
      case 'last_name':
        if (!value) return 'This field is required';
        if (value.length < 2) return 'Must be at least 2 characters';
        if (value.length > 50) return 'Must be less than 50 characters';
        if (!PATTERNS.NAME.test(value)) return 'Only letters, spaces, and hyphens allowed';
        return '';
      
      case 'date_of_birth':
        if (!value) return 'Date of birth is required';
        const dob = new Date(value);
        const today = new Date();
        if (dob > today) return 'Date cannot be in the future';
        if (today.getFullYear() - dob.getFullYear() > 120) return 'Age cannot exceed 120 years';
        return '';
      
      case 'gender':
        if (!value) return 'Gender is required';
        return '';
      
      case 'email':
        if (!value) return 'Email is required';
        if (!PATTERNS.EMAIL.test(value)) return 'Invalid email format';
        return '';
      
      case 'contact_number':
        if (value && !PATTERNS.PHONE.test(value)) return 'Invalid phone number format';
        return '';
      
      case 'street':
        if (value && value.length < 3) return 'Must be at least 3 characters';
        return '';
      
      case 'city':
      case 'state':
      case 'country':
        if (value && !PATTERNS.NAME.test(value)) return 'Only letters, spaces, and hyphens allowed';
        return '';
      
      case 'postal_code':
        if (value && !PATTERNS.POSTAL_CODE.test(value)) return 'Invalid postal code format';
        return '';
      
      case 'height_cm':
        if (value && (isNaN(value) || value <= 0 || value > 300)) return 'Height must be between 1-300 cm';
        return '';
      
      case 'weight_kg':
        if (value && (isNaN(value) || value <= 0 || value > 500)) return 'Weight must be between 1-500 kg';
        return '';
      
      case 'blood_pressure':
        if (value && !/^\d{2,3}\/\d{2,3}$/.test(value)) return 'Format should be systolic/diastolic (e.g., 120/80)';
        return '';
      
      case 'heart_rate':
        if (value && (isNaN(value) || value < 30 || value > 250)) return 'Heart rate must be between 30-250 bpm';
        return '';
      
      default:
        return '';
    }
  };

  // Update form data and validate the field
  const handleInputChange = (
    section: keyof FormDataType,
    field: string,
    value: any
  ) => {
    // Validate the field
    const errorMessage = validateField(field, value);
    
    // Update errors state
    setErrors(prev => ({
      ...prev,
      [`${section}.${field}`]: errorMessage
    }));
    
    // Update form data based on section
    setFormData((prev: FormDataType) => {
      if (section === 'personal_info') {
        return {
          ...prev,
          personal_info: {
            ...prev.personal_info,
            [field]: value
          }
        };
      }
      if (section === 'medical_history') {
        return {
          ...prev,
          medical_history: {
            ...prev.medical_history,
            [field]: value
          }
        };
      }
      if (section === 'lifestyle') {
        return {
          ...prev,
          lifestyle: {
            ...prev.lifestyle,
            [field]: value
          }
        };
      }
      if (section === 'current_health_status') {
        return {
          ...prev,
          current_health_status: {
            ...prev.current_health_status,
            [field]: value
          }
        };
      }
      // For simple string fields like doctor_notes, presenting_complains, etc.
      return {
        ...prev,
        [section]: value
      };
    });
  };

  // Handle address field changes and validation
  const handleAddressChange = (field: string, value: string) => {
    // Validate the address field
    const errorMessage = validateField(field, value);
    
    // Update errors state
    setErrors(prev => ({
      ...prev,
      [`personal_info.address.${field}`]: errorMessage
    }));
    
    // Update form data
    setFormData((prev: FormDataType) => ({
      ...prev,
      personal_info: {
        ...prev.personal_info,
        address: {
          ...prev.personal_info.address,
          [field]: value
        }
      }
    }));
  };

  // Add a new disease to the list
  const handleAddDisease = () => {
    if (newDisease && !diseases.includes(newDisease)) {
      const updatedDiseases = [...diseases, newDisease];
      setDiseases(updatedDiseases);
      setFormData((prev: FormDataType) => ({
        ...prev,
        medical_history: {
          ...prev.medical_history,
          chronic_diseases: updatedDiseases
        }
      }));
      setNewDisease('');
    }
  };

  // Add a new allergy to the list
  const handleAddAllergy = () => {
    if (newAllergy && !allergies.includes(newAllergy)) {
      const updatedAllergies = [...allergies, newAllergy];
      setAllergies(updatedAllergies);
      setFormData((prev: FormDataType) => ({
        ...prev,
        medical_history: {
          ...prev.medical_history,
          allergies: updatedAllergies
        }
      }));
      setNewAllergy('');
    }
  };

  // Handle text area changes for bullet point fields
  const handleTextAreaChange = (field: keyof FormDataType, value: string) => {
    // Split by newlines and filter out empty lines
    const bulletPoints = value.split('\n').filter(line => line.trim() !== '');
    
    setFormData(prev => ({
      ...prev,
      [field]: bulletPoints
    }));
  };

  // Convert array to display text for text areas
  const getDisplayText = (field: keyof FormDataType): string => {
    const value = formData[field];
    if (Array.isArray(value)) {
      return value.join('\n');
    }
    return '';
  };

  // Validate all form fields before submission
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate personal info fields
    newErrors['personal_info.first_name'] = validateField('first_name', formData.personal_info.first_name);
    newErrors['personal_info.last_name'] = validateField('last_name', formData.personal_info.last_name);
    newErrors['personal_info.date_of_birth'] = validateField('date_of_birth', formData.personal_info.date_of_birth);
    newErrors['personal_info.gender'] = validateField('gender', formData.personal_info.gender);
    newErrors['personal_info.email'] = validateField('email', formData.personal_info.email);
    newErrors['personal_info.contact_number'] = validateField('contact_number', formData.personal_info.contact_number);
    
    // Validate address fields
    newErrors['personal_info.address.street'] = validateField('street', formData.personal_info.address.street);
    newErrors['personal_info.address.city'] = validateField('city', formData.personal_info.address.city);
    newErrors['personal_info.address.state'] = validateField('state', formData.personal_info.address.state);
    newErrors['personal_info.address.postal_code'] = validateField('postal_code', formData.personal_info.address.postal_code);
    newErrors['personal_info.address.country'] = validateField('country', formData.personal_info.address.country);
    
    // Validate health status fields
    newErrors['current_health_status.height_cm'] = validateField('height_cm', formData.current_health_status.height_cm);
    newErrors['current_health_status.weight_kg'] = validateField('weight_kg', formData.current_health_status.weight_kg);
    newErrors['current_health_status.blood_pressure'] = validateField('blood_pressure', formData.current_health_status.blood_pressure);
    newErrors['current_health_status.heart_rate'] = validateField('heart_rate', formData.current_health_status.heart_rate);
    
    // Update errors state
    setErrors(newErrors);
    
    // Check if there are any errors
    return !Object.values(newErrors).some(error => error !== '');
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    setSubmitted(true); // Mark form as submitted for validation display
    
    // Validate all fields
    const isValid = validateForm();
    
    if (!isValid) {
      // Scroll to the first error
      const firstErrorField = document.querySelector('.Mui-error');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    try {
      // Create new patient with generated ID
      const newPatient: PatientData = {
        patient_id: `PAT${Date.now()}`, // Generate unique ID based on timestamp
        personal_info: {
          ...formData.personal_info,
        },
        medical_history: {
          ...formData.medical_history,
          chronic_diseases: diseases,
          allergies: allergies,
        },
        lifestyle: formData.lifestyle,
        current_health_status: formData.current_health_status,
        doctor_notes: formData.doctor_notes,
        presenting_complains: formData.presenting_complains,
        history_of_presenting_complains: formData.history_of_presenting_complains,
        family_medical_history: formData.family_medical_history,
        diagnosis: formData.diagnosis,
        treatment_plan: formData.treatment_plan,
        follow_up_plans: formData.follow_up_plans,
        therapist_name: formData.therapist_name,
        date_of_visit: formData.date_of_visit,
      };

    // Get existing patients from localStorage
    const existingPatients = JSON.parse(localStorage.getItem('patients') || '[]');
    
      // Add new patient
      const updatedPatients = [...existingPatients, newPatient];
    
    // Save to localStorage
      localStorage.setItem('patients', JSON.stringify(updatedPatients));
    
      // Show success message
    setOpenSnackbar(true);
      
      // Navigate after a short delay to ensure data is saved
    setTimeout(() => {
      navigate('/patient-history');
      }, 1500);
    } catch (error) {
      console.error('Error saving patient:', error);
      setOpenSnackbar(false);
    }
  };

  // Helper function to check if a field has an error
  const hasError = (path: string): boolean => {
    return submitted && !!errors[path];
  };

  // Helper function to get error message for a field
  const getErrorMessage = (path: string): string => {
    return submitted ? errors[path] || '' : '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
      >
        {/* Therapist Name Section */}
        <StyledPaper>
          <Typography variant="h6" gutterBottom color="primary">
            Therapist Name
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                  required
                fullWidth
                // label="Therapist Name"
                value={formData.therapist_name}
                onChange={(e) => handleInputChange('therapist_name', '', e.target.value)}
                placeholder="Enter therapist name"
                error={hasError('therapist_name')}
                helperText={getErrorMessage('therapist_name')}
                inputProps={{ maxLength: 100 }}
              />
            </Grid>
          </Grid>
        </StyledPaper>

        {/* Contact Information Section */}
        <StyledPaper>
          <Typography variant="h6" gutterBottom color="primary">
            Contact Information
          </Typography>
          <Grid container spacing={3}>
            {/* Phone Number Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Contact Number"
                value={formData.personal_info.contact_number}
                onChange={(e) => handleInputChange('personal_info', 'contact_number', e.target.value)}
                placeholder="e.g., +1 234-567-8900"
                error={hasError('personal_info.contact_number')}
                helperText={getErrorMessage('personal_info.contact_number')}
              />
            </Grid>
            {/* Email Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="email"
                label="Email Address"
                value={formData.personal_info.email}
                onChange={(e) => handleInputChange('personal_info', 'email', e.target.value)}
                placeholder="example@email.com"
                error={hasError('personal_info.email')}
                helperText={getErrorMessage('personal_info.email')}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="primary" sx={{ mb: 2 }}>
                Address Information
              </Typography>
            </Grid>

            {/* Street Address Field */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Street Address"
                value={formData.personal_info.address.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                placeholder="123 Main Street"
                error={hasError('personal_info.address.street')}
                helperText={getErrorMessage('personal_info.address.street')}
              />
            </Grid>
            {/* City Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="City"
                value={formData.personal_info.address.city}
                onChange={(e) => handleAddressChange('city', e.target.value)}
                error={hasError('personal_info.address.city')}
                helperText={getErrorMessage('personal_info.address.city')}
              />
            </Grid>
            {/* State/Province Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="State/Province"
                value={formData.personal_info.address.state}
                onChange={(e) => handleAddressChange('state', e.target.value)}
                error={hasError('personal_info.address.state')}
                helperText={getErrorMessage('personal_info.address.state')}
              />
            </Grid>
            {/* Postal Code Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Postal Code"
                value={formData.personal_info.address.postal_code}
                onChange={(e) => handleAddressChange('postal_code', e.target.value)}
                error={hasError('personal_info.address.postal_code')}
                helperText={getErrorMessage('personal_info.address.postal_code')}
              />
            </Grid>
            {/* Country Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Country"
                value={formData.personal_info.address.country}
                onChange={(e) => handleAddressChange('country', e.target.value)}
                error={hasError('personal_info.address.country')}
                helperText={getErrorMessage('personal_info.address.country')}
              />
            </Grid>
          </Grid>
        </StyledPaper>

        {/* Current Health Status Section */}
        <StyledPaper>
          <Typography variant="h6" gutterBottom color="primary">
            Current Health Status
          </Typography>
          <Grid container spacing={3}>
            {/* Height Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Height (cm)"
                value={formData.current_health_status.height_cm || ''}
                onChange={(e) => handleInputChange('current_health_status', 'height_cm', Number(e.target.value))}
                error={hasError('current_health_status.height_cm')}
                helperText={getErrorMessage('current_health_status.height_cm')}
                inputProps={{ min: 1, max: 300 }}
              />
            </Grid>
            {/* Weight Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Weight (kg)"
                value={formData.current_health_status.weight_kg || ''}
                onChange={(e) => handleInputChange('current_health_status', 'weight_kg', Number(e.target.value))}
                error={hasError('current_health_status.weight_kg')}
                helperText={getErrorMessage('current_health_status.weight_kg')}
                inputProps={{ min: 1, max: 500 }}
              />
            </Grid>
            {/* Blood Pressure Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Blood Pressure"
                placeholder="120/80"
                value={formData.current_health_status.blood_pressure}
                onChange={(e) => handleInputChange('current_health_status', 'blood_pressure', e.target.value)}
                error={hasError('current_health_status.blood_pressure')}
                helperText={getErrorMessage('current_health_status.blood_pressure') || 'Format: systolic/diastolic (e.g., 120/80)'}
              />
            </Grid>
            {/* Heart Rate Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Heart Rate (bpm)"
                value={formData.current_health_status.heart_rate || ''}
                onChange={(e) => handleInputChange('current_health_status', 'heart_rate', Number(e.target.value))}
                error={hasError('current_health_status.heart_rate')}
                helperText={getErrorMessage('current_health_status.heart_rate')}
                inputProps={{ min: 30, max: 250 }}
              />
            </Grid>
          </Grid>
        </StyledPaper>

        {/* Medical History Section */}
        <StyledPaper>
          <Typography variant="h6" gutterBottom color="primary">
            Medical History
          </Typography>
          <Grid container spacing={3}>
            {/* Chronic Diseases Input */}
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  fullWidth
                  // label="Add Chronic Disease"
                  value={newDisease}
                  onChange={(e) => setNewDisease(e.target.value)}
                />
                <Button
                  variant="contained"
                  onClick={handleAddDisease}
                  startIcon={<AddIcon />}
                  disabled={!newDisease}
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
            
            {/* Medications Input */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="primary" sx={{ mb: 2 }}>
                Current Medications
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  fullWidth
                  // label="Add Medication"
                  value={formData.medical_history.medications.join(', ')}
                  onChange={(e) => handleInputChange('medical_history', 'medications', e.target.value.split(',').map(item => item.trim()))}
                  placeholder="Enter medications separated by commas"
                  multiline
                  rows={2}
                  helperText="Enter each medication separated by a comma (e.g., Aspirin, Insulin, etc.)"
                />
              </Stack>
            </Grid>
            
            {/* Allergies Input */}
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
                  disabled={!newAllergy}
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
        </StyledPaper>

        {/* Form Submission Button */}
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

      {/* Success Notification */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1500}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Patient history saved successfully!
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default AddPatientForm; 