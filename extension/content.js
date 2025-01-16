let isFloatingButtonVisible = false;
let isOpen = false;
let selectedButton = { text: "B", backgroundColor: "#FF794E" };

// 익스텐션 버튼 클릭 메시지 수신
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleFloatingButton") {
    if (!isFloatingButtonVisible) {
      injectFloatingButton();
    } else {
      removeFloatingButton();
    }
    isFloatingButtonVisible = !isFloatingButtonVisible;
  }
});

function handleButtonClick(text, backgroundColor) {
  selectedButton = { text, backgroundColor };
  isOpen = false;
  updateFloatingButton();
}

function toggleMenu() {
  isOpen = !isOpen;
  updateFloatingButton();
}

function updateFloatingButton() {
  const menu = document.querySelector(".floatingbutton-menu");
  const label = document.querySelector(".floatingbutton-menu-open-button");
  const checkbox = document.querySelector(".floatingbutton-menu-open");

  if (menu) {
    menu.style.bottom = isOpen ? "180px" : "30px";
    menu.style.right = isOpen ? "180px" : "70px";
  }

  if (label) {
    label.style.backgroundColor = selectedButton.backgroundColor;
    label.innerHTML = isOpen
      ? '<span class="floatingbutton-x">✕</span>'
      : `<span class="floatingbutton-item-text">${selectedButton.text}</span>`;
  }

  if (checkbox) {
    checkbox.checked = isOpen;
  }
}

function injectFloatingButton() {
  const floatingButton = document.createElement("div");
  floatingButton.id = "code-review-assistant";
  floatingButton.innerHTML = `
    <nav class="floatingbutton-menu">
      <input
        type="checkbox"
        class="floatingbutton-menu-open"
        name="menu-open"
        id="menu-open"
        ${isOpen ? "checked" : ""}
      />
      <label
        class="floatingbutton-menu-open-button ${isOpen ? "open" : ""}"
        for="menu-open"
        style="background-color: ${selectedButton ? selectedButton.backgroundColor : "#EEEEEE"}"
      >
        ${
          isOpen
            ? '<span class="floatingbutton-x">✕</span>'
            : selectedButton
              ? `<span class="floatingbutton-item-text">${selectedButton.text}</span>`
              : `<span class="floatingbutton-lines floatingbutton-line-1"></span>
               <span class="floatingbutton-lines floatingbutton-line-2"></span>
               <span class="floatingbutton-lines floatingbutton-line-3"></span>`
        }
      </label>

      <div class="floatingbutton-menu-item floatingbutton-dashboard" data-tooltip="Go to Dashboard">
        <span class="floatingbutton-item-text">D</span>
      </div>

      <div class="floatingbutton-menu-item floatingbutton-clean-code" data-tooltip="Clean Code Mode">
        <span class="floatingbutton-item-text">C</span>
      </div>

      <div class="floatingbutton-menu-item floatingbutton-basic" data-tooltip="Basic Mode">
        <span class="floatingbutton-item-text">B</span>
      </div>

      <div class="floatingbutton-menu-item floatingbutton-optimize" data-tooltip="Optimize Mode">
        <span class="floatingbutton-item-text">O</span>
      </div>

      <div class="floatingbutton-menu-item floatingbutton-study" data-tooltip="Study Mode">
        <span class="floatingbutton-item-text">S</span>
      </div>

      <div class="floatingbutton-menu-item floatingbutton-newbie" data-tooltip="Newbie Mode">
        <span class="floatingbutton-item-text">N</span>
      </div>
    </nav>
  `;

  // 이벤트 리스너 추가
  document.body.appendChild(floatingButton);

  // 메인 버튼 토글 이벤트
  document
    .querySelector(".floatingbutton-menu-open")
    .addEventListener("change", toggleMenu);

  // 각 메뉴 아이템 클릭 이벤트
  document
    .querySelector(".floatingbutton-dashboard")
    .addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "openNewTab" });
    });

  document
    .querySelector(".floatingbutton-clean-code")
    .addEventListener("click", () => handleButtonClick("C", "#BC6FCD"));
  document
    .querySelector(".floatingbutton-basic")
    .addEventListener("click", () => handleButtonClick("B", "#FF794E"));
  document
    .querySelector(".floatingbutton-optimize")
    .addEventListener("click", () => handleButtonClick("O", "#70BF73"));
  document
    .querySelector(".floatingbutton-study")
    .addEventListener("click", () => handleButtonClick("S", "#FFCD39"));
  document
    .querySelector(".floatingbutton-newbie")
    .addEventListener("click", () => handleButtonClick("N", "#4DABF5"));
}

function removeFloatingButton() {
  const button = document.getElementById("code-review-assistant");
  if (button) {
    button.remove();
  }
}
