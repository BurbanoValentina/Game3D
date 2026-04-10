// ══════════════════════════════════════════════════════
//  MEMORY GLITCH — Screen corruption when remembering
//  VHS-style tracking errors + static + pain
// ══════════════════════════════════════════════════════

'use client';
import { useEffect, useRef } from 'react';

export default function MemoryGlitchEffect({ active, onComplete }) {
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
    let frame = 0;
    const duration = 120; // 2 seconds

    if (navigator.vibrate) navigator.vibrate([50, 30, 50, 30, 100, 50, 150]);

    const animate = () => {
      frame++;
      if (frame > duration) {
        ctx.clearRect(0, 0, W, H);
        onComplete?.();
        return;
      }
      ctx.clearRect(0, 0, W, H);
      const intensity = frame < duration / 2
        ? frame / (duration / 2)
        : 1 - (frame - duration / 2) / (duration / 2);

      // VHS tracking lines
      for (let i = 0; i < 5 * intensity; i++) {
        const y = Math.random() * H;
        const h = 10 + Math.random() * 30;
        ctx.fillStyle = `rgba(255,255,255,${0.1 * intensity})`;
        ctx.fillRect(0, y, W, h);
        // Offset shift
        ctx.drawImage(canvas, 0, y, W, h,
          (Math.random()-0.5) * 30 * intensity, y, W, h);
      }

      // Static noise
      const imageData = ctx.getImageData(0, 0, W, H);
      const pixels = imageData.data;
      const noiseAmount = 0.03 * intensity;
      for (let i = 0; i < pixels.length; i += 4) {
        if (Math.random() < noiseAmount) {
          const v = Math.random() * 255;
          pixels[i] = v;
          pixels[i+1] = v;
          pixels[i+2] = v;
          pixels[i+3] = 80;
        }
      }
      ctx.putImageData(imageData, 0, 0);

      // Color bars (VHS error)
      if (Math.random() > 0.7) {
        const barY = Math.random() * H;
        const barH = 3 + Math.random() * 15;
        const barColors = ['#ff0044', '#00f0ff', '#ffbb33', '#00ff88'];
        ctx.fillStyle = barColors[Math.floor(Math.random() * barColors.length)];
        ctx.globalAlpha = 0.2 * intensity;
        ctx.fillRect(0, barY, W, barH);
        ctx.globalAlpha = 1;
      }

      // Distortion wave
      const waveY = (frame * 3) % H;
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(0, waveY - 5, W, 10);

      // Pain flash (red pulses)
      if (frame % 15 < 3) {
        ctx.fillStyle = `rgba(255,0,0,${0.15 * intensity})`;
        ctx.fillRect(0, 0, W, H);
      }

      // "MEMORY CORRUPTED" text flickers
      if (Math.random() > 0.6 && intensity > 0.3) {
        ctx.font = `bold ${14 + Math.random() * 8}px monospace`;
        ctx.fillStyle = '#ff0044';
        ctx.globalAlpha = 0.4 * intensity;
        const texts = ['ERROR', 'CORRUPTED', 'MEMORY_FAIL', '0x00FF', 'DOLOR'];
        ctx.fillText(
          texts[Math.floor(Math.random() * texts.length)],
          Math.random() * W * 0.8,
          Math.random() * H
        );
        ctx.globalAlpha = 1;
      }

      // Flickering black frames
      if (Math.random() > 0.9) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, W, H);
      }

      animRef.current = requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <canvas ref={canvasRef} style={{
      position: 'fixed', inset: 0, zIndex: 9997,
      pointerEvents: 'none', mixBlendMode: 'multiply',
    }} />
  );
}
