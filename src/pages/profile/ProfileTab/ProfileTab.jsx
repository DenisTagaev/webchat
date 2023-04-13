import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../../components/context/AuthContext';
import { updateProfile } from 'firebase/auth';
import { storage } from '../../../environments/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from '../../../environments/firebase';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { AiFillEdit } from 'react-icons/ai';
import PromptingCloud from '../../../components/AvatarChangeBox/AvatarChangeBox';
import BugForm from '../BugForm/BugForm';
import './ProfileTab.scss';

export default function ProfileTab() {
    const { currentUser } = useContext(AuthContext);

    // Avatar state
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [fileError, setFileError] = useState(null);
    const [avatarChangeAccess, setAvatarChangeAccess] = useState(true);

    // User info state
    const [userName, setUserName] = useState(currentUser.displayName);
    const [nameError, setNameError] = useState(null);
    const [changeNameAccess, setChangeNameAccess] = useState(false);

    // profile description from the db doc 
    const [desc, setDesc] = useState({
        age: 0,
        location: "Somewhere",
        career: "Someone",
        hobbies: "Something",
        maritalStatus: "No idea",
    });
    const [descriptionChangeAccess, setDescriptionChangeAccess] = useState(false);
    // form input description
    const [formDesc, setFormDesc] = useState({
        age: 0,
        location: "",
        career: "",
        hobbies: "",
        maritalStatus: "",
    })

    //  useEffects for profile avatar and nickname rendering
    useEffect(() => {
        (async function () {
            try {
                const fileRef = ref(storage, `${currentUser.uid}`);
                if (fileRef) {
                    await getDownloadURL(fileRef).then(url => {
                        setAvatarUrl(url);
                    });
                }
            } catch (error) {
                console.log(error);
            }
        })();

        (async function () {
            try {
                const userDocRef = doc(db, "users", currentUser.uid);
                getDoc(userDocRef)
                    .then((userDocSnap) => {
                        const data = userDocSnap.data();
                        if (data.profileDescription) {
                            setDesc(data.profileDescription);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } catch (error) {
                console.log(error);
            }
        })();
    },)


    // avatar change handler, assigns state to the file
    const handleAvatarChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile.type.startsWith('image/')) {
            setFileError('Please select an image file.');
            setPhoto(null);
            alert(fileError)
            return;
        }
        setFileError();
        setPhoto(selectedFile);
    }

    // upload handler
    const handleUpload = async () => {
        try {
            await handleAvatarUpload(photo);
            setPhoto(null);
            setAvatarChangeAccess(!avatarChangeAccess);
        } catch (error) {
            console.error('Failed to upload new avatar', error);
        }
        alert("File was uploaded")
    }


    // async function for avatar upload
    const handleAvatarUpload = async (file) => {
        // we create a reference for the fiile
        const avatarRef = ref(storage, `${currentUser.uid}`);
        try {
            await uploadBytesResumable(avatarRef, file).then(async () => {
                await getDownloadURL(avatarRef).then(async url => {
                    setAvatarUrl(url);
                    try {
                        await updateProfile(currentUser, { photoURL: url });
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





    // Description update
    const handleDescriptionUpdate = async (event) => {
        event.preventDefault();

        const data = {
            profileDescription: formDesc,
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

    const handleClose = () => {
        setAvatarChangeAccess(!avatarChangeAccess);
    };

    // local description state update
    const handleDescription = (event) => {
        console.log(formDesc);
        const { name, value } = event.target;
        setFormDesc({
            ...formDesc,
            [name]: value,
        });
    }
    // nickname input functionality
    const handleNameChange = (event) => {
        const { name, value } = event.target;
        setUserName(value)
        const newError = validateNameField(name, value);
        console.log(currentUser)

        setNameError(newError);
    }

    const handleNameChangeSubmit = async (event) => {
        event.preventDefault();

        if (!nameError) {
            await updateProfile(currentUser, { displayName: userName });
            console.log(currentUser)
            setChangeNameAccess(!changeNameAccess);
        }
    }

    const validateNameField = (name, value) => {
        const error = {};
        if (name === "nickname") {
            if (!value.trim()) {
                error.nickname = "Nickname is required";
            }
            return error.nickname;
        };
    }
    return (
        <>
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
                {nameError && (
                    <span className="formError">{nameError}</span>
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
                        <button className='iconBtn' type="submit" disabled={nameError || !userName}><AiFillEdit /></button>
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
                    <div hidden={descriptionChangeAccess}>
                        <button className='iconBtn' id='changeDescBtn' onClick={() => { setDescriptionChangeAccess(true) }}>Change info<AiFillEdit /></button>
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
                            value={formDesc.age}
                            placeholder={desc.age}
                        />
                        <input
                            name='location'
                            type="text"
                            className='descInput'
                            onChange={handleDescription}
                            value={formDesc.location}
                            placeholder={desc.location}
                        />
                        <select
                            name='maritalStatus'
                            className='descInput'
                            onChange={handleDescription}
                            value={formDesc.maritalStatus}
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
                            value={formDesc.career}
                            placeholder={desc.career}
                        />
                        <input
                            name='hobbies'
                            type="text"
                            className='descInput'
                            onChange={handleDescription}
                            value={formDesc.hobbies}
                            placeholder={desc.hobbies}
                        />
                        <button className='iconBtn' type='submit' onClick={() => { setDescriptionChangeAccess(false) }}>
                            <span>
                                Submit
                                <AiFillEdit />
                            </span>
                        </button>
                    </form>
                </div>
                <BugForm />
            </div>
        </>
    )
}
