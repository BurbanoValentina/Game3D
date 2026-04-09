'use client';

import { useEffect, useState } from 'react';
import { GameStates } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';

// ── SVG: Animated Key Icon ──
function KeyIcon({ color, size = 24, delay = 0 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ animationDelay: `${delay}s` }} className="animate-float">
      <defs>
        <filter id={`kglow${delay}`}><feGaussianBlur stdDeviation="1.5" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <circle cx="8" cy="8" r="5" fill="none" stroke={color} strokeWidth="1.5" opacity="0.8" filter={`url(#kglow${delay})`} />
      <circle cx="8" cy="8" r="2" fill={color} opacity="0.5"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" /></circle>
      <line x1="13" y1="8" x2="22" y2="8" stroke={color} strokeWidth="1.5" opacity="0.7" />
      <line x1="19" y1="5" x2="19" y2="11" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="22" y1="5" x2="22" y2="11" stroke={color} strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

// ── SVG: Corruption Gauge ──
function CorruptionGauge({ pct }) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="corrGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF0066" />
          <stop offset="50%" stopColor="#FF6600" />
          <stop offset="100%" stopColor="#FF0066" />
        </linearGradient>
        <filter id="corrGlow"><feGaussianBlur stdDeviation="2" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      {/* Background ring */}
      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,0,102,0.08)" strokeWidth="3" />
      {/* Progress ring */}
      <circle cx="50" cy="50" r="40" fill="none" stroke="url(#corrGrad)" strokeWidth="3" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} transform="rotate(-90 50 50)" filter="url(#corrGlow)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
      {/* Inner hex */}
      <polygon points="50,20 72,35 72,65 50,80 28,65 28,35" fill="none" stroke="rgba(255,0,102,0.1)" strokeWidth="0.5" />
      {/* Center text */}
      <text x="50" y="46" textAnchor="middle" fill="#FF0066" fontSize="16" fontFamily="Orbitron" fontWeight="700">{pct}%</text>
      <text x="50" y="60" textAnchor="middle" fill="#A89880" fontSize="6" fontFamily="Share Tech Mono" letterSpacing="2">CORRUPCIÓN</text>
    </svg>
  );
}

// ── SVG: Menu Icon ──
function MenuIcon({ type }) {
  const icons = {
    play: <><polygon points="8,4 20,12 8,20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" /></>,
    settings: <><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />{[0,60,120,180,240,300].map((a,i)=>{const r=(a*Math.PI)/180;return <line key={i} x1={12+5*Math.cos(r)} y1={12+5*Math.sin(r)} x2={12+8*Math.cos(r)} y2={12+8*Math.sin(r)} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>})}</>,
  };
  return <svg width="24" height="24" viewBox="0 0 24 24">{icons[type]}</svg>;
}

