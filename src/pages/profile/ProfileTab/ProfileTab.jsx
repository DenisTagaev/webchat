import React, { useContext, useState, useEffect } from 'react';

// auth 
import { AuthContext } from '../../../components/context/AuthContext';
import { updateProfile } from 'firebase/auth';

// storage
import { storage } from '../../../environments/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// firestore
import { db } from '../../../environments/firebase';
import { doc, getDoc, updateDoc } from "firebase/firestore";

// react icons
import { AiFillEdit } from 'react-icons/ai';

// custom modal
import PromptingCloud from '../../../components/AvatarChangeBox/AvatarChangeBox'; import BugForm from '../BugForm/BugForm';
;

export default function ProfileTab() {

    const { currentUser } = useContext(AuthContext);

    // default avatar png       
    const [avatarUrl, setAvatarUrl] = useState();

    // States for data changing
    const [photo, setPhoto] = useState(null);
    const [userName, setUserName] = useState(currentUser.displayName);

    const [avatarChangeAccess, setAvatarChangeAccess] = useState(true);
    const [changeNameAccess, setChangeNameAccess] = useState(false);
    const [descriptionChangeAccess, setDescriptionChangeAccess] = useState(false);

    // error state
    const [fileError, setFileError] = useState(null);
    const [nameError, setNameError] = useState();

    // profile description 
    const [desc, setDesc] = useState({
        age: 0,
        location: "Somewhere",
        career: "Someone",
        hobbies: "Something",
        maritalStatus: "No idea",
    });

    //  useEffects for profile avatar and nickname rendering
    useEffect(() => {
        (async function () {
            console.log(currentUser.uid);
            try {
                const fileRef = ref(storage, `avatars/${currentUser.uid}/avatar.jpg`);
                if (fileRef) {
                    await getDownloadURL(fileRef).then(url => {
                        setAvatarUrl(url);
                    });
                }
            } catch (error) {
                console.log(error);
            }
        })();

        // description fetching function
        (async function () {


            try {
                const userDocRef = doc(db, "users", currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                const data = userDocSnap.data()
                if (data.profileDescription) {
                    setDesc(data.profileDescription)
                }
            } catch (error) {
                console.log(error);
            }
        })();
    }, [currentUser.uid])


    // avatar change handler, assigns state to the file
    const handleAvatarChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile.type.startsWith('image/')) {
            setFileError('Please select an image file.');
            setPhoto(null);
            console.log(fileError)
            return;
        }
        setFileError();
        setPhoto(selectedFile);
    }

    // upload handler
    const handleUpload = async () => {
        await handleAvatarUpload(photo);
        setPhoto(null);
        setAvatarChangeAccess(!avatarChangeAccess);
    }

    // async function for avatar upload
    const handleAvatarUpload = async (file) => {
        // we create a reference for the fiile
        const avatarRef = ref(storage, `avatars/${currentUser.uid}/avatar.jpg`);
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



    // local description state update
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

    const handleClose = () => {
        setAvatarChangeAccess(!avatarChangeAccess);
    };


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
                <BugForm />
            </div>
        </>
    )
}
