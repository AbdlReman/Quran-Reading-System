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
  enrollments?: Array<{ courseId: number; courseTitle: string; enrolledAt: string }>;
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

type TabKey = 'overview' | 'messages' | 'leads' | 'users' | 'enrollments';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [leads, setLeads] = useState<NewsletterLeadItem[]>([]);
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

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !session.user || (session.user as { role: string }).role !== 'admin') {
      router.push('/auth/signin');
      return;
    }
    fetchUsers();
    fetchMessages();
    fetchLeads();
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

  const navItems: Array<{ key: TabKey; label: string; badge?: number }> = [
    { key: 'overview', label: 'Overview' },
    { key: 'messages', label: 'Messages', badge: unreadCount },
    { key: 'leads', label: 'Leads', badge: newLeadsCount },
    { key: 'users', label: 'Users' },
    { key: 'enrollments', label: 'Enrollments' },
  ];

  const selectTab = (tab: TabKey) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#0b1614] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
      </div>
    );
  }

  if (!session || !session.user || (session.user as { role: string }).role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0b1614] text-white flex">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-[#10201d] border-r border-white/10 flex flex-col transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="px-5 py-6 border-b border-white/10">
          <p className="text-xs uppercase tracking-[0.14em] text-[#ae9143] font-semibold">Admin Panel</p>
          <h1 className="text-xl font-bold mt-1">Quran Reading System</h1>
          <p className="text-sm text-white/50 mt-1 truncate">{session.user.email}</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => selectTab(item.key)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === item.key
                  ? 'bg-[#12433f] text-white'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{item.label}</span>
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span className="min-w-6 h-6 px-1.5 rounded-full bg-[#ae9143] text-[#12433f] text-xs font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => signOut()}
            className="w-full px-4 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 text-sm font-semibold"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 bg-[#0b1614]/90 backdrop-blur border-b border-white/10 px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h2 className="text-lg sm:text-xl font-bold capitalize">{activeTab}</h2>
              <p className="text-xs text-white/45">Manage academy data and inquiries</p>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 space-y-6">
          {activeTab === 'overview' && (
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                { label: 'Total Users', value: users.length },
                { label: 'Unread Messages', value: unreadCount },
                { label: 'New Leads', value: newLeadsCount },
                { label: 'Active Students', value: users.filter((u) => u.role === 'student' && u.isActive).length },
              ].map((card) => (
                <div key={card.label} className="rounded-2xl border border-white/10 bg-[#122421] p-5">
                  <p className="text-sm text-white/50">{card.label}</p>
                  <p className="text-3xl font-bold mt-2 text-white">{card.value}</p>
                </div>
              ))}
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
                <h3 className="text-xl font-bold">Enrollments by Course</h3>
                <p className="text-sm text-white/50 mt-1">Students grouped by enrolled course</p>
              </div>
              <div className="p-5 sm:p-6 space-y-5">
                {(() => {
                  const map: Record<string, { courseId: number; courseTitle: string; students: Array<{ _id: string; name: string; email: string; phone?: string; enrolledAt?: string }> }> = {};
                  users.forEach((u) => {
                    (u.enrollments || []).forEach((e) => {
                      const key = String(e.courseId);
                      if (!map[key]) map[key] = { courseId: e.courseId, courseTitle: e.courseTitle, students: [] };
                      map[key].students.push({ _id: u._id, name: u.name, email: u.email, phone: u.phone, enrolledAt: e.enrolledAt });
                    });
                  });
                  const list = Object.values(map).sort((a, b) => a.courseTitle.localeCompare(b.courseTitle));
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
                      <div className="divide-y divide-white/8">
                        {course.students.map((s) => (
                          <div key={s._id} className="px-4 sm:px-5 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                              <p className="font-medium">{s.name}</p>
                              <p className="text-sm text-white/50">{s.email}</p>
                              {s.phone && <p className="text-sm text-emerald-300 mt-0.5">{s.phone}</p>}
                            </div>
                            {s.enrolledAt && (
                              <p className="text-xs text-white/40">
                                Enrolled {new Date(s.enrolledAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        ))}
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
          </div>
        </div>
      )}
    </div>
  );
}
