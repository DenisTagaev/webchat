import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXaP0enFNNFMlxqWrCZkI01jAlgqiU4Yw",
  authDomain: "chat-app-44f8f.firebaseapp.com",
  projectId: "chat-app-44f8f",
  storageBucket: "chat-app-44f8f.appspot.com",
  messagingSenderId: "73211875719",
  appId: "1:73211875719:web:7fc4662a3bc49e6551c322"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage();