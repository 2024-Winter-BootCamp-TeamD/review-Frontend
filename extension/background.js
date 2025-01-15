chrome.runtime.onInstalled.addListener(() => {
  console.log("크롬 익스텐션이 설치되었습니다.");
});

// 익스텐션 아이콘 클릭 이벤트
chrome.action.onClicked.addListener(async (tab) => {
  // 현재 활성화된 탭에 메시지 전송
  chrome.tabs.sendMessage(tab.id, { action: "toggleFloatingButton" });
});

// content script에서 보내는 메시지 처리
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openNewTab") {
    chrome.windows.create({
      url: "index.html",
      type: "popup",
      width: 1200,
      height: 800,
    });
  }
});
