import React from 'react';
import Link from 'next/link';
import coursesData from '../../data/courses.json';

const PopularCoursesSection: React.FC = () => {
  // Get first 3 courses from the JSON data
  const courses = coursesData.courses.slice(0, 3);

  return (
    <section className="py-20">
      <div className="container">
        <div className="section-title">
          <h2>Popular Islamic Courses</h2>
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
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-sm">{course.students} Students</span>
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
  );
};

export default PopularCoursesSection;
