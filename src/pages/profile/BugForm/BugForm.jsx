import React, { useState, useContext } from 'react';
// email service
import *  as nodemailer from 'nodemailer';

// user context 
import { AuthContext } from '../../../components/context/AuthContext';

// react icons
import { AiFillEdit } from 'react-icons/ai';

import './BugForm.scss';

export default function BugForm() {

    const { currentUser } = useContext(AuthContext)

    const [report, setReport] = useState({
        subject: "",
        body: ""
    });

    const sendEmail = (to, subject, body) => {
        // creating a transporter for gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: currentUser.email,
                pass: 'yourgmailpassword'
            }
        });

        // create the email message
        const mailOptions = {
            from: 'yourgmailaddress@gmail.com',
            to: to,
            subject: subject,
            text: body
        };

        // send the email using the transporter
        return transporter.sendMail(mailOptions)
            .then(() => {
                console.log('Email sent successfully!');
            })
            .catch(error => {
                console.error(error);
            });
    };

    async function handleSendEmail(e) {
        e.preventDefault();
        try {
            await sendEmailToRecipient("muxamedkali@gmail.com", "report.subject", "report.body")
                .then(() => console.log('Email sent successfully'))
                .catch(error => console.error(error));
        } catch (error) {
            console.log(error);
        }
    }

    const handleReport = (e) => {
        const { name, value } = e.target;
        console.log(report)
        setReport({
            ...report,
            [name]: value,
        })
    }

    return (
        <div >
            <form className="bugForm" onSubmit={handleSendEmail}>
                <input type="text"
                    value={report.subject}
                    onChange={handleReport}
                    name="subject" />
                <textarea rows={8} cols={20}
                    value={report.body}
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
