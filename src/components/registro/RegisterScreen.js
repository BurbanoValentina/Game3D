'use client';

import { useState } from 'react';
import { GameStates, REGISTER_RULES } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';

// ── SVG: Avatar Preview (DARK strokes) ──
function AvatarPreview({ nickname }) {
  const letter = nickname ? nickname[0].toUpperCase() : 'E';
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" className="mx-auto mb-4">
      <defs>
        <linearGradient id="avGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF0066" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#9D00FF" stopOpacity="0.15" />
        </linearGradient>
        <filter id="avGlow"><feGaussianBlur stdDeviation="2" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <polygon points="40,4 72,22 72,58 40,76 8,58 8,22" fill="url(#avGrad)" stroke="#1A0E0E" strokeWidth="1" opacity="0.8" />
      <polygon points="40,12 64,26 64,54 40,68 16,54 16,26" fill="rgba(255,235,225,0.8)" stroke="#1A0E0E" strokeWidth="0.5" opacity="0.4" />
      <text x="40" y="48" textAnchor="middle" fill="#1A0E0E" fontSize="24" fontFamily="Orbitron" fontWeight="700" filter="url(#avGlow)">{letter}</text>
      <circle cx="40" cy="4" r="2" fill="#FF0066" opacity="0.6"><animate attributeName="opacity" values="0.3;0.9;0.3" dur="2s" repeatCount="indefinite" /></circle>
      <circle cx="72" cy="22" r="1.5" fill="#9D00FF" opacity="0.5"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.5s" repeatCount="indefinite" /></circle>
    </svg>
  );
}

// ── SVG: Security Shield (DARK) ──
function SecurityIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" className="inline-block mr-1" style={{ verticalAlign: 'middle' }}>
      <path d="M8,1 L14,4 L14,8 C14,11.5 11,14 8,15 C5,14 2,11.5 2,8 L2,4 Z" fill="none" stroke="#1A0E0E" strokeWidth="1" opacity="0.5" />
      <path d="M6,8 L7.5,9.5 L10,6.5" fill="none" stroke="#1A0E0E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    </svg>
  );
}

