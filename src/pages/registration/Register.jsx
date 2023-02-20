import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AddImg from '../../imgs/addAvatar.png';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import '../InputPages.scss';

const Register = () => {
    const [err, setErr] = useState('')

    //Went through the tutorial, added register
    const handleSubmit = (e) => {
        e.preventDefault();

        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];


        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;

                console.log(user)
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                // Error conctat string to output
                setErr(errorCode + '\n ' + errorMessage)
            });
    }

    // we will need navigation when the firebase will be connected
    // const navigator = useNavigate();


    return (
        <div className="formContainer">
            <div className="formWrap">
                <span className="title">Register</span>
                <form className="form" onSubmit={handleSubmit}>
                    <input className="formInput" type="text" placeholder='display name' />
                    <input className="formInput" type="email" placeholder='email' />
                    <input className="formInput" type="password" placeholder='password' />
                    <label id="avatarInput">
                        <img id="avatarImage" src={AddImg} alt="Chose avatar placeholder" />
                        <span>Chose avatar</span>
                        {/* to customize standard input look we hide the input element and wrap it in a
                        label with desired output content */}
                        <input type="file" hidden="true" />
                    </label>
                    <button id="formSubmit" type="submit">Sign up</button>
                </form>
                {err && <span>An error occured: {err}</span>}
                {/* for the react router `Link to` is used instead of `a href="#"` */}
                <p>Already have an account?<Link to="/login">Login</Link></p>
            </div>
        </div>
    )
}
export default Register;