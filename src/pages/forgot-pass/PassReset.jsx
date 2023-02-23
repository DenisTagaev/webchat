import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';

const PassReset = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const navigator = useNavigate();

    const handleChange = (event) => {
        const value  = event.target.value;
        setEmail(value);
        //after user input validate that field matches the requirements
        
        setError(validateField(value));
    };

    const validateField = (value) => {
        
        if (!value.trim()) {
            return 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
            return 'Email is invalid';
        }

        return '';
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const newError = validateField(email);
        setError(newError);
        
        if (newError.length === 0) {
        // call submit function
            sendPasswordResetEmail(email)
            .then(() => {
                alert('Restore Letter has been send');
                navigator('/login');
            },
            err => alert(err.message))
            .catch(err=>console.log(err));
        }   
    }

    return (
        <div className="loginContainer">
            <div className="loginWrap">
                <span className="title">Reset Password</span>
                <form className="loginForm" onSubmit={handleSubmit}>
                    <input 
                        className="resetInput"
                        type="email"
                        placeholder='email'
                        onChange={handleChange}
                    />
                    {error && 
                        <span className="formError">{error}</span>}        
                    <button id="resetSubmit" type="submit">Send Link</button>
                </form>
            {/* for the react router `Link to` is used instead of `a href="#"` */}
            <p>Back to the login<Link to="/login">Login</Link></p>
            </div>
        </div>
    )
}

export default PassReset;