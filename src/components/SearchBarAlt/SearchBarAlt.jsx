import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { CiSearch } from "react-icons/ci";

const float = keyframes`
  0% {
    transform: translate(0px, 0px) rotate(0deg);
  }
  25% {
    transform: translate(5px, -5px) rotate(-10deg);
  }
  50% {
    transform: translate(-5px, 5px) rotate(10deg);
  }
  75% {
    transform: translate(5px, 5px) rotate(-5deg);
  }
  100% {
    transform: translate(0px, 0px) rotate(0deg);
  }
`;

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  width: 1000px;
  height: 40px;
  background-color: #ffffff;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 23px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  padding: 0px 10px;
`;

const SearchInput = styled.input`
  flex: 1 1 100px;
  border: none;
  outline: none;
  font-size: 20px;
  font-weight: 600;
  color: #333333;
  background-color: transparent;

  &::placeholder {
    color: #cccccc;
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const StyledSearchIcon = styled(CiSearch)`
  font-size: 24px;
  color: #333333;
  transition: transform 0.1s ease, opacity 0.1s ease;
  transform: translate(0px, 0px) rotate(0deg);
  opacity: 1;

  ${props => props.animated && `
    transform: translate(10px, -10px) rotate(15deg);
    opacity: 0.8;
    animation: ${float} 2s infinite ease-in-out;
  `}
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  color: #333333;
  cursor: pointer;
  opacity: 1;
  transform: scale(0.0) rotate(30deg);
  transition: opacity 0.3s ease, transform 0.3s ease;

  &:hover {
    color: #ff5555;
  }

  ${props => props.show && `
    opacity: 1;
    transform: scale(1) rotate(0deg);
  `}
`;

const SearchBarAlt = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const clearInput = () => {
    setSearchTerm("");
  };

  return (
    <SearchBarContainer>
      <IconContainer>
        <StyledSearchIcon animated={searchTerm ? true : false} />
      </IconContainer>
      <SearchInput
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ClearButton
        show={searchTerm ? true : false}
        onClick={clearInput}
      >
        ✖
      </ClearButton>
    </SearchBarContainer>
  );
};

export default SearchBarAlt;
