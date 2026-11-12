'use client';

import React, { useEffect, useId, useState } from 'react';
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
  'Brazil', 'Mexico', 'Other',
];

const HEAR_ABOUT_OPTIONS = [
  'Google', 'Facebook', 'Instagram', 'YouTube', 'WhatsApp', 'Friend / Referral', 'Other',
];

const BENEFITS = [
  '1-on-1 live session',
  'Certified Quran tutor',
  'No payment required',
];

export default function TrialClassPopup() {
  const titleId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
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
      // localStorage unavailable
    }
  }, []);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      if (!response.ok) throw new Error(data.error || 'Failed to submit request');
      setIsSubmitted(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldStyle = (name: string): React.CSSProperties => ({
    width: '100%',
    height: '2.85rem',
    padding: '0 0.95rem',
    borderRadius: '0.55rem',
    border: focusedField === name ? '1px solid #12433f' : '1px solid #d7e0de',
    background: '#fff',
    color: '#1f2937',
    fontSize: '0.9375rem',
    outline: 'none',
    boxShadow: focusedField === name ? '0 0 0 3px rgba(18, 67, 63, 0.12)' : 'none',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
    appearance: 'none' as const,
  });

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
        background: isVisible ? 'rgba(10, 24, 22, 0.65)' : 'rgba(10, 24, 22, 0)',
        backdropFilter: 'blur(6px)',
        transition: 'background 0.25s ease',
      }}
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="trial-popup-panel"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '52rem',
          maxHeight: '92vh',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '1fr',
          borderRadius: '1rem',
          background: '#fff',
          border: '1px solid rgba(18, 67, 63, 0.08)',
          boxShadow: '0 30px 80px rgba(8, 28, 26, 0.35)',
          transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.98)',
          opacity: isVisible ? 1 : 0,
          transition: 'transform 0.28s ease, opacity 0.28s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="trial-popup-close"
          style={{
            position: 'absolute',
            top: '0.9rem',
            right: '0.9rem',
            zIndex: 2,
            width: '2.25rem',
            height: '2.25rem',
            borderRadius: '0.5rem',
            border: '1px solid rgba(18, 67, 63, 0.12)',
            background: '#fff',
            color: '#12433f',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Brand panel */}
        <aside
          className="trial-popup-brand"
          style={{
            display: 'none',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '2rem',
            color: '#fff',
            background: 'linear-gradient(160deg, #0f3a36 0%, #12433f 45%, #1a5c55 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at top right, rgba(174,145,67,0.22), transparent 45%), radial-gradient(circle at bottom left, rgba(255,255,255,0.06), transparent 40%)',
            }}
          />

          <div style={{ position: 'relative' }}>
            <p
              style={{
                margin: '0 0 1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#f0e2b4',
              }}
            >
              Quran Reading System
            </p>
            <h2
              style={{
                margin: 0,
                fontSize: '2rem',
                lineHeight: 1.2,
                fontWeight: 700,
                letterSpacing: '-0.02em',
              }}
            >
              Begin with a complimentary trial class
            </h2>
            <p
              style={{
                margin: '0.9rem 0 0',
                color: 'rgba(255,255,255,0.78)',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                maxWidth: '20rem',
              }}
            >
              Meet a qualified tutor, experience our teaching style, and take the first step in your Quran journey.
            </p>
          </div>

          <ul style={{ position: 'relative', listStyle: 'none', margin: '2rem 0 0', padding: 0 }}>
            {BENEFITS.map((item) => (
              <li
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.7rem',
                  marginBottom: '0.85rem',
                  fontSize: '0.92rem',
                  color: 'rgba(255,255,255,0.9)',
                }}
              >
                <span
                  style={{
                    width: '1.4rem',
                    height: '1.4rem',
                    borderRadius: '9999px',
                    background: 'rgba(174,145,67,0.25)',
                    color: '#f0e2b4',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </aside>

        {/* Form panel */}
        <div
          style={{
            padding: '1.5rem 1.35rem 1.4rem',
            overflowY: 'auto',
            maxHeight: '92vh',
          }}
          className="trial-popup-form-wrap"
        >
          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 0.5rem' }}>
              <div
                style={{
                  width: '3.75rem',
                  height: '3.75rem',
                  margin: '0 auto 1.1rem',
                  borderRadius: '9999px',
                  background: 'rgba(18,67,63,0.08)',
                  color: '#12433f',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 style={{ margin: '0 0 0.55rem', fontSize: '1.45rem', fontWeight: 700, color: '#14201e' }}>
                Request submitted
              </h3>
              <p style={{ margin: '0 auto', maxWidth: '22rem', color: '#66706e', fontSize: '0.95rem', lineHeight: 1.6 }}>
                JazakAllah Khair. Our admissions team will contact you shortly to schedule your free trial class.
              </p>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  marginTop: '1.5rem',
                  minWidth: '10rem',
                  height: '2.85rem',
                  padding: '0 1.25rem',
                  borderRadius: '0.55rem',
                  border: 'none',
                  background: '#12433f',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                }}
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '1.25rem', paddingRight: '2rem' }}>
                <p
                  style={{
                    margin: '0 0 0.45rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#ae9143',
                  }}
                >
                  Free Trial Enrollment
                </p>
                <h2
                  id={titleId}
                  style={{
                    margin: 0,
                    fontSize: '1.55rem',
                    fontWeight: 700,
                    color: '#14201e',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.25,
                  }}
                >
                  Reserve your complimentary class
                </h2>
                <p style={{ margin: '0.5rem 0 0', color: '#66706e', fontSize: '0.92rem', lineHeight: 1.55 }}>
                  Share a few details and we will arrange a one-to-one session with a certified tutor.
                </p>
              </div>

              <div
                className="trial-popup-mobile-benefits"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.45rem',
                  marginBottom: '1.15rem',
                }}
              >
                {BENEFITS.map((item) => (
                  <span
                    key={item}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#12433f',
                      background: 'rgba(18,67,63,0.07)',
                      border: '1px solid rgba(18,67,63,0.1)',
                      borderRadius: '9999px',
                      padding: '0.3rem 0.65rem',
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>

              {errorMessage && (
                <div
                  style={{
                    marginBottom: '1rem',
                    padding: '0.75rem 0.9rem',
                    borderRadius: '0.55rem',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#b91c1c',
                    fontSize: '0.875rem',
                  }}
                >
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
                <div>
                  <label htmlFor="popup-name" style={labelCss}>Full name</label>
                  <input
                    id="popup-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    style={getFieldStyle('name')}
                    placeholder="Enter your full name"
                    required
                    autoComplete="name"
                  />
                </div>

                <div className="trial-popup-row" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.95rem' }}>
                  <div>
                    <label htmlFor="popup-country" style={labelCss}>Country</label>
                    <div style={{ position: 'relative' }}>
                      <select
                        id="popup-country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('country')}
                        onBlur={() => setFocusedField(null)}
                        style={{ ...getFieldStyle('country'), paddingRight: '2.4rem' }}
                        required
                      >
                        {COUNTRIES.map((country) => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                      <SelectChevron />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="popup-phone" style={labelCss}>WhatsApp number</label>
                    <input
                      id="popup-phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      style={getFieldStyle('phone')}
                      placeholder="+92 300 0000000"
                      required
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="popup-course" style={labelCss}>Preferred course</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      id="popup-course"
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('course')}
                      onBlur={() => setFocusedField(null)}
                      style={{ ...getFieldStyle('course'), paddingRight: '2.4rem' }}
                      required
                    >
                      {coursesData.courses.map((course) => (
                        <option key={course.id} value={course.title}>{course.title}</option>
                      ))}
                    </select>
                    <SelectChevron />
                  </div>
                </div>

                <div>
                  <label htmlFor="popup-source" style={labelCss}>How did you hear about us?</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      id="popup-source"
                      name="source"
                      value={formData.source}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('source')}
                      onBlur={() => setFocusedField(null)}
                      style={{ ...getFieldStyle('source'), paddingRight: '2.4rem' }}
                      required
                    >
                      {HEAR_ABOUT_OPTIONS.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <SelectChevron />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    marginTop: '0.35rem',
                    width: '100%',
                    height: '3rem',
                    borderRadius: '0.55rem',
                    border: 'none',
                    background: isSubmitting ? '#9aa8a6' : '#12433f',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.98rem',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'background 0.15s ease',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        style={{
                          width: '1rem',
                          height: '1rem',
                          borderRadius: '9999px',
                          border: '2px solid rgba(255,255,255,0.35)',
                          borderTopColor: '#fff',
                          display: 'inline-block',
                          animation: 'trial-spin 0.7s linear infinite',
                        }}
                      />
                      Submitting...
                    </>
                  ) : (
                    <>Book Free Trial</>
                  )}
                </button>

                <p
                  style={{
                    margin: 0,
                    textAlign: 'center',
                    fontSize: '0.78rem',
                    color: '#7a8583',
                    lineHeight: 1.5,
                  }}
                >
                  Your details are confidential and used only to arrange your class.
                </p>
              </form>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes trial-spin {
          to { transform: rotate(360deg); }
        }
        @media (min-width: 768px) {
          .trial-popup-panel {
            grid-template-columns: 0.95fr 1.15fr !important;
          }
          .trial-popup-brand {
            display: flex !important;
          }
          .trial-popup-mobile-benefits {
            display: none !important;
          }
          .trial-popup-form-wrap {
            padding: 2rem 2rem 1.75rem !important;
          }
          .trial-popup-row {
            grid-template-columns: 1fr 1fr !important;
          }
          .trial-popup-close {
            background: rgba(255,255,255,0.92) !important;
          }
        }
      `}</style>
    </div>
  );
}

const labelCss: React.CSSProperties = {
  display: 'block',
  marginBottom: '0.4rem',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#3f4b49',
};

function SelectChevron() {
  return (
    <span
      aria-hidden="true"
      style={{
        position: 'absolute',
        right: '0.85rem',
        top: '50%',
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
        color: '#7a8583',
        display: 'flex',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
      </svg>
    </span>
  );
}
