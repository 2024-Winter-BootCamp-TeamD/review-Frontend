import React, { useState } from "react";
import "./SearchBar.css";
import { CiSearch } from "react-icons/ci";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="search-bar">
      <div className="icon-container">
        <CiSearch
          className={`search-icon ${searchTerm ? "animated" : ""}`}
        />
      </div>
      <input
        type="text"
        placeholder="Search"
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
