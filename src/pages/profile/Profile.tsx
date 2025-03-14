import { Box, Typography } from '@mui/material';
import UserProfile from '../../components/UserProfile';

const Profile = () => {
  // This would typically come from your auth context or API
  const userData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    profileImage: '', // Add default image URL if needed
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