import React from 'react'

export const Navbar = () => {
  return (
    <div className="navbarContainer">
      <span className="logo">Logo</span>
      <div className="userContainer">
        <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" />
        <span>D&D</span>
        <button>Logout</button>
      </div>
    </div>
  )
}

export default Navbar;