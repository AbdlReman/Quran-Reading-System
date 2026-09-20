import React from 'react';
import Link from 'next/link';

const EventsSection: React.FC = () => {
  const events = [
    {
      id: 1,
      date: "10",
      month: "January, 2022",
      title: "A Better Alternative to Grading Student writing",
      time: "9:00 AM - 1:00 PM",
      location: "New York, USA"
    },
    {
      id: 2,
      date: "14",
      month: "January, 2022",
      title: "Digital Learning Strategies for Modern Education",
      time: "2:00 PM - 4:00 PM",
      location: "London, UK"
    },
    {
      id: 3,
      date: "26",
      month: "January, 2022",
      title: "Innovative Teaching Methods Workshop",
      time: "10:30 AM - 12:30 PM",
      location: "Toronto, Canada"
    },
    {
      id: 4,
      date: "19",
      month: "January, 2022",
      title: "Student Engagement in Online Learning",
      time: "3:00 PM - 5:00 PM",
      location: "Sydney, Australia"
    }
  ];

  return (
    <section className="py-20">
      <div className="container">
        <div className="section-title">
          <h2>Upcoming Events</h2>
          <div className="section-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-8 mb-8">
          {events.map((event) => (
            <div key={event.id} className="card">
              <div className="card-content">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-secondary-600">{event.date}</div>
                  <div className="text-gray-600">{event.month}</div>
                </div>
                
                <h3 className="card-title mb-3">{event.title}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-sm">{event.time}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span className="text-sm">{event.location}</span>
                  </div>
                </div>
                
                <Link href="/about" className="card-link">Read More →</Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation dots */}
        <div className="flex justify-center gap-2">
          <div className="w-3 h-3 bg-secondary-600 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
