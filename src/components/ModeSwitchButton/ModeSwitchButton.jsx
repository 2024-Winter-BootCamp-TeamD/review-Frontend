import React from "react";
import PropTypes from "prop-types";
import "./ModeSwitchButton.css";
import GalaxyBackground from "../GalaxyBackground/galaxyBackground.jsx";

const DarkMode = ({ onToggle, isDarkMode }) => {
  const handleToggle = () => {
    onToggle(!isDarkMode);
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {/* 다크 모드일 때만 GalaxyBackground 표시 */}
      {isDarkMode && <GalaxyBackground isVisible={isDarkMode} />}
      
      <div className="wrapper">
        <div className="toggle">
          <input
            className="toggle-input"
            type="checkbox"
            checked={isDarkMode}
            onChange={handleToggle}
          />
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

DarkMode.propTypes = {
  onToggle: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
};

export default DarkMode;
