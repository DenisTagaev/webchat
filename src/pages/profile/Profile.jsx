import React, { useContext, useState } from 'react';
import { AuthContext } from '../../components/context/AuthContext';
import { storage } from '../../environments/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import './Profile.scss';

// react icon 
import { AiFillEdit } from 'react-icons/ai';

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
    const [formAccess, setFormAccess] = useState(false);
    const [fileChange, setFileChange] = useState(false);

    const handleFormAccess = () => {
        setFormAccess(true);
    }

    const handleFormSubmit = () => {
        setFormAccess(false);
    }

    const handleFileInputAccess = () => {
        setFileChange(!fileChange);
    }

    // yet need to decide the way how it will be better displayed
    // console.log(currentUser);
    return (
        <div className="profileContainer">
            <div className="profileWrap">
                {!formAccess &&
                    <div>
                        <div>
                            <img id="profileImage" className='profileImage' src={currentUser.photoURL} alt="Chose avatar placeholder" onClick={handleFormAccess} />
                        </div>
                        <div className="profileDescription">
                            <div className="profileName" onClick={handleFormAccess}><span>{currentUser.displayName}</span></div>
                            <div className="profileEmail" onClick={handleFormAccess}><span>{currentUser.email}</span></div>
                        </div>
                    </div>
                }
                {/*  Form is being only after state change  */}
                {formAccess && <form className="editForm" onSubmit={handleSubmit}>
                    <label id="profileInput">
                        <img id="profileImage" className='profileImage' src={AddImg} alt="Chose avatar placeholder" />
                        {/* to customize standard input look we hide the input element and wrap it in a
                        label with desired output content */}
                        <input type="file" hidden={true} />
                    </label>
                    {imgError && (
                        <span className="formError">{imgError}</span>
                    )}
                    <input
                        className="registerInput"
                        type="text"
                        name="name"
                        value={userInfo.name}
                        placeholder={currentUser.displayName}
                        onChange={handleChange}
                    />
                    {errors.nickname &&
                        <span className="formError">{errors.nickname}</span>}
                    <button id='profileSubmit' type='submit'><AiFillEdit /></button>
                </form>}
            </div>
        </div>
    )
}

export default Profile
