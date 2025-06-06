
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
<<<<<<< HEAD
import { getAnalytics, isSupported } from "firebase/analytics"; // Import isSupported for Analytics
=======
>>>>>>> 8114eb7daf1f0662f29907bfaf501e9cbb413a74
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
<<<<<<< HEAD
const firebaseConfig = {
  apiKey: "AIzaSyAKnuvHr9iFINpi8Cyn6-NRk9hYJC9r_0M",
  authDomain: "ondoctor-7a789.firebaseapp.com",
  projectId: "ondoctor-7a789",
  storageBucket: "ondoctor-7a789.firebasestorage.app",
  messagingSenderId: "633641928347",
  appId: "1:633641928347:web:0858c97454e4a34334a83e",
  measurementId: "G-YP3ZR5MG2B"
=======
// IMPORTANT: Replace these with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID" // Optional: if you use Analytics
>>>>>>> 8114eb7daf1f0662f29907bfaf501e9cbb413a74
};

// Initialize Firebase
// To avoid reinitializing the app on hot reloads, check if it's already initialized.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

<<<<<<< HEAD
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
=======
export { app, auth };
>>>>>>> 8114eb7daf1f0662f29907bfaf501e9cbb413a74
