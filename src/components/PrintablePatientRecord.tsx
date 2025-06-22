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

    // Helper function to render bullet points from array
    const renderBulletPoints = (items: string[] | undefined, fieldName: string) => {
      if (!items || items.length === 0) {
        return (
          <Paper variant="outlined" sx={{ p: 1 }}>
            <Typography color="textSecondary">No {fieldName} recorded</Typography>
          </Paper>
        );
      }
      
      return (
        <Paper variant="outlined" sx={{ p: 1 }}>
          {items.map((item: string, index: number) => (
            <Typography key={index} component="div">• {item}</Typography>
          ))}
        </Paper>
      );
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
            Therapist Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography><strong>Therapist Name:</strong> {patient.therapist_name || 'Not specified'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography><strong>Date of Visit:</strong> {patient.date_of_visit ? formatDate(patient.date_of_visit) : 'Not specified'}</Typography>
            </Grid>
          </Grid>
        </Section>

        <Divider sx={{ my: 3 }} />

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

        <Divider sx={{ my: 3 }} />

        <Section>
          <Typography variant="h6" gutterBottom color="primary">
            Medical History
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom><strong>Chronic Diseases:</strong></Typography>
              <Paper variant="outlined" sx={{ p: 1 }}>
                {patient.medical_history.chronic_diseases && patient.medical_history.chronic_diseases.length > 0 ? (
                  patient.medical_history.chronic_diseases.map((disease: string, index: number) => (
                    <Typography key={index} component="div">• {disease}</Typography>
                  ))
                ) : (
                  <Typography color="textSecondary">No chronic diseases recorded</Typography>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom><strong>Allergies:</strong></Typography>
              <Paper variant="outlined" sx={{ p: 1 }}>
                {patient.medical_history.allergies && patient.medical_history.allergies.length > 0 ? (
                  patient.medical_history.allergies.map((allergy: string, index: number) => (
                    <Typography key={index} component="div">• {allergy}</Typography>
                  ))
                ) : (
                  <Typography color="textSecondary">No allergies recorded</Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Section>

        <Section>
          <Typography variant="subtitle1" gutterBottom><strong>Medications:</strong></Typography>
          {patient.medical_history.medications && patient.medical_history.medications.length > 0 ? (
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
          ) : (
            <Paper variant="outlined" sx={{ p: 1 }}>
              <Typography color="textSecondary">No medications recorded</Typography>
            </Paper>
          )}
        </Section>

        <Divider sx={{ my: 3 }} />

        <Section>
          <Typography variant="h6" gutterBottom color="primary">
            Clinical Assessment
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom><strong>Presenting Complains:</strong></Typography>
              {renderBulletPoints(patient.presenting_complains, 'presenting complains')}
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom><strong>History of Presenting Complains:</strong></Typography>
              {renderBulletPoints(patient.history_of_presenting_complains, 'history of presenting complains')}
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom><strong>Family Medical History:</strong></Typography>
              {renderBulletPoints(patient.family_medical_history, 'family medical history')}
            </Grid>
          </Grid>
        </Section>

        <Divider sx={{ my: 3 }} />

        <Section>
          <Typography variant="h6" gutterBottom color="primary">
            Clinical Notes
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom><strong>Diagnosis:</strong></Typography>
              {renderBulletPoints(patient.diagnosis, 'diagnosis')}
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom><strong>Treatment Plan:</strong></Typography>
              {renderBulletPoints(patient.treatment_plan, 'treatment plan')}
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom><strong>Follow Up Plans:</strong></Typography>
              {renderBulletPoints(patient.follow_up_plans, 'follow up plans')}
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom><strong>Doctor's Notes:</strong></Typography>
              {renderBulletPoints(patient.doctor_notes, 'doctor notes')}
            </Grid>
          </Grid>
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