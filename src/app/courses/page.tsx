import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import coursesData from '../data/courses.json';

export default function CoursesPage() {
  const courses = coursesData.courses;

  const categories = [
    {
      icon: "📖",
      title: "Quran Studies",
      count: "3 Courses",
      description: "Memorization, recitation, and understanding"
    },
    {
      icon: "🕌",
      title: "Islamic Studies",
      count: "2 Courses",
      description: "Jurisprudence, history, and ethics"
    },
    {
      icon: "📝",
      title: "Arabic Language",
      count: "1 Course",
      description: "Classical Arabic and grammar"
    }
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
        <section className="py-20 bg-white">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Course Categories</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Explore our diverse range of Islamic education programs
              </p>
              <div className="mt-6 flex justify-center">
                <div className="w-16 h-1 bg-emerald-600 rounded-full"></div>
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
              {categories.map((category, index) => (
                <div key={index} className="group flex-1">
                  <div className="text-center p-8 bg-white rounded-2xl border-2 border-emerald-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 hover:border-emerald-300 h-full">
                    <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">{category.title}</h3>
                    <p className="text-emerald-600 font-semibold mb-4 text-lg">{category.count}</p>
                    <p className="text-gray-600 leading-relaxed text-base">
                      {category.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
