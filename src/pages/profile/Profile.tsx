import { Box, Typography } from '@mui/material';
import UserProfile from '../../components/UserProfile';
import { useOutletContext } from 'react-router-dom';
import { User } from '../../models/types';

const Profile = () => {
  // Get the logged-in user from the outlet context (provided by DashboardLayout)
  const { user } = useOutletContext<{ user: User }>();

  const userData = {
    firstName: user.name || user.email.split('@')[0],
    lastName: '',
    email: user.email,
    profileImage: user.profileImage || '',
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
      <UserProfile initialData={userData} />
    </Box>
  );
};

export default Profile; 