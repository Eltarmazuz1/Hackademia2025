import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";  // <--- import storage

const firebaseConfig = {
  apiKey: "AIzaSyA_P7z1ZDEdGBmYSVCje0dyzhUUVp_lsoo",
  authDomain: "hackademia-7b062.firebaseapp.com",
  projectId: "hackademia-7b062",
  storageBucket: "hackademia-7b062.appspot.com",  // <--- fix bucket URL
  messagingSenderId: "356769156079",
  appId: "1:356769156079:web:a5e63e4010ce01e8bb441a",
  measurementId: "G-ENRJ1BG1TH"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);  // <--- export storage
