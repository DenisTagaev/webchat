import { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../environments/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../environments/firebase";

//creating a prop to share user received from the firebase across the app
export const AuthContext = createContext();

//a provider which will share the user prop with any component it wraps
export const AuthContextProvider = ({ children }) => {
    //setting the prop
    const [currentUser, setCurrentUser] = useState({});
    //looking for any changes with authentication
    useEffect(() => {
        //if user logged in/created account/signed out this will
        //trigger updates across all components
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                await updateDoc(doc(db, "users", user.uid), {
                    online: true,
                });
            }
        });
        return () => {
            unsubscribe();
        }
    }, []);
    //returning the JSX wrapper
    return (
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    )
}