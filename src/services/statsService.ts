import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "./firebase";

export const fetchDashboardStats = async () => {
  const [patientsSnap, usersSnap, therapistsSnap] = await Promise.all([
    getCountFromServer(collection(db, "patients")),
    getCountFromServer(collection(db, "users")),
    getCountFromServer(collection(db, "therapists")),
  ]);
  return {
    totalPatients: patientsSnap.data().count,
    totalUsers: usersSnap.data().count,
    totalTherapists: therapistsSnap.data().count,
  };
}; 