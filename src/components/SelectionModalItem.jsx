import React from 'react';
import './SelectionModalItem.css';

const Option = ({ name, isSelected, onChange }) => {
  return (
    <div className="option-item">
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

export default Option;
