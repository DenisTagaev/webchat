import React, { useState } from 'react'
// firestore
import { db } from '../../environments/firebase';
import { doc, setDoc } from "firebase/firestore";

// react icons
import { AiFillEdit } from 'react-icons/ai';

import './BugForm.scss';

export default function BugForm({ currentUser }) {

    const [report, setReport] = useState();

    const handleReport = (e) => {
        setReport(e.target.value);
        console.log(report)
    }

    const createBugReport = async (e) => {
        e.preventDefault();
        try {
            await setDoc(doc(db, "bugs", currentUser.uid), {
                bug: report
            });
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div >
            <form className="bugForm" onSubmit={createBugReport}>
                <textarea rows={8} cols={20} value={report} onChange={handleReport}></textarea>
                <button className="iconBtn" type="submit">
                    Submit Report <AiFillEdit />
                </button>
            </form>
        </div>
    )
}
