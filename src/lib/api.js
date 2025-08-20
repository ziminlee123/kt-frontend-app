import axios from 'axios';

// API 기본 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// 요청 인터셉터 (인증 토큰 등 추가)
api.interceptors.request.use(
  (config) => {
    // TODO: 인증 토큰이 있다면 헤더에 추가
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 처리)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 인증 실패 시 처리
      console.error('Authentication failed');
      // TODO: 로그인 페이지로 리다이렉트
    }
    return Promise.reject(error);
  }
);

// Festival API
export const festivalApi = {
  // 모든 축제 조회
  getAllFestivals: async () => {
    try {
      const response = await api.get('/festivals');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch festivals:', error);
      throw error;
    }
  },

  // 특정 축제 조회
  getFestivalById: async (id) => {
    try {
      const response = await api.get(`/festivals/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch festival ${id}:`, error);
      throw error;
    }
  },

  // 축제 생성
  createFestival: async (festivalData) => {
    try {
      const response = await api.post('/festivals', festivalData);
      return response.data;
    } catch (error) {
      console.error('Failed to create festival:', error);
      throw error;
    }
  },

  // 축제 수정
  updateFestival: async (id, festivalData) => {
    try {
      const response = await api.put(`/festivals/${id}`, festivalData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update festival ${id}:`, error);
      throw error;
    }
  },

  // 축제 삭제
  deleteFestival: async (id) => {
    try {
      const response = await api.delete(`/festivals/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete festival ${id}:`, error);
      throw error;
    }
  },
};

// Zone API
export const zoneApi = {
  // 축제의 모든 구역 조회
  getZonesByFestivalId: async (festivalId) => {
    try {
      const response = await api.get(`/festivals/${festivalId}/zones`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch zones for festival ${festivalId}:`, error);
      throw error;
    }
  },

  // 특정 구역 조회
  getZoneById: async (festivalId, zoneId) => {
    try {
      const response = await api.get(`/festivals/${festivalId}/zones/${zoneId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch zone ${zoneId}:`, error);
      throw error;
    }
  },

  // 구역 생성
  createZone: async (festivalId, zoneData) => {
    try {
      const response = await api.post(`/festivals/${festivalId}/zones`, zoneData);
      return response.data;
    } catch (error) {
      console.error('Failed to create zone:', error);
      throw error;
    }
  },

  // 구역 수정
  updateZone: async (festivalId, zoneId, zoneData) => {
    try {
      const response = await api.put(`/festivals/${festivalId}/zones/${zoneId}`, zoneData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update zone ${zoneId}:`, error);
      throw error;
    }
  },

  // 구역 삭제
  deleteZone: async (festivalId, zoneId) => {
    try {
      const response = await api.delete(`/festivals/${festivalId}/zones/${zoneId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete zone ${zoneId}:`, error);
      throw error;
    }
  },
};

// Analytics API (운영 지원 및 리포트용)
export const analyticsApi = {
  // 실시간 혼잡도 데이터
  getCongestionData: async (festivalId) => {
    try {
      const response = await api.get(`/festivals/${festivalId}/analytics/congestion`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch congestion data for festival ${festivalId}:`, error);
      throw error;
    }
  },

  // SNS 반응 데이터
  getSNSFeedback: async (festivalId) => {
    try {
      const response = await api.get(`/festivals/${festivalId}/analytics/sns-feedback`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch SNS feedback for festival ${festivalId}:`, error);
      throw error;
    }
  },

  // 축제 결과 리포트
  getFestivalReport: async (festivalId) => {
    try {
      const response = await api.get(`/festivals/${festivalId}/analytics/report`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch report for festival ${festivalId}:`, error);
      throw error;
    }
  },

  // AI 기획 추천
  getPlanningRecommendations: async (festivalData) => {
    try {
      const response = await api.post('/analytics/planning-recommendations', festivalData);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch planning recommendations:', error);
      throw error;
    }
  },
};

export default api;
