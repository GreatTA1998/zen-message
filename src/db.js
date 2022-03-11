// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMj9SsNMKDI9EezOzg_jowsYUOfaCbivc",
  authDomain: "project-z-e00fd.firebaseapp.com",
  projectId: "project-z-e00fd",
  storageBucket: "project-z-e00fd.appspot.com",
  messagingSenderId: "37588438028",
  appId: "1:37588438028:web:82c870a2fe6af985d67229",
  measurementId: "G-W20KMPGM93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default getFirestore()