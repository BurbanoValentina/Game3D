'use client';

import { useState, useEffect, useRef } from 'react';
import { GameStates, CREDITS_DATA } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';

const TECHS = ['Next.js 14', 'React 18', 'Three.js', 'Tailwind CSS', 'Zustand', 'SQLite', 'Web Audio API'];
const PATTERNS = ['Observer (EventBus)', 'Singleton (DB + Audio)', 'Command (Input)', 'Factory (Buildings)', 'State Machine'];

function TagList({ items, bgColor, borderColor, textColor }) {
  return (
    <div className="flex flex-wrap justify-center max-w-md gap-2 mx-auto">
      {items.map((item) => (
        <span key={item} className="font-sharetm text-[10px] tracking-widest px-3 py-1.5 rounded"
          style={{ background: bgColor, border: `1px solid ${borderColor}`, color: textColor, opacity: 0.7 }}>{item}</span>
      ))}
    </div>
  );
}

function MemberCard({ member, idx }) {
  return (
    <div className="text-center animate-fade-in-up" style={{ animationDelay: `${idx * 0.2}s`, opacity: 0, animationFillMode: 'forwards' }}>
      <div className="relative mx-auto mb-6 w-52 h-52">
        <div className="absolute inset-0 rounded-lg" style={{ background: `linear-gradient(135deg, ${member.color}20, transparent, ${member.color}10)`, filter: 'blur(15px)' }} />
        <img src={member.photo} alt={member.name} className="relative object-cover w-52 h-52 rounded-lg"
          style={{ border: `2px solid ${member.color}44`, boxShadow: `0 0 30px ${member.color}15` }} />
        <svg className="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)]" viewBox="0 0 232 232">
          <rect x="4" y="4" width="224" height="224" rx="12" fill="none" stroke={member.color} strokeWidth="0.5" opacity="0.3" strokeDasharray="6,10">
            <animateTransform attributeName="transform" type="rotate" from="0 116 116" to="360 116 116" dur="25s" repeatCount="indefinite" />
          </rect>
        </svg>
      </div>
      <h2 className="font-orbitron text-xl tracking-[0.25em] mb-1" style={{ color: 'var(--dark)' }}>{member.name}</h2>
      <p className="mb-3 text-sm font-semibold tracking-widest font-rajdhani" style={{ color: member.color, textShadow: `0 0 8px ${member.color}44` }}>{member.role}</p>
      <p className="max-w-sm mx-auto text-sm leading-relaxed font-rajdhani" style={{ color: 'var(--darker)' }}>{member.description}</p>
      <div className="w-16 h-[1px] mx-auto mt-6" style={{ background: `linear-gradient(90deg, transparent, ${member.color}66, transparent)` }} />
    </div>
  );
}

export default function CreditsScreen() {
  const setGameState = useGameStore((s) => s.setGameState);
  const scrollRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const goBack = () => setGameState(GameStates.TRAINING_ROOM);

  useEffect(() => {
    if (!autoScroll) return;
    const interval = setInterval(() => setScrollY((prev) => prev + 0.8), 16);
    return () => clearInterval(interval);
  }, [autoScroll]);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollY; }, [scrollY]);

  return (
    <div className="fixed inset-0 z-50" style={{ background: 'var(--cream)' }}>
      <button onClick={goBack} className="fixed z-50 px-4 py-2 text-xs top-6 left-6 oasis-btn cursor-pointer" style={{ color: 'var(--dark)' }}>← VOLVER</button>
      <button onClick={() => setAutoScroll(!autoScroll)}
        className="fixed top-6 right-6 z-50 font-sharetm text-[9px] tracking-widest hover:underline cursor-pointer" style={{ color: 'var(--bronze)' }}>
        {autoScroll ? '⏸ PAUSAR' : '▶ CONTINUAR'}
      </button>

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
          <div className="w-48 h-[2px] mx-auto mb-4" style={{ background: 'linear-gradient(90deg, transparent, #FF61D8, #FF0066, #D861FF, transparent)' }} />
          <p className="font-rajdhani text-sm tracking-[0.4em] uppercase" style={{ color: 'var(--neon-magenta)', opacity: 0.7 }}>OASIS: La Última Clave</p>
          <p className="font-sharetm text-[9px] tracking-widest mt-2" style={{ color: 'var(--bronze)' }}>DISEÑO DE INTERFACES — 2025</p>
        </div>

        {/* Team */}
        <div className="max-w-lg px-6 mx-auto mb-20 space-y-20">
          {CREDITS_DATA.map((member, idx) => <MemberCard key={idx} member={member} idx={idx} />)}
        </div>

        {/* Tech */}
        <div className="px-4 mb-16 text-center">
          <div className="w-32 h-[1px] mx-auto mb-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,0,102,0.3), transparent)' }} />
          <p className="font-orbitron text-xs tracking-[0.4em] mb-6" style={{ color: 'var(--bronze)' }}>TECNOLOGÍAS</p>
          <TagList items={TECHS} bgColor="rgba(255,0,102,0.03)" borderColor="rgba(255,0,102,0.1)" textColor="var(--neon-magenta)" />
        </div>

        {/* Patterns */}
        <div className="px-4 mb-16 text-center">
          <p className="font-orbitron text-xs tracking-[0.4em] mb-6" style={{ color: 'var(--bronze)' }}>PATRONES DE DISEÑO</p>
          <TagList items={PATTERNS} bgColor="rgba(157,0,255,0.04)" borderColor="rgba(157,0,255,0.1)" textColor="var(--neon-violet)" />
        </div>

        {/* Quote */}
        <div className="px-8 mb-12 text-center">
          <div className="w-24 h-[1px] mx-auto mb-8" style={{ background: 'linear-gradient(90deg, transparent, var(--neon-amber), transparent)' }} />
          <p className="max-w-md mx-auto text-sm italic leading-relaxed font-rajdhani" style={{ color: 'var(--darker)' }}>
            &ldquo;El que las reúna no heredará un sistema. Heredará una responsabilidad.&rdquo;
          </p>
          <p className="font-sharetm text-[9px] tracking-widest mt-3" style={{ color: 'var(--bronze)' }}>— JAMES HALLIDAY, 2089</p>
        </div>

        {/* Footer */}
        <div className="pb-8 text-center">
          <p className="font-orbitron text-lg tracking-[0.3em] mb-4" style={{ color: 'var(--dark)' }}>INGENIERÍA DE SOFTWARE</p>
          <p className="font-sharetm text-[9px] tracking-widest mb-8" style={{ color: 'var(--bronze)' }}>UNIVERSIDAD // DISEÑO DE INTERFACES // 2025</p>
          <button onClick={goBack} className="px-8 py-3 oasis-btn-premium cursor-pointer">VOLVER A SALA</button>
        </div>
        <div className="h-[40vh]" />
      </div>

      <div className="fixed top-0 left-0 right-0 z-40 h-32 pointer-events-none" style={{ background: 'linear-gradient(to bottom, var(--cream), transparent)' }} />
      <div className="fixed bottom-0 left-0 right-0 z-40 h-32 pointer-events-none" style={{ background: 'linear-gradient(to top, var(--cream), transparent)' }} />
    </div>
  );
}
