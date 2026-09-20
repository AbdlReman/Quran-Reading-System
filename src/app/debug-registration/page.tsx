'use client';

import React, { useState } from 'react';

interface TestResults {
  environment?: Record<string, unknown>;
  database?: Record<string, unknown>;
  registration?: {
    status: number;
    data: Record<string, unknown>;
  };
  error?: string;
}

export default function DebugRegistrationPage() {
  const [testResults, setTestResults] = useState<TestResults>({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results: TestResults = {};

    try {
      // Test 1: Check environment variables
      console.log('Testing environment variables...');
      const envResponse = await fetch('/api/check-env');
      const envData = await envResponse.json();
      results.environment = envData;
      console.log('Environment test result:', envData);

      // Test 2: Check database connection
      console.log('Testing database connection...');
      const dbResponse = await fetch('/api/test-connection');
      const dbData = await dbResponse.json();
      results.database = dbData;
      console.log('Database test result:', dbData);

      // Test 3: Test registration API with minimal data
      console.log('Testing registration API...');
      const regResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          password: 'TestPass123!',
          role: 'student'
        }),
      });
      const regData = await regResponse.json();
      results.registration = {
        status: regResponse.status,
        data: regData
      };
      console.log('Registration test result:', regData);

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      results.error = errorMessage;
      console.error('Test error:', error);
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Authentication System Debug
          </h1>
          <p className="text-gray-600">
            This page helps debug the authentication system and identify issues.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              System Tests
            </h2>
            <button
              onClick={runTests}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Running Tests...' : 'Run Tests'}
            </button>
          </div>

          {Object.keys(testResults).length > 0 && (
            <div className="space-y-4">
              {testResults.environment && (
                <div className="border rounded-md p-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Environment Variables Test
                  </h3>
                  <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">
                    {JSON.stringify(testResults.environment, null, 2)}
                  </pre>
                </div>
              )}

              {testResults.database && (
                <div className="border rounded-md p-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Database Connection Test
                  </h3>
                  <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">
                    {JSON.stringify(testResults.database, null, 2)}
                  </pre>
                </div>
              )}

              {testResults.registration && (
                <div className="border rounded-md p-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Registration API Test
                  </h3>
                  <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">
                    {JSON.stringify(testResults.registration, null, 2)}
                  </pre>
                </div>
              )}

              {testResults.error && (
                <div className="border border-secondary-200 rounded-md p-4 bg-secondary-50">
                  <h3 className="font-medium text-secondary-900 mb-2">
                    Error
                  </h3>
                  <p className="text-secondary-700">{testResults.error}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Troubleshooting Steps
          </h2>
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h3 className="font-medium text-gray-900">1. Check Environment Variables</h3>
              <p>Make sure you have a <code className="bg-gray-100 px-1 rounded">.env.local</code> file with:</p>
              <ul className="list-disc list-inside ml-4 mt-2">
                <li>MONGODB_URI (your MongoDB connection string)</li>
                <li>NEXTAUTH_SECRET (a random secret key)</li>
                <li>NEXTAUTH_URL (http://localhost:3000 for development)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900">2. Verify MongoDB Connection</h3>
              <p>Ensure your MongoDB instance is running and accessible.</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900">3. Restart Development Server</h3>
              <p>After setting environment variables, restart your development server:</p>
              <code className="bg-gray-100 px-2 py-1 rounded block mt-1">npm run dev</code>
            </div>

            <div>
              <h3 className="font-medium text-gray-900">4. Check Console Logs</h3>
              <p>Look at the browser console and terminal for detailed error messages.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
