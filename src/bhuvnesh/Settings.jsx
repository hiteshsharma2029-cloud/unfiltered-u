import React, { useState, useEffect } from 'react';
import './Settings.css';

// 👇 1. YAHAN CHANGE KIYA HAI: onLogout ke sath userData prop add kiya
export default function Settings({ onLogout, userData }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'light';
  });

  const [textSize, setTextSize] = useState(() => {
    return localStorage.getItem('app-text-size') || 'medium';
  });

  // 👇 2. YAHAN CHANGE KIYA HAI: Hardcoded naam hata kar userData se link kar diya
  const [profile, setProfile] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    phone: '', // Login form mein phone number nahi tha, isliye ise khali choda hai
    university: userData?.university || ''
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-text-size', textSize);
    localStorage.setItem('app-text-size', textSize);
  }, [textSize]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="settings-container">
      {/* HEADER SECTION */}
      <section className="settings-header">
        <div className="header-content">
          <h1 className="settings-title">Account Settings</h1>
          <p className="settings-subtitle">Manage your profile, preferences, and account security.</p>
        </div>
      </section>

      <div className="settings-content">
        {/* PROFILE SECTION */}
        <div className="settings-section animation-delay-1">
          <div className="section-header">
            <span className="section-icon">👤</span>
            <h2 className="section-title">Profile Details</h2>
          </div>
          
          <form className="settings-form" onSubmit={handleSaveProfile}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" name="name" className="settings-input" value={profile.name} onChange={handleProfileChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" name="email" className="settings-input" value={profile.email} onChange={handleProfileChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" name="phone" className="settings-input" value={profile.phone} onChange={handleProfileChange} />
              </div>
              <div className="form-group">
                <label className="form-label">University</label>
                <input type="text" name="university" className="settings-input" value={profile.university} onChange={handleProfileChange} />
              </div>
            </div>
            <button type="submit" className="save-btn">Save Changes</button>
          </form>
        </div>

        {/* PREFERENCES SECTION */}
        <div className="settings-section animation-delay-2">
          <div className="section-header">
            <span className="section-icon">🎨</span>
            <h2 className="section-title">App Preferences</h2>
          </div>
          
          <div className="preferences-grid">
            {/* Theme Toggle */}
            <div className="preference-item">
              <div>
                <h3 className="preference-title">Theme Mode</h3>
                <p className="preference-desc">Choose how the app looks for you.</p>
              </div>
              <div className="toggle-group">
                <button className={`toggle-btn ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')}>☀️ Light</button>
                <button className={`toggle-btn ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')}>🌙 Dark</button>
              </div>
            </div>

            {/* Text Size Toggle */}
            <div className="preference-item">
              <div>
                <h3 className="preference-title">Text Size</h3>
                <p className="preference-desc">Adjust the interface text size.</p>
              </div>
              <div className="toggle-group">
                <button className={`toggle-btn ${textSize === 'small' ? 'active' : ''}`} onClick={() => setTextSize('small')}>Aa</button>
                <button className={`toggle-btn ${textSize === 'medium' ? 'active' : ''}`} onClick={() => setTextSize('medium')}>Aa</button>
                <button className={`toggle-btn ${textSize === 'large' ? 'active' : ''}`} onClick={() => setTextSize('large')} style={{ fontSize: '18px' }}>Aa</button>
              </div>
            </div>
          </div>
        </div>

        {/* ACCOUNT ACTIONS SECTION */}
        <div className="settings-section animation-delay-3">
          <div className="section-header">
            <span className="section-icon">🛡️</span>
            <h2 className="section-title">Account Actions</h2>
          </div>
          <div className="account-actions">
            <p className="preference-desc">You will need to login again if you log out.</p>
            <button className="logout-btn" onClick={handleLogout}>
              <span className="logout-icon">🚪</span> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}