import React, { useContext } from 'react';
import { AuthContext } from "../../context/AuthContext";

export const Message = () => {
  //getting the data about the user from the firebase
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="messageContainer owner">
      <div className="messageInfo">
        <img src={currentUser.photoURL} alt="profile avatar" />
        <span>Just now</span>
      </div>
      <div className="messageContent">
        <p>Hello!</p>
        <img
          src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="send attachment"
        />
      </div>
    </div>
  );
}

export default Message;