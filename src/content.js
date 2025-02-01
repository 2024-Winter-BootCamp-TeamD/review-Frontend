// 전역 변수들을 window 객체에 저장하여 중복 선언 방지
if (typeof window.floatingButtonState === "undefined") {
  // 초기 상태를 사용자의 현재 리뷰 모드로 설정
  chrome.storage.local.get("userInfo", (result) => {
    const userInfo = result.userInfo;
    const modeColors = {
      BASIC: "#FF794E",
      CLEAN: "#4DABF5",
      OPTIMIZE: "#BC6FCD",
      STUDY: "#FFCD39",
      NEWBIE: "#70BF73",
    };

    const mode = userInfo?.reviewMode?.toUpperCase() || "BASIC";
    const icon = `<img src="${chrome.runtime.getURL(`icons/${mode.toLowerCase()}.png`)}" 
                      height="40" 
                      width="40" 
                      style="margin-top: 14px;"
                      alt="${mode} Mode Icon" />`;

    window.floatingButtonState = {
      isFloatingButtonVisible: false,
      isOpen: false,
      selectedButton: {
        text: icon,
        backgroundColor: modeColors[mode],
      },
    };
  });
} else {
  // 이미 초기화된 경우는 그대로 유지
  window.floatingButtonState = window.floatingButtonState;
}

// 익스텐션 버튼 클릭 메시지 수신
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "ping") {
    sendResponse(true);
    return;
  }

  if (request.action === "toggleFloatingButton") {
    // 사용자 정보와 현재 모드를 API로 조회
    chrome.storage.local.get("userInfo", async (result) => {
      const userInfo = result.userInfo;

      if (userInfo) {
        try {
          const response = await fetch(
            `https://refactory.store/api/v1/users/${userInfo.id}/`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );

          if (response.ok) {
            const data = await response.json();
            console.log("API Response:", data); // 디버깅용

            const currentMode = data.review_mode?.toLowerCase() || "basic";
            console.log("Current Mode:", currentMode); // 디버깅용

            const modeColors = {
              basic: "#FF794E",
              clean: "#4DABF5",
              optimize: "#BC6FCD",
              study: "#FFCD39",
              newbie: "#70BF73",
            };

            window.floatingButtonState.selectedButton = {
              text: `<img src="${chrome.runtime.getURL(`icons/${currentMode}.png`)}" 
                    height="40" 
                    width="40" 
                    style="margin-top: 14px;"
                    alt="${currentMode} Mode Icon" />`,
              backgroundColor: modeColors[currentMode],
            };
          }
        } catch (error) {
          console.error("Failed to fetch current mode:", error);
        }
      }

      // 버튼 표시 로직
      if (request.show) {
        if (!window.floatingButtonState.isFloatingButtonVisible) {
          injectFloatingButton();
          window.floatingButtonState.isFloatingButtonVisible = true;
        }
      } else {
        if (!window.floatingButtonState.isFloatingButtonVisible) {
          injectFloatingButton();
        } else {
          removeFloatingButton();
        }
        window.floatingButtonState.isFloatingButtonVisible =
          !window.floatingButtonState.isFloatingButtonVisible;
      }
    });
  }
});

