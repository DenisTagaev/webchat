import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../environments/firebase';
import Logbar from '../../components/Logbar/Logbar';
import { HiOutlineMail } from 'react-icons/hi';
import { HiKey } from 'react-icons/hi';

import './Login.scss';

const Login = () => {
    // we will need navigation when the firebase will be connected
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user)
                navigate('/');
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            });
    }

    return (
        <div className="loginContainer">
            <Logbar />
            <div className="loginWrap">
                <span className="title">Login Here</span>
                <form className="loginForm" onSubmit={handleSubmit}>
                    {/* <span className="loginIcon"><HiOutlineMail /></span> */}
                    <input className="loginInput" type="email" placeholder='Email'/>
                    {/* <span className="loginIcon"><HiKey /></span> */}
                    <input className="loginInput" type="password" placeholder='Password'/>
                    <button id="loginSubmit" type="submit">Login</button>
                </form>
            {/* for the react router `Link to` is used instead of `a href="#"` */}
            <p>Don't have an account? <Link to="/register">Register</Link></p>
            <p>Forgot password? <Link to="/passReset">Restore password</Link></p>
            </div>
        </div>
    )
}
export default Login;