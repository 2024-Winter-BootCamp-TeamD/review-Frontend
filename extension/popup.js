let popupWindowId = null; // 팝업 창의 ID를 저장할 변수

// 사용자 정보 확인
async function checkUserInfo() {
  try {
    const userInfo = await chrome.storage.local.get("userInfo");
    return userInfo.userInfo;
  } catch (error) {
    console.error("Error checking user info:", error);
    return null;
  }
}

// 메시지 리스너 추가
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateLoginStatus" && request.userInfo) {
    showLoggedInUI(request.userInfo, request.message);
  }
});

// GitHub 로그인 처리
async function handleGitHubLogin() {
  try {
    // OAuth 창을 새 창으로 열기
    chrome.windows.create(
      {
        url: "https://github.com/login/oauth/authorize?client_id=Ov23liTHrg74CjBEbO5R&redirect_uri=http://127.0.0.1:8000/api/v1/oauth/login/github/callback/&scope=repo,read:org,public_repo,write:discussion",
        type: "popup",
        width: 400,
        height: 400,
      },
      (window) => {
        console.log("OAuth 창이 열렸습니다:", window.id);
      }
    );
  } catch (error) {
    console.error("Login error:", error);
  }
}

// 팝업 창 닫기 함수
function closePopupWindow() {
  if (popupWindowId !== null) {
    chrome.windows.remove(popupWindowId, () => {
      console.log("Popup window closed");
      popupWindowId = null; // ID 초기화
    });
  } else {
    console.log("No popup window to close");
  }
}

// 사용자 정보 표시 함수
function displayUserInfo(userInfo) {
  const userInfoDiv = document.getElementById("userInfo");
  userInfoDiv.innerHTML = `
    <p>ID: ${userInfo.id}</p>
    <p>GitHub Username: ${userInfo.github_username}</p>
    <p>Profile Image: <img src="${userInfo.profile_image}" alt="Profile Image" /></p>
  `;
}

async function handleLogout() {
  try {
    // 로컬 스토리지에서 사용자 정보 삭제
    await chrome.storage.local.remove("userInfo");

    // 플로팅 버튼 제거
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0] && tabs[0].url.includes("github.com")) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "toggleFloatingButton",
        show: false,
      });
    }

    // UI를 로그인 버튼으로 되돌리기
    const container = document.querySelector(".container");
    container.innerHTML = `
      <h1 class="title">Refactory</h1>
      <button class="login-button" id="githubLogin">
        <svg class="github-icon" height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
        </svg>
        GitHub 계정 연동하기
      </button>
    `;

    // 로그인 버튼에 이벤트 리스너 다시 추가
    const loginButton = document.getElementById("githubLogin");
    if (loginButton) {
      loginButton.addEventListener("click", handleGitHubLogin);
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
}

// 로그인된 상태의 UI를 보여주는 함수
function showLoggedInUI(userInfo, message = null) {
  const container = document.querySelector(".container");
  container.innerHTML = `
    <h1 class="title">Refactory</h1>
    ${message ? `<p class="login-message">${message}</p>` : ""}
    <div class="user-info">
      <img src="${userInfo.profile_image}" alt="Profile" style="width: 50px; height: 50px; border-radius: 50%;" />
      <p>GitHub Username: ${userInfo.github_username}</p>
      <button class="logout-button" id="logout">로그아웃</button>
    </div>
  `;

  // 로그아웃 버튼에 이벤트 리스너 추가
  const logoutButton = document.getElementById("logout");
  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
  }
}

// 초기화
document.addEventListener("DOMContentLoaded", async () => {
  console.log("팝업 초기화");

  // 저장된 사용자 정보 확인
  const userInfo = await checkUserInfo();

  if (userInfo) {
    // 이미 로그인된 경우 사용자 정보와 로그아웃 버튼 표시
    showLoggedInUI(userInfo);

    // 현재 활성화된 탭에 플로팅 버튼 표시
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0] && tabs[0].url.includes("github.com")) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "toggleFloatingButton",
        show: true,
      });
    }
  } else {
    // 로그인 버튼 이벤트 리스너 등록
    const loginButton = document.getElementById("githubLogin");
    if (loginButton) {
      loginButton.addEventListener("click", handleGitHubLogin);
    }
  }
});