async function handleButtonClick(mode, backgroundColor) {
  const svgIcons = {
    dashboard: `<img src="${chrome.runtime.getURL("icons/dashboard.png")}" 
          height="40" 
          width="40" 
          style="margin-top: 14px;"
          alt="Dashboard Icon" />`,

    clean: `<img src="${chrome.runtime.getURL("icons/clean.png")}" 
          height="40" 
          width="40" 
          style="margin-top: 16px;"
          alt="Clean Mode Icon" />`,

    basic: `<img src="${chrome.runtime.getURL("icons/basic.png")}" 
          height="40" 
          width="40" 
          style="margin-top: 14px;"
          alt="Basic Mode Icon" />`,

    optimize: `<img src="${chrome.runtime.getURL("icons/optimize.png")}" 
          height="40" 
          width="40" 
          style="margin-top: 16px;"
          alt="Optimize Mode Icon" />`,

    study: `<img src="${chrome.runtime.getURL("icons/study.png")}" 
          height="40" 
          width="40" 
          style="margin-top: 14px;"
          alt="Study Mode Icon" />`,

    newbie: `<img src="${chrome.runtime.getURL("icons/newbie.png")}" 
          height="44" 
          width="44" 
          style="margin-top: 14px;"
          alt="Newbie Mode Icon" />`,
  };
  // 기존 UI 업데이트 로직
  setSelectionColor(backgroundColor);
  setDragButtonColor(backgroundColor);
  window.floatingButtonState.selectedButton = {
    text: svgIcons[mode],
    backgroundColor,
  };
  window.floatingButtonState.isOpen = false;
  updateFloatingButton();
  try {
    // 사용자 정보 가져오기
    const userInfo = await new Promise((resolve) => {
      chrome.storage.local.get("userInfo", (result) => {
        resolve(result.userInfo);
      });
    });

    // API 요청 보내기
    const response = await fetch(
      `https://refactory.store/api/v1/users/${userInfo.id}/mode/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          review_mode: mode,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("모드 변경에 실패했습니다.");
    }
  } catch (error) {
    console.error("모드 변경 중 오류 발생:", error);
  }
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
          <img src="${chrome.runtime.getURL("icons/dashboard.png")}" 
          height="32" 
          width="32" 
          style="margin-top: 14px ;"
          alt="Dashboard Icon" />
        </span>
      </div>

      <div class="floatingbutton-menu-item floatingbutton-clean-code" data-tooltip="Clean Code Mode">
        <span class="floatingbutton-item-text">
          <img src="${chrome.runtime.getURL("icons/clean.png")}" 
          height="36" 
          width="36" 
          style="margin-top: 14px;"
          alt="Clean Code Mode Icon" />
        </span>
      </div>

      <div class="floatingbutton-menu-item floatingbutton-basic" data-tooltip="Basic Mode">
        <span class="floatingbutton-item-text">
         <img src="${chrome.runtime.getURL("icons/basic.png")}" 
          height="32" 
          width="32" 
          style="margin-top: 14px; margin-left: 1px;"
          alt="Basic Mode Icon" />
        </span>
      </div>

      <div class="floatingbutton-menu-item floatingbutton-optimize" data-tooltip="Optimize Mode">
        <span class="floatingbutton-item-text">
          <img src="${chrome.runtime.getURL("icons/optimize.png")}" 
          height="32" 
          width="32" 
          style="margin-top: 15px;"
          alt="Optimize Mode Icon" />
        </span>
      </div>

      <div class="floatingbutton-menu-item floatingbutton-study" data-tooltip="Study Mode">
        <span class="floatingbutton-item-text">
          <img src="${chrome.runtime.getURL("icons/study.png")}" 
          height="32" 
          width="32" 
          style="margin-top: 14px; margin-left: 1.6px;"
          alt="Study Mode Icon" />
        </span>
      </div>

      <div class="floatingbutton-menu-item floatingbutton-newbie" data-tooltip="Newbie Mode">
        <span class="floatingbutton-item-text">
          <img src="${chrome.runtime.getURL("icons/newbie.png")}" 
          height="36" 
          width="36" 
          style="margin-top: 14px; margin-bottom: 10px;"
          alt="Newbie Mode Icon" />
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
    .addEventListener("click", () => handleButtonClick("clean", "#4DABF5"));
  document
    .querySelector(".floatingbutton-basic")
    .addEventListener("click", () => handleButtonClick("basic", "#FF794E"));
  document
    .querySelector(".floatingbutton-optimize")
    .addEventListener("click", () => handleButtonClick("optimize", "#BC6FCD"));
  document
    .querySelector(".floatingbutton-study")
    .addEventListener("click", () => handleButtonClick("study", "#FFCD39"));
  document
    .querySelector(".floatingbutton-newbie")
    .addEventListener("click", () => handleButtonClick("newbie", "#70BF73"));
}

//리뷰 내용을 복사하고 버튼 상태를 업데이트하는 함수
function copyReviewContent(reviewContent, copyButton) {
  const textToCopy = reviewContent.innerText;
  if (!textToCopy) return;

  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      // 복사 성공 시 UI 업데이트
      const copyText = copyButton.querySelector(".copy-text");
      const copiedText = copyButton.querySelector(".copied-text");

      if (copyText && copiedText) {
        copyText.style.display = "none";
        copiedText.style.display = "inline";
      }

      // 일정 시간 후 원래 상태로 복귀 (2초)
      setTimeout(() => {
        if (copyText && copiedText) {
          copyText.style.display = "inline";
          copiedText.style.display = "none";
        }
      }, 2000);
    })
    .catch((err) => {
      console.error("복사 실패:", err);
    });
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

//드래그 버튼 색상 설정 함수
function setDragButtonColor(color) {
  const dragButton = document.querySelector(".drag-review-button");
  if (dragButton) {
    dragButton.style.background = color;
  }
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

// 마크다운 변환 함수
function parseMarkdown(text) {
  if (!text) return "";
  // 코드 블록 변환 (```...```)
  text = text.replace(/```([\s\S]+?)```/g, "<pre><code>$1</code></pre>");
  // 인라인 코드 변환 (`...`)
  text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
  // 제목 변환 (#, ##, ### 등)
  text = text.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  text = text.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  text = text.replace(/^# (.+)$/gm, "<h1>$1</h1>");
  // 볼드 변환 (**텍스트**)
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // 이탤릭 변환 (*텍스트*)
  text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");
  // 인용구 변환 (> 텍스트)
  text = text.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");
  // 리스트 변환 (- 항목)
  text = text.replace(/^- (.+)$/gm, "<ul><li>$1</li></ul>");
  // 줄바꿈 변환 (각 줄을 <p>로 감싸기)
  text = text.replace(/\n/g, "<br>");
  return text;
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
               <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 
                1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" 
                fill="currentColor"/>
             </svg>
             <span class="copy-text">복사</span>
             <span class="copied-text" style="display: none;">✔ 복사됨</span>
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

  const reviewContent = modal.querySelector(".review-content");

  // 리뷰 시작 전에 선택된 텍스트 확인
  if (!selectedText || selectedText.trim() === "") {
    reviewContent.innerHTML = `<div class="error-message">오류: 선택된 코드가 없습니다.</div>`;
    return;
  }

  startReview(selectedText, modal.querySelector(".review-content"));

  //복사 버튼 이벤트 리스너
  const copyButton = modal.querySelector(".copy-button");
  copyButton.addEventListener("click", () => {
    copyReviewContent(reviewContent, copyButton);
  });
}

function setSelectionColor(color) {
  // style 태그가 이미 있는지 확인
  let styleTag = document.getElementById("mode-selection-style");
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = "mode-selection-style";
    document.head.appendChild(styleTag);
  }

  styleTag.textContent = `
    ::selection {
      background: ${color} !important;
      color: #ffffff !important;
    }
    ::-moz-selection {
      background: ${color} !important;
      color: #ffffff !important;
    }
  `;
}

// 리뷰 시작 함수
async function startReview(selectedText, reviewContent) {
  try {
    const userInfo = await new Promise((resolve) => {
      chrome.storage.local.get("userInfo", (result) => {
        resolve(result.userInfo);
      });
    });

    if (!userInfo) {
      throw new Error("로그인이 필요합니다.");
    }

    reviewContent.innerHTML =
      "<div>리뷰를 시작하겠습니다!<br>조금만 기다려주세요!<br><br>최대 30초 정도 소요될 수 있습니다...</div>";

    const requestData = {
      userId: userInfo.id,
      code: selectedText,
    };

    const response = await fetch(
      "https://refactory.store/api/v1/partreviews/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/event-stream",
        },
        credentials: "include",
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "리뷰 요청에 실패했습니다.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let bufferText = ""; // 전체 응답 저장 버퍼

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const jsonData = line.slice(6); // 'data: ' 제거
            const parsedData = JSON.parse(jsonData);

            if (parsedData.choices && parsedData.choices[0].delta.content) {
              const content = parsedData.choices[0].delta.content;
              bufferText += content; // 전체 응답 저장

              // ✅ **마크다운 변환을 한 번만 실행하여 깨지지 않도록 적용**
              reviewContent.innerHTML = parseMarkdown(bufferText);

              // ✅ **스크롤 자동 이동 (ChatGPT 스타일)**
              reviewContent.scrollTop = reviewContent.scrollHeight;
            }
          } catch (error) {
            console.error("데이터 파싱 오류:", error, "원본 데이터:", line);
            continue; // 파싱 오류가 발생해도 계속 진행
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
