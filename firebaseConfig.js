// Importa las funciones necesarias del SDK
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  updateDoc 
} from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDH_cTazvbM4JrCVhxde5IH-sp-lCHKap8",
  authDomain: "ligadeestrellas-61ee5.firebaseapp.com",
  projectId: "ligadeestrellas-61ee5",
  storageBucket: "ligadeestrellas-61ee5.appspot.com",
  messagingSenderId: "351280151693",
  appId: "1:351280151693:web:00bdca7d49c74573e236c4"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta Firestore y Storage para utilizarlos
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, collection, addDoc, getDocs, doc, deleteDoc, updateDoc };
