import React, { useState, useEffect } from 'react';
import './SelectionModal.css';

const Modal = ({ isOpen, onClose, onApply }) => {
    const [options, setOptions] = useState([
      { name: 'Option 1', selected: false },
      { name: 'Option 2', selected: false },
      { name: 'Option 3', selected: false },
    ]);
  
    const [selectAll, setSelectAll] = useState(false);
  
    // 모든 옵션이 선택되었는지 감지하고 "ALL" 체크박스를 업데이트
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
  
    const handleAddOption = () => {
      const newOptionName = `Option ${options.length + 1}`;
      setOptions((prevOptions) => [
        ...prevOptions,
        { name: newOptionName, selected: false },
      ]);
    };
  
    const handleRemoveOption = (index) => {
      setOptions((prevOptions) => prevOptions.filter((_, i) => i !== index));
    };
  
    const handleApply = () => {
      const selectedOptions = options.filter((option) => option.selected);
      onApply(selectedOptions); // 선택된 항목을 상위 컴포넌트로 전달
      onClose(); // 모달 닫기
    };
  
    // 선택된 항목 개수 계산
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
              ALL
            </label>
            <button className="apply-button" onClick={handleApply}>
              적용({selectedCount})
            </button>
            <button className="add-button" onClick={handleAddOption}>
              항목 추가
            </button>
          </div>
          <div className="modal-content">
            {options.map((option, index) => (
              <div key={index} className="option-item">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={option.selected}
                    onChange={() => handleOptionChange(index)}
                  />
                  {option.name}
                </label>
                <button
                  className="remove-button"
                  onClick={() => handleRemoveOption(index)}
                >
                  제거
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default Modal;