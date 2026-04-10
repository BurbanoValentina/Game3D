// ══════════════════════════════════════════════════════
//  HEAD RAISE — Camera tilts from looking down to up
//  Simulates lifting head after waking up
// ══════════════════════════════════════════════════════

'use client';
import { useState, useEffect } from 'react';

export default function HeadRaiseOverlay({ active, onComplete }) {
  const [tiltDeg, setTiltDeg] = useState(40); // starts tilted down
  const [vignetteOpacity, setVignetteOpacity] = useState(0.8);

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const duration = 120; // 2 seconds

    const animate = () => {
      frame++;
      const progress = Math.min(1, frame / duration);
      const eased = 1 - Math.pow(1 - progress, 2);

      // Camera tilts from 40deg down to 0
      setTiltDeg(40 * (1 - eased));

      // Vignette fades
      setVignetteOpacity(0.8 * (1 - eased));

      if (frame >= duration) {
        setTiltDeg(0);
        setVignetteOpacity(0);
        onComplete?.();
        return;
      }
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [active, onComplete]);

  if (!active && tiltDeg <= 0) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      pointerEvents: 'none',
      perspective: '800px',
    }}>
      {/* Tilt mask — black gradient from top simulating head down */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(
          to bottom,
          rgba(0,0,0,${Math.min(1, tiltDeg / 20)}) 0%,
          rgba(0,0,0,${Math.min(0.8, tiltDeg / 30)}) ${50 - tiltDeg}%,
          transparent ${100 - tiltDeg}%
        )`,
      }} />

      {/* Peripheral darkness (like human vision) */}
      <div style={{
        position: 'absolute', inset: 0,
        boxShadow: `inset 0 0 ${100 + tiltDeg * 3}px rgba(0,0,0,${vignetteOpacity})`,
      }} />

      {/* Breathing motion indicator */}
      {tiltDeg > 10 && (
        <div style={{
          position: 'absolute',
          bottom: '10%', left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(0,240,255,0.3)',
          fontFamily: 'monospace',
          fontSize: '0.7rem',
          letterSpacing: '0.5em',
          animation: 'breathe 2s ease-in-out infinite',
        }}>
          ▲ LEVANTANDO CABEZA ▲
        </div>
      )}

      <style jsx>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.3; transform: translateX(-50%) translateY(0); }
          50% { opacity: 0.6; transform: translateX(-50%) translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
