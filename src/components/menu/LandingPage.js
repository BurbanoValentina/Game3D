'use client';

import { useState, useEffect } from 'react';
import { GameStates } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';

// ── SVG: Futuristic City Skyline ──
function CitySkyline() {
  return (
    <svg className="absolute bottom-0 left-0 right-0 w-full" height="280" viewBox="0 0 1200 280" preserveAspectRatio="xMidYMax slice" style={{ opacity: 0.12 }}>
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF0066" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FF0066" stopOpacity="0" />
        </linearGradient>
        <filter id="cityGlow"><feGaussianBlur stdDeviation="2" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      {/* Buildings */}
      <g filter="url(#cityGlow)">
        <rect x="50" y="120" width="30" height="160" fill="url(#skyGrad)" />
        <rect x="90" y="60" width="25" height="220" fill="url(#skyGrad)" />
        <rect x="130" y="140" width="40" height="140" fill="url(#skyGrad)" />
        <rect x="185" y="30" width="20" height="250" fill="url(#skyGrad)" />
        <rect x="220" y="90" width="35" height="190" fill="url(#skyGrad)" />
        <rect x="270" y="50" width="22" height="230" fill="url(#skyGrad)" />
        <rect x="310" y="110" width="45" height="170" fill="url(#skyGrad)" />
        <rect x="370" y="20" width="18" height="260" fill="url(#skyGrad)" />
        <rect x="400" y="80" width="30" height="200" fill="url(#skyGrad)" />
        <rect x="450" y="40" width="28" height="240" fill="url(#skyGrad)" />
        <rect x="495" y="100" width="40" height="180" fill="url(#skyGrad)" />
        <rect x="550" y="15" width="22" height="265" fill="url(#skyGrad)" />
        <rect x="590" y="70" width="35" height="210" fill="url(#skyGrad)" />
        <rect x="640" y="130" width="25" height="150" fill="url(#skyGrad)" />
        <rect x="680" y="45" width="30" height="235" fill="url(#skyGrad)" />
        <rect x="730" y="85" width="20" height="195" fill="url(#skyGrad)" />
        <rect x="770" y="25" width="35" height="255" fill="url(#skyGrad)" />
        <rect x="820" y="110" width="28" height="170" fill="url(#skyGrad)" />
        <rect x="865" y="55" width="22" height="225" fill="url(#skyGrad)" />
        <rect x="900" y="95" width="40" height="185" fill="url(#skyGrad)" />
        <rect x="960" y="35" width="25" height="245" fill="url(#skyGrad)" />
        <rect x="1000" y="75" width="30" height="205" fill="url(#skyGrad)" />
        <rect x="1050" y="120" width="35" height="160" fill="url(#skyGrad)" />
        <rect x="1100" y="50" width="20" height="230" fill="url(#skyGrad)" />
        <rect x="1140" y="90" width="30" height="190" fill="url(#skyGrad)" />
      </g>
      {/* Neon accents on some buildings */}
      <line x1="185" y1="30" x2="205" y2="30" stroke="#FF61D8" strokeWidth="1" opacity="0.6"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" /></line>
      <line x1="370" y1="20" x2="388" y2="20" stroke="#D861FF" strokeWidth="1" opacity="0.6"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" /></line>
      <line x1="550" y1="15" x2="572" y2="15" stroke="#D861FF" strokeWidth="1" opacity="0.6"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.5s" repeatCount="indefinite" /></line>
      <line x1="770" y1="25" x2="805" y2="25" stroke="#FF0066" strokeWidth="1" opacity="0.6"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.8s" repeatCount="indefinite" /></line>
    </svg>
  );
}

// ── SVG: OASIS Logo Emblem ──
function OasisEmblem() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" className="mx-auto mb-6">
      <defs>
        <linearGradient id="emblemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF0066" />
          <stop offset="50%" stopColor="#FF61D8" />
          <stop offset="100%" stopColor="#D861FF" />
        </linearGradient>
        <filter id="emblemGlow"><feGaussianBlur stdDeviation="3" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      {/* Outer ring */}
      <circle cx="40" cy="40" r="36" fill="none" stroke="url(#emblemGrad)" strokeWidth="1" opacity="0.5" filter="url(#emblemGlow)">
        <animateTransform attributeName="transform" type="rotate" from="0 40 40" to="360 40 40" dur="20s" repeatCount="indefinite" />
      </circle>
      {/* Inner hex */}
      <polygon points="40,10 65,25 65,55 40,70 15,55 15,25" fill="none" stroke="#FF0066" strokeWidth="0.8" opacity="0.4">
        <animateTransform attributeName="transform" type="rotate" from="360 40 40" to="0 40 40" dur="15s" repeatCount="indefinite" />
      </polygon>
      {/* Eye of OASIS */}
      <ellipse cx="40" cy="40" rx="14" ry="8" fill="none" stroke="#FF0066" strokeWidth="1" opacity="0.6" />
      <circle cx="40" cy="40" r="4" fill="#FF0066" opacity="0.8">
        <animate attributeName="r" values="3;5;3" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
      </circle>
      {/* Corner markers */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 40 + 30 * Math.cos(rad);
        const cy = 40 + 30 * Math.sin(rad);
        return <circle key={i} cx={cx} cy={cy} r="1.5" fill={['#FF61D8', '#D861FF', '#D861FF', '#FF0066', '#FFBB33', '#00FF88'][i]} opacity="0.6">
          <animate attributeName="opacity" values="0.3;0.9;0.3" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>;
      })}
    </svg>
  );
}

