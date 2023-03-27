import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import "./Message.scss";

export const Message = ({ message }) => {
  //getting the data about the user from the firebase
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const ref = useRef();

  //function gets the numeric value of time message was sent and converts
  //it back to the human readable format
  const getMessageTime = (message) => {
    // Create a new Date object using the server timestamp
    const date = new Date(message.date.seconds * 1000);
    // Get the local time and date components
    const localTime = date.toLocaleTimeString([], {
      hour12: true,
      hourCycle: "h12",
      hour: "numeric",
      minute: "numeric",
    });
    return localTime;
  };

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={ref}
      className={`messageContainer ${
        message.senderId === currentUser.uid && "owner"
      }`}
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
        <span className="messageTime">{getMessageTime(message)}</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="sent attachment" />}
      </div>
    </div>
  );
};

export default Message;
