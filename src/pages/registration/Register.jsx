import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AddImg from '../../imgs/addAvatar.png';
import './Register.scss';


const Register = () => {
    
    // we will need navigation when the firebase will be connected
    // const navigator = useNavigate();

    return (
        <div className="registerContainer">
            <div className="registerWrap">
                <span className="title">Register</span>
                <form className="registerForm">
                    <input className="registerInput" type="text" placeholder='display name'/>
                    <input className="registerInput" type="email" placeholder='email'/>
                    <input className="registerInput" type="password" placeholder='password'/>
                    <label id="avatarInput">
                        <img id="avatarImage" src={AddImg} alt="Chose avatar placeholder" />
                        <span>Chose avatar</span>
                        {/* to customize standard input look we hide the input element and wrap it in a
                        label with desired output content */}
                        <input type="file" hidden="true"/>
                    </label>
                    <button id="registerSubmit" type="submit">Sign up</button>
                </form>
            {/* for the react router `Link to` is used instead of `a href="#"` */}
            <p>Already have an account?<Link to="/login">Login</Link></p>
            </div>
        </div>
    )
}
export default Register;