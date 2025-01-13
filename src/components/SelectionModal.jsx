import React, { useState, useEffect } from 'react';
import './SelectionModal.css';
import SelectionModalItem from './SelectionModalItem.jsx';
import SearchBar from './SearchBarAlt.jsx';

const Modal = ({ isOpen, onClose, onApply }) => {
  const [options, setOptions] = useState([
    { name: '2024-Winter-BootCamp-TeamD review-Frontend', selected: false },
    { name: '2024-Winter-BootCamp-TeamD review-Backend', selected: false },
    { name: '2024-Winter-BootCamp-TeamD YSKIM', selected: false },
    { name: '2024-Winter-BootCamp-TeamD gitApitest', selected: false },
  ]);

  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const allSelected = options.every((option) => option.selected);
    setSelectAll(allSelected);
  }, [options]);

  const handleSelectAll = () => {
    const newState = !selectAll;
    setSelectAll(newState);
    setOptions((prevOptions) =>
      prevOptions.map((option) => ({ ...option, selected: newState }))
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
        <div className="modal-controls">
          {/* <div className="checkbox-container">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
            />
            전체
          </div> */}
          <div className={`check-container ${selectAll ? "checked" : ""}`} onClick={handleSelectAll}>
            <div className="circle">
              <svg
                className="checkmark"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52">
                <path
                  className={`check-path ${
                    selectAll ? "animate-draw" : "animate-erase"
                  }`}
                  fill="none"
                  stroke="#4CAF50"
                  strokeWidth="4"
                  d="M14 27l8 8 16-16"
                />
              </svg>
            </div>
          </div>
          <span className="checkbox-label">All</span>
          <button className="apply-button" onClick={handleApply}>
            적용({selectedCount})
          </button>
          <SearchBar />
          <button className="close-button" onClick={onClose}>
            &times;
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
