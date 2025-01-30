console.log("백그라운드 스크립트 로드됨");

chrome.runtime.onInstalled.addListener(() => {
  console.log("크롬 익스텐션이 설치되었습니다.");
});

// 익스텐션 아이콘 클릭 이벤트
chrome.action.onClicked.addListener(async (tab) => {
  try {
    // 먼저 content script가 로드되어 있는지 확인
    const response = await chrome.tabs
      .sendMessage(tab.id, { action: "ping" })
      .catch(() => false);

    if (response) {
      // content script가 로드되어 있으면 메시지 전송
      chrome.tabs.sendMessage(tab.id, { action: "toggleFloatingButton" });
    } else {
      // content script가 로드되어 있지 않으면 새로 주입
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"],
      });
      await chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ["content.css"],
      });
      // 주입 후 메시지 전송
      chrome.tabs.sendMessage(tab.id, { action: "toggleFloatingButton" });
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

let oauthWindowId = null;

// content script에서 보내는 메시지 처리
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "ping") {
    sendResponse(true);
    return;
  }

  if (request.action === "openNewTab") {
    chrome.windows.create({
      url: "index.html",
      type: "popup",
      state: "fullscreen",
    });
  }

  if (request.action === "checkUserInfo") {
    chrome.storage.local.get("userInfo", (result) => {
      sendResponse({ userInfo: result.userInfo || null });
    });
    return true;
  }

  if (request.action === "openGitHubOAuth") {
    // 기존 OAuth 창이 있다면 닫기
    if (oauthWindowId) {
      chrome.windows.remove(oauthWindowId);
    }

    // 새 창으로 GitHub OAuth 페이지 열기
    chrome.windows.create(
      {
        url: request.url,
        type: "popup",
        width: 800,
        height: 600,
      },
      (window) => {
        oauthWindowId = window.id;
        console.log("OAuth 창 생성됨:", window.id);
      }
    );
  }

  if (request.action === "openOAuthPopup") {
    // 기존 팝업이 있다면 닫기
    if (oauthWindowId) {
      chrome.windows.remove(oauthWindowId);
    }

    // 새 팝업 생성
    chrome.windows.create(
      {
        url: request.url,
        type: "popup",
        width: 800,
        height: 600,
      },
      (window) => {
        oauthWindowId = window.id;
      }
    );
  }
});

// URL 변경 감지 및 처리
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!changeInfo.url) return;

  console.log("URL 변경 감지:", changeInfo.url);

  // GitHub OAuth 인증 완료 후 리다이렉트된 페이지 감지
  if (changeInfo.url.includes("/api/v1/oauth/login/github/callback")) {
    try {
      // 백엔드에서 사용자 정보 가져오기
      const response = await fetch(
        "http://refactory.store:8000/api/v1/oauth/login/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();
      console.log("로그인 데이터:", data);

      chrome.tabs.remove(tabId);

      if (data.user) {
        // 사용자 정보 저장
        await chrome.storage.local.set({
          userInfo: {
            id: data.user.id,
            github_username: data.user.github_username,
            email: data.user.email,
            profile_image: data.user.profile_image,
          },
        });

        console.log("사용자 정보 저장됨:", data.user);
        console.log("서버 메시지:", data.message);

        // 메인 팝업 UI 업데이트를 위한 메시지 전송
        chrome.runtime.sendMessage({
          action: "updateLoginStatus",
          userInfo: data.user,
          message: data.message,
        });

        // GitHub 탭에 플로팅 버튼 표시
        const githubTabs = await chrome.tabs.query({ url: "*://github.com/*" });
        githubTabs.forEach((tab) => {
          chrome.tabs.sendMessage(tab.id, {
            action: "toggleFloatingButton",
            show: true,
          });
        });
      }
    } catch (error) {
      console.error("로그인 처리 중 에러:", error);
    }
  }
});

// 창이 닫힐 때 oauthWindowId 초기화
chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId === oauthWindowId) {
    console.log("OAuth 창이 닫힘");
    oauthWindowId = null;
  }
});
