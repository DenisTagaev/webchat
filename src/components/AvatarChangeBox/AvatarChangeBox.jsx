import React from 'react';
import './AvatarChangeBox.scss'

import { MdFileUpload } from 'react-icons/md';
import { MdCancel } from 'react-icons/md';

const PromptingCloud = ({ handleClose, handleAvatarChange, handleUpload }) => {
    return (
        <div className="promptingCloud">
            <h2>Upload New Avatar</h2>
            <input type="file" onChange={handleAvatarChange} className="profileInput" />
            <div className="btnContainer">
                <button onClick={handleUpload} className='iconBtn'><MdFileUpload /></button>
                <button className='iconBtn' onClick={handleClose}><MdCancel /></button>
            </div>
        </div>
    );
};

export default PromptingCloud