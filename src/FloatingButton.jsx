import React from "react";
import {Link} from "react-dom";
import "./FloatingButton.css";

const FloatingButton = () => {
  return (
    <nav className="floatingbutton-menu">
      <input type="checkbox" href="#" className="floatingbutton-menu-open" name="menu-open" id="menu-open" />
      <label className="floatingbutton-menu-open-button" htmlFor="menu-open">
        <span className="floatingbutton-lines floatingbutton-line-1"></span>
        <span className="floatingbutton-lines floatingbutton-line-2"></span>
        <span className="floatingbutton-lines floatingbutton-line-3"></span>
      </label>

      <a href="#" className="floatingbutton-menu-item floatingbutton-dashboard">
        <span className="floatingbutton-item-text">D</span>
      </a>

      <a href="#" className="floatingbutton-menu-item floatingbutton-clean-code">
        <span className="floatingbutton-item-text">C</span>
      </a>

      <a href="#" className="floatingbutton-menu-item floatingbutton-optimize">
        <span className="floatingbutton-item-text">O</span>
      </a>

      <a href="#" className="floatingbutton-menu-item floatingbutton-newbie">
        <span className="floatingbutton-item-text">N</span>
      </a>

      <a href="#" className="floatingbutton-menu-item floatingbutton-study">
        <span className="floatingbutton-item-text">S</span>
      </a>

      <a href="#" className="floatingbutton-menu-item floatingbutton-basic">
        <span className="floatingbutton-item-text">B</span>
      </a>

    </nav>
  );
};

export default FloatingButton;
