import React, { useState } from "react";
import "./SearchBarAlt.css";
import { CiSearch } from "react-icons/ci";

const SearchBarAlt = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const clearInput = () => {
    setSearchTerm("");
  };

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
      <button
        className={`clear-button ${searchTerm ? "show" : "hide"}`}
        onClick={clearInput}
      >
        ✖
      </button>
    </div>
  );
};

export default SearchBarAlt;
