import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCrAGSbTeRZkB2bIJz7tyXPaepUpFtzvVA",
    authDomain: "inventori-nvchads.firebaseapp.com",
    projectId: "inventori-nvchads",
    storageBucket: "inventori-nvchads.firebasestorage.app",
    messagingSenderId: "312913552975",
    appId: "1:312913552975:web:2260a41a9b1e048f002c3a",
    measurementId: "G-HF8F63WMVE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

