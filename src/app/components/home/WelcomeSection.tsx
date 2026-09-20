import React from 'react';
import Link from 'next/link';

const WelcomeSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="welcome-section-grid grid grid-cols-1 xl:grid-cols-2 gap-16 items-center">
          {/* Left Column - Image Collage */}
          <div className="campus-life-image-section">
            <img 
              src="/images/resources/banner.jpg" 
              alt="Students learning Quran" 
              className="campus-life-main-image"
            />
            
            {/* Decorative Elements */}
            <div className="campus-life-dots-vertical"></div>
            <div className="campus-life-circle-green"></div>
          </div>
          
          {/* Right Column - Clean Content */}
          <div className="welcome-content">
            <h2 className="welcome-title">
              <span className="welcome-title-part">Welcome to</span><br />
              <span className="welcome-title-main" style={{ color: 'var(--secondary-color)' }}>Quran Reading System</span>
            </h2>
            
            <p className="welcome-text">
              Embark on a spiritual journey of Quranic learning and Islamic education. 
              Our academy combines traditional Islamic teachings with modern educational 
              methods to provide comprehensive Quran and Islamic studies programs.
            </p>
            
            <div className="welcome-features">
              <div className="welcome-feature">
                <div className="welcome-feature-icon">📖</div>
                <span>Quran Memorization</span>
              </div>
              <div className="welcome-feature">
                <div className="welcome-feature-icon">📖</div>
                <span>Tajweed Mastery</span>
              </div>
              <div className="welcome-feature">
                <div className="welcome-feature-icon">🕌</div>
                <span>Islamic Studies</span>
              </div>
            </div>
            
            <div className="welcome-cta-group">
              <Link href="/auth/signup" className="welcome-primary-btn">
                Enroll Now
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/about" className="welcome-secondary-btn">
                Virtual Tour
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5v14l11-7z" fill="currentColor"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
