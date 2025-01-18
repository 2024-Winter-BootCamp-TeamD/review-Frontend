import api from "./api";

// 특정 레포지토리 가져오기 (쿼리 파라미터 사용)
export const getActiveReposById = async (user_id) => {
  try {
    const response = await api.get(`/repositories/active/`, {
      params: { user_id }, // 쿼리 파라미터로 user_id 전달
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching repos:", error);
    throw error;
  }
};

export const getInactiveReposById = async (user_id) => {
  try {
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
