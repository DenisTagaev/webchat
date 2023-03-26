import React, { useState, useContext } from 'react';

// user context
import { AuthContext } from '../../../components/context/AuthContext';

// react icons
import { AiFillEdit } from 'react-icons/ai';

import './BugForm.scss';

export default function BugForm() {

    const { currentUser } = useContext(AuthContext)

    const [mailOptions, setMailOptions] = useState({
        from: "muxamedkali@gmail.com",
        to: "muxamedkali@gmail.com",
        subject: `${currentUser.email}`,
        body: "test"
    });

    const handleMailOptions = (e) => {
        const { name, value } = e.target;
        // console.log(name + ":" + value)
        console.log(mailOptions)
        setMailOptions({
            ...mailOptions,
            [name]: value,
        })
    }

    return (
        <div >
            <h3>Send us your feedback</h3>
            <form className="bugForm">
                <span>Please add the</span>
                <input type="text"
                    value={mailOptions.subject}
                    onChange={handleMailOptions}
                    name="subject"
                    className="bugInput"
                />
                <textarea
                    value={mailOptions.body}
                    onChange={handleMailOptions}
                    name="body"
                >
                </textarea>
            </form>
            <a href={`mailto:${mailOptions.to}?subject=${mailOptions.subject}&body=${mailOptions.body}`}>Send</a>
        </div>
    )
}
