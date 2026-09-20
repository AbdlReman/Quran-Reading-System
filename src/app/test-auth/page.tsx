'use client';

import React, { useState } from 'react';

interface TestResults {
  simple?: {
    status: number;
    data: Record<string, unknown>;
  };
  environment?: {
    status: number;
    data: Record<string, unknown>;
  };
  database?: {
    status: number;
    data: Record<string, unknown>;
  };
  error?: string;
}

export default function TestAuthPage() {
  const [results, setResults] = useState<TestResults>({});
  const [loading, setLoading] = useState(false);

  const runQuickTest = async () => {
    setLoading(true);
    const testResults: TestResults = {};

    try {
      // Test 1: Simple API
      console.log('Testing simple API...');
      const simpleRes = await fetch('/api/test-simple');
      const simpleData = await simpleRes.json();
      testResults.simple = { status: simpleRes.status, data: simpleData };

      // Test 2: Environment
      console.log('Testing environment...');
      const envRes = await fetch('/api/check-env');
      const envData = await envRes.json();
      testResults.environment = { status: envRes.status, data: envData };

      // Test 3: Database (only if environment is ok)
      if (envData.status === 'ok') {
        console.log('Testing database...');
        const dbRes = await fetch('/api/test-connection');
        const dbData = await dbRes.json();
        testResults.database = { status: dbRes.status, data: dbData };
      }

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      testResults.error = errorMessage;
    }

    setResults(testResults);
    setLoading(false);
  };

  const getStatusColor = (status: number) => {
    return status === 200 ? 'text-green-600' : 'text-secondary-600';
  };

  const getStatusText = (status: number) => {
    return status === 200 ? '✅ PASS' : '❌ FAIL';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🔧 Authentication System Quick Test
          </h1>
          <p className="text-gray-600">
            This page will quickly test all components of the authentication system
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              System Status
            </h2>
            <button
              onClick={runQuickTest}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Run Quick Test'}
            </button>
          </div>

          {Object.keys(results).length > 0 && (
            <div className="space-y-4">
              {results.simple && (
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-900">Basic API Test</h3>
                    <span className={`font-bold ${getStatusColor(results.simple.status)}`}>
                      {getStatusText(results.simple.status)}
                    </span>
                  </div>
                  <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">
                    {JSON.stringify(results.simple.data, null, 2)}
                  </pre>
                </div>
              )}

              {results.environment && (
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-900">Environment Variables</h3>
                    <span className={`font-bold ${getStatusColor(results.environment.status)}`}>
                      {getStatusText(results.environment.status)}
                    </span>
                  </div>
                  <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">
                    {JSON.stringify(results.environment.data, null, 2)}
                  </pre>
                </div>
              )}

              {results.database && (
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-900">Database Connection</h3>
                    <span className={`font-bold ${getStatusColor(results.database.status)}`}>
                      {getStatusText(results.database.status)}
                    </span>
                  </div>
                  <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">
                    {JSON.stringify(results.database.data, null, 2)}
                  </pre>
                </div>
              )}

              {results.error && (
                <div className="border border-secondary-200 rounded-md p-4 bg-secondary-50">
                  <h3 className="font-medium text-secondary-900 mb-2">Error</h3>
                  <p className="text-secondary-700">{results.error}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🚨 If Tests Fail - Quick Fixes
          </h2>
          
          <div className="space-y-4 text-sm">
            <div className="border-l-4 border-secondary-500 pl-4">
              <h3 className="font-medium text-gray-900">❌ Basic API Test Fails</h3>
              <p className="text-gray-600">Server is not running properly. Restart with:</p>
              <code className="bg-gray-100 px-2 py-1 rounded block mt-1">npm run dev</code>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="font-medium text-gray-900">⚠️ Environment Test Fails</h3>
              <p className="text-gray-600">Missing environment variables. Create .env.local:</p>
              <code className="bg-gray-100 px-2 py-1 rounded block mt-1">create-env.bat</code>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium text-gray-900">🔌 Database Test Fails</h3>
              <p className="text-gray-600">MongoDB not running. Start MongoDB or use Atlas:</p>
              <code className="bg-gray-100 px-2 py-1 rounded block mt-1">mongod</code>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="font-medium text-blue-900 mb-2">📞 Need Help?</h3>
            <p className="text-blue-700 text-sm">
              Share the test results above and I'll help you fix any issues!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
