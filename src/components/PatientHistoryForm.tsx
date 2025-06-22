import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Stack,
  Avatar,
} from '@mui/material';
import {
  Person,
  LocalHospital,
  Favorite,
  AccessTime,
  Note,
  Height,
  MonitorWeight,
  Favorite as HeartIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import ContactInfoCard from './ContactInfoCard';
import { PatientData, PatientHistoryProps } from '../models/types';

const SectionTitle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const InfoChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  '& .MuiChip-label': {
    fontWeight: 500,
  },
}));

const AnimatedTypography = styled(Typography)({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontWeight: 500,
  cursor: 'default',
  fontSize: '0.8rem',
});

const MotionBox = motion(Box);
const MotionTypography = motion(AnimatedTypography);
const MotionPaper = motion(StyledPaper);

// Default data
const defaultPatientData: PatientData = {
  patient_id: "N/A",
  personal_info: {
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    contact_number: "",
    email: "",
    address: {
      street: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
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
    exercise_frequency: "",
    dietary_habits: "",
  },
  current_health_status: {
    height_cm: 0,
    weight_kg: 0,
    blood_pressure: "",
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
  therapist_name: "",
  date_of_visit: "",
};

const PatientHistoryForm = ({ patientData = defaultPatientData }: PatientHistoryProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // Helper function to render bullet points
  const renderBulletPoints = (items: string[]) => {
    if (!items || items.length === 0) {
      return <Typography variant="body2" color="text.secondary">No data available</Typography>;
    }
    return (
      <Box component="ul" sx={{ pl: 2, m: 0 }}>
        {items.map((item, index) => (
          <Typography key={index} component="li" variant="body2" sx={{ mb: 1 }}>
            {item}
          </Typography>
        ))}
      </Box>
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Therapist Information */}
      <MotionPaper variants={itemVariants}>
        <SectionTitle variant="h5">
          <Person color="primary" /> Therapist Information
        </SectionTitle>
        <Typography variant="h6" color="primary">
          {patientData.therapist_name || 'Not specified'}
        </Typography>
      </MotionPaper>

      {/* Personal Information */}
      <MotionPaper variants={itemVariants}>
        <SectionTitle variant="h5">
          <Person color="primary" /> Personal Information
        </SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
                    {patientData.personal_info.first_name[0]}
                    {patientData.personal_info.last_name[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {patientData.personal_info.first_name} {patientData.personal_info.last_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Patient ID: {patientData.patient_id}
                    </Typography>
                  </Box>
                </Stack>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Date of Birth
                    </Typography>
                    <Typography variant="body1">
                      {new Date(patientData.personal_info.date_of_birth).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Gender
                    </Typography>
                    <Typography variant="body1">
                      {patientData.personal_info.gender}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <ContactInfoCard contactInfo={patientData.personal_info} />
          </Grid>
        </Grid>
      </MotionPaper>

      {/* Current Health Status */}
      <MotionPaper variants={itemVariants}>
        <SectionTitle variant="h5">
          <Favorite color="primary" /> Current Health Status
        </SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Height
                </Typography>
                <Typography variant="h6">
                  {patientData.current_health_status.height_cm} cm
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Weight
                </Typography>
                <Typography variant="h6">
                  {patientData.current_health_status.weight_kg} kg
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Blood Pressure
                </Typography>
                <Typography variant="h6">
                  {patientData.current_health_status.blood_pressure}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Heart Rate
                </Typography>
                <Typography variant="h6">
                  {patientData.current_health_status.heart_rate} bpm
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </MotionPaper>

      {/* Medical History */}
      {patientData.medical_history && (
        <MotionPaper variants={itemVariants}>
          <SectionTitle variant="h5">
            <LocalHospital color="primary" /> Medical History
          </SectionTitle>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Chronic Diseases
              </Typography>
              <Box>
                {patientData.medical_history.chronic_diseases.map((disease: string) => (
                  <InfoChip
                    key={disease}
                    label={disease}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Allergies
              </Typography>
              <Box>
                {patientData.medical_history.allergies.map((allergy: string) => (
                  <InfoChip
                    key={allergy}
                    label={allergy}
                    color="error"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>
          </Grid>

          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Current Medications
            </Typography>
            <Box>
              {Array.isArray(patientData.medical_history.medications) ? (
                patientData.medical_history.medications.map((medication: any, index: number) => (
                  <InfoChip
                    key={index}
                    label={typeof medication === 'string' ? medication : medication.medication_name}
                    color="info"
                    variant="outlined"
                    sx={{ m: 0.5 }}
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">No medications listed</Typography>
              )}
            </Box>
          </Box>
        </MotionPaper>
      )}

      {/* Presenting Complains */}
      <MotionPaper variants={itemVariants}>
        <SectionTitle variant="h5">
          <Note color="primary" /> Presenting Complains
        </SectionTitle>
        {renderBulletPoints(patientData.presenting_complains)}
      </MotionPaper>

      {/* History of Presenting Complains */}
      <MotionPaper variants={itemVariants}>
        <SectionTitle variant="h5">
          <Note color="primary" /> History of Presenting Complains
        </SectionTitle>
        {renderBulletPoints(patientData.history_of_presenting_complains)}
      </MotionPaper>

      {/* Family Medical History */}
      <MotionPaper variants={itemVariants}>
        <SectionTitle variant="h5">
          <Note color="primary" /> Family Medical History
        </SectionTitle>
        {renderBulletPoints(patientData.family_medical_history)}
      </MotionPaper>

      {/* Diagnosis */}
      <MotionPaper variants={itemVariants}>
        <SectionTitle variant="h5">
          <LocalHospital color="primary" /> Diagnosis
        </SectionTitle>
        {renderBulletPoints(patientData.diagnosis)}
      </MotionPaper>

      {/* Doctor's Notes */}
      <MotionPaper variants={itemVariants}>
        <SectionTitle variant="h5">
          <Note color="primary" /> Doctor's Notes
        </SectionTitle>
        {renderBulletPoints(patientData.doctor_notes)}
      </MotionPaper>

      {/* Treatment Plan */}
      <MotionPaper variants={itemVariants}>
        <SectionTitle variant="h5">
          <LocalHospital color="primary" /> Treatment Plan
        </SectionTitle>
        {renderBulletPoints(patientData.treatment_plan)}
      </MotionPaper>

      {/* Follow Up Plans */}
      <MotionPaper variants={itemVariants}>
        <SectionTitle variant="h5">
          <AccessTime color="primary" /> Follow Up Plans
        </SectionTitle>
        {renderBulletPoints(patientData.follow_up_plans)}
      </MotionPaper>

      {/* Visit Information */}
      <MotionPaper variants={itemVariants}>
        <SectionTitle variant="h5">
          <AccessTime color="primary" /> Visit Information
        </SectionTitle>
        <Typography variant="body2" color="text.secondary">
          Date of Visit: {new Date(patientData.date_of_visit).toLocaleString()}
        </Typography>
      </MotionPaper>
    </motion.div>
  );
};

export default PatientHistoryForm; 