import React, { useState, useEffect } from 'react';
import './SelectionModal.css';
import SelectionModalItem from './SelectionModalItem';

const Modal = ({ isOpen, onClose, onApply }) => {
  const [options, setOptions] = useState([
    { name: 'Option 1', selected: false },
    { name: 'Option 2', selected: false },
    { name: 'Option 3', selected: false },
    { name: 'Option 4', selected: false },
  ]);

  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const allSelected = options.every((option) => option.selected);
    setSelectAll(allSelected);
  }, [options]);

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    setOptions((prevOptions) =>
      prevOptions.map((option) => ({ ...option, selected: isChecked }))
    );
  };

  const handleOptionChange = (index) => {
    setOptions((prevOptions) =>
      prevOptions.map((option, i) =>
        i === index ? { ...option, selected: !option.selected } : option
      )
    );
  };

  const handleApply = () => {
    const selectedOptions = options.filter((option) => option.selected);
    onApply(selectedOptions);
    onClose();
  };

  const selectedCount = options.filter((option) => option.selected).length;

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="modal-controls">
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
            />
            All
          </label>
          <button className="apply-button" onClick={handleApply}>
            적용({selectedCount})
          </button>
        </div>
        <div className="modal-content">
          {options.map((option, index) => (
            <SelectionModalItem
              key={index}
              name={option.name}
              isSelected={option.selected}
              onChange={() => handleOptionChange(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modal;
