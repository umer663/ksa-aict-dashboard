import { useState } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Paper, List, ListItem, ListItemText, Divider, Alert, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Switch, FormControlLabel, Avatar, Checkbox, FormGroup } from '@mui/material';
import { Edit, Block, CheckCircle, Cancel, PhotoCamera, Search } from '@mui/icons-material';
import { User, UserRole } from '../../models/types';

const roles: UserRole[] = ['SuperAdmin', 'Admin', 'Therapist', 'Receptionist'];

interface NewUserForm {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  blocked?: boolean;
  profileImage?: string;
  permissions?: string[];
}

const initialForm: NewUserForm = {
  email: '',
  name: '',
  password: '',
  role: 'Admin',
  blocked: false,
  profileImage: '',
  permissions: [],
};

const mockUsers: User[] = [
  { email: 'superadmin@example.com', name: 'Super Admin', role: 'SuperAdmin', blocked: false },
  { email: 'admin@example.com', name: 'Admin User', role: 'Admin', blocked: false },
  { email: 'therapist@example.com', name: 'Therapist User', role: 'Therapist', blocked: false },
  { email: 'receptionist@example.com', name: 'Receptionist User', role: 'Receptionist', blocked: false },
];

// Central permissions map
const allPages = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'topics', label: 'Topics' },
  { key: 'add-patient', label: 'Add Patient' },
  { key: 'patient-history', label: 'Patient History' },
  { key: 'home', label: 'Home' },
  { key: 'about', label: 'About' },
  { key: 'contact', label: 'Contact' },
  { key: 'profile', label: 'Profile' },
  { key: 'bug-feature', label: 'Bug / Feature' },
  { key: 'user-management', label: 'User Management' },
  { key: 'tutorials', label: 'Tutorials' },
];

const rolePermissions: Record<UserRole, string[]> = {
  SuperAdmin: allPages.map(p => p.key),
  Admin: allPages.map(p => p.key),
  Therapist: allPages.map(p => p.key),
  Receptionist: [
    'dashboard', 'contact', 'profile', 'about', 'bug-feature', 'tutorials'
  ],
};

const UserManagement = () => {
  const [form, setForm] = useState<NewUserForm>(initialForm);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<NewUserForm>(initialForm);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Profile image must be less than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.name || !form.password) {
      setError('All fields are required.');
      setSuccess('');
      return;
    }
    if (users.some(u => u.email === form.email)) {
      setError('User with this email already exists.');
      setSuccess('');
      return;
    }
    setUsers([...users, { email: form.email, name: form.name, role: form.role, blocked: false, profileImage: form.profileImage, permissions: form.permissions }]);
    setSuccess('User created successfully!');
    setError('');
    setForm(initialForm);
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    setEditForm({
      email: user.email,
      name: user.name || '',
      password: '',
      role: user.role,
      blocked: user.blocked || false,
      profileImage: user.profileImage || '',
      permissions: user.permissions || rolePermissions[user.role],
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUsers(users.map(u =>
      u.email === editUser?.email
        ? { ...u, email: editForm.email, name: editForm.name, role: editForm.role, blocked: editForm.blocked, profileImage: editForm.profileImage, permissions: editForm.permissions }
        : u
    ));
    setEditDialogOpen(false);
    setEditUser(null);
    setSuccess('User updated successfully!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleBlockToggle = (user: User) => {
    setUsers(users.map(u =>
      u.email === user.email ? { ...u, blocked: !u.blocked } : u
    ));
    setSuccess(user.blocked ? 'User unblocked.' : 'User blocked.');
    setTimeout(() => setSuccess(''), 2000);
  };

  // Add this line to filter users based on search input
  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>User Management</Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Create New User</Typography>
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              src={form.profileImage}
              sx={{ width: 56, height: 56, mr: 2 }}
            />
            <label htmlFor="profile-image-upload">
              <input
                accept="image/*"
                id="profile-image-upload"
                type="file"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCamera />}
              >
                Upload
              </Button>
            </label>
          </Box>
          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            select
            label="Role"
            name="role"
            value={form.role}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            {roles.map((role) => (
              <MenuItem key={role} value={role}>{role}</MenuItem>
            ))}
          </TextField>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Create User</Button>
        </form>
      </Paper>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Existing Users</Typography>
        <Box sx={{ mt: 2, mb: 2 }}>
          <TextField
            placeholder="Search users by name or email"
            variant="outlined"
            size="small"
            fullWidth
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </Box>
        <List>
          {filteredUsers.map((user, idx) => (
            <div key={user.email}>
              <ListItem
                secondaryAction={
                  <>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(user)}>
                      <Edit />
                    </IconButton>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!user.blocked}
                          onChange={() => handleBlockToggle(user)}
                          color="success"
                        />
                      }
                      label={user.blocked ? 'Blocked' : 'Active'}
                      sx={{ ml: 2 }}
                    />
                  </>
                }
              >
                <Avatar src={user.profileImage} sx={{ width: 32, height: 32, mr: 2 }} />
                <ListItemText
                  primary={user.name + (user.blocked ? ' (Blocked)' : '')}
                  secondary={`${user.email} — ${user.role}`}
                  sx={{ color: user.blocked ? 'text.disabled' : 'inherit' }}
                />
              </ListItem>
              {idx < filteredUsers.length - 1 && <Divider />}
            </div>
          ))}
        </List>
      </Paper>
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={editForm.profileImage}
                sx={{ width: 56, height: 56, mr: 2 }}
              />
              <label htmlFor="profile-image-upload">
                <input
                  accept="image/*"
                  id="profile-image-upload"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCamera />}
                >
                  Upload
                </Button>
              </label>
            </Box>
            <TextField
              label="Email"
              name="email"
              value={editForm.email}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Name"
              name="name"
              value={editForm.name}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              select
              label="Role"
              name="role"
              value={editForm.role}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>{role}</MenuItem>
              ))}
            </TextField>
            <FormControlLabel
              control={
                <Switch
                  checked={!editForm.blocked}
                  onChange={() => setEditForm({ ...editForm, blocked: !editForm.blocked })}
                  color="success"
                />
              }
              label={editForm.blocked ? 'Blocked' : 'Active'}
              sx={{ mt: 2 }}
            />
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Page Access</Typography>
            <FormGroup>
              {allPages.map(page => (
                <FormControlLabel
                  key={page.key}
                  control={
                    <Checkbox
                      checked={editForm.permissions?.includes(page.key) || false}
                      onChange={e => {
                        const checked = e.target.checked;
                        setEditForm(prev => ({
                          ...prev,
                          permissions: checked
                            ? [...(prev.permissions || []), page.key]
                            : (prev.permissions || []).filter(k => k !== page.key),
                        }));
                      }}
                    />
                  }
                  label={page.label}
                />
              ))}
            </FormGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)} color="secondary">Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
export { rolePermissions, allPages };