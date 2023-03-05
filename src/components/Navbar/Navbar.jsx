import React, { useContext } from 'react'
import { signOut } from 'firebase/auth';
import { auth } from '../../environments/firebase';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  //getting the data about the user from the firebase
  const { currentUser } = useContext(AuthContext);
  const navigator = useNavigate();

  return (
    <div className="navbarContainer">
      <span className="logo">A&DD Chat</span>
      <div className="userContainer">
        <img src={currentUser.photoURL} alt="user's avatar" />
        <span>{currentUser.displayName}</span>
        <button onClick={() => navigator('/profile')}>Profile</button>
        <button onClick={() => signOut(auth)}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;