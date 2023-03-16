import React, { useState, useEffect, useContext } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../environments/firebase';
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from '../context/ChatContext';


export const Chats = () => {
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  //set user's chats to display
  const [chats, setChats] = useState([]);

  //on load fetch realtime data from the user's chats collection 
  useEffect(() => {
    const getChats = () => {
      const unsubscribe = onSnapshot(doc(db, "userChats", currentUser.uid),
      (doc) => {
        //get user's chats from the database
        setChats(doc.data());
      }
      );
      return () => unsubscribe();
    }
    //set chats array only if there's a user
    currentUser.uid && getChats();
  },[currentUser.uid]);

  const handleUserSelect = (userInfo) => {
    //when the user is selecting another chat switch the information shown
    dispatch({type: "CHANGE_USER", payload: userInfo})
  }

  return (
    <div className="chatsContainer">
      {/* For each of the dispatched chats show the avatar of the user
      and the last message */}
      {Object.entries(chats??{})
      // show the chat with the latest message first
        .sort((a, b) => b[1].date - a[1].date)
        .map((chat) => (
          <div
            className="userChat"
            key={chat[0]}
            onClick={() => handleUserSelect(chat[1].userInfo)}
          >
            <img src={chat[1].userInfo.photoURL} alt="user's avatar" />
            <div className="userChatInfo">
              <span>{chat[1].userInfo.displayName}</span>
              <p>{chat[1].lastMessage?.text}</p>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Chats;