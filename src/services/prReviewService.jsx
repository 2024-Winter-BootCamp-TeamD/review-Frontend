import api from "./api";

// 사용자 정보 가져오기
export const fetchUserInfo = async () => {
  try {
    const userInfo = await chrome.storage.local.get("userInfo");
    const user_id = userInfo.userInfo?.id;
    console.log("로그인 된 사용자 id:", user_id);
    if (!user_id) {
      throw new Error("로그인된 사용자 정보를 찾을 수 없습니다.");
    }

    const response = await api.get(`/users/${user_id}/`);
    return response.data;
  } catch (error) {
    console.error(
      "사용자 정보 가져오기 에러:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// PR 리뷰 전체 조회
export const getPRReviews = async (page, size = 20) => {
  try {
    const userInfo = await fetchUserInfo();
    const user_id = userInfo.user_details.id;

    const response = await api.get("/pr-reviews/", {
      params: {
        user_id,
        page,
        size,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching PR reviews:", error);
    throw error;
  }
};

// PR 리뷰 검색
export const searchPRReviews = async (title, page, size = 20) => {
  try {
    const userInfo = await fetchUserInfo();
    const user_id = userInfo.user_details.id;

    if (!title) {
      throw new Error("검색어를 입력해주세요.");
    }

    const response = await api.get("/pr-reviews/search", {
      params: {
        user_id,
        title,
        page,
        size,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching PR reviews:", error);
    throw error;
  }
};

// PR 모드 카테고리별 통계 조회
export const getPRReviewCategories = async () => {
  try {
    const userInfo = await fetchUserInfo();
    const user_id = userInfo.user_details.id;

    const response = await api.get("/pr-reviews/category", {
      params: {
        user_id,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching PR review categories:", error);
    throw error;
  }
};
