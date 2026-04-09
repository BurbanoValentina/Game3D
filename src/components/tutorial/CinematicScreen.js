'use client';

import { useEffect, useState } from 'react';
import { GameStates, CINEMATIC_LINES } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';

// ── SVG: Eva Silhouette ──
function EvaSilhouette() {
  return (
    <svg width="60" height="120" viewBox="0 0 60 120" className="absolute right-8 bottom-8 opacity-10" style={{ filter: 'drop-shadow(0 0 15px rgba(255,0,102,0.3))' }}>
      {/* Head */}
      <ellipse cx="30" cy="18" rx="10" ry="12" fill="none" stroke="#FF0066" strokeWidth="1" />
      {/* Visor */}
      <path d="M22,16 Q30,12 38,16" fill="none" stroke="#FF0066" strokeWidth="1.5" opacity="0.8" />
      {/* Body */}
      <line x1="30" y1="30" x2="30" y2="70" stroke="#FF0066" strokeWidth="1" />
      {/* Arms */}
      <line x1="30" y1="40" x2="15" y2="55" stroke="#FF0066" strokeWidth="1" />
      <line x1="30" y1="40" x2="45" y2="52" stroke="#FF0066" strokeWidth="1" />
      {/* Legs */}
      <line x1="30" y1="70" x2="18" y2="100" stroke="#FF0066" strokeWidth="1" />
      <line x1="30" y1="70" x2="42" y2="100" stroke="#FF0066" strokeWidth="1" />
      {/* Data streams */}
      <line x1="10" y1="50" x2="10" y2="110" stroke="#FF61D8" strokeWidth="0.3" opacity="0.3" strokeDasharray="3,5">
        <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="2s" repeatCount="indefinite" />
      </line>
      <line x1="50" y1="40" x2="50" y2="110" stroke="#9D00FF" strokeWidth="0.3" opacity="0.3" strokeDasharray="2,6">
        <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="3s" repeatCount="indefinite" />
      </line>
    </svg>
  );
}

// ── SVG: City Corruption Effect ──
function CorruptionBG() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" style={{ opacity: 0.06 }}>
      {/* Glitch blocks */}
      {Array.from({ length: 15 }, (_, i) => {
        const x = Math.random() * 800;
        const y = Math.random() * 400;
        const w = 20 + Math.random() * 80;
        const h = 2 + Math.random() * 8;
        const color = ['#FF0066', '#9D00FF', '#FF61D8'][i % 3];
        return <rect key={i} x={x} y={y} width={w} height={h} fill={color} opacity="0.3">
          <animate attributeName="opacity" values="0;0.4;0;0.2;0" dur={`${2 + Math.random() * 3}s`} repeatCount="indefinite" begin={`${Math.random() * 2}s`} />
          <animate attributeName="x" values={`${x};${x + 5};${x - 3};${x}`} dur="0.3s" repeatCount="indefinite" />
        </rect>;
      })}
    </svg>
  );
}

export default function CinematicScreen() {
  const setGameState = useGameStore((s) => s.setGameState);
  const [text, setText] = useState('');
  const [done, setDone] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const fullText = CINEMATIC_LINES.join('\n');
    let charIdx = 0;
    const interval = setInterval(() => {
      if (charIdx < fullText.length) {
        setText(fullText.slice(0, charIdx + 1));
        const currentLines = fullText.slice(0, charIdx + 1).split('\n').length;
        setLineIndex(currentLines);
        charIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => setDone(true), 1500);
      }
    }, 35);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-8" style={{ background: 'linear-gradient(145deg, #FFF5F0 0%, #FDDDD4 40%, #FFE8E1 70%, #FFF0EB 100%)' }}>
      {/* Corruption background */}
      <CorruptionBG />

      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 30% 50%, rgba(255,0,102,0.04) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(157,0,255,0.03) 0%, transparent 50%)',
      }} />

      <div className="relative z-10 w-full max-w-xl">
        {/* Level indicator */}
        <div className="flex items-center gap-3 mb-6 animate-fade-in-left">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--neon-magenta)', boxShadow: '0 0 8px var(--neon-magenta)' }} />
          <span className="font-sharetm text-[10px] tracking-widest" style={{ color: 'var(--neon-magenta)', opacity: 0.8 }}>
            NIVEL 1 — LAS CENIZAS DE LA CIUDAD
          </span>
          <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(90deg, rgba(255,0,102,0.3), transparent)' }} />
        </div>

        {/* Narrative text */}
        <div className="relative pl-6" style={{ borderLeft: '2px solid rgba(255,0,102,0.2)' }}>
          {/* Animated dot on border */}
          <div className="absolute left-[-5px] w-2 h-2 rounded-full transition-all duration-300" style={{
            background: 'var(--neon-magenta)', boxShadow: '0 0 8px var(--neon-magenta)',
            top: `${Math.min(lineIndex * 28, 250)}px`,
          }} />

          <pre className="whitespace-pre-wrap font-rajdhani text-lg leading-[2] tracking-wide" style={{ color: 'var(--darker)' }}>
            {text}
            <span className="inline-block w-2 h-5 ml-1" style={{ background: 'var(--neon-magenta)', opacity: 0.6, animation: 'typing-cursor 1s infinite' }} />
          </pre>
        </div>

        {/* Continue button */}
        {done && (
          <div className="mt-10 text-center animate-fade-in-up">
            <button onClick={() => setGameState(GameStates.AWAKENING)} className="oasis-btn-premium">
              ENTRAR AL OASIS →
            </button>
          </div>
        )}
      </div>

      {/* Eva silhouette */}
      <EvaSilhouette />

      {/* Scanlines */}
      <div className="fixed inset-0 z-20 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,0,102,0.006) 0px, rgba(255,0,102,0.006) 1px, transparent 1px, transparent 4px)' }} />
    </div>
  );
}
