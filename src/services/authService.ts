import { LoginResponse, UserRole, User } from '../models/types';
import { auth, db } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

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
  try {
    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userAuth = userCredential.user;
    // Fetch user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', userAuth.uid));
    if (!userDoc.exists()) {
      return { success: false, error: 'User profile not found in database.' };
    }
    const userData = userDoc.data() as User;
    if (userData.blocked) {
      return { success: false, error: 'Your account has been blocked. Please contact the administrator.' };
    }
    return { success: true, user: userData };
  } catch (error: any) {
    let errorMsg = 'Invalid email or password';
    if (error.code === 'auth/user-not-found') errorMsg = 'User not found';
    if (error.code === 'auth/wrong-password') errorMsg = 'Incorrect password';
    if (error.code === 'auth/too-many-requests') errorMsg = 'Too many failed attempts. Please try again later.';
    return { success: false, error: errorMsg };
  }
};

export const registerUser = async (email: string, password: string, userData: Omit<User, 'email'>): Promise<LoginResponse> => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userAuth = userCredential.user;
    // Create user profile in Firestore
    const userId = userAuth.uid || uuidv4();
    const userProfile: User = {
      email,
      ...userData,
    };
    await setDoc(doc(db, 'users', userId), userProfile);
    return { success: true, user: userProfile };
  } catch (error: any) {
    let errorMsg = 'Registration failed';
    if (error.code === 'auth/email-already-in-use') errorMsg = 'Email already in use';
    return { success: false, error: errorMsg };
  }
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