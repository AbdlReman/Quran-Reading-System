import React from 'react';

const BlogSection: React.FC = () => {
  const blogs = [
    {
      id: 1,
      image: "/images/blog/1.jpg",
      category: "Education",
      title: "Rise future Schools & Corona Prevent to Growth",
      author: "Charlie Doyle",
      isNew: true
    },
    {
      id: 2,
      image: "/images/blog/2.jpg",
      category: "Innovation",
      title: "Echooling future Schools & social Innovation",
      author: "Sarah Johnson",
      isNew: true
    },
    {
      id: 3,
      image: "/images/blog/3.jpg",
      category: "Learning",
      title: "7 Learning system design tips for better eLearning",
      author: "Mike Chen",
      isNew: false
    },
    {
      id: 4,
      image: "/images/blog/1.jpg",
      category: "Technology",
      title: "Why schools should continue remote study",
      author: "Emma Wilson",
      isNew: false
    }
  ];

  return (
    <section className="py-20">
      <div className="container">
        <div className="section-title">
          <h2>Echooling News and Blogs</h2>
          <div className="section-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-8">
          {blogs.map((blog) => (
            <div key={blog.id} className="card">
              <div className="relative">
                <img src={blog.image} alt={blog.title} className="card-image" />
                {blog.isNew && (
                  <div className="absolute top-2 right-2 bg-secondary-600 text-white text-xs px-2 py-1 rounded">
                    New
                  </div>
                )}
              </div>
              <div className="card-content">
                <span className="text-xs text-gray-500 uppercase tracking-wide mb-2 block">
                  {blog.category}
                </span>
                <h3 className="card-title mb-3">{blog.title}</h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-sm">{blog.author}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
