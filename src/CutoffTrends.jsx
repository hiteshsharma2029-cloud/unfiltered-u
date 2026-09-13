import React from 'react';

export default function CutoffTrends() {
  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      paddingLeft: '270px', /* Sidebar ki jagah chhodne ke liye */
      boxSizing: 'border-box', /* Ye right side se bahar nikalne nahi degi */
      overflow: 'hidden'
    }}>
      <iframe 
        src="/arnav_garg/index.html" 
        title="Cutoff Trends"
        style={{ 
          width: '100%', 
          height: '100%', 
          border: 'none', 
          display: 'block' 
        }}
      />
    </div>
  );
}