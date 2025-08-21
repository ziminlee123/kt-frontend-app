import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';

const statusColors = {
  before: 'bg-blue-100 text-blue-800',
  during: 'bg-green-100 text-green-800',
  ended: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels = {
  before: '운영전',
  during: '운영 중',
  ended: '운영 종료',
  cancelled: '운영 불발',
};

export function FestivalList({
  festivals = [],
  loading = false,
  error = null,
  onCreateFestival,
  onViewFestival,
  onEditFestival,
  onDeleteFestival,
  onRefresh, // 새로고침 함수 추가
}) {
  // 디버깅을 위한 로그
  console.log('FestivalList received festivals:', festivals);
  console.log('Number of festivals:', festivals?.length);

  const formatPeriod = (startDate, endDate) => {
    try {
      if (!startDate || !endDate) return '날짜 정보 없음';
      
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      
      // 유효한 날짜인지 확인
      if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
        return '잘못된 날짜 형식';
      }
      
      const start = startDateObj.toLocaleDateString('ko-KR', { 
        month: 'short', 
        day: 'numeric' 
      });
      const end = endDateObj.toLocaleDateString('ko-KR', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      return `${start} - ${end}`;
    } catch (error) {
      console.error('날짜 포맷 오류:', error);
      return '날짜 처리 오류';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>축제 관리</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={onRefresh || (() => window.location.reload())}
              className="gap-2"
              disabled={loading}
            >
              🔄 새로고침
            </Button>
            <Button onClick={onCreateFestival} className="gap-2">
              <Plus className="w-4 h-4" />
              새 축제 추가
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">축제 목록을 불러오는 중...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-8">
            <div className="text-red-600 mb-2">⚠️ 오류 발생</div>
            <p className="text-muted-foreground">{error}</p>
          </div>
        )}
        
        {!loading && !error && (
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead>축제명</TableHead>
              <TableHead>장소</TableHead>
              <TableHead>기간</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="w-32">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {festivals.map((festival, index) => (
              <TableRow key={festival.id || `festival-${index}`}>
                <TableCell className="font-medium">
                  {festival.name || '축제명 없음'}
                </TableCell>
                <TableCell>{festival.location || '장소 정보 없음'}</TableCell>
                <TableCell>
                  {formatPeriod(festival.startDate, festival.endDate)}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary"
                    className={statusColors[festival.status] || statusColors.before}
                  >
                    {statusLabels[festival.status] || statusLabels.before}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewFestival(festival.id)}
                      className="gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      보기
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditFestival(festival)}
                      className="gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      수정
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteFestival(festival.id, festival.name)}
                      className="gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                      삭제
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
        
        {!loading && !error && festivals.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            축제가 없습니다. 첫 번째 축제를 생성해 보세요.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
