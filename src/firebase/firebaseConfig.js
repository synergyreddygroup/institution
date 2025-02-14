import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBrp6wiQk5C_HrW-q3Hu_Ypzw3K9hSnu0g",
  authDomain: "schoolsdb-6b7c5.firebaseapp.com",
  projectId: "schoolsdb-6b7c5",
  storageBucket: "schoolsdb-6b7c5.firebasestorage.app",
  messagingSenderId: "754514505766",
  appId: "1:754514505766:web:68d584163cf0de1211b6e7",
  measurementId: "G-26HLECR2YX"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
export const db = getFirestore(app); // Firestore instance