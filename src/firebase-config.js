// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0Db57YMiOU1KScYiSCn40iWDR4hgSv18",
  authDomain: "biothesis-bfa50.firebaseapp.com",
  databaseURL: "https://biothesis-bfa50-default-rtdb.firebaseio.com",
  projectId: "biothesis-bfa50",
  storageBucket: "biothesis-bfa50.appspot.com",
  messagingSenderId: "182518771131",
  appId: "1:182518771131:web:6f7de6336cf12fc904e89e",
  measurementId: "G-99HTTD70LE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const db2 = getFirestore(app);
export { db, db2 };
