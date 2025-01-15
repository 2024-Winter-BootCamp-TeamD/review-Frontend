//src/components/ModeSwitchButton/ModeSwitchButton.jsx

import React from "react";
import "./ModeSwitchButton.css";

const ModeSwitchButton = () => {
  return (
    <div className="mode-switch-button">
      <div className="wrapper">
        <div className="toggle">
          <input className="toggle-input" type="checkbox" />
          <div className="toggle-bg"></div>
          <div className="toggle-switch">
            <div className="toggle-switch-figure"></div>
            <div className="toggle-switch-figureAlt"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeSwitchButton;