function FuturisticInput({ label, sub, type, value, onChange, maxLen, error, placeholder, showToggle, onToggle, inputMode }) {
  const inputType = type === 'password' && showToggle ? 'text' : type;
  return (
    <div className="mb-5">
      <div className="flex justify-between items-end mb-2">
        <div className="flex items-center gap-2">
          <span className="font-rajdhani text-sm font-semibold" style={{ color: 'var(--dark)' }}>{label}</span>
          <span className="font-sharetm text-[8px] tracking-widest" style={{ color: 'var(--bronze)' }}>{sub}</span>
        </div>
        <span className="font-sharetm text-[9px]" style={{ color: value.length >= maxLen ? 'var(--neon-magenta)' : 'var(--bronze)' }}>
          {value.length}/{maxLen}
        </span>
      </div>
      <div className="relative">
        <input
          type={inputType || 'text'} value={value}
          onChange={(e) => { const v = e.target.value; if (v.length <= maxLen) onChange(v); }}
          placeholder={placeholder} maxLength={maxLen} autoComplete="off" inputMode={inputMode}
          className="futuristic-input-light w-full"
          style={{ borderColor: error ? 'rgba(255,0,102,0.4)' : undefined, paddingRight: showToggle !== undefined ? 42 : undefined }}
        />
        {showToggle !== undefined && (
          <button type="button" aria-label={showToggle ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: showToggle ? 'var(--neon-magenta)' : 'rgba(26,14,14,0.45)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
              <circle cx="12" cy="12" r="3" />
              {showToggle && <path d="M3 3l18 18" />}
            </svg>
          </button>
        )}
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

export default function RegisterScreen() {
  const setGameState = useGameStore((s) => s.setGameState);
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState('');
  const [serverOk, setServerOk] = useState(false);
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (name.trim().length < REGISTER_RULES.name.min) errs.name = `Mínimo ${REGISTER_RULES.name.min} caracteres.`;
    if (nickname.trim().length < REGISTER_RULES.nickname.min) errs.nickname = `Mínimo ${REGISTER_RULES.nickname.min} caracteres.`;
    if (!/^[a-zA-Z0-9_]+$/.test(nickname.trim())) errs.nickname = 'Solo letras, números y guion bajo.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = 'Formato de correo inválido.';
    if (password.length < 8) errs.password = 'Mínimo 8 caracteres.';
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) errs.password = 'Debe tener mayúscula, minúscula y número.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setServerMsg('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', name: name.trim(), nickname: nickname.trim(), email: email.trim(), password }),
      });
      const data = await res.json();
      if (data.success || data.userId) {
        setServerOk(true);
        if (data.token) { localStorage.setItem('oasis_token', data.token); localStorage.setItem('oasis_user', JSON.stringify(data.user)); }
        setServerMsg('¡Registro exitoso! Ingresando al OASIS...');
        setTimeout(() => setGameState(GameStates.MAIN_MENU), 1500);
      } else { setServerOk(false); setServerMsg(data.error || 'Error desconocido.'); }
    } catch { setServerOk(false); setServerMsg('Error de conexión. Intenta de nuevo.'); }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto space-light-bg">
      <div className="absolute inset-0 pointer-events-none space-light-grid" />
      <div className="absolute inset-0 pointer-events-none space-light-glow" />

      <div className="w-full max-w-md py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-6 animate-fade-in-down">
          <h1 className="font-orbitron text-3xl tracking-[0.3em] mb-2" style={{ color: 'var(--dark)' }}>OASIS</h1>
          <div className="w-24 h-[1px] mx-auto mb-3" style={{ background: 'linear-gradient(90deg, transparent, var(--neon-magenta), transparent)' }} />
          <p className="font-rajdhani text-sm tracking-widest" style={{ color: 'var(--darker)', opacity: 0.7 }}>REGISTRO DE OPERARIA</p>
        </div>

        {/* Avatar */}
        <AvatarPreview nickname={nickname} />

        {/* Form Card */}
        <div className="rounded-lg p-6 animate-fade-in-up" style={{
          background: 'rgba(255,235,225,0.85)', border: '1px solid rgba(255,0,102,0.1)',
          boxShadow: '0 0 40px rgba(255,0,102,0.03)',
        }}>
          <FuturisticInput label="Nombre" sub="REAL NAME" type="text" value={name} onChange={setName} maxLen={REGISTER_RULES.name.max} error={errors.name} placeholder="Tu nombre completo" />
          <FuturisticInput label="Apodo" sub="GAMERTAG" type="text" value={nickname} onChange={(v) => setNickname(v.replace(/\s/g, ''))} maxLen={REGISTER_RULES.nickname.max} error={errors.nickname} placeholder="Tu_apodo_OASIS" />
          <FuturisticInput label="Correo" sub="EMAIL" type="email" value={email} onChange={setEmail} maxLen={REGISTER_RULES.email.max} error={errors.email} placeholder="operaria@oasis.net" inputMode="email" />
          <FuturisticInput label="Contraseña" sub="MIN 8: A-a-0" type="password" value={password} onChange={setPassword} maxLen={REGISTER_RULES.password.max} error={errors.password} placeholder="••••••••"
            showToggle={showPassword} onToggle={() => setShowPassword((v) => !v)} />

          {/* Security note */}
          <div className="flex items-center gap-2 mb-4 px-2 py-1.5 rounded" style={{ background: 'rgba(255,0,102,0.03)', border: '1px solid rgba(255,0,102,0.08)' }}>
            <SecurityIcon />
            <span className="font-sharetm text-[9px] tracking-wide" style={{ color: 'var(--darker)', opacity: 0.5 }}>CONEXIÓN CIFRADA — PROTOCOLO HALLIDAY</span>
          </div>

          {serverMsg && (
            <div className="text-center py-2 px-3 rounded mb-4 font-sharetm text-xs"
              style={{ background: serverOk ? 'rgba(0,255,136,0.06)' : 'rgba(255,0,102,0.06)', color: serverOk ? 'var(--neon-green)' : 'var(--neon-magenta)', border: `1px solid ${serverOk ? 'rgba(0,255,136,0.15)' : 'rgba(255,0,102,0.15)'}` }}>
              {serverMsg}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading} className="oasis-btn-premium w-full py-3 text-center mb-4" style={{ opacity: loading ? 0.5 : 1 }}>
            {loading ? '⟳ PROCESANDO...' : '▶ REGISTRARSE'}
          </button>

          <div className="text-center">
            <button onClick={() => setGameState(GameStates.LOGIN)} className="font-sharetm text-[10px] tracking-widest hover:underline transition-colors" style={{ color: 'var(--darker)', opacity: 0.6 }}>
              ¿Ya tienes cuenta? → INICIA SESIÓN
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

      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-20" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,0,102,0.006) 0px, rgba(255,0,102,0.006) 1px, transparent 1px, transparent 4px)' }} />
    </div>
  );
}
