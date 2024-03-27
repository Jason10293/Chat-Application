// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDSuvV3mXzEGAb9lHzVbQpg6eqN3lJrTUE",
  authDomain: "chat-application-4e181.firebaseapp.com",
  projectId: "chat-application-4e181",
  storageBucket: "chat-application-4e181.appspot.com",
  messagingSenderId: "966375985382",
  appId: "1:966375985382:web:794bc9ec11d5463d7eeb27",
  measurementId: "G-FFKD4RC8M2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
