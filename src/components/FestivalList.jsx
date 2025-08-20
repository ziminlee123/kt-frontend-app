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
import { Plus, Eye } from 'lucide-react';

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
  festivals,
  onCreateFestival,
  onViewFestival,
}) {
  const formatPeriod = (startDate, endDate) => {
    const start = new Date(startDate).toLocaleDateString('ko-KR', { 
      month: 'short', 
      day: 'numeric' 
    });
    const end = new Date(endDate).toLocaleDateString('ko-KR', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    return `${start} - ${end}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>축제 관리</CardTitle>
          <Button onClick={onCreateFestival} className="gap-2">
            <Plus className="w-4 h-4" />
            새 축제 추가
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>축제명</TableHead>
              <TableHead>장소</TableHead>
              <TableHead>기간</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="w-24">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {festivals.map((festival) => (
              <TableRow key={festival.id}>
                <TableCell className="font-medium">{festival.name}</TableCell>
                <TableCell>{festival.location}</TableCell>
                <TableCell>
                  {formatPeriod(festival.startDate, festival.endDate)}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary"
                    className={statusColors[festival.status]}
                  >
                    {statusLabels[festival.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewFestival(festival.id)}
                    className="gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    보기
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {festivals.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            축제가 없습니다. 첫 번째 축제를 생성해 보세요.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
