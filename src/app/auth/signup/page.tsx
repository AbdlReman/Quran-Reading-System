'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'student' | 'teacher';
  phone?: string;
  address?: string;
  dateOfBirth?: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
}

export default function SignUpPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    phone: '',
    address: '',
    dateOfBirth: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const router = useRouter();

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value) return 'Name is required';
        if (value.length < 2) return 'Name must be at least 2 characters long';
        if (value.length > 50) return 'Name cannot exceed 50 characters';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name can only contain letters and spaces';
        break;
      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        break;
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters long';
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value)) {
          return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
        }
        break;
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        break;
      case 'phone':
        if (value && !/^[\+]?[1-9][\d]{0,15}$/.test(value)) {
          return 'Please enter a valid phone number';
        }
        break;
      case 'address':
        if (value && value.length > 200) return 'Address cannot exceed 200 characters';
        break;
      case 'dateOfBirth':
        if (value) {
          const dob = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - dob.getFullYear();
          if (age < 5 || age > 100) {
            return 'Date of birth must be valid and age must be between 5 and 100 years';
          }
        }
        break;
    }
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setValidationErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof FormData] || '');
      if (error) {
        errors[key as keyof ValidationErrors] = error;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          phone: formData.phone || undefined,
          address: formData.address || undefined,
          dateOfBirth: formData.dateOfBirth || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
      } else {
        setSuccess('Registration successful! You can sign in now.');
        setTimeout(() => {
          router.push('/auth/signin');
        }, 3000);
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const hasError = (field: keyof ValidationErrors): boolean => {
    return !!validationErrors[field];
  };

  const getInputClassName = (field: keyof ValidationErrors): string => {
    const baseClass = "form-input";
    return hasError(field) 
      ? `${baseClass} error`
      : baseClass;
  };

  return (
    <div className="min-h-screen auth-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="auth-content max-w-lg w-full">
        <div className="form-container">
        <div>
        
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-secondary-50 border border-secondary-200 text-secondary-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
              {success}
            </div>
          )}
          
          <div className="space-y-6">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName('name')}
                placeholder="Enter your full name"
              />
              {hasError('name') && (
                <div className="form-error">
                  <span>⚠️</span>
                  {validationErrors.name}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName('email')}
                placeholder="Enter your email"
              />
              {hasError('email') && (
                <div className="form-error">
                  <span>⚠️</span>
                  {validationErrors.email}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="role" className="form-label">
                I want to join as *
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-select"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            <div className="form-group">
              <div className="form-row">
                <div>
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClassName('phone')}
                    placeholder="Enter your phone number (optional)"
                  />
                  {hasError('phone') && (
                    <div className="form-error">
                      <span>⚠️</span>
                      {validationErrors.phone}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className="form-label">
                    Date of Birth
                  </label>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClassName('dateOfBirth')}
                  />
                  {hasError('dateOfBirth') && (
                    <div className="form-error">
                      <span>⚠️</span>
                      {validationErrors.dateOfBirth}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                autoComplete="street-address"
                value={formData.address}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName('address')}
                placeholder="Enter your address (optional)"
              />
              {hasError('address') && (
                <div className="form-error">
                  <span>⚠️</span>
                  {validationErrors.address}
                </div>
              )}
            </div>
            
            <div className="form-group">
              <div className="form-row">
                <div>
                  <label htmlFor="password" className="form-label">
                    Password *
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClassName('password')}
                    placeholder="Enter your password (min 8 characters)"
                  />
                  {hasError('password') && (
                    <div className="form-error">
                      <span>⚠️</span>
                      {validationErrors.password}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password *
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClassName('confirmPassword')}
                    placeholder="Confirm your password"
                  />
                  {hasError('confirmPassword') && (
                    <div className="form-error">
                      <span>⚠️</span>
                      {validationErrors.confirmPassword}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="form-group submit-group mt-4">
            <button
              type="submit"
              disabled={loading}
              className="form-button"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create account'
              )}
            </button>
          </div>

          <div className="text-center">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-500">
              ← Back to home
            </Link>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
