// ══════════════════════════════════════════════════════
//  LIFE LOST BANNER — Giant announcement overlay
//  Fills entire screen with dramatic "PERDISTE UNA VIDA"
// ══════════════════════════════════════════════════════

'use client';
import { useState, useEffect } from 'react';

export default function LifeLostBanner({ active, livesLeft, onComplete }) {
  const [phase, setPhase] = useState(0); // 0=hidden, 1=flash, 2=show, 3=fadeout

  useEffect(() => {
    if (!active) { setPhase(0); return; }
    setPhase(1);
    const t1 = setTimeout(() => setPhase(2), 200);
    const t2 = setTimeout(() => setPhase(3), 2800);
    const t3 = setTimeout(() => { setPhase(0); onComplete?.(); }, 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [active, onComplete]);

  if (phase === 0) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: phase === 1
        ? 'rgba(255,0,0,0.8)'
        : `rgba(0,0,0,${phase === 3 ? 0.3 : 0.85})`,
      transition: 'background 0.3s',
      pointerEvents: 'none',
      animation: phase === 2 ? 'lifeLostPulse 0.15s infinite alternate' : 'none',
    }}>
      {/* Glitch lines behind text */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden',
        opacity: phase === 2 ? 0.4 : 0,
      }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: `${Math.random() * 100}%`,
            left: `${(Math.random() - 0.3) * 100}%`,
            width: `${50 + Math.random() * 60}%`,
            height: `${2 + Math.random() * 4}px`,
            background: i % 3 === 0 ? '#ff0044' : i % 3 === 1 ? '#00f0ff' : '#ff6600',
            opacity: 0.5 + Math.random() * 0.5,
            animation: `glitchSlide ${0.1 + Math.random() * 0.2}s infinite alternate`,
          }} />
        ))}
      </div>

      {/* Main text with extreme glitch */}
      <div style={{
        fontSize: 'clamp(3rem, 12vw, 10rem)',
        fontFamily: 'monospace',
        fontWeight: 900,
        color: '#FF0044',
        textShadow: `
          4px 0 #00f0ff, -4px 0 #ff6600,
          0 0 40px #ff0044, 0 0 80px #ff0044,
          0 0 120px rgba(255,0,68,0.5)
        `,
        letterSpacing: '0.05em',
        textAlign: 'center',
        animation: phase === 2 ? 'textGlitch 0.08s infinite' : 'none',
        opacity: phase >= 2 ? (phase === 3 ? 0 : 1) : 0,
        transition: 'opacity 0.5s',
        transform: phase === 2 ? 'scale(1.05)' : 'scale(0.8)',
      }}>
        PERDISTE
        <br />
        UNA VIDA
      </div>

      {/* Remaining lives counter */}
      <div style={{
        marginTop: '2rem',
        fontSize: 'clamp(1.5rem, 4vw, 3rem)',
        fontFamily: 'monospace',
        color: '#FF4466',
        textShadow: '0 0 20px #ff0044',
        opacity: phase === 2 ? 1 : 0,
        transition: 'opacity 0.3s 0.5s',
      }}>
        {'❤️'.repeat(Math.max(0, livesLeft))}{'🖤'.repeat(Math.max(0, 10 - livesLeft))}
      </div>

      <div style={{
        marginTop: '1rem',
        fontSize: 'clamp(1rem, 3vw, 2rem)',
        fontFamily: 'monospace',
        color: '#FF6677',
        opacity: phase === 2 ? 0.8 : 0,
        transition: 'opacity 0.3s 0.7s',
      }}>
        {livesLeft <= 2 ? '⚠ ESTADO CRÍTICO ⚠' : `VIDAS RESTANTES: ${livesLeft}`}
      </div>

      {/* Red vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(255,0,0,0.6) 100%)',
        opacity: phase >= 2 ? 0.7 : 0,
        transition: 'opacity 0.3s',
        pointerEvents: 'none',
      }} />

      <style jsx>{`
        @keyframes lifeLostPulse {
          from { transform: scale(1); }
          to { transform: scale(1.003); }
        }
        @keyframes textGlitch {
          0% { transform: translate(0, 0) skewX(0deg); }
          20% { transform: translate(-3px, 2px) skewX(-2deg); }
          40% { transform: translate(3px, -1px) skewX(1deg); }
          60% { transform: translate(-2px, -2px) skewX(2deg); }
          80% { transform: translate(2px, 1px) skewX(-1deg); }
          100% { transform: translate(0, 0) skewX(0deg); }
        }
        @keyframes glitchSlide {
          from { transform: translateX(-20px); }
          to { transform: translateX(20px); }
        }
      `}</style>
    </div>
  );
}
