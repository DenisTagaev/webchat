import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../environments/firebase';
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
            <div className="loginWrap">
                <span className="title">Login</span>
                <form className="loginForm" onSubmit={handleSubmit}>
                    <input className="loginInput" type="email" placeholder='email'/>
                    <input className="loginInput" type="password" placeholder='password'/>
                    <button id="loginSubmit" type="submit">Sign in</button>
                </form>
            {/* for the react router `Link to` is used instead of `a href="#"` */}
            <p>Don't have an account?<Link to="/register">Register</Link></p>
            <p>Forgot password?<Link to="/passReset">Restore password</Link></p>
            </div>
        </div>
    )
}
export default Login;