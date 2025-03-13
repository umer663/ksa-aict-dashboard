import { forwardRef } from 'react';
import {
  Box,
  Typography,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const PrintContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#fff',
  '@media print': {
    padding: '20px',
    backgroundColor: '#fff',
  },
}));

const PrintHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  textAlign: 'center',
  '@media print': {
    marginBottom: '20px',
  },
}));

const Section = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  pageBreakInside: 'avoid',
  '@media print': {
    marginBottom: '20px',
  },
}));

interface PrintablePatientRecordProps {
  patient: any;
}

const PrintablePatientRecord = forwardRef<HTMLDivElement, PrintablePatientRecordProps>(
  ({ patient }, ref) => {
    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString();
    };

    return (
      <PrintContainer ref={ref}>
        <PrintHeader>
          <Typography variant="h4" gutterBottom>
            Patient Medical Record
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Generated on: {new Date().toLocaleString()}
          </Typography>
        </PrintHeader>

        <Section>
          <Typography variant="h6" gutterBottom color="primary">
            Personal Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography><strong>Patient ID:</strong> {patient.patient_id}</Typography>
              <Typography><strong>Name:</strong> {patient.personal_info.first_name} {patient.personal_info.last_name}</Typography>
              <Typography><strong>Date of Birth:</strong> {formatDate(patient.personal_info.date_of_birth)}</Typography>
              <Typography><strong>Gender:</strong> {patient.personal_info.gender}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography><strong>Contact:</strong> {patient.personal_info.contact_number}</Typography>
              <Typography><strong>Email:</strong> {patient.personal_info.email}</Typography>
              <Typography><strong>Address:</strong> {`${patient.personal_info.address.street}, ${patient.personal_info.address.city}, ${patient.personal_info.address.state} ${patient.personal_info.address.postal_code}`}</Typography>
            </Grid>
          </Grid>
        </Section>

        <Divider sx={{ my: 3 }} />

        <Section>
          <Typography variant="h6" gutterBottom color="primary">
            Medical History
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom><strong>Chronic Diseases:</strong></Typography>
              <Paper variant="outlined" sx={{ p: 1 }}>
                {patient.medical_history.chronic_diseases.map((disease: string, index: number) => (
                  <Typography key={index} component="div">• {disease}</Typography>
                ))}
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom><strong>Allergies:</strong></Typography>
              <Paper variant="outlined" sx={{ p: 1 }}>
                {patient.medical_history.allergies.map((allergy: string, index: number) => (
                  <Typography key={index} component="div">• {allergy}</Typography>
                ))}
              </Paper>
            </Grid>
          </Grid>
        </Section>

        <Section>
          <Typography variant="subtitle1" gutterBottom><strong>Medications:</strong></Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><strong>Medication</strong></TableCell>
                <TableCell><strong>Dosage</strong></TableCell>
                <TableCell><strong>Frequency</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patient.medical_history.medications.map((medication: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{medication.medication_name}</TableCell>
                  <TableCell>{medication.dosage}</TableCell>
                  <TableCell>{medication.frequency}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>

        <Divider sx={{ my: 3 }} />

        <Section>
          <Typography variant="h6" gutterBottom color="primary">
            Current Health Status
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Typography><strong>Height:</strong> {patient.current_health_status.height_cm} cm</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography><strong>Weight:</strong> {patient.current_health_status.weight_kg} kg</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography><strong>Blood Pressure:</strong> {patient.current_health_status.blood_pressure}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography><strong>Heart Rate:</strong> {patient.current_health_status.heart_rate} bpm</Typography>
            </Grid>
          </Grid>
        </Section>

        <Section>
          <Typography variant="h6" gutterBottom color="primary">
            Doctor's Notes
          </Typography>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography>{patient.doctor_notes}</Typography>
          </Paper>
        </Section>

        <Box sx={{ mt: 4, textAlign: 'center', '@media print': { display: 'none' } }}>
          <Typography variant="caption" color="textSecondary">
            End of Medical Record
          </Typography>
        </Box>
      </PrintContainer>
    );
  }
);

export default PrintablePatientRecord; 