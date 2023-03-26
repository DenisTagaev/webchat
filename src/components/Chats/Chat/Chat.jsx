import React, { useContext } from "react";
import Messages from "../../Messages/Messages";
import Input from "../../Input/Input";
import { FaVideo } from "react-icons/fa";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { BsThreeDots } from "react-icons/bs";

import "./Chat.scss";

import { ChatContext } from "../../context/ChatContext";

export const Chat = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className="chatContainer">
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
        {/* <span>Jane</span> */}

        <div className="chatIcons">
          <div className="chatIcon">
            <FaVideo />
          </div>
          <div className="chatIcon">
            <BsFillPersonPlusFill />
          </div>
          <div className="chatIcon">
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
