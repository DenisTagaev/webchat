import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase';
import '../InputPages.scss'

const Login = () => {
    // we will need navigation when the firebase will be connected
    // const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const email = e.target[0].value;
        const password = e.target[1].value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user)
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }
    return (
        <div className="formContainer">
            <div className="formWrap">
                <span className="title">Login</span>
                <form className="form" onSubmit={handleSubmit}>
                    <input className="formInput" type="email" placeholder='email' />
                    <input className="formInput" type="password" placeholder='password' />
                    <button id="formSubmit" type="submit">Sign in</button>
                </form>
                {/* for the react router `Link to` is used instead of `a href="#"` */}
                <p>Don't have an account?<Link to="/register">Register</Link></p>
                <p>Forgot password?<Link to="/reset">Reset</Link></p>
            </div>
        </div>
    )
}
export default Login;