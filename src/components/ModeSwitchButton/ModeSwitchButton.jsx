//src/components/ModeSwitchButton/ModeSwitchButton.jsx

import React, { useState, useEffect } from 'react';
import './ModeSwitchButton.css';

const DarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem('toggleState') === 'true';
    setIsDarkMode(savedState);
    document.body.classList.toggle('dark-mode', savedState);
  }, []);

  const handleToggle = () => {
    const newState = !isDarkMode;
    setIsDarkMode(newState);
    localStorage.setItem('toggleState', newState);
    document.body.classList.toggle('dark-mode', newState);
  };

  return (
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
  );
};

export default DarkMode;