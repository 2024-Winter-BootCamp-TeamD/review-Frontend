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

// 특정 레포지토리 가져오기 (쿼리 파라미터 사용)
export const getActiveReposById = async () => {
  try {
    const userInfo = await fetchUserInfo();
    const user_id = userInfo.user_details.id;

    const response = await api.get(`/repositories/active/`, {
      params: { user_id }, // 쿼리 파라미터로 user_id 전달
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching repos:", error);
    throw error;
  }
};

export const getInactiveReposById = async () => {
  try {
    const userInfo = await fetchUserInfo();
    const user_id = userInfo.user_details.id;

    const response = await api.get(`/repositories/inactive/`, {
      params: { user_id }, // 쿼리 파라미터로 user_id 전달
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching repos:", error);
    throw error;
  }
};

export const toggleRepoStatus = async (repositoryIds, isApply) => {
  try {
    const response = await api.post(`/repositories/select/`, {
      repositories: repositoryIds,
      is_apply: isApply,
    });
    return response.data;
  } catch (error) {
    console.error("Error applying repos:", error);
    throw error;
  }
};
