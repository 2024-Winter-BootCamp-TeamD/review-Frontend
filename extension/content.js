// 전역 변수들을 window 객체에 저장하여 중복 선언 방지
if (typeof window.floatingButtonState === "undefined") {
  window.floatingButtonState = {
    isFloatingButtonVisible: false,
    isOpen: false,
    selectedButton: { text: "B", backgroundColor: "#FF794E" },
  };
}

// 익스텐션 버튼 클릭 메시지 수신
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "ping") {
    sendResponse(true);
    return;
  }

  if (request.action === "toggleFloatingButton") {
    if (request.show) {
      // show가 true면 무조건 표시
      if (!window.floatingButtonState.isFloatingButtonVisible) {
        injectFloatingButton();
        window.floatingButtonState.isFloatingButtonVisible = true;
      }
    } else {
      // show가 false거나 없으면 토글
      if (!window.floatingButtonState.isFloatingButtonVisible) {
        injectFloatingButton();
      } else {
        removeFloatingButton();
      }
      window.floatingButtonState.isFloatingButtonVisible =
        !window.floatingButtonState.isFloatingButtonVisible;
    }
  }
});

function handleButtonClick(mode, backgroundColor) {
  const svgIcons = {
    dashboard: `<svg id="Clean--Streamline-Carbon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <desc>Clean Streamline Icon</desc>
      <path transform="rotate(-180 23 19)" d="M20 18h6v2h-6Z" fill="currentColor" />
      <path transform="rotate(-180 27 27)" d="M24 26h6v2h-6Z" fill="currentColor" />
      <path transform="rotate(-180 25 23)" d="M22 22h6v2h-6Z" fill="currentColor" />
      <path d="M17.0029 20a4.8952 4.8952 0 0 0-2.4044-4.1729L22 3l-1.7309-1-7.5758 13.126A5.6988 5.6988 0 0 0 7.45 16.6289C3.7064 20.24 3.9963 28.6821 4.01 29.04a1 1 0 0 0 1 .96h14.9912a1 1 0 0 0 .6-1.8c-3.5397-2.6561-3.5983-8.1463-3.5983-8.2ZM11.93 16.9971A3.11 3.11 0 0 1 15.0041 20c0 .0381.0019.208.0168.4688l-5.8994-2.6236a3.8 3.8 0 0 1 2.8085-.8481ZM15.4494 28A5.2 5.2 0 0 1 14 25h-2a6.4993 6.4993 0 0 0 .9684 3h-2.2233A16.6166 16.6166 0 0 1 10 24H8a17.3424 17.3424 0 0 0 .6652 4H6c.031-1.8364.29-5.8921 1.8027-8.5527l7.533 3.35A13.0253 13.0253 0 0 0 17.5968 28Z" fill="currentColor" />
      <path id="_Transparent_Rectangle_" d="M0 0h32v32H0Z" fill="none" />
    </svg>`,

    clean: `<svg id="Custom--Streamline-Ultimate" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="32" width="32">
              <desc>Custom Streamline Icon</desc>
              <defs />
              <title>custom-icon</title>
              <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 00-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" fill="currentColor" />
              <path d="M17.278 2.613a1 1 0 011.89.643l-.038.11l-2.61 6.42l.657.175c1.05.281 1.924 1.134 2.09 2.298c.142 1 .275 2.52.092 4.086c-.182 1.552-.69 3.278-1.947 4.546c-.462.466-1.125.54-1.573.548c-.511.008-1.1-.07-1.705-.19c-1.216-.242-2.674-.69-4.054-1.166l-.414-.145l-.813-.294l-.78-.291l-.734-.283l-.978-.388l-.822-.335l-.817-.345a1 1 0 01-.228-1.708c1.377-1.08 2.67-2.322 3.761-3.469l.529-.564l.25-.274l.472-.527l.22-.252l.594-.695l.337-.406a3.1 3.1 0 012.981-1.087l.199.046l.737.197z" fill="currentColor" />
              <path d="M10.5 13.348a44 44 0 01-3.479 3.444q.863.349 1.733.68a7.3 7.3 0 001.426-1.338a7 7 0 00.488-.654l.142-.232a1 1 0 011.747.973c-.234.42-.527.814-.832 1.184a10 10 0 01-.792.856c.462.158.924.308 1.372.446c.373-.257.81-.785 1.206-1.385q.239-.36.452-.74l.204-.384a1 1 0 011.793.887c-.229.462-.496.909-.78 1.339a11 11 0 01-.634.868l.421.082c.362.067.744.114 1.089.043c.766-.815 1.163-1.998 1.316-3.305q.053-.456.068-.904z" fill="currentColor" />
              <path d="M13.638 10.998a1.09 1.09 0 00-1.116.378l-.243.293l5.398 1.446l-.047-.392l-.024-.182c-.037-.253-.216-.491-.511-.61l-.116-.038z" fill="currentColor" />
              <path d="M5.565 7.716l.064.14A3.26 3.26 0 006.866 9.22l.1.058a.068.068 0 010 .118l-.1.058A3.26 3.26 0 005.63 10.82l-.064.139a.071.071 0 01-.13 0l-.064-.14a3.26 3.26 0 00-1.237-1.364l-.1-.058a.068.068 0 010-.118l.1-.058A3.26 3.26 0 005.37 7.855l.064-.139a.071.071 0 01.13 0z" fill="currentColor" />
              <path d="M8.397 2.857c.04-.09.166-.09.206 0l.102.222a5.2 5.2 0 001.97 2.171l.157.093a.108.108 0 010 .189l-.158.092a5.2 5.2 0 00-1.97 2.172l-.1.222a.113.113 0 01-.207 0l-.102-.222a5.2 5.2 0 00-1.97-2.172l-.158-.092a.108.108 0 010-.189l.159-.093a5.2 5.2 0 001.97-2.171l.1-.222z" fill="currentColor" />
              <path id="_Transparent_Rectangle_" d="M0 0h24v24H0z" fill="none" />
          </svg>`,

    basic: `<svg id="Custom--Streamline-Ultimate" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="32" width="32">
              <desc>Custom Streamline Icon</desc>
              <defs />
              <title>custom-icon</title>
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M14.62 2.662a1.5 1.5 0 011.04 1.85l-4.431 15.787a1.5 1.5 0 01-2.889-.81L12.771 3.7a1.5 1.5 0 011.85-1.039z" fill="currentColor" />
              <path d="M7.56 6.697a1.5 1.5 0 010 2.12L4.38 12l3.182 3.182a1.5 1.5 0 11-2.122 2.121L1.197 13.06a1.5 1.5 0 010-2.12l4.242-4.243a1.5 1.5 0 012.122 0z" fill="currentColor" />
              <path d="M16.44 8.817a1.5 1.5 0 112.12-2.12l4.243 4.242a1.5 1.5 0 010 2.121l-4.242 4.243a1.5 1.5 0 11-2.122-2.121L19.621 12z" fill="currentColor" />
              <path id="_Transparent_Rectangle_" d="M0 0h24v24H0z" fill="none" />
          </svg>`,

    optimize: `<svg id="Decent-Work-And-Economic-Growth--Streamline-Sharp" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24" width="24">
            <desc>Decent Work And Economic Growth Streamline Icon: https://streamlinehq.com</desc>
            <defs />
            <title>decent-work-and-economic-growth</title>
            <path d="M9.91599 3.64939l-0.85056-0.91599-0.91599 0.85056-7 6.50004 1.70112 1.8319 6.08401-5.64939L14.584 12.3505l0.8827 0.9506 0.9172-0.9173 4-3.99996L22 9.99995l1-1v-5h-5l-1 1 1.6161 1.61612-3.0828 3.08277-5.61731-6.04945z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" />
            <path d="M5 23v-8.5H1V23h4z" fill="currentColor" />
            <path d="M7 23V9.99995h4V23H7z" fill="currentColor" />
            <path d="M13 16v7h4v-7h-4z" fill="currentColor" />
            <path d="M19 23V12.5h4V23h-4z" fill="currentColor" />
            <path id="_Transparent_Rectangle_" d="M0 0h24v24H0z" fill="none" />
         </svg>`,

    study: `<svg id="Custom--Streamline-Ultimate" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="32" width="32">
              <desc>Custom Streamline Icon</desc>
              <defs />
              <title>custom-icon</title>
              <path d="M204.055 213.905q-18.12-5.28-34.61-9a146 146 0 01-6.78-44.33c0-65.61 42.17-118.8 94.19-118.8s94.15 53.14 94.15 118.76a146.3 146.3 0 01-6.16 42.32q-20.52 4.3-43.72 11.05c-22 6.42-39.79 12.78-48.56 16.05c-8.72-3.27-26.51-9.63-48.51-16.05z" fill="currentColor" />
              <path d="M76.105 298.845a55.16 55.16 0 1055.16 55.15 55.16 55.16 0 00-55.16-55.15z" fill="currentColor" />
              <path d="M435.895 298.845a55.16 55.16 0 1055.16 55.15 55.16 55.16 0 00-55.15-55.15z" fill="currentColor" />
              <path d="M364.745 353.995a71.24 71.24 0 0142.26-65v-77.55c-64.49 0-154.44 35.64-154.44 35.64s-89.95-35.64-154.44-35.64v74.92a71.14 71.14 0 010 135.28v7c64.49 0 154.44 41.58 154.44 41.58s89.99-41.55 154.44-41.55v-9.68a71.24 71.24 0 01-42.26-65z" fill="currentColor" />
              <path id="_Transparent_Rectangle_" d="M0 0h512v512H0z" fill="none" />
          </svg>`,

    newbie: `<svg id="Custom--Streamline-Ultimate" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="32" width="32">
              <desc>Custom Streamline Icon</desc>
              <defs />
              <title>custom-icon</title>
              <path d="M4 5a3 3 0 116 0 3 3 0 01-6 0zm8-.54V4h-1v4h1V6.175l.103.129.007.008c.253.317.492.616.669.867q.133.189.193.303L13 7.54V8h1V4h-1v1.825l-.103-.129-.007-.008a20 20 0 01-.669-.867 3 3 0 01-.193-.303z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" />
              <path d="M2 14v-.5A4.5 4.5 0 016.5 9h1a4.5 4.5 0 014.5 4.5v.5z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" />
              <path id="_Transparent_Rectangle_" d="M0 0h16v16H0z" fill="none" />
          </svg> `,
  };

  window.floatingButtonState.selectedButton = {
    text: svgIcons[mode],
    backgroundColor,
  };
  window.floatingButtonState.isOpen = false;
  updateFloatingButton();
}

