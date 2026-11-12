'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

const bankDetails = [
  { label: 'Bank', value: 'Muslim Commercial Bank (MCB)', copyValue: 'Muslim Commercial Bank (MCB)' },
  { label: 'Account Number', value: '0493 9163 1100 1051', copyValue: '0493916311001051', highlight: true },
  { label: 'Branch Code', value: '0473', copyValue: '0473' },
  { label: 'Account Title', value: 'Yasir Farooq', copyValue: 'Yasir Farooq' },
  { label: 'Branch / Area', value: 'Murree Mall Road, Punjab, Pakistan', copyValue: 'Murree Mall Road, Punjab, Pakistan' },
];

const steps = [
  {
    number: '01',
    title: 'Transfer the fee',
    description: 'Send your course fee to the bank account listed on this page using online banking, mobile app, or branch deposit.',
  },
  {
    number: '02',
    title: 'Save the receipt',
    description: 'Keep a clear screenshot or photo of the transaction slip showing the amount, date, and reference number.',
  },
  {
    number: '03',
    title: 'Share confirmation',
    description: 'Send the receipt on WhatsApp or through our contact form so we can verify payment and confirm your enrollment.',
  },
];

function CopyButton({
  value,
  id,
  large = false,
}: {
  value: string;
  id: string;
  large?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${id}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        borderRadius: large ? '0.75rem' : '0.55rem',
        padding: large ? '0.7rem 1rem' : '0.4rem 0.7rem',
        fontSize: large ? '0.85rem' : '0.75rem',
        fontWeight: 700,
        border: 'none',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'background 0.2s ease, color 0.2s ease',
        background: copied ? 'var(--primary-color)' : large ? 'var(--secondary-color)' : 'rgba(18, 67, 63, 0.08)',
        color: copied ? '#fff' : large ? '#12433f' : 'var(--primary-color)',
      }}
    >
      {copied ? (
        <>
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

function CopyAllButton({ details }: { details: typeof bankDetails }) {
  const [copied, setCopied] = useState(false);

  const handleCopyAll = async () => {
    const text = details.map((d) => `${d.label}: ${d.value}`).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopyAll}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        borderRadius: '0.65rem',
        padding: '0.5rem 0.85rem',
        fontSize: '0.78rem',
        fontWeight: 700,
        border: '1px solid rgba(255,255,255,0.25)',
        cursor: 'pointer',
        background: copied ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.12)',
        color: copied ? 'var(--primary-color)' : '#fff',
        transition: 'background 0.2s ease, color 0.2s ease',
      }}
    >
      {copied ? 'All Copied' : 'Copy All'}
    </button>
  );
}

