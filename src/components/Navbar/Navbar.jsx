import React, { useContext } from 'react'
import { signOut } from 'firebase/auth';
import { auth, db } from '../../environments/firebase';
import { AuthContext } from '../context/AuthContext';
import './Navbar.scss';
import { useNavigate } from 'react-router-dom';
import { updateDoc, doc } from 'firebase/firestore';

export const Navbar = () => {
  //getting the data about the user from the firebase
  const { currentUser } = useContext(AuthContext);
  const navigator = useNavigate();

  return (
    <div className="navbarContainer">
      <span className="logo">A&D&D Chat</span>
      <div className="userContainer">
        <div className='userProfile'>

          <img src={currentUser.photoURL} alt="user's avatar" />
          <div className="userName" onClick={() => { navigator('profile') }}>
            <p>{currentUser.displayName}</p>
            <p>Profile</p>
          </div>
        </div>
        <button onClick={async () => {
          await updateDoc(doc(db, "users", currentUser.uid), {
            online: false,
          })
          signOut(auth)
        }
        }>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;