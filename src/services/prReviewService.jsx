import api from "./api";

// PR 리뷰 전체 조회
export const getPRReviews = async (user_id, page, size = 20) => {
  try {
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
export const searchPRReviews = async (user_id, title, page, size = 20) => {
  try {
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
export const getPRReviewCategories = async (user_id) => {
  try {
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
