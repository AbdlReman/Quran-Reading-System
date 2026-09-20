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

export default function TrialClassPopup() {
  const [isOpen, setIsOpen] = useState(false);
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
          localStorage.setItem(STORAGE_KEY, Date.now().toString());
        }, 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage unavailable (private mode, etc.) - do not show the popup
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => setIsOpen(false);

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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {isSubmitted ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
            <p className="text-gray-600">
              Your free trial request has been received. Our team will contact you soon.
            </p>
            <button onClick={handleClose} className="form-button mt-6">
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 pr-6">
              Start Your Free Quran Trial Class
            </h2>
            <p className="text-gray-600 mb-4">
              Join certified tutors for a one-to-one free Quran class. No payment required.
            </p>
            <p className="text-xs text-emerald-600 font-medium mb-6">
              Your information is 100% secure. We&rsquo;ll contact you soon.
            </p>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="popup-name" className="form-label">Name</label>
                <input
                  type="text"
                  id="popup-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="popup-country" className="form-label">Country</label>
                <select
                  id="popup-country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="popup-phone" className="form-label">Phone Number</label>
                <input
                  type="tel"
                  id="popup-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Number"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="popup-course" className="form-label">Select your desired Course</label>
                <select
                  id="popup-course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  {coursesData.courses.map((course) => (
                    <option key={course.id} value={course.title}>{course.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="popup-source" className="form-label">How did you know about us?</label>
                <select
                  id="popup-source"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  {HEAR_ABOUT_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="form-button" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Start Free Trial'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
