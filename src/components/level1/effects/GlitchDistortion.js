// ══════════════════════════════════════════════════════
//  GLITCH DISTORTION — MAXIMUM intensity visual corruption
//  Chromatic aberration, scan lines, RGB split, pixel noise
// ══════════════════════════════════════════════════════

'use client';
import { useEffect, useRef } from 'react';

export default function GlitchDistortion({ active, intensity = 1, color = '#ff0044' }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(animRef.current);
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const W = canvas.width, H = canvas.height;

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      const t = performance.now() * 0.001;

      // Heavy scan lines
      ctx.fillStyle = `rgba(0,0,0,${0.04 * intensity})`;
      for (let y = 0; y < H; y += 2) {
        ctx.fillRect(0, y, W, 1);
      }

      // RGB split horizontal slices
      const sliceCount = Math.floor(8 + Math.random() * 12 * intensity);
      for (let i = 0; i < sliceCount; i++) {
        const sy = Math.random() * H;
        const sh = 2 + Math.random() * 20 * intensity;
        const offset = (Math.random() - 0.5) * 40 * intensity;
        ctx.fillStyle = `rgba(255,0,68,${0.1 + Math.random() * 0.2 * intensity})`;
        ctx.fillRect(offset, sy, W, sh);
        ctx.fillStyle = `rgba(0,240,255,${0.08 + Math.random() * 0.15 * intensity})`;
        ctx.fillRect(-offset, sy + 2, W, sh * 0.6);
      }

      // Pixel noise blocks
      const noiseCount = Math.floor(15 * intensity + Math.random() * 20);
      for (let i = 0; i < noiseCount; i++) {
        const nx = Math.random() * W;
        const ny = Math.random() * H;
        const nw = 5 + Math.random() * 80 * intensity;
        const nh = 2 + Math.random() * 8;
        const colors = ['#ff0044', '#00f0ff', '#00ff88', '#ff6600', '#9d00ff'];
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.globalAlpha = 0.15 + Math.random() * 0.3 * intensity;
        ctx.fillRect(nx, ny, nw, nh);
      }
      ctx.globalAlpha = 1;

      // Large corruption blocks
      if (Math.random() > 0.7) {
        const bx = Math.random() * W;
        const by = Math.random() * H;
        const bw = 50 + Math.random() * 200;
        const bh = 20 + Math.random() * 60;
        ctx.fillStyle = `rgba(${Math.random() > 0.5 ? '255,0,68' : '0,240,255'},${0.1 * intensity})`;
        ctx.fillRect(bx, by, bw, bh);
      }

      // Horizontal tear lines
      for (let i = 0; i < 3 * intensity; i++) {
        const ty = Math.random() * H;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1 + Math.random() * 2;
        ctx.globalAlpha = 0.3 + Math.random() * 0.4;
        ctx.beginPath();
        ctx.moveTo(0, ty);
        let px = 0;
        while (px < W) {
          px += 10 + Math.random() * 30;
          ctx.lineTo(px, ty + (Math.random() - 0.5) * 10);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Flicker
      if (Math.random() > 0.85) {
        ctx.fillStyle = `rgba(255,255,255,${0.1 + Math.random() * 0.2})`;
        ctx.fillRect(0, 0, W, H);
      }

      // Binary rain
      ctx.font = `${8 + Math.random() * 4}px monospace`;
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.15 * intensity;
      for (let i = 0; i < 30 * intensity; i++) {
        const tx = Math.random() * W;
        const ty = Math.random() * H;
        ctx.fillText(Math.random() > 0.5 ? '1' : '0', tx, ty);
      }
      ctx.globalAlpha = 1;

      animRef.current = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(animRef.current);
  }, [active, intensity, color]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        pointerEvents: 'none', mixBlendMode: 'screen',
      }}
    />
  );
}
