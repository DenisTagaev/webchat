import React from 'react'
import Add  from "../imgs/add.png";
import Cam  from "../imgs/cam.png";
import More  from "../imgs/more.png";
import Messages from './Messages';
import Input from './Input';

export const Chat = () => {
  return (
    <div className="chatContainer">
      <div className="chatInfo">
        <span>D&D</span>
        <div className="chatIcons">
          <img src={Cam} alt="" />
          <img src={Add} alt="" />
          <img src={More} alt="" />
        </div>
      </div>
      <Messages/>
      <Input/>
    </div>
  )
}

export default Chat;