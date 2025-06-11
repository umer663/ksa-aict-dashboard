import { LoginResponse, UserRole } from '../models/types';

// Mock user data - in real app, this would be your backend validation
const MOCK_USERS = [
  {
    email: 'superadmin@example.com',
    password: 'Super@123',
    name: 'Super Admin',
    role: 'SuperAdmin' as UserRole,
    blocked: false,
  },
  {
    email: 'admin@example.com',
    password: 'Admin@123',
    name: 'Admin User',
    role: 'Admin' as UserRole,
    blocked: false,
  },
  {
    email: 'therapist@example.com',
    password: 'Therapist@123',
    name: 'Therapist User',
    role: 'Therapist' as UserRole,
    blocked: false,
  },
  {
    email: 'receptionist@example.com',
    password: 'Reception@123',
    name: 'Receptionist User',
    role: 'Receptionist' as UserRole,
    blocked: false,
  },
];

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const user = MOCK_USERS.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    if (user.blocked) {
      return {
        success: false,
        error: 'Your account has been blocked. Please contact the administrator.',
      };
    }
    return {
      success: true,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        blocked: user.blocked,
      },
    };
  }

  return {
    success: false,
    error: 'Invalid email or password',
  };
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
}; 