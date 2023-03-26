import React, { useState } from 'react';

import { useNavigate } from "react-router-dom";

// styles
// external file styles
import './Profile.scss';

// react icons
import { BsArrowReturnLeft } from 'react-icons/bs'

import ProfileTab from './ProfileTab/ProfileTab';
import AuthTab from './AuthTab/AuthTab';


const Profile = () => {

    // User context for current user

    const navigator = useNavigate();

    /*
        UseStates profile changes
    */
    // tab state 
    const [toggleState, setToggleState] = useState("profile");
    // tab toggle function
    const toggleTab = (index) => {
        setToggleState(index);
    }

    return (
        <div className="profileContainer">
            <div className="profileWrap">
                <button onClick={() => navigator('/')} className="iconBtn"><BsArrowReturnLeft id='homeReturn' /></button>
                <div className="profileBody">

                    <div className="block-tabs">
                        <div className={toggleState === "profile" ? "tabs active-tabs" : "tabs"}
                            onClick={() => toggleTab("profile")}
                        >Profile</div>
                        <div className={toggleState === "auth" ? "tabs active-tabs" : "tabs"}
                            onClick={() => toggleTab("auth")}
                        >Authentication</div>
                        <div className={toggleState === "chats" ? "tabs active-tabs" : "tabs"}
                            onClick={() => toggleTab("chats")}
                        >Chats</div>
                    </div>
                    <div className="content-tabs">
                        <div className={toggleState === "profile" ? "content active-content" : "content"}>

                            <ProfileTab />

                        </div>
                        <div className={toggleState === "auth" ? "content active-content" : "content"}>

                            <AuthTab />

                        </div>
                        {/*  Chats managing  */}
                        <div className={toggleState === "chats" ? "content active-content" : "content"}>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile