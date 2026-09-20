import React from 'react';

const AcademicsSection: React.FC = () => {
  const academics = [
    {
      id: 1,
      title: "Quran Memorization",
      image: "/images/resources/gallery_1_1.jpg",
      link: "/courses"
    },
    {
      id: 2,
      title: "Tajweed & Qira'ah",
      image: "/images/resources/gallery_1_2.jpg",
      link: "/courses"
    },
    {
      id: 3,
      title: "Islamic Studies",
      image: "/images/resources/gallery_1_3.jpg",
      link: "/courses"
    },
    {
      id: 4,
      title: "Online Learning",
      image: "/images/resources/gallery_1_4.jpg",
      link: "/courses"
    }
  ];

  return (
    <section className="py-16">
      <div className="container">
        <div className="section-title">
          <h2>Islamic Education Programs</h2>
          <div className="section-icon">
            <svg width="60" height="20" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 10 Q15 5, 25 10 Q35 15, 45 10 Q55 5, 60 10" stroke="#10b981" strokeWidth="3" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
        </div>
        
        <div className="academics-grid">
          {academics.map((item) => (
            <div key={item.id} className="academic-card">
              <div className="academic-card-image">
                <img src={item.image} alt={item.title} className="w-full h-64 object-cover" />
                <div className="academic-card-overlay">
                  <div className="academic-card-content">
                    <h3 className="academic-card-title">{item.title}</h3>
                    <a href={item.link} className="academic-card-link">Learn More →</a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AcademicsSection;
