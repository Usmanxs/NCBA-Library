
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
 import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBKRpV8qPtV3Iie2am2zvDHCn7E9-94kE8",
  authDomain: "fir-us-c8a13.firebaseapp.com",
  projectId: "fir-us-c8a13",
  storageBucket: "fir-us-c8a13.appspot.com",
  messagingSenderId: "406381514567",
  appId: "1:406381514567:web:f221c2889ed9c1b6778662"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); 
export const auth = getAuth();
export const db = getFirestore(app)