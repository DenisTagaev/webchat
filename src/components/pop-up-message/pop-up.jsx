import React from "react";
import "./pop-up.scss";

function NotImplementedPopup({ onClose }) {
  return (
    <div className="not-implemented-popup">
      <div className="popup-content">
        <p>This feature is not yet implemented. Check back later for updates.
        </p>
        <button className="popup-close" onClick={onClose}></button>
      </div>
    </div>
  );
}

export default NotImplementedPopup;
