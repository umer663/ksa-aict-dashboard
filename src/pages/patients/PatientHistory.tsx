import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  List,
  Paper,
  Button,
  Snackbar,
  Alert,
  Dialog,
  CircularProgress,
  TextField,
  IconButton,
} from '@mui/material';
import {
  Print as PrintIcon,
  ArrowBack as ArrowBackIcon,
  Visibility,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import PatientForm from '../../components/AddPatientForm';
import DeleteConfirmationDialog from '../../components/DeleteConfirmationDialog';
import { PatientData } from '../../models/types';
import { useOutletContext } from 'react-router-dom';
import { fetchAllPatients, deletePatientById, updatePatient, fetchAllDoctors } from '../../services/authService';
import PatientPrintRecord from '../../components/PatientPrintRecord';
import { useAppConfig } from '../../context/AppConfigContext';
import VisitForm from '../../components/VisitForm';
import { fetchVisits, createVisit } from '../../services/authService';

// Add the calculateAge function here
function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

const PatientHistory = () => {
  const { user } = useOutletContext<{ user: any }>();
  const appConfig = useAppConfig();
  const nonRemoveableUsers = appConfig?.nonRemoveableUsers || [];
  const isNonRemoveable = nonRemoveableUsers.includes(user.email);
  const canEdit = isNonRemoveable || user?.permissions?.['patient-history']?.update === true;
  const canDelete = isNonRemoveable || user?.permissions?.['patient-history']?.delete === true;
  const canCreate = isNonRemoveable || user?.permissions?.['patient-history']?.create === true;
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
  const [visits, setVisits] = useState<any[]>([]);
  const [visitFormOpen, setVisitFormOpen] = useState(false);
  const [visitLoading, setVisitLoading] = useState(false);
  const [visitError, setVisitError] = useState<string | null>(null);
  const [visitSuccess, setVisitSuccess] = useState<string | null>(null);
  const [doctorMap, setDoctorMap] = useState<{ [uid: string]: string }>({});

  useEffect(() => {
    const getPatients = async () => {
      try {
        const allPatients = await fetchAllPatients();
        let filteredPatients = allPatients;
        if (user?.role === 'Therapist' && user?.uid) {
          filteredPatients = allPatients.filter(
            (p) => Array.isArray(p.therapistIds) && p.therapistIds.includes(user.uid)
          );
        } else if (user?.role !== 'SuperAdmin' && user?.role !== 'Admin') {
          // Receptionists and others see no patients by default
          filteredPatients = [];
        }
        setPatients(filteredPatients);
      } catch (error) {
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    getPatients();
  }, [user]);

  useEffect(() => {
    // Fetch all doctors and build a map of uid to name
    fetchAllDoctors().then((doctors) => {
      const map: { [uid: string]: string } = {};
      doctors.forEach((doc: any) => {
        map[doc.uid] = doc.name;
      });
      setDoctorMap(map);
    });
  }, []);

  // Fetch visits when a patient is selected
  useEffect(() => {
    if (selectedPatient) {
      setVisitLoading(true);
      fetchVisits(selectedPatient.patient_id)
        .then(setVisits)
        .catch(() => setVisits([]))
        .finally(() => setVisitLoading(false));
    }
  }, [selectedPatient]);

  const handleSaveEdit = async (updatedPatient: PatientData): Promise<void> => {
    try {
      // Update in Firestore
      await updatePatient(updatedPatient.patient_id, updatedPatient);

      // Update local state
      const updatedPatients = patients.map((patient) =>
        patient.patient_id === updatedPatient.patient_id ? updatedPatient : patient
      );
      setPatients(updatedPatients);

      if (selectedPatient?.patient_id === updatedPatient.patient_id) {
        setSelectedPatient(updatedPatient);
      }
      setEditingPatient(null); // Close the dialog after save
      setSnackbar({
        open: true,
        message: 'Patient updated successfully!',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update patient in Firestore',
        severity: 'error',
      });
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

      await deletePatientById(patientToDelete.patient_id);

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

  const handleAddVisit = async (visitData: any) => {
    if (!selectedPatient) return;
    setVisitLoading(true);
    setVisitError(null);
    setVisitSuccess(null);
    try {
      await createVisit(selectedPatient.patient_id, visitData);
      // Add therapist UID to patient if not already present
      if (user?.role === 'Therapist' && user?.uid) {
        const therapistIds = Array.isArray(selectedPatient.therapistIds)
          ? Array.from(new Set([...selectedPatient.therapistIds, user.uid]))
          : [user.uid];
        if (
          !selectedPatient.therapistIds ||
          !selectedPatient.therapistIds.includes(user.uid)
        ) {
          await updatePatient(selectedPatient.patient_id, {
            ...selectedPatient,
            therapistIds,
          });
        }
      }
      setVisitSuccess('Visit added successfully!');
      const updatedVisits = await fetchVisits(selectedPatient.patient_id);
      setVisits(updatedVisits);
      setVisitFormOpen(false);
    } catch (err) {
      setVisitError('Failed to add visit');
    } finally {
      setVisitLoading(false);
    }
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

      {!selectedPatient ? (
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          sx={{ p: 3 }}
        >
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Search by name or patient ID"
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ mb: 3 }}
          />
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {filteredPatients.map((patient) => (
                <Paper key={patient.patient_id} sx={{ mb: 1, p: 1, display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ flex: 1, cursor: 'pointer' }} onClick={() => setSelectedPatient(patient)}>
                    <Typography variant="subtitle1">
                      {patient.personal_info.first_name} {patient.personal_info.last_name}
                    </Typography>
                  </Box>
                  <IconButton
                    edge="end"
                    aria-label="view"
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <Visibility />
                  </IconButton>
                  {canEdit && (
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => setEditingPatient(patient)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  {(canEdit || canDelete) && (
                    <IconButton
                      edge="end"
                      aria-label="print"
                      onClick={() => handlePrint(patient)}
                    >
                      <PrintIcon />
                    </IconButton>
                  )}
                  {canDelete && (
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      color="error"
                      onClick={() => handleDeleteClick(patient)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Paper>
              ))}
            </List>
          )}
        </Paper>
      ) : (
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
              onClick={() => setVisitFormOpen(true)}
            >
              Add New Visit
            </Button>
          </Box>
          {/* Patient Demographics */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Patient Information
            </Typography>
            <Typography><b>Name:</b> {selectedPatient.personal_info?.first_name || ''} {selectedPatient.personal_info?.last_name || ''}</Typography>
            <Typography><b>Date of Birth:</b> {selectedPatient.personal_info?.date_of_birth || ''}</Typography>
            <Typography>
              <b>Age:</b>{' '}
              {selectedPatient.personal_info?.date_of_birth
                ? calculateAge(selectedPatient.personal_info.date_of_birth)
                : ''}
            </Typography>
            <Typography><b>Gender:</b> {selectedPatient.personal_info?.gender || ''}</Typography>
            <Typography><b>Blood Group:</b> {selectedPatient.personal_info?.bloodType || ''}</Typography>
            <Typography><b>Contact:</b> {selectedPatient.personal_info?.contact_number || ''}</Typography>
            <Typography><b>Email:</b> {selectedPatient.personal_info?.email || ''}</Typography>
            <Typography><b>Address:</b> {selectedPatient.personal_info?.address?.street || ''}, {selectedPatient.personal_info?.address?.city || ''}, {selectedPatient.personal_info?.address?.country || ''}</Typography>
          </Paper>
          {/* Visit History */}
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Visit History</Typography>
          {visitLoading ? (
            <Typography>Loading visits...</Typography>
          ) : (
            (!visits || visits.length === 0) ? (
              <Typography>No visits found for this patient.</Typography>
            ) : (
              <List>
                {visits.map((visit, idx) => (
                  <Paper key={visit.id} sx={{ mb: 2, p: 2 }}>
                    <Typography variant="subtitle2">
                      {visit.visitDate || ''} — Doctor: {doctorMap[visit.doctorId] || visit.doctorId || ''}
                    </Typography>
                    {visit.followUpDate && (
                      <Typography variant="body2"><b>Follow-up Date:</b> {visit.followUpDate}</Typography>
                    )}
                    <Typography variant="body2"><b>Symptoms:</b> {visit.symptoms || ''}</Typography>
                    <Typography variant="body2"><b>Diagnosis:</b> {visit.diagnosis || ''}</Typography>
                    <Typography variant="body2"><b>Recommendations:</b> {visit.recommendations || ''}</Typography>
                    <Typography variant="body2"><b>Medications:</b> {Array.isArray(visit.medications) ? visit.medications.map((m: any) => `${m.name || m.medication_name || ''} (${m.dosage || ''}, ${m.frequency || ''})`).join(', ') : ''}</Typography>
                  </Paper>
                ))}
              </List>
            )
          )}
          {/* Visit Form Dialog */}
          <Dialog open={visitFormOpen} onClose={() => setVisitFormOpen(false)} maxWidth="md" fullWidth>
            <Box sx={{ position: 'relative' }}>
              <IconButton
                aria-label="Close Add Visit"
                onClick={() => setVisitFormOpen(false)}
                sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
              >
                &times;
              </IconButton>
              <VisitForm
                onSave={handleAddVisit}
                lastVisit={visits[0]}
                loading={visitLoading}
                error={visitError || undefined}
                success={visitSuccess || undefined}
                onClose={() => setVisitFormOpen(false)}
                user={user}
                canCreate={canCreate}
              />
            </Box>
          </Dialog>
        </>
      )}

      {/* Print Dialog */}
      <Dialog open={printDialogOpen} onClose={() => setPrintDialogOpen(false)} maxWidth="md" fullWidth>
        <PatientPrintRecord patient={printingPatient as PatientData | null} />
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        patientName={patientToDelete?.personal_info?.first_name + ' ' + patientToDelete?.personal_info?.last_name}
        patientId={patientToDelete?.patient_id || ''}
      />

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Edit Patient Dialog */}
      <Dialog
        open={!!editingPatient}
        onClose={() => setEditingPatient(null)}
        maxWidth="md"
        fullWidth
      >
        {editingPatient && (
          <PatientForm
            patient={editingPatient}
            mode="edit"
            onSave={handleSaveEdit}
            onClose={() => setEditingPatient(null)}
            canCreateOrUpdate={canEdit}
          />
        )}
      </Dialog>
    </Box>
  );
};

export default PatientHistory; 