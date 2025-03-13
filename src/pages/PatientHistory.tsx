import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Divider,
  Tooltip,
  Chip,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Visibility,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import PatientHistoryForm from '../components/PatientHistoryForm';
import EditPatientModal from '../components/EditPatientModal';
import PrintModal from '../components/PrintModal';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';
import { PatientData } from '../models/types';

const PatientHistory = () => {
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [editingPatient, setEditingPatient] = useState<PatientData | null>(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [printingPatient, setPrintingPatient] = useState<PatientData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<PatientData | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const storedPatients = JSON.parse(localStorage.getItem('patients') || '[]');
    setPatients(storedPatients);
  }, []);

  const handleSaveEdit = async (updatedPatient: PatientData): Promise<void> => {
    try {
      const updatedPatients = patients.map((patient) =>
        patient.patient_id === updatedPatient.patient_id ? updatedPatient : patient
      );
      setPatients(updatedPatients);
      localStorage.setItem('patients', JSON.stringify(updatedPatients));
      
      // If the patient being viewed is the one being edited, update the view
      if (selectedPatient?.patient_id === updatedPatient.patient_id) {
        setSelectedPatient(updatedPatient);
      }
    } catch (error) {
      throw new Error('Failed to save patient data');
    }
  };

  const handlePrint = (patient: PatientData) => {
    setPrintingPatient(patient);
    setPrintModalOpen(true);
  };

  const handleDeleteClick = (patient: PatientData) => {
    setPatientToDelete(patient);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    try {
      if (!patientToDelete) return;

      // Get current patients from localStorage
      const currentPatients = JSON.parse(localStorage.getItem('patients') || '[]');
      
      // Filter out the patient to delete
      const updatedPatients = currentPatients.filter(
        (p: PatientData) => p.patient_id !== patientToDelete.patient_id
      );
      
      // Update localStorage
      localStorage.setItem('patients', JSON.stringify(updatedPatients));
      
      // Update state
      setPatients(updatedPatients);
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Patient record deleted successfully',
        severity: 'success',
      });

      // If the deleted patient was selected, clear the selection
      if (selectedPatient?.patient_id === patientToDelete.patient_id) {
        setSelectedPatient(null);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error deleting patient record',
        severity: 'error',
      });
    } finally {
      setDeleteDialogOpen(false);
      setPatientToDelete(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          mb: 4,
          color: 'primary.main',
          fontWeight: 500,
        }}
      >
        Patient History
      </Typography>

      {selectedPatient ? (
        <>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
            <IconButton onClick={() => setSelectedPatient(null)}>
              Back to List
            </IconButton>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={() => handlePrint(selectedPatient)}
            >
              Print Record
            </Button>
          </Box>
          <PatientHistoryForm patientData={selectedPatient} />
        </>
      ) : (
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          sx={{ borderRadius: 2 }}
        >
          <List>
            {patients.map((patient: PatientData, index: number) => (
              <motion.div
                key={patient.patient_id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1">
                          {patient.personal_info.first_name} {patient.personal_info.last_name}
                        </Typography>
                        {patient.last_modified && (
                          <Chip
                            label="Edited"
                            size="small"
                            color="info"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    }
                    secondary={`Patient ID: ${patient.patient_id}`}
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="View Details">
                      <IconButton
                        edge="end"
                        onClick={() => setSelectedPatient(patient)}
                        sx={{ mr: 1 }}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Print Record">
                      <IconButton
                        edge="end"
                        onClick={() => handlePrint(patient)}
                        sx={{ mr: 1 }}
                      >
                        <PrintIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Patient">
                      <IconButton
                        edge="end"
                        onClick={() => setEditingPatient(patient)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Patient">
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteClick(patient)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              </motion.div>
            ))}
          </List>
        </Paper>
      )}

      {editingPatient && (
        <EditPatientModal
          open={Boolean(editingPatient)}
          onClose={() => setEditingPatient(null)}
          patient={editingPatient}
          onSave={handleSaveEdit}
        />
      )}

      {printingPatient && (
        <PrintModal
          open={printModalOpen}
          onClose={() => {
            setPrintModalOpen(false);
            setPrintingPatient(null);
          }}
          patient={printingPatient}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {patientToDelete && (
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setPatientToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          patientName={`${patientToDelete.personal_info.first_name} ${patientToDelete.personal_info.last_name}`}
          patientId={patientToDelete.patient_id}
        />
      )}

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PatientHistory; 