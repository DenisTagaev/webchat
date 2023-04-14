import React, { useContext, useState } from "react";
import Messages from '../../Messages/Messages';
import Input from '../../Input/Input';
import PopUp from '../../pop-up-message/pop-up';
import { FaVideo } from 'react-icons/fa';
import { BsFillPersonPlusFill } from 'react-icons/bs';
import { BsThreeDots } from 'react-icons/bs';

import './Chat.scss';

import { ChatContext } from '../../context/ChatContext';

export const Chat = () => {
  const { data } = useContext(ChatContext);
  const [showPopup, setShowPopup] = useState(false);

  function handleClick() {
    setShowPopup(true);
  }

  function handleClose() {
    setShowPopup(false);
  }

  return (
    <div className="chatContainer" onClick={showPopup ? handleClose : null}>
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
        {showPopup && <PopUp onClose={handleClose} />}

        <div className="chatIcons">
          <div className="chatIcon">
            <FaVideo onClick={handleClick} />
          </div>
          <div className="chatIcon">
            <BsFillPersonPlusFill onClick={handleClick} />
          </div>
          <div className="chatIcon">
            <BsThreeDots onClick={handleClick} />
          </div>
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
