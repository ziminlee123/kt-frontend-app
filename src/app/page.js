'use client';

import React, { useState } from 'react';
import { FestivalList } from '../components/FestivalList';
import { FestivalForm } from '../components/FestivalForm';
import { FestivalDetail } from '../components/FestivalDetail';
import { ZoneModal } from '../components/ZoneModal';
import { Avatar, AvatarFallback } from '../components/ui/avatar';

const mockFestivals = [
  {
    id: '1',
    name: '2024 여름 음악 페스티벌',
    location: '서울특별시 한강공원',
    startDate: '2024-07-15',
    endDate: '2024-07-17',
    target: '50,000명',
    description: '국내외 최고의 아티스트들이 함께하는 3일간의 음악 축제입니다.',
    status: 'during',
    zones: [
      { id: '1', name: '메인 스테이지', type: 'main-stage', capacity: 20000, notes: '주요 공연 무대' },
      { id: '2', name: '푸드 플라자', type: 'food-court', capacity: 5000, coordinates: '37.5665, 126.9780' },
    ]
  },
  {
    id: '2',
    name: '예술문화 축제',
    location: '부산광역시 해운대구',
    startDate: '2024-08-20',
    endDate: '2024-08-22',
    target: '25,000명',
    description: '지역 예술과 문화유산을 기념하는 축제입니다.',
    status: 'before',
    zones: []
  },
  {
    id: '3',
    name: '음식 & 와인 체험전',
    location: '인천광역시 송도국제도시',
    startDate: '2024-09-10',
    endDate: '2024-09-12',
    target: '15,000명',
    description: '프리미엄 음식과 와인을 체험할 수 있는 행사입니다.',
    status: 'ended',
    zones: []
  },
  {
    id: '4',
    name: '취소된 겨울 축제',
    location: '대구광역시 달성군',
    startDate: '2024-12-15',
    endDate: '2024-12-17',
    target: '30,000명',
    description: '날씨 악화로 인해 취소된 겨울 축제입니다.',
    status: 'cancelled',
    zones: []
  }
];

export default function HomePage() {
  const [festivals, setFestivals] = useState(mockFestivals);
  const [currentView, setCurrentView] = useState('list');
  const [selectedFestivalId, setSelectedFestivalId] = useState(null);
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [selectedZoneId, setSelectedZoneId] = useState(null);

  const selectedFestival = festivals.find(f => f.id === selectedFestivalId);

  const handleCreateFestival = () => {
    setSelectedFestivalId(null);
    setCurrentView('create');
  };

  const handleViewFestival = (festivalId) => {
    setSelectedFestivalId(festivalId);
    setCurrentView('detail');
  };

  const handleSaveFestival = (festival) => {
    // 새 축제 생성만 처리 (편집 기능 제거)
    const newFestival = {
      ...festival,
      id: Date.now().toString(),
      zones: []
    };
    setFestivals(prev => [...prev, newFestival]);
    setCurrentView('list');
  };

  const handleSaveZone = (zone) => {
    if (!selectedFestivalId) return;
    
    setFestivals(prev => prev.map(festival => {
      if (festival.id === selectedFestivalId) {
        const zones = festival.zones || [];
        if (selectedZoneId) {
          // 기존 구역 편집
          return {
            ...festival,
            zones: zones.map(z => 
              z.id === selectedZoneId 
                ? { ...zone, id: selectedZoneId }
                : z
            )
          };
        } else {
          // 새 구역 생성
          return {
            ...festival,
            zones: [...zones, { ...zone, id: Date.now().toString() }]
          };
        }
      }
      return festival;
    }));
    
    setIsZoneModalOpen(false);
    setSelectedZoneId(null);
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
    switch (currentView) {
      case 'list':
        return (
          <FestivalList
            festivals={festivals}
            onCreateFestival={handleCreateFestival}
            onViewFestival={handleViewFestival}
          />
        );
      case 'create':
        return (
          <FestivalForm
            onSave={handleSaveFestival}
            onCancel={() => setCurrentView('list')}
          />
        );
      case 'detail':
        return selectedFestival ? (
          <FestivalDetail
            festival={selectedFestival}
            onBack={() => setCurrentView('list')}
            onCreateZone={handleCreateZone}
            onEditZone={handleEditZone}
          />
        ) : null;
      default:
        return null;
    }
  };

  const selectedZone = selectedFestival?.zones?.find(z => z.id === selectedZoneId);

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
            
            {/* 계정 정보 */}
            <div className="flex items-center gap-3">
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