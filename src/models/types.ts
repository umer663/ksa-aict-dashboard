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
  patient_id?: string;
  personal_info: PersonalInfo;
  medical_history: MedicalHistory;
  therapistIds?: string[]; // Array of therapist UIDs associated with this patient
}

// Visit related interfaces
export interface Visit {
  visit_id: string;
  visitDate: string; // Changed from 'date' to 'visitDate' to match sample
  doctorId: string; // Changed from 'doctor' to 'doctorId' to match sample
  symptoms: string; // Changed from 'reason' to 'symptoms' to match sample
  diagnosis: string; // Added diagnosis field to match sample
  recommendations: string; // Changed from 'notes' to 'recommendations' to match sample
  medications: Medication[]; // Added medications array to match sample
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

// Human Body collection types
export interface HumanBodyMedicine {
  options: string[];
  note: string;
}

export interface HumanBodyEntry {
  id?: string; // Firestore doc id
  name: string;
  system: string;
  description: string;
  symptoms: string[];
  medicine: HumanBodyMedicine[];
}

export interface HumanBodyMedicineOption {
  options: string[];
  note: string;
}

export interface HumanBodyRecord {
  id?: string; // Firestore document id
  name: string;
  system: string;
  description: string;
  symptoms: string[];
  medicine: HumanBodyMedicineOption[];
}