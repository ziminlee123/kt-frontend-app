'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function SimpleTest() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testDirectAPI = async () => {
    setLoading(true);
    setResult('테스트 중...');
    
    try {
      // 직접 fetch로 테스트
      const response = await fetch('http://localhost:8080/api/festivals', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
      
    } catch (error) {
      setResult(`오류 발생: ${error.message}`);
      console.error('API 테스트 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const testHealth = async () => {
    setLoading(true);
    setResult('헬스체크 중...');
    
    try {
      const response = await fetch('http://localhost:8080/health', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
      
    } catch (error) {
      setResult(`오류 발생: ${error.message}`);
      console.error('헬스체크 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>🔧 간단 API 테스트</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testHealth} disabled={loading}>
            헬스체크 테스트
          </Button>
          <Button onClick={testDirectAPI} disabled={loading}>
            축제 API 테스트
          </Button>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg min-h-32">
          <pre className="text-sm overflow-auto">
            {result || '테스트 버튼을 클릭하세요'}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
