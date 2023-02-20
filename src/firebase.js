import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyADzR_4SZGDFJTui8hPQM0YOWQ8WkTlZuw",
    authDomain: "webchat-48e37.firebaseapp.com",
    projectId: "webchat-48e37",
    storageBucket: "webchat-48e37.appspot.com",
    messagingSenderId: "701842443697",
    appId: "1:701842443697:web:9253b9587ca858714e8190",
    measurementId: "G-6SY8SLK1JT"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
