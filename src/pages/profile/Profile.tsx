import { Box, Typography, Snackbar, Alert } from '@mui/material';
import UserProfile from '../../components/UserProfile';
import { useOutletContext } from 'react-router-dom';
import { User } from '../../models/types';
import { updateUser } from '../../services/authService';
import { useState } from 'react';
import { useAppConfig } from '../../context/AppConfigContext';

const Profile = () => {
  // Get the logged-in user from the outlet context (provided by DashboardLayout)
  const { user } = useOutletContext<{ user: User & { uid?: string } }>();

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const appConfig = useAppConfig();
  const nonRemoveableUsers = appConfig?.nonRemoveableUsers || [];
  const isNonRemoveable = nonRemoveableUsers.includes(user.email);

  const userData = {
    firstName: user.name?.split(' ')[0] || user.email.split('@')[0],
    lastName: user.name?.split(' ').slice(1).join(' ') || '',
    email: user.email,
    profileImage: user.profileImage || '',
  };

  const handleProfileUpdate = async (updatedData: any) => {
    if (!(isNonRemoveable || user?.permissions?.['profile']?.update)) {
      setSnackbar({ open: true, message: 'You do not have permission to update your profile.', severity: 'error' });
      return;
    }
    if (!user?.permissions?.['profile']?.update) {
      setSnackbar({ open: true, message: 'You do not have permission to update your profile.', severity: 'error' });
      return;
    }
    if (!user.uid) {
      setSnackbar({ open: true, message: 'User ID not found. Cannot update profile.', severity: 'error' });
      return;
    }
    try {
      // Only update name and profileImage
      const name = (updatedData.firstName + ' ' + updatedData.lastName).trim();
      await updateUser(user.uid, { name, profileImage: updatedData.profileImage });
      setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update profile', severity: 'error' });
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: 'center',
          color: 'primary.main',
          fontWeight: 500,
        }}
      >
        My Profile
      </Typography>
      <UserProfile initialData={userData} onProfileUpdate={handleProfileUpdate} canUpdate={isNonRemoveable || user?.permissions?.['profile']?.update === true} />
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
    </Box>
  );
};

export default Profile; 