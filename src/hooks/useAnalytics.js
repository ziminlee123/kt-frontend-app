import { useState, useEffect, useCallback } from 'react';
import { analyticsApi } from '../lib/api';

// Analytics 데이터 관리를 위한 커스텀 훅
export function useAnalytics(festivalId) {
  const [congestionData, setCongestionData] = useState([]);
  const [snsData, setSnsData] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 실시간 혼잡도 데이터 조회
  const fetchCongestionData = useCallback(async () => {
    if (!festivalId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await analyticsApi.getCongestionData(festivalId);
      setCongestionData(data);
    } catch (err) {
      setError(err.message || '혼잡도 데이터를 불러오는데 실패했습니다.');
      console.error('Failed to fetch congestion data:', err);
    } finally {
      setLoading(false);
    }
  }, [festivalId]);

  // SNS 반응 데이터 조회
  const fetchSNSData = useCallback(async () => {
    if (!festivalId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await analyticsApi.getSNSFeedback(festivalId);
      setSnsData(data);
    } catch (err) {
      setError(err.message || 'SNS 데이터를 불러오는데 실패했습니다.');
      console.error('Failed to fetch SNS data:', err);
    } finally {
      setLoading(false);
    }
  }, [festivalId]);

  // 축제 결과 리포트 조회
  const fetchReportData = useCallback(async () => {
    if (!festivalId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await analyticsApi.getFestivalReport(festivalId);
      setReportData(data);
    } catch (err) {
      setError(err.message || '리포트 데이터를 불러오는데 실패했습니다.');
      console.error('Failed to fetch report data:', err);
    } finally {
      setLoading(false);
    }
  }, [festivalId]);

  // AI 기획 추천 가져오기
  const getPlanningRecommendations = useCallback(async (festivalData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyticsApi.getPlanningRecommendations(festivalData);
      return data;
    } catch (err) {
      setError(err.message || '기획 추천을 불러오는데 실패했습니다.');
      console.error('Failed to fetch planning recommendations:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 실시간 데이터 자동 새로고침 (30초마다)
  useEffect(() => {
    if (!festivalId) return;

    fetchCongestionData();
    fetchSNSData();

    const interval = setInterval(() => {
      fetchCongestionData();
      fetchSNSData();
    }, 30000); // 30초마다 새로고침

    return () => clearInterval(interval);
  }, [festivalId, fetchCongestionData, fetchSNSData]);

  // 리포트 데이터는 필요할 때만 로드
  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  return {
    congestionData,
    snsData,
    reportData,
    loading,
    error,
    fetchCongestionData,
    fetchSNSData,
    fetchReportData,
    getPlanningRecommendations,
  };
}
