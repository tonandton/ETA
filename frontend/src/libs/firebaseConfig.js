// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1I8g4VaKBrgojIAzHTrZwao2XJ4Z5grw",
  authDomain: "eta-pern.firebaseapp.com",
  projectId: "eta-pern",
  storageBucket: "eta-pern.firebasestorage.app",
  messagingSenderId: "750198655371",
  appId: "1:750198655371:web:5bd60be9a9fb0eb193078e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
