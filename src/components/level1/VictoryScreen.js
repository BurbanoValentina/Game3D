'use client';

import { GameStates } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';
import audioManager from '../../lib/audioManager';

export default function VictoryScreen() {
  const setGameState = useGameStore((s) => s.setGameState);
  const setLevel1Completed = useGameStore((s) => s.setLevel1Completed);

  const handleContinue = () => { audioManager.stopAll(); setLevel1Completed(true); setGameState(GameStates.CREDITS); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(255,245,240,0.97)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(255,0,102,0.04) 0%, transparent 60%)' }} />

      <div className="text-center max-w-xl mx-4 relative z-10 animate-scale-in">
        {/* Victory emblem */}
        <svg width="80" height="80" viewBox="0 0 80 80" className="mx-auto mb-6">
          <defs><filter id="vGlow"><feGaussianBlur stdDeviation="3" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
          <polygon points="40,5 70,22 70,58 40,75 10,58 10,22" fill="rgba(255,0,102,0.04)" stroke="#FF0066" strokeWidth="1" filter="url(#vGlow)" />
          <path d="M25,40 L35,50 L55,28" fill="none" stroke="#00FF88" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#vGlow)">
            <animate attributeName="stroke-dasharray" values="0,100;60,100" dur="0.8s" fill="freeze" />
          </path>
          <text x="40" y="68" textAnchor="middle" fill="#FF0066" fontSize="5" fontFamily="Share Tech Mono" letterSpacing="2" opacity="0.5">NIVEL COMPLETADO</text>
        </svg>

        <div className="font-sharetm text-[10px] tracking-[0.6em] mb-2" style={{ color: 'var(--bronze)' }}>
          NIVEL 1 COMPLETADO
        </div>

        <h1 className="font-orbitron text-3xl tracking-widest mb-6 animate-pulse-glow" style={{ color: 'var(--neon-magenta)', textShadow: '0 0 25px rgba(255,0,102,0.3)' }}>
          LAS CENIZAS DE LA CIUDAD
        </h1>

        <div className="w-48 h-[1px] mx-auto mb-8" style={{ background: 'linear-gradient(90deg, transparent, var(--neon-cyan), transparent)' }} />

        <div className="space-y-4 mb-10">
          <p className="font-rajdhani text-sm leading-relaxed" style={{ color: 'var(--darker)' }}>
            La Ciudad Neón queda atrás. Los ecos del pasado aún resuenan en sus calles vacías.
          </p>
          <p className="font-rajdhani text-sm leading-relaxed" style={{ color: 'var(--bronze)' }}>
            El OASIS registra: Eva ha demostrado que puede avanzar sola.
          </p>
          <p className="font-rajdhani text-sm leading-relaxed" style={{ color: 'var(--neon-magenta)', opacity: 0.5 }}>
            Pero Zagar ha tomado nota. Y la Biblioteca de Halliday espera.
          </p>
        </div>

        {/* Next level preview */}
        <div className="rounded-lg p-4 mb-8" style={{ background: 'rgba(0,255,136,0.03)', border: '1px solid rgba(0,255,136,0.1)' }}>
          <div className="flex items-center justify-center gap-2 mb-1">
            <svg width="12" height="12" viewBox="0 0 12 12"><polygon points="6,1 11,4 11,8 6,11 1,8 1,4" fill="none" stroke="#00FF88" strokeWidth="0.8" opacity="0.6" /><circle cx="6" cy="6" r="1.5" fill="#00FF88" opacity="0.5" /></svg>
            <span className="font-sharetm text-[10px] tracking-widest" style={{ color: 'var(--neon-green)', opacity: 0.7 }}>SIGUIENTE: NIVEL 2</span>
          </div>
          <div className="font-orbitron text-xs tracking-widest" style={{ color: 'var(--neon-green)', opacity: 0.5 }}>EL LIBRO QUE FALTA</div>
          <div className="font-sharetm text-[9px] tracking-widest mt-1" style={{ color: 'var(--bronze)' }}>Mundo: Biblioteca de Halliday — Zona de Memoria</div>
        </div>

        <button onClick={handleContinue} className="oasis-btn-premium cursor-pointer">CONTINUAR → CRÉDITOS</button>
      </div>

      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,0,102,0.006) 0px, rgba(255,0,102,0.006) 1px, transparent 1px, transparent 4px)' }} />
    </div>
  );
}
