import React from 'react';
import './AvatarChangeBox.scss'

import { MdFileUpload } from 'react-icons/md';

const PromptingCloud = ({ handleClose, handleAvatarChange, handleUpload }) => {
    return (
        <div className="prompting-cloud">
            <h2>Upload New Avatar</h2>
            <input type="file" onChange={handleAvatarChange} className="profileInput" />
            <button onClick={handleUpload} className='iconBtn'><MdFileUpload /></button>
            <button onClick={handleClose}>Cancel</button>
        </div>
    );
};

export default PromptingCloud