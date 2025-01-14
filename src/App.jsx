import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import History from "./pages/History";
import Repositories from "./pages/Repositories";
import Report from "./pages/Report";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import NotificationButton from "./components/NotificationButton/NotificationButton.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import "./App.css";

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
          </Routes>
        </div>
        <NotificationButton />
      </div>
    </Router>
  );
}

export default App;
