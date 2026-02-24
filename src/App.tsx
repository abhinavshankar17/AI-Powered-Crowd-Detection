import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import LiveHeatmap from './components/LiveHeatmap';
import FutureCrowdPrediction from './components/FutureCrowdPrediction';
import AdminDashboard from './components/AdminDashboard';
import './index.css';

type ScreenConfig = 'heatmap' | 'prediction' | 'admin';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<ScreenConfig>('heatmap');

  return (
    <div className="app-container">
      <Sidebar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
      
      <main className="main-content">
        <header className="header">
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>
              <span className="text-gradient">CrowdSense</span> AI
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
              Smart Concert Intelligence System
            </p>
          </div>
          
          <div className="live-indicator">
            <span className="dot-blinking"></span>
            LIVE MONITORING ACTIVE
          </div>
        </header>

        {/* Dynamic Screen Rendering */}
        {activeScreen === 'heatmap' && <LiveHeatmap />}
        {activeScreen === 'prediction' && <FutureCrowdPrediction />}
        {activeScreen === 'admin' && <AdminDashboard />}
      </main>
    </div>
  );
};

export default App;
