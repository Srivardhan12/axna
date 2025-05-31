import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCpznFrsgRXGTukIJoneiidr3d_7AGd8GE",
    authDomain: "axna-9497f.firebaseapp.com",
    projectId: "axna-9497f",
    storageBucket: "axna-9497f.firebasestorage.app",
    messagingSenderId: "817587121645",
    appId: "1:817587121645:web:9c98f4629b86e81abf8be4",
    measurementId: "G-50EJGS08NJ"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);