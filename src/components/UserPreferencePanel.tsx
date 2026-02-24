import React, { useState } from 'react';

interface UserPreferencePanelProps {
    onHighlightZone: (zoneId: string | null) => void;
    zonesData: { id: string, density: number }[];
}

const reqMockData = {
    'Best View': { id: 'Z-2', name: 'Front Stage (Right)', density: 75, comfort: 8.5, walkingTime: 3 },
    'Least Crowded': { id: 'Z-4', name: 'Back Perimeter', density: 25, comfort: 9.8, walkingTime: 12 },
    'Fast Exit': { id: 'Z-3', name: 'Middle Ground', density: 60, comfort: 7.2, walkingTime: 5 },
    'Shortest Food Queue': { id: 'Z-1', name: 'Front Stage (Left)', density: 92, comfort: 4.1, walkingTime: 8 },
};

const UserPreferencePanel: React.FC<UserPreferencePanelProps> = ({ onHighlightZone, zonesData }) => {
    const [activePref, setActivePref] = useState<keyof typeof reqMockData | null>(null);

    const handleSelect = (pref: keyof typeof reqMockData) => {
        setActivePref(pref);
        onHighlightZone(reqMockData[pref].id);
    };

    const clearSelection = () => {
        setActivePref(null);
        onHighlightZone(null);
    };

    return (
        <div className="glass-panel" style={{ width: '300px', padding: '20px', borderRadius: '16px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>AI Recommendations</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                {Object.keys(reqMockData).map((pref) => (
                    <button
                        key={pref}
                        className={`btn-secondary ${activePref === pref ? 'btn-primary' : ''}`}
                        style={{ fontSize: '12px', padding: '8px' }}
                        onClick={() => handleSelect(pref as keyof typeof reqMockData)}
                    >
                        {pref}
                    </button>
                ))}
            </div>

            {activePref && (
                <div className="animate-fade-in" style={{
                    background: 'rgba(255,255,255,0.05)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid var(--glass-border)',
                }}>
                    <h4 className="text-gradient" style={{ marginBottom: '12px' }}>{reqMockData[activePref].name}</h4>
                    <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Density:</span>
                            <span>{zonesData.find(z => z.id === reqMockData[activePref].id)?.density ?? reqMockData[activePref].density}%</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Comfort Score:</span>
                            <span>{reqMockData[activePref].comfort} / 10</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Walking Time:</span>
                            <span>{reqMockData[activePref].walkingTime} mins</span>
                        </div>
                    </div>
                    <button
                        style={{
                            marginTop: '12px',
                            width: '100%',
                            background: 'transparent',
                            color: 'var(--text-muted)',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '12px',
                            textDecoration: 'underline'
                        }}
                        onClick={clearSelection}
                    >
                        Clear Selection
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserPreferencePanel;
