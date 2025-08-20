import { useState, useEffect, useCallback } from 'react';
import { festivalApi } from '../lib/api';

// Festival 데이터 관리를 위한 커스텀 훅
export function useFestivals() {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 모든 축제 조회
  const fetchFestivals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await festivalApi.getAllFestivals();
      setFestivals(data);
    } catch (err) {
      setError(err.message || '축제 데이터를 불러오는데 실패했습니다.');
      console.error('Failed to fetch festivals:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 축제 생성
  const createFestival = useCallback(async (festivalData) => {
    setLoading(true);
    setError(null);
    try {
      const newFestival = await festivalApi.createFestival(festivalData);
      setFestivals(prev => [...prev, newFestival]);
      return newFestival;
    } catch (err) {
      setError(err.message || '축제 생성에 실패했습니다.');
      console.error('Failed to create festival:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 축제 수정
  const updateFestival = useCallback(async (id, festivalData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedFestival = await festivalApi.updateFestival(id, festivalData);
      setFestivals(prev => 
        prev.map(festival => 
          festival.id === id ? updatedFestival : festival
        )
      );
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
      setFestivals(prev => prev.filter(festival => festival.id !== id));
    } catch (err) {
      setError(err.message || '축제 삭제에 실패했습니다.');
      console.error('Failed to delete festival:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchFestivals();
  }, [fetchFestivals]);

  return {
    festivals,
    loading,
    error,
    fetchFestivals,
    createFestival,
    updateFestival,
    deleteFestival,
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
