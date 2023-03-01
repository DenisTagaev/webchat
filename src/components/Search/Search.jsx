import React from 'react'

export const Search = () => {
  return (
    <div className="searchContainer">
      <div className="searchForm">
        <input type="text" placeholder="Find users"/>
      </div>
      <div className="userChat">
        <img 
          src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
          alt="user's profile"
        />
        <div className="userChatInfo">
          <span>D&D</span>
        </div>
      </div>
    </div>
  )
}

export default Search;