export default function PaymentMethodPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Hero */}
        <section
          className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
          style={{ background: 'linear-gradient(135deg, var(--primary-color) 0%, #0d332f 55%, #1a5c55 100%)' }}
        >
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/5" />
            <div className="absolute top-1/3 right-10 w-24 h-24 rounded-full bg-white/5" />
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-32 opacity-20"
              style={{ background: 'radial-gradient(ellipse at center, var(--secondary-color), transparent 70%)' }}
            />
          </div>

          <div className="container relative z-10 text-center">
            <p
              className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide uppercase mb-4 px-3 py-1 rounded-full"
              style={{ background: 'rgba(255, 255, 255, 0.12)', color: '#f5e6b8', border: '1px solid rgba(245, 230, 184, 0.35)' }}
            >
              Secure Enrollment
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Payment Method
            </h1>
            <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
              Complete your course fee using the bank details below, then share your receipt so we can confirm your seat.
            </p>
            <div className="mt-6 text-white/60 text-sm">Home • Payment Method</div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-12 sm:py-16 border-b border-gray-100">
          <div className="container">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">How to Pay</h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                Three simple steps to complete enrollment
              </p>
            </div>

            <div className="payment-steps max-w-5xl mx-auto">
              {steps.map((step, index) => (
                <div key={step.number} className="payment-step relative px-2">
                  {index < steps.length - 1 && (
                    <div
                      className="payment-step-line absolute top-6 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px"
                      style={{ background: 'linear-gradient(90deg, var(--secondary-color), transparent)' }}
                      aria-hidden="true"
                    />
                  )}
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-sm font-bold text-white mb-4"
                    style={{ background: 'var(--primary-color)' }}
                  >
                    {step.number}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bank + Contact */}
        <section className="py-12 sm:py-16 lg:py-20" style={{ background: 'var(--bg-light-gray)' }}>
          <div className="container">
            <div className="payment-layout max-w-6xl mx-auto">
              {/* Bank details — main focus */}
              <div
                className="bank-card"
                style={{
                  background: '#fff',
                  borderRadius: '1.25rem',
                  border: '1px solid #e8eceb',
                  boxShadow: '0 8px 28px rgba(18, 67, 63, 0.08)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    padding: '1.25rem 1.5rem',
                    background: 'linear-gradient(135deg, var(--primary-color) 0%, #0d332f 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div
                      style={{
                        width: '2.75rem',
                        height: '2.75rem',
                        borderRadius: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(174, 145, 67, 0.28)',
                        color: 'var(--secondary-color)',
                        flexShrink: 0,
                      }}
                    >
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M5 10V7a2 2 0 012-2h10a2 2 0 012 2v3M5 10v7a2 2 0 002 2h10a2 2 0 002-2v-7M9 14h6" />
                      </svg>
                    </div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>Bank Details</h2>
                      <p style={{ margin: '0.15rem 0 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)' }}>
                        MCB — Muslim Commercial Bank
                      </p>
                    </div>
                  </div>
                  <CopyAllButton details={bankDetails} />
                </div>

                <div style={{ padding: '1.25rem 1.35rem 1.5rem' }}>
                  {/* Featured account number */}
                  {(() => {
                    const account = bankDetails.find((d) => d.highlight)!;
                    return (
                      <div
                        style={{
                          marginBottom: '1rem',
                          padding: '1.15rem 1.2rem',
                          borderRadius: '1rem',
                          background: 'linear-gradient(145deg, rgba(174,145,67,0.14) 0%, rgba(18,67,63,0.06) 100%)',
                          border: '1px solid rgba(174,145,67,0.28)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '1rem',
                          flexWrap: 'wrap',
                        }}
                      >
                        <div>
                          <p
                            style={{
                              margin: 0,
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                              color: 'var(--secondary-color)',
                            }}
                          >
                            {account.label}
                          </p>
                          <p
                            style={{
                              margin: '0.4rem 0 0',
                              fontSize: 'clamp(1.2rem, 3vw, 1.55rem)',
                              fontWeight: 800,
                              letterSpacing: '0.06em',
                              color: 'var(--primary-color)',
                              fontVariantNumeric: 'tabular-nums',
                            }}
                          >
                            {account.value}
                          </p>
                        </div>
                        <CopyButton value={account.copyValue} id={account.label} large />
                      </div>
                    );
                  })()}

                  {/* Other fields as tiles */}
                  <div className="bank-fields">
                    {bankDetails
                      .filter((item) => !item.highlight)
                      .map((item) => (
                        <div
                          key={item.label}
                          className="bank-field"
                          style={{
                            background: '#f8faf9',
                            border: '1px solid #eef2f1',
                            borderRadius: '0.9rem',
                            padding: '0.95rem 1rem',
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            gap: '0.75rem',
                            transition: 'border-color 0.2s ease, background 0.2s ease',
                          }}
                        >
                          <div style={{ minWidth: 0 }}>
                            <p
                              style={{
                                margin: 0,
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                letterSpacing: '0.07em',
                                textTransform: 'uppercase',
                                color: '#8a9391',
                              }}
                            >
                              {item.label}
                            </p>
                            <p
                              style={{
                                margin: '0.35rem 0 0',
                                fontSize: '0.98rem',
                                fontWeight: 600,
                                color: '#1f2937',
                                lineHeight: 1.4,
                                wordBreak: 'break-word',
                              }}
                            >
                              {item.value}
                            </p>
                          </div>
                          <CopyButton value={item.copyValue} id={item.label} />
                        </div>
                      ))}
                  </div>

                  <div
                    style={{
                      marginTop: '1.1rem',
                      borderRadius: '0.9rem',
                      padding: '0.95rem 1rem',
                      display: 'flex',
                      gap: '0.75rem',
                      alignItems: 'flex-start',
                      background: 'rgba(18, 67, 63, 0.06)',
                      border: '1px solid rgba(18, 67, 63, 0.08)',
                    }}
                  >
                    <svg width="18" height="18" style={{ marginTop: 2, flexShrink: 0, color: 'var(--primary-color)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                    </svg>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.55 }}>
                      Use the exact account title{' '}
                      <strong style={{ color: 'var(--primary-color)' }}>Yasir Farooq</strong> when transferring.
                      After payment, share your receipt so enrollment can be confirmed.
                    </p>
                  </div>
                </div>
              </div>

              {/* Side panel */}
              <div className="payment-side">
                <div
                  style={{
                    background: '#fff',
                    borderRadius: '1.25rem',
                    border: '1px solid #e8eceb',
                    boxShadow: '0 4px 18px rgba(18, 67, 63, 0.06)',
                    padding: '1.35rem 1.4rem',
                  }}
                >
                  <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#1f2937' }}>Need Help?</h2>
                  <p style={{ margin: '0.35rem 0 1.15rem', fontSize: '0.875rem', color: '#6b7280' }}>
                    Contact our managers for payment support
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div
                      style={{
                        display: 'flex',
                        gap: '0.85rem',
                        alignItems: 'center',
                        padding: '0.85rem',
                        borderRadius: '0.85rem',
                        background: '#f8faf9',
                        border: '1px solid #eef2f1',
                      }}
                    >
                      <div
                        style={{
                          width: '2.5rem',
                          height: '2.5rem',
                          borderRadius: '0.7rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(18, 67, 63, 0.08)',
                          color: 'var(--primary-color)',
                          flexShrink: 0,
                        }}
                      >
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8a9391' }}>
                          Managers
                        </p>
                        <p style={{ margin: '0.15rem 0 0', fontWeight: 600, color: '#1f2937' }}>Sir Rizwan, Sir Yasir</p>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        gap: '0.85rem',
                        alignItems: 'center',
                        padding: '0.85rem',
                        borderRadius: '0.85rem',
                        background: '#f8faf9',
                        border: '1px solid #eef2f1',
                      }}
                    >
                      <div
                        style={{
                          width: '2.5rem',
                          height: '2.5rem',
                          borderRadius: '0.7rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(18, 67, 63, 0.08)',
                          color: 'var(--primary-color)',
                          flexShrink: 0,
                        }}
                      >
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8a9391' }}>
                          Mobile
                        </p>
                        <a href="tel:+923145683317" style={{ display: 'block', fontWeight: 600, color: 'var(--primary-color)', textDecoration: 'none' }}>
                          0314 5683317
                        </a>
                        <a href="tel:+923215507499" style={{ display: 'block', fontWeight: 600, color: 'var(--primary-color)', textDecoration: 'none' }}>
                          0321 5507499
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    borderRadius: '1.25rem',
                    padding: '1.35rem 1.4rem',
                    color: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '200px',
                    background: 'linear-gradient(145deg, #128C7E 0%, #075E54 100%)',
                    boxShadow: '0 8px 24px rgba(7, 94, 84, 0.25)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.75rem' }}>
                      <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                      </svg>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Share Receipt on WhatsApp</h3>
                    </div>
                    <p style={{ margin: '0 0 1.15rem', color: 'rgba(255,255,255,0.82)', fontSize: '0.875rem', lineHeight: 1.55 }}>
                      After transferring, send your payment screenshot so we can activate your enrollment quickly.
                    </p>
                  </div>
                  <a
                    href="https://wa.me/923215507499?text=Assalamualaikum%2C%20I%20have%20completed%20my%20course%20fee%20payment.%20Please%20find%20my%20receipt%20attached."
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      width: '100%',
                      borderRadius: '0.85rem',
                      padding: '0.8rem 1rem',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      background: '#fff',
                      color: '#075E54',
                      textDecoration: 'none',
                    }}
                  >
                    Open WhatsApp
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7M5 12h16" />
                    </svg>
                  </a>
                </div>

                <Link
                  href="/contact"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    borderRadius: '1rem',
                    padding: '0.85rem 1rem',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    border: '2px solid var(--primary-color)',
                    color: 'var(--primary-color)',
                    textDecoration: 'none',
                    background: 'transparent',
                  }}
                >
                  Or use the contact form
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <style>{`
        .payment-steps {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.75rem;
        }
        .payment-step {
          text-align: center;
        }
        .payment-step-line {
          display: none;
        }
        .payment-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.75rem;
        }
        .payment-side {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .bank-fields {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }
        .bank-field:hover {
          border-color: rgba(18, 67, 63, 0.22) !important;
          background: #f3f7f6 !important;
        }
        @media (min-width: 640px) {
          .bank-fields {
            grid-template-columns: 1fr 1fr;
          }
          .bank-fields .bank-field:last-child:nth-child(odd) {
            grid-column: 1 / -1;
          }
        }
        @media (min-width: 768px) {
          .payment-steps {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 2rem;
          }
          .payment-step {
            text-align: left;
          }
          .payment-step-line {
            display: block;
          }
        }
        @media (min-width: 1024px) {
          .payment-layout {
            grid-template-columns: 1.65fr 1fr;
            gap: 2rem;
            align-items: start;
          }
        }
      `}</style>
    </>
  );
}
