import api from "./api";

// 보고서 전체 조회
export const getReports = async (user_id, page = 1, size = 10) => {
  try {
    const response = await api.get(`/reports/${user_id}`, {
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
export const createReport = async (user_id, report_title, pr_ids) => {
  try {
    // PR 개수 유효성 검사
    if (pr_ids.length < 5 || pr_ids.length > 10) {
      throw new Error("PR은 5개에서 10개 사이로 선택해야 합니다.");
    }

    const reportData = {
      user_id,
      report_title,
      pr_ids,
    };

    const response = await api.post("/reports", reportData);
    return response.data;
  } catch (error) {
    console.error("보고서 작성 요청 중 오류 발생:", error);
    throw error;
  }
};

// 특정 보고서 조회
export const getReportById = async (report_id) => {
  try {
    const response = await api.get(`/reports/detail/${report_id}`);
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
export const getPrReviews = async (user_id, page, size = 10) => {
  try {
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
