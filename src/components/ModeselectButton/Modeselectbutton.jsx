import PropTypes from 'prop-types';
import React from "react";
import "./ModeSelectButton.css";

function ModeSelectButton({ description, modeName, isSelected, onClick, modeColor = "333" }) {
  return (
    <button
      className={`modeselect-button ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      <p className="mode-description">{description}</p>
      <p className="mode-name" style={{ color: modeColor }}>
        {modeName}
      </p>
    </button>
  );
}

ModeSelectButton.propTypes = {
  description: PropTypes.string.isRequired,
  modeName: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  modeColor: PropTypes.string
};

export default ModeSelectButton;