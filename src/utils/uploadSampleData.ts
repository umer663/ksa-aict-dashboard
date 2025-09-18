import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import sampleData from '../../patient-with-visits-sample.json';

export interface SamplePatient {
  patient_id: string;
  therapistIds: string[];
  personal_info: {
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    contact_number: string;
    email: string;
    address: {
      street: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
    bloodType: string;
  };
  medical_history: {
    chronic_diseases: string[];
    previous_surgeries: Array<{
      surgery_name: string;
      surgery_date: string;
    }>;
    medications: Array<{
      medication_name: string;
      dosage: string;
      frequency: string;
    }>;
    allergies: string[];
    family_medical_history: string[];
  };
  visits: Array<{
    visit_id: string;
    visitDate: string;
    doctorId: string;
    symptoms: string;
    diagnosis: string;
    recommendations: string;
    medications: Array<{
      medication_name: string;
      dosage: string;
      frequency: string;
    }>;
  }>;
}

export const uploadSampleData = async (): Promise<void> => {
  try {
    console.log('Starting sample data upload...');
    
    // Upload patients
    for (const patient of sampleData as SamplePatient[]) {
      console.log(`Uploading patient: ${patient.personal_info.first_name} ${patient.personal_info.last_name}`);
      
      // Create patient document
      const patientDocRef = await addDoc(collection(db, 'patients'), {
        personal_info: patient.personal_info,
        medical_history: patient.medical_history,
        therapistIds: patient.therapistIds,
      });
      
      // Update with patient_id
      await setDoc(doc(db, 'patients', patientDocRef.id), {
        patient_id: patientDocRef.id,
        personal_info: patient.personal_info,
        medical_history: patient.medical_history,
        therapistIds: patient.therapistIds,
      }, { merge: true });
      
      // Upload visits for this patient
      if (patient.visits && patient.visits.length > 0) {
        for (const visit of patient.visits) {
          console.log(`  Uploading visit: ${visit.visit_id}`);
          await addDoc(collection(db, 'patients', patientDocRef.id, 'visits'), {
            visit_id: visit.visit_id, // Added missing visit_id field
            visitDate: visit.visitDate,
            doctorId: visit.doctorId,
            symptoms: visit.symptoms,
            diagnosis: visit.diagnosis,
            recommendations: visit.recommendations,
            medications: visit.medications,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    }
    
    console.log('Sample data upload completed successfully!');
  } catch (error) {
    console.error('Error uploading sample data:', error);
    throw error;
  }
};

// Function to create sample therapists (since the sample data references therapist UIDs)
export const createSampleTherapists = async (): Promise<void> => {
  try {
    console.log('Creating sample therapists...');
    
    const sampleTherapists = [
      {
        email: 'amna@example.com',
        name: 'Dr. Amna Khan',
        role: 'Therapist',
        blocked: false,
        profileImage: '',
        permissions: {
          'patient-history': { view: true, create: true, update: true, delete: false },
          'add-patient': { view: true, create: true, update: true, delete: false },
        }
      },
      {
        email: 'ammd@example.com',
        name: 'Dr. Ahmad Ali',
        role: 'Therapist',
        blocked: false,
        profileImage: '',
        permissions: {
          'patient-history': { view: true, create: true, update: true, delete: false },
          'add-patient': { view: true, create: true, update: true, delete: false },
        }
      },
      {
        email: 'therapist@example.com',
        name: 'Dr. Sarah Ahmed',
        role: 'Therapist',
        blocked: false,
        profileImage: '',
        permissions: {
          'patient-history': { view: true, create: true, update: true, delete: false },
          'add-patient': { view: true, create: true, update: true, delete: false },
        }
      }
    ];
    
    for (const therapist of sampleTherapists) {
      console.log(`Creating therapist: ${therapist.name}`);
      await addDoc(collection(db, 'users'), therapist);
    }
    
    console.log('Sample therapists created successfully!');
  } catch (error) {
    console.error('Error creating sample therapists:', error);
    throw error;
  }
};

// Main function to upload all sample data
export const uploadAllSampleData = async (): Promise<void> => {
  try {
    await createSampleTherapists();
    await uploadSampleData();
    console.log('All sample data uploaded successfully!');
  } catch (error) {
    console.error('Error uploading sample data:', error);
    throw error;
  }
}; 