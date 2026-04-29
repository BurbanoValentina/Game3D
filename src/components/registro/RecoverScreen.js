'use client';

import { useState } from 'react';
import { GameStates, REGISTER_RULES } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';

// ── SVG: Access Terminal Icon (DARK strokes) ──
function TerminalIcon() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" className="mx-auto mb-4">
      <defs>
        <filter id="tGlow"><feGaussianBlur stdDeviation="2" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <rect x="8" y="10" width="44" height="32" rx="2" fill="rgba(255,0,102,0.04)" stroke="#1A0E0E" strokeWidth="1" opacity="0.6" />
      <rect x="12" y="14" width="36" height="24" rx="1" fill="rgba(255,235,225,0.8)" />
      <rect x="16" y="20" width="8" height="1.5" fill="#FF0066" opacity="0.8"><animate attributeName="opacity" values="0;1;0" dur="1.2s" repeatCount="indefinite" /></rect>
      <rect x="16" y="24" width="20" height="1" fill="#1A0E0E" opacity="0.2" />
      <rect x="16" y="27" width="14" height="1" fill="#1A0E0E" opacity="0.15" />
      <rect x="16" y="30" width="18" height="1" fill="#FF0066" opacity="0.15" />
      <rect x="14" y="46" width="32" height="6" rx="1" fill="rgba(255,0,102,0.03)" stroke="rgba(26,14,14,0.15)" strokeWidth="0.5" />
      {[0,1,2,3,4,5,6].map(i => <rect key={i} x={16 + i * 4} y="47.5" width="2.5" height="3" rx="0.3" fill="rgba(26,14,14,0.1)" />)}
      <circle cx="48" cy="13" r="2" fill="#FF0066" filter="url(#tGlow)"><animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" /></circle>
    </svg>
  );
}

function FuturisticInput({ label, sub, type, value, onChange, maxLen, error, placeholder, inputMode }) {
  return (
    <div className="mb-5">
      <div className="flex justify-between items-end mb-2">
        <div className="flex items-center gap-2">
          <span className="font-rajdhani text-sm font-semibold" style={{ color: 'var(--dark)' }}>{label}</span>
          <span className="font-sharetm text-[8px] tracking-widest" style={{ color: 'var(--bronze)' }}>{sub}</span>
        </div>
        <span className="font-sharetm text-[9px]" style={{ color: 'var(--bronze)' }}>{value.length}/{maxLen}</span>
      </div>
      <div className="relative">
        <input type={type || 'text'} value={value} onChange={(e) => { const v = e.target.value; if (v.length <= maxLen) onChange(v); }}
          placeholder={placeholder} maxLength={maxLen} autoComplete="off" inputMode={inputMode}
          className="futuristic-input-light w-full" style={{ borderColor: error ? 'rgba(255,0,102,0.4)' : undefined }} />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r transition-colors"
          style={{ borderColor: error ? 'var(--neon-magenta)' : value.length > 0 ? 'var(--neon-magenta)' : 'transparent' }} />
      </div>
      {error && (
        <p className="font-sharetm text-[10px] mt-1.5 flex items-center gap-1" style={{ color: 'var(--neon-magenta)' }}>
          <svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="none" stroke="currentColor" strokeWidth="1" /><line x1="5" y1="3" x2="5" y2="5.5" stroke="currentColor" strokeWidth="1" /><circle cx="5" cy="7" r="0.5" fill="currentColor" /></svg>
          {error}
        </p>
      )}
    </div>
  );
}

export default function RecoverScreen() {
  const setGameState = useGameStore((s) => s.setGameState);
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState(false);
  const [errors, setErrors] = useState({});

  const handleRecovery = () => {
    const errs = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = 'Formato de correo inválido.';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setOk(true);
    setMsg('Si el correo existe, enviaremos instrucciones de recuperación.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto space-light-bg" style={{ background: 'none' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,0,102,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,102,0.012) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(255,0,102,0.04) 0%, transparent 60%)' }} />

      <div className="w-full max-w-md py-8 relative z-10">
        <div className="text-center mb-6 animate-fade-in-down">
          <h1 className="font-orbitron text-3xl tracking-[0.3em] mb-2" style={{ color: 'var(--dark)' }}>OASIS</h1>
          <div className="w-24 h-[1px] mx-auto mb-3" style={{ background: 'linear-gradient(90deg, transparent, var(--neon-magenta), transparent)' }} />
          <p className="font-rajdhani text-sm tracking-widest" style={{ color: 'var(--darker)', opacity: 0.7 }}>RECUPERAR ACCESO</p>
        </div>

        <TerminalIcon />

        <div className="rounded-lg p-6 animate-fade-in-up" style={{
          background: 'rgba(255,235,225,0.85)', border: '1px solid rgba(255,0,102,0.1)',
          boxShadow: '0 0 40px rgba(255,0,102,0.03)',
        }}>
          <FuturisticInput label="Correo" sub="EMAIL" type="email" value={email} onChange={setEmail} maxLen={REGISTER_RULES.email.max}
            error={errors.email} placeholder="operaria@oasis.net" inputMode="email" />

          {msg && (
            <div className="text-center py-2 px-3 rounded mb-4 font-sharetm text-xs"
              style={{ background: ok ? 'rgba(0,255,136,0.06)' : 'rgba(255,0,102,0.06)', color: ok ? 'var(--neon-green)' : 'var(--neon-magenta)', border: `1px solid ${ok ? 'rgba(0,255,136,0.15)' : 'rgba(255,0,102,0.15)'}` }}>
              {msg}
            </div>
          )}

          <button onClick={handleRecovery} className="w-full py-3 text-center mb-4 font-orbitron text-sm tracking-widest transition-all"
            style={{ background: 'linear-gradient(135deg, rgba(255,0,102,0.1), rgba(157,0,255,0.05))', border: '1px solid rgba(255,0,102,0.3)', color: 'var(--dark)', clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))', cursor: 'pointer' }}>
            ⟲ ENVIAR ENLACE
          </button>

          <div className="text-center">
            <button onClick={() => setGameState(GameStates.LOGIN)} className="font-sharetm text-[10px] tracking-widest hover:underline" style={{ color: 'var(--darker)', opacity: 0.6 }}>
              ← VOLVER A INICIAR SESION
            </button>
          </div>
        </div>

        <div className="flex justify-center mt-5">
          <button onClick={() => setGameState(GameStates.LANDING)} className="font-sharetm text-[10px] tracking-widest hover:underline flex items-center gap-2" style={{ color: 'var(--bronze)' }}>
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M8,2 L4,6 L8,10" fill="none" stroke="currentColor" strokeWidth="1" /></svg>
            VOLVER
          </button>
        </div>
      </div>

      <div className="fixed inset-0 pointer-events-none z-20" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,0,102,0.006) 0px, rgba(255,0,102,0.006) 1px, transparent 1px, transparent 4px)' }} />
    </div>
  );
}
