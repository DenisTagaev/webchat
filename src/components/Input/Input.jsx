import React from 'react'
import addAvatar from '../../imgs/addAvatar.png';
import attach from '../../imgs/attach.png';

export const Input = () => {
  return (
    <div className="messageInputContainer">
      <input
        type="text"
        name=""
        id=""
        placeholder="Type something..."
      />
      <div className="sendOptions">
        <img src={attach} alt="" />
        <label>
          <img src={addAvatar} alt="" />
          <input
            type="file"
            name=""
            id=""
            hidden={true}
          />
        </label>
        <button>Send</button>
      </div>
    </div>
  )
}

export default Input;