'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';

interface EnrollButtonProps {
  courseId: number;
  courseTitle?: string;
  className?: string;
  variant?: 'primary' | 'list';
}

const EDUCATION_OPTIONS = [
  'Primary / Elementary',
  'Middle School',
  'Matric',
  'Intermediate',
  "Bachelor's",
  "Master's",
  'Other',
];

const COUNTRIES = [
  'Pakistan',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'India',
  'Bangladesh',
  'Saudi Arabia',
  'United Arab Emirates',
  'Qatar',
  'Kuwait',
  'Bahrain',
  'Oman',
  'Malaysia',
  'Indonesia',
  'Turkey',
  'Egypt',
  'Nigeria',
  'South Africa',
  'Germany',
  'France',
  'Other',
];

type FieldErrors = Partial<Record<'name' | 'email' | 'phone' | 'age' | 'education', string>>;

export default function EnrollButton({
  courseId,
  courseTitle = '',
  className = '',
  variant = 'primary',
}: EnrollButtonProps) {
  const { data: session, status } = useSession();
  const titleId = useId();
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const isLoggedIn = status === 'authenticated' && Boolean(session?.user);

  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    education: EDUCATION_OPTIONS[0],
    country: 'Pakistan',
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
      if (event.key === 'Escape' && !loading) handleClose();
    };

    window.addEventListener('keydown', onKeyDown);
    const focusTimer = window.setTimeout(() => firstFieldRef.current?.focus(), 80);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [isOpen, loading]);

  const openForm = () => {
    if (status === 'loading' || enrolled) return;
    setErrorMessage('');
    setFieldErrors({});
    setIsSubmitted(false);
    setIsOpen(true);
    requestAnimationFrame(() => setIsVisible(true));
  };

  const handleClose = () => {
    if (loading) return;
    setIsVisible(false);
    setTimeout(() => {
      setIsOpen(false);
      setIsSubmitted(false);
      setErrorMessage('');
      setFieldErrors({});
    }, 220);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    setErrorMessage('');
  };

  const validate = (): boolean => {
    const next: FieldErrors = {};
    const ageNum = Number(formData.age);

    if (!isLoggedIn) {
      if (!formData.name.trim() || formData.name.trim().length < 2) {
        next.name = 'Please enter your full name.';
      }
      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        next.email = 'Please enter a valid email address.';
      }
      if (!formData.phone.trim() || formData.phone.replace(/[^\d]/g, '').length < 7) {
        next.phone = 'Please enter a valid phone number.';
      }
    }

    if (!formData.age || Number.isNaN(ageNum) || ageNum < 3 || ageNum > 100) {
      next.age = 'Enter a valid age (3–100).';
    }
    if (!formData.education.trim()) {
      next.education = 'Please select your education.';
    }

    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const ageNum = Number(formData.age);
    setLoading(true);
    setErrorMessage('');
    setMessage('');

    try {
      const payload: Record<string, string | number> = {
        courseId,
        age: ageNum,
        education: formData.education.trim(),
        country: formData.country.trim(),
        notes: '',
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
        setMessage(data.message || 'Submitted successfully. Our team will contact you soon.');
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          age: '',
          education: EDUCATION_OPTIONS[0],
          country: 'Pakistan',
        });
      } else if ((data.message || '').toLowerCase().includes('already')) {
        setEnrolled(true);
        setMessage('Already enrolled');
        setIsSubmitted(true);
      } else {
        setErrorMessage(data.error || 'Failed to enroll');
      }
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = (name: string, hasError?: boolean): React.CSSProperties => ({
    boxSizing: 'border-box',
    display: 'block',
    width: '100%',
    maxWidth: '100%',
    height: '48px',
    padding: '0 16px',
    margin: 0,
    borderRadius: '14px',
    border: hasError
      ? '1px solid #fca5a5'
      : focusedField === name
      ? '1px solid #12433f'
      : '1px solid #d9e2df',
    background: '#f7faf9',
    color: '#1f2937',
    fontSize: '15px',
    lineHeight: '48px',
    outline: 'none',
    boxShadow: focusedField === name && !hasError ? '0 0 0 4px rgba(18,67,63,0.12)' : 'none',
    transition: 'border-color 160ms ease, box-shadow 160ms ease',
  });

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#334155',
    letterSpacing: '0.01em',
  };

  const fieldGroupStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    margin: 0,
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
        {enrolled ? 'Enrolled' : 'Enroll Now'}
      </button>
      {message && !isOpen && <p className="mt-2 text-sm text-emerald-600">{message}</p>}
      {!message && enrolled && (
        <p className="mt-2 text-sm text-emerald-600">
          Team will contact you to schedule live sessions.
        </p>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center"
          style={{
            padding: '16px',
            background: isVisible ? 'rgba(8, 18, 16, 0.72)' : 'rgba(8, 18, 16, 0)',
            backdropFilter: 'blur(8px)',
            transition: 'background 220ms ease',
          }}
          onClick={handleClose}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(e) => e.stopPropagation()}
            className="flex w-full flex-col overflow-hidden rounded-[20px] border border-[#d7e0de] bg-white shadow-2xl"
            style={{
              width: '100%',
              maxWidth: '440px',
              maxHeight: 'min(90vh, 820px)',
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(18px) scale(0.98)',
              opacity: isVisible ? 1 : 0,
              transition: 'transform 220ms ease, opacity 220ms ease',
            }}
          >
            {/* Sticky header */}
            <div
              className="shrink-0 text-white"
              style={{
                background: 'linear-gradient(135deg, #12433f 0%, #1a5c55 100%)',
                padding: '20px 24px',
              }}
            >
              <div className="flex items-start justify-between" style={{ gap: '16px' }}>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-[11px] font-semibold uppercase"
                    style={{ letterSpacing: '0.16em', color: '#f0d78c', margin: 0 }}
                  >
                    Course Enrollment
                  </p>
                  <h3
                    id={titleId}
                    className="font-bold leading-tight"
                    style={{ margin: '8px 0 0', fontSize: '22px' }}
                  >
                    Student Details
                  </h3>
                  {courseTitle ? (
                    <p className="truncate text-sm text-white/70" style={{ margin: '8px 0 0' }}>
                      {courseTitle}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  aria-label="Close enrollment form"
                  className="flex shrink-0 items-center justify-center border border-white/20 bg-white/10 text-white transition hover:bg-white/15 disabled:opacity-50"
                  style={{ width: '36px', height: '36px', borderRadius: '12px' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div
              className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden"
              style={{ padding: '24px' }}
            >
              {isSubmitted ? (
                <div className="flex flex-col items-center text-center" style={{ padding: '24px 8px' }}>
                  <div
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: '56px',
                      height: '56px',
                      marginBottom: '16px',
                      background: 'rgba(18,67,63,0.1)',
                      color: '#12433f',
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-slate-800" style={{ margin: 0 }}>
                    Enrollment submitted
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-500" style={{ margin: '12px 0 0', maxWidth: '320px' }}>
                    {message || 'Our team will contact you soon to confirm your course enrollment.'}
                  </p>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-sm font-semibold text-white"
                    style={{
                      marginTop: '24px',
                      height: '44px',
                      padding: '0 24px',
                      borderRadius: '14px',
                      background: '#12433f',
                    }}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form
                  id="course-enrollment-form"
                  onSubmit={handleSubmit}
                  noValidate
                  style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}
                >
                  {isLoggedIn ? (
                    <div
                      style={{
                        borderRadius: '14px',
                        border: '1px solid #d7e0de',
                        background: '#f3f8f6',
                        padding: '16px',
                      }}
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#12433f]/70" style={{ margin: 0 }}>
                        Signed in as
                      </p>
                      <p className="text-sm font-bold text-slate-800" style={{ margin: '8px 0 0' }}>
                        {session?.user?.name || 'Student'}
                      </p>
                      <p className="text-sm text-slate-500" style={{ margin: '4px 0 0' }}>
                        {session?.user?.email}
                      </p>
                      <p className="text-xs text-slate-400" style={{ margin: '8px 0 0' }}>
                        Name, email & phone will be taken from your account.
                      </p>
                    </div>
                  ) : (
                    <div
                      className="text-[13px] leading-relaxed"
                      style={{
                        borderRadius: '14px',
                        border: '1px solid #f5e0a8',
                        background: '#fff8e8',
                        color: '#8a6d1d',
                        padding: '12px 16px',
                      }}
                      role="status"
                    >
                      Not logged in — please share your contact details so we can confirm enrollment.
                    </div>
                  )}

                  {!isLoggedIn && (
                    <>
                      <label style={fieldGroupStyle}>
                        <span style={labelStyle}>Full Name *</span>
                        <input
                          ref={firstFieldRef}
                          type="text"
                          name="name"
                          autoComplete="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Your full name"
                          aria-invalid={Boolean(fieldErrors.name)}
                          style={fieldStyle('name', Boolean(fieldErrors.name))}
                        />
                        {fieldErrors.name && (
                          <p className="text-xs font-medium text-red-600" style={{ margin: '8px 0 0' }}>
                            {fieldErrors.name}
                          </p>
                        )}
                      </label>

                      <label style={fieldGroupStyle}>
                        <span style={labelStyle}>Email *</span>
                        <input
                          type="email"
                          name="email"
                          autoComplete="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="you@email.com"
                          aria-invalid={Boolean(fieldErrors.email)}
                          style={fieldStyle('email', Boolean(fieldErrors.email))}
                        />
                        {fieldErrors.email && (
                          <p className="text-xs font-medium text-red-600" style={{ margin: '8px 0 0' }}>
                            {fieldErrors.email}
                          </p>
                        )}
                      </label>

                      <label style={fieldGroupStyle}>
                        <span style={labelStyle}>Phone Number *</span>
                        <input
                          type="tel"
                          name="phone"
                          autoComplete="tel"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('phone')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="+92 300 1234567"
                          aria-invalid={Boolean(fieldErrors.phone)}
                          style={fieldStyle('phone', Boolean(fieldErrors.phone))}
                        />
                        {fieldErrors.phone && (
                          <p className="text-xs font-medium text-red-600" style={{ margin: '8px 0 0' }}>
                            {fieldErrors.phone}
                          </p>
                        )}
                      </label>
                    </>
                  )}

                  <label style={fieldGroupStyle}>
                    <span style={labelStyle}>Age *</span>
                    <input
                      ref={isLoggedIn ? firstFieldRef : undefined}
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
                      aria-invalid={Boolean(fieldErrors.age)}
                      style={fieldStyle('age', Boolean(fieldErrors.age))}
                    />
                    {fieldErrors.age && (
                      <p className="text-xs font-medium text-red-600" style={{ margin: '8px 0 0' }}>
                        {fieldErrors.age}
                      </p>
                    )}
                  </label>

                  <label style={fieldGroupStyle}>
                    <span style={labelStyle}>Education *</span>
                    <select
                      name="education"
                      required
                      value={formData.education}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('education')}
                      onBlur={() => setFocusedField(null)}
                      aria-invalid={Boolean(fieldErrors.education)}
                      style={fieldStyle('education', Boolean(fieldErrors.education))}
                    >
                      {EDUCATION_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.education && (
                      <p className="text-xs font-medium text-red-600" style={{ margin: '8px 0 0' }}>
                        {fieldErrors.education}
                      </p>
                    )}
                  </label>

                  <label style={fieldGroupStyle}>
                    <span style={labelStyle}>Country</span>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('country')}
                      onBlur={() => setFocusedField(null)}
                      style={fieldStyle('country')}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>

                  {errorMessage && (
                    <p
                      className="text-sm text-red-700"
                      style={{
                        borderRadius: '14px',
                        border: '1px solid #fecaca',
                        background: '#fef2f2',
                        padding: '12px 16px',
                        margin: 0,
                      }}
                      role="alert"
                    >
                      {errorMessage}
                    </p>
                  )}
                </form>
              )}
            </div>

            {/* Sticky footer actions */}
            {!isSubmitted && (
              <div
                className="shrink-0"
                style={{
                  borderTop: '1px solid #e6eeeb',
                  background: '#fff',
                  padding: '16px 24px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                    style={{
                      height: '44px',
                      padding: '0 20px',
                      borderRadius: '14px',
                      border: '1px solid #e2e8f0',
                      background: '#fff',
                      minWidth: '110px',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="course-enrollment-form"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white disabled:opacity-70"
                    style={{
                      height: '44px',
                      padding: '0 20px',
                      borderRadius: '14px',
                      background: '#12433f',
                      minWidth: '160px',
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Enrollment'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
