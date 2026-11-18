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

export default function EnrollButton({
  courseId,
  courseTitle = '',
  className = '',
  variant = 'primary',
}: EnrollButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const titleId = useId();

  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    age: '',
    education: EDUCATION_OPTIONS[0],
    phone: '',
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
    if (!session) {
      router.push('/auth/signin');
      return;
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = Number(formData.age);
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
      const res = await fetch('/api/users/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          age: ageNum,
          education: formData.education.trim(),
          phone: formData.phone.trim(),
          country: formData.country.trim(),
          notes: formData.notes.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setEnrolled(true);
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
            backdropFilter: 'blur(6px)',
            transition: 'background 220ms ease',
          }}
          onClick={handleClose}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#d7e0de] bg-white shadow-2xl"
            style={{
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.98)',
              opacity: isVisible ? 1 : 0,
              transition: 'transform 220ms ease, opacity 220ms ease',
            }}
          >
            <div className="bg-[#12433f] px-5 py-5 text-white sm:px-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-200/80">
                    Course Enrollment
                  </p>
                  <h3 id={titleId} className="mt-1 text-xl font-bold sm:text-2xl">
                    Student Details
                  </h3>
                  <p className="mt-1 text-sm text-white/70">
                    {courseTitle || 'Complete the form to continue to payment'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1.5 text-sm hover:bg-white/15"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5 sm:px-6 sm:py-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-gray-700">Age *</span>
                  <input
                    type="number"
                    name="age"
                    min={3}
                    max={100}
                    required
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="e.g. 16"
                    className="w-full rounded-xl border border-gray-200 bg-[#f7faf9] px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-[#12433f]"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-gray-700">Education *</span>
                  <select
                    name="education"
                    required
                    value={formData.education}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-[#f7faf9] px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-[#12433f]"
                  >
                    {EDUCATION_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-gray-700">Phone</span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+92 300 1234567"
                    className="w-full rounded-xl border border-gray-200 bg-[#f7faf9] px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-[#12433f]"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-gray-700">Country</span>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-[#f7faf9] px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-[#12433f]"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Notes / preferred time
                </span>
                <textarea
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any schedule preference or message for our team"
                  className="w-full resize-none rounded-xl border border-gray-200 bg-[#f7faf9] px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-[#12433f]"
                />
              </label>

              {errorMessage && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                  {errorMessage}
                </p>
              )}

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
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
                  className="rounded-xl bg-[#12433f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0f3835] disabled:opacity-70"
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
