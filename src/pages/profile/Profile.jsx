import React, { useContext, useState } from 'react';
import { AuthContext } from '../../components/context/AuthContext';
import { storage } from '../../environments/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import './Profile.scss';

import AddImg from '../../imgs/addAvatar.png'
import { updateProfile } from 'firebase/auth';

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
    const [imgError, setImgError] = useState();

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
    const handleSubmit = async (event) => {
        event.preventDefault();
        const newErrors = validateFormData(userInfo);
        setErrors(newErrors);
        console.log(newErrors);

        const avatar = event.target[0].files[0];

        const storageRef = ref(storage, userInfo.name);

        const uploadTask = uploadBytesResumable(storageRef, avatar);

        uploadTask.on(
            (error) => {
                // Handle unsuccessful uploads
                setImgError(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    await updateProfile(currentUser, {
                        displayName: userInfo.name,
                        photoURL: downloadURL,
                    });
                })
            })
    }



    // if (Object.keys(newErrors).length === 0 && avatar) {
    //     await updateProfile(currentUser, {


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
    const [fileChange, setFileChange] = useState(false);

    const handleNameInputAccess = () => {
        setNameChange(!nameChange);
    }

    const handleFileInputAccess = () => {
        setFileChange(!fileChange);
    }



    // console.log(currentUser);
    return (
        <div className="profileContainer">
            <div className="profileWrap">
                <div className="profilePicture">
                    <img src={currentUser.photoURL} alt="avatar" onClick={handleFileInputAccess} />
                    <img id="avatarImage" src={AddImg} alt="Chose avatar placeholder"></img>
                    {fileChange && <input type="file" hidden={true} />}
                    {imgError && (
                        <span className="formError">{imgError}</span>
                    )}
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
                    <div className="profileFilel">
                        <span>{currentUser.email}</span>
                        {fileChange | nameChange && <button onClick={handleSubmit}>Edit</button>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
