//src/components/ModeSwitchButton/ModeSwitchButton.jsx

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ModeSwitchButton.css';

const DarkMode = ({ onToggle, isDarkMode }) => {
  const handleToggle = () => {
    const newState = !isDarkMode;
    onToggle(newState);

    if (newState) {
      // 다크 모드일 때 배경색과 이미지 설정
      document.body.style.background = `
        linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),
        url('https://4kwallpapers.com/images/wallpapers/milky-way-starry-sky-night-mountains-lake-reflection-cold-5k-3840x2160-287.jpg')
      `;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
    } else {
      // 라이트 모드일 때 배경 초기화
      document.body.style.background = '';
    }
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

DarkMode.propTypes = {
  onToggle: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired
};

export default DarkMode;