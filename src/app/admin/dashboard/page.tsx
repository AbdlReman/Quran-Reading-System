'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  isActive: boolean;
  createdAt: string;
  enrollments?: Array<{ courseId: number; courseTitle: string; enrolledAt: string }>;
  phone?: string;
  address?: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'enrollments'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || !session.user || (session.user as { role: string }).role !== 'admin') {
      router.push('/auth/signin');
      return;
    }

    fetchUsers();
  }, [session, status, router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  // Filter and sort users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'email':
        return a.email.localeCompare(b.email);
      case 'role':
        return a.role.localeCompare(b.role);
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, sortBy]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session || !session.user || (session.user as { role: string }).role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Navigation */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
                <button 
                  onClick={() => setActiveTab('users')} 
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === 'users' 
                      ? 'bg-emerald-600 text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  Users
                </button>
                <button 
                  onClick={() => setActiveTab('enrollments')} 
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === 'enrollments' 
                      ? 'bg-emerald-600 text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  Enrollments
                </button>
              </div>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full">

            {/* Users Table */}
            {activeTab === 'users' && (
              <div className="bg-gray-800 rounded-2xl border border-gray-700/50 overflow-hidden shadow-2xl">
                {/* Header Section */}
                <div className="px-8 py-8 border-b border-gray-700/30">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">User Management</h2>
                      <p className="text-gray-400">
                        Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
                        {filteredUsers.length !== users.length && ` (${users.length} total)`}
                      </p>
                    </div>
                    
                  </div>
                </div>

                {/* Filters & Search Section */}
                <div className="px-8 py-8 bg-gray-800/50 border-b border-gray-700/30 mb-6">
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1">
                      <div className="relative">
                        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                          type="text"
                          placeholder="Search by name or email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 min-w-[140px]"
                      >
                        <option value="all">All Roles</option>
                        <option value="student">Students</option>
                        <option value="teacher">Teachers</option>
                        <option value="admin">Admins</option>
                      </select>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 min-w-[160px]"
                      >
                        <option value="name">Sort by Name</option>
                        <option value="email">Sort by Email</option>
                        <option value="role">Sort by Role</option>
                        <option value="created">Sort by Date</option>
                      </select>
                    </div>
                  </div>
                </div>
<br/>
                {/* Table Section */}
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-700/30">
                      <tr>
                        <th className="px-8 py-6 text-left text-xs font-bold text-gray-200 uppercase tracking-wider">User</th>
                        <th className="px-8 py-6 text-left text-xs font-bold text-gray-200 uppercase tracking-wider">Email</th>
                        <th className="px-8 py-6 text-left text-xs font-bold text-gray-200 uppercase tracking-wider">Role</th>
                        <th className="px-8 py-6 text-left text-xs font-bold text-gray-200 uppercase tracking-wider">Status</th>
                        <th className="px-8 py-6 text-left text-xs font-bold text-gray-200 uppercase tracking-wider">Phone</th>
                        <th className="px-8 py-6 text-left text-xs font-bold text-gray-200 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700/20">
                      {paginatedUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-700/20 transition-all duration-200 group">
                          <td className="px-8 py-8 whitespace-nowrap">
                            <div className="flex items-center space-x-4">
                              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                                <span className="text-lg font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
                              </div>
                              <div>
                                <div className="text-base font-semibold text-white mb-1">{user.name}</div>
                                <div className="text-sm text-gray-400 font-mono">ID: {user._id.slice(0,8)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-8 whitespace-nowrap">
                            <div className="text-sm text-gray-200 font-medium">{user.email}</div>
                          </td>
                          <td className="px-8 py-8 whitespace-nowrap">
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user._id, e.target.value)}
                              className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-600/50 bg-gray-700/50 text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 hover:bg-gray-700/70"
                            >
                              <option value="student">Student</option>
                              <option value="teacher">Teacher</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-8 py-8 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${
                              user.isActive 
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                user.isActive ? 'bg-emerald-400' : 'bg-red-400'
                              }`}></div>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-8 py-8 whitespace-nowrap">
                            <div className="text-sm text-gray-200 font-medium">
                              {user.phone ? (
                                <span className="flex items-center">
                                  <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                  </svg>
                                  {user.phone}
                                </span>
                              ) : (
                                <span className="text-gray-500 italic font-normal">No phone number</span>
                              )}
                            </div>
                          </td>
                          <td className="px-8 py-8 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 ${
                                user.isActive 
                                  ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 hover:border-red-500/50' 
                                  : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/50'
                              }`}
                              title={user.isActive ? 'Deactivate user' : 'Activate user'}
                            >
                              {user.isActive ? (
                                <>
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Activate
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Section */}
                {totalPages > 1 && (
                  <div className="px-8 py-6 border-t border-gray-700/30 bg-gray-800/30">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="text-sm text-gray-400">
                        Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} results
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-2 text-sm font-medium text-gray-400 bg-gray-700/50 border border-gray-600/50 rounded-lg hover:bg-gray-700/70 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          Previous
                        </button>
                        
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                  currentPage === pageNum
                                    ? 'bg-emerald-600 text-white shadow-lg'
                                    : 'text-gray-400 bg-gray-700/50 border border-gray-600/50 hover:bg-gray-700/70 hover:text-white'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>
                        
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 text-sm font-medium text-gray-400 bg-gray-700/50 border border-gray-600/50 rounded-lg hover:bg-gray-700/70 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Enrollments View */}
            {activeTab === 'enrollments' && (
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
                <div className="px-6 py-6 border-b border-gray-700">
                  <h2 className="text-xl font-bold text-white">Enrollments by Course</h2>
                  <p className="text-sm text-gray-400 mt-1">View all student enrollments organized by course</p>
                </div>
                <div className="p-6">
                  {(() => {
                    const map: Record<string, { courseId: number; courseTitle: string; students: Array<{ _id: string; name: string; email: string; phone?: string; enrolledAt?: string }> }> = {};
                    users.forEach(u => {
                      (u.enrollments || []).forEach(e => {
                        const key = String(e.courseId);
                        if (!map[key]) map[key] = { courseId: e.courseId, courseTitle: e.courseTitle, students: [] };
                        map[key].students.push({ _id: u._id, name: u.name, email: u.email, phone: u.phone, enrolledAt: e.enrolledAt });
                      });
                    });
                    const list = Object.values(map).sort((a,b) => a.courseTitle.localeCompare(b.courseTitle));
                    if (list.length === 0) return (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <p className="text-gray-400 text-lg">No enrollments yet</p>
                        <p className="text-gray-500 text-sm mt-1">Students will appear here once they enroll in courses</p>
                      </div>
                    );
                    return (
                      <div className="space-y-6">
                        {list.map(course => (
                          <div key={course.courseId} className="border border-gray-700 rounded-lg bg-gray-750 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-700 bg-gradient-to-r from-gray-750 to-gray-700">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center mr-4 shadow-lg">
                                    <span className="text-white font-bold text-lg">Q</span>
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-semibold text-white">{course.courseTitle}</h3>
                                    <p className="text-sm text-gray-400">Course ID: {course.courseId}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-emerald-400">{course.students.length}</div>
                                  <div className="text-sm text-gray-400">{course.students.length === 1 ? 'student' : 'students'} enrolled</div>
                                </div>
                              </div>
                            </div>
                            <div className="divide-y divide-gray-700">
                              {course.students.map(s => (
                                <div key={s._id} className="px-6 py-4 hover:bg-gray-700 transition-colors duration-150">
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center mb-2">
                                        <div className="h-8 w-8 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                                          <span className="text-sm font-medium text-white">{s.name.charAt(0).toUpperCase()}</span>
                                        </div>
                                        <div>
                                          <div className="font-semibold text-white">{s.name}</div>
                                          <div className="text-sm text-gray-400">{s.email}</div>
                                        </div>
                                      </div>
                                      {s.phone && (
                                        <div className="flex items-center text-sm text-emerald-400 ml-11">
                                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                          </svg>
                                          {s.phone}
                                        </div>
                                      )}
                                    </div>
                                    <div className="text-right">
                                      {s.enrolledAt && (
                                        <div className="text-sm text-gray-400">
                                          Enrolled {new Date(s.enrolledAt).toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'short', 
                                            day: 'numeric' 
                                          })}
                                        </div>
                                      )}
                                      <div className="mt-2">
                                        <button className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-md transition-colors duration-200">
                                          Contact Student
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
