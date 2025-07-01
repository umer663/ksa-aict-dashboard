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
  Info,
  ContactMail,
  Dashboard as DashboardIcon,
  PersonAdd,
  MedicalInformation,
  AccountCircle,
  MenuBook,
  BugReport,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { User } from '../models/types';
import { useAppConfig } from '../context/AppConfigContext';
import type { ReactElement } from 'react';

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

const iconMap: Record<string, ReactElement> = {
  dashboard: <DashboardIcon />,
  about: <Info />,
  'add-patient': <PersonAdd />,
  'patient-history': <MedicalInformation />,
  'bug-feature': <BugReport />,
  profile: <AccountCircle />,
  contact: <ContactMail />,
  tutorials: <MenuBook />,
  'user-management': <AccountCircle />,
  topics: <MenuBook />,
};

interface SidebarProps {
  user: User;
}

const Sidebar = ({ user }: SidebarProps) => {
  const appConfig = useAppConfig();
  const rolePermissions = appConfig?.rolePermissions || {};
  const pages = appConfig?.pages || [];
  const getUserPermissions = (user: User) => user.permissions || rolePermissions[user.role];

  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const userPerms = getUserPermissions(user);
  // Build menu items dynamically from config
  let filteredMenuItems = pages
    .filter(page => userPerms.includes(page.key))
    .map(page => ({
      text: page.label,
      icon: iconMap[page.key] || <DashboardIcon />,
      path: `/${page.key}`,
      key: page.key,
    }));
  // Add User Management menu item for SuperAdmin if allowed and not already present
  if (userPerms.includes('user-management') && user.role === 'SuperAdmin' && !filteredMenuItems.some(item => item.key === 'user-management')) {
    filteredMenuItems.push({ text: 'User Management', icon: iconMap['user-management'], path: '/user-management', key: 'user-management' });
  }

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
          {filteredMenuItems.map((item) => (
            <ListItem key={item.key || item.text} disablePadding>
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
          component="a"
          href="https://www.azeemicolourtherapy.com/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'block',
            fontSize: '0.75rem',
            color: 'text.secondary',
            textDecoration: 'none',
            mb: 1,
            '&:hover': {
              color: 'primary.main',
              textDecoration: 'underline',
            },
            lineHeight: 1.4,
          }}
        >
          A Project of Khawaja Shamsuddin Azeemi Institute of Colour Therapy
        </Typography>
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