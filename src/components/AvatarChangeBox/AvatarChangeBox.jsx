import React from 'react';
import './AvatarChangeBox.scss'

import { BiImageAdd } from 'react-icons/bi';
import { MdFileUpload } from 'react-icons/md';
import { MdCancel } from 'react-icons/md';

const PromptingCloud = ({ handleClose, handleAvatarChange, handleUpload }) => {


    return (
        <div className="promptingAvatarChangeCloud">
            <h3>Upload A New Avatar</h3>
            <span>Press on the image icon to add an Avatar</span>
            <br />
            <label>
                <BiImageAdd className="imageInput" />
                {/* to customize standard input look we hide the input element and wrap it in a
                        label with desired output content */}
                <input type="file" hidden={true} onChange={handleAvatarChange} />
            </label>
            <div className="btnContainer">
                <button onClick={handleUpload} className='iconBtn'><MdFileUpload /></button>
                <button className='iconBtn' onClick={handleClose}><MdCancel /></button>
            </div>
        </div>
    );
};

export default PromptingCloud