export default function LandingPage() {
  const setGameState = useGameStore((s) => s.setGameState);
  const [visible, setVisible] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    setTimeout(() => setVisible(true), 200);
    const pts = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 6,
      color: ['#FF61D8', '#D861FF', '#D861FF', '#FF0066', '#FFBB33'][i % 5],
    }));
    setParticles(pts);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden space-light-bg">
      {/* City skyline background */}
      <CitySkyline />

      {/* Floating particles */}
      {particles.map((p) => (
        <div key={p.id} className="absolute rounded-full pointer-events-none animate-float"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            background: p.color,
            opacity: 0.4,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            filter: `blur(${p.size > 2 ? 1 : 0}px)`,
          }}
        />
      ))}

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none space-light-glow" />
      <div className="absolute inset-0 pointer-events-none space-light-grid" />

      {/* Central content */}
      <div className={`relative z-10 text-center transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* OASIS Emblem */}
        <OasisEmblem />

        {/* Title */}
        <h1 className="font-orbitron text-7xl md:text-8xl font-black tracking-[0.3em] mb-3 animate-chromatic-glitch" style={{ color: 'var(--dark)', textShadow: '0 0 40px rgba(255,0,102,0.2)' }}>
          OASIS
        </h1>

        {/* Holographic line */}
        <div className="w-72 h-[2px] mx-auto mb-4" style={{
          background: 'linear-gradient(90deg, transparent, #FF61D8, #FF0066, #D861FF, #9D00FF, transparent)',
          boxShadow: '0 0 10px rgba(255,0,102,0.3)',
        }} />

        <p className="font-rajdhani text-lg tracking-[0.5em] uppercase mb-2" style={{ color: 'var(--neon-magenta)', textShadow: '0 0 10px rgba(255,0,102,0.3)' }}>
          La Última Clave
        </p>
        <p className="font-sharetm text-[10px] tracking-[0.3em] mb-12" style={{ color: 'var(--bronze)' }}>
          LAS 5 LLAVES DE HALLIDAY // AÑO 2089
        </p>

        {/* Description */}
        <div className="max-w-md px-4 mx-auto mb-10">
          <p className="text-sm leading-relaxed font-rajdhani" style={{ color: 'var(--dark)' }}>
            El OASIS se corrompe. Eva es la última esperanza. Encuentra las 5 llaves
            y decide el futuro de 4.200 millones de usuarios.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setGameState(GameStates.REGISTER)}
            className="oasis-btn-premium w-72 text-center"
          >
            ▶ REGISTRARSE
          </button>

          <button
            onClick={() => setGameState(GameStates.LOGIN)}
            className="oasis-btn w-72 py-3 text-center"
            style={{
              color: 'var(--darker)',
              borderColor: 'rgba(97,255,216,0.3)',
              background: 'rgba(97,255,216,0.03)',
            }}
          >
            ◈ INICIAR SESIÓN
          </button>

        </div>
      </div>

      {/* Corner decorations */}
      {[['top-4 left-4', ''], ['top-4 right-4', 'scale-x-[-1]'], ['bottom-4 left-4', 'scale-y-[-1]'], ['bottom-4 right-4', 'scale-[-1]']].map(([pos, flip], i) => (
        <div key={i} className={`absolute ${pos} opacity-20 ${flip}`}>
          <svg width="50" height="50" viewBox="0 0 50 50"><path d="M0,0 L20,0 L20,2 L2,2 L2,20 L0,20 Z" fill="#FF0066" /><line x1="0" y1="25" x2="8" y2="25" stroke="#FF0066" strokeWidth="0.5" opacity="0.5" /></svg>
        </div>
      ))}

      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-20" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,0,102,0.015) 0px, rgba(255,0,102,0.015) 1px, transparent 1px, transparent 4px)',
      }} />
    </div>
  );
}
