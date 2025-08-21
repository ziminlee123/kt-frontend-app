#!/bin/bash

echo "=========================================="
echo "KT 축제 관리 시스템 - 개발 환경 시작"
echo "=========================================="
echo

# 환경 변수 파일이 없으면 생성
if [ ! -f .env.local ]; then
    echo "환경 변수 파일을 생성합니다..."
    cp env.example .env.local
    echo ".env.local 파일이 생성되었습니다."
    echo
fi

echo "백엔드 서버 상태를 확인하는 중..."
if ! curl -s http://localhost:8080/api/health > /dev/null; then
    echo
    echo "⚠️  백엔드 서버가 실행되지 않았습니다!"
    echo "백엔드 서버를 먼저 시작해주세요:"
    echo "  1. backend-app 폴더로 이동"
    echo "  2. docker-compose up -d  (PostgreSQL 시작)"
    echo "  3. ./gradlew bootRun     (Spring Boot 시작)"
    echo
    read -p "계속하려면 아무 키나 누르세요..."
    exit 1
fi

echo "✅ 백엔드 서버가 실행 중입니다."
echo

echo "프론트엔드 개발 서버를 시작합니다..."
echo "브라우저에서 http://localhost:3000 으로 접속하세요."
echo

npm run dev
