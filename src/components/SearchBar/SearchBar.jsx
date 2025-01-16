import React from "react";
import styled from "styled-components";
import { CiSearch } from "react-icons/ci";

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  width: ${props => props.width || '450px'};
  height: 40px;
  background-color: #ffffff;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 23px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  padding: 0px 15px;
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
  transition: transform 0.5s ease, opacity 0.5s ease;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: 800;
  color: #333333;
  background-color: transparent;

  &::placeholder {
    color: #cccccc;
  }
`;

const SearchBar = ({ value, onChange, width = "460px " }) => {
  return (
    <SearchBarContainer width={width}>
      <IconContainer>
        <StyledSearchIcon />
      </IconContainer>
      <SearchInput
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search"
      />
    </SearchBarContainer>
  );
};

export default SearchBar;
