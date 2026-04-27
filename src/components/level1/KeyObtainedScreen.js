'use client';

import { useEffect } from 'react';
import { GameStates, KEYS } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';
import audioManager from '../../lib/audioManager';

export default function KeyObtainedScreen() {
  const setGameState = useGameStore((s) => s.setGameState);
  const currentLevel = useGameStore((s) => s.currentLevel);
  const puzzlesSolved = useGameStore((s) => s.puzzlesSolved);
  const totalPuzzles = useGameStore((s) => s.totalPuzzles);
  const coins = useGameStore((s) => s.coins);
  const lives = useGameStore((s) => s.lives);
  const key = KEYS[currentLevel - 1] || KEYS[0];

  useEffect(() => { audioManager.playKeyObtained(); }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(255,245,240,0.97)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 35%, ${key.color}08 0%, transparent 60%)` }} />

      <div className="text-center max-w-lg mx-4 relative z-10 animate-scale-in">
        {/* Key SVG Emblem */}
        <svg width="100" height="100" viewBox="0 0 100 100" className="mx-auto mb-6 animate-float">
          <defs>
            <filter id="keyGlow"><feGaussianBlur stdDeviation="4" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <linearGradient id="keyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={key.color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={key.color} stopOpacity="0.3" />
            </linearGradient>
          </defs>
          {/* Expanding rings */}
          <circle cx="50" cy="50" r="40" fill="none" stroke={key.color} strokeWidth="0.5" opacity="0.2"><animate attributeName="r" values="35;45;35" dur="3s" repeatCount="indefinite" /></circle>
          <circle cx="50" cy="50" r="30" fill="none" stroke={key.color} strokeWidth="0.8" opacity="0.3" />
          {/* Key shape */}
          <circle cx="38" cy="42" r="12" fill="none" stroke="url(#keyGrad)" strokeWidth="2" filter="url(#keyGlow)" />
          <circle cx="38" cy="42" r="5" fill={key.color} opacity="0.3"><animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite" /></circle>
          <line x1="50" y1="42" x2="72" y2="42" stroke="url(#keyGrad)" strokeWidth="2.5" strokeLinecap="round" filter="url(#keyGlow)" />
          <line x1="65" y1="37" x2="65" y2="47" stroke={key.color} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          <line x1="72" y1="37" x2="72" y2="47" stroke={key.color} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          {/* Label */}
          <text x="50" y="80" textAnchor="middle" fill={key.color} fontSize="7" fontFamily="Share Tech Mono" letterSpacing="3" opacity="0.6">{key.name}</text>
        </svg>

        <h2 className="font-orbitron text-2xl tracking-widest mb-2 animate-pulse-glow" style={{ color: key.color, textShadow: `0 0 20px ${key.color}66` }}>
          {key.name}
        </h2>
        <div className="w-32 h-[1px] mx-auto my-4" style={{ background: `linear-gradient(90deg, transparent, ${key.color}, transparent)` }} />
        <p className="font-rajdhani text-sm italic leading-relaxed mb-8" style={{ color: 'var(--darker)' }}>
          &ldquo;{key.quote}&rdquo;
        </p>

        {/* Stats */}
        <div className="rounded-lg p-6 mb-8" style={{ background: 'rgba(255,235,225,0.85)', border: `1px solid ${key.color}20`, boxShadow: `0 0 40px ${key.color}06` }}>
          <div className="font-orbitron text-[10px] tracking-widest mb-4" style={{ color: 'var(--bronze)' }}>RESUMEN DEL NIVEL</div>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { val: `${puzzlesSolved}/${totalPuzzles}`, label: 'Puzzles', color: 'var(--neon-green)' },
              { val: coins, label: 'Monedas', color: 'var(--neon-amber)' },
              { val: `${lives}/10`, label: 'Vidas', color: 'var(--neon-violet)' },
            ].map((s, i) => (
              <div key={i}>
                <div className="font-orbitron text-lg font-bold" style={{ color: s.color, textShadow: `0 0 8px ${s.color}44` }}>{s.val}</div>
                <div className="font-sharetm text-[10px]" style={{ color: 'var(--bronze)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 mb-8">
          <p className="font-sharetm text-xs" style={{ color: 'var(--darker)' }}>Eva guarda la llave. El sistema registra el evento.</p>
          <p className="font-sharetm text-xs" style={{ color: 'var(--neon-magenta)', opacity: 0.5 }}>Quedan {5 - currentLevel} llaves. Quedan {5 - currentLevel} mundos. Zagar observa.</p>
        </div>

        <button onClick={() => setGameState(GameStates.VICTORY)} className="oasis-btn-premium cursor-pointer" style={{ color: key.color, borderColor: `${key.color}44` }}>
          CONTINUAR →
        </button>
      </div>
    </div>
  );
}
