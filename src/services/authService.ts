import { LoginResponse } from '../models/types';

// Mock user data - in real app, this would be your backend validation
const MOCK_VALID_CREDENTIALS = {
  email: 'test@example.com',
  password: 'password123'
};

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (email === MOCK_VALID_CREDENTIALS.email && password === MOCK_VALID_CREDENTIALS.password) {
    return {
      success: true,
      user: {
        email: email,
        name: 'Test User'
      }
    };
  }
  
  return {
    success: false,
    error: 'Invalid email or password'
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