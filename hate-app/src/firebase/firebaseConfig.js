import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

// Initialize Firebase
let config = {
    apiKey: "AIzaSyA9mG7xdL1hRlxqaktyjEnDF2Xmz7sUPOk",
  authDomain: "hatesome-app.firebaseapp.com",
  projectId: "hatesome-app",
  storageBucket: "hatesome-app.appspot.com",
  messagingSenderId: "312379445507",
  appId: "1:312379445507:web:f3309e3d33032692fe1936",
  measurementId: "G-83TKQJLR10"
};
firebase.initializeApp(config);

const auth = firebase.auth();
const db = firebase.firestore();

export { auth, firebase, db };