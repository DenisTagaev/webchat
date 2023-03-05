import React, { useContext, useState, useEffect } from 'react';

// auth 
import { AuthContext } from '../../components/context/AuthContext';
import { reauthenticateWithCredential, updateProfile, updatePassword } from 'firebase/auth';

// storage
import { storage } from '../../environments/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// styles
// external page styles
import './Profile.scss';

// Reac- bootstrap components 
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

// react icons
import { AiFillEdit } from 'react-icons/ai';
import { MdFileUpload } from 'react-icons/md';
// import { GrReturn } from 'react-icons/gr';

import AddImg from '../../imgs/addAvatar.png';

const Profile = () => {

    // User context for current user
    const { currentUser } = useContext(AuthContext);

    /*
        UseStates profile changes
    */

    // default avatar png       
    const [avatarUrl, setAvatarUrl] = useState(AddImg);

    // States for data changing
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState(currentUser.displayName);

    const [passwordChangeLoginAccess, setPasswordChangeLoginAccess] = useState(false);
    const [passwordChangeAccess, setPasswordChangeAccess] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [newPassword, setNewPassword] = useState({
        password: "",
        repeatPassword: ""
    });
    const [newPasswordError, setNewPasswordError] = useState({});
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (currentUser.photoURL) {
            setAvatarUrl(currentUser.photoURL);
        }
        if (currentUser.displayName) {
            setUserName(currentUser.displayName);
        }

    }, [currentUser])


    const handleAvatarChange = (e) => {
        if (e.target.files[0]) {
            setPhoto(e.target.files[0]);
        }
    }

    const handleUpload = () => {
        handleAvatarUpload(photo);
        setPhoto();
    }

    const handleAvatarUpload = async (file) => {
        const fileRef = ref(storage, currentUser.uid + ".png");

        // Loading state for image upload
        setLoading(true);

        uploadBytesResumable(fileRef, file)

        // accessing the url of the photo
        const photoURL = await getDownloadURL(fileRef)

        updateProfile(currentUser, { photoURL });

        setLoading(false);
        if (loading === false) {
            alert("File was uploaded")
        };
    }

    // nickname input functionality
    const handleNameChange = (event) => {
        setUserName(event.target.value)
        console.log(userName)
        // Still to add error validation
    }

    const handleNameChangeSubmit = async (event) => {
        event.preventDefault();
        await updateProfile(currentUser, { displayName: userName });
        console.log(currentUser)
    }

    /*
    User auth functionality
    */

    const handleFormChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
        //after user input validate that field matches the requirements
        const newErrors = validateFormField(name, value);

        setFormErrors({
            ...formErrors,
            [name]: newErrors[name],
        });
    };

    const handlePasswordInput = (event) => {
        const { name, value } = event.target;
        setNewPassword({
            ...newPassword,
            [name]: value,
        });

        const newErrors = validatePasswordField(name, value);
        setNewPasswordError({
            ...newPasswordError,
            [name]: newErrors[name],
        });
    }

    const handleNewPasswordSubmit = () => {
        // updatePassword(currentUser, newPassword.password)

    }

    const validateFormField = (name, value) => {
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

    const validatePasswordField = (name, value) => {
        const errors = {};
        if (name === "newPassword") {
            if (!value.trim()) {
                errors.password = "Password is required";
            } else if (value.length < 6) {
                errors.password = "Password must be at least 6 characters";
            }
        } else if (name === "repeatNewPassword") {
            if (value !== newPassword.password) {
                errors.repeatPassword = "Passwords do not match";
            }
        }
        return errors;
    };
    // const validateEmailField = (value) => {

    //     if (!value.trim()) {
    //         return 'Email is required';
    //     } else if (!/\S+@\S+\.\S+/.test(value)) {
    //         return 'Email is invalid';
    //     }
    //     return '';
    // };


    // const handleEmailAuthChange = (event) => {
    //     const value = event.target.value;
    //     setEmailAuth(value);
    //     //after user input validate that field matches the requirements

    //     setErrorEmailAuth(validateEmailField(value));
    // };


    // const handlePassResetSubmit = (event) => {
    //     event.preventDefault();
    //     const newError = validateEmailField(emailAuth);

    //     setErrorEmailAuth(newError);

    //     if (newError.length === 0) {
    //         // call submit function
    //         sendPasswordResetEmail(auth, emailAuth)
    //             .then(() => {
    //                 alert('Restore Letter has been send');
    //                 navigator('/login');
    //             },
    //                 err => alert(err.message))
    //             .catch(err => console.log(err));
    //     }
    // }
    return (
        <div className="profileContainer">
            <div className="profileWrap">

                <div className="profileBody">
                    <Tabs
                        defaultActiveKey="desc"
                        id="uncontrolled-tab-example"
                        className="mb-3"
                        justify
                    >
                        <Tab eventKey="desc" title="Profile">
                            <div className="profileAvatar">
                                <div id="avatarInput">
                                    <img src={avatarUrl} alt="avatar" id='avatarImage' />
                                    <input type="file" id='avatarInput' onChange={handleAvatarChange} />
                                    {photo && <button onClick={handleUpload}><MdFileUpload /></button>}
                                </div>
                            </div>
                            <div className="profileName">
                                <span>{currentUser.displayName}</span>
                                {<form className="resetForm" onSubmit={handleNameChangeSubmit}>
                                    <input
                                        className="registerInput"
                                        type="text"
                                        name="nickname"
                                        value={userName}
                                        placeholder="Display name"
                                        onChange={handleNameChange}
                                    />
                                    <button id="nameSubmit" type="submit"><AiFillEdit /></button>
                                </form>}
                            </div>
                            <div className="profileDesc">
                                <span>
                                    {/*  Add description part to document write functionality  */}
                                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cum praesentium reprehenderit earum molestiae adipisci, a consectetur expedita quos id inventore enim dolores cumque nihil, veritatis delectus laboriosam eligendi at architecto?</p>
                                </span>
                            </div>
                        </Tab>
                        <Tab eventKey="auth" title="Authentication">
                            <div className="passwordChange">
                                {!passwordChangeLoginAccess & !passwordChangeAccess &&
                                    <button id='changePasswordBtn' onClick={() => {
                                        setPasswordChangeLoginAccess(true);
                                        alert("Please, login first to change your password");
                                    }}>Change Password</button>
                                }
                                {passwordChangeLoginAccess &&
                                    <form>
                                        <input
                                            className="loginInput"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            placeholder="Email"
                                            onChange={handleFormChange}
                                        />
                                        <input
                                            className="loginInput"
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            placeholder="Password"
                                            onChange={handleFormChange}
                                        />
                                    </form>
                                }
                                {passwordChangeAccess && <form className="resetForm" onSubmit={handleNewPasswordSubmit}>
                                    <input
                                        className="resetInput"
                                        type="password"
                                        name='newPassword'
                                        value={newPassword.password}
                                        placeholder='Password'
                                        onChange={handlePasswordInput}
                                    />
                                    <input
                                        className="resetInput"
                                        type="password"
                                        name='repeatNewPassword'
                                        value={newPassword.repeatPassword}
                                        placeholder='Repeat'
                                        onChange={handlePasswordInput}
                                    />
                                    <button id="changePasswordBtn" type="submit">Change Password</button>
                                </form>}
                            </div>
                        </Tab>
                        <Tab eventKey="chats" title="Chats">
                            {/*  Chats managing  */}
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

export default Profile