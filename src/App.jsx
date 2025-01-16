import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard.jsx";
import History from "./pages/History.jsx";
import Repositories from "./pages/Repositories.jsx";
import Report from "./pages/Report.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import Home from "./pages/Home.jsx";
import "./App.css";
import NotificationButton from "./components/NotificationButton/NotificationButton.jsx";

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/history" element={<History />} />
            <Route path="/repositories" element={<Repositories />} />
            <Route path="/report" element={<Report />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/home" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/repositories" element={<Repositories />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </div>
        <NotificationButton className="notification-button" />
      </div>
    </Router>
  );
}

export default App;
