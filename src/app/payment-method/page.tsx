import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PaymentMethodPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-emerald-50 to-green-50">
          <div className="container">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                Payment Method
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Use the bank details below to complete your course fee payment
              </p>
            </div>
          </div>
        </section>

        {/* Payment Details */}
        <section className="py-20">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Bank Details */}
              <div className="bg-white rounded-2xl shadow-lg border-2 border-emerald-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-3xl">🏦</div>
                  <h2 className="text-2xl font-bold text-gray-800">Bank Details</h2>
                </div>
                <dl className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-100 pb-3">
                    <dt className="font-semibold text-gray-700">Bank</dt>
                    <dd className="text-gray-600 sm:text-right">Muslim Commercial Bank (MCB)</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-100 pb-3">
                    <dt className="font-semibold text-gray-700">Account</dt>
                    <dd className="text-gray-600 sm:text-right">0493 9163 1100 1051</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-100 pb-3">
                    <dt className="font-semibold text-gray-700">Branch Code</dt>
                    <dd className="text-gray-600 sm:text-right">0473</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-100 pb-3">
                    <dt className="font-semibold text-gray-700">Account Name</dt>
                    <dd className="text-gray-600 sm:text-right">Yasir Farooq</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <dt className="font-semibold text-gray-700">Area</dt>
                    <dd className="text-gray-600 sm:text-right">Murree Mall Road, Punjab, Pakistan</dd>
                  </div>
                </dl>
              </div>

              {/* Manager Details */}
              <div className="bg-white rounded-2xl shadow-lg border-2 border-emerald-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-3xl">👤</div>
                  <h2 className="text-2xl font-bold text-gray-800">Manager Details</h2>
                </div>
                <dl className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-100 pb-3">
                    <dt className="font-semibold text-gray-700">Name</dt>
                    <dd className="text-gray-600 sm:text-right">Sir Rizwan, Sir Yasir</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <dt className="font-semibold text-gray-700">Mobile</dt>
                    <dd className="text-gray-600 sm:text-right">
                      <a href="tel:+923145683317" className="hover:text-emerald-600">0314 5683317</a>
                      {', '}
                      <a href="tel:+923215507499" className="hover:text-emerald-600">0321 5507499</a>
                    </dd>
                  </div>
                </dl>

                <div className="mt-8 p-4 bg-emerald-50 rounded-lg text-sm text-gray-600">
                  After making the payment, please share the transaction receipt with us via WhatsApp or the contact form so we can confirm your enrollment.
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
