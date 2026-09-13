import React from 'react';
import './Dashboard.css';

export default function Dashboard() {
  const infoCards = [
    {
      id: 1,
      title: 'Important Features',
      icon: '⚡',
      content: [
        '🔍 Advanced Hostel Search & Filtering',
        '💰 Transparent Pricing & Fee Breakdown',
        '🏠 Real-time Availability Tracking',
        '📱 Mobile-Friendly Interface',
        '⭐ Student Reviews & Ratings',
        '🗺️ Location-Based Recommendations',
      ],
    },
    {
      id: 2,
      title: 'How to Use',
      icon: '📖',
      content: [
        '1️⃣ Navigate to "Hostel Details" tab',
        '2️⃣ Use the search bar to find hostels',
        '3️⃣ Filter by university or location',
        '4️⃣ Review detailed hostel information',
        '5️⃣ Check PG alternatives nearby',
        '6️⃣ Compare facilities & rates easily',
      ],
    },
    {
      id: 3,
      title: 'Project Impact',
      icon: '🎯',
      content: [
        '✓ Saves students 50+ hours of research',
        '✓ Transparent pricing for budgeting',
        '✓ Reduces housing-related stress',
        '✓ Connects students with communities',
        '✓ Supports local hostel businesses',
        '✓ Creates a reliable information hub',
      ],
    },
  ];

  return (
    <div className="dashboard">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Find Your Perfect <span className="highlight">Student Haven</span>
          </h1>
          <p className="hero-subtitle">
            Navigating hostel and PG options shouldn't be overwhelming. StudentHub is your trusted companion for discovering affordable, safe, and comfortable accommodations near your university. We've curated the best options so you can focus on your studies, not your search.
          </p>
          <div className="hero-cta">
            <button className="cta-button primary">Explore Hostels</button>
            <button className="cta-button secondary">Learn More</button>
          </div>
        </div>
        <div className="hero-image">
          <img
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
          alt="Project Overview"
          className="hero-image-content"
          />
        </div>
      </section>

      {/* INFO CARDS SECTION */}
      <section className="info-section">
        <h2 className="section-title">Why Choose UnfilteredU?</h2>
        <div className="cards-grid">
          {infoCards.map((card, index) => (
            <div
              key={card.id}
              className="info-card"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="card-header">
                <span className="card-icon">{card.icon}</span>
                <h3 className="card-title">{card.title}</h3>
              </div>
              <ul className="card-content">
                {card.content.map((item, idx) => (
                  <li key={idx} className="content-item">
                    {item}
                  </li>
                ))}
              </ul>
              <div className="card-footer">
                <div className="card-badge">Verified</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="stats-section">
        <div className="stat-card">
          <h3 className="stat-number">500+</h3>
          <p className="stat-label">Hostels Listed</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-number">50K+</h3>
          <p className="stat-label">Students Helped</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-number">25+</h3>
          <p className="stat-label">Universities</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-number">4.8★</h3>
          <p className="stat-label">Average Rating</p>
        </div>
      </section>
    </div>
  );
}