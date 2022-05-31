// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAr9UG-0zZexLpB9vwUv5fwUf2j6Cop03U",
  authDomain: "activitygram-auth.firebaseapp.com",
  projectId: "activitygram-auth",
  storageBucket: "activitygram-auth.appspot.com",
  messagingSenderId: "78872694554",
  appId: "1:78872694554:web:e6a5321c7f81ca40ea26a3"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app()
}

const auth = firebase.auth()

export { auth };