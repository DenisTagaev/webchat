import React, { useState, useContext } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../environments/firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import "./Search.scss";

export const Search = () => {
  const { currentUser } = useContext(AuthContext);

  const { dispatch } = useContext(ChatContext);

  const [username, setUsername] = useState("");
  const [foundUser, setFoundUser] = useState("");
  const [err, setErr] = useState("");

  const { dispatch } = useContext(ChatContext);


  const startSearch = async () => {
    //search for the user in the firebase database
    const fb_query = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );
    //save found user's data into the page's data
    await getDocs(fb_query)
      .then((res) => {
        res.forEach((doc) => {
          setFoundUser(doc.data());
        });
      })
      .catch((err) => {
        //on search error set error to be shown to the user
        setErr(err.message);
      });
  };

  const handleSearch = async (key) => {
    key.code === "Enter" && (await startSearch());
  };

  const handleSelect = async () => {
    //check whether the group(chat in the firestore) exists,
    //if not create a new group
    const chatID = createGroup(currentUser, foundUser);
    try {
      const res = await getDoc(doc(db, "chats", chatID));

      if (!res.exists()) {
        //create a new chat in chats collection without any messages
        await setDoc(doc(db, "chats", chatID), { messages: [] });

        //link the chat to the user
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [chatID + ".userInfo"]: {
            uid: foundUser.uid,
            displayName: foundUser.displayName,
            photoURL: foundUser.photoURL,
          },
          [chatID + ".date"]: serverTimestamp(),
        });
        //link the chat to the friend
        await updateDoc(doc(db, "userChats", foundUser.uid), {
          [chatID + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [chatID + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      alert(err.message);
    }

    dispatch({ type: "CHANGE_USER", payload: foundUser });

    setFoundUser("");
    setUsername("");
  };

  const createGroup = (user, friend) => {
    if (user.uid > friend.uid) {
      return user.uid + friend.uid;
    } else {
      return friend.uid + user.uid;
    }
  };

  return (
    <div className="searchContainer">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find users"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>
      {err && <span>{err}</span>}
      {foundUser && (
        <div className="userChat" onClick={handleSelect}>
          <img src={foundUser.photoURL} alt="user's profile" />
          {/* <img
            src="https://upload.wikimedia.org/wikipedia/en/a/a0/Grogu_%28Star_Wars%29.jpg"
            alt="user's profile"
          /> */}
          <div className="userChatInfo">
            <span>{foundUser.displayName}</span>
            {/* <span>Jane</span> */}
            {/* <p>Hello</p> */}
          </div>
        </div>
      )}

    </div>
  );
};

export default Search;
