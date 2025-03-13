import { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  AccountCircle,
  Logout,
  Settings,
} from '@mui/icons-material';
import { removeAuthToken } from '../services/authService';
import { createTheme } from '@mui/material/styles';
import ProfileModal from './ProfileModal';

interface NavbarProps {
  userEmail: string;
  onLogout: () => void;
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
});

const DRAWER_WIDTH = 280; // Adjust width as needed

const Navbar = ({ userEmail, onLogout }: NavbarProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Mock user data - In a real app, this would come from your auth context or API
  const userData = {
    firstName: userEmail.split('@')[0], // Simple example - replace with real data
    lastName: '',
    email: userEmail,
    profileImage: '', // Add default image URL if needed
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenProfile = () => {
    handleCloseMenu();
    setProfileModalOpen(true);
  };

  const handleLogout = () => {
    removeAuthToken();
    onLogout();
  };

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo/Brand */}
            <Typography
              variant="h6"
              noWrap
              sx={{
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              LOGO
            </Typography>

            {/* Profile Section */}
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    {userEmail.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
              >
                <MenuItem onClick={handleOpenProfile}>
                  <AccountCircle sx={{ mr: 1.5 }} /> Profile
                </MenuItem>
                <MenuItem onClick={handleCloseMenu}>
                  <Settings sx={{ mr: 1.5 }} /> Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1.5 }} /> Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <ProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        userData={userData}
      />
    </>
  );
};

export default Navbar; 