import { LoginResponse, UserRole, User } from '../models/types';
import { auth, db } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { PatientData } from '../models/types';

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

// Fetch all users from Firestore
export const fetchAllUsers = async (): Promise<User[]> => {
  const usersCol = collection(db, 'users');
  const userSnapshot = await getDocs(usersCol);
  return userSnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id }) as User & { uid: string });
};

// Delete a user by UID
export const deleteUserByUid = async (uid: string): Promise<void> => {
  await deleteDoc(doc(db, 'users', uid));
};

// Update a user by UID
export const updateUser = async (uid: string, userData: Partial<User>) => {
  await setDoc(doc(db, 'users', uid), userData, { merge: true });
};

// Create a new patient in Firestore
export const createPatient = async (patient: PatientData) => {
  const patientId = patient.patient_id || uuidv4();
  await setDoc(doc(db, 'patients', patientId), { ...patient, patient_id: patientId });
  return patientId;
};

// Update an existing patient in Firestore
export const updatePatient = async (patientId: string, patient: PatientData) => {
  await setDoc(doc(db, 'patients', patientId), patient, { merge: true });
};

// Fetch all patients from Firestore
export const fetchAllPatients = async (): Promise<PatientData[]> => {
  const patientsCol = collection(db, 'patients');
  const patientSnapshot = await getDocs(patientsCol);
  return patientSnapshot.docs.map(doc => ({ ...doc.data(), patient_id: doc.id }) as PatientData);
}; 