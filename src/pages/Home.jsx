import React from 'react'
import Sidebar from '../components/Sidebar';
import Chat from '../components/Chat';

import './Home.scss';

export default function Home() {
  return (
    <div className="homeContainer">
        {/* app separated for 2 parts containing list of chats and settings/current chat messages */}
        <Sidebar/>
        <Chat/>
    </div>
  )
}
