'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import './admin-ui.css';

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

interface CourseEnrollmentItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  education: string;
  country: string;
  notes: string;
  courseId: number;
  courseTitle: string;
  source: 'guest' | 'logged_in';
  status: 'new' | 'contacted' | 'confirmed' | 'closed';
  createdAt: string;
}

type TabKey = 'overview' | 'messages' | 'leads' | 'trials' | 'users' | 'enrollments';

const BRAND = '#12433f';
const GOLD = '#ae9143';

function monthKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function monthLabel(date: Date) {
  return date.toLocaleString('en', { month: 'short' });
}

function Donut({
  value,
  max,
  color,
  label,
}: {
  value: number;
  max: number;
  color: string;
  label: string;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-[88px] w-[88px]">
        <svg viewBox="0 0 88 88" className="h-full w-full -rotate-90">
          <circle cx="44" cy="44" r={r} fill="none" stroke="#e8eeec" strokeWidth="10" />
          <circle
            cx="44"
            cy="44"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-slate-700">{pct}%</span>
        </div>
      </div>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
}

function Sparkline({ points, color }: { points: number[]; color: string }) {
  const max = Math.max(...points, 1);
  const w = 120;
  const h = 36;
  const path = points
    .map((p, i) => {
      const x = (i / Math.max(points.length - 1, 1)) * w;
      const y = h - (p / max) * (h - 4) - 2;
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-9 w-[120px]">
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BarChart({ series }: { series: Array<{ label: string; messages: number; trials: number; leads: number }> }) {
  const max = Math.max(...series.flatMap((s) => [s.messages, s.trials, s.leads]), 1);
  const barMax = 140;

  return (
    <div className="mt-4 flex items-end justify-between gap-3 px-1 pt-2">
      {series.map((s) => (
        <div key={s.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-[150px] items-end justify-center gap-1.5">
            {[
              { v: s.messages, c: BRAND },
              { v: s.trials, c: GOLD },
              { v: s.leads, c: '#3d8b7a' },
            ].map((b, i) => (
              <div
                key={i}
                className="w-3 rounded-t-md sm:w-3.5"
                style={{
                  height: `${Math.max((b.v / max) * barMax, b.v > 0 ? 8 : 3)}px`,
                  background: b.c,
                  opacity: b.v > 0 ? 1 : 0.25,
                }}
                title={String(b.v)}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-slate-500">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [leads, setLeads] = useState<NewsletterLeadItem[]>([]);
  const [trialLeads, setTrialLeads] = useState<TrialLeadItem[]>([]);
  const [courseEnrollments, setCourseEnrollments] = useState<CourseEnrollmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [headerSearch, setHeaderSearch] = useState('');
  const [perfRange, setPerfRange] = useState<'day' | 'month' | 'year'>('month');

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
    fetchCourseEnrollments();
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

  const fetchCourseEnrollments = async () => {
    try {
      const response = await fetch('/api/admin/enrollments', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setCourseEnrollments(data.enrollments || []);
      }
    } catch (error) {
      console.error('Error fetching course enrollments:', error);
    }
  };

  const updateEnrollmentStatus = async (
    id: string,
    nextStatus: CourseEnrollmentItem['status']
  ) => {
    try {
      const response = await fetch('/api/admin/enrollments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      if (response.ok) fetchCourseEnrollments();
    } catch (error) {
      console.error('Error updating enrollment:', error);
    }
  };

  const deleteEnrollment = async (id: string) => {
    if (!confirm('Delete this course enrollment?')) return;
    try {
      const response = await fetch(`/api/admin/enrollments?id=${id}`, { method: 'DELETE' });
      if (response.ok) fetchCourseEnrollments();
    } catch (error) {
      console.error('Error deleting enrollment:', error);
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
  const totalEnrollments = Math.max(
    courseEnrollments.length,
    users.reduce((sum, u) => sum + (u.enrollments?.length || 0), 0)
  );
  const newEnrollmentCount = courseEnrollments.filter((e) => e.status === 'new').length;
  const repliedCount = messages.filter((m) => m.status === 'replied').length;
  const readCount = messages.filter((m) => m.status === 'read').length;

  const chartSeries = useMemo(() => {
    const now = new Date();
    const months = [2, 1, 0].map((offset) => {
      const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      const key = monthKey(d);
      const inMonth = (iso: string) => monthKey(new Date(iso)) === key;
      return {
        label: monthLabel(d),
        messages: messages.filter((m) => inMonth(m.createdAt)).length,
        trials: trialLeads.filter((t) => inMonth(t.createdAt)).length,
        leads: leads.filter((l) => inMonth(l.createdAt)).length,
      };
    });
    return months;
  }, [messages, trialLeads, leads]);

  const activitySpark = useMemo(() => {
    const now = new Date();
    return [5, 4, 3, 2, 1, 0].map((offset) => {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset);
      const key = d.toDateString();
      return (
        messages.filter((m) => new Date(m.createdAt).toDateString() === key).length +
        trialLeads.filter((t) => new Date(t.createdAt).toDateString() === key).length +
        leads.filter((l) => new Date(l.createdAt).toDateString() === key).length
      );
    });
  }, [messages, trialLeads, leads]);

  const enrollSpark = useMemo(() => {
    const now = new Date();
    return [5, 4, 3, 2, 1, 0].map((offset) => {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset);
      const key = d.toDateString();
      let count = 0;
      users.forEach((u) => {
        (u.enrollments || []).forEach((e) => {
          if (new Date(e.enrolledAt).toDateString() === key) count += 1;
        });
      });
      return count;
    });
  }, [users]);

  const wavePoints = useMemo(() => {
    const base = [messages.length, trialLeads.length, leads.length, totalEnrollments, users.length, unreadCount];
    const scaled = base.map((n) => Math.max(n, 1));
    if (perfRange === 'day') return activitySpark.map((n) => n + 1);
    if (perfRange === 'year') return scaled.map((n) => n * 1.4);
    return scaled;
  }, [messages.length, trialLeads.length, leads.length, totalEnrollments, users.length, unreadCount, perfRange, activitySpark]);

  const recentMessages = [...messages]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);
  const recentTrials = [...trialLeads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

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
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const navItems: Array<{ key: TabKey; label: string; badge?: number }> = [
    { key: 'overview', label: 'Dashboard' },
    { key: 'messages', label: 'Messages', badge: unreadCount },
    { key: 'leads', label: 'Newsletter', badge: newLeadsCount },
    { key: 'trials', label: 'Free Trial', badge: newTrialCount },
    { key: 'users', label: 'Users' },
    { key: 'enrollments', label: 'Enrollments', badge: newEnrollmentCount },
  ];

  const navIcons: Record<TabKey, React.ReactNode> = {
    overview: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 10.5V20h6v-9.5H4zm10 4V20h6v-5.5h-6zM4 4v4.5h6V4H4zm10 0v8.5h6V4h-6z" />
      </svg>
    ),
    messages: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    leads: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
      </svg>
    ),
    trials: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    users: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m6-4a3 3 0 11-6 0 3 3 0 016 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    enrollments: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  };

  const selectTab = (tab: TabKey) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const adminInitials = (session?.user?.name || session?.user?.email || 'AD')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (status === 'loading' || loading) {
    return (
      <div className="admin-dashboard flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#12433f]/20 border-t-[#12433f]" />
          <p className="text-sm text-[var(--ad-muted)]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session || !session.user || (session.user as { role: string }).role !== 'admin') {
    return null;
  }

  const waveMax = Math.max(...wavePoints, 1);
  const wavePath = wavePoints
    .map((p, i) => {
      const x = (i / Math.max(wavePoints.length - 1, 1)) * 320;
      const y = 90 - (p / waveMax) * 70;
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');

  return (
    <div className="admin-dashboard min-h-screen">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-[1px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`ad-sidebar fixed left-0 top-0 z-40 flex h-screen flex-col text-white transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="ad-sidebar-brand">
          <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-white/10 text-sm font-bold text-[var(--ad-gold-soft)]">
            QRS
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d7c08a]">Admin</p>
            <p className="text-sm font-bold leading-tight">Reading System</p>
          </div>
        </div>

        <nav className="ad-nav flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = activeTab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => selectTab(item.key)}
                className={`ad-nav-item ${
                  active ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className={active ? 'text-[var(--ad-gold-soft)]' : 'text-white/60'}>{navIcons[item.key]}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                {!active && typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="ad-badge bg-[var(--ad-gold)] text-[var(--ad-brand)]">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => signOut()}
          className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-white text-sm font-semibold text-[var(--ad-brand)]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
          </svg>
          Logout
        </button>
      </aside>

      <div className="ad-main">
        <header className="ad-topbar">
          <button
            type="button"
            className="ad-icon-btn lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="relative min-w-0 flex-1">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ad-muted)]"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="M20 20l-3-3" />
            </svg>
            <input
              value={headerSearch}
              onChange={(e) => {
                setHeaderSearch(e.target.value);
                if (activeTab === 'messages') setMessageSearch(e.target.value);
                if (activeTab === 'leads') setLeadSearch(e.target.value);
                if (activeTab === 'trials') setTrialSearch(e.target.value);
                if (activeTab === 'users') setSearchTerm(e.target.value);
              }}
              placeholder="Search users, messages, leads..."
              className="ad-search"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => selectTab('messages')}
              className="ad-icon-btn relative"
              aria-label="Notifications"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount + newTrialCount > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--ad-gold)]" />
              )}
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ad-brand)] text-sm font-bold text-white">
              {adminInitials}
            </div>
          </div>
        </header>

        <main className="ad-page">
          {activeTab === 'overview' && (
            <section className="ad-overview">
              <div className="ad-stack">
                <div className="ad-card">
                  <div className="ad-card-body">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="ad-section-title">Analytics</h3>
                        <p className="ad-section-subtitle">Messages, trials & newsletter leads</p>
                      </div>
                      <div className="ad-badge border border-[var(--ad-border)] bg-[#f8faf9] text-[var(--ad-muted)]">
                        Last 3 months
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium text-[var(--ad-muted)]">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[var(--ad-brand)]" /> Messages
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[var(--ad-gold)]" /> Trials
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#3d8b7a]" /> Newsletter
                      </span>
                    </div>
                    <BarChart series={chartSeries} />
                  </div>
                </div>

                <div className="ad-card">
                  <div className="ad-card-body">
                    <h3 className="ad-section-title">Activity overview</h3>
                    <div className="ad-grid-2 mt-4">
                      <div className="ad-soft-box">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="ad-kpi-label">Users</p>
                            <p className="mt-2 text-3xl font-bold text-[var(--ad-text)]">{users.length}</p>
                            <p className="mt-2 text-xs font-semibold text-emerald-600">↑ Active accounts</p>
                          </div>
                          <Sparkline points={activitySpark} color={BRAND} />
                        </div>
                      </div>
                      <div className="ad-soft-box">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="ad-kpi-label">Enrollments</p>
                            <p className="mt-2 text-3xl font-bold text-[var(--ad-text)]">{totalEnrollments}</p>
                            <p className="mt-2 text-xs font-semibold text-[var(--ad-gold)]">↑ Course signups</p>
                          </div>
                          <Sparkline points={enrollSpark} color={GOLD} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ad-card">
                  <div className="ad-card-body">
                    <h3 className="ad-section-title mb-4">Message status</h3>
                    <div className="flex flex-wrap items-center justify-around gap-6">
                      <Donut value={unreadCount} max={Math.max(messages.length, 1)} color={BRAND} label="Unread" />
                      <Donut value={readCount} max={Math.max(messages.length, 1)} color="#3d8b7a" label="Read" />
                      <Donut value={repliedCount} max={Math.max(messages.length, 1)} color={GOLD} label="Replied" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="ad-stack">
                <div className="ad-card">
                  <div className="ad-card-body">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="ad-section-title">Performance</h3>
                      <div className="flex rounded-full bg-[#f1f4f3] p-1">
                        {([
                          ['day', 'Day'],
                          ['month', 'Month'],
                          ['year', 'Year'],
                        ] as const).map(([key, label]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setPerfRange(key)}
                            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                              perfRange === key
                                ? 'bg-[var(--ad-brand)] text-white'
                                : 'text-[var(--ad-muted)] hover:text-[var(--ad-text)]'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {[
                        { label: 'Messages', value: messages.length },
                        { label: 'Trials', value: trialLeads.length },
                        { label: 'Leads', value: leads.length },
                      ].map((kpi) => (
                        <div key={kpi.label} className="ad-soft-box text-center">
                          <p className="ad-kpi-label">{kpi.label}</p>
                          <p className="mt-2 text-xl font-bold text-[var(--ad-text)]">{kpi.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 overflow-hidden rounded-[12px] bg-gradient-to-b from-[#e8f1ef] to-white p-3">
                      <svg viewBox="0 0 320 100" className="h-28 w-full">
                        <path d={`${wavePath} L320,100 L0,100 Z`} fill="rgba(18,67,63,0.12)" />
                        <path d={wavePath} fill="none" stroke={BRAND} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="ad-card">
                  <div className="grid grid-cols-1 divide-y divide-[var(--ad-border)] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                    <div className="ad-card-body">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <h4 className="text-sm font-bold text-[var(--ad-text)]">Recent messages</h4>
                        <button type="button" onClick={() => selectTab('messages')} className="text-xs font-semibold text-[var(--ad-brand)]">
                          View
                        </button>
                      </div>
                      <div className="space-y-3">
                        {recentMessages.length === 0 ? (
                          <p className="text-sm text-[var(--ad-muted)]">No messages yet</p>
                        ) : (
                          recentMessages.map((msg, idx) => (
                            <button
                              key={msg._id}
                              type="button"
                              onClick={() => selectTab('messages')}
                              className="flex w-full items-start gap-3 text-left"
                            >
                              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--ad-brand)]/10 text-[11px] font-bold text-[var(--ad-brand)]">
                                {idx + 1}
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-semibold text-[var(--ad-text)]">
                                  {msg.firstName} {msg.lastName}
                                </span>
                                <span className="block truncate text-xs text-[var(--ad-muted)]">{msg.subject}</span>
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="ad-card-body">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <h4 className="text-sm font-bold text-[var(--ad-text)]">Trial requests</h4>
                        <button type="button" onClick={() => selectTab('trials')} className="text-xs font-semibold text-[var(--ad-brand)]">
                          View
                        </button>
                      </div>
                      <div className="space-y-3">
                        {recentTrials.length === 0 ? (
                          <p className="text-sm text-[var(--ad-muted)]">No trial leads yet</p>
                        ) : (
                          recentTrials.map((lead, idx) => (
                            <button
                              key={lead._id}
                              type="button"
                              onClick={() => selectTab('trials')}
                              className="flex w-full items-start gap-3 text-left"
                            >
                              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--ad-gold)]/15 text-[11px] font-bold text-[#8a6f2e]">
                                {idx + 1}
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-semibold text-[var(--ad-text)]">{lead.name}</span>
                                <span className="block truncate text-xs text-[var(--ad-muted)]">
                                  {lead.course || 'Trial'} · {lead.phone}
                                </span>
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ad-kpi-grid">
                  {[
                    { label: 'Unread', value: unreadCount, tab: 'messages' as TabKey },
                    { label: 'New trials', value: newTrialCount, tab: 'trials' as TabKey },
                    { label: 'New leads', value: newLeadsCount, tab: 'leads' as TabKey },
                    { label: 'Enrollments', value: totalEnrollments, tab: 'enrollments' as TabKey },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => selectTab(item.tab)}
                      className="ad-kpi transition hover:border-[var(--ad-brand)]/30"
                    >
                      <p className="ad-kpi-label">{item.label}</p>
                      <p className="ad-kpi-value">{item.value}</p>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Messages */}
          {activeTab === 'messages' && (
            <section className="ad-card">
              <div className="ad-card-header">
                <div>
                  <h3 className="ad-card-title">Contact Messages</h3>
                  <p className="ad-card-subtitle">
                    {filteredMessages.length} shown · {unreadCount} unread · {messages.length} total
                  </p>
                </div>
                <div className="ad-filters cols-3">
                  <input
                    type="search"
                    value={messageSearch}
                    onChange={(e) => setMessageSearch(e.target.value)}
                    placeholder="Search name, email, subject..."
                    className="ad-input"
                  />
                  <select
                    value={messageStatusFilter}
                    onChange={(e) => setMessageStatusFilter(e.target.value as typeof messageStatusFilter)}
                    className="ad-select"
                  >
                    <option value="all">All status</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                  </select>
                  <select
                    value={messageSort}
                    onChange={(e) => setMessageSort(e.target.value as typeof messageSort)}
                    className="ad-select"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                  </select>
                </div>
              </div>

              <div>
                {filteredMessages.length === 0 ? (
                  <div className="ad-empty">No messages match your filters.</div>
                ) : (
                  filteredMessages.map((msg) => (
                    <div key={msg._id} className={`ad-list-row ${msg.status === 'new' ? 'bg-emerald-50/50' : ''}`}>
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                                msg.status === 'new'
                                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                  : msg.status === 'read'
                                  ? 'border-sky-200 bg-sky-50 text-sky-700'
                                  : 'border-slate-200 bg-slate-50 text-slate-600'
                              }`}
                            >
                              {msg.status === 'new' ? 'unread' : msg.status}
                            </span>
                            <span className="text-xs text-slate-400">{new Date(msg.createdAt).toLocaleString()}</span>
                          </div>
                          <h4 className="text-base font-semibold text-slate-800">
                            {msg.firstName} {msg.lastName}
                          </h4>
                          <p className="mt-1 text-sm text-slate-500">
                            <a href={`mailto:${msg.email}`} className="text-[#12433f] hover:underline">
                              {msg.email}
                            </a>
                            {msg.phone ? (
                              <>
                                {' · '}
                                <a href={`tel:${msg.phone}`} className="text-[#12433f] hover:underline">
                                  {msg.phone}
                                </a>
                              </>
                            ) : null}
                          </p>
                          <p className="mt-2 text-sm text-slate-600">
                            <span className="text-slate-400">Subject:</span> {msg.subject}
                          </p>
                          <p className={`mt-2 text-sm text-slate-600 ${expandedMessageId === msg._id ? '' : 'line-clamp-2'}`}>
                            {msg.message}
                          </p>
                          {msg.message.length > 120 && (
                            <button
                              type="button"
                              onClick={() => setExpandedMessageId(expandedMessageId === msg._id ? null : msg._id)}
                              className="mt-1 text-xs font-semibold text-[#12433f]"
                            >
                              {expandedMessageId === msg._id ? 'Show less' : 'Read more'}
                            </button>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <select
                            value={msg.status}
                            onChange={(e) => updateMessageStatus(msg._id, e.target.value as ContactMessageItem['status'])}
                            className="ad-select"
                          >
                            <option value="new">Unread</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => deleteMessage(msg._id)}
                            className="ad-btn ad-btn-danger"
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

          {/* Newsletter Leads */}
          {activeTab === 'leads' && (
            <section className="ad-card">
              <div className="ad-card-header">
                <div>
                  <h3 className="ad-card-title">Newsletter Leads</h3>
                  <p className="ad-card-subtitle">
                    {filteredLeads.length} shown · {newLeadsCount} new · {leads.length} total
                  </p>
                </div>
                <div className="ad-filters cols-2">
                  <input
                    type="search"
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    placeholder="Search email or source..."
                    className="ad-input"
                  />
                  <select
                    value={leadStatusFilter}
                    onChange={(e) => setLeadStatusFilter(e.target.value as typeof leadStatusFilter)}
                    className="ad-select"
                  >
                    <option value="all">All status</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                  </select>
                </div>
              </div>

              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead>
                    <tr>
                      {['Email', 'Source', 'Status', 'Date', 'Actions'].map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="ad-empty">
                          No newsletter leads yet.
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => (
                        <tr key={lead._id} className={lead.status === 'new' ? 'bg-amber-50/40' : ''}>
                          <td className="px-5 py-4 text-sm font-medium text-slate-800">{lead.email}</td>
                          <td className="px-5 py-4 text-sm text-slate-500">{lead.source || '—'}</td>
                          <td className="px-5 py-4">
                            <select
                              value={lead.status}
                              onChange={(e) => updateLeadStatus(lead._id, e.target.value as NewsletterLeadItem['status'])}
                              className="ad-select"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                            </select>
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-400">
                            {new Date(lead.createdAt).toLocaleString()}
                          </td>
                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() => deleteLead(lead._id)}
                              className="ad-btn ad-btn-danger"
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

          {/* Free Trial */}
          {activeTab === 'trials' && (
            <section className="ad-card">
              <div className="ad-card-header">
                <div>
                  <h3 className="ad-card-title">Free Trial Enrollment</h3>
                  <p className="ad-card-subtitle">
                    {filteredTrialLeads.length} shown · {newTrialCount} new · {trialLeads.length} total
                  </p>
                </div>
                <div className="ad-filters cols-3">
                  <input
                    type="search"
                    value={trialSearch}
                    onChange={(e) => setTrialSearch(e.target.value)}
                    placeholder="Search name, phone, course..."
                    className="ad-input"
                  />
                  <select
                    value={trialStatusFilter}
                    onChange={(e) => setTrialStatusFilter(e.target.value as typeof trialStatusFilter)}
                    className="ad-select"
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
                    className="ad-select"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                  </select>
                </div>
              </div>

              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead>
                    <tr>
                      {['Name', 'Phone', 'Country', 'Course', 'Source', 'Status', 'Date', 'Actions'].map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTrialLeads.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="ad-empty">
                          No free trial leads yet.
                        </td>
                      </tr>
                    ) : (
                      filteredTrialLeads.map((lead) => (
                        <tr key={lead._id} className={lead.status === 'new' ? 'bg-emerald-50/40' : ''}>
                          <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-800 sm:px-5">{lead.name}</td>
                          <td className="whitespace-nowrap px-4 py-4 sm:px-5">
                            <a href={`tel:${lead.phone}`} className="text-[#12433f] hover:underline">
                              {lead.phone}
                            </a>
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-500 sm:px-5">{lead.country || '—'}</td>
                          <td className="max-w-[160px] px-4 py-4 text-sm text-slate-600 sm:px-5">
                            <span className="line-clamp-2">{lead.course || '—'}</span>
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-500 sm:px-5">{lead.source || '—'}</td>
                          <td className="px-4 py-4 sm:px-5">
                            <select
                              value={lead.status}
                              onChange={(e) => updateTrialStatus(lead._id, e.target.value as TrialLeadItem['status'])}
                              className="ad-select"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="scheduled">Scheduled</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-400 sm:px-5">
                            {new Date(lead.createdAt).toLocaleString()}
                          </td>
                          <td className="px-4 py-4 sm:px-5">
                            <div className="flex flex-wrap gap-2">
                              <a
                                href={`https://wa.me/${lead.phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
                                  `Assalamualaikum ${lead.name}, regarding your free Quran trial request.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ad-btn ad-btn-primary"
                              >
                                WhatsApp
                              </a>
                              <button
                                type="button"
                                onClick={() => deleteTrialLead(lead._id)}
                                className="ad-btn ad-btn-danger"
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
            <section className="ad-card">
              <div className="ad-card-header">
                <div>
                  <h3 className="ad-card-title">Users</h3>
                  <p className="ad-card-subtitle">{filteredUsers.length} users</p>
                </div>
                <div className="ad-filters cols-3">
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search name or email..."
                    className="ad-input"
                  />
                  <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="ad-select">
                    <option value="all">All roles</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="ad-select">
                    <option value="name">Sort by name</option>
                    <option value="email">Sort by email</option>
                    <option value="role">Sort by role</option>
                    <option value="created">Newest first</option>
                  </select>
                </div>
              </div>

              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead>
                    <tr>
                      {['User', 'Role', 'Status', 'Enrollments', 'Joined', 'Actions'].map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((user) => (
                      <tr key={user._id}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#12433f]/10 text-xs font-bold text-[#12433f]">
                              {user.name
                                .split(' ')
                                .map((p) => p[0])
                                .join('')
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{user.name}</p>
                              <p className="text-sm text-slate-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            className="ad-select"
                          >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              user.isActive
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {user.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">{user.enrollments?.length || 0}</td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => setSelectedUser(user)}
                            className="ad-btn ad-btn-primary"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="ad-pagination">
                  <p className="text-sm text-[var(--ad-muted)]">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="ad-btn ad-btn-ghost disabled:opacity-40"
                    >
                      Prev
                    </button>
                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="ad-btn ad-btn-ghost disabled:opacity-40"
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
            <section className="ad-card">
              <div className="ad-card-header">
                <div>
                  <h3 className="ad-card-title">Enroll Courses</h3>
                  <p className="ad-card-subtitle">
                    {courseEnrollments.length} total · {newEnrollmentCount} new · form submissions
                  </p>
                </div>
              </div>
              <div className="ad-stack ad-card-body">
                {(() => {
                  const map: Record<
                    string,
                    { courseId: number; courseTitle: string; students: CourseEnrollmentItem[] }
                  > = {};
                  courseEnrollments.forEach((e) => {
                    const key = String(e.courseId);
                    if (!map[key]) {
                      map[key] = { courseId: e.courseId, courseTitle: e.courseTitle, students: [] };
                    }
                    map[key].students.push(e);
                  });
                  const list = Object.values(map).sort((a, b) =>
                    a.courseTitle.localeCompare(b.courseTitle)
                  );
                  if (list.length === 0) {
                    return <div className="ad-empty">No enrollments yet.</div>;
                  }
                  return list.map((course) => (
                    <div key={course.courseId} className="overflow-hidden rounded-[16px] border border-[var(--ad-border)]">
                      <div className="flex items-center justify-between gap-4 bg-[#f8faf9] px-4 py-4">
                        <div>
                          <h4 className="font-semibold text-[var(--ad-text)]">{course.courseTitle}</h4>
                          <p className="mt-1 text-xs text-[var(--ad-muted)]">Course ID: {course.courseId}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-[var(--ad-brand)]">{course.students.length}</p>
                          <p className="text-xs text-[var(--ad-muted)]">enrolled</p>
                        </div>
                      </div>
                      <div className="ad-table-wrap">
                        <table className="ad-table">
                          <thead>
                            <tr>
                              {[
                                'Student',
                                'Age',
                                'Education',
                                'Phone',
                                'Country',
                                'Source',
                                'Status',
                                'Notes',
                                'Date',
                                'Actions',
                              ].map((h) => (
                                <th key={h}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {course.students.map((s) => (
                              <tr key={s._id} className={s.status === 'new' ? 'bg-emerald-50/40' : ''}>
                                <td className="px-4 py-3.5">
                                  <p className="font-medium text-slate-800">{s.name}</p>
                                  <a
                                    href={`mailto:${s.email}`}
                                    className="text-sm text-[#12433f] hover:underline"
                                  >
                                    {s.email}
                                  </a>
                                </td>
                                <td className="px-4 py-3.5 text-sm text-slate-600">{s.age ?? '—'}</td>
                                <td className="max-w-[140px] px-4 py-3.5 text-sm text-slate-600">
                                  <span className="line-clamp-2">{s.education || '—'}</span>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3.5 text-sm">
                                  {s.phone && s.phone !== 'N/A' ? (
                                    <a href={`tel:${s.phone}`} className="text-[#12433f] hover:underline">
                                      {s.phone}
                                    </a>
                                  ) : (
                                    '—'
                                  )}
                                </td>
                                <td className="px-4 py-3.5 text-sm text-slate-500">{s.country || '—'}</td>
                                <td className="px-4 py-3.5">
                                  <span
                                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                      s.source === 'guest'
                                        ? 'bg-amber-50 text-amber-700'
                                        : 'bg-sky-50 text-sky-700'
                                    }`}
                                  >
                                    {s.source === 'guest' ? 'Guest' : 'Logged in'}
                                  </span>
                                </td>
                                <td className="px-4 py-3.5">
                                  <select
                                    value={s.status}
                                    onChange={(e) =>
                                      updateEnrollmentStatus(
                                        s._id,
                                        e.target.value as CourseEnrollmentItem['status']
                                      )
                                    }
                                    className="ad-select"
                                  >
                                    <option value="new">New</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="closed">Closed</option>
                                  </select>
                                </td>
                                <td className="max-w-[160px] px-4 py-3.5 text-sm text-slate-500">
                                  <span className="line-clamp-2">{s.notes || '—'}</span>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-400">
                                  {new Date(s.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3.5">
                                  <button
                                    type="button"
                                    onClick={() => deleteEnrollment(s._id)}
                                    className="ad-btn ad-btn-danger"
                                  >
                                    Delete
                                  </button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={() => setSelectedUser(null)}>
          <div
            className="ad-card max-h-[90vh] w-full max-w-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-[var(--ad-border)] px-6 py-4">
              <div>
                <h3 className="ad-card-title">User Details</h3>
                <p className="ad-card-subtitle">{selectedUser.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="ad-btn ad-btn-ghost"
              >
                Close
              </button>
            </div>
            <div className="ad-grid-2 p-6">
              {[
                ['Full Name', selectedUser.name],
                ['Email', selectedUser.email],
                ['Phone', selectedUser.phone || '—'],
                ['Address', selectedUser.address || '—'],
                [
                  'Date of Birth',
                  selectedUser.dateOfBirth ? new Date(selectedUser.dateOfBirth).toLocaleDateString() : '—',
                ],
                ['Role', selectedUser.role],
                ['Account Status', selectedUser.isActive ? 'Active' : 'Inactive'],
                ['Email Verified', selectedUser.isEmailVerified ? 'Yes' : 'No'],
                ['Courses Enrolled', String(selectedUser.enrollments?.length || 0)],
                ['Joined', new Date(selectedUser.createdAt).toLocaleString()],
                ['Last Login', selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : '—'],
                ['User ID', selectedUser._id],
              ].map(([label, value]) => (
                <div key={label} className="ad-soft-box">
                  <p className="ad-kpi-label mb-2">{label}</p>
                  <p className="break-words text-sm font-medium text-[var(--ad-text)]">{value}</p>
                </div>
              ))}
            </div>

            {(selectedUser.enrollments?.length || 0) > 0 && (
              <div className="px-6 pb-6">
                <h4 className="ad-kpi-label mb-3">Enrollment Details</h4>
                <div className="ad-stack">
                  {selectedUser.enrollments?.map((e) => (
                    <div key={`${e.courseId}-${e.enrolledAt}`} className="ad-soft-box">
                      <p className="font-semibold text-[var(--ad-brand)]">{e.courseTitle}</p>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-[var(--ad-muted)] sm:grid-cols-4">
                        <p>Age: {e.age ?? '—'}</p>
                        <p>Education: {e.education || '—'}</p>
                        <p>Phone: {e.phone || selectedUser.phone || '—'}</p>
                        <p>Country: {e.country || '—'}</p>
                      </div>
                      {e.notes && <p className="mt-2 text-sm text-[var(--ad-muted)]">Notes: {e.notes}</p>}
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
