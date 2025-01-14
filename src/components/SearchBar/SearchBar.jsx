import React from "react";
import "./SearchBar.css";
import { CiSearch } from "react-icons/ci";

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="search-bar">
      <p className="search-text">Search</p>
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={onChange}
        placeholder="Find a repository..."
      />
      <div className="icon-container">
        <CiSearch className={`search-icon`} />
      </div>
    </div>
  );
};

export default SearchBar;
