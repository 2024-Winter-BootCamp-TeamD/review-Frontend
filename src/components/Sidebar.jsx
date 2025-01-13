import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Sidebar.css';
import SidebarButton from './SidebarButton.jsx';

const Sidebar = () => {
  const buttons = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "History", path: "/history" },
    { label: "Repositories", path: "/repositories" },
    { label: "Report", path: "/report" },
  ];
  const [activeButton, setActiveButton] = useState("Dashboard");
  const navigate = useNavigate();

  const handleButtonClick = (button) => {
    setActiveButton(button.label);
    navigate(button.path); // React Router의 navigate를 사용한 라우팅
  };

  return (
    <div className="sidebar">
      <div className="sidebar-rounded-top"></div>
      <h1 className="sidebar-logo">CODIFY</h1>
      {buttons.map((button) => (
        <SidebarButton
          key={button.label}
          label={button.label}
          isActive={activeButton === button.label}
          onClick={() => handleButtonClick(button)}
        />
      ))}
      {/* <div className="sidebar-rounded-bottom"></div> */}
    </div>
  );
};

export default Sidebar;
