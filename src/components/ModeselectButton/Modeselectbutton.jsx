import React from "react";
import "./Modeselectbutton.css";

function Modeselectbutton({
  description = "Follow coding conventions.",
  modeName = "Clean Code",
}) {
  return (
    <button className="modeselect-button">
      <p className="mode-description">{description}</p>
      <p className="mode-name">{modeName}</p>
    </button>
  );
}

export default Modeselectbutton;
