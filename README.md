# 축제 관리 시스템 (Festival Management System)

KT 기반 축제 관리 웹 애플리케이션입니다. Next.js와 REST API를 연동하여 축제의 기획, 운영, 결과 분석까지 전체 라이프사이클을 관리할 수 있습니다.

## 🚀 주요 기능

### 1. 축제 관리
- 축제 생성, 수정, 삭제
- 축제 기본 정보 관리 (이름, 장소, 기간, 목표 관객 등)
- 축제 상태 관리 (운영전, 운영 중, 운영 종료, 운영 불발)

### 2. 구역 관리
- 축제 구역 생성 및 편집
- 구역 유형 관리 (메인 스테이지, 푸드코트, 굿즈샵, VIP, 주차장)
- 구역별 수용인원 관리

### 3. AI 기반 기획 지원
- 프로그램 추천
- 배치 최적화
- 수익 예측

### 4. 실시간 운영 지원
- 구역별 실시간 혼잡도 모니터링
- SNS 실시간 반응 분석
- 개선 필요 지점 알림

### 5. 결과 리포트
- 참석자 현황 분석
- 목표 달성률 평가
- 만족도 및 수익 분석
- 종합 평가 제공

## 🛠 기술 스택

### Frontend
- **Next.js 15.4.7** - React 프레임워크
- **React 19.1.0** - UI 라이브러리
- **Tailwind CSS 4** - 스타일링
- **Radix UI** - 고품질 UI 컴포넌트
- **Lucide React** - 아이콘
- **Axios** - HTTP 클라이언트

### Backend API 연동
- REST API 통신
- 실시간 데이터 연동
- 에러 처리 및 로딩 상태 관리

## 🏗 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # 글로벌 스타일
│   ├── layout.js          # 레이아웃 컴포넌트
│   └── page.js            # 메인 페이지
├── components/            # React 컴포넌트
│   ├── ui/               # 재사용 가능한 UI 컴포넌트
│   ├── FestivalList.jsx  # 축제 목록
│   ├── FestivalForm.jsx  # 축제 생성/편집 폼
│   ├── FestivalDetail.jsx # 축제 상세 페이지
│   └── ZoneModal.jsx     # 구역 생성/편집 모달
├── hooks/                # 커스텀 훅
│   ├── useFestivals.js   # 축제 데이터 관리
│   ├── useZones.js       # 구역 데이터 관리
│   └── useAnalytics.js   # 분석 데이터 관리
└── lib/                  # 유틸리티
    ├── api.js           # API 클라이언트
    └── utils.js         # 공통 유틸리티
```

## 🚀 시작하기

### 1. 프로젝트 클론 및 설치

```bash
git clone <repository-url>
cd frontend-app-figma_v2
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
NODE_ENV=development
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인하세요.

### 4. 백엔드 서버 연동

백엔드 API 서버가 `http://localhost:8080`에서 실행되고 있어야 합니다.
백엔드 프로젝트 설정은 `project-settings.md` 파일을 참조하세요.

## 📋 API 엔드포인트

### 축제 관리
- `GET /api/festivals` - 모든 축제 조회
- `GET /api/festivals/{id}` - 특정 축제 조회
- `POST /api/festivals` - 축제 생성
- `PUT /api/festivals/{id}` - 축제 수정
- `DELETE /api/festivals/{id}` - 축제 삭제

### 구역 관리
- `GET /api/festivals/{festivalId}/zones` - 축제의 모든 구역 조회
- `GET /api/festivals/{festivalId}/zones/{zoneId}` - 특정 구역 조회
- `POST /api/festivals/{festivalId}/zones` - 구역 생성
- `PUT /api/festivals/{festivalId}/zones/{zoneId}` - 구역 수정
- `DELETE /api/festivals/{festivalId}/zones/{zoneId}` - 구역 삭제

### 분석 데이터
- `GET /api/festivals/{id}/analytics/congestion` - 실시간 혼잡도
- `GET /api/festivals/{id}/analytics/sns-feedback` - SNS 반응
- `GET /api/festivals/{id}/analytics/report` - 축제 리포트
- `POST /api/analytics/planning-recommendations` - AI 기획 추천

## 🎨 UI/UX 특징

- **반응형 디자인**: 데스크톱과 모바일 모두 지원
- **KT 브랜딩**: KT 디자인 시스템 적용
- **직관적인 네비게이션**: 탭 기반 정보 구성
- **실시간 업데이트**: 운영 중인 축제의 실시간 데이터 표시
- **시각적 피드백**: 진행률, 상태 등 시각적 요소 활용

## 📱 주요 페이지

1. **축제 목록**: 모든 축제를 테이블 형태로 조회
2. **축제 생성**: 새로운 축제 등록 폼
3. **축제 상세**: 4개 탭으로 구성된 상세 페이지
   - 기본 정보: 축제 정보 및 구역 관리
   - 기획 지원: AI 기반 기획 도구
   - 운영 지원: 실시간 모니터링
   - 결과 리포트: 성과 분석

## 🔧 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린팅
npm run lint
```

## 🤝 기여하기

1. 이 저장소를 포크하세요
2. 새로운 기능 브랜치를 생성하세요 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성하세요

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.