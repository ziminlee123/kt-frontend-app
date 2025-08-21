import axios from 'axios';

// API 기본 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30초로 증가
});

// 요청 인터셉터 (인증 토큰 등 추가)
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API 요청: ${config.method?.toUpperCase()} ${config.url}`);
    // TODO: 인증 토큰이 있다면 헤더에 추가
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    console.error('❌ 요청 에러:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 처리 및 ApiResponseDTO 처리)
api.interceptors.response.use(
  (response) => {
    console.log('🔄 API 인터셉터 - 원본 응답:', response);
    
    // 백엔드가 ApiResponseDTO 형태로 응답하는지 확인
    if (response.data && response.data.success && response.data.data !== undefined) {
      console.log('✅ ApiResponseDTO 형태 감지 - data 필드 추출');
      return {
        ...response,
        data: response.data.data, // ApiResponseDTO의 data 필드만 반환
        message: response.data.message
      };
    }
    
    console.log('📦 일반 응답 형태 - 그대로 반환');
    return response;
  },
  (error) => {
    // 상세한 에러 로깅
    console.error('❌ API 응답 에러:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        method: error.config?.method,
        url: error.config?.url,
        timeout: error.config?.timeout
      }
    });

    if (error.response?.status === 401) {
      // 인증 실패 시 처리
      console.error('Authentication failed');
      // TODO: 로그인 페이지로 리다이렉트
    }
    
    // 타임아웃 에러 처리
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      error.message = '서버 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.';
    }
    
    // 백엔드 에러 메시지 추출
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }
    
    return Promise.reject(error);
  }
);

// Festival API
export const festivalApi = {
  // 모든 축제 조회 (페이징 및 필터링 지원)
  getAllFestivals: async (params = {}) => {
    try {
      const response = await api.get('/festivals', { params });
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

  // 축제 상태 변경
  updateFestivalStatus: async (id, status) => {
    try {
      const response = await api.patch(`/festivals/${id}/status`, null, {
        params: { status }
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to update festival status ${id}:`, error);
      throw error;
    }
  },

  // 현재 운영 중인 축제 조회
  getRunningFestivals: async () => {
    try {
      const response = await api.get('/festivals/running');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch running festivals:', error);
      throw error;
    }
  },

  // 예정된 축제 조회
  getUpcomingFestivals: async () => {
    try {
      const response = await api.get('/festivals/upcoming');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch upcoming festivals:', error);
      throw error;
    }
  },

  // 축제 통계 조회
  getFestivalStatistics: async () => {
    try {
      const response = await api.get('/festivals/statistics');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch festival statistics:', error);
      throw error;
    }
  },

  // 축제 결과 업데이트
  updateFestivalResults: async (id, resultsData) => {
    try {
      const response = await api.patch(`/festivals/${id}/results`, resultsData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update festival results ${id}:`, error);
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

  // 실시간 구역 데이터 업데이트
  updateZoneRealTimeData: async (festivalId, zoneId, updateData) => {
    try {
      const response = await api.patch(`/festivals/${festivalId}/zones/${zoneId}/realtime`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update zone real-time data ${zoneId}:`, error);
      throw error;
    }
  },

  // 혼잡도 높은 구역 조회
  getHighCongestionZones: async (festivalId, threshold = 80) => {
    try {
      const response = await api.get(`/festivals/${festivalId}/zones/congestion/high`, {
        params: { threshold }
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch high congestion zones for festival ${festivalId}:`, error);
      throw error;
    }
  },

  // 여유 있는 구역 조회
  getLowCongestionZones: async (festivalId, threshold = 40) => {
    try {
      const response = await api.get(`/festivals/${festivalId}/zones/congestion/low`, {
        params: { threshold }
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch low congestion zones for festival ${festivalId}:`, error);
      throw error;
    }
  },

  // 구역 타입별 조회
  getZonesByType: async (festivalId, type) => {
    try {
      const response = await api.get(`/festivals/${festivalId}/zones/type/${type}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch zones by type for festival ${festivalId}:`, error);
      throw error;
    }
  },

  // 구역 통계 조회
  getZoneStatistics: async (festivalId) => {
    try {
      const response = await api.get(`/festivals/${festivalId}/zones/statistics`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch zone statistics for festival ${festivalId}:`, error);
      throw error;
    }
  },
};

// Dashboard API (운영 대시보드)
export const dashboardApi = {
  // 운영 대시보드 데이터 조회
  getOperationalDashboard: async () => {
    try {
      const response = await api.get('/dashboard/operational');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch operational dashboard:', error);
      throw error;
    }
  },

  // 특정 축제 대시보드 데이터
  getFestivalDashboard: async (festivalId) => {
    try {
      const response = await api.get(`/dashboard/festival/${festivalId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch festival dashboard for ${festivalId}:`, error);
      throw error;
    }
  },
};

// SNS Feedback API
export const snsApi = {
  // SNS 피드백 조회
  getSNSFeedback: async (festivalId) => {
    try {
      const response = await api.get(`/sns-feedback/festival/${festivalId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch SNS feedback for festival ${festivalId}:`, error);
      throw error;
    }
  },

  // SNS 피드백 생성
  createSNSFeedback: async (feedbackData) => {
    try {
      const response = await api.post('/sns-feedback', feedbackData);
      return response.data;
    } catch (error) {
      console.error('Failed to create SNS feedback:', error);
      throw error;
    }
  },

  // 감정 분석 결과 조회
  getSentimentAnalysis: async (festivalId) => {
    try {
      const response = await api.get(`/sns-feedback/festival/${festivalId}/sentiment`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch sentiment analysis for festival ${festivalId}:`, error);
      throw error;
    }
  },
};

// Health Check API
export const healthApi = {
  // 서버 상태 확인
  checkHealth: async () => {
    try {
      // 헬스체크는 /api 경로를 사용하지 않음
      const response = await axios.get('http://localhost:8080/health');
      return response.data;
    } catch (error) {
      console.error('Failed to check server health:', error);
      throw error;
    }
  },
};

export default api;
