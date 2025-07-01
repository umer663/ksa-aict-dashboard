import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Paper, List, ListItem, ListItemText, Divider, Alert, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Switch, FormControlLabel, Avatar, Checkbox, FormGroup } from '@mui/material';
import { Edit, Block, CheckCircle, Cancel, PhotoCamera, Search } from '@mui/icons-material';
import { User, UserRole } from '../../models/types';
import { fetchAllUsers, deleteUserByUid, registerUser, updateUser } from '../../services/authService';
import { useAppConfig } from '../../context/AppConfigContext';
import CircularProgress from '@mui/material/CircularProgress';

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

// Extend User type to include uid for Firestore document ID
interface UserWithUid extends User {
  uid?: string;
}

const UserManagement = ({ currentUserEmail }: { currentUserEmail: string }) => {
  const [form, setForm] = useState<NewUserForm>(initialForm);
  const [users, setUsers] = useState<UserWithUid[]>([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [editUser, setEditUser] = useState<UserWithUid | null>(null);
  const [editForm, setEditForm] = useState<NewUserForm>(initialForm);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [toggleLoadingUid, setToggleLoadingUid] = useState<string | null>(null);

  // Get app config from context
  const appConfig = useAppConfig();
  const roles = appConfig?.roles || [];
  const allPages = appConfig?.pages || [];
  const rolePermissions = appConfig?.rolePermissions || {};
  const allPagesWithAll = [{ key: 'all', label: 'All' }, ...allPages];

  // Fetch users from Firestore
  const loadUsers = async () => {
    setLoading(true);
    try {
      const users = await fetchAllUsers();
      setUsers(users);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'role') {
      setForm((prev) => ({
        ...prev,
        role: e.target.value as UserRole,
        permissions: rolePermissions[e.target.value as UserRole],
      }));
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'role') {
      setEditForm((prev) => ({
        ...prev,
        role: e.target.value as UserRole,
        permissions: rolePermissions[e.target.value as UserRole],
      }));
    } else {
      setEditForm({ ...editForm, [e.target.name]: e.target.value });
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
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
    try {
      const response = await registerUser(form.email, form.password, {
        name: form.name,
        role: form.role,
        blocked: form.blocked,
        profileImage: form.profileImage,
        permissions: form.permissions,
      });
      if (response.success) {
        setSuccess('User created successfully!');
        setError('');
        setForm(initialForm);
        loadUsers();
      } else {
        setError(response.error || 'Failed to create user');
      }
    } catch (err) {
      setError('Failed to create user');
    }
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

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser?.uid) return;
    try {
      await updateUser(editUser.uid, {
        email: editForm.email,
        name: editForm.name,
        role: editForm.role,
        blocked: editForm.blocked,
        profileImage: editForm.profileImage,
        permissions: editForm.permissions,
      });
      setEditDialogOpen(false);
      setEditUser(null);
      setSuccess('User updated successfully!');
      setTimeout(() => setSuccess(''), 2000);
      loadUsers();
    } catch (err) {
      setError('Failed to update user');
    }
  };

  const handleBlockToggle = async (user: UserWithUid) => {
    if (!user.uid) return;
    setToggleLoadingUid(user.uid);
    try {
      await updateUser(user.uid, { blocked: !user.blocked });
      setSuccess(!user.blocked ? 'User blocked.' : 'User unblocked.');
      setTimeout(() => setSuccess(''), 2000);
      await loadUsers();
    } catch (err) {
      setError('Failed to update user status');
    }
    setToggleLoadingUid(null);
  };

  // Add this line to filter users based on search input
  const filteredUsers = users.filter(
    user =>
      (user.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  // Add delete user handler
  const handleDeleteUser = async (uid: string | undefined, email: string) => {
    if (!uid) return;
    if (email === currentUserEmail) {
      setError("You cannot delete the user you are currently logged in as.");
      return;
    }
    try {
      await deleteUserByUid(uid);
      setSuccess('User deleted successfully!');
      loadUsers();
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  // In render, show loading spinner if config is loading
  if (!appConfig) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

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
          <FormGroup row sx={{ mb: 2 }}>
            {allPagesWithAll.map((page) => (
              <FormControlLabel
                key={page.key}
                control={
                  <Checkbox
                    checked={
                      page.key === 'all'
                        ? form.permissions?.length === allPages.length
                        : form.permissions?.includes(page.key)
                    }
                    onChange={(e) => {
                      const checked = e.target.checked;
                      if (page.key === 'all') {
                        setForm((prev) => ({
                          ...prev,
                          permissions: checked ? allPages.map((p) => p.key) : [],
                        }));
                      } else {
                        setForm((prev) => ({
                          ...prev,
                          permissions: checked
                            ? [...(prev.permissions || []), page.key]
                            : (prev.permissions || []).filter((perm) => perm !== page.key),
                        }));
                      }
                    }}
                  />
                }
                label={page.label}
              />
            ))}
          </FormGroup>
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
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      color="error"
                      disabled={
                        !user.email ||
                        !currentUserEmail ||
                        user.email.toLowerCase() === currentUserEmail.toLowerCase()
                      }
                      onClick={() => handleDeleteUser(user.uid, user.email)}
                      sx={{ ml: 1 }}
                    >
                      <Cancel />
                    </IconButton>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!user.blocked}
                          onChange={() => handleBlockToggle(user)}
                          disabled={user.email.toLowerCase() === currentUserEmail.toLowerCase() || toggleLoadingUid === user.uid}
                        />
                      }
                      label={user.blocked ? 'Blocked' : 'Active'}
                      sx={{ ml: 2 }}
                    />
                    {toggleLoadingUid === user.uid && (
                      <CircularProgress size={20} sx={{ ml: 1 }} />
                    )}
                  </>
                }
              >
                <Avatar src={user.profileImage} sx={{ width: 32, height: 32, mr: 2 }} />
                <ListItemText
                  primary={(user.name || user.email) + (user.blocked ? ' (Blocked)' : '')}
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
            <FormGroup row sx={{ mb: 2 }}>
              {allPagesWithAll.map((page) => (
                <FormControlLabel
                  key={page.key}
                  control={
                    <Checkbox
                      checked={
                        page.key === 'all'
                          ? editForm.permissions?.length === allPages.length
                          : editForm.permissions?.includes(page.key)
                      }
                      onChange={(e) => {
                        const checked = e.target.checked;
                        if (page.key === 'all') {
                          setEditForm((prev) => ({
                            ...prev,
                            permissions: checked ? allPages.map((p) => p.key) : [],
                          }));
                        } else {
                          setEditForm((prev) => ({
                            ...prev,
                            permissions: checked
                              ? [...(prev.permissions || []), page.key]
                              : (prev.permissions || []).filter((perm) => perm !== page.key),
                          }));
                        }
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