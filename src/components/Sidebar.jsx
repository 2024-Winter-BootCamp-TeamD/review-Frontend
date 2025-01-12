// Sidebar.jsx
import React from 'react';
import './Sidebar.css';
import SidebarButton from './SidebarButton.jsx';

const Sidebar = () => {
  const buttons = [
    'Dashboard',
    'History',
    'Repositories',
    'Report'
  ];

  return (
    <div className="sidebar">
      <h1 className="sidebar-logo">CODIFY</h1>
      {buttons.map((buttonText) => (
        <SidebarButton key={buttonText} label={buttonText} />
      ))}
    </div>
  );
};

export default Sidebar;
