import React from "react";
import styled from "styled-components";

const Button = styled.button`
  min-width: 260px;
  min-height: 140px;
  width: 12vw;
  height: 12vh;
  max-width: 500px;
  max-height: 300px;
  background-color: ${props => props.isSelected ? "#b9ff66" : "#f3f3f3"};
  border: none;
  border-radius: 1vw;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  box-shadow: 0 0.4vh 0.1vh rgba(0, 0, 0, 1);
  transition: background-color 0.3s ease, transform 0.2s ease;
  font-size: clamp(16px, 2vw, 24px);

  &:hover {
    transform: scale(1.05);
  }
`;

const Description = styled.p`
  font-size: clamp(12px, 0.7vw, 24px);
  margin: 0px 0px 10px 10px;
  color: #333;
`;

const ModeName = styled.p`
  font-size: clamp(18px, 2vw, 36px);
  margin: 0px 0px 0px 8px;
  font-weight: bold;
  color: ${props => props.color || "#333"};
`;

function ModeSelectButton({ description, modeName, isSelected, onClick, modeColor = "333" }) {
  return (
    <Button
      isSelected={isSelected}
      onClick={onClick}
    >
      <Description>{description}</Description>
      <ModeName color={modeColor}>{modeName}</ModeName>
    </Button>
  );
}

export default ModeSelectButton;