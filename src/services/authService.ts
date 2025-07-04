import { LoginResponse, UserRole, User } from '../models/types';
import { auth, db } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc, query, where, addDoc, orderBy } from 'firebase/firestore';
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
    const userData = { ...userDoc.data(), uid: userAuth.uid } as User & { uid: string };
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
    const userId = userAuth.uid;
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
  const docRef = await addDoc(collection(db, 'patients'), { ...patient });
  const patientId = docRef.id;
  await setDoc(doc(db, 'patients', patientId), { ...patient, patient_id: patientId }, { merge: true });
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
  return patientSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      patient_id: doc.id,
      personal_info: data.personal_info || {
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        contact_number: '',
        email: '',
        address: { street: '', city: '', state: '', postal_code: '', country: '' }
      },
      medical_history: data.medical_history || {
        chronic_diseases: [],
        previous_surgeries: [],
        medications: [],
        allergies: [],
        family_medical_history: []
      }
    } as PatientData;
  });
};

// Delete a patient by patient_id
export const deletePatientById = async (patientId: string): Promise<void> => {
  await deleteDoc(doc(db, 'patients', patientId));
};

/**
 * Check if a user exists in Firestore by email.
 */
export const checkUserExistsByEmail = async (email: string): Promise<boolean> => {
  const usersCol = collection(db, 'users');
  const q = query(usersCol, where('email', '==', email));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

/**
 * Send password reset email only if user exists in Firestore.
 */
export const sendPasswordResetIfUserExists = async (
  email: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const exists = await checkUserExistsByEmail(email);
    if (!exists) {
      return { success: false, error: 'No user found with this email.' };
    }
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    let errorMsg = 'Failed to send password reset email.';
    if (error.code === 'auth/invalid-email') errorMsg = 'Invalid email address.';
    return { success: false, error: errorMsg };
  }
};

// Fetch all doctors (users with role "Therapist" and active)
export const fetchAllDoctors = async () => {
  const usersCol = collection(db, 'users');
  const q = query(usersCol);
  const snapshot = await getDocs(q);
  return snapshot.docs
    .filter(doc => doc.data().role === 'Therapist' && doc.data().active !== false)
    .map(doc => ({ uid: doc.id, ...doc.data() }));
};

// Create a new visit for a patient
export const createVisit = async (patientId: string, visitData: any) => {
  const visitsCol = collection(db, 'patients', patientId, 'visits');
  await addDoc(visitsCol, {
    ...visitData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

// Fetch all visits for a patient, most recent first
export const fetchVisits = async (patientId: string) => {
  const visitsCol = collection(db, 'patients', patientId, 'visits');
  const q = query(visitsCol, orderBy('visitDate', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}; 