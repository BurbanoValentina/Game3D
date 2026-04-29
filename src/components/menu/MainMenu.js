'use client';

import { useEffect, useState } from 'react';
import { KeyRound } from 'lucide-react';
import { GameStates } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';

// ── SVG: Animated Key Icon ──
function KeyIcon({ color, size = 36, delay = 0 }) {
  return (
    <div style={{ animationDelay: `${delay}s` }} className="animate-float relative" aria-hidden="true">
      <KeyRound
        size={size}
        stroke="#D4A99A"
        strokeWidth={1.8}
        style={{ filter: 'drop-shadow(0 0 6px rgba(212,169,154,0.6))' }}
      />
      <KeyRound
        size={size}
        stroke={color}
        strokeWidth={1.6}
        className="absolute inset-0"
        style={{ filter: `drop-shadow(0 0 8px ${color}66)` }}
      />
    </div>
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
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    return undefined;
  }, []);

  const handleStart = () => {
    setGameState(GameStates.TRAINING_ROOM);
  };

  const menuItems = [
    { icon: 'play', label: 'COMENZAR', action: handleStart, color: 'var(--neon-magenta)' },
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
      <div className={`flex items-center gap-7 mb-6 transition-all duration-700 delay-200 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        {[{ c: '#FFBB33', n: 'Ámbar' }, { c: '#4B0082', n: 'Índigo' }, { c: '#DC143C', n: 'Carmesí' }, { c: '#00FF88', n: 'Esmeralda' }, { c: '#FFFFFF', n: 'Blanca' }].map((k, i) => (
          <div key={i} className="flex flex-col items-center gap-1" title={`Llave ${k.n}`}>
            <KeyIcon color={k.c} size={40} delay={i * 0.2} />
            <div className="w-2 h-2 rounded-full" style={{ background: k.c, opacity: i === 0 ? 1 : 0.35, boxShadow: i === 0 ? `0 0 6px ${k.c}` : 'none' }} />
          </div>
        ))}
      </div>

      {/* ── Menu Buttons ── */}
      <nav className="relative z-10 flex flex-col w-full max-w-sm gap-3">
        {menuItems.map((item, i) => (
          <button
            key={item.label}
            onClick={item.action}
            onMouseEnter={() => setHoveredItem(item.label)}
            onMouseLeave={() => setHoveredItem(null)}
            className={`relative flex items-center justify-center gap-4 text-center w-full px-6 py-5 rounded transition-all duration-500 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
            style={{
              transitionDelay: `${300 + i * 100}ms`,
              background: hoveredItem === item.label ? 'rgba(255,0,102,0.04)' : 'rgba(255,0,102,0.015)',
              border: `1px solid ${hoveredItem === item.label ? 'rgba(255,0,102,0.3)' : 'rgba(255,0,102,0.08)'}`,
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
            }}
          >
            <div style={{ color: item.color }}><MenuIcon type={item.icon} /></div>
            <div className="flex-1">
              <span className="block text-xs tracking-widest font-orbitron" style={{ color: hoveredItem === item.label ? item.color : 'var(--dark)' }}>{item.label}</span>
            </div>
            <svg width="8" height="14" viewBox="0 0 8 14" style={{ color: item.color, opacity: hoveredItem === item.label ? 0.8 : 0.2, transition: 'opacity 0.3s' }}>
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


      {/* Scanlines */}
      <div className="fixed inset-0 z-20 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,0,102,0.006) 0px, rgba(255,0,102,0.006) 1px, transparent 1px, transparent 4px)',
      }} />
    </div>
  );
}
