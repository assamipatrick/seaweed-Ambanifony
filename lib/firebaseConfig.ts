import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Configuration Firebase
// Credentials from Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB58GKPIQvikVbaEeiyGNZHrtzFPRgb1UE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "seafarm-mntr.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://seafarm-mntr-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "seafarm-mntr",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "seafarm-mntr.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "860357255311",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:860357255311:web:00d1f44c1940c3a64f50fa",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-HGH1652SE0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
export const database = getDatabase(app);

// Initialize Authentication
export const auth = getAuth(app);

export default app;
