// ══════════════════════════════════════════════════════
//  DAMAGE VIGNETTE — Red pulsing edges when hurt
//  Character "suffers" visible pain effect
// ══════════════════════════════════════════════════════

'use client';
import { useState, useEffect } from 'react';

export default function DamageVignette({ active, color = 'red' }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!active) return;
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 1500);
    return () => clearTimeout(t);
  }, [active]);

  if (!active && !pulse) return null;

  const c = color === 'green' ? '0,200,0' : color === 'blue' ? '0,100,255' : '255,0,0';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9990,
      pointerEvents: 'none',
      animation: 'damagePulse 0.2s ease-out 3',
    }}>
      {/* Edge vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        boxShadow: `inset 0 0 120px rgba(${c},0.8), inset 0 0 250px rgba(${c},0.4)`,
        animation: 'vignetteFlicker 0.15s infinite alternate',
      }} />
      {/* Blood drip lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: 0,
          left: `${10 + i * 12}%`,
          width: '3px',
          height: `${20 + Math.random() * 40}%`,
          background: `linear-gradient(to bottom, rgba(${c},0.6), transparent)`,
          animation: `bloodDrip ${0.5 + Math.random() * 0.5}s ease-in forwards`,
          animationDelay: `${i * 0.05}s`,
        }} />
      ))}
      {/* Flash overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `rgba(${c},0.3)`,
        animation: 'damageFlash 0.1s ease-out 2',
      }} />
      <style jsx>{`
        @keyframes damagePulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes vignetteFlicker {
          from { opacity: 0.8; }
          to { opacity: 1; }
        }
        @keyframes bloodDrip {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes damageFlash {
          0% { opacity: 0.6; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
