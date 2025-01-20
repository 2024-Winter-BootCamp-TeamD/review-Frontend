import api from "./api";

// 사용자 정보 가져오기
export const fetchUserInfo = async () => {
    try {
        const response = await api.get(`/users/1/`);
        return response.data;
    } catch (error) {
        console.error('사용자 정보 가져오기 에러:', error.response?.data || error.message);
        throw error;
    }
};

// 전체 기간 날짜별 평균 등급 조회하기 (date, average_grade 불러옴)
export const getAverageGrade = async () => {
  try {
    const userInfo = await fetchUserInfo();
    const user_id = userInfo.user_details.id;

    const response = await api.get(`/pr-reviews/aver-grade/all`, {
      params: { user_id }, // 쿼리 파라미터로 user_id 전달
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching average grade:", error);
    throw error;
  }
};

// 도넛차트에 쓸 데이터 불러오기 (problem type, count, category 불러옴)
export const getRecentReview = async () => {
  try {
    const userInfo = await fetchUserInfo();
    const user_id = userInfo.user_details.id;

    const response = await api.get(`/pr-reviews/trouble-type`, {
      params: { user_id }, // 쿼리 파라미터로 user_id 전달
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching recent 10 review:", error);
    throw error;
  }
};

// 모드변경버튼 누르면 실제로 모드 변경하기 (mode는 변경할 리뷰 모드를 의미)
export const switchMode = async (mode) => {
  try {
    const userInfo = await fetchUserInfo();
    const user_id = userInfo.user_details.id;

    const response = await api.post(`/users/${user_id}/mode/`, {
      review_mode: mode,
    });
    return response.data;
  } catch (error) {
    console.error("Error applying mode:", error);
    throw error;
  }
};