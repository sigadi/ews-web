import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

console.log("FIREBASE PROJECT ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);


const app = getApps().length ? getApp() : initializeApp(config);

export const db = getFirestore(app);
export const auth = getAuth(app);