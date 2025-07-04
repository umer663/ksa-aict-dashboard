import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Paper, List, ListItem, ListItemText, Divider, Alert, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Switch, FormControlLabel, Avatar, Checkbox, FormGroup } from '@mui/material';
import { Edit, Block, CheckCircle, Cancel, PhotoCamera, Search } from '@mui/icons-material';
import { User, UserRole, PermissionsObject } from '../../models/types';
import { fetchAllUsers, deleteUserByUid, registerUser, updateUser } from '../../services/authService';
import { useAppConfig } from '../../context/AppConfigContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Dialog as MuiDialog, DialogTitle as MuiDialogTitle, DialogContent as MuiDialogContent, DialogActions as MuiDialogActions } from '@mui/material';

interface NewUserForm {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  blocked?: boolean;
  profileImage?: string;
  permissions?: PermissionsObject;
}

const initialForm: NewUserForm = {
  email: '',
  name: '',
  password: '',
  role: 'Admin',
  blocked: false,
  profileImage: '',
  permissions: {},
};

// Extend User type to include permissions as PermissionsObject
interface UserWithUid extends User {
  uid?: string;
  permissions?: PermissionsObject;
}

const ACTIONS = ['view', 'create', 'update', 'delete'] as const;
type Action = typeof ACTIONS[number];

