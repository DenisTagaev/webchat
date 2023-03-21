import React from 'react'
import { Link } from 'react-router-dom';

//react icons
import { TbLetterO } from 'react-icons/tb';

import './NotFound.scss';

export default function NotFound() {
    return (
        <div className="mainbox">
            <div className="err"><span className='first'>4</span><TbLetterO className='second' /><span className='third'>4</span></div>
            <div className="msg">Maybe this page moved? Got deleted? Is hiding out in quarantine? Never existed in the first place?<p>Let's go <Link to='/'>Home</Link> </p></div>
        </div>
    )
}
