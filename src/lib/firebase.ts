
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics"; // Import isSupported for Analytics
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAKnuvHr9iFINpi8Cyn6-NRk9hYJC9r_0M",
  authDomain: "ondoctor-7a789.firebaseapp.com",
  projectId: "ondoctor-7a789",
  storageBucket: "ondoctor-7a789.firebasestorage.app",
  messagingSenderId: "633641928347",
  appId: "1:633641928347:web:0858c97454e4a34334a83e",
  measurementId: "G-YP3ZR5MG2B"
};

// Initialize Firebase
// To avoid reinitializing the app on hot reloads, check if it's already initialized.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Initialize Firebase Analytics if supported
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, analytics };
