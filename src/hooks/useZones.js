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
      const data = await zoneApi.getZonesByFestivalId(festivalId);
      setZones(data);
    } catch (err) {
      setError(err.message || '구역 데이터를 불러오는데 실패했습니다.');
      console.error('Failed to fetch zones:', err);
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
      setZones(prev => [...prev, newZone]);
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
      setZones(prev => 
        prev.map(zone => 
          zone.id === zoneId ? updatedZone : zone
        )
      );
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
      setZones(prev => prev.filter(zone => zone.id !== zoneId));
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
