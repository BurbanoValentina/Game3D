'use client';

import { useState, useEffect } from 'react';
import { GameStates } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';
import audioManager from '../../lib/audioManager';

// ── SVG Icons for modules ──
function ModuleIcon({ type, color, locked, comingSoon }) {
  const opacity = locked || comingSoon ? 0.3 : 1;
  const stroke = locked || comingSoon ? '#A89880' : color;

  const icons = {
    tutorial: (
      <svg width="44" height="44" viewBox="0 0 44 44" style={{ opacity }}>
        <rect x="6" y="4" width="32" height="36" rx="3" fill="none" stroke={stroke} strokeWidth="1.5" />
        <line x1="12" y1="14" x2="32" y2="14" stroke={stroke} strokeWidth="1" opacity="0.5" />
        <line x1="12" y1="20" x2="28" y2="20" stroke={stroke} strokeWidth="1" opacity="0.4" />
        <line x1="12" y1="26" x2="30" y2="26" stroke={stroke} strokeWidth="1" opacity="0.3" />
        <circle cx="22" cy="34" r="3" fill="none" stroke={stroke} strokeWidth="1" opacity="0.6">
          <animate attributeName="r" values="2.5;3.5;2.5" dur="2s" repeatCount="indefinite" />
        </circle>
        <polygon points="20,8 26,11 20,14" fill={stroke} opacity="0.6" />
      </svg>
    ),
    level: (
      <svg width="44" height="44" viewBox="0 0 44 44" style={{ opacity }}>
        <polygon points="22,3 40,14 40,30 22,41 4,30 4,14" fill="none" stroke={stroke} strokeWidth="1.5" />
        <polygon points="22,10 33,17 33,27 22,34 11,27 11,17" fill={`${stroke}15`} stroke={stroke} strokeWidth="0.8" opacity="0.5" />
        <circle cx="22" cy="22" r="4" fill={stroke} opacity="0.3">
          <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.5s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
    credits: (
      <svg width="44" height="44" viewBox="0 0 44 44" style={{ opacity }}>
        <circle cx="22" cy="16" r="7" fill="none" stroke={stroke} strokeWidth="1.5" />
        <path d="M10,38 Q10,28 22,26 Q34,28 34,38" fill="none" stroke={stroke} strokeWidth="1.5" />
        <circle cx="14" cy="16" r="5" fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.3" />
        <circle cx="30" cy="16" r="5" fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.3" />
      </svg>
    ),
    locked: (
      <svg width="44" height="44" viewBox="0 0 44 44" style={{ opacity: 0.3 }}>
        <rect x="12" y="20" width="20" height="16" rx="2" fill="none" stroke="#A89880" strokeWidth="1.5" />
        <path d="M16,20 L16,14 Q16,8 22,8 Q28,8 28,14 L28,20" fill="none" stroke="#A89880" strokeWidth="1.5" />
        <circle cx="22" cy="28" r="2" fill="#A89880" opacity="0.5" />
        <line x1="22" y1="30" x2="22" y2="33" stroke="#A89880" strokeWidth="1.5" opacity="0.4" />
      </svg>
    ),
    soon: (
      <svg width="44" height="44" viewBox="0 0 44 44" style={{ opacity: 0.25 }}>
        <circle cx="22" cy="22" r="14" fill="none" stroke="#A89880" strokeWidth="1.5" strokeDasharray="4,4" />
        <text x="22" y="26" textAnchor="middle" fill="#A89880" fontSize="10" fontFamily="Orbitron" fontWeight="700">?</text>
      </svg>
    ),
  };

  return icons[type] || icons.soon;
}

// ── Key Icon ──
function KeyIcon({ color, obtained }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <circle cx="8" cy="8" r="5" fill={obtained ? `${color}33` : 'none'} stroke={color} strokeWidth="1.5" opacity={obtained ? 1 : 0.3} />
      <circle cx="8" cy="8" r="2" fill={color} opacity={obtained ? 0.6 : 0.15} />
      <line x1="13" y1="8" x2="22" y2="8" stroke={color} strokeWidth="1.5" opacity={obtained ? 0.8 : 0.2} />
      <line x1="19" y1="5" x2="19" y2="11" stroke={color} strokeWidth="1" opacity={obtained ? 0.5 : 0.15} />
    </svg>
  );
}

