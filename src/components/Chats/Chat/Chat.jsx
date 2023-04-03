import React, { useContext } from 'react';
import Messages from '../../Messages/Messages';
import Input from '../../Input/Input';
import { FaVideo } from 'react-icons/fa';
import { BsFillPersonPlusFill } from 'react-icons/bs';
import { BsThreeDots } from 'react-icons/bs';

import './Chat.scss';

import { ChatContext } from '../../context/ChatContext';

function warning() {
  const popupWindow = window.open('', 'warning', 'width=400,height=300');
  popupWindow.document.write('<p>This functionality is still in development.</p>');
}


export const Chat = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className='chatContainer'>
      <div className='chatInfo'>
        <span>{data.user?.displayName}</span>
        {/* <span>Jane</span> */}

        <div className='chatIcons'>
          <div className='chatIcon' onClick={warning}>
            <FaVideo />
          </div>
          <div className='chatIcon' onClick={warning}>
            <BsFillPersonPlusFill />
          </div>
          <div className='chatIcon' onClick={warning}>
            <BsThreeDots />
          </div>
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
