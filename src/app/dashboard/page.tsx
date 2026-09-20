'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

type Enrollment = { courseId: number; courseTitle: string; enrolledAt: string };

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((session.user as any)?.role === 'admin') {
      router.push('/admin/dashboard');
      return;
    }
    const load = async () => {
      try {
        const res = await fetch('/api/users/enroll', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setEnrollments(data.enrollments || []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [session, status, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-emerald-400 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = session.user as any;
  const isTeacher = user?.role === 'teacher';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700/50 hidden md:block">
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Image src="/images/logo.png" alt="Quran Reading System" width={24} height={24} className="filter brightness-0 invert" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{isTeacher ? 'Teacher Dashboard' : 'Student Dashboard'}</h2>
                <p className="text-sm text-emerald-400">Welcome back!</p>
              </div>
            </div>
          </div>
          <nav className="p-4 space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
              </svg>
              Overview
            </Link>
            {!isTeacher && (
              <>
                <Link href="/courses" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Courses
                </Link>
                <Link href="/contact" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                  </svg>
                  Support
                </Link>
              </>
            )}
            {isTeacher && (
              <Link href="/contact" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
                Support
              </Link>
            )}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1">
          {/* Top bar */}
          <header className="bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50">
            <div className="px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Mobile menu button */}
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-white">Welcome back, {user?.name}</h1>
                  <p className="text-slate-400 text-sm mt-1">Here's your learning progress</p>
                </div>
              </div>
              <button 
                onClick={() => signOut()} 
                className="btn btn-outline flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all duration-300 text-sm md:text-base"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </header>

          {/* Mobile Sidebar Overlay */}
          {isMobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-50">
              <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}></div>
              <div className="fixed left-0 top-0 h-full w-64 bg-slate-800/95 backdrop-blur-sm border-r border-slate-700/50">
                <div className="p-6 border-b border-slate-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Image src="/images/logo.png" alt="Quran Reading System" width={20} height={20} className="filter brightness-0 invert" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">{isTeacher ? 'Teacher Dashboard' : 'Student Dashboard'}</h2>
                      <p className="text-xs text-emerald-400">Welcome back!</p>
                    </div>
                  </div>
                </div>
                <nav className="p-4 space-y-2">
                  <Link 
                    href="/dashboard" 
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                    </svg>
                    Overview
                  </Link>
                  {!isTeacher && (
                    <Link 
                      href="/courses" 
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Courses
                    </Link>
                  )}
                  <Link 
                    href="/contact" 
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                    </svg>
                    Support
                  </Link>
                </nav>
              </div>
            </div>
          )}

          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {/* Personal Info */}
            <section className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 mb-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Personal Information</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-6 border border-slate-600/30 hover:border-emerald-500/30 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-6 w-6 bg-emerald-500/20 rounded-md flex items-center justify-center">
                      <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <p className="text-slate-400 text-sm font-medium">Full Name</p>
                  </div>
                  <p className="font-semibold text-white text-lg">{user?.name}</p>
                </div>
                <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-6 border border-slate-600/30 hover:border-emerald-500/30 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-6 w-6 bg-emerald-500/20 rounded-md flex items-center justify-center">
                      <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-slate-400 text-sm font-medium">Email Address</p>
                  </div>
                  <p className="font-semibold text-white text-lg">{user?.email}</p>
                </div>
                <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-6 border border-slate-600/30 hover:border-emerald-500/30 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-6 w-6 bg-emerald-500/20 rounded-md flex items-center justify-center">
                      <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-slate-400 text-sm font-medium">Account Role</p>
                  </div>
                  <p className="font-semibold text-white text-lg capitalize">{user?.role}</p>
                </div>
              </div>
            </section>

            {/* Enrollments - Only show for students */}
            {!isTeacher && (
              <section className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-white">My Enrolled Courses</h2>
                  </div>
                  <Link 
                    href="/courses" 
                    className="hero-btn inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-xl text-sm font-medium hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Browse Courses
                  </Link>
                </div>
                {enrollments.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="h-20 w-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">No courses enrolled yet</h3>
                    <p className="text-slate-400 mb-6 max-w-md mx-auto">You haven't enrolled in any courses yet. Browse our available courses and start your learning journey. Our admin team will contact you to schedule live Zoom classes.</p>
                    <Link 
                      href="/courses" 
                      className="hero-btn inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-4 rounded-xl text-base font-medium hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Explore Courses
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {enrollments.map((e) => (
                      <div key={e.courseId} className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/30 rounded-xl p-6 hover:border-emerald-500/30 transition-all duration-300 group">
                        <div className="flex items-start justify-between mb-4">
                          <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">
                            {new Date(e.enrolledAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="font-bold text-white text-lg mb-3 group-hover:text-emerald-400 transition-colors duration-300">{e.courseTitle}</h3>
                        <div className="text-sm">
                          {(() => {
                            const enrolledDate = new Date(e.enrolledAt);
                            const now = new Date();
                            const oneDayInMs = 24 * 60 * 60 * 1000;
                            const isWithinOneDay = (now.getTime() - enrolledDate.getTime()) < oneDayInMs;
                            
                            return isWithinOneDay ? (
                              <div className="flex items-center gap-2 text-emerald-400">
                                <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                <span>Team will contact you to schedule live sessions</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-slate-400">
                                <div className="h-2 w-2 bg-slate-400 rounded-full"></div>
                                <span>Enrollment confirmed</span>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Teacher-specific content */}
            {isTeacher && (
              <section className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-xl">
                <div className="text-center py-12">
                 
                  
                 <div className="flex flex-col sm:flex-row gap-4 justify-center">

                 <p className="mt-2">The admin will contact you with teaching assignments and schedule information.</p>
                  
                    <Link 
                      href="/contact" 
                      className="hero-btn inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-xl text-sm font-medium hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
                    >
                     
                      Contact Support
                    </Link>
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
