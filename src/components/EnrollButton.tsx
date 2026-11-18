'use client';

import React, { useEffect, useId, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface EnrollButtonProps {
  courseId: number;
  courseTitle?: string;
  className?: string;
  variant?: 'primary' | 'list';
}

const EDUCATION_OPTIONS = [
  'Primary / Elementary',
  'Middle School',
  'High School',
  "Bachelor's Degree",
  "Master's Degree",
  'Doctorate / PhD',
  'Islamic Madrasa / Hifz',
  'Other',
];

const COUNTRIES = [
  'Pakistan', 'United States', 'United Kingdom', 'Canada', 'Australia', 'India',
  'Bangladesh', 'Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Kuwait', 'Bahrain',
  'Oman', 'Malaysia', 'Indonesia', 'Turkey', 'Egypt', 'Nigeria', 'South Africa',
  'Germany', 'France', 'Other',
];

const fieldCss: React.CSSProperties = {
  width: '100%',
  height: '2.85rem',
  padding: '0 0.95rem',
  borderRadius: '0.75rem',
  border: '1px solid #d7e0de',
  background: '#f7faf9',
  color: '#1f2937',
  fontSize: '0.9rem',
  outline: 'none',
};

const labelCss: React.CSSProperties = {
  display: 'block',
  marginBottom: '0.4rem',
  fontSize: '0.82rem',
  fontWeight: 650,
  color: '#334155',
};

export default function EnrollButton({
  courseId,
  courseTitle = '',
  className = '',
  variant = 'primary',
}: EnrollButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const titleId = useId();
  const isLoggedIn = status === 'authenticated' && Boolean(session?.user);

  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    education: EDUCATION_OPTIONS[0],
    country: 'Pakistan',
    notes: '',
  });

  useEffect(() => {
    setMessage('');
  }, [courseId]);

  useEffect(() => {
    const checkEnrollment = async () => {
      if (status !== 'authenticated') return;
      try {
        const res = await fetch('/api/users/enroll', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const isEnrolled = (data.enrollments || []).some(
            (e: { courseId: number }) => e.courseId === courseId
          );
          if (isEnrolled) setEnrolled(true);
        }
      } catch {
        // ignore
      }
    };
    checkEnrollment();
  }, [status, courseId]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const openForm = () => {
    if (status === 'loading') return;
    setErrorMessage('');
    setIsOpen(true);
    requestAnimationFrame(() => setIsVisible(true));
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setIsOpen(false), 220);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getFieldStyle = (name: string): React.CSSProperties => ({
    ...fieldCss,
    border: focusedField === name ? '1px solid #12433f' : '1px solid #d7e0de',
    boxShadow: focusedField === name ? '0 0 0 3px rgba(18,67,63,0.12)' : 'none',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = Number(formData.age);

    if (!isLoggedIn) {
      if (!formData.name.trim() || formData.name.trim().length < 2) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
      if (!formData.phone.trim() || formData.phone.replace(/[^\d]/g, '').length < 7) {
        setErrorMessage('Please enter a valid phone number.');
        return;
      }
    }

    if (!formData.age || Number.isNaN(ageNum) || ageNum < 3 || ageNum > 100) {
      setErrorMessage('Please enter a valid age (3–100).');
      return;
    }
    if (!formData.education.trim()) {
      setErrorMessage('Please select your education.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setMessage('');

    try {
      const payload: Record<string, string | number> = {
        courseId,
        age: ageNum,
        education: formData.education.trim(),
        country: formData.country.trim(),
        notes: formData.notes.trim(),
      };

      if (!isLoggedIn) {
        payload.name = formData.name.trim();
        payload.email = formData.email.trim();
        payload.phone = formData.phone.trim();
      }

      const res = await fetch('/api/course-enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        if (isLoggedIn) setEnrolled(true);
        setMessage(data.message || 'Enrolled successfully');
        handleClose();
        router.push(`/payment-method?course=${encodeURIComponent(courseTitle || String(courseId))}`);
      } else if ((data.message || '').toLowerCase().includes('already')) {
        setEnrolled(true);
        setMessage('Already enrolled');
        handleClose();
      } else {
        setErrorMessage(data.error || 'Failed to enroll');
      }
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const baseClasses =
    variant === 'primary' ? 'btn btn-primary w-full text-center' : 'btn btn-primary';

  return (
    <div className={className}>
      <button
        type="button"
        onClick={openForm}
        disabled={loading || enrolled}
        className={`${baseClasses} ${loading || enrolled ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {enrolled ? 'Enrolled' : loading ? 'Submitting...' : 'Enroll Now'}
      </button>
      {message && <p className="mt-2 text-sm text-emerald-600">{message}</p>}
      {!message && enrolled && (
        <p className="mt-2 text-sm text-emerald-600">
          Team will contact you to schedule live sessions.
        </p>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          style={{
            background: isVisible ? 'rgba(8, 18, 16, 0.72)' : 'rgba(8, 18, 16, 0)',
            backdropFilter: 'blur(7px)',
            transition: 'background 220ms ease',
          }}
          onClick={handleClose}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[34rem] overflow-hidden rounded-[1.35rem] border border-[#d7e0de] bg-white shadow-2xl"
            style={{
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(14px) scale(0.98)',
              opacity: isVisible ? 1 : 0,
              transition: 'transform 220ms ease, opacity 220ms ease',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              className="relative overflow-hidden px-5 py-5 text-white sm:px-6"
              style={{ background: 'linear-gradient(135deg, #12433f 0%, #1a5c55 100%)' }}
            >
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full"
                style={{ background: 'rgba(174,145,67,0.18)' }}
              />
              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f0d78c]">
                    Course Enrollment
                  </p>
                  <h3 id={titleId} className="mt-1 text-xl font-bold sm:text-2xl">
                    Student Details
                  </h3>
                  <p className="mt-1 text-sm text-white/70">
                    {courseTitle || 'Complete details to continue enrollment'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-xl border border-white/20 bg-white/10 px-2.5 py-1.5 text-sm hover:bg-white/15"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6"
            >
              {isLoggedIn ? (
                <div
                  className="rounded-2xl border px-4 py-3"
                  style={{ borderColor: '#d7e0de', background: '#f3f8f6' }}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#12433f]/70">
                    Signed in as
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {session?.user?.name || 'Student'}
                  </p>
                  <p className="text-sm text-slate-500">{session?.user?.email}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Name, email & phone will be taken from your account.
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-800">
                    Not logged in — please share your contact details so we can confirm enrollment.
                  </div>

                  <label className="block">
                    <span style={labelCss}>Full name *</span>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Your full name"
                      style={getFieldStyle('name')}
                    />
                  </label>

                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    <label className="block">
                      <span style={labelCss}>Email *</span>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="you@email.com"
                        style={getFieldStyle('email')}
                      />
                    </label>
                    <label className="block">
                      <span style={labelCss}>Phone number *</span>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="+92 300 1234567"
                        style={getFieldStyle('phone')}
                      />
                    </label>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <label className="block">
                  <span style={labelCss}>Age *</span>
                  <input
                    type="number"
                    name="age"
                    min={3}
                    max={100}
                    required
                    value={formData.age}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('age')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="e.g. 16"
                    style={getFieldStyle('age')}
                  />
                </label>
                <label className="block">
                  <span style={labelCss}>Education *</span>
                  <select
                    name="education"
                    required
                    value={formData.education}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('education')}
                    onBlur={() => setFocusedField(null)}
                    style={getFieldStyle('education')}
                  >
                    {EDUCATION_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span style={labelCss}>Country</span>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('country')}
                  onBlur={() => setFocusedField(null)}
                  style={getFieldStyle('country')}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span style={labelCss}>Notes / preferred time</span>
                <textarea
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('notes')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Any schedule preference or message for our team"
                  style={{
                    ...getFieldStyle('notes'),
                    height: 'auto',
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem',
                    resize: 'none',
                  }}
                />
              </label>

              {errorMessage && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                  {errorMessage}
                </p>
              )}

              <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-70"
                  style={{ background: '#12433f' }}
                >
                  {loading ? 'Submitting...' : 'Continue to Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
