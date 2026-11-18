'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  isActive: boolean;
  isEmailVerified?: boolean;
  createdAt: string;
  lastLogin?: string;
  dateOfBirth?: string;
  enrollments?: Array<{
    courseId: number;
    courseTitle: string;
    enrolledAt: string;
    age?: number;
    education?: string;
    phone?: string;
    country?: string;
    notes?: string;
  }>;
  phone?: string;
  address?: string;
}

interface ContactMessageItem {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

interface NewsletterLeadItem {
  _id: string;
  email: string;
  source: string;
  status: 'new' | 'contacted';
  createdAt: string;
}

interface TrialLeadItem {
  _id: string;
  name: string;
  country: string;
  phone: string;
  course: string;
  source: string;
  status: 'new' | 'contacted' | 'scheduled' | 'closed';
  createdAt: string;
}

type TabKey = 'overview' | 'messages' | 'leads' | 'trials' | 'users' | 'enrollments';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [leads, setLeads] = useState<NewsletterLeadItem[]>([]);
  const [trialLeads, setTrialLeads] = useState<TrialLeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [messageSearch, setMessageSearch] = useState('');
  const [messageStatusFilter, setMessageStatusFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [messageSort, setMessageSort] = useState<'newest' | 'oldest'>('newest');
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<'all' | 'new' | 'contacted'>('all');

  const [trialSearch, setTrialSearch] = useState('');
  const [trialStatusFilter, setTrialStatusFilter] = useState<'all' | 'new' | 'contacted' | 'scheduled' | 'closed'>('all');
  const [trialSort, setTrialSort] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !session.user || (session.user as { role: string }).role !== 'admin') {
      router.push('/auth/signin');
      return;
    }
    fetchUsers();
    fetchMessages();
    fetchLeads();
    fetchTrialLeads();
  }, [session, status, router]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, sortBy]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/messages', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/admin/leads', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads || []);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const fetchTrialLeads = async () => {
    try {
      const response = await fetch('/api/admin/trial-leads', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setTrialLeads(data.trialLeads || []);
      }
    } catch (error) {
      console.error('Error fetching trial leads:', error);
    }
  };

  const updateTrialStatus = async (id: string, nextStatus: TrialLeadItem['status']) => {
    try {
      const response = await fetch('/api/admin/trial-leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      if (response.ok) fetchTrialLeads();
    } catch (error) {
      console.error('Error updating trial lead:', error);
    }
  };

  const deleteTrialLead = async (id: string) => {
    if (!confirm('Delete this free trial lead?')) return;
    try {
      const response = await fetch(`/api/admin/trial-leads?id=${id}`, { method: 'DELETE' });
      if (response.ok) fetchTrialLeads();
    } catch (error) {
      console.error('Error deleting trial lead:', error);
    }
  };

  const updateMessageStatus = async (id: string, nextStatus: ContactMessageItem['status']) => {
    try {
      const response = await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      if (response.ok) fetchMessages();
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try {
      const response = await fetch(`/api/admin/messages?id=${id}`, { method: 'DELETE' });
      if (response.ok) fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const updateLeadStatus = async (id: string, nextStatus: NewsletterLeadItem['status']) => {
    try {
      const response = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      if (response.ok) fetchLeads();
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm('Delete this lead?')) return;
    try {
      const response = await fetch(`/api/admin/leads?id=${id}`, { method: 'DELETE' });
      if (response.ok) fetchLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (response.ok) fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (response.ok) fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const unreadCount = messages.filter((m) => m.status === 'new').length;
  const newLeadsCount = leads.filter((l) => l.status === 'new').length;
  const newTrialCount = trialLeads.filter((t) => t.status === 'new').length;
  const totalEnrollments = users.reduce((sum, u) => sum + (u.enrollments?.length || 0), 0);
  const recentMessages = [...messages]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  const recentTrials = [...trialLeads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const filteredTrialLeads = useMemo(() => {
    const q = trialSearch.trim().toLowerCase();
    let list = trialLeads.filter((lead) => {
      const matchesSearch =
        !q ||
        lead.name.toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q) ||
        lead.country.toLowerCase().includes(q) ||
        lead.course.toLowerCase().includes(q) ||
        lead.source.toLowerCase().includes(q);
      const matchesStatus = trialStatusFilter === 'all' || lead.status === trialStatusFilter;
      return matchesSearch && matchesStatus;
    });

    list = [...list].sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return trialSort === 'newest' ? -diff : diff;
    });

    return list;
  }, [trialLeads, trialSearch, trialStatusFilter, trialSort]);

  const filteredMessages = useMemo(() => {
    const q = messageSearch.trim().toLowerCase();
    let list = messages.filter((msg) => {
      const matchesSearch =
        !q ||
        msg.firstName.toLowerCase().includes(q) ||
        msg.lastName.toLowerCase().includes(q) ||
        msg.email.toLowerCase().includes(q) ||
        msg.subject.toLowerCase().includes(q) ||
        msg.message.toLowerCase().includes(q) ||
        (msg.phone || '').toLowerCase().includes(q);

      const matchesStatus =
        messageStatusFilter === 'all' ||
        (messageStatusFilter === 'unread' && msg.status === 'new') ||
        (messageStatusFilter === 'read' && msg.status === 'read') ||
        (messageStatusFilter === 'replied' && msg.status === 'replied');

      return matchesSearch && matchesStatus;
    });

    list = [...list].sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return messageSort === 'newest' ? -diff : diff;
    });

    return list;
  }, [messages, messageSearch, messageStatusFilter, messageSort]);

  const filteredLeads = useMemo(() => {
    const q = leadSearch.trim().toLowerCase();
    return leads.filter((lead) => {
      const matchesSearch = !q || lead.email.toLowerCase().includes(q) || lead.source.toLowerCase().includes(q);
      const matchesStatus = leadStatusFilter === 'all' || lead.status === leadStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, leadSearch, leadStatusFilter]);

  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'email':
          return a.email.localeCompare(b.email);
        case 'role':
          return a.role.localeCompare(b.role);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const navItems: Array<{ key: TabKey; label: string; badge?: number; icon: string }> = [
    { key: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4' },
    { key: 'messages', label: 'Messages', badge: unreadCount, icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { key: 'leads', label: 'Newsletter Leads', badge: newLeadsCount, icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2' },
    { key: 'trials', label: 'Free Trial Enrollment', badge: newTrialCount, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { key: 'users', label: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197' },
    { key: 'enrollments', label: 'Enroll Courses', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  ];

  const tabTitles: Record<TabKey, string> = {
    overview: 'Overview',
    messages: 'Messages',
    leads: 'Newsletter Leads',
    trials: 'Free Trial Enrollment',
    users: 'Users',
    enrollments: 'Enroll Courses',
  };

  const selectTab = (tab: TabKey) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#071210] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-11 w-11 animate-spin rounded-full border-2 border-emerald-500/30 border-t-emerald-400" />
          <p className="text-sm text-white/50">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!session || !session.user || (session.user as { role: string }).role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#071210] text-white">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-[2px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 flex h-screen w-[17.5rem] flex-col border-r border-white/[0.08] bg-[#0c1a17] transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="border-b border-white/[0.08] px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1a5c55] to-[#0e3733] text-sm font-bold text-[#d4b86a] shadow-lg shadow-emerald-950/40">
              QRS
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#c4a35a]">Admin Panel</p>
              <h1 className="truncate text-[15px] font-bold leading-tight">Quran Reading System</h1>
            </div>
          </div>
          <p className="mt-3 truncate rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-xs text-white/45">
            {session.user.email}
          </p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const active = activeTab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => selectTab(item.key)}
                className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all ${
                  active
                    ? 'bg-[#144842] text-white shadow-sm shadow-black/20'
                    : 'text-white/65 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#c4a35a]" />
                )}
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    active ? 'bg-white/10 text-[#d4b86a]' : 'bg-white/[0.04] text-white/50 group-hover:text-white/80'
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </span>
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c4a35a] px-1.5 text-[11px] font-bold text-[#0c1a17]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/[0.08] p-4">
          <button
            type="button"
            onClick={() => signOut()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="min-h-screen lg:pl-[17.5rem]">
        <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#071210]/85 px-4 py-3.5 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] lg:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h2 className="text-lg font-bold sm:text-xl">{tabTitles[activeTab]}</h2>
                <p className="text-xs text-white/45">
                  Manage academy data, leads, and enrollments
                </p>
              </div>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                Live admin
              </span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
          {activeTab === 'overview' && (
            <section className="space-y-6">
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#123832] via-[#0e2925] to-[#0a1c19] p-6 sm:p-7">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#c4a35a]/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-12 left-20 h-32 w-32 rounded-full bg-emerald-400/10 blur-3xl" />
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#c4a35a]">Dashboard</p>
                <h3 className="mt-1 text-2xl font-bold sm:text-3xl">Assalamualaikum, Admin</h3>
                <p className="mt-2 max-w-xl text-sm text-white/55">
                  Review new inquiries, trial requests, and course enrollments from one place.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { key: 'users' as TabKey, label: 'Total Users', value: users.length, accent: 'text-sky-300', bg: 'from-sky-500/15 to-transparent' },
                  { key: 'messages' as TabKey, label: 'Unread Messages', value: unreadCount, accent: 'text-emerald-300', bg: 'from-emerald-500/15 to-transparent' },
                  { key: 'leads' as TabKey, label: 'Newsletter Leads', value: newLeadsCount, accent: 'text-amber-300', bg: 'from-amber-500/15 to-transparent' },
                  { key: 'trials' as TabKey, label: 'Trial Requests', value: newTrialCount, accent: 'text-teal-300', bg: 'from-teal-500/15 to-transparent' },
                  { key: 'enrollments' as TabKey, label: 'Enrollments', value: totalEnrollments, accent: 'text-[#d4b86a]', bg: 'from-[#c4a35a]/15 to-transparent' },
                  { key: 'messages' as TabKey, label: 'All Messages', value: messages.length, accent: 'text-white', bg: 'from-white/10 to-transparent' },
                ].map((card) => (
                  <button
                    key={card.label}
                    type="button"
                    onClick={() => selectTab(card.key)}
                    className={`rounded-2xl border border-white/[0.08] bg-gradient-to-b ${card.bg} bg-[#0f221e] p-5 text-left transition hover:border-white/20 hover:bg-[#132824]`}
                  >
                    <p className="text-xs font-medium uppercase tracking-wide text-white/45">{card.label}</p>
                    <p className={`mt-3 text-3xl font-bold tabular-nums ${card.accent}`}>{card.value}</p>
                    <p className="mt-2 text-xs text-white/35">Open section →</p>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="rounded-2xl border border-white/[0.08] bg-[#0f221e] p-5 lg:col-span-1">
                  <h4 className="text-sm font-bold uppercase tracking-wide text-white/50">Quick actions</h4>
                  <div className="mt-4 space-y-2">
                    {[
                      { key: 'messages' as TabKey, label: 'Review messages', hint: `${unreadCount} unread` },
                      { key: 'trials' as TabKey, label: 'Free trial leads', hint: `${newTrialCount} new` },
                      { key: 'enrollments' as TabKey, label: 'Course enrollments', hint: `${totalEnrollments} total` },
                      { key: 'users' as TabKey, label: 'Manage users', hint: `${users.length} accounts` },
                    ].map((action) => (
                      <button
                        key={action.key + action.label}
                        type="button"
                        onClick={() => selectTab(action.key)}
                        className="flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-3 text-left transition hover:border-emerald-500/30 hover:bg-emerald-500/10"
                      >
                        <span className="text-sm font-medium">{action.label}</span>
                        <span className="text-xs text-white/40">{action.hint}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-[#0f221e] overflow-hidden lg:col-span-1">
                  <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                    <h4 className="text-sm font-bold uppercase tracking-wide text-white/50">Recent messages</h4>
                    <button type="button" onClick={() => selectTab('messages')} className="text-xs text-emerald-300 hover:underline">
                      View all
                    </button>
                  </div>
                  <div className="divide-y divide-white/[0.06]">
                    {recentMessages.length === 0 ? (
                      <p className="px-5 py-8 text-center text-sm text-white/40">No messages yet</p>
                    ) : (
                      recentMessages.map((msg) => (
                        <button
                          key={msg._id}
                          type="button"
                          onClick={() => selectTab('messages')}
                          className="flex w-full flex-col gap-1 px-5 py-3.5 text-left hover:bg-white/[0.03]"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-medium">
                              {msg.firstName} {msg.lastName}
                            </p>
                            {msg.status === 'new' && (
                              <span className="shrink-0 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                                New
                              </span>
                            )}
                          </div>
                          <p className="truncate text-xs text-white/45">{msg.subject}</p>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-[#0f221e] overflow-hidden lg:col-span-1">
                  <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                    <h4 className="text-sm font-bold uppercase tracking-wide text-white/50">Recent trials</h4>
                    <button type="button" onClick={() => selectTab('trials')} className="text-xs text-emerald-300 hover:underline">
                      View all
                    </button>
                  </div>
                  <div className="divide-y divide-white/[0.06]">
                    {recentTrials.length === 0 ? (
                      <p className="px-5 py-8 text-center text-sm text-white/40">No trial leads yet</p>
                    ) : (
                      recentTrials.map((lead) => (
                        <button
                          key={lead._id}
                          type="button"
                          onClick={() => selectTab('trials')}
                          className="flex w-full flex-col gap-1 px-5 py-3.5 text-left hover:bg-white/[0.03]"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-medium">{lead.name}</p>
                            {lead.status === 'new' && (
                              <span className="shrink-0 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                                New
                              </span>
                            )}
                          </div>
                          <p className="truncate text-xs text-white/45">
                            {lead.course || 'Trial'} · {lead.phone}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Messages */}
          {activeTab === 'messages' && (
            <section className="rounded-2xl border border-white/10 bg-[#122421] overflow-hidden">
              <div className="px-5 sm:px-6 py-5 border-b border-white/10">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">Contact Messages</h3>
                    <p className="text-sm text-white/50 mt-1">
                      {filteredMessages.length} shown · {unreadCount} unread · {messages.length} total
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto lg:min-w-[34rem]">
                    <input
                      type="search"
                      value={messageSearch}
                      onChange={(e) => setMessageSearch(e.target.value)}
                      placeholder="Search name, email, subject..."
                      className="px-3.5 py-2.5 rounded-xl bg-[#0b1614] border border-white/10 text-sm text-white placeholder:text-white/35 outline-none focus:border-emerald-500/50"
                    />
                    <select
                      value={messageStatusFilter}
                      onChange={(e) => setMessageStatusFilter(e.target.value as typeof messageStatusFilter)}
                      className="px-3.5 py-2.5 rounded-xl bg-[#0b1614] border border-white/10 text-sm text-white outline-none focus:border-emerald-500/50"
                    >
                      <option value="all">All status</option>
                      <option value="unread">Unread</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                    </select>
                    <select
                      value={messageSort}
                      onChange={(e) => setMessageSort(e.target.value as typeof messageSort)}
                      className="px-3.5 py-2.5 rounded-xl bg-[#0b1614] border border-white/10 text-sm text-white outline-none focus:border-emerald-500/50"
                    >
                      <option value="newest">Newest first</option>
                      <option value="oldest">Oldest first</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-white/8">
                {filteredMessages.length === 0 ? (
                  <div className="px-6 py-16 text-center text-white/45">No messages match your filters.</div>
                ) : (
                  filteredMessages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`px-5 sm:px-6 py-5 transition-colors ${
                        msg.status === 'new' ? 'bg-emerald-500/5' : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span
                              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                msg.status === 'new'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                  : msg.status === 'read'
                                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                  : 'bg-white/10 text-white/70 border-white/15'
                              }`}
                            >
                              {msg.status === 'new' ? 'unread' : msg.status}
                            </span>
                            <span className="text-xs text-white/40">{new Date(msg.createdAt).toLocaleString()}</span>
                          </div>
                          <h4 className="text-base font-semibold">
                            {msg.firstName} {msg.lastName}
                          </h4>
                          <p className="text-sm text-white/60 mt-1">
                            <a href={`mailto:${msg.email}`} className="text-emerald-300 hover:underline">{msg.email}</a>
                            {msg.phone ? (
                              <>
                                {' · '}
                                <a href={`tel:${msg.phone}`} className="text-emerald-300 hover:underline">{msg.phone}</a>
                              </>
                            ) : null}
                          </p>
                          <p className="text-sm text-white/70 mt-2">
                            <span className="text-white/45">Subject:</span> {msg.subject}
                          </p>
                          <p className={`text-sm text-white/75 mt-2 whitespace-pre-wrap ${expandedMessageId === msg._id ? '' : 'line-clamp-2'}`}>
                            {msg.message}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setExpandedMessageId(expandedMessageId === msg._id ? null : msg._id);
                              if (msg.status === 'new') updateMessageStatus(msg._id, 'read');
                            }}
                            className="mt-2 text-xs text-emerald-300 hover:text-emerald-200"
                          >
                            {expandedMessageId === msg._id ? 'Show less' : 'Read full message'}
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2 shrink-0">
                          <select
                            value={msg.status}
                            onChange={(e) => updateMessageStatus(msg._id, e.target.value as ContactMessageItem['status'])}
                            className="px-3 py-2 rounded-lg text-sm bg-[#0b1614] border border-white/10 text-white"
                          >
                            <option value="new">Unread</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                          </select>
                          <a
                            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                            className="px-3 py-2 rounded-lg text-sm bg-[#12433f] hover:bg-[#16524d] text-white font-medium"
                          >
                            Reply
                          </a>
                          <button
                            type="button"
                            onClick={() => deleteMessage(msg._id)}
                            className="px-3 py-2 rounded-lg text-sm bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {/* Leads */}
          {activeTab === 'leads' && (
            <section className="rounded-2xl border border-white/10 bg-[#122421] overflow-hidden">
              <div className="px-5 sm:px-6 py-5 border-b border-white/10">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">Newsletter Leads</h3>
                    <p className="text-sm text-white/50 mt-1">
                      {filteredLeads.length} shown · {newLeadsCount} new · {leads.length} total
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto lg:min-w-[26rem]">
                    <input
                      type="search"
                      value={leadSearch}
                      onChange={(e) => setLeadSearch(e.target.value)}
                      placeholder="Search email or source..."
                      className="px-3.5 py-2.5 rounded-xl bg-[#0b1614] border border-white/10 text-sm text-white placeholder:text-white/35 outline-none focus:border-emerald-500/50"
                    />
                    <select
                      value={leadStatusFilter}
                      onChange={(e) => setLeadStatusFilter(e.target.value as typeof leadStatusFilter)}
                      className="px-3.5 py-2.5 rounded-xl bg-[#0b1614] border border-white/10 text-sm text-white outline-none focus:border-emerald-500/50"
                    >
                      <option value="all">All status</option>
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-white/[0.03]">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white/60 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white/60 uppercase tracking-wider">Source</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white/60 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white/60 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white/60 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/8">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-white/45">No leads match your filters.</td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => (
                        <tr key={lead._id} className="hover:bg-white/[0.03]">
                          <td className="px-6 py-4">
                            <a href={`mailto:${lead.email}`} className="text-emerald-300 hover:underline font-medium">
                              {lead.email}
                            </a>
                          </td>
                          <td className="px-6 py-4 text-sm text-white/70 capitalize">{lead.source}</td>
                          <td className="px-6 py-4">
                            <select
                              value={lead.status}
                              onChange={(e) => updateLeadStatus(lead._id, e.target.value as NewsletterLeadItem['status'])}
                              className="px-3 py-2 rounded-lg text-sm bg-[#0b1614] border border-white/10 text-white"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-sm text-white/45">{new Date(lead.createdAt).toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <button
                              type="button"
                              onClick={() => deleteLead(lead._id)}
                              className="px-3 py-2 rounded-lg text-sm bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Free Trial Enrollment */}
          {activeTab === 'trials' && (
            <section className="rounded-2xl border border-white/10 bg-[#122421] overflow-hidden">
              <div className="px-5 sm:px-6 py-5 border-b border-white/10">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">Free Trial Enrollment</h3>
                    <p className="text-sm text-white/50 mt-1">
                      {filteredTrialLeads.length} shown · {newTrialCount} new · {trialLeads.length} total
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto lg:min-w-[34rem]">
                    <input
                      type="search"
                      value={trialSearch}
                      onChange={(e) => setTrialSearch(e.target.value)}
                      placeholder="Search name, phone, course..."
                      className="px-3.5 py-2.5 rounded-xl bg-[#0b1614] border border-white/10 text-sm text-white placeholder:text-white/35 outline-none focus:border-emerald-500/50"
                    />
                    <select
                      value={trialStatusFilter}
                      onChange={(e) => setTrialStatusFilter(e.target.value as typeof trialStatusFilter)}
                      className="px-3.5 py-2.5 rounded-xl bg-[#0b1614] border border-white/10 text-sm text-white outline-none focus:border-emerald-500/50"
                    >
                      <option value="all">All status</option>
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="closed">Closed</option>
                    </select>
                    <select
                      value={trialSort}
                      onChange={(e) => setTrialSort(e.target.value as typeof trialSort)}
                      className="px-3.5 py-2.5 rounded-xl bg-[#0b1614] border border-white/10 text-sm text-white outline-none focus:border-emerald-500/50"
                    >
                      <option value="newest">Newest first</option>
                      <option value="oldest">Oldest first</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-white/[0.03]">
                    <tr>
                      {['Name', 'Phone', 'Country', 'Course', 'Source', 'Status', 'Date', 'Actions'].map((h) => (
                        <th key={h} className="px-4 sm:px-5 py-4 text-left text-xs font-bold text-white/60 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/8">
                    {filteredTrialLeads.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-white/45">
                          No free trial leads yet.
                        </td>
                      </tr>
                    ) : (
                      filteredTrialLeads.map((lead) => (
                        <tr
                          key={lead._id}
                          className={`hover:bg-white/[0.03] ${lead.status === 'new' ? 'bg-emerald-500/5' : ''}`}
                        >
                          <td className="px-4 sm:px-5 py-4 font-medium whitespace-nowrap">{lead.name}</td>
                          <td className="px-4 sm:px-5 py-4 whitespace-nowrap">
                            <a href={`tel:${lead.phone}`} className="text-emerald-300 hover:underline">
                              {lead.phone}
                            </a>
                          </td>
                          <td className="px-4 sm:px-5 py-4 text-sm text-white/70">{lead.country || '—'}</td>
                          <td className="px-4 sm:px-5 py-4 text-sm text-white/80 max-w-[180px]">
                            <span className="line-clamp-2">{lead.course || '—'}</span>
                          </td>
                          <td className="px-4 sm:px-5 py-4 text-sm text-white/60">{lead.source || '—'}</td>
                          <td className="px-4 sm:px-5 py-4">
                            <select
                              value={lead.status}
                              onChange={(e) => updateTrialStatus(lead._id, e.target.value as TrialLeadItem['status'])}
                              className="px-3 py-2 rounded-lg text-sm bg-[#0b1614] border border-white/10 text-white"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="scheduled">Scheduled</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>
                          <td className="px-4 sm:px-5 py-4 text-sm text-white/45 whitespace-nowrap">
                            {new Date(lead.createdAt).toLocaleString()}
                          </td>
                          <td className="px-4 sm:px-5 py-4">
                            <div className="flex flex-wrap gap-2">
                              <a
                                href={`https://wa.me/${lead.phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(`Assalamualaikum ${lead.name}, regarding your free Quran trial request.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-2 rounded-lg text-sm bg-[#12433f] hover:bg-[#16524d] text-white font-medium"
                              >
                                WhatsApp
                              </a>
                              <button
                                type="button"
                                onClick={() => deleteTrialLead(lead._id)}
                                className="px-3 py-2 rounded-lg text-sm bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Users */}
          {activeTab === 'users' && (
            <section className="rounded-2xl border border-white/10 bg-[#122421] overflow-hidden">
              <div className="px-5 sm:px-6 py-5 border-b border-white/10">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">User Management</h3>
                    <p className="text-sm text-white/50 mt-1">
                      Showing {filteredUsers.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto lg:min-w-[34rem]">
                    <input
                      type="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search name or email..."
                      className="px-3.5 py-2.5 rounded-xl bg-[#0b1614] border border-white/10 text-sm text-white placeholder:text-white/35 outline-none focus:border-emerald-500/50"
                    />
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl bg-[#0b1614] border border-white/10 text-sm text-white outline-none focus:border-emerald-500/50"
                    >
                      <option value="all">All Roles</option>
                      <option value="student">Students</option>
                      <option value="teacher">Teachers</option>
                      <option value="admin">Admins</option>
                    </select>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl bg-[#0b1614] border border-white/10 text-sm text-white outline-none focus:border-emerald-500/50"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="email">Sort by Email</option>
                      <option value="role">Sort by Role</option>
                      <option value="created">Sort by Date</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-white/[0.03]">
                    <tr>
                      {['Name', 'Email', 'Phone', 'Role', 'Status', 'Courses', 'Joined', 'Actions'].map((h) => (
                        <th key={h} className="px-4 sm:px-5 py-4 text-left text-xs font-bold text-white/60 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/8">
                    {paginatedUsers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-white/45">No users found.</td>
                      </tr>
                    ) : (
                      paginatedUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-white/[0.03]">
                          <td className="px-4 sm:px-5 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-[#12433f] flex items-center justify-center shrink-0">
                                <span className="text-sm font-bold">{user.name.charAt(0).toUpperCase()}</span>
                              </div>
                              <div>
                                <div className="text-sm font-semibold">{user.name}</div>
                                <div className="text-xs text-white/35 font-mono">{user._id.slice(0, 8)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-5 py-4">
                            <a href={`mailto:${user.email}`} className="text-sm text-emerald-300 hover:underline">{user.email}</a>
                          </td>
                          <td className="px-4 sm:px-5 py-4 text-sm text-white/70 whitespace-nowrap">
                            {user.phone || '—'}
                          </td>
                          <td className="px-4 sm:px-5 py-4">
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user._id, e.target.value)}
                              className="px-2.5 py-1.5 rounded-lg text-xs bg-[#0b1614] border border-white/10 text-white"
                            >
                              <option value="student">Student</option>
                              <option value="teacher">Teacher</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-4 sm:px-5 py-4">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${
                              user.isActive
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : 'bg-red-500/20 text-red-300 border-red-500/30'
                            }`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 sm:px-5 py-4 text-sm">{user.enrollments?.length || 0}</td>
                          <td className="px-4 sm:px-5 py-4 text-sm text-white/45 whitespace-nowrap">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 sm:px-5 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedUser(user)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30"
                              >
                                Details
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                                  user.isActive
                                    ? 'bg-red-500/15 text-red-300 border-red-500/30'
                                    : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                }`}
                              >
                                {user.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="px-5 sm:px-6 py-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className="text-sm text-white/45">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Enrollments */}
          {activeTab === 'enrollments' && (
            <section className="rounded-2xl border border-white/10 bg-[#122421] overflow-hidden">
              <div className="px-5 sm:px-6 py-5 border-b border-white/10">
                <h3 className="text-xl font-bold">Enroll Courses</h3>
                <p className="text-sm text-white/50 mt-1">
                  Student enrollment form details by course
                </p>
              </div>
              <div className="p-5 sm:p-6 space-y-5">
                {(() => {
                  type EnrollmentStudent = {
                    _id: string;
                    name: string;
                    email: string;
                    phone?: string;
                    enrolledAt?: string;
                    age?: number;
                    education?: string;
                    enrollPhone?: string;
                    country?: string;
                    notes?: string;
                  };
                  const map: Record<
                    string,
                    { courseId: number; courseTitle: string; students: EnrollmentStudent[] }
                  > = {};
                  users.forEach((u) => {
                    (u.enrollments || []).forEach((e) => {
                      const key = String(e.courseId);
                      if (!map[key]) {
                        map[key] = { courseId: e.courseId, courseTitle: e.courseTitle, students: [] };
                      }
                      map[key].students.push({
                        _id: `${u._id}-${e.courseId}`,
                        name: u.name,
                        email: u.email,
                        phone: u.phone,
                        enrolledAt: e.enrolledAt,
                        age: e.age,
                        education: e.education,
                        enrollPhone: e.phone,
                        country: e.country,
                        notes: e.notes,
                      });
                    });
                  });
                  const list = Object.values(map).sort((a, b) =>
                    a.courseTitle.localeCompare(b.courseTitle)
                  );
                  if (list.length === 0) {
                    return <div className="py-12 text-center text-white/45">No enrollments yet.</div>;
                  }
                  return list.map((course) => (
                    <div key={course.courseId} className="rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 sm:px-5 py-4 bg-white/[0.03] flex items-center justify-between gap-3">
                        <div>
                          <h4 className="font-semibold">{course.courseTitle}</h4>
                          <p className="text-xs text-white/40 mt-0.5">Course ID: {course.courseId}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-emerald-300">{course.students.length}</p>
                          <p className="text-xs text-white/40">enrolled</p>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead className="bg-white/[0.02]">
                            <tr>
                              {['Student', 'Age', 'Education', 'Phone', 'Country', 'Notes', 'Date'].map(
                                (h) => (
                                  <th
                                    key={h}
                                    className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white/50"
                                  >
                                    {h}
                                  </th>
                                )
                              )}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/8">
                            {course.students.map((s) => (
                              <tr key={s._id} className="hover:bg-white/[0.03]">
                                <td className="px-4 py-3.5">
                                  <p className="font-medium">{s.name}</p>
                                  <p className="text-sm text-white/50">{s.email}</p>
                                </td>
                                <td className="px-4 py-3.5 text-sm text-white/80">
                                  {s.age ?? '—'}
                                </td>
                                <td className="px-4 py-3.5 text-sm text-white/80 max-w-[160px]">
                                  <span className="line-clamp-2">{s.education || '—'}</span>
                                </td>
                                <td className="px-4 py-3.5 text-sm whitespace-nowrap">
                                  {s.enrollPhone || s.phone ? (
                                    <a
                                      href={`tel:${s.enrollPhone || s.phone}`}
                                      className="text-emerald-300 hover:underline"
                                    >
                                      {s.enrollPhone || s.phone}
                                    </a>
                                  ) : (
                                    '—'
                                  )}
                                </td>
                                <td className="px-4 py-3.5 text-sm text-white/70">
                                  {s.country || '—'}
                                </td>
                                <td className="px-4 py-3.5 text-sm text-white/60 max-w-[180px]">
                                  <span className="line-clamp-2">{s.notes || '—'}</span>
                                </td>
                                <td className="px-4 py-3.5 text-xs text-white/40 whitespace-nowrap">
                                  {s.enrolledAt
                                    ? new Date(s.enrolledAt).toLocaleDateString()
                                    : '—'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </section>
          )}
        </main>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setSelectedUser(null)}>
          <div
            className="w-full max-w-2xl bg-[#122421] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">User Details</h3>
                <p className="text-sm text-white/45 mt-0.5">{selectedUser.email}</p>
              </div>
              <button type="button" onClick={() => setSelectedUser(null)} className="px-3 py-1.5 rounded-lg text-sm bg-white/5 border border-white/10">
                Close
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ['Full Name', selectedUser.name],
                ['Email', selectedUser.email],
                ['Phone', selectedUser.phone || '—'],
                ['Address', selectedUser.address || '—'],
                ['Date of Birth', selectedUser.dateOfBirth ? new Date(selectedUser.dateOfBirth).toLocaleDateString() : '—'],
                ['Role', selectedUser.role],
                ['Account Status', selectedUser.isActive ? 'Active' : 'Inactive'],
                ['Email Verified', selectedUser.isEmailVerified ? 'Yes' : 'No'],
                ['Courses Enrolled', String(selectedUser.enrollments?.length || 0)],
                ['Joined', new Date(selectedUser.createdAt).toLocaleString()],
                ['Last Login', selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : '—'],
                ['User ID', selectedUser._id],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-[#0b1614] border border-white/10 p-4">
                  <p className="text-xs uppercase tracking-wide text-white/40 mb-1">{label}</p>
                  <p className="text-sm text-white break-words font-medium">{value}</p>
                </div>
              ))}
            </div>

            {(selectedUser.enrollments?.length || 0) > 0 && (
              <div className="px-6 pb-6">
                <h4 className="text-sm font-bold uppercase tracking-wide text-white/50 mb-3">
                  Enrollment Details
                </h4>
                <div className="space-y-3">
                  {selectedUser.enrollments?.map((e) => (
                    <div
                      key={`${e.courseId}-${e.enrolledAt}`}
                      className="rounded-xl bg-[#0b1614] border border-white/10 p-4"
                    >
                      <p className="font-semibold text-emerald-300">{e.courseTitle}</p>
                      <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-white/70">
                        <p>Age: {e.age ?? '—'}</p>
                        <p>Education: {e.education || '—'}</p>
                        <p>Phone: {e.phone || selectedUser.phone || '—'}</p>
                        <p>Country: {e.country || '—'}</p>
                      </div>
                      {e.notes && (
                        <p className="mt-2 text-sm text-white/55">Notes: {e.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
