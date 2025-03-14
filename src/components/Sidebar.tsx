import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  Home,
  Info,
  ContactMail,
  Dashboard as DashboardIcon,
  PersonAdd,
  MedicalInformation,
  AccountCircle,
  MenuBook,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

const DRAWER_WIDTH = 240;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: DRAWER_WIDTH,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.default,
    borderRight: `1px solid ${theme.palette.divider}`,
    overflowX: 'hidden', // Prevent horizontal scroll
    display: 'flex',
    flexDirection: 'column',
  },
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  margin: theme.spacing(0.5, 1),
  borderRadius: theme.spacing(1),
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.contrastText,
    },
  },
}));

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Topics', icon: <MenuBook />, path: '/topics' },
  { text: 'Add Patient', icon: <PersonAdd />, path: '/add-patient' },
  { text: 'Patient History', icon: <MedicalInformation />, path: '/patient-history' },
  { text: 'Home', icon: <Home />, path: '/home' },
  { text: 'About', icon: <Info />, path: '/about' },
  { text: 'Contact', icon: <ContactMail />, path: '/contact' },
  { text: 'Profile', icon: <AccountCircle />, path: '/profile' },
];

const Sidebar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <StyledDrawer variant="permanent">
      <Toolbar />
      
      <Box sx={{ overflow: 'auto', flex: 1 }}>
        <List sx={{ 
          px: 1, // Add padding to list
          '& .MuiListItem-root': {
            display: 'block', // Ensure proper item layout
            width: '100%',
            px: 0, // Remove default padding
          },
        }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <motion.div
                style={{ width: '100%' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <StyledListItemButton
                  onClick={() => navigate(item.path)}
                  selected={location.pathname === item.path}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: location.pathname === item.path 
                        ? 'inherit' 
                        : 'primary.main',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: '0.95rem',
                        fontWeight: location.pathname === item.path ? 500 : 400,
                      },
                    }}
                  />
                </StyledListItemButton>
              </motion.div>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'block',
            fontSize: '0.75rem',
          }}
        >
          Version 1.0.0
        </Typography>
      </Box>
    </StyledDrawer>
  );
};

export default Sidebar; 