function toggleMenu() {
  window.floatingButtonState.isOpen = !window.floatingButtonState.isOpen;
  updateFloatingButton();
}

function updateFloatingButton() {
  const menu = document.querySelector(".floatingbutton-menu");
  const label = document.querySelector(".floatingbutton-menu-open-button");
  const checkbox = document.querySelector(".floatingbutton-menu-open");

  if (menu) {
    menu.style.bottom = window.floatingButtonState.isOpen ? "180px" : "30px";
    menu.style.right = window.floatingButtonState.isOpen ? "180px" : "70px";
  }

  if (label) {
    label.style.backgroundColor =
      window.floatingButtonState.selectedButton.backgroundColor;
    label.innerHTML = window.floatingButtonState.isOpen
      ? '<span class="floatingbutton-x">✕</span>'
      : `<span class="floatingbutton-item-text">${window.floatingButtonState.selectedButton.text}</span>`;
  }

  if (checkbox) {
    checkbox.checked = window.floatingButtonState.isOpen;
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
        ${window.floatingButtonState.isOpen ? "checked" : ""}
      />
      <label
        class="floatingbutton-menu-open-button ${window.floatingButtonState.isOpen ? "open" : ""}"
        for="menu-open"
        style="background-color: ${window.floatingButtonState.selectedButton ? window.floatingButtonState.selectedButton.backgroundColor : "#EEEEEE"}"
      >
        ${
          window.floatingButtonState.isOpen
            ? '<span class="floatingbutton-x">✕</span>'
            : window.floatingButtonState.selectedButton
              ? `<span class="floatingbutton-item-text">${window.floatingButtonState.selectedButton.text}</span>`
              : `<span class="floatingbutton-lines floatingbutton-line-1"></span>
               <span class="floatingbutton-lines floatingbutton-line-2"></span>
               <span class="floatingbutton-lines floatingbutton-line-3"></span>`
        }
      </label>

      <div class="floatingbutton-menu-item floatingbutton-dashboard" data-tooltip="Go to Dashboard">
        <span class="floatingbutton-item-text">
          <svg id="Custom--Streamline-Ultimate" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="32" width="32">
              <desc>Custom Streamline Icon</desc>
              <defs />
              <title>custom-icon</title>
              <path d="M12 21q-3.45 0-6.012-2.287T3.05 13H5.1q.35 2.6 2.313 4.3T12 19q2.925 0 4.963-2.037T19 12t-2.037-4.962T12 5q-1.725 0-3.225.8T6.25 8H9v2H3V4h2v2.35q1.275-1.6 3.113-2.475T12 3q1.875 0 3.513.713t2.85 1.924t1.925 2.85T21 12t-.712 3.513t-1.925 2.85t-2.85 1.925T12 21z" fill="currentColor" />
              <path d="M14.8 16.2L11 12.4V7h2v4.6l3.2 3.2z" fill="currentColor" />
              <path id="_Transparent_Rectangle_" d="M0 0h24v24H0z" fill="none" />
          </svg>
        </span>
      </div>

      <div class="floatingbutton-menu-item floatingbutton-clean-code" data-tooltip="Clean Code Mode">
        <span class="floatingbutton-item-text">
           <svg id="Custom--Streamline-Ultimate" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="32" width="32">
              <desc>Custom Streamline Icon</desc>
              <defs />
              <title>custom-icon</title>
              <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 00-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" fill="currentColor" />
              <path d="M17.278 2.613a1 1 0 011.89.643l-.038.11l-2.61 6.42l.657.175c1.05.281 1.924 1.134 2.09 2.298c.142 1 .275 2.52.092 4.086c-.182 1.552-.69 3.278-1.947 4.546c-.462.466-1.125.54-1.573.548c-.511.008-1.1-.07-1.705-.19c-1.216-.242-2.674-.69-4.054-1.166l-.414-.145l-.813-.294l-.78-.291l-.734-.283l-.978-.388l-.822-.335l-.817-.345a1 1 0 01-.228-1.708c1.377-1.08 2.67-2.322 3.761-3.469l.529-.564l.25-.274l.472-.527l.22-.252l.594-.695l.337-.406a3.1 3.1 0 012.981-1.087l.199.046l.737.197z" fill="currentColor" />
              <path d="M10.5 13.348a44 44 0 01-3.479 3.444q.863.349 1.733.68a7.3 7.3 0 001.426-1.338a7 7 0 00.488-.654l.142-.232a1 1 0 011.747.973c-.234.42-.527.814-.832 1.184a10 10 0 01-.792.856c.462.158.924.308 1.372.446c.373-.257.81-.785 1.206-1.385q.239-.36.452-.74l.204-.384a1 1 0 011.793.887c-.229.462-.496.909-.78 1.339a11 11 0 01-.634.868l.421.082c.362.067.744.114 1.089.043c.766-.815 1.163-1.998 1.316-3.305q.053-.456.068-.904z" fill="currentColor" />
              <path d="M13.638 10.998a1.09 1.09 0 00-1.116.378l-.243.293l5.398 1.446l-.047-.392l-.024-.182c-.037-.253-.216-.491-.511-.61l-.116-.038z" fill="currentColor" />
              <path d="M5.565 7.716l.064.14A3.26 3.26 0 006.866 9.22l.1.058a.068.068 0 010 .118l-.1.058A3.26 3.26 0 005.63 10.82l-.064.139a.071.071 0 01-.13 0l-.064-.14a3.26 3.26 0 00-1.237-1.364l-.1-.058a.068.068 0 010-.118l.1-.058A3.26 3.26 0 005.37 7.855l.064-.139a.071.071 0 01.13 0z" fill="currentColor" />
              <path d="M8.397 2.857c.04-.09.166-.09.206 0l.102.222a5.2 5.2 0 001.97 2.171l.157.093a.108.108 0 010 .189l-.158.092a5.2 5.2 0 00-1.97 2.172l-.1.222a.113.113 0 01-.207 0l-.102-.222a5.2 5.2 0 00-1.97-2.172l-.158-.092a.108.108 0 010-.189l.159-.093a5.2 5.2 0 001.97-2.171l.1-.222z" fill="currentColor" />
              <path id="_Transparent_Rectangle_" d="M0 0h24v24H0z" fill="none" />
          </svg>
        </span>
      </div>

      <div class="floatingbutton-menu-item floatingbutton-basic" data-tooltip="Basic Mode">
        <span class="floatingbutton-item-text">
          <svg id="Custom--Streamline-Ultimate" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="32" width="32">
              <desc>Custom Streamline Icon</desc>
              <defs />
              <title>custom-icon</title>
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M14.62 2.662a1.5 1.5 0 011.04 1.85l-4.431 15.787a1.5 1.5 0 01-2.889-.81L12.771 3.7a1.5 1.5 0 011.85-1.039z" fill="currentColor" />
              <path d="M7.56 6.697a1.5 1.5 0 010 2.12L4.38 12l3.182 3.182a1.5 1.5 0 11-2.122 2.121L1.197 13.06a1.5 1.5 0 010-2.12l4.242-4.243a1.5 1.5 0 012.122 0z" fill="currentColor" />
              <path d="M16.44 8.817a1.5 1.5 0 112.12-2.12l4.243 4.242a1.5 1.5 0 010 2.121l-4.242 4.243a1.5 1.5 0 11-2.122-2.121L19.621 12z" fill="currentColor" />
              <path id="_Transparent_Rectangle_" d="M0 0h24v24H0z" fill="none" />
          </svg>
        </span>
      </div>

      <div class="floatingbutton-menu-item floatingbutton-optimize" data-tooltip="Optimize Mode">
        <span class="floatingbutton-item-text">
          <svg id="Decent-Work-And-Economic-Growth--Streamline-Sharp" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24" width="24">
            <desc>Decent Work And Economic Growth Streamline Icon: https://streamlinehq.com</desc>
            <defs />
            <title>decent-work-and-economic-growth</title>
            <path d="M9.91599 3.64939l-0.85056-0.91599-0.91599 0.85056-7 6.50004 1.70112 1.8319 6.08401-5.64939L14.584 12.3505l0.8827 0.9506 0.9172-0.9173 4-3.99996L22 9.99995l1-1v-5h-5l-1 1 1.6161 1.61612-3.0828 3.08277-5.61731-6.04945z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" />
            <path d="M5 23v-8.5H1V23h4z" fill="currentColor" />
            <path d="M7 23V9.99995h4V23H7z" fill="currentColor" />
            <path d="M13 16v7h4v-7h-4z" fill="currentColor" />
            <path d="M19 23V12.5h4V23h-4z" fill="currentColor" />
            <path id="_Transparent_Rectangle_" d="M0 0h24v24H0z" fill="none" />
         </svg>
        </span>
      </div>

      <div class="floatingbutton-menu-item floatingbutton-study" data-tooltip="Study Mode">
        <span class="floatingbutton-item-text">
          <svg id="Custom--Streamline-Ultimate" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="32" width="32">
              <desc>Custom Streamline Icon</desc>
              <defs />
              <title>custom-icon</title>
              <path d="M204.055 213.905q-18.12-5.28-34.61-9a146 146 0 01-6.78-44.33c0-65.61 42.17-118.8 94.19-118.8s94.15 53.14 94.15 118.76a146.3 146.3 0 01-6.16 42.32q-20.52 4.3-43.72 11.05c-22 6.42-39.79 12.78-48.56 16.05c-8.72-3.27-26.51-9.63-48.51-16.05z" fill="currentColor" />
              <path d="M76.105 298.845a55.16 55.16 0 1055.16 55.15 55.16 55.16 0 00-55.16-55.15z" fill="currentColor" />
              <path d="M435.895 298.845a55.16 55.16 0 1055.16 55.15 55.16 55.16 0 00-55.15-55.15z" fill="currentColor" />
              <path d="M364.745 353.995a71.24 71.24 0 0142.26-65v-77.55c-64.49 0-154.44 35.64-154.44 35.64s-89.95-35.64-154.44-35.64v74.92a71.14 71.14 0 010 135.28v7c64.49 0 154.44 41.58 154.44 41.58s89.99-41.55 154.44-41.55v-9.68a71.24 71.24 0 01-42.26-65z" fill="currentColor" />
              <path id="_Transparent_Rectangle_" d="M0 0h512v512H0z" fill="none" />
          </svg>
        </span>
      </div>

      <div class="floatingbutton-menu-item floatingbutton-newbie" data-tooltip="Newbie Mode">
        <span class="floatingbutton-item-text">
          <svg id="Custom--Streamline-Ultimate" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="32" width="32">
              <desc>Custom Streamline Icon</desc>
              <defs />
              <title>custom-icon</title>
              <path d="M4 5a3 3 0 116 0 3 3 0 01-6 0zm8-.54V4h-1v4h1V6.175l.103.129.007.008c.253.317.492.616.669.867q.133.189.193.303L13 7.54V8h1V4h-1v1.825l-.103-.129-.007-.008a20 20 0 01-.669-.867 3 3 0 01-.193-.303z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" />
              <path d="M2 14v-.5A4.5 4.5 0 016.5 9h1a4.5 4.5 0 014.5 4.5v.5z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" />
              <path id="_Transparent_Rectangle_" d="M0 0h16v16H0z" fill="none" />
          </svg>    
        </span>
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
    .addEventListener("click", () => handleButtonClick("clean", "#BC6FCD"));
  document
    .querySelector(".floatingbutton-basic")
    .addEventListener("click", () => handleButtonClick("basic", "#FF794E"));
  document
    .querySelector(".floatingbutton-optimize")
    .addEventListener("click", () => handleButtonClick("optimize", "#70BF73"));
  document
    .querySelector(".floatingbutton-study")
    .addEventListener("click", () => handleButtonClick("study", "#FFCD39"));
  document
    .querySelector(".floatingbutton-newbie")
    .addEventListener("click", () => handleButtonClick("newbie", "#4DABF5"));
}

function removeFloatingButton() {
  const button = document.getElementById("code-review-assistant");
  if (button) {
    button.remove();
  }
}

// 드래그 버튼 생성 함수
function createDragButton() {
  const button = document.createElement("div");
  button.className = "drag-review-button";
  button.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor"/>
    </svg>
  `;
  button.style.display = "none";
  document.body.appendChild(button);
  return button;
}

// 드래그 이벤트 처리
function initializeDragHandler() {
  let dragButton = null;
  let isButtonVisible = false;
  let dragStartPosition = null;

  // 텍스트 선택 변경 감지
  document.addEventListener("selectionchange", () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText && selection.rangeCount > 0 && dragStartPosition) {
      if (!dragButton) {
        dragButton = createDragButton();
      }

      // 버튼 위치를 드래그 시작 위치로 설정
      dragButton.style.position = "fixed";
      dragButton.style.top = `${dragStartPosition.y - 40}px`;
      dragButton.style.left = `${dragStartPosition.x - 16}px`;
      dragButton.style.display = "flex";
      isButtonVisible = true;

      // 현재 선택된 텍스트를 버튼에 저장
      dragButton.dataset.selectedText = selectedText;

      // 버튼 클릭 이벤트 수정
      dragButton.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const textToReview = dragButton.dataset.selectedText;
        console.log("Selected text for review:", textToReview); // 디버깅용
        if (textToReview) {
          createModal(textToReview);
          dragButton.style.display = "none";
          isButtonVisible = false;
        }
      };
    }
  });

  // mousedown 이벤트에서 드래그 시작 위치 저장
  document.addEventListener("mousedown", (e) => {
    dragStartPosition = {
      x: e.clientX,
      y: e.clientY,
    };

    if (dragButton && isButtonVisible && !dragButton.contains(e.target)) {
      setTimeout(() => {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        if (!selectedText) {
          dragButton.style.display = "none";
          isButtonVisible = false;
        }
      }, 200);
    }
  });

  // mouseup 이벤트로 드래그 종료 감지
  document.addEventListener("mouseup", () => {
    setTimeout(() => {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();

      if (!selectedText) {
        if (dragButton) {
          dragButton.style.display = "none";
          isButtonVisible = false;
        }
      }
    }, 100);
  });
}

// 모달 생성 함수
function createModal(selectedText) {
  console.log("Creating modal with text:", selectedText); // 디버깅용

  const modal = document.createElement("div");
  modal.className = "code-review-modal";
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <div class="modal-columns">
          <div class="modal-left-column">
            <h3>원본 코드</h3>
            <div class="code-container">
              <pre><code>${selectedText}</code></pre>
            </div>
          </div>
          <div class="modal-right-column">
              <h3>리뷰 내용</h3>
              <button class="copy-button">
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"/>
                </svg>
              </button>
            <div class="review-content"></div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // 모달 닫기 버튼 이벤트
  const closeButton = modal.querySelector(".modal-close");
  closeButton.onclick = () => {
    modal.remove();
  };

  // 모달 외부 클릭 시 닫기
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  };

  // 리뷰 시작 전에 선택된 텍스트 확인
  if (!selectedText || selectedText.trim() === "") {
    reviewContent.innerHTML = `<div class="error-message">오류: 선택된 코드가 없습니다.</div>`;
    return;
  }

  startReview(selectedText, modal.querySelector(".review-content"));
}

// 리뷰 시작 함수
// 리뷰 시작 함수
async function startReview(selectedText, reviewContent) {
  try {
    // 사용자 정보 가져오기
    const userInfo = await new Promise((resolve) => {
      chrome.storage.local.get("userInfo", (result) => {
        resolve(result.userInfo);
      });
    });

    if (!userInfo) {
      throw new Error("로그인이 필요합니다.");
    }

    // 초기 로딩 상태 표시
    reviewContent.innerHTML = "<div>리뷰를 시작합니다...</div>";

    // 요청 데이터 준비
    const requestData = {
      userId: userInfo.id,
      code: selectedText,
    };

    console.log("Sending request with data:", requestData); // 디버깅용

    // POST 요청 설정
    const response = await fetch("http://localhost:8000/api/v1/partreviews/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      credentials: "include",
      body: JSON.stringify(requestData),
    });

    // 응답 로깅
    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers));

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response:", errorData); // 디버깅용
      throw new Error(errorData.error || "리뷰 요청에 실패했습니다.");
    }

    // 스트리밍 응답 처리
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // 버퍼에서 이벤트 데이터 추출
      const events = buffer.split("\n\n");
      buffer = events.pop() || ""; // 남은 데이터는 버퍼에 보관

      for (const event of events) {
        if (event.trim()) {
          const eventData = event.replace(/^data: /, "").trim();
          if (eventData) {
            try {
              const parsedData = JSON.parse(eventData);

              // AI의 스트리밍된 응답 처리
              if (parsedData.choices && parsedData.choices[0].delta.content) {
                // 텍스트를 한 글자씩 추가하여 스트리밍 효과 강조
                const content = parsedData.choices[0].delta.content;
                for (let i = 0; i < content.length; i++) {
                  reviewContent.textContent += content[i];
                  await new Promise((resolve) => setTimeout(resolve, 10)); // 50ms 딜레이 추가
                }
              }
            } catch (error) {
              console.error("JSON 파싱 오류:", error);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error:", error);
    reviewContent.innerHTML = `<div class="error-message">오류: ${error.message}</div>`;
  }
}

// 초기화 함수 실행
initializeDragHandler();
