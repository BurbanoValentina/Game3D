// ══════════════════════════════════════════════════════
//  SCREEN CRACK — Glass shattering across screen
//  Triggered on glitch/screamer events
// ══════════════════════════════════════════════════════

'use client';
import { useEffect, useRef, useState } from 'react';

export default function ScreenCrack({ active, color = '#ff0044', onComplete }) {
  const canvasRef = useRef(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    setOpacity(1);
    const cx = canvas.width / 2 + (Math.random() - 0.5) * 200;
    const cy = canvas.height / 2 + (Math.random() - 0.5) * 200;

    // Generate crack lines
    const cracks = [];
    const mainCount = 12 + Math.floor(Math.random() * 8);
    for (let i = 0; i < mainCount; i++) {
      const angle = (i / mainCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const len = 200 + Math.random() * 500;
      const segments = [];
      let x = cx, y = cy;
      const steps = 6 + Math.floor(Math.random() * 6);
      for (let s = 0; s < steps; s++) {
        const progress = (s + 1) / steps;
        const nx = cx + Math.cos(angle) * len * progress + (Math.random() - 0.5) * 60;
        const ny = cy + Math.sin(angle) * len * progress + (Math.random() - 0.5) * 60;
        segments.push({ x: nx, y: ny });
        // Branch cracks
        if (Math.random() > 0.4) {
          const bAngle = angle + (Math.random() - 0.5) * 1.5;
          const bLen = 30 + Math.random() * 120;
          cracks.push({
            segments: [
              { x: nx, y: ny },
              { x: nx + Math.cos(bAngle) * bLen, y: ny + Math.sin(bAngle) * bLen },
            ],
            width: 0.5 + Math.random() * 1,
          });
        }
      }
      cracks.push({ segments, width: 1.5 + Math.random() * 2 });
    }

    // Animate cracks appearing
    let frame = 0;
    const totalFrames = 30;
    const drawFrame = () => {
      if (frame > totalFrames + 60) {
        setOpacity(0);
        setTimeout(() => onComplete?.(), 300);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Impact flash
      if (frame < 5) {
        ctx.fillStyle = `rgba(255,255,255,${0.6 - frame * 0.12})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const revealProgress = Math.min(1, frame / totalFrames);
      cracks.forEach((crack) => {
        const showSegs = Math.ceil(crack.segments.length * revealProgress);
        if (showSegs < 1) return;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        for (let s = 0; s < showSegs; s++) {
          ctx.lineTo(crack.segments[s].x, crack.segments[s].y);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = crack.width;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.stroke();
        // White highlight
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = crack.width * 0.4;
        ctx.shadowBlur = 0;
        ctx.stroke();
      });

      // Glass shards
      if (frame > 10 && frame < totalFrames) {
        for (let i = 0; i < 5; i++) {
          const sx = cx + (Math.random() - 0.5) * 300;
          const sy = cy + (Math.random() - 0.5) * 300;
          ctx.fillStyle = `rgba(200,220,255,${0.1 + Math.random() * 0.15})`;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + Math.random() * 30, sy + Math.random() * 15);
          ctx.lineTo(sx + Math.random() * 15, sy + Math.random() * 30);
          ctx.closePath();
          ctx.fill();
        }
      }

      // Fade out after cracks drawn
      if (frame > totalFrames) {
        const fadeProgress = (frame - totalFrames) / 60;
        setOpacity(1 - fadeProgress);
      }

      frame++;
      requestAnimationFrame(drawFrame);
    };
    requestAnimationFrame(drawFrame);
  }, [active, color, onComplete]);

  if (!active && opacity === 0) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        pointerEvents: 'none', opacity,
        transition: 'opacity 0.3s',
      }}
    />
  );
}
