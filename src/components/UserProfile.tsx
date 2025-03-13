import { useState, useRef, ChangeEvent } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  PhotoCamera,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

const ProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 600,
  margin: '0 auto',
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: 'transparent',
  boxShadow: 'none',
}));

const LargeAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
  margin: '0 auto',
  border: `4px solid ${theme.palette.primary.main}`,
  boxShadow: theme.shadows[3],
  position: 'relative',
}));

const UploadInput = styled('input')({
  display: 'none',
});

const ImageUploadButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  right: 0,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

interface UserProfileProps {
  initialData: {
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
  onProfileUpdate?: (updatedData: any) => void;
}

const UserProfile = ({ initialData, onProfileUpdate }: UserProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        setSnackbar({
          open: true,
          message: 'Image size should be less than 5MB',
          severity: 'error',
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedData = {
        ...formData,
        profileImage: tempImage || formData.profileImage,
      };

      // Call the update handler if provided
      if (onProfileUpdate) {
        onProfileUpdate(updatedData);
      }

      setFormData(updatedData);
      setIsEditing(false);
      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update profile',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempImage(null);
    setFormData(initialData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ProfilePaper elevation={3}>
        <Box sx={{ position: 'relative', mb: 4 }}>
          <LargeAvatar
            src={tempImage || formData.profileImage}
            alt={`${formData.firstName} ${formData.lastName}`}
          >
            {!tempImage && !formData.profileImage && 
              `${formData.firstName[0]}${formData.lastName[0]}`}
          </LargeAvatar>
          
          {isEditing && (
            <>
              <UploadInput
                accept="image/*"
                id="profile-image-upload"
                type="file"
                onChange={handleImageUpload}
                ref={fileInputRef}
              />
              <ImageUploadButton
                aria-label="upload picture"
                component="label"
                htmlFor="profile-image-upload"
                size="small"
              >
                <PhotoCamera />
              </ImageUploadButton>
            </>
          )}
        </Box>

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          {!isEditing ? (
            <>
              <Typography variant="h5" gutterBottom>
                {formData.firstName} {formData.lastName}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {formData.email}
              </Typography>
              <Button
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(true)}
                sx={{ mt: 2 }}
              >
                Edit Profile
              </Button>
            </>
          ) : (
            <Box component="form" noValidate>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                disabled
                margin="normal"
              />
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </ProfilePaper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default UserProfile; 