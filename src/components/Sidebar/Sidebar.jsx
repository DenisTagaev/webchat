import React from 'react'
import Navbar  from '../Navbar/Navbar';
import Search from '../Search/Search';
import Chats from '../Chats/Chats';

import './Sidebar.scss';

export const Sidebar = () => {
  return (
    <div className="sidebar">
      <Navbar/>
      <Search/>
      <Chats/>
    </div>
  )
}

export default Sidebar;