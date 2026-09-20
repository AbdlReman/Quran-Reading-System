import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ServicesPage() {
  const services = [
    {
      id: 1,
      icon: "📖",
      title: "Quran Memorization (Hifz)",
      description: "Complete memorization of the Holy Quran with proper Tajweed and understanding. Our expert teachers guide students through the entire process of Hifz.",
      features: ["Individual attention", "Regular assessments", "Memorization techniques", "Understanding of meanings"],
      image: "/images/resources/service_2_1.jpg"
    },
    {
      id: 2,
      icon: "🎯",
      title: "Tajweed & Qira'ah",
      description: "Master the rules of Tajweed and learn different Qira'ah styles. Perfect your Quran recitation with expert guidance.",
      features: ["Tajweed rules", "Qira'ah styles", "Voice training", "Practical sessions"],
      image: "/images/resources/service_2_2.jpg"
    },
    {
      id: 3,
      icon: "🕌",
      title: "Islamic Studies",
      description: "Comprehensive study of Islamic jurisprudence, Hadith, Islamic history, and contemporary Islamic issues.",
      features: ["Fiqh studies", "Hadith sciences", "Islamic history", "Contemporary issues"],
      image: "/images/resources/service_2_3.jpg"
    },
    {
      id: 4,
      icon: "📚",
      title: "Arabic Language",
      description: "Learn classical Arabic grammar, vocabulary, and conversation skills for better understanding of Islamic texts.",
      features: ["Grammar lessons", "Vocabulary building", "Conversation practice", "Text analysis"],
      image: "/images/resources/feature-img2.jpg"
    },
    {
      id: 5,
      icon: "👨‍👩‍👧‍👦",
      title: "Family Programs",
      description: "Special programs designed for families to learn together, fostering Islamic values and knowledge.",
      features: ["Family Quran classes", "Islamic parenting", "Family activities", "Community building"],
      image: "/images/resources/gallery_1_3.jpg"
    },
    {
      id: 6,
      icon: "🌍",
      title: "Online Learning",
      description: "Flexible online learning options for students worldwide, with interactive sessions and digital resources.",
      features: ["Live online classes", "Digital resources", "Flexible scheduling", "Global access"],
      image: "/images/resources/gallery_1_4.jpg"
    }
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-emerald-50 to-green-50">
          <div className="container">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                Our Services
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive Islamic education services designed to nurture spiritual growth and academic excellence
              </p>
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">What We Offer</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                From Quran memorization to Islamic studies, we provide a complete range of educational services
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {services.map((service) => (
                <div key={service.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="p-8">
                      <div className="text-4xl mb-4">{service.icon}</div>
                      <h3 className="text-2xl font-semibold text-gray-800 mb-4">{service.title}</h3>
                      <p className="text-gray-600 mb-6">{service.description}</p>
                      
                      <ul className="space-y-2">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-gray-600">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-emerald-600">
                              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <button className="mt-6 bg-emerald-600 text-white py-2 px-6 rounded-md hover:bg-emerald-700 transition-colors">
                        Learn More
                      </button>
                    </div>
                    <div>
                      <img 
                        src={service.image} 
                        alt={service.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Our Services */}
        <section className="py-20 bg-gray-50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Our Services?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Experience excellence in Islamic education with our proven approach
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="text-4xl mb-4">👨‍🏫</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Expert Teachers</h3>
                <p className="text-gray-600">
                  Learn from certified Islamic scholars with years of teaching experience
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Proven Results</h3>
                <p className="text-gray-600">
                  Track record of successful students and positive learning outcomes
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Personalized Approach</h3>
                <p className="text-gray-600">
                  Individual attention and customized learning plans for each student
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-emerald-600">
          <div className="container">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Ready to Start Your Islamic Education Journey?</h2>
              <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
                Join thousands of students who have benefited from our comprehensive Islamic education programs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-emerald-600 py-3 px-8 rounded-md font-semibold hover:bg-gray-100 transition-colors">
                  Enroll Now
                </button>
                <button className="border-2 border-white text-white py-3 px-8 rounded-md font-semibold hover:bg-white hover:text-emerald-600 transition-colors">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
