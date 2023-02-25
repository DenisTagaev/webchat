import React, { useContext } from 'react'
import { signOut } from 'firebase/auth';
import { auth } from '../environments/firebase';
import { AuthContext } from '../context/AuthContext';

export const Navbar = () => {
  // user context 
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="navbarContainer">
      <span className="logo">Logo</span>
      <div className="userContainer">
        <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" />
        <span>D&D</span>
        {/*  Basis for a profile info  */}
        {/* <img src={currentUser.photoURL} alt="avatar" />
        <span>{currentUser.displayName}</span> */}
        <button onClick={() => signOut(auth)}>Logout</button>
      </div>
    </div>
  )
}

export default Navbar;