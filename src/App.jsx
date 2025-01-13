import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import History from "./pages/History";
import Repositories from "./pages/Repositories";
import Report from "./pages/Report";
import Sidebar from "./components/Sidebar/Sidebar";

import "./App.css";
import NotificationButton from "./components/NotificationButton/NotificationButton";

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/repositories" element={<Repositories />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </div>
        <NotificationButton />
      </div>
    </Router>
  );
}

export default App;
