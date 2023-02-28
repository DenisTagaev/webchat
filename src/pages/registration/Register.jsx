import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"
import { auth, db, storage } from '../../environments/firebase';
import AddImg from '../../imgs/addAvatar.png';
import './Register.scss';


const Register = () => {
    // setting an object to contain current form values 
    const [formData, setFormData] = useState({
        nickname: '',
        email: '',
        password: '',
        repeatPassword: '',
    });

    // avatar file container
    const [selectedFile, setSelectedFile] = useState(null);

    // setting an object to contain current form errors 
    const [errors, setErrors] = useState({});

    // we will need navigation when the firebase will be connected
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

    //  function for avatar set
    const handleAvatar = (event) => {
        setSelectedFile(event.target.files[0])
    }
    //check if there are any errors in the form and if none trigger
    // registration in the firebase  
    const handleSubmit = (event) => {
        event.preventDefault();
        const newErrors = validateFormData(formData);
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {

            // call submit function
            createUserWithEmailAndPassword(auth, formData.email, formData.password)
                .then(async (userCredential) => {
                    // Signed in 

                    const user = userCredential.user;

                    const storageRef = ref(storage, `files/${selectedFile.name}`);

                    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

                    // Email verfification
                    await sendEmailVerification(auth.currentUser).then(() => {
                        navigator('/');
                    }
                    );
                    if (auth.currentUser.emailVerified) {

                        uploadTask.on(

                            (error) => {
                                //  file size and format validation
                                console.log(error)
                            },
                            () => {

                                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                                    await updateProfile(user, {
                                        displayName: formData.nickname,
                                        photoURL: downloadURL
                                    });

                                    // function setDoc creates a new user doc instance, with unique uid
                                    await setDoc(doc(db, "users", user.uid), {
                                        uid: user.uid,
                                        displayName: user.displayName,
                                        email: user.email,
                                        photoURL: downloadURL,
                                    })
                                    // image file ref creeation

                                    await setDoc(doc(db, "userChats", user.uid), {})
                                });
                            }
                        );

                    }

                    // firestore doc addition


                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;

                    // Error conctat string to output
                    console.log(errorCode + '\n ' + errorMessage)
                });
        }
    };

    //check for the errors in selected input and update the error state
    const validateField = (name, value) => {
        const errors = {};

        if (name === 'nickname') {
            if (!value.trim()) {
                errors.nickname = 'Nickname is required';
            }
        } else if (name === 'email') {
            if (!value.trim()) {
                errors.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(value)) {
                errors.email = 'Email is invalid';
            }
        } else if (name === 'password') {
            if (!value.trim()) {
                errors.password = 'Password is required';
            } else if (value.length < 6) {
                errors.password = 'Password must be at least 6 characters';
            }
        } else if (name === 'repeatPassword') {
            if (value !== formData.password) {
                errors.repeatPassword = 'Passwords do not match';
            }
        }
        return errors;
    };

    //used on form submit, double checks that all fields are matching the requirements
    const validateFormData = (data) => {
        const errors = {};

        if (!data.nickname.trim()) {
            errors.nickname = 'Nickname is required';
        }

        if (!data.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            errors.email = 'Email is invalid';
        }

        if (!data.password.trim()) {
            errors.password = 'Password is required';
        } else if (data.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (data.password !== data.repeatPassword) {
            errors.repeatPassword = 'Passwords do not match';
        }

        return errors;
    };

    return (
        <div className="registerContainer">
            <div className="registerWrap">
                <span className="title">Register</span>
                <form className="registerForm" onSubmit={handleSubmit}>
                    <input
                        className="registerInput"
                        type="text"
                        name="nickname"
                        value={formData.nickname}
                        placeholder="display name"
                        onChange={handleChange}
                    />
                    {errors.nickname &&
                        <span className="formError">{errors.nickname}</span>}
                    <input
                        className="registerInput"
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder="email"
                        onChange={handleChange}
                    />
                    {errors.email &&
                        <span className="formError">{errors.email}</span>}
                    <input
                        className="registerInput"
                        type="password"
                        name="password"
                        value={formData.password}
                        placeholder="password"
                        onChange={handleChange}
                    />
                    {errors.password &&
                        <span className="formError">{errors.password}</span>}
                    <input
                        className="registerInput"
                        type="password"
                        name="repeatPassword"
                        value={formData.repeatPassword}
                        placeholder="password"
                        onChange={handleChange}
                    />
                    {errors.repeatPassword &&
                        <span className="formError">{errors.repeatPassword}</span>}
                    <label id="avatarInput">
                        <img
                            id="avatarImage"
                            src={AddImg}
                            alt="Chose avatar placeholder"
                        />
                        <span>Chose avatar</span>
                        {/* to customize standard input look we hide the input element and wrap it in a
                        label with desired output content */}
                        {/*  passing useState value property */}
                        <input
                            type="file"
                            hidden={true}
                            name="avatarInput"
                            onChange={handleAvatar}
                        />
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