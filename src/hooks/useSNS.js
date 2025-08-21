import { useState, useEffect, useCallback } from 'react';
import { snsApi } from '../lib/api';

// SNS 피드백 데이터 관리를 위한 커스텀 훅
export function useSNSFeedback(festivalId) {
  const [feedback, setFeedback] = useState([]);
  const [sentiment, setSentiment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // SNS 피드백 조회
  const fetchSNSFeedback = useCallback(async () => {
    if (!festivalId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await snsApi.getSNSFeedback(festivalId);
      setFeedback(data);
    } catch (err) {
      setError(err.message || 'SNS 피드백을 불러오는데 실패했습니다.');
      console.error('Failed to fetch SNS feedback:', err);
    } finally {
      setLoading(false);
    }
  }, [festivalId]);

  // 감정 분석 결과 조회
  const fetchSentimentAnalysis = useCallback(async () => {
    if (!festivalId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await snsApi.getSentimentAnalysis(festivalId);
      setSentiment(data);
    } catch (err) {
      setError(err.message || '감정 분석 데이터를 불러오는데 실패했습니다.');
      console.error('Failed to fetch sentiment analysis:', err);
    } finally {
      setLoading(false);
    }
  }, [festivalId]);

  // SNS 피드백 생성
  const createSNSFeedback = useCallback(async (feedbackData) => {
    setLoading(true);
    setError(null);
    try {
      const newFeedback = await snsApi.createSNSFeedback(feedbackData);
      setFeedback(prev => [newFeedback, ...prev]);
      return newFeedback;
    } catch (err) {
      setError(err.message || 'SNS 피드백 생성에 실패했습니다.');
      console.error('Failed to create SNS feedback:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // festivalId가 변경될 때 데이터 로드
  useEffect(() => {
    fetchSNSFeedback();
    fetchSentimentAnalysis();
  }, [fetchSNSFeedback, fetchSentimentAnalysis]);

  return {
    feedback,
    sentiment,
    loading,
    error,
    fetchSNSFeedback,
    fetchSentimentAnalysis,
    createSNSFeedback,
  };
}



