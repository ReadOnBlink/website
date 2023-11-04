// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3g-4Wi95m2UGhk_OV3jMxYDL48X3iZrI",
  authDomain: "blink-20403.firebaseapp.com",
  projectId: "blink-20403",
  storageBucket: "blink-20403.appspot.com",
  messagingSenderId: "210147498050",
  appId: "1:210147498050:web:cb4a898cc21ba4a023b5db",
  measurementId: "G-RNMXW8PN8T"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);