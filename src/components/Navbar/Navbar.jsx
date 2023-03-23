import React, { useContext } from 'react'
import { signOut } from 'firebase/auth';
import { auth } from '../../environments/firebase';
import { AuthContext } from '../context/AuthContext';
import './Navbar.scss';

export const Navbar = () => {
  //getting the data about the user from the firebase
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="navbarContainer">
      <span className="logo">A&D&D Chat</span>
      <div className="userContainer">
        <img src={currentUser.photoURL} alt="user's avatar" />
        {/* <img src="https://upload.wikimedia.org/wikipedia/en/a/a0/Grogu_%28Star_Wars%29.jpg" alt="user's avatar" /> */}
        <span>{currentUser.displayName}</span>
        <button onClick={() => signOut(auth)}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;