import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext';
import './Profile.scss';

const Profile = () => {
    // User context
    const { currentUser } = useContext(AuthContext);

    // Local user  info for change
    const [userInfo, setUserInfo] = useState({
        photoURL: currentUser.photoURL,
        name: currentUser.displayName,
        email: currentUser.email
    })

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserInfo({
            ...userInfo,
            [name]: value,
        });
        //after user input validate that field matches the requirements
        const newErrors = validateField(name, value);
        setErrors({
            ...errors,
            [name]: newErrors[name],
        });
    };

    // Code reusage
    const [errors, setErrors] = useState({});

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
        }
        return errors;
    };

    // handle submission, yet to be done
    const handleSubmit = (event) => {
        event.preventDefault();
        const newErrors = validateFormData(userInfo);
        setErrors(newErrors);
        console.log(newErrors);
    }

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
        return errors;
    };

    // states for changing name and email
    const [nameChange, setNameChange] = useState(false);
    const [emailChange, setEmailChange] = useState(false);

    const handleNameInputAccess = () => {
        setNameChange(!nameChange);
    }

    const handleEmailInputAccess = () => {
        setEmailChange(!emailChange);
    }

    // console.log(currentUser);
    return (
        <div className="profileContainer">
            <div className="profileWrap">
                <div className="profilePicture">
                    <img src={currentUser.photoURL} alt="avatar" />
                </div>
                <div className="profileDesc">
                    <div className="profileDisplayName">
                        {/*  When change button pressed, state is value is inverted and input field is accessible  */}
                        <span>{currentUser.displayName}<button onClick={handleNameInputAccess}>Change</button></span>
                        {nameChange &&
                            <input
                                className="registerInput"
                                type="text"
                                name="name"
                                value={userInfo.name}
                                placeholder="name"
                                onChange={handleChange}
                            />
                        }
                        {errors.nickname &&
                            <span className="formError">{errors.nickname}</span>}
                    </div>
                    <div className="profileEmail">
                        <span>{currentUser.email}<button onClick={handleEmailInputAccess}>Change</button></span>
                        {emailChange &&
                            <input
                                className="registerInput"
                                type="email"
                                name="email"
                                value={userInfo.email}
                                placeholder="email"
                                onChange={handleChange}
                            />}
                        {errors.email &&
                            <span className="formError">{errors.email}</span>}
                        {emailChange | nameChange && <button onClick={handleSubmit}>Edit</button>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
