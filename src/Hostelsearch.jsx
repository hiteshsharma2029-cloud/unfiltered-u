import React, { useState, useMemo } from 'react';
import './HostelSearch.css';

export default function HostelSearch({ searchQuery, setSearchQuery }) {
  const hostelData = [
    {
      id: 1,
      name: 'Franklin Hostel',
      university: 'Chitkara University',
      rating: 4.8,
      reviews: 245,
      // 👇 Yahan image ka path change kiya gaya hai
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
      facilities: [
        '✓ 4-Seater Rooms with Attached Washroom',
        '✓ 24/7 Security & CCTV Surveillance',
        '✓ WiFi & High-Speed Internet',
        '✓ Hot Water & Daily Cleaning',
        '✓ Common Study Area & Library',
        '✓ Power Backup (Inverter)',
      ],
      rates: {
        fourSeater: '₹8,500/month',
        doubleRoom: '₹12,000/month',
        singleRoom: '₹15,000/month',
      },
      nearbyPG: [
        { name: 'Comfort Zone PG', rate: '₹7,500-9,000/month' },
        { name: 'Prime Living Co.', rate: '₹8,000-10,500/month' },
      ],
    },
    {
      id: 2,
      name: 'Harmony Heights',
      university: 'Chandigarh University',
      rating: 4.6,
      reviews: 189,
      // 👇 Updated Image Path
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      facilities: [
        '✓ Spacious Rooms (3-4 Sharing)',
        '✓ In-House Cafeteria',
        '✓ Laundry Service Available',
        '✓ AC & Cooler Facilities',
        '✓ Sports & Recreation Area',
        '✓ Emergency Medical Support',
      ],
      rates: {
        fourSeater: '₹7,500/month',
        doubleRoom: '₹10,500/month',
        singleRoom: '₹13,500/month',
      },
      nearbyPG: [
        { name: 'Green Space Living', rate: '₹6,500-8,500/month' },
        { name: 'Urban Nest PG', rate: '₹7,000-9,000/month' },
      ],
    },
    {
      id: 3,
      name: 'Scholar\'s Rest',
      university: 'Punjabi University',
      rating: 4.5,
      reviews: 156,
      // 👇 Updated Image Path
      image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
      facilities: [
        '✓ Budget-Friendly Options',
        '✓ Shared Kitchen Facilities',
        '✓ Quiet Study Environment',
        '✓ Broadband Connection',
        '✓ Regular Maintenance & Repairs',
        '✓ Guest Reception Area',
      ],
      rates: {
        fourSeater: '₹6,500/month',
        doubleRoom: '₹9,000/month',
        singleRoom: '₹11,500/month',
      },
      nearbyPG: [
        { name: 'Budget Stays', rate: '₹5,500-7,000/month' },
        { name: 'Student Quarters', rate: '₹6,000-7,500/month' },
      ],
    },
    {
      id: 4,
      name: 'Elite Residency',
      university: 'Panjab University',
      rating: 4.7,
      reviews: 312,
      // 👇 Updated Image Path
      image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
      facilities: [
        '✓ Premium Room Options',
        '✓ Air-Conditioned Rooms',
        '✓ Gourmet Dining Services',
        '✓ Personal Storage Lockers',
        '✓ Yoga & Fitness Center',
        '✓ Concierge Service 24/7',
      ],
      rates: {
        fourSeater: '₹10,000/month',
        doubleRoom: '₹14,000/month',
        singleRoom: '₹18,000/month',
      },
      nearbyPG: [
        { name: 'Luxury Living PG', rate: '₹9,500-12,000/month' },
        { name: 'Premium Stays', rate: '₹10,000-13,000/month' },
      ],
    },
    {
      id: 5,
      name: 'Unity Hostel',
      university: 'Chitkara University',
      rating: 4.4,
      reviews: 128,
      // 👇 Updated Image Path
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      facilities: [
        '✓ Community Focused Living',
        '✓ Social Events & Gatherings',
        '✓ Flexible Booking Terms',
        '✓ Maintenance & Support Staff',
        '✓ Safe Deposit Boxes',
        '✓ Common Kitchen Access',
      ],
      rates: {
        fourSeater: '₹7,000/month',
        doubleRoom: '₹10,000/month',
        singleRoom: '₹12,500/month',
      },
      nearbyPG: [
        { name: 'Social Living Spaces', rate: '₹6,500-8,000/month' },
        { name: 'Shared Homes', rate: '₹7,000-8,500/month' },
      ],
    },
  ];

  // Filter hostels based on search query
  const filteredHostels = useMemo(() => {
    if (!searchQuery.trim()) return hostelData;
    
    const query = searchQuery.toLowerCase();
    return hostelData.filter(
      (hostel) =>
        hostel.name.toLowerCase().includes(query) ||
        hostel.university.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="hostel-search">
      {/* SEARCH HEADER */}
      <section className="search-header">
        <div className="search-container">
          <h1 className="search-title">Find Your Ideal Hostel</h1>
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search by hostel name or university..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <p className="search-hint">
            Found <span className="result-count">{filteredHostels.length}</span> hostel{filteredHostels.length !== 1 ? 's' : ''}
          </p>
        </div>
      </section>

      {/* HOSTELS GRID */}
      <section className="hostels-section">
        {filteredHostels.length > 0 ? (
          <div className="hostels-grid">
            {filteredHostels.map((hostel, index) => (
              <div
                key={hostel.id}
                className="hostel-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Card Image */}
                <div className="hostel-image">
                  <img
                    src={hostel.image}
                    alt={hostel.name}
                    className="hostel-photo"
                  />
                  <div className="rating-badge">
                    <span className="rating-star">⭐</span>
                    <span className="rating-value">{hostel.rating}</span>
                    <span className="rating-count">({hostel.reviews})</span>
                  </div>
                </div>

                {/* Card Header */}
                <div className="hostel-header">
                  <h3 className="hostel-name">{hostel.name}</h3>
                  <p className="hostel-university">📍 {hostel.university}</p>
                </div>

                {/* Facilities */}
                <div className="hostel-facilities">
                  <h4 className="facilities-title">Facilities & Rates:</h4>
                  <ul className="facilities-list">
                    {hostel.facilities.map((facility, idx) => (
                      <li key={idx} className="facility-item">
                        {facility}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Rates */}
                <div className="hostel-rates">
                  <div className="rate-item">
                    <span className="rate-type">4-Seater Room</span>
                    <span className="rate-price">{hostel.rates.fourSeater}</span>
                  </div>
                  <div className="rate-item">
                    <span className="rate-type">Double Room</span>
                    <span className="rate-price">{hostel.rates.doubleRoom}</span>
                  </div>
                  <div className="rate-item">
                    <span className="rate-type">Single Room</span>
                    <span className="rate-price">{hostel.rates.singleRoom}</span>
                  </div>
                </div>

                {/* Nearby PG */}
                <div className="nearby-pg">
                  <h4 className="nearby-title">Nearby PG Alternatives:</h4>
                  {hostel.nearbyPG.map((pg, idx) => (
                    <div key={idx} className="pg-item">
                      <span className="pg-name">• {pg.name}</span>
                      <span className="pg-rate">{pg.rate}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <button className="enquire-btn">Get More Info</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <span className="no-results-icon">🔍</span>
            <h3 className="no-results-title">No Hostels Found</h3>
            <p className="no-results-text">
              Try searching with different keywords or check back later for more options.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}