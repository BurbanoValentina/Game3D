'use client';

import { GameStates } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';
import audioManager from '../../lib/audioManager';

export default function GameOverScreen() {
  const setGameState = useGameStore((s) => s.setGameState);
  const resetGame = useGameStore((s) => s.resetGame);

  const handleRestart = () => { audioManager.stopAll(); resetGame(); setGameState(GameStates.BOOT); };
  const handleMenu = () => { audioManager.stopAll(); resetGame(); setGameState(GameStates.MAIN_MENU); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(255,245,240,0.97)' }}>
      {/* Corruption background effect */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(255,0,102,0.06) 0%, transparent 60%)' }} />

      <div className="text-center max-w-md mx-4 relative z-10 animate-scale-in">
        {/* Corruption hex */}
        <svg width="80" height="80" viewBox="0 0 80 80" className="mx-auto mb-6">
          <defs><filter id="goGlow"><feGaussianBlur stdDeviation="3" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
          <polygon points="40,5 70,22 70,58 40,75 10,58 10,22" fill="rgba(255,0,102,0.08)" stroke="#FF0066" strokeWidth="1.5" filter="url(#goGlow)">
            <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
          </polygon>
          <line x1="25" y1="30" x2="55" y2="50" stroke="#FF0066" strokeWidth="2" strokeLinecap="round" />
          <line x1="55" y1="30" x2="25" y2="50" stroke="#FF0066" strokeWidth="2" strokeLinecap="round" />
          <text x="40" y="68" textAnchor="middle" fill="#FF0066" fontSize="6" fontFamily="Share Tech Mono" opacity="0.6">FATAL ERROR</text>
        </svg>

        <div className="font-sharetm text-xs tracking-widest mb-3 animate-glitch" style={{ color: 'var(--neon-magenta)' }}>
          SISTEMA COLAPSADO
        </div>

        <h2 className="font-orbitron text-2xl tracking-widest mb-4" style={{ color: 'var(--neon-magenta)', textShadow: '0 0 30px rgba(255,0,102,0.3)' }}>
          VIDAS AGOTADAS
        </h2>

        <p className="font-sharetm text-sm mb-2" style={{ color: 'var(--neon-magenta)', opacity: 0.6 }}>
          Tus corazones se han agotado. Eva ha caído.
        </p>
        <p className="font-rajdhani text-xs mb-8 italic" style={{ color: 'var(--darker)' }}>
          Pero Eva no se rinde. Eva nunca se rinde.
        </p>

        <div className="flex flex-col gap-3 items-center">
          <button onClick={handleRestart} className="oasis-btn w-56 py-3 text-center cursor-pointer" style={{ color: 'var(--neon-magenta)', borderColor: 'rgba(255,0,102,0.3)', background: 'rgba(255,0,102,0.05)' }}>
            ⟳ REINICIAR SISTEMA
          </button>
          <button onClick={handleMenu} className="oasis-btn w-56 py-3 text-center cursor-pointer" style={{ color: 'var(--bronze)', borderColor: 'rgba(168,152,128,0.2)', background: 'rgba(168,152,128,0.03)' }}>
            ← VOLVER AL MENÚ
          </button>
        </div>
      </div>

      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,0,102,0.01) 0px, rgba(255,0,102,0.01) 1px, transparent 1px, transparent 3px)' }} />
    </div>
  );
}
