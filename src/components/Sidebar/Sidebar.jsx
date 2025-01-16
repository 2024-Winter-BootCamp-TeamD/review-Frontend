import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import SidebarButton from "../SidebarButton/SidebarButton.jsx";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({isDarkMode}) => {
  const buttons = ["Dashboard", "History", "Repositories", "Report"];
  const [activeButton, setActiveButton] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") {
      setActiveButton("Dashboard");
    } else {
      const currentPage = path.substring(1);
      const formattedPage = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);
      setActiveButton(formattedPage);
    }
  }, [location]);

  const handleButtonClick = (label) => {
    setActiveButton(label);
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
    </div>
  );
};

Sidebar.propTypes = {
  isDarkMode: PropTypes.bool.isRequired
};

export default Sidebar;