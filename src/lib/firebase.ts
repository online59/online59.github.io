// src/lib/firebase.ts
import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  projectId: "devfolio-hub",
  appId: "1:988410147328:web:afe781b5704a927091dee5",
  storageBucket: "devfolio-hub.firebasestorage.app",
  apiKey: "AIzaSyBFhyoq6L8yyRFaYjlxEzcl-Y55ZdaRptQ",
  authDomain: "devfolio-hub.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "988410147328",
  databaseURL: "https://devfolio-hub-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export { db };
