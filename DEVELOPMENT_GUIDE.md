# 🎪 KT 축제 관리 시스템 - 개발 가이드

## 📋 프로젝트 개요

REST API 기반의 축제 관리 웹 애플리케이션
- **백엔드**: Spring Boot + PostgreSQL
- **프론트엔드**: Next.js + React + Tailwind CSS
- **API 통신**: Axios + Custom Hooks

---

## 🚀 빠른 시작

### 1. 환경 준비

#### 백엔드 서버 시작
```bash
# 백엔드 디렉토리로 이동
cd ../backend-app

# PostgreSQL 시작
docker-compose up -d

# Spring Boot 애플리케이션 시작
./gradlew bootRun
```

#### 프론트엔드 서버 시작
```bash
# 프론트엔드 디렉토리에서
cd frontend-app-figma_v2

# 의존성 설치 (최초 1회)
npm install

# 환경 변수 설정
copy env.example .env.local

# 개발 서버 시작
npm run dev
```

### 2. 접속 확인
- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:8080/api
- **Health Check**: http://localhost:8080/api/health

---

## 🔧 개발 환경 설정

### 환경 변수 (.env.local)
```env
# 백엔드 API 서버 URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api

# 개발 환경 설정
NODE_ENV=development
```

### CORS 설정 (백엔드)
개발 환경에서는 이미 설정되어 있음:
```java
@Configuration
@Profile("dev")
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("*")
                .allowedHeaders("*");
    }
}
```

---

## 📁 프로젝트 구조

### 프론트엔드 구조
```
src/
├── app/                    # Next.js App Router
│   ├── page.js            # 메인 페이지
│   ├── layout.js          # 레이아웃
│   └── globals.css        # 전역 스타일
├── components/            # React 컴포넌트
│   ├── FestivalList.jsx   # 축제 목록
│   ├── FestivalForm.jsx   # 축제 폼
│   ├── FestivalDetail.jsx # 축제 상세
│   ├── ZoneModal.jsx      # 구역 모달
│   ├── TestConnection.jsx # API 연결 테스트
│   └── ui/               # UI 컴포넌트 (shadcn/ui)
├── hooks/                # Custom React Hooks
│   ├── useFestivals.js   # 축제 데이터 관리
│   ├── useZones.js       # 구역 데이터 관리
│   ├── useDashboard.js   # 대시보드 데이터
│   └── useSNS.js         # SNS 피드백
├── lib/                  # 유틸리티
│   ├── api.js            # API 클라이언트
│   └── utils.js          # 헬퍼 함수
```

### 백엔드 구조 (참고)
```
src/main/java/com/kt/backendapp/
├── controller/           # REST API 컨트롤러
│   ├── FestivalController.java
│   ├── ZoneController.java
│   ├── DashboardController.java
│   └── SNSFeedbackController.java
├── service/             # 비즈니스 로직
├── repository/          # 데이터 접근
├── entity/             # JPA 엔티티
├── dto/                # 데이터 전송 객체
└── config/             # 설정 클래스
    └── CorsConfig.java
```

---

## 🔌 API 연동 가이드

### 1. API 클라이언트 구조

#### 기본 설정 (src/lib/api.js)
```javascript
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});
```

#### 응답 인터셉터 (백엔드 ApiResponseDTO 처리)
```javascript
api.interceptors.response.use(
  (response) => {
    // 백엔드가 ApiResponseDTO 형태로 응답
    if (response.data && response.data.success && response.data.data !== undefined) {
      return {
        ...response,
        data: response.data.data, // data 필드만 추출
        message: response.data.message
      };
    }
    return response;
  },
  // 에러 처리...
);
```

### 2. API 함수들

#### Festival API
```javascript
export const festivalApi = {
  getAllFestivals: async (params = {}) => { /* 축제 목록 조회 */ },
  getFestivalById: async (id) => { /* 축제 상세 조회 */ },
  createFestival: async (festivalData) => { /* 축제 생성 */ },
  updateFestival: async (id, festivalData) => { /* 축제 수정 */ },
  deleteFestival: async (id) => { /* 축제 삭제 */ },
  updateFestivalStatus: async (id, status) => { /* 상태 변경 */ },
  getRunningFestivals: async () => { /* 운영 중인 축제 */ },
  getUpcomingFestivals: async () => { /* 예정된 축제 */ },
  getFestivalStatistics: async () => { /* 축제 통계 */ },
};
```

#### Zone API
```javascript
export const zoneApi = {
  getZonesByFestivalId: async (festivalId) => { /* 구역 목록 */ },
  createZone: async (festivalId, zoneData) => { /* 구역 생성 */ },
  updateZoneRealTimeData: async (festivalId, zoneId, updateData) => { /* 실시간 데이터 */ },
  getHighCongestionZones: async (festivalId, threshold) => { /* 혼잡 구역 */ },
  getLowCongestionZones: async (festivalId, threshold) => { /* 여유 구역 */ },
};
```

### 3. Custom Hooks 사용법

