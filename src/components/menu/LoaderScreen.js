'use client';

import { useState, useEffect } from 'react';

// ── Inline SVG: Futuristic Hexagonal Loader ──
function HexLoader({ progress }) {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" className="animate-hex-rotate" style={{ animationDuration: '8s' }}>
      <defs>
        <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF0066" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#FF61D8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#D861FF" stopOpacity="0.8" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Outer hex ring */}
      <polygon points="60,5 105,30 105,90 60,115 15,90 15,30" fill="none" stroke="url(#hexGrad)" strokeWidth="1.5" opacity="0.3" filter="url(#glow)" />
      {/* Middle hex ring */}
      <polygon points="60,20 90,37 90,83 60,100 30,83 30,37" fill="none" stroke="#FF0066" strokeWidth="1" opacity="0.5" strokeDasharray="200" strokeDashoffset={200 - (progress / 100) * 200}>
        <animate attributeName="stroke-dashoffset" dur="0.3s" fill="freeze" />
      </polygon>
      {/* Inner hex */}
      <polygon points="60,35 75,45 75,75 60,85 45,75 45,45" fill="rgba(255,0,102,0.04)" stroke="#FF0066" strokeWidth="0.5" opacity="0.6" />
      {/* Center dot */}
      <circle cx="60" cy="60" r="3" fill="#FF0066" opacity={0.5 + Math.sin(Date.now() / 500) * 0.3}>
        <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Orbiting dot */}
      <circle cx="60" cy="15" r="2" fill="#FF61D8" filter="url(#glow)">
        <animateTransform attributeName="transform" type="rotate" from="0 60 60" to="360 60 60" dur="3s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

// ── Inline SVG: Circuit traces ──
function CircuitTraces() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="traceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF0066" stopOpacity="0" />
          <stop offset="50%" stopColor="#FF0066" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FF0066" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Horizontal circuit lines */}
      {[100, 200, 300, 400, 500].map((y, i) => (
        <g key={i} opacity={0.15 + Math.random() * 0.1}>
          <line x1="0" y1={y} x2="800" y2={y} stroke="url(#traceGrad)" strokeWidth="0.5" />
          <circle cx={150 + i * 120} cy={y} r="2" fill="#FF0066" opacity="0.4">
            <animate attributeName="opacity" values="0.2;0.8;0.2" dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      {/* Vertical circuit lines */}
      {[160, 320, 480, 640].map((x, i) => (
        <line key={`v${i}`} x1={x} y1="0" x2={x} y2="600" stroke="url(#traceGrad)" strokeWidth="0.3" opacity="0.1" />
      ))}
    </svg>
  );
}

export default function LoaderScreen() {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('CONECTANDO AL OASIS...');

  const statusMessages = [
    'CONECTANDO AL OASIS...',
    'CARGANDO MÓDULOS DE REALIDAD VIRTUAL...',
    'VERIFICANDO INTEGRIDAD DEL SISTEMA...',
    'INICIALIZANDO MOTOR GRÁFICO...',
    'SINCRONIZANDO DATOS DE USUARIO...',
    'PROTOCOLO DE SEGURIDAD: ACTIVO',
    'OASIS v2089.3.1 — LISTO',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); return 100; }
        const next = p + Math.random() * 6 + 2;
        const idx = Math.min(Math.floor((next / 100) * statusMessages.length), statusMessages.length - 1);
        setStatusText(statusMessages[idx]);
        return next;
      });
    }, 90);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden space-light-bg">
      {/* Circuit board background */}
      <CircuitTraces />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 50%, rgba(255,0,102,0.04) 0%, transparent 60%)',
      }} />

      {/* Hexagonal loader */}
      <div className="relative mb-10">
        <HexLoader progress={Math.min(100, progress)} />
        {/* Percentage in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-orbitron text-xs tracking-widest" style={{ color: 'var(--neon-magenta)', textShadow: '0 0 10px rgba(255,0,102,0.5)' }}>
            {Math.min(100, Math.floor(progress))}%
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-8 animate-fade-in-up">
        <h1 className="font-orbitron text-5xl tracking-[0.5em] mb-3" style={{ color: 'var(--dark)', textShadow: '0 0 30px rgba(255,0,102,0.15)' }}>
          OASIS
        </h1>
        <div className="w-48 h-[1px] mx-auto mb-3" style={{ background: 'linear-gradient(90deg, transparent, var(--neon-magenta), var(--holo-pink), var(--neon-violet), transparent)' }} />
        <p className="font-sharetm text-[11px] tracking-[0.6em] uppercase" style={{ color: 'var(--neon-magenta)', opacity: 0.7 }}>
          La Última Clave
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-80 max-w-[85vw] mb-6">
        <div className="h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(255,0,102,0.1)' }}>
          <div className="h-full transition-all duration-200 ease-out rounded-full" style={{
            width: `${Math.min(100, progress)}%`,
            background: 'linear-gradient(90deg, #FF0066, #FF61D8, #D861FF, #D861FF)',
            backgroundSize: '300% 100%',
            animation: 'holo-shift 3s ease-in-out infinite',
            boxShadow: '0 0 15px rgba(255,0,102,0.4)',
          }} />
        </div>
      </div>

      {/* Status text */}
      <div className="text-center">
        <p className="font-sharetm text-[10px] tracking-[0.3em] animate-pulse" style={{ color: 'var(--neon-magenta)', opacity: 0.6 }}>
          {statusText}
        </p>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-6 left-6 opacity-30">
        <svg width="40" height="40" viewBox="0 0 40 40"><path d="M0,0 L15,0 L15,2 L2,2 L2,15 L0,15 Z" fill="#FF0066" /></svg>
      </div>
      <div className="absolute top-6 right-6 opacity-30">
        <svg width="40" height="40" viewBox="0 0 40 40"><path d="M40,0 L25,0 L25,2 L38,2 L38,15 L40,15 Z" fill="#FF0066" /></svg>
      </div>
      <div className="absolute bottom-6 left-6 opacity-30">
        <svg width="40" height="40" viewBox="0 0 40 40"><path d="M0,40 L15,40 L15,38 L2,38 L2,25 L0,25 Z" fill="#FF0066" /></svg>
      </div>
      <div className="absolute bottom-6 right-6 opacity-30">
        <svg width="40" height="40" viewBox="0 0 40 40"><path d="M40,40 L25,40 L25,38 L38,38 L38,25 L40,25 Z" fill="#FF0066" /></svg>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <div className="flex gap-2 items-center justify-center">
          <div className="w-8 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,0,102,0.3))' }} />
          <span className="font-sharetm text-[8px] tracking-[0.5em]" style={{ color: 'var(--bronze)' }}>
            HALLIDAY LEGACY // v2089.3.1
          </span>
          <div className="w-8 h-[1px]" style={{ background: 'linear-gradient(90deg, rgba(255,0,102,0.3), transparent)' }} />
        </div>
      </div>

      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,0,102,0.01) 0px, rgba(255,0,102,0.01) 1px, transparent 1px, transparent 4px)',
      }} />
    </div>
  );
}
