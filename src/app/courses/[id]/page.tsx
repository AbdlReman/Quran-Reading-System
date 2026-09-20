import React from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import coursesData from '../../data/courses.json';
import EnrollButton from '@/components/EnrollButton';

export default async function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const courseId = parseInt(id);
  
  // Find the course from the JSON data
  const course = coursesData.courses.find(c => c.id === courseId);
  
  // If course not found, show error or redirect
  if (!course) {
    return (
      <>
        <Header />
        <main className="py-20">
          <div className="container text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Course Not Found</h1>
            <p className="text-gray-600">The course you're looking for doesn't exist.</p>
            <Link href="/courses" className="text-emerald-600 hover:text-emerald-700 mt-4 inline-block">
              ← Back to Courses
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
                 {/* Hero Section */}
         <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100">
           <div className="container">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
               <div>
                 <div className="flex flex-wrap gap-2 mb-4">
                   <span className="text-xs sm:text-sm bg-emerald-100 text-emerald-600 px-2 sm:px-3 py-1 rounded-full font-medium">
                     {course.level}
                   </span>
                   <span className="text-xs sm:text-sm bg-blue-100 text-blue-600 px-2 sm:px-3 py-1 rounded-full">
                     {course.duration}
                   </span>
                 </div>
                 <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight">
                   {course.title}
                 </h1>
                 <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                   {course.subtitle}
                 </p>
                 <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                   <div className="flex items-center gap-2">
                     <div className="flex text-yellow-400">
                       {[...Array(5)].map((_, i) => (
                         <svg key={i} className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.floor(course.rating) ? 'fill-current' : 'fill-gray-300'}`} viewBox="0 0 20 20">
                           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                         </svg>
                       ))}
                     </div>
                     <span className="text-sm sm:text-base text-gray-600 font-medium">{course.rating} ({course.reviews} reviews)</span>
                   </div>
                   <div className="flex items-center gap-2 text-gray-600">
                     <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                     </svg>
                     <span className="text-sm sm:text-base">{course.students} students enrolled</span>
                   </div>
                 </div>
               </div>
               <div className="relative">
                 <img 
                   src={course.image} 
                   alt={course.title} 
                   className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl sm:rounded-2xl"></div>
               </div>
             </div>
           </div>
         </section>

                 {/* Course Details Grid */}
         <section className="py-12 sm:py-16 lg:py-20 bg-white">
           <div className="container">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
               {/* Main Content */}
               <div className="lg:col-span-2">
                 {/* What You'll Learn */}
                 <div className="mb-8 sm:mb-12">
                   <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">What You'll Learn</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                     {course.features.map((feature, index) => (
                       <div key={index} className="flex items-start gap-3">
                         <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                           <svg className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                           </svg>
                         </div>
                         <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                       </div>
                     ))}
                   </div>
                 </div>

                 {/* Course Description */}
                 <div className="mb-8 sm:mb-12">
                   <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Course Description</h2>
                   <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                     {course.description}
                   </p>
                 </div>

                 

                 {/* Requirements */}
                 <div className="mb-8 sm:mb-12">
                   <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Requirements</h2>
                   <ul className="space-y-2 sm:space-y-3">
                     {course.requirements.map((req, index) => (
                       <li key={index} className="flex items-center gap-3 text-sm sm:text-base text-gray-600">
                         <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                         </svg>
                         {req}
                       </li>
                     ))}
                   </ul>
                 </div>

                 {/* Learning Outcomes */}
                 <div className="mb-8 sm:mb-12">
                   <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Learning Outcomes</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                     {course.outcomes.map((outcome, index) => (
                       <div key={index} className="flex items-start gap-3">
                         <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                           <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                             <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                           </svg>
                         </div>
                         <span className="text-sm sm:text-base text-gray-700">{outcome}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>

               {/* Sidebar */}
               <div className="lg:col-span-1">
                 {/* Enrollment Card */}
                 <div className="sticky top-8">
                   <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
                     <div className="text-center mb-4 sm:mb-6">
                       <div className="flex items-center justify-center gap-2 mb-2">
                         <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                         </svg>
                         <span className="text-2xl sm:text-3xl font-bold text-emerald-600">Live Classes</span>
                       </div>
                       <div className="text-sm text-gray-600">Interactive online sessions</div>
                     </div>
                     
                     <EnrollButton courseId={course.id} />
                   </div>

                   
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
