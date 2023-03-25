import React from 'react'
import { Link } from 'react-router-dom';

//react icons


import './NotFound.scss';

export default function NotFound() {
    return (
        <div className="mainbox">
            <div className="err"><span className='first'>4</span><span className="second">O</span><span className='third'>4</span></div>
            <div className="msg">Woops!? Wrong turn you have taken...<br /><p>Maybe go back <Link to='/'>Home</Link> </p></div>
        </div>
    )
}
