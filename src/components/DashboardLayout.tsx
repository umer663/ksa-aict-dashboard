import { Box } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import { User } from '../models/types';

// Constants for layout measurements
const NAVBAR_HEIGHT = 64; // Standard MUI AppBar height
const FOOTER_HEIGHT = 40; // Match footer height

interface DashboardLayoutProps {
  user: User;
  onLogout: () => void;
}

const DashboardLayout = ({ user, onLogout }: DashboardLayoutProps) => {
  return (
    <Box sx={{ 
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: 'background.default', // Match your theme background
    }}>
      <Navbar user={user} onLogout={onLogout} />
      <Sidebar user={user} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          mb: 8,
          backgroundColor: (theme) => 
            theme.palette.mode === 'light'
              ? 'grey.50'
              : 'grey.900',
          position: 'relative',
          overflow: 'auto',
        }}
      >
        <Box sx={{ 
          maxWidth: '100%',
          pb: 4, // Add padding to prevent content from being hidden behind footer
        }}>
          <Outlet context={{ user }} />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default DashboardLayout; 