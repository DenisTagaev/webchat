import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../../firebase'
import '../InputPages.scss'

export default function Reset() {

    // Password Reset functionality
    const handleSubmit = (e) => {
        e.preventDefault();

        const email = e.target[0].value;

        sendPasswordResetEmail(auth, email)
            .then(() => {
                // Password reset email sent!
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
            });
    }
    return (
        <div className="formContainer">
            <div className="formWrap">
                <span className="title">Reset Password</span>
                <form className="form" onSubmit={handleSubmit}>
                    <input className="formInput" type="email" placeholder='email' />
                    <button id="formSubmit" type="submit">Reset</button>
                </form>
                {/* for the react router `Link to` is used instead of `a href="#"` */}
                <p>Don't have an account?<Link to="/register">Register</Link></p>
            </div>
        </div>
    )
}
