import React, { useState, useEffect, useContext } from "react";
import { onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "../../environments/firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

import './Chats.scss';

export const Chats = () => {
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  //set user's chats to display
  const [chats, setChats] = useState([]);

  // on load fetch realtime data from the user's chats collection
  useEffect(() => {
    const getChats = async () => {
      const unsubscribe = onSnapshot(
        doc(db, "userChats", currentUser.uid),
        (doc) => {
          setChats(doc.data());
        }
      );
      return () => unsubscribe();
    };
    // set chats array only if there's a user
    currentUser.uid && getChats();
  }, [currentUser.uid]);

  // for each chat, check if the user is online and update their user info accordingly
  useEffect(() => {
    chats &&
      Object.entries(chats).forEach((chat) => {
        checkOnline(chat[1].userInfo);
      });
  }, [chats]);

  const handleUserSelect = (userInfo) => {
    dispatch({ type: "CHANGE_USER", payload: userInfo });
  };

  // define a function to update a chat's user info with the online status
  const checkOnline = async (userInfo) => {
    const userDoc = await getDoc(doc(db, "users", userInfo.uid));
    if (userDoc.exists) {
      setChats((prevChats) => {
        const updatedChats = { ...prevChats };
        Object.entries(updatedChats ?? {}).forEach((chat) => {
          if (chat[1].userInfo.uid === userInfo.uid) {
            chat[1].userInfo.isOnline = userDoc.data().online;
          }
        });
        return updatedChats;
      });
    }
  };
  return (
    <div className="chatsContainer">
      {Object.entries(chats ?? {})
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((chat) => (
          <div
            className="userChat"
            key={chat[0]}
            onClick={() => handleUserSelect(chat[1].userInfo)}
          >
            <img src={chat[1]?.userInfo?.photoURL} alt="user's avatar" />
            <div className="userChatInfo">
              <span>{chat[1]?.userInfo?.displayName}</span>
              <p>{chat[1]?.lastMessage?.text}</p>
              {chat[1]?.userInfo?.online && (
                <span className="onlineStatus">Online</span>
              )}
              {!chat[1]?.userInfo?.online && (
                <span className="onlineStatus">offline</span>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default Chats;