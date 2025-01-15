//Reference: https://wsss.tistory.com/167
import React, { useState } from "react";
import "./FloatingButton.css";

const FloatingButton = () => {
  const [selectedButton, setSelectedButton] = useState({text: "B", backgroundColor: "#FF794E",});
  const [isOpen, setIsOpen] = useState(false);

  const handleButtonClick = (text, backgroundColor) => {
    setSelectedButton({ text, backgroundColor });
    setIsOpen(false); // 메뉴 닫기
  };

  const handleDashboardButtonClick = () => {
    // 나중에 이 링크 수정하면 됨
    window.location.href="https://github.com/2024-Winter-BootCamp-TeamD/review-Frontend"
  }

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <nav 
    className="floatingbutton-menu"
    style={{
        bottom: isOpen ? "150px" : "30px",
        right : isOpen ? "180px" : "70px",
    }}
    >
      <input 
      type="checkbox" 
      className="floatingbutton-menu-open" 
      name="menu-open" 
      id="menu-open" 
      checked={isOpen}
      onChange={toggleMenu}
      />
      <label
        className="floatingbutton-menu-open-button"
        htmlFor="menu-open"
        style={{ backgroundColor: selectedButton ? selectedButton.backgroundColor : "#EEEEEE" }}
      >
        {selectedButton ? (
          <span className="floatingbutton-item-text">{selectedButton.text}</span>
        ) : (
          <>
            <span className="floatingbutton-lines floatingbutton-line-1"></span>
            <span className="floatingbutton-lines floatingbutton-line-2"></span>
            <span className="floatingbutton-lines floatingbutton-line-3"></span>
          </>
        )}
      </label>

      {/* Dashboard 버튼 */}
      <div
        onClick={handleDashboardButtonClick}
        className="floatingbutton-menu-item floatingbutton-dashboard"
        style={{ backgroundColor: "#E6E6E6" }}
      >
        <span className="floatingbutton-item-text">D</span>
      </div>

      {/* Clean Code 버튼 */}
      <div
        onClick={() => handleButtonClick("C", "#BC6FCD")}
        className="floatingbutton-menu-item floatingbutton-clean-code"
      >
        <span className="floatingbutton-item-text">C</span>
      </div>

      {/* Optimize 버튼 */}
      <div
        onClick={() => handleButtonClick("O", "#70BF73")}
        className="floatingbutton-menu-item floatingbutton-optimize"
      >
        <span className="floatingbutton-item-text">O</span>
      </div>

      {/* Newbie 버튼 */}
      <div
        onClick={() => handleButtonClick("N", "#4DABF5")}
        className="floatingbutton-menu-item floatingbutton-newbie"
      >
        <span className="floatingbutton-item-text">N</span>
      </div>

      {/* Study 버튼 */}
      <div
        onClick={() => handleButtonClick("S", "#FFCD39")}
        className="floatingbutton-menu-item floatingbutton-study"
      >
        <span className="floatingbutton-item-text">S</span>
      </div>

      {/* Basic 버튼 */}
      <div
        onClick={() => handleButtonClick("B", "#FF794E")}
        className="floatingbutton-menu-item floatingbutton-basic"
      >
        <span className="floatingbutton-item-text">B</span>
      </div>
    </nav>
  );
};

export default FloatingButton;
