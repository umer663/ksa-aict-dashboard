import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1pkCzeBcbEedmViB2n63C9oJYtRORT6Q",
  authDomain: "ksaict-dashboard.firebaseapp.com",
  projectId: "ksaict-dashboard",
  storageBucket: "ksaict-dashboard.firebasestorage.app",
  messagingSenderId: "410511956030",
  appId: "1:410511956030:web:2c21bd304a5976e1ce196f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); 