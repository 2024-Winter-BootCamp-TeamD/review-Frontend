import React, { useState, useEffect } from "react";
import { BrowserRouter as BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard.jsx";
import History from "./pages/History.jsx";
import Repositories from "./pages/Repositories.jsx";
import Report from "./pages/Report.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import "./App.css";
import NotificationButton from "./components/NotificationButton/NotificationButton.jsx";
import ModeSwitchButton from "./components/ModeSwitchButton/ModeSwitchButton.jsx";

function ExtensionApp() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem("toggleState") === "true";
    setIsDarkMode(savedState);
    document.body.classList.toggle("dark-mode", savedState);
  }, []);

  const toggleDarkMode = (newState) => {
    setIsDarkMode(newState);
    localStorage.setItem("toggleState", newState);
    document.body.classList.toggle("dark-mode", newState);
  };

  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar isDarkMode={isDarkMode} />
        <div className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard isDarkMode={isDarkMode} />} />
            <Route path="/history" element={<History isDarkMode={isDarkMode} />} />
            <Route path="/repositories" element={<Repositories isDarkMode={isDarkMode} />} />
            <Route path="/report" element={<Report isDarkMode={isDarkMode} />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
        <div className="top-buttons">
          <ModeSwitchButton onToggle={toggleDarkMode} isDarkMode={isDarkMode} />
          <NotificationButton hasNotification={true} notificationCount={3} isDarkMode={isDarkMode} />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default ExtensionApp;