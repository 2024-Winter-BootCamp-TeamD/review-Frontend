import React from 'react';
import './SidebarButton.css';

const SidebarButton = ({ label, isActive, onClick }) => {
  return (
    <div
      className={`sidebar-button ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      {label}
    </div>
  );
};

export default SidebarButton;