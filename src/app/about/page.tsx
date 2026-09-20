import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function AboutPage() {
  const instructors = [
    {
      name: "Sheikh Ahmed Hassan",
      position: "Teacher",
      image: "/images/resources/team_1_1.jpg"
    },
    {
      name: "Ustadha Fatima Zahes",
      position: "Lead Teacher",
      image: "/images/resources/team_1_2.jpg"
    },
    {
      name: "Dr. Omar Abdullah",
      position: "Education Assistant",
      image: "/images/resources/team_1_3.jpg"
    },
    {
      name: "Ustadha Aisha Rahman",
      position: "Teacher",
      image: "/images/resources/team_1_4.jpg"
    },
    {
      name: "Sheikh Ibrahim Ali",
      position: "Lead Teacher",
      image: "/images/resources/team_1_1.jpg"
    },
    {
      name: "Ustadha Khadija Ahmed",
      position: "Education Assistant",
      image: "/images/resources/team_1_2.jpg"
    }
  ];


  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full"></div>
            <div className="absolute top-32 right-20 w-12 h-12 sm:w-16 sm:h-16 bg-white/5 rounded-full"></div>
            <div className="absolute bottom-20 left-1/4 w-8 h-8 sm:w-12 sm:h-12 bg-white/8 rounded-full"></div>
            <div className="absolute top-1/2 right-1/3 w-6 h-6 sm:w-8 sm:h-8 bg-white/6 rounded-full"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                About Us
              </h1>
              <div className="text-white/80 text-base sm:text-lg">
                Home • About Us
              </div>
            </div>
          </div>
        </section>

        {/* Welcome Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container">
        <div className="welcome-section-grid grid grid-cols-1 xl:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
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
            <h2 className="welcome-title text-2xl sm:text-3xl lg:text-4xl">
              <span className="welcome-title-part">Welcome to</span><br />
              <span className="welcome-title-main" style={{ color: 'var(--secondary-color)' }}>Quran Reading System</span>
            </h2>
            
            <p className="welcome-text text-sm sm:text-base lg:text-lg">
              Embark on a spiritual journey of Quranic learning and Islamic education. 
              Our academy combines traditional Islamic teachings with modern educational 
              methods to provide comprehensive Quran and Islamic studies programs.
            </p>
            
            <div className="welcome-features">
              <div className="welcome-feature">
                <div className="welcome-feature-icon text-lg sm:text-xl">📖</div>
                <span className="text-sm sm:text-base">Quran Memorization</span>
              </div>
              <div className="welcome-feature">
                <div className="welcome-feature-icon text-lg sm:text-xl">📖</div>
                <span className="text-sm sm:text-base">Tajweed Mastery</span>
              </div>
              <div className="welcome-feature">
                <div className="welcome-feature-icon text-lg sm:text-xl">🕌</div>
                <span className="text-sm sm:text-base">Islamic Studies</span>
              </div>
            </div>
            
            <div className="welcome-cta-group">
              <Link href="/auth/signup" className="welcome-primary-btn text-sm sm:text-base">
                Enroll Now
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/courses" className="welcome-secondary-btn text-sm sm:text-base">
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

      {/* Mission & Vision */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            <div>
              <div className="text-secondary-600 font-medium mb-2 text-sm sm:text-base">Our Mission</div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 leading-tight mb-4">Nurturing Hearts with Quran and Sunnah</h2>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                At Quran Reading System, our mission is to cultivate love for the Book of Allah and the Sunnah of His Messenger ﷺ by providing structured, accessible and authentic education for all ages. We focus on correct recitation with Tajweed, memorization with deep understanding, and practical implementation of Islamic manners and values.
              </p>
              <ul className="mt-6 space-y-3 text-gray-700">
                <li className="flex items-start gap-3"><span className="text-secondary-600 mt-1">✔</span> Tajweed-based recitation from beginner to advanced</li>
                <li className="flex items-start gap-3"><span className="text-secondary-600 mt-1">✔</span> Hifz programs with personalized coaching and review plans</li>
                <li className="flex items-start gap-3"><span className="text-secondary-600 mt-1">✔</span> Arabic, Seerah, Aqeedah and Fiqh fundamentals for a balanced growth</li>
              </ul>
            </div>
            <div>
              <div className="text-secondary-600 font-medium mb-2 text-sm sm:text-base">Our Vision</div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 leading-tight mb-4">Lighting Homes with the Guidance of the Quran</h3>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                We envision a global community of students who recite beautifully, understand deeply, and live gracefully by the Quran. Through modern tools and compassionate mentorship, we aim to make Quranic education inspiring, consistent, and life-changing.
              </p>
             
            </div>
          </div>
        </div>
      </section>

    

        {/* Meet Our Instructors */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="mb-8 sm:mb-12 lg:mb-16">
              <div className="text-secondary-600 font-medium mb-2 text-sm sm:text-base">Course Instructors</div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                Meet our Class Instructors
              </h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
              {instructors.map((instructor, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-3 sm:mb-4 rounded-full overflow-hidden shadow-lg">
                    <img 
                      src={instructor.image} 
                      alt={instructor.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1 text-xs sm:text-sm lg:text-base">{instructor.name}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">{instructor.position}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

       

        {/* Statistics Section */}
        {/* <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-4 text-blue-600">{stat.icon}</div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium text-xs sm:text-sm lg:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Call to Action */}
        <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden" style={{ background: 'var(--primary-color)' }}>
          {/* Background decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 right-10 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-20 left-10 w-12 h-12 sm:w-16 sm:h-16 bg-white/5 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-8 h-8 sm:w-12 sm:h-12 bg-white/8 rounded-full"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 min-h-[300px] flex items-center justify-center">
            <div className="max-w-3xl w-full text-center">
              <div className="text-white/80 mb-3 text-sm sm:text-base">Online Course</div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-white mb-6">
                Ready to dive in? Start your free Course Trail today.
              </h2>
              <div className="flex items-center justify-center">
                <Link
                  href="/courses"
                  className="rounded-lg font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all"
                  style={{
                    background: 'var(--secondary-color)',
                    color: '#ffffff',
                    padding: '0.875rem 1.75rem'
                  }}
                >
                  Explore Courses
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
