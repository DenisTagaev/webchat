import React, { useContext, useState, useEffect } from 'react';

// auth 
import { AuthContext } from '../../components/context/AuthContext';
import { reauthenticateWithCredential, updateProfile, updatePassword, EmailAuthProvider } from 'firebase/auth';

// storage
import { storage } from '../../environments/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// styles
// external file styles
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

    const [changeNameAccess, setChangeNameAccess] = useState(false)
    const [passwordChangeLoginAccess, setPasswordChangeLoginAccess] = useState(false);
    const [passwordChangeAccess, setPasswordChangeAccess] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [newPassword, setNewPassword] = useState({
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

    const handleAvatarUpload = async (file) => {
        const fileRef = ref(storage, currentUser.uid + ".png")
        // Loading state for image upload
        setLoading(true);

        uploadBytesResumable(fileRef, file)

        // accessing the url of the photo
        const photoURL = await getDownloadURL(fileRef)

        await updateProfile(currentUser, { photoURL }).then(() => {
            setLoading(false);
            if (loading === false) {
                console.log("File was uploaded")
            };
        });

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
        await updateProfile(currentUser, { displayName: userName });
        console.log(currentUser)
        setUserName('');
        setChangeNameAccess(!changeNameAccess);
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
        setNewPassword({
            ...newPassword,
            [name]: value,
        });

        const newErrors = validateFormField(name, value);
        setFormErrors({
            ...formErrors,
            [name]: newErrors[name],
        });
    }

    const handleNewPasswordSubmit = () => {
        updatePassword(currentUser, newPassword.newPassword).then(() => {
            // Update successful.
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
            if (value !== newPassword.password) {
                errors.repeatNewPassword = "Passwords do not match";
            }
        }
        return errors;
    };
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
                                    {photo && <button disabled={loading} onClick={handleUpload}><MdFileUpload /></button>}
                                </div>
                            </div>
                            <div className="profileName">
                                {!changeNameAccess && <div>
                                    <span>{currentUser.displayName}</span>
                                    <button id='changeBtn' onClick={() => { setChangeNameAccess(!changeNameAccess) }} ><AiFillEdit /></button>
                                </div>}
                                {formErrors.nickname && (
                                    <span className="formError">{formErrors.nickname}</span>
                                )}
                                {changeNameAccess &&
                                    <form className="resetForm" onSubmit={handleNameChangeSubmit}>
                                        <input
                                            className="registerInput"
                                            type="text"
                                            name="nickname"
                                            value={userName}
                                            placeholder="Display name"
                                            onChange={handleNameChange}
                                        />
                                        <button id="nameSubmit" type="submit" disabled={formErrors.nickname}><AiFillEdit /></button>
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
                                    <button id='changeBtn' onClick={() => { setPasswordChangeLoginAccess(true); }}>Change Password</button>
                                }
                                {passwordChangeLoginAccess &&
                                    <form className="resetForm" onSubmit={handleFormLoginSubmit}>
                                        <input
                                            className="loginInput"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            placeholder="Email"
                                            onChange={handleFormLoginChange}
                                        />
                                        {formErrors.email && <span className="formError">{formErrors.email}</span>}
                                        <input
                                            className="loginInput"
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            placeholder="Password"
                                            onChange={handleFormLoginChange}
                                        />
                                        {formErrors.password && (
                                            <span className="formError">{formErrors.password}</span>
                                        )}
                                        <button id="loginSubmit" type="submit" disabled={formErrors.email || formErrors.password}><AiFillEdit /></button>
                                    </form>
                                }
                                {passwordChangeAccess && <form className="resetForm" onSubmit={handleNewPasswordSubmit}>
                                    <input
                                        className="resetInput"
                                        type="password"
                                        name='newPassword'
                                        value={newPassword.newPassword}
                                        placeholder='Password'
                                        onChange={handlePasswordInput}
                                    />
                                    {formErrors.newPassword && (
                                        <span className="formError">{formErrors.newPassword}</span>
                                    )}
                                    <input
                                        className="resetInput"
                                        type="password"
                                        name='repeatNewPassword'
                                        value={newPassword.repeatNewPassword}
                                        placeholder='Repeat'
                                        onChange={handlePasswordInput}
                                    />
                                    {formErrors.repeatNewPassword && (
                                        <span className="formError">{formErrors.repeatNewPassword}</span>
                                    )}
                                    <button id="changeBtn" type="submit">Change Password</button>
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