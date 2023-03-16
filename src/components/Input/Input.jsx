import React, { useContext, useState } from 'react'
import { db, storage } from '../../environments/firebase';
import { 
  arrayUnion, 
  doc, 
  serverTimestamp, 
  Timestamp, 
  updateDoc } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { v4 as uuid } from "uuid";

import addAvatar from '../../imgs/addAvatar.png';
import attach from '../../imgs/attach.png';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

export const Input = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSendMessage = async() => {
    //if the message contains attached image upload it to the storage
    if (image) {
      const storageRef = ref(storage, uuid());
      //upload picture to the cloud storage and get it's url
      await uploadBytesResumable(storageRef, image)
        .then(() => {
          getDownloadURL(storageRef).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatID), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      //if there's no attached file send text only
      await updateDoc(doc(db, "chats", data.chatID), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }
    //update the collection of messages for the current user
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatID + ".lastMessage"]: {
        text,
      },
      [data.chatID + ".date"]: serverTimestamp(),
    });
    //update the collection of messages for the target user(friend)
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatID + ".lastMessage"]: {
        text,
      },
      [data.chatID + ".date"]: serverTimestamp(),
    });
    // switch to default message state 
    setText("");
    setImage("");
  }

  return (
    <div className="messageInputContainer">
      <input
        type="text"
        value={text}
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
      />
      <div className="sendOptions">
        <img src={attach} alt="" />
        <label>
          <img src={addAvatar} alt="" />
          <input
            type="file"
            hidden={true}
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Input;