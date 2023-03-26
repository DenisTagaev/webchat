import React, { useState, useContext } from 'react';

// email
import *  as nodemailer from 'nodemailer';
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

    // const transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: "muxamedkali@gmail.com",
    //         pass: "MitiAlo8710"
    //     }
    // });

    const sendEmail = () => {
        // create a transporter for Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'muxamedkali@gmail.com',
                pass: 'MitiAlo8710'
            }
        });

        // send the email using the transporter
        return transporter.sendMail(mailOptions)
            .then(() => {
                console.log('Email sent successfully!');
            })
            .catch(error => {
                console.error(error);
            });
    };
    // const sendEmail = async (e) => {
    //     e.preventDefault();
    //     try {
    //         await transporter.sendMail(mailOptions);
    //         console.log('Email sent successfully!');
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    const handleReport = (e) => {
        const { name, value } = e.target;
        console.log(mailOptions)
        setMailOptions({
            ...mailOptions,
            [name]: value,
        })
    }

    return (
        <div >
            <form className="bugForm" onSubmit={sendEmail}>
                <input type="text"
                    value={mailOptions.subject}
                    onChange={handleReport}
                    name="subject" />
                <textarea rows={8} cols={20}
                    value={mailOptions.body}
                    onChange={handleReport}
                    name="body">
                </textarea>
                <button className="iconBtn" type="submit">
                    Submit Report <AiFillEdit />
                </button>
            </form>
        </div>
    )
}
