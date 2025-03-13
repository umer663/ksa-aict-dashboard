import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import UserProfile from './UserProfile';
import { styled } from '@mui/material/styles';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: theme.palette.background.paper,
    maxWidth: '800px',
    width: '100%',
  },
}));

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
  onProfileUpdate?: (updatedData: any) => void;
}

const ProfileModal = ({ open, onClose, userData, onProfileUpdate }: ProfileModalProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ m: 0, p: 2, bgcolor: 'background.paper' }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ bgcolor: 'background.paper', p: { xs: 2, md: 3 } }}>
        <UserProfile 
          initialData={userData} 
          onProfileUpdate={onProfileUpdate}
        />
      </DialogContent>
    </StyledDialog>
  );
};

export default ProfileModal; 