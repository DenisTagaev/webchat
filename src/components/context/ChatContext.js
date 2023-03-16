import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthContext";
//creating a prop to share user received from the firebase across the app
export const ChatContext = createContext();

//a provider which will share the user prop with any component it wraps
export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  //create an id for the chat depending on the id of the users
  const createGroup = (user, friend) => {
    if (user.uid > friend.uid) {
      return user.uid + friend.uid;
    } else {
      return friend.uid + user.uid;
    }
  };
  
    //setting the prop
  const INITIAL_STATE = {
    chatID:"null",
    user:{}
  }
  //create function to update the INITIAL_STATE depending
  // on the type of the action
  const chatReducer = (state, action) => {
    switch(action.type) {
        case "CHANGE_USER":
            return {
                user:action.payload,
                chatID:createGroup(currentUser, action.payload),
            };
        default: 
            return state;
    }
  }

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  //returning the JSX wrapper
  return (
    <ChatContext.Provider value={{ data:state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
