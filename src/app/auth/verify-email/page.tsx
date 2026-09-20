'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VerifyEmailForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyEmail = async (verificationToken: string) => {
      setLoading(true);
      setError('');
      setSuccess('');

      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: verificationToken }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Email verification failed');
        } else {
          setSuccess('Email verified successfully! Redirecting to sign in...');
          setTimeout(() => {
            router.push('/auth/signin');
          }, 2000);
        }
      } catch {
        setError('An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      verifyEmail(tokenParam);
    } else {
      setError('Invalid verification link. Please check your email for the correct link.');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">Q</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We're verifying your email address
          </p>
        </div>
        
        <div className="space-y-6">
          {loading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Verifying your email...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-secondary-50 border border-secondary-200 text-secondary-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
              {success}
            </div>
          )}
          
          {!loading && !success && !error && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Please wait while we verify your email address...
              </p>
            </div>
          )}
          
          <div className="text-center space-y-4">
            <Link 
              href="/auth/signin" 
              className="text-sm text-blue-600 hover:text-blue-500 block"
            >
              Back to sign in
            </Link>
            
            <Link 
              href="/" 
              className="text-sm text-gray-600 hover:text-gray-500 block"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <VerifyEmailForm />
    </Suspense>
  );
}
