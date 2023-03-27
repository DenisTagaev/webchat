import React, { useState } from 'react';

import { useNavigate } from "react-router-dom";

// styles
// external file styles
import './Profile.scss';

import ProfileTab from './ProfileTab/ProfileTab';
import AuthTab from './AuthTab/AuthTab';


const Profile = () => {

    // User context for current user

    const navigator = useNavigate();

    /*
        UseStates profile changes
    */
    // tab state 
    const [tabState, setTabState] = useState("profile");
    // tab toggle function
    const changeTab = (index) => {
        setTabState(index);
    }

    return (
        <div className="profileContainer">
            <div className="profileWrap">
                <button onClick={() => navigator('/')} className="iconBtn"><span id='homeReturn'>Back to Main</span></button>
                <div className="profileBody">

                    <div className="block-tabs">
                        <div className={tabState === "profile" ? "tabs active-tabs" : "tabs"}
                            onClick={() => changeTab("profile")}
                        >Profile</div>
                        <div className={tabState === "auth" ? "tabs active-tabs" : "tabs"}
                            onClick={() => changeTab("auth")}
                        >Authentication</div>
                        <div className={tabState === "friends" ? "tabs active-tabs" : "tabs"}
                            onClick={() => changeTab("friends")}
                        >Friends</div>
                    </div>
                    <div className="content-tabs">
                        <div className={tabState === "profile" ? "content active-content" : "content"}>

                            <ProfileTab />

                        </div>
                        <div className={tabState === "auth" ? "content active-content" : "content"}>

                            <AuthTab />

                        </div>
                        {/*  Chats managing  */}
                        <div className={tabState === "friends" ? "content active-content" : "content"}>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile