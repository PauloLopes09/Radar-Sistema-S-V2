
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVPToAbw3NZGAJ4wibfhQCv5YRrNgIWVU",
  authDomain: "radarqz-2ae65.firebaseapp.com",
  projectId: "radarqz-2ae65",
  storageBucket: "radarqz-2ae65.appspot.com",
  messagingSenderId: "931339252208",
  appId: "1:931339252208:web:a84f976d16cefa6d632d35"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
