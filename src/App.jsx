import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard.jsx";
import History from "./pages/History.jsx";
import Repositories from "./pages/Repositories.jsx";
import Report from "./pages/Report.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";

import "./App.css";
import NotificationButton from "./components/NotificationButton/NotificationButton.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />
        <div className="content">
          <NotificationButton />
          <Routes>
            <Route path="/index.html" element={<Navigate to="/" replace />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/report" element={<Report />} />
            <Route path="/repositories" element={<Repositories />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
