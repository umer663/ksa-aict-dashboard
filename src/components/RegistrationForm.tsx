import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { registerUser } from '../services/authService';
import { UserRole } from '../models/types';
import {
  Box, Button, TextField, Typography, MenuItem, Alert
} from '@mui/material';

type RegistrationInputs = {
  email: string;
  password: string;
  name: string;
  role: UserRole;
};

const roles: UserRole[] = ['SuperAdmin', 'Admin', 'Therapist', 'Receptionist'];

const RegistrationForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegistrationInputs>();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: RegistrationInputs) => {
    setError(null);
    setSuccess(null);
    const response = await registerUser(data.email, data.password, {
      name: data.name,
      role: data.role,
      blocked: false,
      profileImage: '',
      permissions: [],
    });
    if (response.success) {
      setSuccess('User registered successfully!');
    } else {
      setError(response.error || 'Registration failed');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Register New User
      </Typography>
      {success && <Alert severity="success">{success}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          {...register('name', { required: 'Name is required' })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          type="email"
          {...register('email', { required: 'Email is required' })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          label="Password"
          fullWidth
          margin="normal"
          type="password"
          {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <TextField
          label="Role"
          fullWidth
          margin="normal"
          select
          defaultValue={roles[0]}
          {...register('role', { required: 'Role is required' })}
          error={!!errors.role}
          helperText={errors.role?.message}
        >
          {roles.map((role) => (
            <MenuItem key={role} value={role}>{role}</MenuItem>
          ))}
        </TextField>
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Register
        </Button>
      </form>
    </Box>
  );
};

export default RegistrationForm; 