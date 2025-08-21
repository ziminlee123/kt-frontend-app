'use client';

import { useState } from 'react';
import { healthApi, festivalApi, dashboardApi } from '../lib/api';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

export default function TestConnection() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runTest = async (testName, testFunction) => {
    setLoading(true);
    try {
      const startTime = Date.now();
      const result = await testFunction();
      const endTime = Date.now();
      
      setResults(prev => ({
        ...prev,
        [testName]: {
          status: 'success',
          data: result,
          time: endTime - startTime,
          message: '연결 성공!'
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [testName]: {
          status: 'error',
          error: error.message,
          message: '연결 실패'
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const tests = [
    {
      name: 'health',
      label: '서버 상태 확인',
      description: '백엔드 서버가 정상 작동 중인지 확인',
      test: () => healthApi.checkHealth()
    },
    {
      name: 'festivals',
      label: '축제 목록 조회',
      description: 'Festival API 엔드포인트 테스트',
      test: () => festivalApi.getAllFestivals()
    }
  ];

  const runAllTests = async () => {
    setResults({});
    for (const test of tests) {
      await runTest(test.name, test.test);
      // 테스트 간 짧은 지연
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500">성공</Badge>;
      case 'error':
        return <Badge className="bg-red-500">실패</Badge>;
      default:
        return <Badge className="bg-gray-500">대기중</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>🔗 백엔드 연결 테스트</CardTitle>
        <CardDescription>
          백엔드 서버와의 연결 상태를 확인하고 API 기능을 테스트합니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={runAllTests} disabled={loading}>
            {loading ? '테스트 중...' : '전체 테스트 실행'}
          </Button>
          <Button variant="outline" onClick={() => setResults({})}>
            결과 초기화
          </Button>
        </div>

        <div className="grid gap-4">
          {tests.map((test) => (
            <Card key={test.name} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold">{test.label}</h4>
                  <p className="text-sm text-gray-600">{test.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(results[test.name]?.status)}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => runTest(test.name, test.test)}
                    disabled={loading}
                  >
                    테스트
                  </Button>
                </div>
              </div>

              {results[test.name] && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{results[test.name].message}</span>
                    {results[test.name].time && (
                      <span className="text-sm text-gray-500">
                        {results[test.name].time}ms
                      </span>
                    )}
                  </div>
                  
                  {results[test.name].status === 'error' && (
                    <div className="text-red-600 text-sm">
                      <strong>에러:</strong> {results[test.name].error}
                    </div>
                  )}
                  
                  {results[test.name].status === 'success' && results[test.name].data && (
                    <details className="text-sm">
                      <summary className="cursor-pointer text-blue-600">
                        응답 데이터 보기
                      </summary>
                      <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto max-h-32">
                        {JSON.stringify(results[test.name].data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">💡 도움말</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 백엔드 서버가 실행 중인지 확인하세요 (http://localhost:8080)</li>
            <li>• PostgreSQL 데이터베이스가 실행 중인지 확인하세요</li>
            <li>• CORS 설정이 올바른지 확인하세요</li>
            <li>• 브라우저 개발자 도구의 Network 탭에서 상세 오류를 확인할 수 있습니다</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

