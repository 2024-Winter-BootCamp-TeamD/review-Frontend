import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard.jsx";
import History from "./pages/History.jsx";
import Repositories from "./pages/Repositories.jsx";
import Report from "./pages/Report.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import Home from "./pages/Home.jsx";
import "./App.css";
import NotificationButton from "./components/NotificationButton/NotificationButton.jsx";
import ModeSwitchButton from "./components/ModeSwitchButton/ModeSwitchButton.jsx";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem('toggleState') === 'true';
    setIsDarkMode(savedState);
    document.body.classList.toggle("dark-mode", savedState);
  }, []);

  const toggleDarkMode = (newState) => {
    setIsDarkMode(newState);
    localStorage.setItem('toggleState', newState);
    document.body.classList.toggle("dark-mode", newState);
  };

  return (
    <Router>
      <div className="app">
        <Sidebar isDarkMode={isDarkMode} />
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard isDarkMode={isDarkMode} />} />
            <Route path="/history" element={<History isDarkMode={isDarkMode} />} />
            <Route path="/repositories" element={<Repositories isDarkMode={isDarkMode} />} />
            <Route path="/report" element={<Report isDarkMode={isDarkMode} />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </div>
        <div className="top-buttons">
          <ModeSwitchButton onToggle={toggleDarkMode} isDarkMode={isDarkMode} />
          <NotificationButton />
        </div>
      </div>
    </Router>
  );
}

export default App;

