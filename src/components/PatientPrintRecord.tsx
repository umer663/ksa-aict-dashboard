import React from 'react';
import { PatientData } from '../models/types';

const PatientPrintRecord = ({ patient }: { patient: PatientData | null }) => {
  if (!patient) return null;
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: 32, maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 8 }}>KSA Institute of Colour Therapy</h2>
      <h3 style={{ textAlign: 'center', marginTop: 0, marginBottom: 32 }}>Patient Record</h3>
      <div style={{ marginBottom: 24 }}>
        <strong>Patient Name:</strong> {patient.personal_info.first_name} {patient.personal_info.last_name}<br />
        <strong>Date of Birth:</strong> {patient.personal_info.date_of_birth}<br />
        <strong>Gender:</strong> {patient.personal_info.gender}<br />
        <strong>Blood Type:</strong> {patient.personal_info.bloodType || '-'}<br />
        <strong>Contact Number:</strong> {patient.personal_info.contact_number}<br />
        <strong>Email:</strong> {patient.personal_info.email}<br />
        <strong>Address:</strong> {patient.personal_info.address.street}, {patient.personal_info.address.city}, {patient.personal_info.address.state}, {patient.personal_info.address.country}, {patient.personal_info.address.postal_code}
      </div>
      <div style={{ marginBottom: 24 }}>
        <h4>Medical History</h4>
        <div><strong>Chronic Diseases:</strong>
          <ul>{patient.medical_history.chronic_diseases.map((d, i) => <li key={i}>{d}</li>)}</ul>
        </div>
        <div><strong>Allergies:</strong>
          <ul>{patient.medical_history.allergies.map((a, i) => <li key={i}>{a}</li>)}</ul>
        </div>
        <div><strong>Family Medical History:</strong>
          <ul>{patient.medical_history.family_medical_history.map((f, i) => <li key={i}>{f}</li>)}</ul>
        </div>
        <div><strong>Previous Surgeries:</strong>
          <ul>{patient.medical_history.previous_surgeries.map((s, i) => <li key={i}>{s.surgery_name} ({s.surgery_date})</li>)}</ul>
        </div>
        <div><strong>Medications:</strong>
          <ul>{patient.medical_history.medications.map((m, i) => <li key={i}>{m.medication_name} - {m.dosage} - {m.frequency}</li>)}</ul>
        </div>
      </div>
      <div style={{ textAlign: 'right', fontSize: 12, color: '#888' }}>
        Printed on: {new Date().toLocaleString()}
      </div>
    </div>
  );
};

export default PatientPrintRecord; 