export default function MainMenu() {
  const setGameState = useGameStore((s) => s.setGameState);
  const [visible, setVisible] = useState(false);
  const [corruptPct, setCorruptPct] = useState(0);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const interval = setInterval(() => {
      setCorruptPct((p) => (p < 38 ? p + 1 : 38));
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    setGameState(GameStates.TRAINING_ROOM);
  };

  const menuItems = [
    { idx: '01', icon: 'play', label: 'COMENZAR', sub: 'Tutorial • Niveles • Créditos', action: handleStart, color: 'var(--neon-magenta)' },
  ];

  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center justify-center px-6 space-light-bg">
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,0,102,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,102,0.015) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 30%, rgba(255,0,102,0.03) 0%, transparent 60%)',
      }} />

      {/* ── Logo Section ── */}
      <div className={`text-center mb-8 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h1 className="font-orbitron text-6xl md:text-7xl font-black tracking-[0.3em] relative animate-chromatic-glitch" style={{ color: 'var(--dark)' }}>
          OASIS
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-[2px]" style={{
            background: 'linear-gradient(90deg, transparent, #FF61D8, #D861FF, #D861FF, transparent)',
            boxShadow: '0 0 10px rgba(255,0,102,0.3)',
          }} />
        </h1>
        <p className="font-rajdhani text-sm tracking-[0.4em] mt-6 uppercase" style={{ color: 'var(--neon-magenta)', opacity: 0.7, textShadow: '0 0 10px rgba(255,0,102,0.2)' }}>
          Las 5 Llaves de Halliday
        </p>
      </div>

      {/* ── Keys Preview ── */}
      <div className={`flex items-center gap-4 mb-6 transition-all duration-700 delay-200 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        {[{ c: '#FFBB33', n: 'Ámbar' }, { c: '#4B0082', n: 'Índigo' }, { c: '#DC143C', n: 'Carmesí' }, { c: '#00FF88', n: 'Esmeralda' }, { c: '#FFFFFF', n: 'Blanca' }].map((k, i) => (
          <div key={i} className="flex flex-col items-center gap-1" title={`Llave ${k.n}`}>
            <KeyIcon color={k.c} size={20} delay={i * 0.2} />
            <div className="w-1 h-1 rounded-full" style={{ background: k.c, opacity: i === 0 ? 1 : 0.2, boxShadow: i === 0 ? `0 0 6px ${k.c}` : 'none' }} />
          </div>
        ))}
      </div>

      {/* ── Corruption Gauge ── */}
      <div className={`mb-8 transition-all duration-700 delay-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <CorruptionGauge pct={corruptPct} />
      </div>

      {/* ── Menu Buttons ── */}
      <nav className="relative z-10 flex flex-col w-full max-w-sm gap-3">
        {menuItems.map((item, i) => (
          <button
            key={item.idx}
            onClick={item.action}
            onMouseEnter={() => setHoveredItem(item.idx)}
            onMouseLeave={() => setHoveredItem(null)}
            className={`relative flex items-center gap-4 text-left w-full px-6 py-4 rounded transition-all duration-500 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
            style={{
              transitionDelay: `${300 + i * 100}ms`,
              background: hoveredItem === item.idx ? 'rgba(255,0,102,0.04)' : 'rgba(255,0,102,0.015)',
              border: `1px solid ${hoveredItem === item.idx ? 'rgba(255,0,102,0.3)' : 'rgba(255,0,102,0.08)'}`,
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
            }}
          >
            <span className="font-sharetm text-[10px]" style={{ color: 'var(--bronze)' }}>{item.idx}</span>
            <div style={{ color: item.color }}><MenuIcon type={item.icon} /></div>
            <div className="flex-1">
              <span className="block text-xs tracking-widest font-orbitron" style={{ color: hoveredItem === item.idx ? item.color : 'var(--dark)' }}>{item.label}</span>
              <span className="font-sharetm text-[9px] tracking-wide" style={{ color: 'var(--bronze)' }}>{item.sub}</span>
            </div>
            <svg width="8" height="14" viewBox="0 0 8 14" style={{ color: item.color, opacity: hoveredItem === item.idx ? 0.8 : 0.2, transition: 'opacity 0.3s' }}>
              <path d="M1,1 L7,7 L1,13" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        ))}
      </nav>

      {/* ── Halliday Quote ── */}
      <div className={`mt-10 text-center max-w-md transition-all duration-1000 delay-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-12 h-[1px] mx-auto mb-4" style={{ background: 'linear-gradient(90deg, transparent, var(--neon-amber), transparent)' }} />
        <p className="font-rajdhani text-[11px] tracking-[0.15em] italic leading-relaxed" style={{ color: 'var(--darker)' }}>
          &ldquo;EL QUE LAS REÚNA NO HEREDARÁ UN SISTEMA. HEREDARÁ UNA RESPONSABILIDAD.&rdquo;
        </p>
        <p className="font-sharetm text-[8px] tracking-widest mt-2" style={{ color: 'var(--bronze)' }}>— JAMES HALLIDAY, 2089</p>
      </div>

      {/* ── Bottom Status ── */}
      <div className="absolute left-0 right-0 flex justify-center gap-8 bottom-6">
        {['NEXT.JS + THREE.JS', 'USUARIOS: 4.200M', 'SECTOR_7G'].map((text, i) => (
          <span key={i} className="font-sharetm text-[8px] tracking-widest" style={{ color: 'var(--bronze)', opacity: 0.5 }}>
            {text}
          </span>
        ))}
      </div>

      {/* Scanlines */}
      <div className="fixed inset-0 z-20 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,0,102,0.006) 0px, rgba(255,0,102,0.006) 1px, transparent 1px, transparent 4px)',
      }} />
    </div>
  );
}
