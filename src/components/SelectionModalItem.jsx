import React from "react";
import "./SelectionModalItem.css";

const SelectionModalItem = ({ name, isSelected, onChange }) => {
  return (
    <div className="selection-modal-item" onClick={onChange}>
      <div className={`check-container ${isSelected ? "checked" : ""}`}>
        <div className="circle">
          <svg
            className="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <path
              className={`check-path ${isSelected ? "animate-draw" : "animate-erase"}`}
              fill="none"
              stroke="#4CAF50"
              strokeWidth="4"
              d="M14 27l8 8 16-16"
            />
          </svg>
        </div>
      </div>
      <span className="item-name">{name}</span>
    </div>
  );
};

export default SelectionModalItem;
