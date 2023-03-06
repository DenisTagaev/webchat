import React, { useContext, useState, useEffect } from 'react';

import { useNavigate } from "react-router-dom";

// auth 
import { AuthContext } from '../../components/context/AuthContext';
import { reauthenticateWithCredential, updateProfile, updatePassword, EmailAuthProvider } from 'firebase/auth';

// storage
import { storage } from '../../environments/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// firestore
import { db } from '../../environments/firebase';
import { doc, updateDoc } from "firebase/firestore";

// styles
// external file styles
import './Profile.scss';

// Reac- bootstrap components 
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

// react icons
import { AiFillEdit } from 'react-icons/ai';
import { MdFileUpload } from 'react-icons/md';
import { GrReturn } from 'react-icons/gr';

import AddImg from '../../imgs/addAvatar.png';

const Profile = () => {

    // User context for current user
    const { currentUser } = useContext(AuthContext);

    const navigator = useNavigate();

    /*
        UseStates profile changes
    */

    // default avatar png       
    const [avatarUrl, setAvatarUrl] = useState(AddImg);

    // States for data changing
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState(currentUser.displayName);

    const [changeNameAccess, setChangeNameAccess] = useState(false)
    const [passwordChangeLoginAccess, setPasswordChangeLoginAccess] = useState(false);
    const [passwordChangeAccess, setPasswordChangeAccess] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        newPassword: "",
        repeatNewPassword: ""
    });

    // Error states
    const [formErrors, setFormErrors] = useState({});

    //  useEffects for profile avatar and nickname rendering
    useEffect(() => {

        const unsub = setUserName(currentUser.displayName);
        return () => {
            console.log("re-rendered")
            return unsub;
        }
    }, [currentUser])

    useEffect(() => {
        const unsub = setAvatarUrl(currentUser.photoURL);

        return () => {
            console.log("re-rendered")
            return unsub
        }
    }, [currentUser])


    const handleAvatarChange = (e) => {
        if (e.target.files[0]) {
            setPhoto(e.target.files[0]);
        }
    }

    const handleUpload = () => {
        handleAvatarUpload(photo);
        setPhoto(null);
    }

    // async function for image upload
    const handleAvatarUpload = async (file) => {
        // we create a reference of a file
        const fileRef = ref(storage, currentUser.uid + ".png")
        console.log(fileRef)
        // Loading state for image upload
        setLoading(true);

        // added a task listener for uploadbytesresumable.
        const uploadTask = uploadBytesResumable(fileRef, file);
        uploadTask.on(
            (error) => {
                // Assessing error in case
                console.log(error)
            }, () => {
                // recieving URL of an image and then updating profile photoURL
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    await updateProfile(currentUser, { photoURL: downloadURL }).then(() => {
                        setLoading(false);
                    });
                });
            }
        )
        //alerting about the upload finsihed
        alert("File was uploaded")
    }

    // nickname input functionality
    const handleNameChange = (event) => {
        const { name, value } = event.target;
        setUserName(value)
        const newErrors = validateFormField(name, value);

        setFormErrors({
            ...formErrors,
            [name]: newErrors[name],
        });
    }

    const handleNameChangeSubmit = async (event) => {
        event.preventDefault();
        validateDataField(userName);
        const newErrors = validateDataField(userName);
        setFormErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            await updateProfile(currentUser, { displayName: userName });
            console.log(currentUser)
            setUserName('');
            setChangeNameAccess(!changeNameAccess);
        }
    }

    const handleFormLoginChange = (event) => {
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

    const handleFormLoginSubmit = async (event) => {
        event.preventDefault();
        const newErrors = validateFormField(formData);
        setFormErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            // call login function
            try {
                const credential = EmailAuthProvider.credential(
                    formData.email,
                    formData.password
                );
                reauthenticateWithCredential(currentUser, credential).then((res) => {
                    // User re-authenticated.
                    // Code...
                    console.log(res)
                    setPasswordChangeAccess(!passwordChangeAccess);
                    setPasswordChangeLoginAccess(!passwordChangeLoginAccess);
                });
            } catch (error) {
                console.log(error.message);
            }
        }

    }

    const handlePasswordInput = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        const newErrors = validateFormField(name, value);
        setFormErrors({
            ...formErrors,
            [name]: newErrors[name],
        });
    }

    const handleNewPasswordSubmit = () => {
        console.log(formData)
        updatePassword(currentUser, formData.newPassword).then(() => {
            alert("Password updated, please log in.")
        }).catch((error) => {
            // An error ocurred
            console.log(error)
            // ...
        });
    }

    const validateFormField = (name, value) => {
        const errors = {};

        if (name === "nickname") {
            if (!value.trim()) {
                errors.nickname = "Nickname is required";
            }
        } else if (name === "email") {
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
        if (name === "newPassword") {
            if (!value.trim()) {
                errors.newPassword = "Password is required";
            } else if (value.length < 6) {
                errors.newPassword = "Password must be at least 6 characters";
            }
        } else if (name === "repeatNewPassword") {
            if (value !== formData.newPassword) {
                errors.repeatNewPassword = "Passwords do not match";
            }
        }
        return errors;
    };

    const validateDataField = (data) => {
        const errors = {};

        if (data) {
            if (!data.trim()) {
                errors.nickname = "Nickname is required";
            }
            return errors
        }
    }

    return (
        <div className="profileContainer">
            <div className="profileWrap">
                <button onClick={() => navigator('/')} className="iconBtn" id='homeReturn' >Home</button>
                <div className="profileBody">
                    <Tabs
                        defaultActiveKey="desc"
                        id="uncontrolled-tab-example"
                        className="mb-3"
                        justify
                    >
                        <Tab eventKey="desc" title="Profile">
                            <div className="profileAvatar">
                                <div id="avatarContainer">
                                    <img src={avatarUrl} alt="avatar" id='avatarImage' />
                                    <div id='avatarInputContainer'>
                                        <span className='profileTitle'>Change Avatar Picture</span>
                                        <input type="file" id='avatarInput' onChange={handleAvatarChange} className="profileInput" />
                                        <button disabled={loading || !photo} onClick={handleUpload} className='iconBtn'><MdFileUpload /></button>
                                    </div>
                                </div>
                            </div>
                            <div className="profileName">
                                {!changeNameAccess && <div>
                                    <span className='profileTitle'>{currentUser.displayName}</span>
                                    <button className='iconBtn' onClick={() => { setChangeNameAccess(!changeNameAccess) }} ><AiFillEdit /><span>Change Nickname</span></button>
                                </div>}
                                {formErrors.nickname && (
                                    <span className="formError">{formErrors.nickname}</span>
                                )}
                                {changeNameAccess &&
                                    <form className="resetForm" onSubmit={handleNameChangeSubmit}>
                                        <input
                                            className="profileInput"
                                            type="text"
                                            name="nickname"
                                            value={userName}
                                            placeholder="Display name"
                                            onChange={handleNameChange}
                                        />
                                        <button className='iconBtn' type="submit" disabled={formErrors.nickname || !userName}><AiFillEdit /></button>
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
                                <h3>Password change</h3>
                                {!passwordChangeLoginAccess | !passwordChangeAccess &&
                                    <button className='submitBtn' onClick={() => { setPasswordChangeLoginAccess(!passwordChangeLoginAccess); }} disabled={passwordChangeAccess}>Open form</button>
                                }
                                {passwordChangeLoginAccess &&
                                    <form className="passwordForm" onSubmit={handleFormLoginSubmit}>
                                        <input
                                            className="profileInput"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            placeholder="Email"
                                            onChange={handleFormLoginChange}
                                        />
                                        {formErrors.email && <span className="formError">{formErrors.email}</span>}
                                        <input
                                            className="profileInput"
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            placeholder="Password"
                                            onChange={handleFormLoginChange}
                                        />
                                        {formErrors.password && (
                                            <span className="formError">{formErrors.password}</span>
                                        )}
                                        <button className="iconBtn" type="submit" disabled={formErrors.email || formErrors.password}><AiFillEdit />Log in</button>
                                    </form>
                                }
                                {passwordChangeAccess &&
                                    <form className="passwordForm" onSubmit={handleNewPasswordSubmit}>
                                        <input
                                            className="profileInput"
                                            type="password"
                                            name='newPassword'
                                            value={formData.newPassword}
                                            placeholder='Password'
                                            onChange={handlePasswordInput}
                                        />
                                        {formErrors.newPassword && (
                                            <span className="formError">{formErrors.newPassword}</span>
                                        )}
                                        <input
                                            className="profileInput"
                                            type="password"
                                            name='repeatNewPassword'
                                            value={formData.repeatNewPassword}
                                            placeholder='Repeat'
                                            onChange={handlePasswordInput}
                                        />
                                        {formErrors.repeatNewPassword && (
                                            <span className="formError">{formErrors.repeatNewPassword}</span>
                                        )}
                                        <button className='submitBtn' type="submit">Change Password</button>
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