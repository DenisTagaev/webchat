import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.scss';

const Login = () => {
    // we will need navigation when the firebase will be connected
    // const navigate = useNavigate();
    return (
        <div className="loginContainer">
            <div className="loginWrap">
                <span className="title">Login</span>
                <form className="loginForm">
                    <input className="loginInput" type="email" placeholder='email'/>
                    <input className="loginInput" type="password" placeholder='password'/>
                    <button id="loginSubmit" type="submit">Sign in</button>
                </form>
            {/* for the react router `Link to` is used instead of `a href="#"` */}
            <p>Don't have an account?<Link to="/register">Register</Link></p>
            </div>
        </div>
    )
}
export default Login;