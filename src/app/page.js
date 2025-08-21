'use client';

import React, { useState, useEffect } from 'react';
import { FestivalList } from '../components/FestivalList';
import { FestivalForm } from '../components/FestivalForm';
import { FestivalDetail } from '../components/FestivalDetail';
import { ZoneModal } from '../components/ZoneModal';
import TestConnection from '../components/TestConnection';
import SimpleTest from '../components/SimpleTest';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { useFestivals } from '../hooks/useFestivals';
import { useZones } from '../hooks/useZones';

export default function HomePage() {
  const { 
    festivals, 
    loading: festivalsLoading, 
    error: festivalsError, 
    createFestival, 
    updateFestival, 
    deleteFestival,
    fetchFestivals 
  } = useFestivals();
  
  const [currentView, setCurrentView] = useState('list');
  const [selectedFestivalId, setSelectedFestivalId] = useState(null);
  const [editingFestival, setEditingFestival] = useState(null);
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const [showConnectionTest, setShowConnectionTest] = useState(false);

  // 선택된 축제에 대한 zone 관리
  const { 
    zones, 
    loading: zonesLoading, 
    error: zonesError, 
    createZone, 
    updateZone, 
    deleteZone,
    fetchZones 
  } = useZones(selectedFestivalId);

  const selectedFestival = festivals.find(f => f.id === selectedFestivalId);

  // 선택된 축제가 변경될 때 zones 다시 불러오기
  useEffect(() => {
    if (selectedFestivalId) {
      fetchZones();
    }
  }, [selectedFestivalId, fetchZones]);

  const handleCreateFestival = () => {
    setSelectedFestivalId(null);
    setEditingFestival(null);
    setCurrentView('create');
  };

  const handleViewFestival = (festivalId) => {
    setSelectedFestivalId(festivalId);
    setCurrentView('detail');
  };

  const handleSaveFestival = async (festivalData, festivalId = null) => {
    try {
      if (festivalId) {
        // 수정
        await updateFestival(festivalId, festivalData);
      } else {
        // 새로 생성
        await createFestival(festivalData);
      }
      setCurrentView('list');
      setEditingFestival(null);
    } catch (error) {
      console.error('Failed to save festival:', error);
      // 에러 처리는 hook에서 처리됨
    }
  };

  const handleEditFestival = (festival) => {
    setEditingFestival(festival);
    setCurrentView('edit');
  };

  const handleDeleteFestival = async (festivalId, festivalName) => {
    if (window.confirm(`정말로 "${festivalName}" 축제를 삭제하시겠습니까?`)) {
      try {
        await deleteFestival(festivalId);
        // 성공 메시지는 hook에서 처리됨
      } catch (error) {
        console.error('Failed to delete festival:', error);
        // 에러 처리는 hook에서 처리됨
      }
    }
  };

  const handleSaveZone = async (zoneData) => {
    if (!selectedFestivalId) return;
    
    try {
        if (selectedZoneId) {
          // 기존 구역 편집
        await updateZone(selectedZoneId, zoneData);
        } else {
          // 새 구역 생성
        await createZone(zoneData);
      }
    
    setIsZoneModalOpen(false);
    setSelectedZoneId(null);
    } catch (error) {
      console.error('Failed to save zone:', error);
      // 에러 처리는 hook에서 처리됨
    }
  };

  const handleCreateZone = () => {
    setSelectedZoneId(null);
    setIsZoneModalOpen(true);
  };

  const handleEditZone = (zoneId) => {
    setSelectedZoneId(zoneId);
    setIsZoneModalOpen(true);
  };

  const renderCurrentView = () => {
    if (showConnectionTest) {
      return (
        <div className="space-y-6">
          <SimpleTest />
          <TestConnection />
        </div>
      );
    }

    switch (currentView) {
      case 'list':
        return (
          <FestivalList
            festivals={festivals}
            loading={festivalsLoading}
            error={festivalsError}
            onCreateFestival={handleCreateFestival}
            onViewFestival={handleViewFestival}
            onEditFestival={handleEditFestival}
            onDeleteFestival={handleDeleteFestival}
            onRefresh={() => fetchFestivals({ size: 100 })}
          />
        );
      case 'create':
      case 'edit':
        return (
          <FestivalForm
            loading={festivalsLoading}
            onSave={handleSaveFestival}
            onCancel={() => {
              setCurrentView('list');
              setEditingFestival(null);
            }}
            festival={editingFestival}
          />
        );
      case 'detail':
        return selectedFestival ? (
          <FestivalDetail
            festival={{...selectedFestival, zones: zones || []}}
            loading={zonesLoading}
            error={zonesError}
            onBack={() => setCurrentView('list')}
            onCreateZone={handleCreateZone}
            onEditZone={handleEditZone}
          />
        ) : null;
      default:
        return null;
    }
  };

  const selectedZone = Array.isArray(zones) ? zones.find(z => z.id === selectedZoneId) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* KT 헤더 */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">KT</span>
              </div>
              <h1 className="text-xl text-foreground">축제 관리 시스템</h1>
            </div>
            
            {/* 네비게이션 및 계정 정보 */}
            <div className="flex items-center gap-4">
              <Button 
                variant={showConnectionTest ? "default" : "outline"}
                size="sm"
                onClick={() => setShowConnectionTest(!showConnectionTest)}
              >
                {showConnectionTest ? '축제 관리로 돌아가기' : 'API 연결 테스트'}
              </Button>
              
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  김천
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">김천시</p>
                <p className="text-muted-foreground text-xs">관리자</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {renderCurrentView()}
        
        <ZoneModal
          isOpen={isZoneModalOpen}
          zone={selectedZone}
          onSave={handleSaveZone}
          onCancel={() => {
            setIsZoneModalOpen(false);
            setSelectedZoneId(null);
          }}
        />
      </div>
    </div>
  );
}