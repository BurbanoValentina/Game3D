'use client';

import { useState } from 'react';
import { GameStates, TUTORIAL_STEPS } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';

// ── SVG Icons (dark strokes, magenta/rose accents) ──
function TutorialIcon({ type }) {
  const s = '#1A0E0E'; // dark stroke
  const a = '#FF0066'; // accent magenta
  const a2 = '#9D00FF'; // accent violet
  const w = '#FFBB33'; // warm amber

  const icons = {
    move: (
      <svg width="48" height="48" viewBox="0 0 48 48">
        <rect x="16" y="6" width="16" height="12" rx="2" fill="none" stroke={s} strokeWidth="1.5" />
        <text x="24" y="15" textAnchor="middle" fill={s} fontSize="7" fontFamily="Orbitron" fontWeight="700">W</text>
        <rect x="4" y="22" width="16" height="12" rx="2" fill="none" stroke={s} strokeWidth="1.5" />
        <text x="12" y="31" textAnchor="middle" fill={s} fontSize="7" fontFamily="Orbitron" fontWeight="700">A</text>
        <rect x="16" y="22" width="16" height="12" rx="2" fill="none" stroke={a} strokeWidth="1.5" opacity="0.4" />
        <rect x="28" y="22" width="16" height="12" rx="2" fill="none" stroke={s} strokeWidth="1.5" />
        <text x="36" y="31" textAnchor="middle" fill={s} fontSize="7" fontFamily="Orbitron" fontWeight="700">D</text>
        <rect x="16" y="38" width="16" height="12" rx="2" fill="none" stroke={s} strokeWidth="1.5" />
        <text x="24" y="47" textAnchor="middle" fill={s} fontSize="7" fontFamily="Orbitron" fontWeight="700">S</text>
      </svg>
    ),
    run: (
      <svg width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="8" r="5" fill="none" stroke={s} strokeWidth="1.5" />
        <path d="M20,16 L24,26 L30,20" fill="none" stroke={s} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M24,26 L17,38" fill="none" stroke={s} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M24,26 L33,36" fill="none" stroke={s} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M30,20 L38,14" fill="none" stroke={a} strokeWidth="1.2" strokeLinecap="round" strokeDasharray="3,3">
          <animate attributeName="stroke-dashoffset" from="0" to="-12" dur="0.6s" repeatCount="indefinite" />
        </path>
        <path d="M36,34 L42,30" fill="none" stroke={a} strokeWidth="1" opacity="0.4" strokeDasharray="2,2">
          <animate attributeName="stroke-dashoffset" from="0" to="-8" dur="0.4s" repeatCount="indefinite" />
        </path>
      </svg>
    ),
    camera: (
      <svg width="48" height="48" viewBox="0 0 48 48">
        <rect x="10" y="8" width="28" height="22" rx="3" fill="none" stroke={s} strokeWidth="1.5" />
        <circle cx="24" cy="19" r="7" fill="none" stroke={s} strokeWidth="1.2" />
        <circle cx="24" cy="19" r="3" fill={a} opacity="0.3" />
        <path d="M8,38 Q24,28 40,38" fill="none" stroke={s} strokeWidth="1" opacity="0.4" />
        <circle cx="24" cy="36" r="2" fill={a} opacity="0.5">
          <animate attributeName="cx" values="20;28;20" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
    jump: (
      <svg width="48" height="48" viewBox="0 0 48 48">
        <rect x="8" y="36" width="32" height="8" rx="2" fill="none" stroke={s} strokeWidth="1.5" />
        <text x="24" y="43" textAnchor="middle" fill={s} fontSize="6" fontFamily="Share Tech Mono">SPACE</text>
        <path d="M18,28 L24,14 L30,28" fill="none" stroke={a} strokeWidth="2" strokeLinecap="round">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1s" repeatCount="indefinite" />
        </path>
        <line x1="24" y1="14" x2="24" y2="8" stroke={a2} strokeWidth="1" opacity="0.4" strokeDasharray="2,2" />
      </svg>
    ),
    interact: (
      <svg width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="14" fill="none" stroke={s} strokeWidth="1.5" />
        <text x="24" y="29" textAnchor="middle" fill={s} fontSize="16" fontFamily="Orbitron" fontWeight="700">E</text>
        <circle cx="24" cy="24" r="18" fill="none" stroke={a} strokeWidth="0.8" opacity="0.3">
          <animate attributeName="r" values="16;20;16" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
    memory: (
      <svg width="48" height="48" viewBox="0 0 48 48">
        <path d="M14,38 L14,18 Q14,8 24,8 Q34,8 34,18 L34,38 L30,33 L24,38 L18,33 Z" fill={`${a}10`} stroke={s} strokeWidth="1.2" />
        <circle cx="19" cy="20" r="2.5" fill={a} opacity="0.4" />
        <circle cx="29" cy="20" r="2.5" fill={a} opacity="0.4" />
        <text x="24" y="46" textAnchor="middle" fill={s} fontSize="5" fontFamily="Share Tech Mono" opacity="0.5">TECLA Q</text>
      </svg>
    ),
    puzzle: (
      <svg width="48" height="48" viewBox="0 0 48 48">
        <rect x="8" y="8" width="32" height="24" rx="2" fill="none" stroke={s} strokeWidth="1.5" />
        <rect x="12" y="12" width="24" height="16" rx="1" fill={`${w}15`} />
        <text x="24" y="22" textAnchor="middle" fill={s} fontSize="6" fontFamily="Share Tech Mono">{'> _'}</text>
        <line x1="12" y1="24" x2="36" y2="24" stroke={s} strokeWidth="0.5" opacity="0.2" />
        <circle cx="24" cy="40" r="4" fill="none" stroke={w} strokeWidth="1.2" />
        <text x="24" y="42.5" textAnchor="middle" fill={w} fontSize="5" fontWeight="700">?</text>
      </svg>
    ),
    map: (
      <svg width="48" height="48" viewBox="0 0 48 48">
        <rect x="6" y="6" width="36" height="36" rx="4" fill="none" stroke={s} strokeWidth="1.5" />
        <line x1="6" y1="18" x2="42" y2="18" stroke={s} strokeWidth="0.5" opacity="0.2" />
        <line x1="6" y1="30" x2="42" y2="30" stroke={s} strokeWidth="0.5" opacity="0.2" />
        <line x1="18" y1="6" x2="18" y2="42" stroke={s} strokeWidth="0.5" opacity="0.2" />
        <line x1="30" y1="6" x2="30" y2="42" stroke={s} strokeWidth="0.5" opacity="0.2" />
        <circle cx="24" cy="24" r="3" fill={a} opacity="0.7">
          <animate attributeName="r" values="2.5;3.5;2.5" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <rect x="14" y="12" width="4" height="4" fill={w} opacity="0.5" transform="rotate(45 16 14)" />
        <rect x="32" y="28" width="4" height="4" fill={w} opacity="0.5" transform="rotate(45 34 30)" />
        <circle cx="10" cy="34" r="2" fill={w} opacity="0.4" />
      </svg>
    ),
    key: (
      <svg width="48" height="48" viewBox="0 0 48 48">
        <circle cx="16" cy="24" r="8" fill="none" stroke={w} strokeWidth="1.8" />
        <circle cx="16" cy="24" r="3.5" fill={w} opacity="0.25" />
        <line x1="24" y1="24" x2="40" y2="24" stroke={w} strokeWidth="1.8" strokeLinecap="round" />
        <line x1="34" y1="20" x2="34" y2="28" stroke={w} strokeWidth="1.2" />
        <line x1="40" y1="20" x2="40" y2="28" stroke={w} strokeWidth="1.2" />
        <path d="M16,24 L16,16" fill="none" stroke={w} strokeWidth="0.8" opacity="0.3" strokeDasharray="2,2" />
      </svg>
    ),
    token: (
      <svg width="48" height="48" viewBox="0 0 48 48">
        <polygon points="24,6 38,24 24,42 10,24" fill={`${w}20`} stroke={w} strokeWidth="1.5" />
        <polygon points="24,14 32,24 24,34 16,24" fill={`${w}15`} stroke={w} strokeWidth="0.8" opacity="0.5" />
        <circle cx="24" cy="24" r="3" fill={w} opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
    trap: (
      <svg width="48" height="48" viewBox="0 0 48 48">
        <polygon points="24,4 44,40 4,40" fill={`${a}10`} stroke={a} strokeWidth="1.8" />
        <line x1="24" y1="16" x2="24" y2="28" stroke={s} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="24" cy="34" r="2" fill={s} />
        <line x1="8" y1="4" x2="12" y2="8" stroke={a} strokeWidth="1" opacity="0.3" />
        <line x1="40" y1="4" x2="36" y2="8" stroke={a} strokeWidth="1" opacity="0.3" />
      </svg>
    ),
    health: (
      <svg width="48" height="48" viewBox="0 0 48 48">
        <path d="M24,40 L8,24 Q4,16 12,12 Q20,8 24,16 Q28,8 36,12 Q44,16 40,24 Z" fill={`${a}20`} stroke={a} strokeWidth="1.5" />
        <path d="M24,34 L14,24 Q11,19 16,16 Q21,13 24,19 Q27,13 32,16 Q37,19 34,24 Z" fill={a} opacity="0.2" />
        <text x="24" y="46" textAnchor="middle" fill={s} fontSize="5" fontFamily="Share Tech Mono" opacity="0.4">x10</text>
      </svg>
    ),
    parkour: (
      <svg width="48" height="48" viewBox="0 0 48 48">
        <rect x="4" y="36" width="14" height="8" rx="1" fill="none" stroke={s} strokeWidth="1.2" />
        <rect x="22" y="28" width="10" height="16" rx="1" fill="none" stroke={a2} strokeWidth="1.2" opacity="0.6" />
        <rect x="36" y="20" width="8" height="24" rx="1" fill="none" stroke={a} strokeWidth="1.2" opacity="0.5" />
        <path d="M11,32 L27,24 L40,16" fill="none" stroke={s} strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
        <circle cx="11" cy="32" r="2" fill={s} opacity="0.5" />
        <line x1="40" y1="6" x2="40" y2="16" stroke={w} strokeWidth="1.5" opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="1.5s" repeatCount="indefinite" />
        </line>
      </svg>
    ),
    pause: (
      <svg width="48" height="48" viewBox="0 0 48 48">
        <rect x="8" y="8" width="32" height="32" rx="4" fill="none" stroke={s} strokeWidth="1.5" />
        <rect x="16" y="16" width="5" height="16" rx="1" fill={s} opacity="0.7" />
        <rect x="27" y="16" width="5" height="16" rx="1" fill={s} opacity="0.7" />
        <text x="24" y="46" textAnchor="middle" fill={s} fontSize="5" fontFamily="Share Tech Mono" opacity="0.4">ESC</text>
      </svg>
    ),
  };

  return icons[type] || <div className="w-12 h-12 rounded-full" style={{ background: 'rgba(255,0,102,0.1)' }} />;
}

export default function TutorialScreen() {
  const setGameState = useGameStore((s) => s.setGameState);
  const [step, setStep] = useState(0);
  const total = TUTORIAL_STEPS.length;
  const current = TUTORIAL_STEPS[step];

  const handleNext = () => { if (step < total - 1) setStep(step + 1); else setGameState(GameStates.MAIN_MENU); };
  const handleSkip = () => setGameState(GameStates.MAIN_MENU);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 space-light-bg">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,0,102,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,102,0.03) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      <div className="w-full max-w-lg text-center relative z-10">
        {/* Header */}
        <div className="mb-4">
          <h1 className="font-orbitron text-lg tracking-[0.3em] mb-1" style={{ color: 'var(--dark)' }}>TUTORIAL</h1>
          <span className="font-sharetm text-[10px] tracking-[0.5em]" style={{ color: 'var(--bronze)' }}>
            PASO {step + 1} DE {total}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-[3px] rounded-full mb-6 overflow-hidden" style={{ background: 'rgba(255,0,102,0.08)' }}>
          <div className="h-full rounded-full transition-all duration-500" style={{
            width: `${((step + 1) / total) * 100}%`,
            background: 'linear-gradient(90deg, var(--neon-magenta), var(--neon-violet))',
            boxShadow: '0 0 10px rgba(255,0,102,0.3)',
          }} />
        </div>

        {/* Step card */}
        <div className="rounded-lg p-8 mb-6 animate-fade-in-up text-left" key={step} style={{
          background: 'rgba(255,235,225,0.92)', border: '1px solid rgba(255,0,102,0.1)',
          boxShadow: '0 0 40px rgba(255,0,102,0.03)',
        }}>
          <div className="flex items-start gap-5">
            {/* Icon */}
            <div className="flex-shrink-0 mt-1">
              <TutorialIcon type={current.icon} />
            </div>

            <div className="flex-1">
              {/* Key badges */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {current.keys.split(' ').map((k, i) => (
                  <kbd key={i} className="font-orbitron text-[11px] px-2.5 py-1 rounded" style={{
                    background: 'rgba(255,0,102,0.06)', border: '1px solid rgba(255,0,102,0.2)',
                    color: 'var(--neon-magenta)',
                  }}>{k}</kbd>
                ))}
              </div>

              <h2 className="font-orbitron text-base tracking-widest mb-2" style={{ color: 'var(--dark)' }}>{current.title}</h2>
              <p className="font-rajdhani text-sm leading-relaxed" style={{ color: 'var(--darker)', lineHeight: '1.7' }}>{current.desc}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button onClick={handleSkip} className="font-sharetm text-[10px] tracking-widest hover:underline cursor-pointer" style={{ color: 'var(--bronze)' }}>SALTAR TUTORIAL</button>
          <div className="flex gap-2">
            {step > 0 && <button onClick={() => setStep(step - 1)} className="oasis-btn px-5 py-2 text-xs cursor-pointer" style={{ color: 'var(--dark)' }}>ANTERIOR</button>}
            <button onClick={handleNext} className="oasis-btn px-5 py-2 text-xs cursor-pointer" style={{
              color: step === total - 1 ? 'var(--dark)' : 'var(--neon-magenta)',
              borderColor: step === total - 1 ? 'rgba(0,255,136,0.4)' : 'rgba(255,0,102,0.3)',
            }}>{step === total - 1 ? 'ENTENDIDO' : 'SIGUIENTE'}</button>
          </div>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-1.5 mt-5">
          {TUTORIAL_STEPS.map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer" onClick={() => setStep(i)} style={{
              background: i <= step ? 'var(--neon-magenta)' : 'rgba(168,152,128,0.3)',
              boxShadow: i === step ? '0 0 6px var(--neon-magenta)' : 'none',
              transform: i === step ? 'scale(1.5)' : 'scale(1)',
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}
