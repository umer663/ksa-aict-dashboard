import { useState, useEffect, useRef } from 'react';
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
  Dialog,
  CircularProgress,
  TextField,
} from '@mui/material';
import {
  Visibility,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import PatientForm from '../../components/AddPatientForm';
import DeleteConfirmationDialog from '../../components/DeleteConfirmationDialog';
import { PatientData } from '../../models/types';
import { useOutletContext } from 'react-router-dom';
import { fetchAllPatients, deletePatientById } from '../../services/authService';
import PatientPrintRecord from '../../components/PatientPrintRecord';

const PatientHistory = () => {
  const { user } = useOutletContext<{ user: { email: string; role: string } }>();
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [editingPatient, setEditingPatient] = useState<PatientData | null>(null);
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
  const printRef = useRef<HTMLDivElement>(null);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const getPatients = async () => {
      try {
        const allPatients = await fetchAllPatients();
        setPatients(allPatients);
      } catch (error) {
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    getPatients();
  }, [user]);

  const handleSaveEdit = async (updatedPatient: PatientData): Promise<void> => {
    try {
      const updatedPatients = patients.map((patient) =>
        patient.patient_id === updatedPatient.patient_id ? updatedPatient : patient
      );
      setPatients(updatedPatients);
      
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
    setPrintDialogOpen(true);
  };

  const handleDeleteClick = (patient: PatientData) => {
    setPatientToDelete(patient);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!patientToDelete) return;

      // Delete from Firestore
      await deletePatientById(patientToDelete.patient_id);

      // Filter out the patient to delete locally
      const updatedPatients = patients.filter(
        (p: PatientData) => p.patient_id !== patientToDelete.patient_id
      );
      setPatients(updatedPatients);
      setSnackbar({
        open: true,
        message: 'Patient record deleted successfully',
        severity: 'success',
      });
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

  const filteredPatients = patients.filter((patient) => {
    const name = `${patient.personal_info?.first_name || ''} ${patient.personal_info?.last_name || ''}`.toLowerCase();
    const id = patient.patient_id?.toLowerCase() || '';
    return (
      name.includes(search.toLowerCase()) ||
      id.includes(search.toLowerCase())
    );
  });

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

      <Box sx={{ mb: 3, maxWidth: 400 }}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Search by name or patient ID"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </Box>

      {selectedPatient ? (
        <>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => setSelectedPatient(null)}
            >
              Back to List
            </Button>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={() => handlePrint(selectedPatient)}
            >
              Print Record
            </Button>
          </Box>
          <PatientForm patient={selectedPatient} mode="view" onSave={async () => {}} saving={false} />
        </>
      ) : (
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          sx={{ borderRadius: 2 }}
        >
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {filteredPatients.length === 0 ? (
                <ListItem>
                  <ListItemText
                    primary={<Typography variant="body1" color="text.secondary">No data found.</Typography>}
                  />
                </ListItem>
              ) : (
                filteredPatients.map((patient: PatientData, index: number) => (
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
                              {patient.personal_info?.first_name || 'Unknown'} {patient.personal_info?.last_name || ''}
                            </Typography>
                          </Box>
                        }
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
                ))
              )}
            </List>
          )}
        </Paper>
      )}

      {editingPatient && (
        <PatientForm
          patient={editingPatient}
          mode="edit"
          onSave={async (updatedPatient) => {
            await handleSaveEdit(updatedPatient);
            setEditingPatient(null);
          }}
          saving={false}
          onClose={() => setEditingPatient(null)}
        />
      )}

      {printingPatient && (
        <Dialog open={printDialogOpen} onClose={() => setPrintDialogOpen(false)} maxWidth="md" fullWidth>
          <Box sx={{ p: 2, bgcolor: 'white' }}>
            <PatientPrintRecord patient={printingPatient} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" color="primary" onClick={() => {
                setTimeout(() => {
                  window.print();
                }, 100);
              }}>Print</Button>
              <Button variant="outlined" sx={{ ml: 2 }} onClick={() => setPrintDialogOpen(false)}>Close</Button>
            </Box>
          </Box>
        </Dialog>
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