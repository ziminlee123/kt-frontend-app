import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Save, X } from 'lucide-react';

const zoneTypes = [
  { value: 'main-stage', label: '메인 스테이지' },
  { value: 'food-court', label: '푸드코트' },
  { value: 'merchandise', label: '굿즈샵' },
  { value: 'vip', label: 'VIP 구역' },
  { value: 'parking', label: '주차장' },
];

export function ZoneModal({ isOpen, zone, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'main-stage',
    capacity: '',
    coordinates: '',
    notes: '',
  });

  useEffect(() => {
    if (zone) {
      setFormData({
        name: zone.name,
        type: zone.type,
        capacity: zone.capacity.toString(),
        coordinates: zone.coordinates || '',
        notes: zone.notes || '',
      });
    } else {
      setFormData({
        name: '',
        type: 'main-stage',
        capacity: '',
        coordinates: '',
        notes: '',
      });
    }
  }, [zone, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const capacity = parseInt(formData.capacity, 10);
    if (isNaN(capacity) || capacity <= 0) {
      alert('올바른 수용인원을 입력해주세요');
      return;
    }

    onSave({
      name: formData.name,
      type: formData.type,
      capacity,
      coordinates: formData.coordinates || undefined,
      notes: formData.notes || undefined,
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isEdit = !!zone;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? '구역 편집' : '새 구역 생성'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? '기존 구역 정보를 수정합니다.' : '축제에 새로운 구역을 추가합니다.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="zoneName">구역명</Label>
            <Input
              id="zoneName"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="구역명을 입력하세요"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zoneType">구역 유형</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="구역 유형 선택" />
              </SelectTrigger>
              <SelectContent>
                {zoneTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">수용인원</Label>
            <Input
              id="capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => handleChange('capacity', e.target.value)}
              placeholder="수용인원을 입력하세요"
              min="1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coordinates">좌표 (선택사항)</Label>
            <Input
              id="coordinates"
              value={formData.coordinates}
              onChange={(e) => handleChange('coordinates', e.target.value)}
              placeholder="예: 37.5665, 126.9780"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">비고</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="추가 정보를 입력하세요"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="gap-2">
              <Save className="w-4 h-4" />
              구역 저장
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="gap-2">
              <X className="w-4 h-4" />
              취소
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
