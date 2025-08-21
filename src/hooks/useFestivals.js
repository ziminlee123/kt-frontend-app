import { useState, useEffect, useCallback } from 'react';
import { festivalApi } from '../lib/api';

// Festival 데이터 관리를 위한 커스텀 훅
export function useFestivals() {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 모든 축제 조회 (페이징 및 필터링 지원)
  const fetchFestivals = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await festivalApi.getAllFestivals(params);
      console.log('🚀 Full API Response:', response);
      
      let festivalsData = [];
      
      // API 응답 구조 분석
      if (response && response.data) {
        console.log('📦 Response data:', response.data);
        
        // Case 1: response.data가 페이지네이션 객체인 경우
        if (response.data.content && Array.isArray(response.data.content)) {
          festivalsData = response.data.content;
          console.log('✅ Found festivals in response.data.content:', festivalsData);
        }
        // Case 2: response.data가 직접 배열인 경우
        else if (Array.isArray(response.data)) {
          festivalsData = response.data;
          console.log('✅ Found festivals in response.data (array):', festivalsData);
        }
        // Case 3: response가 페이지네이션 객체인 경우
        else if (response.content && Array.isArray(response.content)) {
          festivalsData = response.content;
          console.log('✅ Found festivals in response.content:', festivalsData);
        }
      }
      // Case 4: response가 직접 배열인 경우
      else if (Array.isArray(response)) {
        festivalsData = response;
        console.log('✅ Found festivals in response (array):', festivalsData);
      }
      
      if (festivalsData.length > 0) {
        console.log('🎪 Setting festivals:', festivalsData.length, 'items');
        console.log('📋 First festival sample:', festivalsData[0]);
        setFestivals(festivalsData);
      } else {
        console.warn('⚠️ No festivals found in response:', response);
        setFestivals([]);
      }
      
    } catch (err) {
      setError(err.message || '축제 데이터를 불러오는데 실패했습니다.');
      console.error('❌ Failed to fetch festivals:', err);
      setFestivals([]); // 오류 시 빈 배열 설정
    } finally {
      setLoading(false);
    }
  }, []);

  // 축제 생성
  const createFestival = useCallback(async (festivalData) => {
    console.log('🎯 createFestival 시작:', festivalData);
    setLoading(true);
    setError(null);
    try {
      console.log('📤 API 호출 중...');
      const newFestival = await festivalApi.createFestival(festivalData);
      console.log('✅ 새 축제 생성 완료:', newFestival);
      console.log('🔍 새 축제 데이터 구조 분석:', {
        id: newFestival?.id,
        name: newFestival?.name,
        location: newFestival?.location,
        startDate: newFestival?.startDate,
        endDate: newFestival?.endDate,
        status: newFestival?.status
      });
      
      // 서버에서 최신 데이터 가져오기 (정확성 보장)
      console.log('🔄 서버 데이터 동기화 시작...');
      await fetchFestivals({ size: 100 });
      console.log('✅ 서버 동기화 완료');
      
      console.log('✅ 업데이트 프로세스 시작됨');
      
      return newFestival;
    } catch (err) {
      console.error('❌ 축제 생성 실패:', err);
      setError(err.message || '축제 생성에 실패했습니다.');
      throw err;
    } finally {
      setLoading(false);
      console.log('🏁 createFestival 종료');
    }
  }, [fetchFestivals]);

  // 축제 수정
  const updateFestival = useCallback(async (id, festivalData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedFestival = await festivalApi.updateFestival(id, festivalData);
      setFestivals(prev => {
        const currentFestivals = Array.isArray(prev) ? prev : [];
        return currentFestivals.map(festival => 
          festival.id === id ? updatedFestival : festival
      );
      });
      return updatedFestival;
    } catch (err) {
      setError(err.message || '축제 수정에 실패했습니다.');
      console.error('Failed to update festival:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 축제 삭제
  const deleteFestival = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await festivalApi.deleteFestival(id);
      setFestivals(prev => {
        const currentFestivals = Array.isArray(prev) ? prev : [];
        return currentFestivals.filter(festival => festival.id !== id);
      });
    } catch (err) {
      setError(err.message || '축제 삭제에 실패했습니다.');
      console.error('Failed to delete festival:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 데이터 로드 (모든 데이터 가져오기)
  useEffect(() => {
    fetchFestivals({ size: 100 }); // 페이지 크기를 크게 설정하여 모든 데이터 가져오기
  }, [fetchFestivals]);

  // 축제 상태 변경
  const updateFestivalStatus = useCallback(async (id, status) => {
    setLoading(true);
    setError(null);
    try {
      const updatedFestival = await festivalApi.updateFestivalStatus(id, status);
      setFestivals(prev => 
        prev.map(festival => 
          festival.id === id ? updatedFestival : festival
        )
      );
      return updatedFestival;
    } catch (err) {
      setError(err.message || '축제 상태 변경에 실패했습니다.');
      console.error('Failed to update festival status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 운영 중인 축제 조회
  const fetchRunningFestivals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await festivalApi.getRunningFestivals();
      setFestivals(data);
    } catch (err) {
      setError(err.message || '운영 중인 축제를 불러오는데 실패했습니다.');
      console.error('Failed to fetch running festivals:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 예정된 축제 조회
  const fetchUpcomingFestivals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await festivalApi.getUpcomingFestivals();
      setFestivals(data);
    } catch (err) {
      setError(err.message || '예정된 축제를 불러오는데 실패했습니다.');
      console.error('Failed to fetch upcoming festivals:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    festivals,
    loading,
    error,
    fetchFestivals,
    createFestival,
    updateFestival,
    deleteFestival,
    updateFestivalStatus,
    fetchRunningFestivals,
    fetchUpcomingFestivals,
  };
}

// 단일 Festival 데이터 관리를 위한 커스텀 훅
export function useFestival(id) {
  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFestival = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await festivalApi.getFestivalById(id);
      setFestival(data);
    } catch (err) {
      setError(err.message || '축제 데이터를 불러오는데 실패했습니다.');
      console.error('Failed to fetch festival:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchFestival();
  }, [fetchFestival]);

  return {
    festival,
    loading,
    error,
    refetch: fetchFestival,
  };
}
