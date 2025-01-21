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

// 보고서 전체 조회
export const getReports = async (page = 1, size = 10) => {
  try {
    const userInfo = await fetchUserInfo();
    const user_id = userInfo.user_details.id;

    const response = await api.get(`/reports/${user_id}/`, {
      params: {
        page,
        size,
      },
    });
    return response.data;
  } catch (error) {
    console.error("보고서 목록 조회 중 오류 발생:", error);
    throw error;
  }
};

// 보고서 작성 요청(생성)
export const createReport = async (report_title, pr_ids) => {
  try {
    const userInfo = await fetchUserInfo();
    const user_id = userInfo.user_details.id;

    // PR 개수 유효성 검사
    if (pr_ids.length < 5 || pr_ids.length > 10) {
      throw new Error("PR은 5개에서 10개 사이로 선택해야 합니다.");
    }

    const response = await api.post(`/reports/${user_id}/`, {
      report_title,
      pr_ids: pr_ids, // 배열 그대로 전송
    });
    return response.data;
  } catch (error) {
    console.error("보고서 작성 요청 중 오류 발생:", error);
    throw error;
  }
};

// 특정 보고서 조회
export const getReportById = async (report_id) => {
  try {
    const response = await api.get(`/reports/${report_id}/detail`);
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        console.error("보고서를 찾을 수 없거나 삭제되었습니다:", error);
      }
    }
    console.error("보고서 조회 중 오류 발생:", error);
    throw error;
  }
};

// 보고서 삭제
export const deleteReport = async (report_id) => {
  try {
    const response = await api.delete(`/reports/${report_id}/delete/`);
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        console.error("삭제할 보고서를 찾을 수 없습니다:", error);
      }
    }
    console.error("보고서 삭제 중 오류 발생:", error);
    throw error;
  }
};

// 보고서 다운로드
export const downloadReport = async (report_id) => {
  try {
    const response = await api.get(`/reports/${report_id}/download`);
    return response.data;
  } catch (error) {
    console.error("보고서 다운로드 중 오류 발생:", error);
    throw error;
  }
};

// 보고서 작성에 사용된 모드 조회
export const getReportModes = async (report_id) => {
  try {
    const response = await api.get(`/reports/${report_id}/mode`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("보고서 모드 조회 중 오류 발생:", error);
    throw error;
  }
};

// PR 리뷰 목록 조회
export const getPrReviews = async (page, size = 10) => {
  try {
    const userInfo = await fetchUserInfo();
    const user_id = userInfo.user_details.id;

    const response = await api.get("/pr-reviews", {
      params: {
        user_id,
        page,
        size,
      },
    });

    if (!response.data || Object.keys(response.data).length === 0) {
      return { data: {} };
    }

    return response.data;
  } catch (error) {
    console.error("PR 리뷰 목록 조회 중 오류 발생:", error);
    throw error;
  }
};
