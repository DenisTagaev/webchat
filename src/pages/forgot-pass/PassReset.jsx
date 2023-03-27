import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import Logbar from '../../components/Logbar/Logbar';

import './PassReset.scss';
import { auth } from '../../environments/firebase';

const PassReset = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const navigator = useNavigate();

    const handleChange = (event) => {
        const value = event.target.value;
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
            sendPasswordResetEmail(auth, email)
                .then(() => {
                    alert('Restore Letter has been send');
                    navigator('/login');
                },
                    err => alert(err.message))
                .catch(err => console.log(err));
        }
    }

    return (
        <div className="resetContainer">
            <Logbar />
            <div className="resetWrap">
                <span className="title">Reset Password</span>
                <form className="resetForm" onSubmit={handleSubmit}>
                    <input
                        className="resetInput"
                        type="email"
                        placeholder='Email'
                        onChange={handleChange}
                    />
                    {error &&
                        <span className="formError">{error}</span>}
                    <button id="resetSubmit" type="submit">Send Link</button>
                </form>
            </div>
        </div>
    )
}

export default PassReset;