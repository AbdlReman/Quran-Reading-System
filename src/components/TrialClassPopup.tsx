'use client';

import React, { useEffect, useState } from 'react';
import coursesData from '@/app/data/courses.json';

const STORAGE_KEY = 'qrs_trial_popup_last_shown';
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Pakistan', 'India',
  'Bangladesh', 'Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Kuwait', 'Bahrain',
  'Oman', 'Malaysia', 'Indonesia', 'Turkey', 'Egypt', 'Nigeria', 'South Africa',
  'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Sweden', 'Norway',
  'Denmark', 'Ireland', 'Switzerland', 'Austria', 'Portugal', 'Poland', 'Greece',
  'New Zealand', 'Singapore', 'Morocco', 'Algeria', 'Tunisia', 'Jordan', 'Lebanon',
  'Iraq', 'Yemen', 'Afghanistan', 'Sri Lanka', 'Nepal', 'China', 'Japan', 'South Korea',
  'Brazil', 'Mexico', 'Other'
];

const HEAR_ABOUT_OPTIONS = [
  'Google', 'Facebook', 'Instagram', 'YouTube', 'WhatsApp', 'Friend / Referral', 'Other'
];

const fieldStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 0.9rem',
  borderRadius: '0.7rem',
  border: '1px solid #dce5e3',
  background: '#f8faf9',
  color: '#1f2937',
  fontSize: '0.95rem',
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '0.4rem',
  fontSize: '0.78rem',
  fontWeight: 700,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: '#5f6b69',
};

export default function TrialClassPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    country: 'United States',
    phone: '',
    course: 'Noorani Qaida',
    source: 'Google',
  });

  useEffect(() => {
    try {
      const lastShown = localStorage.getItem(STORAGE_KEY);
      const shouldShow = !lastShown || Date.now() - parseInt(lastShown, 10) > THIRTY_DAYS_MS;

      if (shouldShow) {
        const timer = setTimeout(() => {
          setIsOpen(true);
          requestAnimationFrame(() => setIsVisible(true));
          localStorage.setItem(STORAGE_KEY, Date.now().toString());
        }, 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage unavailable — do not show
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setIsOpen(false), 220);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/trial-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit request');
      }

      setIsSubmitted(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="trial-popup-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: isVisible ? 'rgba(8, 28, 26, 0.72)' : 'rgba(8, 28, 26, 0)',
        backdropFilter: 'blur(4px)',
        transition: 'background 0.25s ease',
      }}
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="trial-popup-title"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '28rem',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '1.25rem',
          background: '#fff',
          boxShadow: '0 24px 60px rgba(18, 67, 63, 0.28)',
          transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.97)',
          opacity: isVisible ? 1 : 0,
          transition: 'transform 0.25s ease, opacity 0.25s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            padding: '1.5rem 1.5rem 1.25rem',
            background: 'linear-gradient(135deg, var(--primary-color) 0%, #0d332f 60%, #1a5c55 100%)',
            color: '#fff',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              right: '-1.5rem',
              top: '-1.5rem',
              width: '7rem',
              height: '7rem',
              borderRadius: '9999px',
              background: 'rgba(174, 145, 67, 0.2)',
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '-1rem',
              bottom: '-2rem',
              width: '5rem',
              height: '5rem',
              borderRadius: '9999px',
              background: 'rgba(255,255,255,0.06)',
            }}
          />

          <button
            onClick={handleClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: '0.85rem',
              right: '0.85rem',
              width: '2rem',
              height: '2rem',
              borderRadius: '9999px',
              border: 'none',
              background: 'rgba(255,255,255,0.12)',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <p
            style={{
              display: 'inline-block',
              margin: '0 0 0.65rem',
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#f5e6b8',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(245,230,184,0.3)',
            }}
          >
            Free Trial Class
          </p>
          <h2
            id="trial-popup-title"
            style={{
              margin: 0,
              fontSize: 'clamp(1.35rem, 4vw, 1.65rem)',
              fontWeight: 800,
              lineHeight: 1.25,
              paddingRight: '1.5rem',
            }}
          >
            Start Your Free Quran Trial
          </h2>
          <p style={{ margin: '0.55rem 0 0', color: 'rgba(255,255,255,0.78)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            One-to-one class with a certified tutor. No payment required.
          </p>
        </div>

        <div style={{ padding: '1.35rem 1.5rem 1.5rem' }}>
          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '1.25rem 0.25rem 0.5rem' }}>
              <div
                style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  margin: '0 auto 1rem',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(18, 67, 63, 0.1)',
                  color: 'var(--primary-color)',
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.35rem', fontWeight: 800, color: '#1f2937' }}>
                Request Received
              </h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.55 }}>
                JazakAllah Khair. Our team will contact you soon to schedule your free trial class.
              </p>
              <button
                onClick={handleClose}
                style={{
                  marginTop: '1.35rem',
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '0.8rem',
                  border: 'none',
                  background: 'var(--primary-color)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: 'flex',
                  gap: '0.55rem',
                  alignItems: 'flex-start',
                  marginBottom: '1.1rem',
                  padding: '0.75rem 0.85rem',
                  borderRadius: '0.75rem',
                  background: 'rgba(18, 67, 63, 0.06)',
                  border: '1px solid rgba(18, 67, 63, 0.08)',
                }}
              >
                <svg width="16" height="16" style={{ marginTop: 2, flexShrink: 0, color: 'var(--primary-color)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#4b5563', lineHeight: 1.45 }}>
                  Your information is secure. We&rsquo;ll only use it to arrange your free class.
                </p>
              </div>

              {errorMessage && (
                <div
                  style={{
                    marginBottom: '1rem',
                    padding: '0.75rem 0.85rem',
                    borderRadius: '0.7rem',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#b91c1c',
                    fontSize: '0.85rem',
                  }}
                >
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div>
                  <label htmlFor="popup-name" style={labelStyle}>Name</label>
                  <input
                    type="text"
                    id="popup-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={fieldStyle}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label htmlFor="popup-country" style={labelStyle}>Country</label>
                    <select
                      id="popup-country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      style={fieldStyle}
                      required
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="popup-phone" style={labelStyle}>Phone</label>
                    <input
                      type="tel"
                      id="popup-phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      style={fieldStyle}
                      placeholder="WhatsApp no."
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="popup-course" style={labelStyle}>Desired Course</label>
                  <select
                    id="popup-course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    style={fieldStyle}
                    required
                  >
                    {coursesData.courses.map((course) => (
                      <option key={course.id} value={course.title}>{course.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="popup-source" style={labelStyle}>How did you hear about us?</label>
                  <select
                    id="popup-source"
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    style={fieldStyle}
                    required
                  >
                    {HEAR_ABOUT_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    marginTop: '0.35rem',
                    width: '100%',
                    padding: '0.9rem 1rem',
                    borderRadius: '0.8rem',
                    border: 'none',
                    background: isSubmitting
                      ? '#9ca3af'
                      : 'linear-gradient(135deg, var(--primary-color) 0%, #1a5c55 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.98rem',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 8px 20px rgba(18, 67, 63, 0.25)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Start Free Trial'}
                  {!isSubmitting && (
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M14 5l7 7-7 7M5 12h16" />
                    </svg>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
