import React, { useState } from 'react';
import './Sidebar.css';
import SidebarButton from './SidebarButton.jsx';

const Sidebar = () => {
  const buttons = ['Dashboard', 'History', 'Repositories', 'Report'];
  const [activeButton, setActiveButton] = useState('Dashboard');

  const handleButtonClick = (label) => {
    setActiveButton(label);
    console.log(`${label} button clicked!`);
    // 추가 동작 (예: 라우팅) 구현 가능
  };

  return (
    <div className="sidebar">
      <div className="sidebar-rounded-top"></div>
      <h1 className="sidebar-logo">CODIFY</h1>
      {buttons.map((buttonText) => (
        <SidebarButton
          key={buttonText}
          label={buttonText}
          isActive={activeButton === buttonText}
          onClick={() => handleButtonClick(buttonText)}
        />
      ))}
      {/* <div className="sidebar-rounded-bottom"></div> */}
    </div>
  );
};

export default Sidebar;
