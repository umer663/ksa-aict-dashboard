import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon, Print as PrintIcon } from '@mui/icons-material';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import PrintablePatientRecord from './PrintablePatientRecord';

interface PrintModalProps {
  open: boolean;
  onClose: () => void;
  patient: any;
}

const PrintModal = ({ open, onClose, patient }: PrintModalProps) => {
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Patient_Record_${patient.patient_id}`,
    onAfterPrint: () => {
      onClose();
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Print Preview
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <PrintablePatientRecord ref={componentRef} patient={patient} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
        >
          Print Record
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrintModal; 