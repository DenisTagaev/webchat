
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
import { doc, getDoc, updateDoc } from "firebase/firestore";

// styles
// external file styles
import './Profile.scss';

// react icons
import { AiFillEdit } from 'react-icons/ai';

import AddImg from "../../imgs/addAvatar.png";

// modal component
import PromptingCloud from '../../components/AvatarChangeBox/AvatarChangeBox';
import BugForm from '../../components/BugForm/BugForm';


const Profile = () => {

    // User context for current user
    const { currentUser } = useContext(AuthContext);

    const navigator = useNavigate();

    /*
        UseStates profile changes
    */
    // tab state 
    const [toggleState, setToggleState] = useState(1);
    // default avatar png       
    const [avatarUrl, setAvatarUrl] = useState(currentUser.photoURL ? currentUser.photoURL : AddImg);



    // States for data changing
    const [photo, setPhoto] = useState(null);
    const [userName, setUserName] = useState(currentUser.displayName);

    const [avatarChangeAccess, setAvatarChangeAccess] = useState(true);
    const [changeNameAccess, setChangeNameAccess] = useState(false);
    const [descriptionChangeAccess, setDescriptionChangeAccess] = useState(false);
    const [passwordChangeLoginAccess, setPasswordChangeLoginAccess] = useState(false);
    const [passwordChangeAccess, setPasswordChangeAccess] = useState(false);
    const [bugFormAccess, setBugFormAccess] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        newPassword: "",
        repeatNewPassword: ""
    });

    // profile description 
    const [desc, setDesc] = useState({
        age: 0,
        location: "Somewhere",
        career: "Someone",
        hobbies: "Something",
        maritalStatus: "No idea",
    });

    // Error states
    const [formErrors, setFormErrors] = useState({});
    const [fileError, setFileError] = useState(null);

    //  useEffects for profile avatar and nickname rendering
    useEffect(() => {
        function fetchAvatar() {
            console.log(currentUser.uid);
            const fileRef = ref(storage, `avatars/${currentUser.uid}/avatar.jpg`);
            if (fileRef) {
                getDownloadURL(fileRef).then(url => {
                    setAvatarUrl(url);
                });
            }
        }

        // description fetching function
        async function fetchDescription() {
            const userDocRef = doc(db, "users", currentUser.uid);
            const userDocSnap = await getDoc(userDocRef);

            try {
                const data = userDocSnap.data()
                if (data.profileDescription) {
                    setDesc(data.profileDescription)
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAvatar();
        fetchDescription();
    }, [currentUser,])


    // avatar change handler, assigns state to the file
    const handleAvatarChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile.type.startsWith('image/')) {
            setFileError('Please select an image file.');
            setPhoto(null);
            console.log(fileError)
            return;
        }
        setFileError(null);
        setPhoto(selectedFile);
    }

    // upload handler
    const handleUpload = () => {
        handleAvatarUpload(photo);
        setPhoto(null);
        setAvatarChangeAccess(!avatarChangeAccess);
    }

    // async function for avatar upload
    const handleAvatarUpload = async (file) => {
        // we create a reference for the fiile
        const avatarRef = ref(storage, `avatars/${currentUser.uid}/avatar.jpg`);
        try {
            await uploadBytesResumable(avatarRef, file).then(() => {
                getDownloadURL(avatarRef).then(url => {
                    setAvatarUrl(url);
                    try {
                        updateProfile(currentUser, { photoURL: url });
                    } catch (error) {
                        console.error('Failed to update user profile with new avatar URL', error)
                    };
                });
            })
        } catch (error) {
            console.error('Failed to upload new avatar', error)
        }
        alert("File was uploaded")
    }

    // nickname input functionality
    const handleNameChange = (event) => {
        const { name, value } = event.target;
        setUserName(value)
        const newErrors = validateFormField(name, value);
        console.log(currentUser)

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
                await reauthenticateWithCredential(currentUser, credential).then((res) => {
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

    const handleNewPasswordSubmit = async () => {
        console.log(formData)
        await updatePassword(currentUser, formData.newPassword).then(() => {
            alert("Password updated, please log in.")
        }).catch((error) => {
            // An error ocurred
            console.log(error)
            // ...
        });
    }

    // local state update
    const handleDescription = (event) => {
        console.log(desc);
        const { name, value } = event.target;
        setDesc({
            ...desc,
            [name]: value,
        });
    }

    // Description update
    const handleDescriptionUpdate = async (event) => {
        event.preventDefault();

        const data = {
            profileDescription: desc,
            // add any other user data to be updated here
        };
        try {
            const documentRef = doc(db, "users", currentUser.uid);
            await updateDoc(documentRef, data);
            console.log("Document updated successfully")
        } catch (error) {
            console.error("Error updating document:", error);
            throw error
        }
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
    // tab toggle function
    const toggleTab = (index) => {
        setToggleState(index);
    }

    // avatarCloud access
    const handleClose = () => {
        setAvatarChangeAccess(!avatarChangeAccess);
    };

    return (
        <div className="profileContainer">
            <div className="profileWrap">
                <button onClick={() => navigator('/')} className="iconBtn" id='homeReturn' >Home</button>
                <div className="profileBody">

                    <div className="block-tabs">
                        <div className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
                            onClick={() => toggleTab(1)}
                        >Profile</div>
                        <div className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
                            onClick={() => toggleTab(2)}
                        >Authentication</div>
                        <div className={toggleState === 3 ? "tabs active-tabs" : "tabs"}
                            onClick={() => toggleTab(3)}
                        >Chats</div>
                    </div>
                    <div className="content-tabs">
                        <div className={toggleState === 1 ? "content active-content" : "content"}>


                            <div className="profileAvatar">
                                <div id="avatarContainer">
                                    <img src={avatarUrl} alt="avatar" id='avatarImage' onClick={() => { setAvatarChangeAccess(!avatarChangeAccess) }} />
                                    <div id='avatarInputContainer'>
                                        {!avatarChangeAccess &&
                                            <div className="shading">
                                                {/*  Component for avatar change  */}
                                                <PromptingCloud
                                                    handleClose={handleClose}
                                                    handleUpload={handleUpload}
                                                    handleAvatarChange={handleAvatarChange}
                                                />
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="profileName">
                                {!changeNameAccess && <div>
                                    <span className='profileTitle'>{currentUser.displayName}</span>
                                    <button className='iconBtn' onClick={() => { setChangeNameAccess(!changeNameAccess) }} ><span>Change Nickname</span><AiFillEdit /></button>
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
                            <div className="profileDescContainer">
                                <div className="profileDesc" hidden={!desc || descriptionChangeAccess}>
                                    <h3>About me</h3>
                                    <div className="profileDescDivs">
                                        <span>Age</span>
                                        {desc.age &&
                                            <p>{desc.age}</p>
                                        }
                                    </div>
                                    <div className="profileDescDivs">
                                        <span>Location</span>
                                        {desc.location &&
                                            <p>{desc.location}</p>
                                        }
                                    </div>
                                    <div className="profileDescDivs">
                                        <span>Marital status</span>
                                        {desc.maritalStatus &&
                                            <p>{desc.maritalStatus}</p>
                                        }
                                    </div>
                                    <div className="profileDescDivs">
                                        <span>Career</span>
                                        {desc.career &&
                                            <p>{desc.career}</p>
                                        }
                                    </div>
                                    <div className="profileDescDivs">
                                        <span>Hobbies</span>
                                        {desc.hobbies &&
                                            <p>{desc.hobbies}</p>
                                        }
                                    </div>

                                </div>
                                <div hidden={descriptionChangeAccess}>
                                    <div>
                                        <button className='iconBtn' onClick={() => { setDescriptionChangeAccess(true) }}>Change info<AiFillEdit /></button>
                                    </div>
                                </div>

                                <div className="profileDesc" hidden={!descriptionChangeAccess}>
                                    <h3>Add something new</h3>
                                    <form onSubmit={handleDescriptionUpdate} className='descForm'>
                                        <input
                                            name='age'
                                            type="number"
                                            className='descInput'
                                            onChange={handleDescription}
                                            value={desc.age}
                                        />
                                        <input
                                            name='location'
                                            type="text"
                                            className='descInput'
                                            onChange={handleDescription}
                                            value={desc.location}
                                        />
                                        <select
                                            name='maritalStatus'
                                            className='descInput'
                                            onChange={handleDescription}
                                            value={desc.maritalStatus}
                                        >
                                            <option>Single</option>
                                            <option>Married</option>
                                            <option>Separated</option>
                                            <option>Divorced</option>
                                            <option>Widowed</option>
                                        </select>
                                        <input
                                            name='career'
                                            type="text"
                                            className='descInput'
                                            onChange={handleDescription}
                                            value={desc.career}
                                        />
                                        <input
                                            name='hobbies'
                                            type="text"
                                            className='descInput'
                                            onChange={handleDescription}
                                            value={desc.hobbies}
                                            placeholder="Enter your hobbies"
                                        />
                                        <button className='iconBtn' type='submit' onClick={() => { setDescriptionChangeAccess(false) }}>
                                            <span>
                                                Submit
                                                <AiFillEdit />
                                            </span>
                                        </button>
                                    </form>
                                </div>

                            </div>
                        </div>
                        <div className={toggleState === 2 ? "content active-content" : "content"}>
                            <div className="usefulForms">
                                <h3>Useful forms</h3>
                                <div className="passwordChange">
                                    {!passwordChangeLoginAccess | !passwordChangeAccess &&
                                        <button className='iconBtn formBtn' onClick={() => { setPasswordChangeLoginAccess(!passwordChangeLoginAccess); }} disabled={passwordChangeAccess}>Change your password</button>
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
                                            <button className="iconBtn" type="submit" disabled={formErrors.email || formErrors.password}>Log in<AiFillEdit /></button>
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
                                <div className="bugReportContainer">
                                    <button className='iconBtn formBtn' onClick={() => { setBugFormAccess(!bugFormAccess) }}>Open a bug form</button>
                                    {bugFormAccess && <BugForm currentUser={currentUser} />}
                                </div>
                            </div>
                        </div>
                        {/*  Chats managing  */}
                        <div className={toggleState === 3 ? "content active-content" : "content"}>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile