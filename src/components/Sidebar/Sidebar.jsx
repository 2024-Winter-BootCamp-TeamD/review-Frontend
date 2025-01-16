import PropTypes from 'prop-types';
import React, { useState } from "react";
import "./Sidebar.css";
import SidebarButton from "../SidebarButton/SidebarButton.jsx";
import { useNavigate } from "react-router-dom";

const Sidebar = ({isDarkMode}) => {
  const buttons = ["Dashboard", "History", "Repositories", "Report"];
  const [activeButton, setActiveButton] = useState("Dashboard");
  const navigate = useNavigate();

  const handleButtonClick = (label) => {
    setActiveButton(label);
    // 라우팅 경로 매핑
    if (label === "Dashboard") {
      navigate("/");
    } else if (label === "History") {
      navigate("/history");
    } else if (label === "Repositories") {
      navigate("/repositories");
    } else if (label === "Report") {
      navigate("/report");
    }
  };

  return (
    <div 
      className={`sidebar ${isDarkMode ? "sidebar-dark-mode" : "sidebar-light-mode"}`}
    >
      <div className="sidebar-rounded-top"></div>
      <h1 className="sidebar-logo">REFACTORY</h1>
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

Sidebar.propTypes = {
  isDarkMode: PropTypes.bool.isRequired
};

export default Sidebar;