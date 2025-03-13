import React, { useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import PrintablePatientRecord from './PrintablePatientRecord';
import { PatientData } from '../models/types';

interface PrintModalProps {
  open: boolean;
  onClose: () => void;
  patient: PatientData;
}

const PrintModal: React.FC<PrintModalProps> = ({ open, onClose, patient }) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Patient_Record_${patient.patient_id}`,
    onAfterPrint: onClose,
    pageStyle: `
      @media print {
        @page {
          margin: 20mm;
        }
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '60vh' }
      }}
    >
      <DialogTitle>Print Patient Record</DialogTitle>
      <DialogContent>
        <Box>
          <PrintablePatientRecord ref={componentRef} patient={patient} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={() => handlePrint()}
          variant="contained" 
          color="primary"
        >
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrintModal; 