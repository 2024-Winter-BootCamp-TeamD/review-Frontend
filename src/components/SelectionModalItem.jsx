import React from 'react';
import './SelectionModalItem.css';

const SelectionModalItem = ({ name, isSelected, onChange }) => {
  return (
    <div className="selection-modal-item">
      <label className="checkbox-container">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onChange}
        />
        {name}
      </label>
    </div>
  );
};

export default SelectionModalItem;