const UserManagement = ({ currentUser }: { currentUser: User }) => {
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
  const [creatingUser, setCreatingUser] = useState(false);
  const [savingEditUser, setSavingEditUser] = useState(false);
  const [deletingUser, setDeletingUser] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ uid: string | undefined; email: string }>({ uid: undefined, email: '' });

  // Get app config from context
  const appConfig = useAppConfig();
  const allPages = appConfig?.pages || [];
  const rolePermissions = appConfig?.rolePermissions || {};
  const nonRemoveableUsers = appConfig?.nonRemoveableUsers || [];
  const defaultRole = appConfig?.defaultRole || '';
  const defaultPermissions = appConfig?.defaultPermissions || [];

  // Add permission checks:
  const isNonRemoveable = nonRemoveableUsers.includes(currentUser.email);
  const canCreate = isNonRemoveable || currentUser?.permissions?.['user-management']?.create === true;
  const canUpdate = isNonRemoveable || currentUser?.permissions?.['user-management']?.update === true;
  const canDelete = isNonRemoveable || currentUser?.permissions?.['user-management']?.delete === true;

  // Fetch users from Firestore
  const loadUsers = async () => {
    setLoading(true);
    try {
      const users = await fetchAllUsers();
      setUsers(users.map(u => ({
        ...u,
        permissions: (u.permissions && typeof u.permissions === 'object' && !Array.isArray(u.permissions)) ? u.permissions : {},
      })));
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
    setCreatingUser(true);
    try {
      // Ensure defaultPermissions is an object
      let permissionsObj: PermissionsObject = {};
      if (Array.isArray(defaultPermissions)) {
        // Convert array to object with all actions true
        defaultPermissions.forEach((key: string) => {
          permissionsObj[key] = { view: true, create: true, update: true, delete: true };
        });
      } else if (typeof defaultPermissions === 'object' && defaultPermissions !== null) {
        permissionsObj = defaultPermissions;
      }
      const response = await registerUser(form.email, form.password, {
        name: form.name,
        role: defaultRole as UserRole,
        blocked: form.blocked,
        profileImage: form.profileImage,
        permissions: permissionsObj,
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
    } finally {
      setCreatingUser(false);
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
      permissions: (user.permissions && typeof user.permissions === 'object' && !Array.isArray(user.permissions)) ? user.permissions as PermissionsObject : {},
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser?.uid) return;
    setSavingEditUser(true);
    try {
      await updateUser(editUser.uid, {
        email: editForm.email,
        name: editForm.name,
        role: editForm.role,
        blocked: editForm.blocked,
        profileImage: editForm.profileImage,
        permissions: editForm.permissions as PermissionsObject,
      });
      setEditDialogOpen(false);
      setEditUser(null);
      setSuccess('User updated successfully!');
      setTimeout(() => setSuccess(''), 2000);
      loadUsers();
    } catch (err) {
      setError('Failed to update user');
    } finally {
      setSavingEditUser(false);
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
    if (email === currentUser.email) {
      setError("You cannot delete the user you are currently logged in as.");
      return;
    }
    if (nonRemoveableUsers.includes(email)) {
      setError("This user cannot be deleted (non-removeable user).");
      return;
    }
    setDeletingUser(true);
    try {
      await deleteUserByUid(uid);
      setSuccess('User deleted successfully!');
      loadUsers();
    } catch (err) {
      setError('Failed to delete user');
    } finally {
      setDeletingUser(false);
    }
  };

  // In render, show loading spinner if config is loading
  if (!appConfig) {
    return (
      <LoadingSpinner message="Loading configuration..." />
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>User Management</Typography>
      {canCreate && (
        <Paper sx={{ p: { xs: 2, sm: 4 }, mb: 4 }}>
          <Typography variant="h6" gutterBottom>Create New User</Typography>
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={form.profileImage}
                sx={{ width: 56, height: 56, mr: 2 }}
              />
              {/* <label htmlFor="profile-image-upload">
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
              </label> */}
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
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>Create User</Button>
          </form>
        </Paper>
      )}
      <Paper sx={{ p: { xs: 2, sm: 4 } }}>
        <Typography variant="h6" gutterBottom>Existing Users</Typography>
        {loading ? (
          <LoadingSpinner message="Loading users..." />
        ) : (
        <>
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
              <ListItem disableGutters>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Avatar src={user.profileImage} sx={{ width: 32, height: 32, mr: 2 }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <ListItemText
                      primary={(user.name || user.email) + (user.blocked ? ' (Blocked)' : '')}
                      secondary={`${user.email} — ${user.role}`}
                      sx={{ color: user.blocked ? 'text.disabled' : 'inherit' }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(user)}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      color="error"
                      disabled={
                        !user.email ||
                        !currentUser.email ||
                        user.email.toLowerCase() === currentUser.email.toLowerCase() ||
                        nonRemoveableUsers.includes(user.email)
                      }
                      onClick={() => {
                        setUserToDelete({ uid: user.uid, email: user.email });
                        setConfirmDeleteOpen(true);
                      }}
                      sx={{ ml: 1 }}
                    >
                      <Cancel />
                    </IconButton>
                    {toggleLoadingUid === user.uid && (
                      <Box sx={{ ml: 1 }}><LoadingSpinner size={20} /></Box>
                    )}
                  </Box>
                </Box>
              </ListItem>
              {idx < filteredUsers.length - 1 && <Divider />}
            </div>
          ))}
        </List>
        </>
        )}
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
                {/* <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCamera />}
                >
                  Upload
                </Button> */}
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
            {(nonRemoveableUsers.includes(currentUser.email) || users.find(u => u.email === currentUser.email)?.role === 'SuperAdmin') && (
              <Box sx={{ mb: 2, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'transparent' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: 8 }}>Page Name</th>
                      {ACTIONS.map(action => (
                        <th key={action} style={{ textAlign: 'center', padding: 8, minWidth: 60 }}>{action.charAt(0).toUpperCase() + action.slice(1)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allPages.map((page) => (
                      <tr key={page.key}>
                        <td style={{ padding: 8 }}>{page.label}</td>
                        {ACTIONS.map((action: Action) => (
                          <td key={action} style={{ textAlign: 'center', padding: 8 }}>
                            <Checkbox
                              checked={!!(editForm.permissions && typeof editForm.permissions === 'object' && (editForm.permissions as PermissionsObject)[page.key]?.[action])}
                              onChange={e => {
                                const checked = e.target.checked;
                                setEditForm(prev => {
                                  const newPerms: PermissionsObject = { ...(prev.permissions || {}) };
                                  if (!newPerms[page.key]) newPerms[page.key] = {};
                                  newPerms[page.key][action] = checked;
                                  return { ...prev, permissions: newPerms };
                                });
                              }}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)} color="secondary">Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
      <MuiDialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <MuiDialogTitle>Confirm Delete</MuiDialogTitle>
        <MuiDialogContent>
          Are you sure you want to delete user <b>{userToDelete.email}</b>?
        </MuiDialogContent>
        <MuiDialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={() => {
            setConfirmDeleteOpen(false);
            handleDeleteUser(userToDelete.uid, userToDelete.email);
          }} color="error" variant="contained">Delete</Button>
        </MuiDialogActions>
      </MuiDialog>
      {creatingUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(255,255,255,0.5)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LoadingSpinner message="Creating user..." />
        </div>
      )}
      {savingEditUser && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.7)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LoadingSpinner message="Saving changes..." />
        </div>
      )}
      {deletingUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(255,255,255,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LoadingSpinner message="Deleting user..." />
        </div>
      )}
    </Box>
  );
};

export default UserManagement;