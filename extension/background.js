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
});
