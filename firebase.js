import { initializeApp } from 'firebase/app';
import { collection, addDoc } from "firebase/firestore";
import { getFirestore } from 'firebase/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDCqz54iHF5AAWBDXNQOKgw2p8WdbhyITA",
    authDomain: "nearvents-react.firebaseapp.com",
    projectId: "nearvents-react",
    storageBucket: "nearvents-react.appspot.com",
    messagingSenderId: "73445885890",
    appId: "1:73445885890:web:c4ca7e5b12e15edcff785b"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export{ app, db, getFirestore, collection, addDoc}