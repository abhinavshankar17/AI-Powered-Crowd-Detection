import React, { useEffect, useRef, useState } from 'react';
import UserPreferencePanel from './UserPreferencePanel';

const zones = [
    { id: 'Z-1', name: 'Front Stage (Left)', color: 'rgba(255, 50, 50, 0.4)', highlightColor: 'rgba(255, 50, 50, 0.8)', x: 100, y: 150, width: 250, height: 200, density: 92, status: 'High Risk', count: 420, limit: 400 },
    { id: 'Z-2', name: 'Front Stage (Right)', color: 'rgba(255, 210, 50, 0.4)', highlightColor: 'rgba(255, 210, 50, 0.8)', x: 400, y: 150, width: 250, height: 200, density: 75, status: 'Medium', count: 320, limit: 400 },
    { id: 'Z-3', name: 'Middle Ground', color: 'rgba(255, 210, 50, 0.4)', highlightColor: 'rgba(255, 210, 50, 0.8)', x: 100, y: 400, width: 550, height: 150, density: 60, status: 'Medium', count: 850, limit: 1200 },
    { id: 'Z-4', name: 'Back Perimeter', color: 'rgba(30, 255, 120, 0.4)', highlightColor: 'rgba(30, 255, 120, 0.8)', x: 100, y: 600, width: 550, height: 100, density: 25, status: 'Low Density', count: 210, limit: 500 },
];

