import React, { useState } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { BsPencilSquare } from "react-icons/bs";
import { BsLockFill } from "react-icons/bs";

import "./Logbar.scss";

const Logbar = () => {
  const [selectedOption, setSelectedOption] = useState("login");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="logBarMainContainer">
      <label>
        <input
          type="radio"
          name="option"
          value="login"
          checked={selectedOption === "login"}
          onChange={handleOptionChange}
        />
        <span className="checkmark">
          <BsPersonCircle className="logIcons"/>
          Login
        </span>
      </label>
      <label>
        <input
          type="radio"
          name="option"
          value="register"
          checked={selectedOption === "register"}
          onChange={handleOptionChange}
        />
        <span className="checkmark">
          <BsPencilSquare className="logIcons"/>
          Register
        </span>
      </label>
      <label>
        <input
          type="radio"
          name="option"
          value="forgot"
          checked={selectedOption === "forgot"}
          onChange={handleOptionChange}
        />
        <span className="checkmark"><BsLockFill className="logIcons"/>Forgot Password?</span>
      </label>
    </div>
  );
};

export default Logbar;
