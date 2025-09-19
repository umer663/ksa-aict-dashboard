import { collection, addDoc, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { HumanBodyRecord } from '../models/types';

const COLLECTION = 'human_body';

export const fetchHumanBodyRecords = async (): Promise<HumanBodyRecord[]> => {
  const colRef = collection(db, COLLECTION);
  const snap = await getDocs(colRef);
  return snap.docs.map(d => {
    const raw = d.data() as any;
    const symptoms = Array.isArray(raw.symptoms) ? raw.symptoms.filter((s: any) => typeof s === 'string') : [];
    const rawMedicine = Array.isArray(raw.medicine) ? raw.medicine : raw.medicine ? [raw.medicine] : [];
    const medicine = rawMedicine.map((m: any) => ({
      options: Array.isArray(m?.options) ? m.options.filter((o: any) => typeof o === 'string') : [],
      note: typeof m?.note === 'string' ? m.note : '',
    }));
    return {
      id: d.id,
      name: typeof raw.name === 'string' ? raw.name : '',
      system: typeof raw.system === 'string' ? raw.system : '',
      description: typeof raw.description === 'string' ? raw.description : '',
      symptoms,
      medicine,
    } as HumanBodyRecord;
  });
};

export const createHumanBodyRecord = async (record: Omit<HumanBodyRecord, 'id'>): Promise<string> => {
  const payload = {
    name: record.name,
    system: record.system,
    description: record.description,
    symptoms: Array.isArray(record.symptoms) ? record.symptoms : [],
    medicine: Array.isArray(record.medicine)
      ? record.medicine.map(m => ({ options: Array.isArray(m.options) ? m.options : [], note: m.note || '' }))
      : [],
  };
  const docRef = await addDoc(collection(db, COLLECTION), payload);
  return docRef.id;
};

export const updateHumanBodyRecord = async (id: string, record: Partial<Omit<HumanBodyRecord, 'id'>>): Promise<void> => {
  const payload: any = { ...record };
  if (payload.symptoms && !Array.isArray(payload.symptoms)) payload.symptoms = [];
  if (payload.medicine && Array.isArray(payload.medicine)) {
    payload.medicine = payload.medicine.map((m: any) => ({ options: Array.isArray(m?.options) ? m.options : [], note: m?.note || '' }));
  }
  await setDoc(doc(db, COLLECTION, id), payload, { merge: true });
};

export const deleteHumanBodyRecord = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTION, id));
};
