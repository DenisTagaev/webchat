import React, { useContext } from 'react'
// import Add  from "../../../imgs/add.png";
// import Cam  from "../../../imgs/cam.png";
// import More  from "../../../imgs/more.png";
import { BsPersonPlus } from 'react-icons/bs';
import { BsCameraVideo } from "react-icons/bs";
import { CgMore } from 'react-icons/cg';

import Messages from '../../Messages/Messages';
import Input from '../../Input/Input';

import { ChatContext } from "../../context/ChatContext";

export const Chat = () => {

  const { data } = useContext(ChatContext);

  return (
    <div className="chatContainer">
      <div className="chatInfo">
        {/* show the user you are chatting with */}
        <span>{data.user?.displayName}</span>
        <div className="chatIcons">
          {/* <img src={Cam} alt="" />
          <img src={Add} alt="" />
          
          <img src={More} alt="" /> */}
          <BsCameraVideo/>
          <BsPersonPlus />
          <CgMore/>
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
}

export default Chat;