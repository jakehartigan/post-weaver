// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
