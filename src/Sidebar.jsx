import React from 'react';
import './Sidebar.css';

export default function Sidebar({ activeTab, onTabChange }) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Project Dashboard',
      icon: '📊',
    },
    {
      id: 'matches',
      label: 'University Matches',
      icon: '🎯',
    },
    {
      id: 'hostels',
      label: 'Hostel Details',
      icon: '🏨',
    },
    {
      id: 'cutoff', 
      label: 'Cutoff Trends',
      icon: '📈',
    },
    {
      id: 'settings', 
      label: 'Settings',
      icon: '⚙️',
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">🎓</span>
          <span className="logo-text">UnfilteredU</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onTabChange(item.id)}
            aria-current={activeTab === item.id ? 'page' : undefined}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {activeTab === item.id && <span className="nav-indicator"></span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="footer-badge">
          <span className="badge-icon">✨</span>
          <p className="badge-text">Discover the perfect hostel for your university journey</p>
        </div>
      </div>
    </aside>
  );
}