// ── Status Badge ──
function StatusBadge({ status, color }) {
  const configs = {
    available: { text: 'DISPONIBLE', bg: 'rgba(0,255,136,0.08)', border: 'rgba(0,255,136,0.25)', textColor: '#00FF88' },
    locked: { text: 'BLOQUEADO', bg: 'rgba(168,152,128,0.08)', border: 'rgba(168,152,128,0.2)', textColor: '#A89880' },
    completed: { text: 'COMPLETADO', bg: 'rgba(0,255,136,0.08)', border: 'rgba(0,255,136,0.25)', textColor: '#00FF88' },
    soon: { text: 'PRÓXIMAMENTE', bg: 'rgba(168,152,128,0.06)', border: 'rgba(168,152,128,0.15)', textColor: '#A89880' },
  };
  const cfg = configs[status] || configs.soon;
  return (
    <span className="font-sharetm text-[8px] tracking-[0.3em] px-2.5 py-1 rounded-sm"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.textColor }}>
      {cfg.text}
    </span>
  );
}

export default function TrainingRoom() {
  const setGameState = useGameStore((s) => s.setGameState);
  const resetGame = useGameStore((s) => s.resetGame);
  const level1Completed = useGameStore((s) => s.level1Completed);
  const [visible, setVisible] = useState(false);
  const [hoveredModule, setHoveredModule] = useState(null);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const handleTutorial = () => {
    resetGame();
    setGameState(GameStates.TUTORIAL_GAME);
  };

  const handleLevel1 = async () => {
    resetGame();
    await audioManager.init();
    await audioManager.resume();
    setGameState(GameStates.BOOT);
  };

  const handleCredits = () => {
    if (!level1Completed) return;
    setGameState(GameStates.CREDITS);
  };

  const handleBack = () => {
    setGameState(GameStates.MAIN_MENU);
  };

  // ── Module definitions ──
  const modules = [
    {
      id: 'tutorial',
      idx: '00',
      icon: 'tutorial',
      title: 'TUTORIAL',
      subtitle: 'Sala de Entrenamiento',
      desc: 'Aprende los controles básicos: movimiento, cámara, salto y sprint en un entorno 3D seguro.',
      color: '#00F0FF',
      status: 'available',
      action: handleTutorial,
      disabled: false,
    },
    {
      id: 'level1',
      idx: '01',
      icon: 'level',
      title: 'NIVEL 1',
      subtitle: 'Las Cenizas de la Ciudad',
      desc: 'Explora la Ciudad Neón, resuelve 5 puzzles, encuentra recuerdos y obtén la Llave Ámbar.',
      color: '#FFBB33',
      keyColor: '#FFBB33',
      keyName: 'LLAVE ÁMBAR',
      status: level1Completed ? 'completed' : 'available',
      action: handleLevel1,
      disabled: false,
    },
    {
      id: 'credits',
      idx: '★',
      icon: level1Completed ? 'credits' : 'locked',
      title: 'CRÉDITOS',
      subtitle: 'El Equipo OASIS',
      desc: level1Completed
        ? 'Conoce al equipo detrás del OASIS. Tecnologías, patrones de diseño y más.'
        : 'Completa el Nivel 1 para desbloquear los créditos del equipo.',
      color: '#FF61D8',
      status: level1Completed ? 'available' : 'locked',
      action: handleCredits,
      disabled: !level1Completed,
    },
    {
      id: 'level2',
      idx: '02',
      icon: 'soon',
      title: 'NIVEL 2',
      subtitle: 'El Libro que Falta',
      desc: 'Mundo: Biblioteca de Halliday — Zona de Memoria.',
      color: '#4B0082',
      keyColor: '#4B0082',
      keyName: 'LLAVE ÍNDIGO',
      status: 'soon',
      action: null,
      disabled: true,
    },
    {
      id: 'level3',
      idx: '03',
      icon: 'soon',
      title: 'NIVEL 3',
      subtitle: 'Arena del Silencio',
      desc: 'Mundo: Coliseo Carmesí — Zona de Combate.',
      color: '#DC143C',
      keyColor: '#DC143C',
      keyName: 'LLAVE CARMESÍ',
      status: 'soon',
      action: null,
      disabled: true,
    },
    {
      id: 'level4',
      idx: '04',
      icon: 'soon',
      title: 'NIVEL 4',
      subtitle: 'Jardín de Cristal',
      desc: 'Mundo: Bosque Esmeralda — Zona de Cooperación.',
      color: '#00FF88',
      keyColor: '#00FF88',
      keyName: 'LLAVE ESMERALDA',
      status: 'soon',
      action: null,
      disabled: true,
    },
    {
      id: 'level5',
      idx: '05',
      icon: 'soon',
      title: 'NIVEL 5',
      subtitle: 'El Último Código',
      desc: 'Mundo: Torre Blanca — Zona Final.',
      color: '#FFFFFF',
      keyColor: '#FFFFFF',
      keyName: 'LLAVE BLANCA',
      status: 'soon',
      action: null,
      disabled: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center space-light-bg overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,0,102,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,102,0.015) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 10%, rgba(0,240,255,0.03) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(255,0,102,0.02) 0%, transparent 40%)',
      }} />

      {/* ── Top Bar ── */}
      <div className={`w-full max-w-3xl px-6 pt-6 flex items-center justify-between transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <button onClick={handleBack} className="oasis-btn px-4 py-2 text-[10px] cursor-pointer" style={{ color: 'var(--dark)' }}>
          ← MENÚ
        </button>
        <div className="flex items-center gap-3">
          {[
            { c: '#FFBB33', obtained: level1Completed },
            { c: '#4B0082', obtained: false },
            { c: '#DC143C', obtained: false },
            { c: '#00FF88', obtained: false },
            { c: '#FFFFFF', obtained: false },
          ].map((k, i) => (
            <KeyIcon key={i} color={k.c} obtained={k.obtained} />
          ))}
        </div>
      </div>

      {/* ── Header ── */}
      <div className={`text-center mt-6 mb-2 transition-all duration-800 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-8 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.4))' }} />
          <span className="font-sharetm text-[9px] tracking-[0.5em]" style={{ color: 'var(--bronze)' }}>OASIS // SISTEMA DE MÓDULOS</span>
          <div className="w-8 h-[1px]" style={{ background: 'linear-gradient(90deg, rgba(0,240,255,0.4), transparent)' }} />
        </div>
        <h1 className="font-orbitron text-2xl md:text-3xl tracking-[0.25em] font-bold" style={{ color: 'var(--dark)' }}>
          SALA DE ENTRENAMIENTO
        </h1>
        <div className="w-40 h-[2px] mx-auto mt-3" style={{
          background: 'linear-gradient(90deg, transparent, #00F0FF, #FF61D8, #FFBB33, transparent)',
        }} />
      </div>

      {/* ── Scrollable Module Grid ── */}
      <div className="flex-1 w-full overflow-y-auto scrollbar-hide px-4 pb-6 pt-4" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 2%, black 95%, transparent)' }}>
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3">
          {modules.map((mod, i) => {
            const isHovered = hoveredModule === mod.id;
            const isDisabled = mod.disabled;
            const isSoon = mod.status === 'soon';
            const isLocked = mod.status === 'locked';

            return (
              <button
                key={mod.id}
                onClick={mod.action}
                onMouseEnter={() => !isDisabled && setHoveredModule(mod.id)}
                onMouseLeave={() => setHoveredModule(null)}
                disabled={isDisabled}
                className={`relative text-left w-full rounded-lg p-5 transition-all duration-500 group ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{
                  transitionDelay: `${200 + i * 80}ms`,
                  background: isHovered
                    ? `linear-gradient(135deg, ${mod.color}08, ${mod.color}03)`
                    : isSoon || isLocked
                      ? 'rgba(168,152,128,0.03)'
                      : 'rgba(255,240,235,0.6)',
                  border: `1px solid ${
                    isHovered ? `${mod.color}40` :
                    isSoon || isLocked ? 'rgba(168,152,128,0.1)' :
                    'rgba(255,0,102,0.08)'
                  }`,
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  boxShadow: isHovered ? `0 0 30px ${mod.color}10, inset 0 0 30px ${mod.color}03` : 'none',
                  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                }}
              >
                {/* Corner accents */}
                {!isSoon && !isLocked && (
                  <>
                    <div className="absolute top-0 left-0 w-3 h-[1px] transition-all duration-300" style={{ background: isHovered ? mod.color : 'rgba(255,0,102,0.15)', opacity: isHovered ? 0.8 : 0.3 }} />
                    <div className="absolute top-0 left-0 w-[1px] h-3 transition-all duration-300" style={{ background: isHovered ? mod.color : 'rgba(255,0,102,0.15)', opacity: isHovered ? 0.8 : 0.3 }} />
                    <div className="absolute bottom-0 right-0 w-3 h-[1px] transition-all duration-300" style={{ background: isHovered ? mod.color : 'rgba(255,0,102,0.15)', opacity: isHovered ? 0.8 : 0.3 }} />
                    <div className="absolute bottom-0 right-0 w-[1px] h-3 transition-all duration-300" style={{ background: isHovered ? mod.color : 'rgba(255,0,102,0.15)', opacity: isHovered ? 0.8 : 0.3 }} />
                  </>
                )}

                <div className="flex items-start gap-4">
                  {/* Index */}
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    <span className="font-sharetm text-[10px] tracking-widest" style={{
                      color: isSoon || isLocked ? 'rgba(168,152,128,0.4)' : 'var(--bronze)',
                    }}>{mod.idx}</span>
                    <ModuleIcon type={mod.icon} color={mod.color} locked={isLocked} comingSoon={isSoon} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-orbitron text-sm tracking-[0.2em] transition-colors duration-300" style={{
                        color: isHovered && !isDisabled ? mod.color : isSoon || isLocked ? 'rgba(168,152,128,0.5)' : 'var(--dark)',
                        textShadow: isHovered && !isDisabled ? `0 0 10px ${mod.color}40` : 'none',
                      }}>{mod.title}</h3>
                      <StatusBadge status={mod.status} />
                    </div>

                    <p className="font-rajdhani text-xs tracking-wider mb-2" style={{
                      color: isSoon || isLocked ? 'rgba(168,152,128,0.4)' : 'var(--neon-magenta)',
                      opacity: isSoon || isLocked ? 0.6 : 0.7,
                    }}>{mod.subtitle}</p>

                    <p className="font-rajdhani text-[12px] leading-relaxed" style={{
                      color: isSoon || isLocked ? 'rgba(168,152,128,0.4)' : 'var(--darker)',
                      opacity: isSoon || isLocked ? 0.7 : 0.85,
                    }}>{mod.desc}</p>

                    {/* Key indicator for levels */}
                    {mod.keyColor && (
                      <div className="flex items-center gap-2 mt-3">
                        <svg width="14" height="14" viewBox="0 0 24 24" style={{ opacity: isSoon ? 0.2 : 0.6 }}>
                          <circle cx="8" cy="8" r="5" fill="none" stroke={mod.keyColor} strokeWidth="1.5" />
                          <circle cx="8" cy="8" r="2" fill={mod.keyColor} opacity="0.4" />
                          <line x1="13" y1="8" x2="22" y2="8" stroke={mod.keyColor} strokeWidth="1.5" />
                        </svg>
                        <span className="font-sharetm text-[9px] tracking-[0.2em]" style={{
                          color: isSoon ? 'rgba(168,152,128,0.3)' : mod.keyColor,
                          opacity: isSoon ? 0.5 : 0.7,
                          textShadow: !isSoon && mod.status === 'completed' ? `0 0 8px ${mod.keyColor}40` : 'none',
                        }}>{mod.keyName}</span>
                        {mod.status === 'completed' && (
                          <svg width="12" height="12" viewBox="0 0 12 12">
                            <path d="M2,6 L5,9 L10,3" fill="none" stroke="#00FF88" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        )}
                      </div>
                    )}

                    {/* Lock message */}
                    {isLocked && (
                      <div className="flex items-center gap-2 mt-3">
                        <svg width="10" height="10" viewBox="0 0 10 10">
                          <rect x="2" y="5" width="6" height="4" rx="0.5" fill="none" stroke="#A89880" strokeWidth="0.8" opacity="0.4" />
                          <path d="M3.5,5 L3.5,3.5 Q3.5,1.5 5,1.5 Q6.5,1.5 6.5,3.5 L6.5,5" fill="none" stroke="#A89880" strokeWidth="0.8" opacity="0.4" />
                        </svg>
                        <span className="font-sharetm text-[8px] tracking-[0.15em]" style={{ color: '#A89880', opacity: 0.5 }}>
                          COMPLETA NIVEL 1 PARA DESBLOQUEAR
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Arrow for available modules */}
                  {!isDisabled && (
                    <div className="flex-shrink-0 self-center">
                      <svg width="8" height="14" viewBox="0 0 8 14" style={{ color: mod.color, opacity: isHovered ? 0.8 : 0.2, transition: 'all 0.3s', transform: isHovered ? 'translateX(2px)' : 'none' }}>
                        <path d="M1,1 L7,7 L1,13" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Hover scan effect */}
                {isHovered && !isDisabled && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg" style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}>
                    <div className="absolute top-0 left-0 right-0 h-[1px]" style={{
                      background: `linear-gradient(90deg, transparent, ${mod.color}40, transparent)`,
                      animation: 'scan-line 2s linear infinite',
                    }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Bottom Quote ── */}
        <div className={`text-center mt-8 mb-4 transition-all duration-1000 delay-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-12 h-[1px] mx-auto mb-4" style={{ background: 'linear-gradient(90deg, transparent, var(--neon-amber), transparent)' }} />
          <p className="font-rajdhani text-[11px] tracking-[0.12em] italic leading-relaxed" style={{ color: 'var(--darker)', opacity: 0.6 }}>
            &ldquo;El verdadero entrenamiento no es aprender a jugar. Es aprender a no rendirse.&rdquo;
          </p>
          <p className="font-sharetm text-[8px] tracking-widest mt-2" style={{ color: 'var(--bronze)', opacity: 0.4 }}>— SISTEMA OASIS, 2089</p>
        </div>
      </div>

      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-20" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,0,102,0.006) 0px, rgba(255,0,102,0.006) 1px, transparent 1px, transparent 4px)',
      }} />
    </div>
  );
}
