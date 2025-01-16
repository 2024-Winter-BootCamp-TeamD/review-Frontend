import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import SelectionModalItem from './SelectionModalItem.jsx';
import SearchBar from './SearchBarAlt.jsx';

const wiggle = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(5deg); }
  50% { transform: rotate(-5deg); }
  75% { transform: rotate(2.5deg); }
  100% { transform: rotate(0deg); }
`;

const drawCheck = keyframes`
  to {
    stroke-dashoffset: 0;
  }
`;

const eraseCheck = keyframes`
  to {
    stroke-dashoffset: 36;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 1000;
  padding-top: 50px;
`;

const ModalContainer = styled.div`
  background: #e8e8e8;
  border-radius: 20px;
  padding: 20px;
  width: auto;
  min-width: 20%;
  max-width: 90vw;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const ModalControls = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 20px;
  justify-content: space-between;
`;

const ApplyButton = styled.button`
  background: #aef060;
  color: #484848;
  border: none;
  border-radius: 20px;
  padding: 5px 10px;
  cursor: pointer;
  min-width: 100px;
  min-height: 40px;
  text-align: center;

  &:hover {
    background: #88e916;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 40px;
  color: rgb(178, 178, 178);
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: transform 0.3s ease, color 0.3s ease;

  &:hover {
    color: #ff5555;
    animation: ${wiggle} 0.5s ease-in-out;
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const CheckContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: 10px;
  border: 2px solid ${props => props.checked ? '#4caf50' : '#b0b0b0'};
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  transition: border-color 0.3s ease;
`;

const Circle = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: transparent;
  position: relative;
  overflow: hidden;
`;

const Checkmark = styled.svg`
  width: 30px;
  height: 30px;
  position: absolute;
  top: -8px;
  left: -8px;
`;

const CheckPath = styled.path`
  stroke-dasharray: 36;
  stroke-dashoffset: ${props => props.checked ? '0' : '36'};
  animation: ${props => props.checked ? drawCheck : eraseCheck} 0.4s ease forwards;
  stroke-linecap: round;
  fill: none;
  stroke: #4CAF50;
  stroke-width: 4;
`;

const CheckboxLabel = styled.span`
  font-size: 16px;
  color: #333;
  margin-left: -30px;
`;

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
    <ModalOverlay>
      <ModalContainer>
        <ModalControls>
          <CheckContainer checked={selectAll} onClick={handleSelectAll}>
            <Circle>
              <Checkmark
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52">
                <CheckPath
                  checked={selectAll}
                  d="M14 27l8 8 16-16"
                />
              </Checkmark>
            </Circle>
          </CheckContainer>
          <CheckboxLabel>All</CheckboxLabel>
          <ApplyButton onClick={handleApply}>
            적용({selectedCount})
          </ApplyButton>
          <SearchBar />
          <CloseButton onClick={onClose}>
            &times;
          </CloseButton>
        </ModalControls>
        <ModalContent>
          {options.map((option, index) => (
            <SelectionModalItem
              key={index}
              name={option.name}
              isSelected={option.selected}
              onChange={() => handleOptionChange(index)}
            />
          ))}
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal;
