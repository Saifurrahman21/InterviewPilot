import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewpilot-429bb.firebaseapp.com",
  projectId: "interviewpilot-429bb",
  storageBucket: "interviewpilot-429bb.firebasestorage.app",
  messagingSenderId: "915375474187",
  appId: "1:915375474187:web:ed2704197d90ca68cae90e",
};

const app = initializeApp(firebaseConfig);
