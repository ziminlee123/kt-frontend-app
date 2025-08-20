import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Progress } from './ui/progress';
import { 
  ArrowLeft, 
  Plus, 
  MapPin, 
  Calendar, 
  Users, 
  FileText, 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target, 
  Lightbulb, 
  Activity,
  MessageSquare,
  AlertTriangle,
  Eye,
  Zap
} from 'lucide-react';

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

const zoneTypeLabels = {
  'main-stage': '메인 스테이지',
  'food-court': '푸드코트',
  'merchandise': '굿즈샵',
  'vip': 'VIP 구역',
  'parking': '주차장',
};

export function FestivalDetail({
  festival,
  onBack,
  onCreateZone,
  onEditZone,
}) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPeriod = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays}일`;
  };

  // 결과리포트용 더미 데이터
  const generateReportData = () => {
    const targetNumber = parseInt(festival.target.replace(/[^0-9]/g, ''));
    const actualAttendees = Math.floor(targetNumber * (0.8 + Math.random() * 0.4));
    const satisfaction = Math.floor(85 + Math.random() * 10);
    const revenue = Math.floor(actualAttendees * (15000 + Math.random() * 5000));

    return {
      actualAttendees,
      satisfaction,
      revenue,
      completionRate: Math.floor((actualAttendees / targetNumber) * 100)
    };
  };

  // 혼잡도 더미 데이터 생성
  const generateCrowdData = () => {
    return festival.zones?.map(zone => ({
      ...zone,
      currentCapacity: Math.floor(zone.capacity * (0.3 + Math.random() * 0.6)),
      congestionLevel: Math.floor(30 + Math.random() * 70)
    })) || [];
  };

  // SNS 반응 더미 데이터
  const generateSNSFeedback = () => {
    const feedbacks = [
      { issue: '메인 스테이지 대기줄', mentions: 127, sentiment: 'negative' },
      { issue: '푸드코트 화장실 청결도', mentions: 89, sentiment: 'negative' },
      { issue: 'VIP 구역 음향 품질', mentions: 76, sentiment: 'negative' },
      { issue: '주차장 안내 부족', mentions: 64, sentiment: 'negative' },
      { issue: '굿즈샵 품절', mentions: 52, sentiment: 'negative' }
    ];
    return feedbacks.slice(0, 3);
  };

  const reportData = festival.status === 'ended' ? generateReportData() : null;
  const crowdData = festival.status === 'during' ? generateCrowdData() : [];
  const snsFeedback = festival.status === 'during' ? generateSNSFeedback() : [];

  const handlePlanFestival = () => {
    console.log('축제 기획하기 클릭');
  };

  const getCongestionColor = (level) => {
    if (level >= 80) return 'text-red-600 bg-red-100';
    if (level >= 60) return 'text-orange-600 bg-orange-100';
    if (level >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getCongestionLabel = (level) => {
    if (level >= 80) return '매우 혼잡';
    if (level >= 60) return '혼잡';
    if (level >= 40) return '보통';
    return '여유';
  };

  return (
    <div className="space-y-6">
      {/* 목록으로 버튼 - 카드 위에 위치 */}
      <div className="flex items-center">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
          <ArrowLeft className="w-4 h-4" />
          목록으로
        </Button>
      </div>

      {/* 헤더 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{festival.name}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge 
                  variant="secondary"
                  className={statusColors[festival.status]}
                >
                  {statusLabels[festival.status]}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 탭 */}
      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="info">기본 정보</TabsTrigger>
          <TabsTrigger value="planning">기획 지원</TabsTrigger>
          <TabsTrigger value="operation">운영 지원</TabsTrigger>
          <TabsTrigger value="report">결과 리포트</TabsTrigger>
        </TabsList>

        {/* 기본 정보 탭 (기존 정보 + 구역) */}
        <TabsContent value="info" className="space-y-6">
          {/* 축제 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>축제 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">장소</p>
                      <p>{festival.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">목표 관객</p>
                      <p>{festival.target}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">행사 기간</p>
                      <p>{formatDate(festival.startDate)}</p>
                      <p className="text-sm text-muted-foreground">~</p>
                      <p>{formatDate(festival.endDate)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        ({formatPeriod(festival.startDate, festival.endDate)})
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">설명</p>
                  <p className="mt-1">{festival.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 축제 구역 */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>축제 구역</CardTitle>
                <Button onClick={onCreateZone} className="gap-2">
                  <Plus className="w-4 h-4" />
                  구역 추가
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {festival.zones && festival.zones.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>구역명</TableHead>
                      <TableHead>유형</TableHead>
                      <TableHead>수용인원</TableHead>
                      <TableHead>비고</TableHead>
                      <TableHead className="w-24">작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {festival.zones.map((zone) => (
                      <TableRow key={zone.id}>
                        <TableCell className="font-medium">{zone.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {zoneTypeLabels[zone.type]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {zone.capacity.toLocaleString()}명
                        </TableCell>
                        <TableCell>
                          {zone.notes || '-'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEditZone(zone.id)}
                          >
                            편집
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  아직 구역이 설정되지 않았습니다. 첫 번째 구역을 추가해보세요.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 기획 지원 탭 */}
        <TabsContent value="planning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI 기반 축제 기획 도구</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-6 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Lightbulb className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">축제 기획 최적화</h3>
                      <p className="text-muted-foreground">AI가 분석한 최적의 프로그램 구성과 배치를 제안합니다</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">프로그램 추천</span>
                      </div>
                      <p className="text-xs text-blue-700">관객 성향 분석 기반 최적 프로그램 제안</p>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-900">배치 최적화</span>
                      </div>
                      <p className="text-xs text-green-700">동선 분석을 통한 구역별 최적 배치</p>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium text-purple-900">수익 예측</span>
                      </div>
                      <p className="text-xs text-purple-700">과거 데이터 기반 수익성 예측 모델</p>
                    </div>
                  </div>

                  <Button 
                    onClick={handlePlanFestival} 
                    className="w-full gap-2"
                    size="lg"
                  >
                    <Lightbulb className="w-5 h-5" />
                    기획 도구 시작하기
                  </Button>
                </div>

                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-900">스마트 기획 프로세스</h4>
                      <p className="text-sm text-amber-700 mt-1">
                        1단계: 목표 관객 분석 → 2단계: 프로그램 추천 → 3단계: 배치 최적화 → 4단계: 수익성 검토
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 운영 지원 탭 */}
        <TabsContent value="operation" className="space-y-6">
          {festival.status === 'during' ? (
            <>
              {/* 구역별 혼잡도 */}
              <Card>
                <CardHeader>
                  <CardTitle>실시간 구역별 혼잡도</CardTitle>
                </CardHeader>
                <CardContent>
                  {crowdData.length > 0 ? (
                    <div className="space-y-4">
                      {crowdData.map((zone) => (
                        <div key={zone.id} className="p-4 border border-border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <h4 className="font-medium">{zone.name}</h4>
                              <Badge variant="outline">
                                {zoneTypeLabels[zone.type]}
                              </Badge>
                            </div>
                            <Badge className={getCongestionColor(zone.congestionLevel)}>
                              {getCongestionLabel(zone.congestionLevel)}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>현재 인원: {zone.currentCapacity?.toLocaleString()}명</span>
                              <span>수용 가능: {zone.capacity.toLocaleString()}명</span>
                            </div>
                            <Progress 
                              value={(zone.currentCapacity / zone.capacity) * 100} 
                              className="h-2"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>혼잡도</span>
                              <span>{zone.congestionLevel}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      구역이 설정되지 않았습니다.
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* SNS 실시간 반응 */}
              <Card>
                <CardHeader>
                  <CardTitle>SNS 실시간 반응 모니터링</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      <span className="font-medium">개선 필요 지점 TOP 3</span>
                    </div>
                    
                    {snsFeedback.map((feedback, index) => (
                      <div key={index} className="p-4 border border-red-200 bg-red-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-red-100 rounded-lg">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-red-900">
                                {index + 1}. {feedback.issue}
                              </h4>
                              <Badge variant="destructive" className="text-xs">
                                {feedback.mentions}회 언급
                              </Badge>
                            </div>
                            <p className="text-sm text-red-700">
                              실시간 SNS에서 해당 이슈에 대한 불만이 지속적으로 제기되고 있습니다.
                              즉시 대응이 필요합니다.
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Eye className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-900">모니터링 현황</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-medium text-blue-900">전체 언급</p>
                          <p className="text-blue-700">1,247건</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-blue-900">긍정적 반응</p>
                          <p className="text-blue-700">78%</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-blue-900">개선 요청</p>
                          <p className="text-blue-700">22%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                <p className="text-muted-foreground">축제가 운영 중일 때 실시간 운영 데이터를 확인할 수 있습니다.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  현재 상태: {statusLabels[festival.status]}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 결과 리포트 탭 */}
        <TabsContent value="report" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>축제 결과 리포트</CardTitle>
            </CardHeader>
            <CardContent>
              {festival.status === 'ended' && reportData ? (
                <div className="space-y-6">
                  {/* 주요 지표 */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-primary" />
                        <span className="text-sm text-muted-foreground">실제 참석자</span>
                      </div>
                      <p className="text-2xl font-semibold">{reportData.actualAttendees.toLocaleString()}명</p>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-primary" />
                        <span className="text-sm text-muted-foreground">목표 달성률</span>
                      </div>
                      <p className="text-2xl font-semibold">{reportData.completionRate}%</p>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <span className="text-sm text-muted-foreground">만족도</span>
                      </div>
                      <p className="text-2xl font-semibold">{reportData.satisfaction}%</p>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        <span className="text-sm text-muted-foreground">총 수익</span>
                      </div>
                      <p className="text-2xl font-semibold">{(reportData.revenue / 100000000).toFixed(1)}억원</p>
                    </div>
                  </div>

                  {/* 상세 분석 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">상세 분석</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-medium">참석자 현황</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>목표 참석자:</span>
                            <span>{festival.target}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>실제 참석자:</span>
                            <span>{reportData.actualAttendees.toLocaleString()}명</span>
                          </div>
                          <div className="flex justify-between">
                            <span>달성률:</span>
                            <span className={reportData.completionRate >= 100 ? 'text-green-600' : 'text-orange-600'}>
                              {reportData.completionRate}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">운영 성과</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>평균 만족도:</span>
                            <span className="text-green-600">{reportData.satisfaction}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>총 수익:</span>
                            <span>{(reportData.revenue / 100000000).toFixed(1)}억원</span>
                          </div>
                          <div className="flex justify-between">
                            <span>구역 활용률:</span>
                            <span>92%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">종합 평가</h4>
                      <p className="text-sm text-green-700">
                        {reportData.completionRate >= 100 
                          ? "목표를 성공적으로 달성한 성공적인 축제였습니다. 높은 만족도와 함께 예상 수익을 넘어선 실적을 기록했습니다."
                          : "전체적으로 양호한 성과를 보인 축제였습니다. 일부 개선점을 보완하여 다음 축제에서 더 나은 결과를 기대할 수 있습니다."
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>축제가 운영 종료된 후 결과 리포트를 확인할 수 있습니다.</p>
                  {festival.status !== 'ended' && (
                    <p className="text-sm mt-2">현재 상태: {statusLabels[festival.status]}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
