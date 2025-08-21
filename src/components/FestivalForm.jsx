import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Save, X } from 'lucide-react';

export function FestivalForm({ loading, onSave, onCancel, festival = null }) {
  const [formData, setFormData] = useState({
    name: festival?.name || '',
    location: festival?.location || '',
    startDate: festival?.startDate || '',
    endDate: festival?.endDate || '',
    target: festival?.target || '',
    description: festival?.description || '',
    status: festival?.status || 'before',
  });
  
  const [errors, setErrors] = useState({});
  const isEdit = !!festival;

  const validateForm = () => {
    const newErrors = {};
    
    // 필수 필드 검증
    if (!formData.name.trim()) {
      newErrors.name = '축제명을 입력해주세요.';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = '장소를 입력해주세요.';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = '시작일을 선택해주세요.';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = '종료일을 선택해주세요.';
    }
    
    // 날짜 순서 검증
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      if (startDate > endDate) {
        newErrors.endDate = '종료일은 시작일보다 이후여야 합니다.';
      }
    }
    
    if (!formData.target.trim()) {
      newErrors.target = '목표 관객을 입력해주세요.';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = '축제 설명을 입력해주세요.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
    onSave(formData, festival?.id);
    } catch (error) {
      console.error('축제 저장 오류:', error);
      setErrors({ submit: '축제 저장 중 오류가 발생했습니다.' });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 해당 필드 에러 제거
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onCancel} className="gap-1">
            <ArrowLeft className="w-4 h-4" />
            뒤로
          </Button>
          <CardTitle>{isEdit ? '축제 정보 수정' : '새 축제 등록'}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">축제명</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="축제명을 입력하세요"
                className={errors.name ? 'border-red-500' : ''}
                required
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">장소</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="개최 장소를 입력하세요"
                className={errors.location ? 'border-red-500' : ''}
                required
              />
              {errors.location && (
                <p className="text-sm text-red-600">{errors.location}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">시작일</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className={errors.startDate ? 'border-red-500' : ''}
                required
              />
              {errors.startDate && (
                <p className="text-sm text-red-600">{errors.startDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">종료일</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className={errors.endDate ? 'border-red-500' : ''}
                required
              />
              {errors.endDate && (
                <p className="text-sm text-red-600">{errors.endDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="target">목표 관객</Label>
              <Input
                id="target"
                value={formData.target}
                onChange={(e) => handleChange('target', e.target.value)}
                placeholder="예: 50,000명"
                className={errors.target ? 'border-red-500' : ''}
                required
              />
              {errors.target && (
                <p className="text-sm text-red-600">{errors.target}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">상태</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="before">운영전</SelectItem>
                  <SelectItem value="during">운영 중</SelectItem>
                  <SelectItem value="ended">운영 종료</SelectItem>
                  <SelectItem value="cancelled">운영 불발</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">축제 설명</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="축제 설명을 입력하세요"
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
              required
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isEdit ? '수정 중...' : '등록 중...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEdit ? '축제 수정' : '축제 등록'}
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="gap-2">
              <X className="w-4 h-4" />
              취소
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
