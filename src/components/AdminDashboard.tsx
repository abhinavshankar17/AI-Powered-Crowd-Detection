import React, { useState } from 'react';

const AdminDashboard: React.FC = () => {
    const [emergencyMode, setEmergencyMode] = useState(false);

    const zones = [
        { name: 'VIP Section A', density: 34, risk: 'Low', color: 'var(--zone-green)' },
        { name: 'General Admission Left', density: 78, risk: 'High', color: 'var(--zone-red)' },
        { name: 'General Admission Center', density: 65, risk: 'Medium', color: 'var(--zone-yellow)' },
        { name: 'Merch Stand Queue', density: 90, risk: 'Critical', color: '#ff1a1a' },
    ];

    const alerts = [
        { id: 1, type: 'CRITICAL', msg: 'Bottleneck forming at Exit B. Dispatching stewards.', time: 'Just now' },
        { id: 2, type: 'WARNING', msg: 'Density in GA Left exceeding 75%.', time: '5m ago' },
        { id: 3, type: 'INFO', msg: 'Drone 3 battery at 20%. Returning to base.', time: '12m ago' },
    ];

    const riskScore = 68; // Global Risk Score

    return (
        <div style={{ padding: '100px 32px 32px 32px', height: '100%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '28px', fontWeight: 700 }}>Venue Command Center</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Top-level oversight of concert grounds</p>
                </div>

                <button
                    className="btn-primary"
                    style={{
                        background: emergencyMode ? '#ff1a1a' : 'transparent',
                        border: emergencyMode ? 'none' : '1px solid #ff1a1a',
                        color: emergencyMode ? '#fff' : '#ff1a1a',
                        boxShadow: emergencyMode ? '0 0 20px rgba(255, 26, 26, 0.4)' : 'none',
                        transition: 'all 0.3s ease',
                        padding: '12px 24px',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                    onClick={() => setEmergencyMode(!emergencyMode)}
                >
                    {emergencyMode ? '🛑 CANCEL EMERGENCY' : '🚨 ACTIVATE EMERGENCY MODE'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 2fr', gap: '24px' }}>

                {/* Risk Score Meter */}
                <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '18px', marginBottom: '24px', fontWeight: 600 }}>Global Risk Index</h3>
                    <div style={{
                        position: 'relative',
                        width: '180px',
                        height: '180px',
                        margin: '0 auto',
                        borderRadius: '50%',
                        background: `conic-gradient(var(--zone-yellow) ${riskScore}%, rgba(255,255,255,0.05) 0)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 30px rgba(255, 210, 50, 0.1)',
                        marginBottom: '16px'
                    }}>
                        <div style={{
                            width: '160px',
                            height: '160px',
                            background: 'var(--bg-dark)',
                            borderRadius: '50%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <span style={{ fontSize: '48px', fontWeight: 700, color: '#fff' }}>{riskScore}</span>
                            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/ 100</span>
                        </div>
                    </div>
                    <p style={{ color: 'var(--zone-yellow)', fontWeight: 600 }}>ELEVATED RISK</p>
                </div>

                {/* Zone Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {zones.map(zone => (
                        <div key={zone.name} className="glass-panel animate-fade-in" style={{ padding: '20px', borderLeft: `4px solid ${zone.color}` }}>
                            <h4 style={{ fontSize: '16px', marginBottom: '12px' }}>{zone.name}</h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                                <div>
                                    <div style={{ fontSize: '28px', fontWeight: 700, lineHeight: 1 }}>{zone.density}%</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Congestion</div>
                                </div>
                                <div style={{
                                    background: `${zone.color}22`,
                                    color: zone.color,
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: 600
                                }}>
                                    {zone.risk}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Notifications */}
            <div className="glass-panel" style={{ marginTop: '24px', padding: '24px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: 600 }}>Live Incident Feed</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {alerts.map(a => (
                        <div key={a.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '16px',
                            background: 'rgba(255,255,255,0.02)',
                            borderRadius: '8px',
                            border: '1px solid var(--glass-border)'
                        }}>
                            <div style={{
                                minWidth: '80px',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: a.type === 'CRITICAL' ? '#ff1a1a' : a.type === 'WARNING' ? 'var(--zone-yellow)' : 'var(--neon-blue)'
                            }}>
                                [ {a.type} ]
                            </div>
                            <div style={{ flex: 1, fontSize: '14px', color: 'var(--text-main)' }}>{a.msg}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{a.time}</div>
                        </div>
                    ))}
                </div>
            </div>

            {emergencyMode && (
                <div className="animate-fade-in" style={{
                    position: 'fixed',
                    top: 0, left: 0, width: '100vw', height: '100vh',
                    background: 'rgba(255,0,0,0.1)',
                    border: '10px solid red',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <h1 style={{ color: 'red', fontSize: '100px', fontWeight: 900, textTransform: 'uppercase', mixBlendMode: 'overlay', animation: 'blink 1s infinite' }}>EMERGENCY ACTIVE</h1>
                </div>
            )}

        </div>
    );
};

export default AdminDashboard;
