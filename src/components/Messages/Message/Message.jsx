import React, { useContext, useEffect, useRef } from 'react';
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import './Message.scss';

export const Message = ({message}) => {
  //getting the data about the user from the firebase
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({behavior: 'smooth'})
  }, [message]);

  return (
    <div
      ref={ref}
      className={`messageContainer ${message.senderId === currentUser.uid && "owner"}`}
      // className="message owner"
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt="profile avatar"
        />
        <span>Just now</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="sent attachment" />}
      </div>
    </div>
  );
}

export default Message;