#### useFestivals Hook
```javascript
import { useFestivals } from '../hooks/useFestivals';

function FestivalComponent() {
  const {
    festivals,              // 축제 목록
    loading,               // 로딩 상태
    error,                 // 에러 상태
    fetchFestivals,        // 목록 새로고침
    createFestival,        // 축제 생성
    updateFestival,        // 축제 수정
    deleteFestival,        // 축제 삭제
    updateFestivalStatus,  // 상태 변경
  } = useFestivals();

  // 축제 생성 예시
  const handleCreate = async (festivalData) => {
    try {
      await createFestival(festivalData);
      // 성공 처리
    } catch (error) {
      // 에러 처리
    }
  };
}
```

---

## 🛡️ 에러 처리 및 검증

### 1. 프론트엔드 검증 (FestivalForm.jsx)

#### 폼 검증 함수
```javascript
const validateForm = () => {
  const newErrors = {};
  
  // 필수 필드 검증
  if (!formData.name.trim()) {
    newErrors.name = '축제명을 입력해주세요.';
  }
  
  // 날짜 순서 검증
  if (formData.startDate && formData.endDate) {
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (startDate > endDate) {
      newErrors.endDate = '종료일은 시작일보다 이후여야 합니다.';
    }
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

#### 에러 표시
```javascript
<Input
  value={formData.name}
  className={errors.name ? 'border-red-500' : ''}
  onChange={(e) => handleChange('name', e.target.value)}
/>
{errors.name && (
  <p className="text-sm text-red-600">{errors.name}</p>
)}
```

### 2. 안전한 데이터 처리 (FestivalList.jsx)

#### 날짜 처리
```javascript
const formatPeriod = (startDate, endDate) => {
  try {
    if (!startDate || !endDate) return '날짜 정보 없음';
    
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return '잘못된 날짜 형식';
    }
    
    // 정상 처리...
  } catch (error) {
    return '날짜 처리 오류';
  }
};
```

---

## 🧪 테스트 및 디버깅

### 1. API 연결 테스트
브라우저에서 "API 연결 테스트" 버튼을 클릭하여 확인:
- 서버 상태 확인
- 축제 목록 조회
- 대시보드 데이터 조회

### 2. 브라우저 개발자 도구
- **Network 탭**: API 요청/응답 확인
- **Console 탭**: 에러 로그 확인
- **Application 탭**: 환경 변수 확인

### 3. 일반적인 문제 해결

#### "CORS 에러"
```
Access to fetch at 'http://localhost:8080/api/...' from origin 'http://localhost:3000' has been blocked by CORS policy
```
**해결**: 백엔드 CORS 설정 확인 또는 백엔드를 `dev` 프로파일로 실행

#### "Network Error"
```
Error: Network Error
```
**해결**: 백엔드 서버가 실행 중인지 확인 (http://localhost:8080/api/health)

#### "404 Not Found"
```
Request failed with status code 404
```
**해결**: API 엔드포인트 URL 확인

---

## 📝 코딩 컨벤션

### 1. 컴포넌트 명명
- **PascalCase**: `FestivalList.jsx`
- **함수형 컴포넌트**: `export function FestivalList() {}`

### 2. 파일 구조
- **컴포넌트**: `.jsx` 확장자
- **훅**: `use`로 시작
- **API**: `api.js`에 모아서 관리

### 3. 에러 처리
- 항상 try-catch 사용
- 사용자에게 친화적인 에러 메시지
- 콘솔에 상세 에러 로그

---

## 🚀 배포 가이드

### 개발 → 운영 전환
1. **.env.local** 수정:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://your-production-api.com/api
   ```

2. **빌드 및 배포**:
   ```bash
   npm run build
   npm start
   ```

---

## 📞 문제 해결

### 자주 발생하는 이슈들

1. **백엔드 서버가 안 켜져요**
   - PostgreSQL 실행 확인: `docker-compose up -d`
   - 포트 충돌 확인: 8080 포트 사용 중인지 확인

2. **축제 등록이 안 돼요**
   - 폼 검증 에러 메시지 확인
   - 브라우저 Network 탭에서 API 요청 확인

3. **데이터가 안 보여요**
   - API 연결 테스트로 서버 상태 확인
   - 백엔드 로그 확인

### 개발 지원
- **API 문서**: http://localhost:8080/swagger-ui/ (구현되어 있다면)
- **백엔드 로그**: Spring Boot 콘솔 확인
- **프론트엔드 로그**: 브라우저 개발자 도구 Console 탭

---

## 🎯 다음 단계 개발 가능 기능들

1. **사용자 인증**: JWT 토큰 기반 로그인
2. **실시간 알림**: WebSocket 연동
3. **파일 업로드**: 축제 이미지 업로드
4. **지도 연동**: Google Maps API
5. **모바일 대응**: 반응형 디자인 개선

---

📅 **마지막 업데이트**: 2024년 12월
👨‍💻 **개발팀**: KT 축제 관리팀
