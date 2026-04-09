'use client';

import { useEffect, useCallback, useState } from 'react';
import { GameStates, BOOT_MESSAGES } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';
import audioManager from '../../lib/audioManager';

// ── SVG: System Diagnostic Panel ──
function DiagnosticPanel({ progress }) {
  return (
    <svg width="200" height="60" viewBox="0 0 200 60" className="mx-auto mb-4" style={{ opacity: 0.5 }}>
      <defs>
        <filter id="dpGlow"><feGaussianBlur stdDeviation="1.5" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      {/* CPU bar */}
      <text x="5" y="12" fill="#A89880" fontSize="7" fontFamily="Share Tech Mono">CPU</text>
      <rect x="30" y="5" width="80" height="8" rx="1" fill="rgba(255,0,102,0.04)" stroke="rgba(255,0,102,0.1)" strokeWidth="0.5" />
      <rect x="31" y="6" width={78 * Math.min(progress / 100, 1)} height="6" rx="0.5" fill="#FF0066" opacity="0.6" />
      {/* MEM bar */}
      <text x="5" y="30" fill="#A89880" fontSize="7" fontFamily="Share Tech Mono">MEM</text>
      <rect x="30" y="23" width="80" height="8" rx="1" fill="rgba(255,97,216,0.05)" stroke="rgba(255,97,216,0.1)" strokeWidth="0.5" />
      <rect x="31" y="24" width={78 * Math.min(progress / 80, 1)} height="6" rx="0.5" fill="#FF61D8" opacity="0.5" />
      {/* NET indicator */}
      <text x="5" y="48" fill="#A89880" fontSize="7" fontFamily="Share Tech Mono">NET</text>
      <circle cx="35" cy="45" r="3" fill="none" stroke="#00FF88" strokeWidth="0.8" />
      <circle cx="35" cy="45" r="1.5" fill="#00FF88" opacity={progress > 20 ? 0.8 : 0.2} filter="url(#dpGlow)">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <text x="45" y="48" fill="#00FF88" fontSize="7" fontFamily="Share Tech Mono" opacity="0.6">{progress > 20 ? 'CONNECTED' : 'LINKING...'}</text>
      {/* Hex decoration */}
      <polygon points="170,10 185,18 185,34 170,42 155,34 155,18" fill="none" stroke="rgba(255,0,102,0.15)" strokeWidth="0.5" />
      <text x="163" y="30" fill="#1A0E0E" fontSize="8" fontFamily="Orbitron" opacity="0.4">SYS</text>
    </svg>
  );
}

export default function BootSequence() {
  const setGameState = useGameStore((s) => s.setGameState);
  const bootText = useGameStore((s) => s.bootText);
  const bootComplete = useGameStore((s) => s.bootComplete);
  const addBootLine = useGameStore((s) => s.addBootLine);
  const setBootComplete = useGameStore((s) => s.setBootComplete);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    audioManager.startAmbientDrone();
    const timers = BOOT_MESSAGES.map((msg, i) =>
      setTimeout(() => { addBootLine(msg); audioManager.playBootBeep(i); setProgress(((i + 1) / BOOT_MESSAGES.length) * 100); }, msg.delay)
    );
    const completeTimer = setTimeout(() => setBootComplete(true), 7000);
    return () => { timers.forEach(clearTimeout); clearTimeout(completeTimer); };
  }, [addBootLine, setBootComplete]);

  const handleContinue = useCallback(() => {
    if (bootComplete) { audioManager.playInteract(); setGameState(GameStates.CINEMATIC); }
  }, [bootComplete, setGameState]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Enter') handleContinue(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleContinue]);

  const getColor = (type) => {
    switch (type) {
      case 'eliminated': return 'var(--neon-magenta)';
      case 'critical': return 'var(--neon-orange)';
      case 'eva': return 'var(--neon-green)';
      case 'amber': return 'var(--neon-amber)';
      case 'prompt': return 'var(--neon-amber)';
      case 'loading': return 'var(--neon-cyan)';
      case 'progress': return 'var(--neon-cyan)';
      default: return 'var(--taupe)';
    }
  };

  const getGlow = (type) => {
    if (type === 'eliminated') return '0 0 10px rgba(255,0,102,0.3)';
    if (type === 'eva') return '0 0 8px rgba(0,255,136,0.2)';
    if (type === 'amber') return '0 0 8px rgba(255,187,51,0.2)';
    return 'none';
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-center items-center p-8" style={{ background: 'var(--cream)' }}>
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,0,102,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,102,0.01) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="font-orbitron text-3xl tracking-[0.3em] animate-chromatic-glitch" style={{ color: 'var(--dark)' }}>OASIS</h1>
          <p className="font-sharetm text-[10px] tracking-[0.5em] mt-2" style={{ color: 'var(--neon-magenta)', opacity: 0.5 }}>LA ÚLTIMA CLAVE // SECUENCIA DE ARRANQUE</p>
        </div>

        {/* Diagnostic Panel */}
        <DiagnosticPanel progress={progress} />

        {/* Terminal */}
        <div className="rounded-lg p-6 scan-line" style={{
          background: 'rgba(255,245,240,0.92)', border: '1px solid rgba(255,0,102,0.1)',
          boxShadow: '0 0 40px rgba(255,0,102,0.03), inset 0 1px 0 rgba(255,0,102,0.04)',
        }}>
          {/* Terminal header bar */}
          <div className="flex items-center gap-2 mb-4 pb-2" style={{ borderBottom: '1px solid rgba(255,0,102,0.04)' }}>
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--neon-magenta)', boxShadow: '0 0 4px var(--neon-magenta)' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--neon-amber)', boxShadow: '0 0 4px var(--neon-amber)' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--neon-green)', boxShadow: '0 0 4px var(--neon-green)' }} />
            <span className="font-sharetm text-[9px] tracking-widest ml-2" style={{ color: 'var(--bronze)' }}>OASIS_KERNEL_v8.91.2</span>
          </div>

          <div className="min-h-[320px] max-h-[380px] overflow-y-auto scrollbar-hide">
            {bootText.map((msg, i) => (
              <div key={i} className="animate-boot-line" style={{
                fontFamily: "'Share Tech Mono', monospace", fontSize: '12px', lineHeight: '1.9',
                color: getColor(msg.type), opacity: msg.type === 'blank' ? 0 : 0.85,
                textShadow: getGlow(msg.type),
              }}>
                {msg.type === 'eliminated' && <span style={{ color: 'var(--neon-magenta)', marginRight: 8 }}>▸</span>}
                {msg.type === 'eva' && <span style={{ color: 'var(--neon-green)', marginRight: 8 }}>◆</span>}
                {msg.text}
              </div>
            ))}
            {/* Blinking cursor */}
            <span className="inline-block w-2 h-4 ml-1" style={{ background: 'var(--neon-cyan)', opacity: 0.6, animation: 'typing-cursor 1s infinite' }} />
          </div>
        </div>

        {/* Continue button */}
        {bootComplete && (
          <div className="mt-8 text-center animate-fade-in-up">
            <button onClick={handleContinue} className="oasis-btn-premium animate-border-pulse">
              ▶ INICIAR SECUENCIA
            </button>
            <p className="font-sharetm text-[9px] tracking-widest mt-3" style={{ color: 'var(--bronze)' }}>
              o presiona ENTER
            </p>
          </div>
        )}
      </div>

      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-20" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,0,102,0.008) 0px, rgba(255,0,102,0.008) 1px, transparent 1px, transparent 4px)' }} />
    </div>
  );
}
