import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import coursesData from '../data/courses.json';

export default function CoursesPage() {
  const courses = coursesData.courses;

  const categories = [
    {
      title: "Quran Studies",
      count: "3 Courses",
      description: "Memorization, recitation, and understanding of the Holy Quran",
      topics: ["Hifz", "Tajweed", "Tafsir"],
      accent: "#12433f",
      soft: "rgba(18, 67, 63, 0.08)",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: "Islamic Studies",
      count: "2 Courses",
      description: "Jurisprudence, history, and ethics rooted in authentic scholarship",
      topics: ["Fiqh", "Hadith", "Seerah"],
      accent: "#ae9143",
      soft: "rgba(174, 145, 67, 0.12)",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6" />
        </svg>
      ),
    },
    {
      title: "Arabic Language",
      count: "1 Course",
      description: "Classical Arabic grammar and vocabulary for deeper Quran understanding",
      topics: ["Grammar", "Vocabulary", "Reading"],
      accent: "#1a5c55",
      soft: "rgba(26, 92, 85, 0.1)",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      ),
    },
  ];

  const benefits = [
    {
      icon: "👨‍🏫",
      title: "Expert Teachers",
      description: "Learn from certified Islamic scholars and Quran teachers"
    },
    {
      icon: "📱",
      title: "Flexible Learning",
      description: "Online and offline classes available for your convenience"
    },
    {
      icon: "📚",
      title: "Comprehensive Curriculum",
      description: "Structured programs covering all aspects of Islamic education"
    },
    {
      icon: "🎯",
      title: "Personalized Attention",
      description: "Small class sizes ensuring individual attention and progress"
    }
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100">
          <div className="container">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                Our Islamic Courses
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover comprehensive Islamic education programs designed to nurture your spiritual growth
              </p>
              <div className="mt-8 flex justify-center">
                <div className="w-24 h-1 bg-emerald-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Categories */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="container">
            <div className="text-center mb-12 sm:mb-16">
              <p
                className="inline-block text-xs sm:text-sm font-semibold tracking-wide uppercase mb-3 px-3 py-1 rounded-full"
                style={{ background: 'rgba(18, 67, 63, 0.08)', color: 'var(--primary-color)' }}
              >
                Browse by Path
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Course Categories</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
                Explore our diverse range of Islamic education programs
              </p>
            </div>

            <div className="course-categories max-w-6xl mx-auto">
              {categories.map((category) => (
                <article
                  key={category.title}
                  className="course-category group"
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '1rem',
                    background: '#fff',
                    border: '1px solid #eef0f2',
                    boxShadow: '0 1px 3px rgba(18, 67, 63, 0.06)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      insetInline: 0,
                      top: 0,
                      height: '5px',
                      background: category.accent,
                    }}
                  />

                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      right: '-2rem',
                      top: '-2rem',
                      width: '8rem',
                      height: '8rem',
                      borderRadius: '9999px',
                      background: category.soft,
                      pointerEvents: 'none',
                    }}
                  />

                  <div style={{ padding: '1.75rem', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
                      <div
                        style={{
                          width: '3.5rem',
                          height: '3.5rem',
                          borderRadius: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: category.soft,
                          color: category.accent,
                          flexShrink: 0,
                        }}
                      >
                        {category.icon}
                      </div>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          padding: '0.35rem 0.65rem',
                          borderRadius: '0.5rem',
                          background: category.soft,
                          color: category.accent,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {category.count}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>
                      {category.title}
                    </h3>
                    <p style={{ color: '#6b7280', lineHeight: 1.65, fontSize: '0.95rem', marginBottom: '1.25rem', flex: 1 }}>
                      {category.description}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid #f0f1f3',
                      }}
                    >
                      {category.topics.map((topic) => (
                        <span
                          key={topic}
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: category.accent,
                            background: category.soft,
                            padding: '0.3rem 0.65rem',
                            borderRadius: '0.4rem',
                          }}
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <style>{`
            .course-categories {
              display: grid;
              grid-template-columns: 1fr;
              gap: 1.25rem;
            }
            .course-category:hover {
              transform: translateY(-4px);
              box-shadow: 0 12px 28px rgba(18, 67, 63, 0.12) !important;
            }
            @media (min-width: 768px) {
              .course-categories {
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 1.5rem;
              }
            }
          `}</style>
        </section>

        {/* All Available Courses */}
        <section className="py-20 bg-gray-50">
          <div className="container">
            <div className="section-title">
              <h2>All Available Courses</h2>
              <div className="section-icon">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            <div className="courses-grid">
              {courses.map((course) => (
                <div key={course.id} className="card">
                  <img src={course.image} alt={course.title} className="card-image" />
                  <div className="card-content">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-1 rounded font-medium">
                        {course.level}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {course.duration}
                      </span>
                    </div>
                    
                    <h3 className="card-title mb-3 text-lg sm:text-xl">{course.title}</h3>
                    
                    <p className="card-text mb-4 line-clamp-2 text-sm sm:text-base">
                      {course.description}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-sm">Students</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="font-bold text-base sm:text-lg">Live Classes</span>
                      </div>
                    </div>
                    
                    <Link href={`/courses/${course.id}`} className="card-link text-sm sm:text-base">View Details →</Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <Link href="/courses" className="btn btn-primary">View All Courses →</Link>
            </div>
          </div>
        </section>

        {/* Why Choose Our Courses */}
        <section className="py-20 bg-gray-50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose Our Courses</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Experience the best in Islamic education with our comprehensive programs
              </p>
              <div className="mt-6 flex justify-center">
                <div className="w-16 h-1 bg-emerald-600 rounded-full"></div>
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto px-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="group flex-1 mb-8 lg:mb-0">
                  <div className="text-center p-10 bg-white rounded-2xl border-2 border-emerald-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 hover:border-emerald-300 h-full mx-2">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">{benefit.title}</h3>
                    <p className="text-gray-600 text-base leading-relaxed px-2">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20" style={{ background: 'linear-gradient(135deg, #12433f 0%, #0f3a36 100%)' }}>
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Begin Your Islamic Education?
            </h2>
            {/* <p className="text-gray-200 mb-8 max-w-2xl mx-auto text-lg">
              Join our community of learners and start your journey towards Islamic knowledge and spiritual growth
            </p> */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/contact" className="inline-block bg-white text-center py-3 px-8 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-gray-50 transform hover:-translate-y-2 transition-all duration-300" style={{ color: '#12433f' }}>
              Contact Advisor
              </Link>
             
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
