import React from "react";
import "./Modeselectbutton.css";

function ModeSelectButton({ description, modeName, isSelected, onClick, modeColor = "333" }) {
  return (
    <button
      className={`modeselect-button ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      <p className="mode-description">{description}</p>
      <p className="mode-name" style={{ color: modeColor }}>
        {modeName}
      </p>
    </button>
  );
}

export default ModeSelectButton;