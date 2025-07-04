// Address related interfaces
export interface Address {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

// User related interfaces
export type UserRole = 'SuperAdmin' | 'Admin' | 'Therapist' | 'Receptionist';

export interface PermissionsObject {
  [pageKey: string]: {
    view?: boolean;
    create?: boolean;
    update?: boolean;
    delete?: boolean;
  };
}

export interface User {
  email: string;
  name?: string;
  role: UserRole;
  blocked?: boolean;
  profileImage?: string;
  permissions?: PermissionsObject;
}

// Auth related interfaces
export interface LoginResponse {
  success: boolean;
  user?: User;
  error?: string;
}

// Form related interfaces
export interface IFormInputs {
  email: string;
  password: string;
}

// Patient related interfaces
export interface PersonalInfo {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  contact_number: string;
  email: string;
  address: Address;
  bloodType?: string; // Added bloodType field
}

export interface Surgery {
  surgery_name: string;
  surgery_date: string;
}

export interface Medication {
  medication_name: string;
  dosage: string;
  frequency: string;
}

export interface MedicalHistory {
  chronic_diseases: string[];
  previous_surgeries: Surgery[];
  medications: Medication[];
  allergies: string[];
  family_medical_history: string[];
}

export interface CurrentHealthStatus {
  height_cm: number;
  weight_kg: number;
  blood_pressure: string;
  heart_rate: number;
  current_symptoms: string[];
}

export interface PatientData {
  patient_id: string;
  personal_info: PersonalInfo;
  medical_history: MedicalHistory;
}

// Visit related interfaces
export interface Visit {
  visit_id: string;
  date: string; // ISO date string
  reason: string;
  doctor: string;
  notes: string;
}

// Patient with visits
export interface PatientWithVisits extends PatientData {
  visits: Visit[];
}

// Component Props interfaces
export interface LoginFormProps {
  onLogin: (user: User) => void;
}

export interface PatientHistoryProps {
  patientData?: PatientData;
}

export interface EditPatientModalProps {
  open: boolean;
  onClose: () => void;
  patient: PatientData;
  onSave: (patient: PatientData) => Promise<void>;
}

export interface PrintModalProps {
  open: boolean;
  onClose: () => void;
  patient: PatientData;
}

export interface PrintablePatientRecordProps {
  patient: PatientData;
}

export interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  patientName: string;
  patientId: string;
}

export interface ContactInfoCardProps {
  contactInfo: PersonalInfo;
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
} 