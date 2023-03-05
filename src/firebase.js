// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5V4TFug5Hbe8Phj0R9-OP0ZrzDB8TPUY",
  authDomain: "todo-app-698d9.firebaseapp.com",
  projectId: "todo-app-698d9",
  storageBucket: "todo-app-698d9.appspot.com",
  messagingSenderId: "11648278440",
  appId: "1:11648278440:web:aec5c34d2ee2c29808c79d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
