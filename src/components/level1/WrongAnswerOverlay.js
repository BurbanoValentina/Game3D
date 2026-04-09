'use client';

import { useState, useEffect, useRef } from 'react';
import { GameStates } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';

// ═══════════════════════════════════════════════════════════
//  WRONG ANSWER OVERLAY — Character suffering + Life lost
//  Heavy screen shake, glitch distortion, giant announcement
// ═══════════════════════════════════════════════════════════

export default function WrongAnswerOverlay() {
  const setGameState = useGameStore((s) => s.setGameState);
  const lives = useGameStore((s) => s.lives);
  const [phase, setPhase] = useState(0);
  const [shakeX, setShakeX] = useState(0);
  const [shakeY, setShakeY] = useState(0);
  const [glitchBars, setGlitchBars] = useState([]);
  const [distortAngle, setDistortAngle] = useState(0);
  const [heartScale, setHeartScale] = useState(1);
  const intervalRef = useRef(null);

  // Vibration API
  useEffect(() => {
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 200, 50, 300, 100, 100, 50, 200]);
    }
  }, []);

  // Phase progression
  useEffect(() => {
    // Phase 0: Initial flash (0-0.2s)
    // Phase 1: Heavy shake + distortion (0.2-1.5s)
    // Phase 2: Giant "PERDISTE UNA VIDA" (1.5-3.5s)
    // Phase 3: Suffering character + heartbeat (3.5-5s)
    // Phase 4: Fade out (5-6s)
    setPhase(0);
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 1500);
    const t3 = setTimeout(() => setPhase(3), 3500);
    const t4 = setTimeout(() => setPhase(4), 5000);
    const t5 = setTimeout(() => {
      if (lives <= 0) {
        setGameState(GameStates.GAME_OVER);
      } else {
        setGameState(GameStates.PLAYING);
      }
    }, 6000);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [lives, setGameState]);

  // Heavy screen shake + glitch bars
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (phase <= 3) {
        const intensity = phase === 0 ? 40 : phase === 1 ? 25 : phase === 2 ? 15 : 5;
        setShakeX((Math.random() - 0.5) * intensity);
        setShakeY((Math.random() - 0.5) * intensity);
        setDistortAngle((Math.random() - 0.5) * (phase <= 1 ? 3 : 1));

        // Glitch bars
        const bars = [];
        const barCount = phase <= 1 ? 20 : phase === 2 ? 10 : 3;
        for (let i = 0; i < barCount; i++) {
          bars.push({
            top: Math.random() * 100,
            height: 0.5 + Math.random() * 4,
            offset: (Math.random() - 0.5) * 60,
            color: Math.random() > 0.5 ? 'rgba(255,0,0,0.4)' : 'rgba(255,0,60,0.3)',
            width: 30 + Math.random() * 70,
          });
        }
        setGlitchBars(bars);
      }
      // Heartbeat animation
      setHeartScale(prev => {
        const t = Date.now() / 200;
        return 1 + Math.sin(t) * 0.15;
      });
    }, 40);
    return () => clearInterval(intervalRef.current);
  }, [phase]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" style={{
      transform: `translate(${shakeX}px, ${shakeY}px) rotate(${distortAngle}deg)`,
    }}>
      {/* Blood red vignette */}
      <div className="absolute inset-0" style={{
        background: phase === 0
          ? 'rgba(255,0,0,0.8)'
          : `radial-gradient(ellipse at center, rgba(80,0,0,${phase <= 2 ? 0.85 : 0.6}) 0%, rgba(30,0,0,${phase <= 2 ? 0.95 : 0.7}) 50%, rgba(0,0,0,0.98) 100%)`,
        transition: 'all 0.3s ease',
      }} />

      {/* Suffering character silhouette */}
      {phase >= 1 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: phase >= 3 ? 0.3 : 0.15 }}>
          <svg width="300" height="400" viewBox="0 0 300 400" style={{
            animation: phase <= 2 ? 'screen-shake-heavy 0.15s infinite' : 'none',
            filter: 'drop-shadow(0 0 30px rgba(255,0,0,0.5))',
          }}>
            {/* Character in pain pose */}
            <g transform="translate(150, 100)">
              {/* Head thrown back */}
              <ellipse cx="0" cy="-10" rx="30" ry="35" fill="none" stroke="#FF0044" strokeWidth="2" opacity="0.6" />
              {/* Eyes squeezed shut — pain */}
              <path d="M-15,-18 L-5,-15 L-15,-12" fill="none" stroke="#FF0044" strokeWidth="2.5" />
              <path d="M5,-18 L15,-15 L5,-12" fill="none" stroke="#FF0044" strokeWidth="2.5" />
              {/* Mouth screaming */}
              <ellipse cx="0" cy="5" rx="10" ry="14" fill="none" stroke="#FF0044" strokeWidth="2" />
              {/* Pain lines radiating from head */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <line key={i}
                  x1={Math.cos(angle * Math.PI / 180) * 40}
                  y1={-10 + Math.sin(angle * Math.PI / 180) * 40}
                  x2={Math.cos(angle * Math.PI / 180) * 55}
                  y2={-10 + Math.sin(angle * Math.PI / 180) * 55}
                  stroke="#FF0044" strokeWidth="1.5" opacity="0.4">
                  <animate attributeName="opacity" values="0.2;0.6;0.2" dur="0.3s" repeatCount="indefinite" begin={`${i * 0.04}s`} />
                </line>
              ))}
              {/* Body crouched in pain */}
              <path d="M-25,30 Q-30,80 -20,140 Q0,150 20,140 Q30,80 25,30" fill="none" stroke="#FF0044" strokeWidth="2" opacity="0.5" />
              {/* Arms clutching head */}
              <path d="M-25,40 Q-40,10 -25,-15" fill="none" stroke="#FF0044" strokeWidth="3" strokeLinecap="round" />
              <path d="M25,40 Q40,10 25,-15" fill="none" stroke="#FF0044" strokeWidth="3" strokeLinecap="round" />
              {/* Legs kneeling */}
              <path d="M-15,140 Q-25,180 -30,220" fill="none" stroke="#FF0044" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M15,140 Q25,180 30,220" fill="none" stroke="#FF0044" strokeWidth="2.5" strokeLinecap="round" />
              {/* Virus/corruption particles */}
              {Array.from({ length: 15 }).map((_, i) => (
                <circle key={`p${i}`}
                  cx={(Math.random() - 0.5) * 120}
                  cy={-40 + Math.random() * 280}
                  r={1 + Math.random() * 3}
                  fill="#FF0044" opacity="0.3">
                  <animate attributeName="cy" values={`${-40 + Math.random() * 280};${-60 + Math.random() * 300}`} dur={`${0.5 + Math.random()}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.1;0.5;0.1" dur={`${0.3 + Math.random() * 0.5}s`} repeatCount="indefinite" />
                </circle>
              ))}
            </g>
          </svg>
        </div>
      )}

      {/* Glitch distortion bars */}
      {glitchBars.map((bar, i) => (
        <div key={i} className="absolute" style={{
          top: `${bar.top}%`,
          left: `${(100 - bar.width) / 2}%`,
          width: `${bar.width}%`,
          height: `${bar.height}%`,
          background: bar.color,
          transform: `translateX(${bar.offset}px)`,
        }} />
      ))}

      {/* VHS scanlines */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)',
      }} />

      {/* ══ GIANT "PERDISTE UNA VIDA" ANNOUNCEMENT ══ */}
      {phase >= 2 && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 10 }}>
          <div className="text-center animate-life-lost-zoom">
            {/* Broken heart */}
            <div className="mb-6" style={{
              transform: `scale(${heartScale})`,
              filter: 'drop-shadow(0 0 40px rgba(255,0,0,0.8))',
            }}>
              <svg width="120" height="110" viewBox="0 0 120 110">
                <defs>
                  <filter id="heart-glow"><feGaussianBlur stdDeviation="3" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>
                {/* Left half */}
                <path d="M60 100S10 65 10 35C10 15 25 5 40 5c10 0 17 6 20 14" fill="#CC0033" stroke="#FF0044" strokeWidth="1.5" filter="url(#heart-glow)">
                  <animate attributeName="fill" values="#CC0033;#FF0055;#CC0033" dur="0.4s" repeatCount="indefinite" />
                </path>
                {/* Right half — shifted to show crack */}
                <path d="M60 100S110 65 110 35C110 15 95 5 80 5c-10 0-17 6-20 14" fill="#990022" stroke="#FF0044" strokeWidth="1.5" filter="url(#heart-glow)" transform="translate(3,2)">
                  <animate attributeName="fill" values="#990022;#CC0044;#990022" dur="0.4s" repeatCount="indefinite" />
                </path>
                {/* Crack line */}
                <path d="M60,15 L55,35 L65,50 L55,70 L62,90 L58,100" fill="none" stroke="#000" strokeWidth="3" opacity="0.8" />
                <path d="M60,15 L55,35 L65,50 L55,70 L62,90 L58,100" fill="none" stroke="#FF4466" strokeWidth="1.5" />
              </svg>
            </div>

            {/* MAIN TEXT */}
            <div className="font-orbitron text-5xl md:text-7xl font-black tracking-wider mb-4"
              style={{
                color: '#FF0033',
                textShadow: '0 0 30px rgba(255,0,51,0.9), 0 0 60px rgba(255,0,51,0.5), 0 0 120px rgba(255,0,51,0.3), 4px 4px 0 rgba(0,0,0,0.5)',
                animation: 'chromatic-split 0.15s infinite',
                WebkitTextStroke: '1px rgba(255,100,100,0.5)',
              }}>
              PERDISTE UNA VIDA
            </div>

            {/* Sub text */}
            <div className="font-sharetm text-xl tracking-widest mb-2" style={{
              color: '#FF4466',
              textShadow: '0 0 15px rgba(255,68,102,0.6)',
              animation: 'pulse 0.5s infinite',
            }}>
              ❌ RESPUESTA INCORRECTA ❌
            </div>

            {/* Lives remaining */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <span className="font-sharetm text-sm" style={{ color: 'rgba(255,200,200,0.6)' }}>VIDAS RESTANTES:</span>
              <div className="flex gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <svg key={i} width="20" height="18" viewBox="0 0 18 16">
                    <path d="M9 14s-7-4.35-7-8.5C2 3.01 3.79 1.5 6 1.5c1.54 0 2.81.99 3 2.36C9.19 2.49 10.46 1.5 12 1.5c2.21 0 4 1.51 4 3.5C16 9.65 9 14 9 14z"
                      fill={i < lives ? '#FF2244' : 'rgba(100,0,0,0.3)'}
                      stroke={i < lives ? '#FF4466' : 'rgba(100,0,0,0.2)'}
                      strokeWidth="0.5"
                      style={{ filter: i < lives ? 'drop-shadow(0 0 3px #FF2244)' : 'none' }}
                    />
                  </svg>
                ))}
              </div>
            </div>

            {/* Warning text */}
            <div className="mt-4 font-sharetm text-xs" style={{ color: 'rgba(255,150,150,0.4)' }}>
              {'> SISTEMA_VITAL: integridad comprometida — resistencia reducida'}
            </div>
          </div>
        </div>
      )}

      {/* Chromatic aberration border effect */}
      <div className="absolute inset-0 pointer-events-none" style={{
        boxShadow: phase <= 2
          ? 'inset 0 0 100px rgba(255,0,0,0.5), inset 0 0 200px rgba(200,0,0,0.3)'
          : 'inset 0 0 60px rgba(255,0,0,0.2)',
        transition: 'all 0.5s ease',
      }} />

      {/* Static noise overlay */}
      {phase <= 2 && (
        <div className="absolute inset-0 pointer-events-none" style={{
          opacity: 0.08,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          animation: 'static-noise 0.2s steps(4) infinite',
        }} />
      )}

      {/* Red vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(100,0,0,0.6) 100%)',
      }} />
    </div>
  );
}
