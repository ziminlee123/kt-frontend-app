import { useState, useEffect, useCallback } from 'react';
import { dashboardApi } from '../lib/api';

// 운영 대시보드 데이터 관리를 위한 커스텀 훅
export function useDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 운영 대시보드 데이터 조회
  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardApi.getOperationalDashboard();
      setDashboard(data);
    } catch (err) {
      setError(err.message || '대시보드 데이터를 불러오는데 실패했습니다.');
      console.error('Failed to fetch dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    dashboard,
    loading,
    error,
    refetch: fetchDashboard,
  };
}

// 특정 축제 대시보드 데이터 관리를 위한 커스텀 훅
export function useFestivalDashboard(festivalId) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    if (!festivalId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardApi.getFestivalDashboard(festivalId);
      setDashboard(data);
    } catch (err) {
      setError(err.message || '축제 대시보드 데이터를 불러오는데 실패했습니다.');
      console.error('Failed to fetch festival dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, [festivalId]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    dashboard,
    loading,
    error,
    refetch: fetchDashboard,
  };
}



