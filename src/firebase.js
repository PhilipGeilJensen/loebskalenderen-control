// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBVgxlcnxFbV7phErLTJzh8iFOL-6N_c3g",
    authDomain: "loebskalenderen.firebaseapp.com",
    databaseURL: "https://loebskalenderen.firebaseio.com",
    projectId: "loebskalenderen",
    storageBucket: "loebskalenderen.appspot.com",
    messagingSenderId: "657932764392",
    appId: "1:657932764392:web:c4d9310f5bf73b2160f55d",
    measurementId: "G-YGDQSCBVX3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);


export { auth }