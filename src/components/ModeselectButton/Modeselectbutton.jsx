import React from "react";
import styled from "styled-components";

const Button = styled.button`
  min-width: 260px;
  min-height: 140px;
  width: 12vw;
  height: 12vh;
  max-width: 500px;
  max-height: 300px;
  background-color: ${({ isSelected, isDarkMode }) => 
    isSelected 
      ? "#b9ff66" 
      : isDarkMode 
        ? "#00000075"  // 다크모드 배경색 대시보드와 통일
        : "#ffffff"};  // 라이트모드 배경색
  border: ${({ isDarkMode }) => 
    isDarkMode ? "1px solid #FFFFFF" : "none"}; // 다크모드일 때 테두리 추가
  border-radius: 1vw;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;
  font-size: clamp(16px, 2vw, 24px);

  &:hover {
    transform: scale(1.05);
    background-color: ${({ isSelected, isDarkMode }) => 
      isSelected 
        ? "#b9ff66" 
        : isDarkMode 
          ? "#000000" 
          : "#f3f3f3"};
  }
`;

const Description = styled.p`
  font-size: clamp(12px, 0.7vw, 24px);
  margin: 0px 0px 10px 10px;
  color: ${({ isDarkMode, isSelected }) => 
    isSelected 
      ? "#000000" 
      : isDarkMode 
        ? "#FFFFFF" 
        : "#333"};
`;

const ModeName = styled.p`
  font-size: clamp(18px, 2vw, 36px);
  margin: 0px 0px 0px 8px;
  font-weight: bold;
  color: ${({ modeColor }) => modeColor};  /* 항상 원래 색상 유지 */
`;

function ModeSelectButton({ description, modeName, isSelected, onClick, modeColor, isDarkMode }) {
  return (
    <Button
      isSelected={isSelected}
      isDarkMode={isDarkMode}
      onClick={onClick}
    >
      <Description isDarkMode={isDarkMode} isSelected={isSelected}>
        {description}
      </Description>
      <ModeName modeColor={modeColor} isSelected={isSelected} isDarkMode={isDarkMode}>
        {modeName}
      </ModeName>
    </Button>
  );
}

export default ModeSelectButton;


