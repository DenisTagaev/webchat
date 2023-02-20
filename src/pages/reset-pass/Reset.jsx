import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../../firebase'
import './Reset.scss'

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
        <div className="resetContainer">
            <div className="resetWrap">
                <span className="title">Reset Password</span>
                <form className="resetForm" onSubmit={handleSubmit}>
                    <input className="resetInput" type="email" placeholder='email' />
                    <button id="resetSubmit" type="submit">Reset</button>
                </form>
                {/* for the react router `Link to` is used instead of `a href="#"` */}
                <p>Don't have an account?<Link to="/register">Register</Link></p>
            </div>
        </div>
    )
}
