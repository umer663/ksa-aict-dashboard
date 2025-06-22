import { Box, Typography, Paper, Divider, List, ListItem, ListItemText } from '@mui/material';

const Tutorials = () => {
  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, mb: 6 }}>
      <Paper sx={{ p: 4, mb: 4 }} elevation={3}>
        <Typography variant="h4" gutterBottom color="primary">
          Welcome to the AICT Dashboard Tutorial
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          This page will guide you through all the features of the Khawaja Shamsuddin Azeemi Institute of Colour Therapy Patient Management Dashboard. Whether you are a new user or need a refresher, you'll find step-by-step instructions, best practices, and tips for every role.
        </Typography>
      </Paper>

      {/* Quick Start Guide */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom color="secondary">Quick Start Guide</Typography>
        <List sx={{ listStyleType: 'disc', pl: 4 }}>
          <ListItem sx={{ display: 'list-item' }}><ListItemText primary="Log in with your credentials." /></ListItem>
          <ListItem sx={{ display: 'list-item' }}><ListItemText primary="Use the sidebar to navigate between Dashboard, Add Patient, Patient History, and more." /></ListItem>
          <ListItem sx={{ display: 'list-item' }}><ListItemText primary="To add a new patient, click 'Add Patient' and fill out the form." /></ListItem>
          <ListItem sx={{ display: 'list-item' }}><ListItemText primary="To view or edit existing patients, go to 'Patient History'." /></ListItem>
          <ListItem sx={{ display: 'list-item' }}><ListItemText primary="For user management (admins only), use the 'User Management' section." /></ListItem>
        </List>
      </Paper>

      <Divider sx={{ my: 4 }} />

      {/* Patient Management */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom color="primary">Patient Management</Typography>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Adding a New Patient</Typography>
        <List sx={{ mb: 2, listStyleType: 'disc', pl: 4 }}>
          <ListItem sx={{ display: 'list-item' }}><ListItemText primary="Go to 'Add Patient' from the sidebar." /></ListItem>
          <ListItem sx={{ display: 'list-item' }}><ListItemText primary="Enter therapist and patient details." /></ListItem>
          <ListItem sx={{ display: 'list-item' }}><ListItemText primary="Fill in medical history, clinical notes, and use bullet points in text areas for clarity." /></ListItem>
          <ListItem sx={{ display: 'list-item' }}><ListItemText primary="Click 'Save Patient History' to store the record." /></ListItem>
          <ListItem sx={{ display: 'list-item' }}><ListItemText primary="Use 'Fill Sample Data' for a quick demo." /></ListItem>
        </List>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Editing & Printing Patient Records</Typography>
        <List sx={{ mb: 2, listStyleType: 'disc', pl: 4 }}>
          <ListItem sx={{ display: 'list-item' }}><ListItemText primary="Go to 'Patient History' from the sidebar." /></ListItem>
          <ListItem sx={{ display: 'list-item' }}><ListItemText primary="Select a patient to view details." /></ListItem>
          <ListItem sx={{ display: 'list-item' }}><ListItemText primary="Click the edit icon to update information." /></ListItem>
          <ListItem sx={{ display: 'list-item' }}><ListItemText primary="Click the print icon to generate a printable record." /></ListItem>
        </List>
      </Paper>

      {/* User Management */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom color="secondary">User Management (Admins Only)</Typography>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Creating & Managing Users</Typography>
        <List sx={{ mb: 2, listStyleType: 'disc', pl: 4 }}>
          <ListItem sx={{ display: 'list-item' }}><ListItemText primary="Go to 'User Management' from the sidebar (SuperAdmin/Admin only)." /></ListItem>
          <ListItem sx={{ display: 'list-item' }}><ListItemText primary="Click 'Create New User' and fill in the required details." /></ListItem>
          <ListItem sx={{ display: 'list-item' }}><ListItemText primary="Assign a role: SuperAdmin, Admin, Therapist, or Receptionist." /></ListItem>
          <ListItem sx={{ display: 'list-item' }}><ListItemText primary="Upload a profile image if desired." /></ListItem>
          <ListItem sx={{ display: 'list-item' }}><ListItemText primary="Edit, block/unblock, or delete users as needed." /></ListItem>
        </List>
      </Paper>

      {/* System Features */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom color="primary">System Features</Typography>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Key Features</Typography>
        <List sx={{ mb: 2, listStyleType: 'disc', pl: 4 }}>
          <ListItem sx={{ display: 'list-item' }}><ListItemText primary="Dashboard: View key stats and recent activity." /></ListItem>
          <ListItem sx={{ display: 'list-item' }}><ListItemText primary="Profile: Update your personal information and password." /></ListItem>
          <ListItem sx={{ display: 'list-item' }}><ListItemText primary="Contact: Reach out for support or feedback." /></ListItem>
          <ListItem sx={{ display: 'list-item' }}><ListItemText primary="Bug/Feature: Report issues or request new features." /></ListItem>
        </List>
      </Paper>

      {/* Best Practices */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom color="secondary">Best Practices & Tips</Typography>
        <List sx={{ mb: 2, listStyleType: 'disc', pl: 4 }}>
          <ListItem sx={{ display: 'list-item' }}><ListItemText primary="Double-check patient data before saving." /></ListItem>
          <ListItem sx={{ display: 'list-item' }}><ListItemText primary="Use clear, concise language in notes." /></ListItem>
          <ListItem sx={{ display: 'list-item' }}><ListItemText primary="Keep your password secure and update it regularly." /></ListItem>
          <ListItem sx={{ display: 'list-item' }}><ListItemText primary="Log out when finished, especially on shared devices." /></ListItem>
        </List>
      </Paper>

      {/* FAQ / Support */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom color="primary">FAQ & Support</Typography>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Frequently Asked Questions</Typography>
        <List sx={{ mb: 2, listStyleType: 'disc', pl: 4 }}>
          <ListItem sx={{ display: 'list-item' }}><ListItemText primary="How do I reset my password? Go to your profile page and click 'Change Password'." /></ListItem>
          <ListItem sx={{ display: 'list-item' }}><ListItemText primary="Who can add new users? Only SuperAdmin and Admin roles can add or edit users." /></ListItem>
          <ListItem sx={{ display: 'list-item' }}><ListItemText primary="Where can I get more help? Use the 'Contact' page or the 'Bug/Feature' form to reach support." /></ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default Tutorials;
