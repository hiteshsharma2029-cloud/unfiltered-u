import React, { useState } from 'react';
import './App.css';
import Login from './divy_abrol/Login';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import HostelSearch from './Hostelsearch.jsx';
import CutoffTrends from './CutoffTrends';
import Settings from './bhuvnesh/Settings'; 
import UniversityMatches from './divy_abrol/UniversityMatches';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  
  // 👇 1. NAYA STATE: User ki details save karne ke liye
  const [userData, setUserData] = useState(null); 
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery(''); 
  };

  if (!isLoggedIn) {
    // 👇 2. YAHAN CHANGE KIYA: Login se aane wale data ko save kiya
    return <Login onLogin={(data) => {
      setUserData(data); // Data save ho gaya
      setIsLoggedIn(true); // User login ho gaya
    }} />;
  }

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      
      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard />}
        
        {activeTab === 'matches' && <UniversityMatches />}
        
        {activeTab === 'hostels' && (
          <HostelSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        )}

        {activeTab === 'cutoff' && <CutoffTrends />}

        {activeTab === 'settings' && (
          <Settings 
            // 👇 3. YAHAN CHANGE KIYA: Settings ko user data pass kiya
            userData={userData} 
            onLogout={() => {
              setIsLoggedIn(false); 
              setUserData(null); // Logout hone par data delete kar diya
              setActiveTab('dashboard'); 
            }} 
          />
        )}
      </main>
    </div>
  );
}