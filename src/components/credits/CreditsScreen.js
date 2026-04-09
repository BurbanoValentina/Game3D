'use client';

import { useState, useEffect, useRef } from 'react';
import { GameStates, CREDITS_DATA } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';

export default function CreditsScreen() {
  const setGameState = useGameStore((s) => s.setGameState);
  const scrollRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (!autoScroll) return;
    const interval = setInterval(() => setScrollY((prev) => prev + 0.8), 16);
    return () => clearInterval(interval);
  }, [autoScroll]);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollY; }, [scrollY]);

  return (
    <div className="fixed inset-0 z-50" style={{ background: 'var(--cream)' }}>
      {/* Fixed controls */}
      <button onClick={() => setGameState(GameStates.TRAINING_ROOM)}
        className="fixed z-50 px-4 py-2 text-xs top-6 left-6 oasis-btn cursor-pointer" style={{ color: 'var(--dark)' }}>← VOLVER</button>
      <button onClick={() => setAutoScroll(!autoScroll)}
        className="fixed top-6 right-6 z-50 font-sharetm text-[9px] tracking-widest hover:underline cursor-pointer" style={{ color: 'var(--bronze)' }}>
        {autoScroll ? '⏸ PAUSAR' : '▶ CONTINUAR'}
      </button>

      {/* Scrollable credits */}
      <div ref={scrollRef} className="h-full overflow-y-auto scrollbar-hide" onMouseDown={() => setAutoScroll(false)} onTouchStart={() => setAutoScroll(false)}>
        <div className="h-[60vh]" />

        {/* Title */}
        <div className="px-4 mb-16 text-center">
          <svg width="60" height="60" viewBox="0 0 60 60" className="mx-auto mb-4">
            <polygon points="30,3 55,17 55,43 30,57 5,43 5,17" fill="rgba(255,0,102,0.04)" stroke="#FF0066" strokeWidth="0.8" opacity="0.5" />
            <polygon points="30,12 45,21 45,39 30,48 15,39 15,21" fill="none" stroke="#FF61D8" strokeWidth="0.5" opacity="0.3">
              <animateTransform attributeName="transform" type="rotate" from="0 30 30" to="360 30 30" dur="20s" repeatCount="indefinite" />
            </polygon>
            <text x="30" y="34" textAnchor="middle" fill="#FF0066" fontSize="10" fontFamily="Orbitron" fontWeight="700">∞</text>
          </svg>
          <h1 className="font-orbitron text-4xl md:text-5xl tracking-[0.3em] mb-3" style={{ color: 'var(--dark)' }}>CRÉDITOS</h1>
          <div className="w-48 h-[2px] mx-auto mb-4" style={{ background: 'linear-gradient(90deg, transparent, #FF61D8, #FF0066, #D861FF, #D861FF, transparent)' }} />
          <p className="font-rajdhani text-sm tracking-[0.4em] uppercase" style={{ color: 'var(--neon-magenta)', opacity: 0.7 }}>OASIS: La Última Clave</p>
          <p className="font-sharetm text-[9px] tracking-widest mt-2" style={{ color: 'var(--bronze)' }}>DISEÑO DE INTERFACES — 2025</p>
        </div>

        {/* Team Members */}
        <div className="max-w-lg px-6 mx-auto mb-20 space-y-20">
          {CREDITS_DATA.map((member, idx) => (
            <div key={idx} className="text-center animate-fade-in-up" style={{ animationDelay: `${idx * 0.2}s`, opacity: 0, animationFillMode: 'forwards' }}>
              {/* Photo with hex frame */}
              <div className="relative mx-auto mb-6 w-36 h-36">
                <div className="absolute inset-0 rounded-full" style={{ background: `linear-gradient(135deg, ${member.color}20, transparent, ${member.color}10)`, filter: 'blur(15px)' }} />
                <img src={member.photo} alt={member.name} className="relative object-cover rounded-full w-36 h-36"
                  style={{ border: `2px solid ${member.color}44`, boxShadow: `0 0 30px ${member.color}15` }} />
                {/* Animated ring */}
                <svg className="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)]" viewBox="0 0 168 168">
                  <circle cx="84" cy="84" r="80" fill="none" stroke={member.color} strokeWidth="0.5" opacity="0.3" strokeDasharray="4,8">
                    <animateTransform attributeName="transform" type="rotate" from="0 84 84" to="360 84 84" dur="20s" repeatCount="indefinite" />
                  </circle>
                </svg>
              </div>

              <h2 className="font-orbitron text-xl tracking-[0.25em] mb-1" style={{ color: 'var(--dark)' }}>{member.name}</h2>
              <p className="mb-3 text-sm font-semibold tracking-widest font-rajdhani" style={{ color: member.color, textShadow: `0 0 8px ${member.color}44` }}>{member.role}</p>
              <p className="max-w-sm mx-auto text-sm leading-relaxed font-rajdhani" style={{ color: 'var(--darker)' }}>{member.description}</p>
              <div className="w-16 h-[1px] mx-auto mt-6" style={{ background: `linear-gradient(90deg, transparent, ${member.color}66, transparent)` }} />
            </div>
          ))}
        </div>

        {/* Tech section */}
        <div className="px-4 mb-16 text-center">
          <div className="w-32 h-[1px] mx-auto mb-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,0,102,0.3), transparent)' }} />
          <p className="font-orbitron text-xs tracking-[0.4em] mb-6" style={{ color: 'var(--bronze)' }}>TECNOLOGÍAS</p>
          <div className="flex flex-wrap justify-center max-w-md gap-2 mx-auto">
            {['Next.js 14', 'React 18', 'Three.js', 'Tailwind CSS', 'Zustand', 'SQLite', 'Web Audio API'].map((tech) => (
              <span key={tech} className="font-sharetm text-[10px] tracking-widest px-3 py-1.5 rounded" style={{ background: 'rgba(255,0,102,0.03)', border: '1px solid rgba(255,0,102,0.1)', color: 'var(--neon-magenta)', opacity: 0.7 }}>{tech}</span>
            ))}
          </div>
        </div>

        {/* Patterns section */}
        <div className="px-4 mb-16 text-center">
          <p className="font-orbitron text-xs tracking-[0.4em] mb-6" style={{ color: 'var(--bronze)' }}>PATRONES DE DISEÑO</p>
          <div className="flex flex-wrap justify-center max-w-md gap-2 mx-auto">
            {['Observer (EventBus)', 'Singleton (DB + Audio)', 'Command (Input)', 'Factory (Buildings)', 'State Machine'].map((pat) => (
              <span key={pat} className="font-sharetm text-[10px] tracking-widest px-3 py-1.5 rounded" style={{ background: 'rgba(157,0,255,0.04)', border: '1px solid rgba(157,0,255,0.1)', color: 'var(--neon-violet)', opacity: 0.7 }}>{pat}</span>
            ))}
          </div>
        </div>

        {/* Halliday quote */}
        <div className="px-8 mb-12 text-center">
          <div className="w-24 h-[1px] mx-auto mb-8" style={{ background: 'linear-gradient(90deg, transparent, var(--neon-amber), transparent)' }} />
          <p className="max-w-md mx-auto text-sm italic leading-relaxed font-rajdhani" style={{ color: 'var(--darker)' }}>
            &ldquo;El que las reúna no heredará un sistema. Heredará una responsabilidad.&rdquo;
          </p>
          <p className="font-sharetm text-[9px] tracking-widest mt-3" style={{ color: 'var(--bronze)' }}>— JAMES HALLIDAY, 2089</p>
        </div>

        {/* Final */}
        <div className="pb-8 text-center">
          <p className="font-orbitron text-lg tracking-[0.3em] mb-4" style={{ color: 'var(--dark)' }}>INGENIERÍA DE SOFTWARE</p>
          <p className="font-sharetm text-[9px] tracking-widest mb-8" style={{ color: 'var(--bronze)' }}>UNIVERSIDAD // DISEÑO DE INTERFACES // 2025</p>
          <button onClick={() => setGameState(GameStates.TRAINING_ROOM)} className="px-8 py-3 oasis-btn-premium cursor-pointer">VOLVER A SALA</button>
        </div>

        <div className="h-[40vh]" />
      </div>

      {/* Gradient overlays */}
      <div className="fixed top-0 left-0 right-0 z-40 h-32 pointer-events-none" style={{ background: 'linear-gradient(to bottom, var(--cream), transparent)' }} />
      <div className="fixed bottom-0 left-0 right-0 z-40 h-32 pointer-events-none" style={{ background: 'linear-gradient(to top, var(--cream), transparent)' }} />
    </div>
  );
}
