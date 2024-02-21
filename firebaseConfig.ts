// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMEFJz4iv2OY5ZSsGTT66u9Zr6hv2zjC8",
  authDomain: "apace-step.firebaseapp.com",
  projectId: "apace-step",
  storageBucket: "apace-step.appspot.com",
  messagingSenderId: "278291444932",
  appId: "1:278291444932:web:0dbb063fdf9ff816bd8591",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
