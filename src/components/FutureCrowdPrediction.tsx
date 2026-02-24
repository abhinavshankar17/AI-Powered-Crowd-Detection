import React from 'react';

const mockDataPoints = [
    { time: '10:00', density: 60 },
    { time: '10:05', density: 65 },
    { time: '10:10', density: 72 },
    { time: '10:15', density: 85 }, // Surge prediction
    { time: '10:20', density: 92 },
    { time: '10:25', density: 95 }
];

const FutureCrowdPrediction: React.FC = () => {
    const maxDensity = 100;
    const chartHeight = 300;
    const chartWidth = 700;
    const padding = 40;

    const points = mockDataPoints.map((d, i) => {
        const x = padding + (i / (mockDataPoints.length - 1)) * (chartWidth - 2 * padding);
        const y = chartHeight - padding - (d.density / maxDensity) * (chartHeight - 2 * padding);
        return `${x},${y}`;
    }).join(' L ');

    const pathD = `M ${points.split(' L ')[0]} L ${points}`;

    // Fill gradient path
    const fillPoints = `${points} L ${chartWidth - padding},${chartHeight - padding} L ${padding},${chartHeight - padding} Z`;
    const fillPathD = `M ${points.split(' L ')[0]} L ${fillPoints}`;

    return (
        <div style={{ padding: '100px 32px 32px 32px', height: '100%', width: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Predictive AI Engine</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Forecasting venue congestion in real-time.</p>

            <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px', position: 'relative' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '24px' }}>Surge Event: Front Stage Area</h3>

                {/* SVG Chart */}
                <div style={{ width: '100%', overflowX: 'auto' }}>
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', height: 'auto', minWidth: '600px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }}>
                        <defs>
                            <linearGradient id="lineColor" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="var(--neon-blue)" />
                                <stop offset="100%" stopColor="var(--neon-purple)" />
                            </linearGradient>
                            <linearGradient id="fillColor" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="var(--neon-purple)" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="var(--neon-blue)" stopOpacity="0.01" />
                            </linearGradient>
                        </defs>

                        {/* Grid lines */}
                        {[0, 1, 2, 3, 4].map((i) => (
                            <line key={i} x1={padding} y1={padding + i * ((chartHeight - 2 * padding) / 4)} x2={chartWidth - padding} y2={padding + i * ((chartHeight - 2 * padding) / 4)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                        ))}

                        {/* Filled area */}
                        <path d={fillPathD} fill="url(#fillColor)" className="animate-fade-in" />

                        {/* Line */}
                        <path d={pathD} fill="none" stroke="url(#lineColor)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                            style={{ filter: 'drop-shadow(0 0 8px rgba(176,38,255,0.6))' }} className="animate-fade-in" />

                        {/* Data points */}
                        {mockDataPoints.map((d, i) => {
                            const x = padding + (i / (mockDataPoints.length - 1)) * (chartWidth - 2 * padding);
                            const y = chartHeight - padding - (d.density / maxDensity) * (chartHeight - 2 * padding);
                            return (
                                <g key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                                    <circle cx={x} cy={y} r="5" fill="#fff" stroke="var(--neon-purple)" strokeWidth="2" />
                                    <text x={x} y={y - 15} fill="var(--text-main)" fontSize="12" textAnchor="middle" fontWeight="bold">{d.density}%</text>
                                    <text x={x} y={chartHeight - 15} fill="var(--text-muted)" fontSize="12" textAnchor="middle">{d.time}</text>
                                </g>
                            );
                        })}

                        {/* Warning indicator line */}
                        <line
                            x1={padding + (3 / 5) * (chartWidth - 2 * padding)}
                            y1={padding}
                            x2={padding + (3 / 5) * (chartWidth - 2 * padding)}
                            y2={chartHeight - padding}
                            stroke="#ff3232" strokeWidth="2" strokeDasharray="4 4"
                        />
                    </svg>
                </div>

            </div>

            <div style={{
                background: 'rgba(255, 50, 50, 0.1)',
                border: '1px solid rgba(255, 50, 50, 0.3)',
                padding: '20px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                boxShadow: '0 0 20px rgba(255, 50, 50, 0.15)'
            }} className="animate-fade-in">
                <div style={{
                    fontSize: '24px',
                    background: 'rgba(255, 50, 50, 0.2)',
                    width: '48px', height: '48px',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    ⚠️
                </div>
                <div>
                    <h4 style={{ color: '#ff5555', marginBottom: '4px', fontSize: '18px', fontWeight: 600 }}>Imminent Surge Detected</h4>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Zone B3 expected to reach <strong style={{ color: '#fff' }}>high congestion</strong> in <strong>8 minutes</strong>. Directing security team recommended.
                    </p>
                </div>
                <button className="btn-secondary" style={{ marginLeft: 'auto', border: '1px solid #ff5555', color: '#ff5555' }}>
                    Acknowledge
                </button>
            </div>
        </div>
    );
};

export default FutureCrowdPrediction;
