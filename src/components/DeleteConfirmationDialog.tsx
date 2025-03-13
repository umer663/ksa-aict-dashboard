import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  Paper,
  PaperProps
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

const StyledWarningIcon = styled(WarningIcon)(({ theme }) => ({
  fontSize: 48,
  color: theme.palette.warning.main,
  marginBottom: theme.spacing(2),
}));

// Style the Dialog component
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[24],
    padding: theme.spacing(1),
  },
}));

const MotionDialogPaper = (props: PaperProps) => {
  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      {...props}
    />
  );
};

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  patientName: string;
  patientId: string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  patientName,
  patientId,
}) => {
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      PaperComponent={MotionDialogPaper}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title" sx={{ 
        textAlign: 'center', 
        pt: 3,
        backgroundColor: 'background.paper',
      }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <StyledWarningIcon />
          <Typography variant="h6">Delete Patient Record</Typography>
        </Box>
      </DialogTitle>
      <DialogContent id="delete-dialog-description" sx={{ 
        backgroundColor: 'background.paper',
        pt: 2,
      }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          This action cannot be undone.
        </Alert>
        <Typography variant="body1" gutterBottom>
          Are you sure you want to delete the patient record for:
        </Typography>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          {patientName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Patient ID: {patientId}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ 
        p: 2, 
        justifyContent: 'space-between',
        backgroundColor: 'background.paper',
      }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ minWidth: 100 }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          autoFocus
          sx={{ minWidth: 100 }}
        >
          Delete Record
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default DeleteConfirmationDialog; 