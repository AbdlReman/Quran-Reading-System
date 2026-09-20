import React from 'react';
import Link from 'next/link';

const CampusLifeSection: React.FC = () => {
  const features = [
    {
      id: 1,
      icon: "🕌",
      title: "Spiritual Environment",
      description: "Experience a peaceful and spiritual learning environment designed for Quranic studies and Islamic education."
    },
    {
      id: 2,
      icon: "📚",
      title: "Traditional & Modern Learning",
      description: "Combining traditional Islamic teaching methods with modern educational technology for effective learning."
    },
    {
      id: 3,
      icon: "🤝",
      title: "Community & Brotherhood",
      description: "Build lasting friendships and strengthen your faith in a supportive Islamic community environment."
    }
  ];

  return (
    <section className="campus-life-section">
      <div className="container">
        {/* Header */}
        <div className="campus-life-header">
          <h2 className="campus-life-title">Academy Life</h2>
          <div className="campus-life-underline"></div>
        </div>
        
        {/* Main Content */}
        <div className="campus-life-grid">
          {/* Left Column - Features */}
          <div className="campus-life-features">
            {features.map((feature, index) => (
              <div key={feature.id} className="campus-life-feature">
                <div className="campus-life-feature-content">
                  <div className="campus-life-feature-icon">{feature.icon}</div>
                  <div className="campus-life-feature-text">
                    <h3 className="campus-life-feature-title">{feature.title}</h3>
                    <p className="campus-life-feature-description">{feature.description}</p>
                  </div>
                  <div className="campus-life-feature-arrow">→</div>
                </div>
                {index < features.length - 1 && <div className="campus-life-feature-divider"></div>}
              </div>
            ))}
          </div>
          
          {/* Right Column - Image */}
          <div className="campus-life-image-section">
            <img 
              src="/images/resources/banner2.jpg" 
              alt="Students learning Quran at academy" 
              className="campus-life-main-image"
            />
            
            {/* Decorative Elements */}
            <div className="campus-life-dots-vertical"></div>
            <div className="campus-life-circle-green"></div>
          </div>
        </div>
        
        {/* Bottom CTA */}
        <div className="campus-life-cta">
          <Link href="/about" className="campus-life-cta-button">
            Explore Campus Life
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CampusLifeSection;
