import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../environments/firebase';
import Logbar from '../../components/Logbar/Logbar';

import './Login.scss';

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  // we need navigation to switch between pages
  const navigator = useNavigate();

  // function looks for the input field when the user starts typing
  // and changes the corresponding data inside the formData
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
    //after user input validate that field matches the requirements
    const newErrors = validateField(name, value);

    setErrors({
      ...errors,
      [name]: newErrors[name],
    });
  };

  //check for the errors in selected input and update the error state
  const validateField = (name, value) => {
    const errors = {};

    if (name === "email") {
      if (!value.trim()) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        errors.email = "Email is invalid";
      }
    } else if (name === "password") {
      if (!value.trim()) {
        errors.password = "Password is required";
      } else if (value.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
    }
    return errors;
  };

  //used on form submit, double checks that all fields are matching the requirements
  const validateFormData = (data) => {
    const errors = {};

    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email is invalid";
    }

    if (!data.password.trim()) {
      errors.password = "Password is required";
    } else if (data.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  //check if there are any errors in the form and if none trigger
  //login to the firebase
  const handleSubmit = async(event) => {
    event.preventDefault();
    const newErrors = validateFormData(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // call login function
      await signInWithEmailAndPassword(auth, formData.email, formData.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);
          navigator("/");
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    }
  };

  return (
    <div className="loginContainer">
      <Logbar />
      <div className="loginWrap">
        <span className="title">WebChat Login</span>
        <form className="loginForm" onSubmit={handleSubmit}>
          {/* <span className="loginIcon"><HiOutlineMail /></span> */}
          <input
            className="loginInput"
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email"
            onChange={handleChange}
          />
          {errors.email && <span className="formError">{errors.email}</span>}
          {/* <span className="loginIcon"><HiKey /></span> */}
          <input
            className="loginInput"
            type="password"
            name="password"
            value={formData.password}
            placeholder="Password"
            onChange={handleChange}
          />
          {errors.password && (
            <span className="formError">{errors.password}</span>
          )}
          <button id="loginSubmit" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
export default Login;