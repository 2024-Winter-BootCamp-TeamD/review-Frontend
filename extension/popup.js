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

// GitHub 로그인 처리
async function handleGitHubLogin() {
  try {
    const response = await fetch("http://localhost:8000/api/v1/oauth/login/", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();

    // 팝업 창으로 GitHub OAuth 페이지 열기
    chrome.windows.create({
      url: data.redirect_url,
      type: "popup",
      width: 800,
      height: 600,
    });

    // 현재 팝업 닫기
    window.close();
  } catch (error) {
    console.error("Login error:", error);
  }
}

// 초기화
document.addEventListener("DOMContentLoaded", async () => {
  const userInfo = await checkUserInfo();

  if (userInfo) {
    // 사용자 정보가 있으면 플로팅 버튼 토글
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    chrome.tabs.sendMessage(tab.id, { action: "toggleFloatingButton" });
    window.close();
  } else {
    // 로그인 버튼 이벤트 리스너 추가
    document
      .getElementById("githubLogin")
      .addEventListener("click", handleGitHubLogin);
  }
});
