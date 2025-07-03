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

export const fetchNonRemoveableUsers = async (): Promise<string[]> => {
  const docRef = doc(db, 'app-config', 'user-defaults');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().nonRemoveableUsers || [];
  }
  return [];
};

export const fetchUserDefaults = async (): Promise<{ defaultRole: string; defaultPermissions: string[] }> => {
  const docRef = doc(db, 'app-config', 'user-defaults');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      defaultRole: data.defaultRole || '',
      defaultPermissions: data.defaultPermissions || [],
    };
  }
  return { defaultRole: '', defaultPermissions: [] };
}; 