const LiveHeatmap: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [highlightZoneId, setHighlightZoneId] = useState<string | null>(null);

    // Store highlight ID in a ref so the animation loop always sees the latest without resetting the loop
    const highlightZoneRef = useRef<string | null>(highlightZoneId);
    useEffect(() => {
        highlightZoneRef.current = highlightZoneId;
    }, [highlightZoneId]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animId: number;
        let particles: { x: number; y: number; vx: number; vy: number; zone: typeof zones[0] }[] = [];

        // Heatmap generation tools
        const paletteCanvas = document.createElement('canvas');
        paletteCanvas.width = 256;
        paletteCanvas.height = 1;
        const paletteCtx = paletteCanvas.getContext('2d');
        if (paletteCtx) {
            const grad = paletteCtx.createLinearGradient(0, 0, 256, 0);
            grad.addColorStop(0, 'rgba(0, 0, 255, 0)');
            grad.addColorStop(0.35, 'rgba(0, 255, 255, 0.4)');
            grad.addColorStop(0.65, 'rgba(0, 255, 0, 0.7)');
            grad.addColorStop(0.85, 'rgba(255, 255, 0, 0.9)');
            grad.addColorStop(1, 'rgba(255, 0, 0, 1)');
            paletteCtx.fillStyle = grad;
            paletteCtx.fillRect(0, 0, 256, 1);
        }
        const palette = paletteCtx ? paletteCtx.getImageData(0, 0, 256, 1).data : new Uint8ClampedArray(1024);

        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = 800; // Base coords mapped
        offscreenCanvas.height = 800;
        const offCtx = offscreenCanvas.getContext('2d');

        let lastHeatmapUpdate = 0;

        const updateHeatmap = () => {
            if (!offCtx) return;
            offCtx.clearRect(0, 0, 800, 800);

            // Draw particles as blurred black shapes for alpha
            particles.forEach(p => {
                const gradient = offCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 40);
                gradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)'); // Increased alpha for red spots
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                offCtx.fillStyle = gradient;
                offCtx.beginPath();
                offCtx.arc(p.x, p.y, 40, 0, Math.PI * 2);
                offCtx.fill();
            });

            // Map alpha pixel buffer to gradient colors
            const id = offCtx.getImageData(0, 0, 800, 800);
            const data = id.data;
            for (let i = 0; i < data.length; i += 4) {
                const alpha = data[i + 3];
                if (alpha > 0) {
                    const offset = alpha * 4;
                    data[i] = palette[offset];
                    data[i + 1] = palette[offset + 1];
                    data[i + 2] = palette[offset + 2];
                    data[i + 3] = palette[offset + 3];
                }
            }
            offCtx.putImageData(id, 0, 0);
        };

        // Initialize random dots inside zones based on density
        zones.forEach(zone => {
            const pCount = Math.floor((zone.density / 100) * 100); // 1 particle per % density
            for (let i = 0; i < pCount; i++) {
                particles.push({
                    x: zone.x + Math.random() * zone.width,
                    y: zone.y + Math.random() * zone.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    zone: zone,
                });
            }
        });

        let lastCountUpdate = 0;

        const draw = () => {
            const now = Date.now();
            if (now - lastHeatmapUpdate > 15000) {
                updateHeatmap();
                lastHeatmapUpdate = now;
            }

            if (now - lastCountUpdate > 2000) {
                zones.forEach(zone => {
                    zone.count += Math.floor(Math.random() * 5) - 2;
                    if (zone.count < 0) zone.count = 0;
                });
                lastCountUpdate = now;
            }

            // Resize
            const rect = canvas.getBoundingClientRect();
            if (canvas.width !== rect.width || canvas.height !== rect.height) {
                canvas.width = rect.width;
                canvas.height = rect.height;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Scale to fit center roughly (hardcoded for 800x800 base layout)
            ctx.save();
            const scaleX = canvas.width / 800;
            const scaleY = canvas.height / 800;
            const scale = Math.min(scaleX, scaleY) * 0.9;
            const offsetX = (canvas.width - 800 * scale) / 2;
            const offsetY = (canvas.height - 800 * scale) / 2;

            ctx.translate(offsetX, offsetY);
            ctx.scale(scale, scale);

            // Draw stage
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(250, 40, 250, 80, 10);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#fff';
            ctx.font = '20px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('MAIN STAGE', 375, 85);

            // Clip to zone boxes and draw generated Heatmap from offscreen canvas FIRST
            ctx.save();
            ctx.beginPath();
            zones.forEach(zone => {
                ctx.rect(zone.x, zone.y, zone.width, zone.height);
            });
            ctx.clip();
            ctx.drawImage(offscreenCanvas, 0, 0);
            ctx.restore();

            // Draw Zones (Faint transparent overlay on top of heatmap + Borders)
            zones.forEach(zone => {
                const overLimit = zone.count > zone.limit;

                // Glowing effect if highlighted
                if (highlightZoneRef.current === zone.id) {
                    // Pulsing effect using Math.sin
                    const pulse = (Math.sin(Date.now() / 200) + 1) / 2; // 0 to 1
                    ctx.shadowColor = '#00f0ff';
                    ctx.shadowBlur = 30 + pulse * 20;
                    ctx.fillStyle = `rgba(0, 240, 255, ${0.1 + pulse * 0.1})`;
                    ctx.strokeStyle = '#00f0ff';
                    ctx.lineWidth = 3;
                    ctx.setLineDash([15, 10]);
                    ctx.lineDashOffset = -Date.now() / 30; // marching ants animation
                } else {
                    ctx.shadowColor = 'transparent';
                    ctx.shadowBlur = 0;
                    ctx.fillStyle = overLimit ? 'rgba(255, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.02)';
                    ctx.strokeStyle = overLimit ? '#ff1a1a' : '#ffffff22';
                    ctx.lineWidth = overLimit ? 2 : 1;
                    ctx.setLineDash([]);
                }

                ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
                ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
                ctx.setLineDash([]); // reset dash right after stroke

                // Custom HUD target corners for the selected area
                if (highlightZoneRef.current === zone.id) {
                    ctx.lineWidth = 4;
                    ctx.strokeStyle = '#fff';
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#00f0ff';
                    const length = 20; // bracket arm length
                    const offset = 8; // distance from box edge

                    ctx.beginPath();
                    // Top Left
                    ctx.moveTo(zone.x - offset, zone.y - offset + length);
                    ctx.lineTo(zone.x - offset, zone.y - offset);
                    ctx.lineTo(zone.x - offset + length, zone.y - offset);
                    // Top Right
                    ctx.moveTo(zone.x + zone.width + offset - length, zone.y - offset);
                    ctx.lineTo(zone.x + zone.width + offset, zone.y - offset);
                    ctx.lineTo(zone.x + zone.width + offset, zone.y - offset + length);
                    // Bottom Right
                    ctx.moveTo(zone.x + zone.width + offset, zone.y + zone.height + offset - length);
                    ctx.lineTo(zone.x + zone.width + offset, zone.y + zone.height + offset);
                    ctx.lineTo(zone.x + zone.width + offset - length, zone.y + zone.height + offset);
                    // Bottom Left
                    ctx.moveTo(zone.x - offset + length, zone.y + zone.height + offset);
                    ctx.lineTo(zone.x - offset, zone.y + zone.height + offset);
                    ctx.lineTo(zone.x - offset, zone.y + zone.height + offset - length);
                    ctx.stroke();
                }

                ctx.lineWidth = 1; // absolute reset

                // Zone text overlay
                ctx.shadowBlur = overLimit ? 10 : 0;
                ctx.shadowColor = overLimit ? '#ff1a1a' : 'transparent';
                ctx.fillStyle = overLimit ? '#ff3333' : '#ffffff';
                ctx.font = 'bold 16px Inter';
                ctx.textAlign = 'left';
                ctx.fillText(zone.name, zone.x + 10, zone.y + 25);

                ctx.font = '14px Inter';
                // Add fluctuating People Count UI
                ctx.fillText(`People Count: ${zone.count} / ${zone.limit}`, zone.x + 10, zone.y + 45);
                if (overLimit) {
                    ctx.fillStyle = '#ff1a1a';
                    ctx.fillText(`⚠️ CAPACITY EXCEEDED`, zone.x + 10, zone.y + 65);
                } else {
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(`${zone.density}% Crowd Density`, zone.x + 10, zone.y + 65);
                }
            });

            // Update Particle positions but DO NOT draw them as dots
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                // Bounce within zone bounds
                if (p.x < p.zone.x || p.x > p.zone.x + p.zone.width) p.vx *= -1;
                if (p.y < p.zone.y || p.y > p.zone.y + p.zone.height) p.vy *= -1;
            });

            ctx.restore();

            animId = requestAnimationFrame(draw);
        };

        draw();

        return () => cancelAnimationFrame(animId);
    }, []);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
            <canvas ref={canvasRef} id="canvas-container" style={{ width: '100%', height: '100%' }} />

            {/* Floating User Preferences Panel */}
            <div style={{ position: 'absolute', bottom: '24px', right: '24px', zIndex: 20 }}>
                <UserPreferencePanel
                    onHighlightZone={setHighlightZoneId}
                    zonesData={zones.map(z => ({ id: z.id, density: z.density }))}
                />
            </div>
        </div>
    );
};

export default LiveHeatmap;
