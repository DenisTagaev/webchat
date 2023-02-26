import React, { useState, useEffect } from "react";
import { useLocation, useNavigate} from "react-router-dom";
import { BsPersonCircle } from "react-icons/bs";
import { BsPencilSquare } from "react-icons/bs";
import { BsLockFill } from "react-icons/bs";

import "./Logbar.scss";

const Logbar = () => {
  //control of radio buttons
  const [selectedOption, setSelectedOption] = useState('');

  const location = useLocation();

  useEffect(() => {
    setSelectedOption(location.pathname);
  }, [location]);

  const navigate = useNavigate();
  
  
  const handleOptionChange = (event) => {
    navigate(`${event.target.value}`);
  };

  return (
    <div className="logBarMainContainer">
      {/* login button */}
      <label>
        <input
          type="radio"
          name="option"
          value="/login"
          checked={selectedOption === "/login"}
          onChange={handleOptionChange}
        />
        <span className="logCheckmark">
          <BsPersonCircle className="logIcons" />
          Login
        </span>
      </label>
      {/* register button */}
      <label>
        <input
          type="radio"
          name="option"
          value="/register"
          checked={selectedOption === "/register"}
          onChange={handleOptionChange}
        />
        <span className="logCheckmark">
          <BsPencilSquare className="logIcons" />
          Register
        </span>
      </label>
      {/* pass reset button */}
      <label>
        <input
          type="radio"
          name="option"
          value="/passReset"
          checked={selectedOption === "/passReset"}
          onChange={handleOptionChange}
        />
        <span className="logCheckmark">
          <BsLockFill className="logIcons" />
          Forgot Password?
        </span>
      </label>
    </div>
  );
};

export default Logbar;
