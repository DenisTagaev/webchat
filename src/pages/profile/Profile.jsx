import React, { useContext, useState, useEffect } from 'react';

// auth 
import { AuthContext } from '../../components/context/AuthContext';
import { updateProfile, sendPasswordResetEmail } from 'firebase/auth';

// storage
import { auth, storage } from '../../environments/firebase';
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

import AddImg from '../../imgs/addAvatar.png';

// image upload function
// in second sprint a good idea would be to trasfer all firebase funtionality every file to firebase.js

const Profile = () => {

    // User context
    const { currentUser } = useContext(AuthContext);

    /*
    User profile functionality
  */

    // default avatar png       
    const [avatarUrl, setAvatarUrl] = useState(AddImg);
    const [photoBinary, setPhotoBinary] = useState(null);
    const [loading, setLoading] = useState(false);

    // username state
    const [userName, setUserName] = useState(currentUser.displayName);

    const [changeData, setChangeData] = useState({
        nickname: ""
        //  changed data object
    })

    useEffect(() => {

        if (currentUser?.photoURL) {
            setAvatarUrl(currentUser.photoURL);
        }
        setUserName(currentUser.displayName);

    }, [currentUser.photoURL, currentUser.displayName])


    const handleChange = (e) => {
        if (e.target.files[0]) {
            setPhotoBinary(e.target.files[0]);
        }
    }

    const handleUpload = () => {
        handleAvatarUpload(photoBinary);
        setPhotoBinary();
    }

    const handleAvatarUpload = async (file) => {
        const fileRef = ref(storage, currentUser.uid + ".png");
        setLoading(true);

        const snapshot = uploadBytesResumable(fileRef, file)

        // accessing the url of the photo
        const photoURL = await getDownloadURL(fileRef)

        updateProfile(currentUser, { photoURL });

        setLoading(false);
        alert("File was uploaded");

    }

    // nickname input functionality
    const handleNameChange = (event) => {
        const { name, value } = event.target;

        setChangeData({
            ...changeData,
            [name]: value,
        })
        console.log(changeData.nickname)
        // Still to add error validation
    }

    //Need to review the rerender of the name

    const handleNameChangeSubmit = (event) => {
        event.preventDefault();
        updateProfile(currentUser, { displayName: changeData.nickname });
        if (event.target[0].value) {
            event.target[0].value = '';
        }
        console.log(currentUser)
    }

    /*
    User auth functionality
    */

    const [emailAuth, setEmailAuth] = useState('');
    const [errorEmailAuth, setErrorEmailAuth] = useState('');

    const validateEmailField = (value) => {

        if (!value.trim()) {
            return 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
            return 'Email is invalid';
        }
        return '';
    };


    const handleEmailAuthChange = (event) => {
        const value = event.target.value;
        setEmailAuth(value);
        //after user input validate that field matches the requirements

        setErrorEmailAuth(validateEmailField(value));
    };


    const handlePassResetSubmit = (event) => {
        event.preventDefault();
        const newError = validateEmailField(emailAuth);

        setErrorEmailAuth(newError);

        if (newError.length === 0) {
            // call submit function
            sendPasswordResetEmail(auth, emailAuth)
                .then(() => {
                    alert('Restore Letter has been send');
                    navigator('/login');
                },
                    err => alert(err.message))
                .catch(err => console.log(err));
        }
    }
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
                                <label id='avatarInput'>
                                    <img src={avatarUrl} alt="avatar" id='avatarImage' />
                                    <input type="file" hidden={true} onChange={handleChange} />
                                </label>
                                {photoBinary && <button onClick={handleUpload}><MdFileUpload /></button>}
                            </div>
                            <div className="profileName">
                                <span>{currentUser.displayName}</span>
                                {<form className="resetForm" onSubmit={handleNameChangeSubmit}>
                                    <input
                                        className="registerInput"
                                        type="text"
                                        name="nickname"
                                        value={changeData.nickname}
                                        placeholder="Display name"
                                        onChange={handleNameChange}
                                    />
                                    <button id="resetSubmit" type="submit"><AiFillEdit /></button>
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
                            <form className="resetForm" onSubmit={handlePassResetSubmit}>
                                <input
                                    className="resetInput"
                                    type="email"
                                    placeholder='Email'
                                    onChange={handleEmailAuthChange}
                                />
                                <button id="resetSubmit" type="submit">Send Link</button>
                                {errorEmailAuth &&
                                    <span className="formError">{errorEmailAuth}</span>}
                            </form>
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
