import React, { useState } from "react";
import "./SearchBar.css";
import { CiSearch } from "react-icons/ci";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="search-bar">
        <p className="search-text">Search</p>
        <input
        type="text"
        // placeholder="Search"
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="icon-container">
        <CiSearch
          className={`search-icon`}
        />
      </div>
    </div>
  );
};

export default SearchBar;
