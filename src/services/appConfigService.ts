import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface AppConfig {
  roles: string[];
  pages: { key: string; label: string }[];
  rolePermissions: Record<string, string[]>;
}

export const fetchAppConfig = async (): Promise<AppConfig> => {
  const docRef = doc(db, 'app-config', 'permissions');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as AppConfig;
  }
  throw new Error('App config not found');
}; 