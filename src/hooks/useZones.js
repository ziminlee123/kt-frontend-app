import { useState, useEffect, useCallback } from 'react';
import { zoneApi } from '../lib/api';

// Zone 데이터 관리를 위한 커스텀 훅
export function useZones(festivalId) {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 축제의 모든 구역 조회
  const fetchZones = useCallback(async () => {
    if (!festivalId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await zoneApi.getZonesByFestivalId(festivalId);
      console.log('🏗️ Zone API 응답:', response);
      
      let zonesData = [];
      
      // API 응답 구조 분석 (Festival API와 동일한 로직)
      if (response && response.data) {
        console.log('📦 Zone Response data:', response.data);
        
        // Case 1: response.data가 배열인 경우
        if (Array.isArray(response.data)) {
          zonesData = response.data;
          console.log('✅ Found zones in response.data (array):', zonesData);
        }
        // Case 2: response.data가 페이지네이션 객체인 경우
        else if (response.data.content && Array.isArray(response.data.content)) {
          zonesData = response.data.content;
          console.log('✅ Found zones in response.data.content:', zonesData);
        }
      }
      // Case 3: response가 직접 배열인 경우
      else if (Array.isArray(response)) {
        zonesData = response;
        console.log('✅ Found zones in response (array):', zonesData);
      }
      
      if (zonesData.length >= 0) {
        setZones(zonesData);
        console.log('🎪 Zones 설정 완료:', zonesData.length, '개');
        console.log('📋 첫 번째 zone 샘플:', zonesData[0]);
      } else {
        console.warn('⚠️ No zones found in response:', response);
        setZones([]);
      }
    } catch (err) {
      setError(err.message || '구역 데이터를 불러오는데 실패했습니다.');
      console.error('❌ Failed to fetch zones:', err);
      setZones([]); // 에러 시 빈 배열로 설정
    } finally {
      setLoading(false);
    }
  }, [festivalId]);

  // 구역 생성
  const createZone = useCallback(async (zoneData) => {
    if (!festivalId) return;
    
    setLoading(true);
    setError(null);
    try {
      const newZone = await zoneApi.createZone(festivalId, zoneData);
      console.log('🎯 새 구역 생성 응답:', newZone);
      console.log('🔍 새 구역 ID 확인:', {
        id: newZone?.id,
        name: newZone?.name,
        type: newZone?.type,
        capacity: newZone?.capacity
      });
      
      // 즉시 업데이트 대신 서버에서 최신 데이터 가져오기
      console.log('🔄 서버에서 최신 구역 데이터 동기화...');
      await fetchZones();
      console.log('✅ 구역 데이터 동기화 완료');
      
      return newZone;
    } catch (err) {
      setError(err.message || '구역 생성에 실패했습니다.');
      console.error('Failed to create zone:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [festivalId]);

  // 구역 수정
  const updateZone = useCallback(async (zoneId, zoneData) => {
    if (!festivalId) return;
    
    setLoading(true);
    setError(null);
    try {
      const updatedZone = await zoneApi.updateZone(festivalId, zoneId, zoneData);
      setZones(prev => {
        const currentZones = Array.isArray(prev) ? prev : [];
        return currentZones.map(zone => 
          zone.id === zoneId ? updatedZone : zone
        );
      });
      return updatedZone;
    } catch (err) {
      setError(err.message || '구역 수정에 실패했습니다.');
      console.error('Failed to update zone:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [festivalId]);

  // 구역 삭제
  const deleteZone = useCallback(async (zoneId) => {
    if (!festivalId) return;
    
    setLoading(true);
    setError(null);
    try {
      await zoneApi.deleteZone(festivalId, zoneId);
      setZones(prev => {
        const currentZones = Array.isArray(prev) ? prev : [];
        return currentZones.filter(zone => zone.id !== zoneId);
      });
    } catch (err) {
      setError(err.message || '구역 삭제에 실패했습니다.');
      console.error('Failed to delete zone:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [festivalId]);

  // festivalId가 변경될 때 데이터 로드
  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  return {
    zones,
    loading,
    error,
    fetchZones,
    createZone,
    updateZone,
    deleteZone,
  };
}
