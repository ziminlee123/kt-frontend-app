@echo off
echo ==========================================
echo KT 축제 관리 시스템 - 개발 환경 시작
echo ==========================================
echo.

REM 환경 변수 파일이 없으면 생성
if not exist .env.local (
    echo 환경 변수 파일을 생성합니다...
    copy env.example .env.local
    echo .env.local 파일이 생성되었습니다.
    echo.
)

echo 백엔드 서버 상태를 확인하는 중...
curl -s http://localhost:8080/api/health > nul
if %errorlevel% neq 0 (
    echo.
    echo ⚠️  백엔드 서버가 실행되지 않았습니다!
    echo 백엔드 서버를 먼저 시작해주세요:
    echo   1. backend-app 폴더로 이동
    echo   2. docker-compose up -d  ^(PostgreSQL 시작^)
    echo   3. ./gradlew bootRun     ^(Spring Boot 시작^)
    echo.
    pause
    exit /b 1
)

echo ✅ 백엔드 서버가 실행 중입니다.
echo.

echo 프론트엔드 개발 서버를 시작합니다...
echo 브라우저에서 http://localhost:3000 으로 접속하세요.
echo.

npm run dev
