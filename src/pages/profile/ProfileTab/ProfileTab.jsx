import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../../components/context/AuthContext';
import { storage } from '../../../environments/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from '../../../environments/firebase';
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { AiFillEdit } from 'react-icons/ai';
import { BiImageAdd } from 'react-icons/bi';
import './ProfileTab.scss';

export default function ProfileTab() {
    const { currentUser } = useContext(AuthContext);

    // Avatar state
    const [avatarUrl, setAvatarUrl] = useState(currentUser?.photoURL);
    const [fileError, setFileError] = useState(null);

    // User info state
    const [userName, setUserName] = useState(currentUser.displayName);
    const [changeNameAccess, setChangeNameAccess] = useState(false);
    const [nameError, setNameError] = useState(null)

    // profile description from the db doc 

    const [photo, setPhoto] = useState(null);
    const [formDesc, setFormDesc] = useState({
        age: 0,
        location: "",
        career: "",
        hobbies: "",
        maritalStatus: "",
    })

    const [desc, setDesc] = useState({});
    const [descriptionChangeAccess, setDescriptionChangeAccess] = useState(false);
    // form input description

    //  useEffects for profile avatar and nickname rendering

    useEffect(() => {
        const unsub = () => {
            if (currentUser.photoURL) {
                setAvatarUrl(currentUser.photoURL);
            } else { setAvatarUrl("") }
        }
        return unsub()
    }, [currentUser.photoURL])

    useEffect(() => {
        const getUserDesc = async () => {
            const unsub = getDoc(doc(db, "users", currentUser.uid)).then((doc) => {
                const data = doc.data();
                setUserName(data.displayName)
                setDesc(data.profileDescription);
            });
            return () => unsub();
        };
        currentUser.uid && getUserDesc();
    }, [currentUser.uid])


    // avatar change handler, assigns state to the file
    const handleAvatarChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile.type.startsWith('image/')) {
            setFileError('Please select an image file.');
            alert(fileError)
            return setPhoto(null);
        }
        setPhoto(selectedFile);
        setFileError(null);
    }

    // upload handler
    const handleUpload = async () => {
        try {
            // invoking avatar upload function
            await handleAvatarUpload(photo);
            setPhoto(null);
        } catch (error) {
            console.error('Failed to upload new avatar', error);
        }
        alert("File was uploaded")
    }


    // async function for avatar upload
    const handleAvatarUpload = async (file) => {
        // we create a reference for the fiile
        //change before production
        const avatarRef = ref(storage, `${currentUser.uid}/profile/avatar`);
        try {
            await uploadBytesResumable(avatarRef, file).then(async () => {
                await getDownloadURL(avatarRef).then(async url => {
                    setAvatarUrl(url);
                    try {
                        await updateDoc(doc(db, "user", currentUser.uid), {
                            photoURL: url,
                        })
                    } catch (error) {
                        console.error('Failed to update user profile with new avatar URL', error)
                    };
                });
            })
        } catch (error) {
            console.error('Failed to upload new avatar', error)
            alert(error.message)
        }
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
            await updateDoc(doc(db, "users", currentUser.uid), { displayName: userName });
            console.log(currentUser.displayName + "document updated")
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
        <div>
            <div className="profileAvatar">
                <div id="avatarContainer">
                    <label id="avatarInput">
                        <img src={avatarUrl} alt="avatar" id='avatarImage' />
                        <input type="file" hidden={true} onChange={handleAvatarChange} />
                    </label>
                    {photo !== null &&
                        <button onClick={handleUpload} className='iconBtn'><BiImageAdd /></button>
                    }
                </div>
            </div>
            <div className="profileName">
                {!changeNameAccess && <div>
                    <span style={{ fontWeight: 600 }} className='profileTitle'>{userName}</span>
                    <button className='iconBtn' onClick={() => { setChangeNameAccess(!changeNameAccess) }} ><span>Change</span><span><AiFillEdit /></span></button>
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
                    <h4>About me</h4>
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
                    <h4>Add something new</h4>
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
                <div className='bugLink' >
                    <h4>Send us your feedback</h4>
                    <a className='iconBtn' href='mailto:muxamedkali@gmail.com?'>Send an Email</a>
                </div>
            </div>
        </div>
    )
}
