// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyAS5O-SnuIHBfHC3JXEjKpnNV07oAYqO1w",
    authDomain: "sparta-react-week4.firebaseapp.com",
    projectId: "sparta-react-week4",
    storageBucket: "sparta-react-week4.appspot.com",
    messagingSenderId: "1072953661038",
    appId: "1:1072953661038:web:7956b3b3a3af3846e3f87f",
    measurementId: "G-9MJMF5SLXV"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;