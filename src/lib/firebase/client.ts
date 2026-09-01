import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";
import { env } from "../env";

const firebaseConfig = {
  apiKey: env.firebase.apiKey || "AIzaSyDfu0QmOAgOBp7fI0Ek7EP_WABJsdNLlz4",
  authDomain: env.firebase.authDomain || "challenge-705a4.firebaseapp.com",
  projectId: env.firebase.projectId || "challenge-705a4",
  storageBucket: env.firebase.storageBucket || "challenge-705a4.firebasestorage.app",
  messagingSenderId: env.firebase.messagingSenderId || "245483077567",
  appId: env.firebase.appId || "1:245483077567:web:4e98365ca79dbd83446b0a",
  measurementId: env.firebase.measurementId || "G-BNCFPHJQH0",
};

// Singleton Firebase App
export const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Singleton Firestore instance
export const db: Firestore = getFirestore(app);

// Browser-safe Analytics initialization
export let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported && firebaseConfig.measurementId) {
      analytics = getAnalytics(app);
    }
  });
}
