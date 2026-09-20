import React from 'react';

const StatsSection: React.FC = () => {
  const stats = [
    {
      id: 1,
      number: "850",
      label: "QURAN MEMORIZERS"
    },
    {
      id: 2,
      number: "1200",
      label: "ACTIVE STUDENTS"
    },
    {
      id: 3,
      number: "45",
      label: "CERTIFIED TEACHERS"
    },
    {
      id: 4,
      number: "15",
      label: "YEARS OF EXCELLENCE"
    }
  ];

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.id} className="stat-item">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
