import React from "react";
import styled, { keyframes } from "styled-components";

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

const ModalItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 15px;
  border-radius: 15px;
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.6);
  }
`;

const CheckContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-right: 10px;
  border: 2px solid ${props => props.isSelected ? '#4caf50' : '#b0b0b0'};
  border-radius: 50%;
  position: relative;
  transition: border-color 0.3s ease;
`;

const Circle = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: transparent;
  position: relative;
  overflow: hidden;
`;

const Checkmark = styled.svg`
  width: 26px;
  height: 26px;
  position: absolute;
  top: -8px;
  left: -8px;
`;

const CheckPath = styled.path`
  stroke-dasharray: 36;
  stroke-dashoffset: ${props => props.isSelected ? '0' : '36'};
  animation: ${props => props.isSelected ? drawCheck : eraseCheck} 0.4s ease forwards;
  stroke-linecap: round;
  fill: none;
  stroke: #4CAF50;
  stroke-width: 4;
`;

const ItemName = styled.span`
  font-size: 16px;
  color: #333;
`;

const SelectionModalItem = ({ name, isSelected, onChange }) => {
  return (
    <ModalItem onClick={onChange}>
      <CheckContainer isSelected={isSelected}>
        <Circle>
          <Checkmark
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <CheckPath
              isSelected={isSelected}
              d="M14 27l8 8 16-16"
            />
          </Checkmark>
        </Circle>
      </CheckContainer>
      <ItemName>{name}</ItemName>
    </ModalItem>
  );
};

export default SelectionModalItem;
