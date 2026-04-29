import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Tvoj originalni V8 config
const firebaseConfig = {
  apiKey: "AIzaSyDKR7dyv4tLlUgZn8axQ4ObNV8qxTpFEBY",
  authDomain: "ai-tools-pro-smart.firebaseapp.com",
  projectId: "ai-tools-pro-smart",
  storageBucket: "ai-tools-pro-smart.firebasestorage.app",
  messagingSenderId: "687827358510",
  appId: "1:687827358510:web:8e046b604005fac5b9e0bf",
  measurementId: "G-86XYNNT6H8"
};

// Paljenje motora
const app = initializeApp(firebaseConfig);

// Povezivanje baze
export const db = getFirestore(app);

// Premium Google Login podešavanja
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account'
});