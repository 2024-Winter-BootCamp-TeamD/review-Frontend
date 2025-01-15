// GitHub 페이지에 주입될 스크립트
document.addEventListener("DOMContentLoaded", () => {
  // GitHub PR 페이지 감지
  if (window.location.pathname.includes("/pull/")) {
    // 플로팅 버튼 추가
    injectFloatingButton();
  }
});

function injectFloatingButton() {
  // FloatingButton 컴포넌트의 기능을 여기에 구현
}
