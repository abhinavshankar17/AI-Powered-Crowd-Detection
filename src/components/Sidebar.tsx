import React from 'react';

type ScreenConfig = 'heatmap' | 'prediction' | 'admin';

interface SidebarProps {
    activeScreen: ScreenConfig;
    setActiveScreen: (screen: ScreenConfig) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeScreen, setActiveScreen }) => {
    const getBtnClass = (screen: ScreenConfig) => {
        return activeScreen === screen ? 'btn-primary' : 'btn-secondary';
    };

    return (
        <nav className="sidebar glass-panel" style={{ zIndex: 100 }}>
            {/* Brand area */}
            <h2 style={{ fontSize: '18px', marginBottom: '40px', fontWeight: 600 }}>
                Dashboard <br /><span className="text-gradient">Controls</span>
            </h2>

            {/* Navigation logic */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                <button
                    className={getBtnClass('heatmap')}
                    onClick={() => setActiveScreen('heatmap')}
                >
                    📍 Live Heatmap
                </button>
                <button
                    className={getBtnClass('prediction')}
                    onClick={() => setActiveScreen('prediction')}
                >
                    📈 Prediction Model
                </button>
                <button
                    className={getBtnClass('admin')}
                    onClick={() => setActiveScreen('admin')}
                >
                    ⚙️ Admin Console
                </button>
            </div>

            {/* Bottom context / user mode */}
            <div style={{
                marginTop: 'auto',
                paddingTop: '20px',
                borderTop: '1px solid var(--glass-border)',
                fontSize: '12px',
                color: 'var(--text-muted)'
            }}>
                System Version: 2.4.1 (Beta)<br />
                Role: <span style={{ color: 'var(--neon-blue)', fontWeight: 600 }}>Command Center</span>
            </div>
        </nav>
    );
};

export default Sidebar;
