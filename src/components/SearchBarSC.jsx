import React from "react";
import styled from "styled-components";
import { CiSearch } from "react-icons/ci";
import PropTypes from "prop-types";

const SearchBarSC = ({
  width,
  placeholder,
  backgroundColor,
  value,
  onChange,
}) => {
  return (
    <SearchBarContainer width={width} backgroundColor={backgroundColor}>
      <SearchText>Search</SearchText>
      <SearchInput
        type="text"
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
      />
      <IconContainer>
        <SearchIcon />
      </IconContainer>
    </SearchBarContainer>
  );
};

SearchBarSC.propTypes = {
  width: PropTypes.string,
  placeholder: PropTypes.string,
  backgroundColor: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

SearchBarSC.defaultProps = {
  width: "500px",
  placeholder: "Find a repository...",
  backgroundColor: "#ffffff",
  value: "",
  onChange: () => {},
};

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  width: ${(props) => props.width};
  height: 40px;
  background-color: ${(props) => props.backgroundColor};
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 23px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  padding: 0px 10px;
`;

const SearchText = styled.p`
  flex: 0 0 80px;
  border: none;
  outline: none;
  font-size: 18px;
  font-weight: 800;
  color: #333333;
  background-color: transparent;
  margin: 0;
`;

const SearchInput = styled.input`
  flex: 1 1 100px;
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

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const SearchIcon = styled(CiSearch)`
  font-size: 24px;
  color: #333333;
  transition:
    transform 0.5s ease,
    opacity 0.5s ease;
`;

export default SearchBarSC;
