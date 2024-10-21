// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDH_cTazvbM4JrCVhxde5IH-sp-lCHKap8",
  authDomain: "ligadeestrellas-61ee5.firebaseapp.com",
  projectId: "ligadeestrellas-61ee5",
  storageBucket: "ligadeestrellas-61ee5.appspot.com",
  messagingSenderId: "351280151693",
  appId: "1:351280151693:web:00bdca7d49c74573e236c4"
};

// Inicializa la app de Firebase
const app = initializeApp(firebaseConfig);

// Exporta Firestore para usarlo en el código
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, doc, deleteDoc, updateDoc };