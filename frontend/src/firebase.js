// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHj_4vwj8DY95n5kyj9I9CAu0a7jq1aJk",
  authDomain: "siliconxhacks2024.firebaseapp.com",
  projectId: "siliconxhacks2024",
  storageBucket: "siliconxhacks2024.appspot.com",
  messagingSenderId: "81266451699",
  appId: "1:81266451699:web:98763f5505dab0873c4386"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 
export default app; 