'use client';

import { useState, useEffect, useRef } from 'react';
import { GameStates } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';

// ═══════════════════════════════════════════════════════════
//  AWAKENING OVERLAY — Cinematic intro sequence
//  1. Eyes open (black → slit of light)
//  2. Blue sky with clouds revealed
//  3. Rocket flies across and IMPACTS the sky
//  4. Glass shatters — sky fragments fall
//  5. Transition to gameplay
// ═══════════════════════════════════════════════════════════

function SkyFragment({ delay, x, y, rotation, size }) {
  return (
    <div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        background: 'linear-gradient(135deg, #4A9BD9 0%, #8CC8F0 40%, rgba(255,255,255,0.8) 100%)',
        clipPath: 'polygon(10% 0%, 90% 15%, 100% 80%, 60% 100%, 0% 70%)',
        animation: `sky-fall ${2 + Math.random() * 2}s ${delay}s ease-in forwards`,
        transform: `rotate(${rotation}deg)`,
        opacity: 0.9,
        boxShadow: '0 0 15px rgba(100,180,255,0.4), inset 0 0 10px rgba(255,255,255,0.3)',
      }}
    >
      {/* Glass reflection */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 50%, rgba(255,255,255,0.2) 100%)',
      }} />
    </div>
  );
}

function CloudLayer({ opacity = 1, speed = 20 }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ opacity }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="absolute" style={{
          left: `${(i * 130) % 120 - 20}%`,
          top: `${15 + (i * 17) % 50}%`,
          width: `${200 + (i * 37) % 150}px`,
          height: `${60 + (i * 13) % 40}px`,
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 40%, transparent 70%)',
          borderRadius: '50%',
          animation: `float-slow ${speed + i * 2}s ease-in-out infinite`,
          animationDelay: `${i * 0.5}s`,
        }} />
      ))}
    </div>
  );
}

export default function AwakeningOverlay() {
  const setGameState = useGameStore((s) => s.setGameState);
  const [phase, setPhase] = useState(0);
  const [eyeOpen, setEyeOpen] = useState(0);
  const [shakeIntensity, setShakeIntensity] = useState(0);
  const [fragments, setFragments] = useState([]);
  const [flashOpacity, setFlashOpacity] = useState(0);
  const containerRef = useRef(null);

  // Phase progression
  useEffect(() => {
    // Phase 0: Black screen (0-1s)
    // Phase 1: Eyes start opening (1-3s)
    // Phase 2: Sky fully revealed (3-5s)
    // Phase 3: Rocket appears (5-7s)
    // Phase 4: IMPACT! Flash + Shake (7-7.5s)
    // Phase 5: Sky fragments fall (7.5-10s)
    // Phase 6: Fade to game (10-12s)

    const timers = [];
    timers.push(setTimeout(() => setPhase(1), 1000));
    timers.push(setTimeout(() => setPhase(2), 3000));
    timers.push(setTimeout(() => setPhase(3), 5000));
    timers.push(setTimeout(() => setPhase(4), 7000));
    timers.push(setTimeout(() => setPhase(5), 7500));
    timers.push(setTimeout(() => setPhase(6), 10500));
    timers.push(setTimeout(() => {
      setGameState(GameStates.PLAYING);
    }, 12000));

    return () => timers.forEach(clearTimeout);
  }, [setGameState]);

  // Eye opening animation
  useEffect(() => {
    if (phase < 1) return;
    if (phase >= 2) { setEyeOpen(100); return; }
    let val = 0;
    const interval = setInterval(() => {
      val += 0.8;
      setEyeOpen(Math.min(val, 100));
      if (val >= 100) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [phase]);

  // Impact shake
  useEffect(() => {
    if (phase !== 4) { setShakeIntensity(0); return; }
    setFlashOpacity(1);
    setTimeout(() => setFlashOpacity(0), 200);
    let intensity = 40;
    const interval = setInterval(() => {
      intensity *= 0.92;
      setShakeIntensity(intensity);
      if (intensity < 1) { clearInterval(interval); setShakeIntensity(0); }
    }, 30);
    return () => clearInterval(interval);
  }, [phase]);

  // Generate sky fragments when impact happens
  useEffect(() => {
    if (phase < 5) return;
    const frags = [];
    for (let i = 0; i < 35; i++) {
      frags.push({
        id: i,
        x: 20 + Math.random() * 60,
        y: -10 + Math.random() * 40,
        rotation: Math.random() * 360,
        size: 30 + Math.random() * 80,
        delay: Math.random() * 1.5,
      });
    }
    setFragments(frags);
  }, [phase]);

  const shakeX = phase === 4 ? (Math.random() - 0.5) * shakeIntensity : 0;
  const shakeY = phase === 4 ? (Math.random() - 0.5) * shakeIntensity : 0;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 overflow-hidden"
      style={{
        transform: phase === 4 ? `translate(${shakeX}px, ${shakeY}px)` : 'none',
      }}
    >
      {/* BASE: Black background */}
      <div className="absolute inset-0 bg-black" />

      {/* LAYER 1: Blue sky (revealed by eye opening) */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          clipPath: `inset(${50 - eyeOpen * 0.5}% 0 ${50 - eyeOpen * 0.5}% 0)`,
          background: 'linear-gradient(180deg, #0A1628 0%, #1A3A5C 15%, #2E6B9E 30%, #4A9BD9 50%, #6CB4E8 65%, #8CC8F0 80%, #C8E6F8 95%)',
        }}
      >
        {/* Clouds */}
        <CloudLayer opacity={phase >= 2 ? 1 : 0.3} speed={25} />

        {/* Sun */}
        <div className="absolute" style={{
          left: '25%', top: '15%',
          width: '80px', height: '80px',
          background: 'radial-gradient(circle, rgba(255,252,240,1) 0%, rgba(255,240,180,0.6) 40%, rgba(255,200,100,0.2) 70%, transparent 100%)',
          borderRadius: '50%',
          filter: 'blur(2px)',
          opacity: phase >= 2 ? 1 : 0.3,
          transition: 'opacity 1s ease',
        }} />
      </div>

      {/* EYELIDS: Black bars that open like eyes */}
      {phase < 2 && (
        <>
          <div className="absolute left-0 right-0 top-0 bg-black transition-all"
            style={{ height: `${50 - eyeOpen * 0.5}%`, borderBottom: '3px solid rgba(40,20,10,0.8)' }} />
          <div className="absolute left-0 right-0 bottom-0 bg-black transition-all"
            style={{ height: `${50 - eyeOpen * 0.5}%`, borderTop: '3px solid rgba(40,20,10,0.8)' }} />
          {/* Eyelash details */}
          <div className="absolute left-0 right-0" style={{ top: `${50 - eyeOpen * 0.5}%`, transform: 'translateY(-3px)' }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="absolute" style={{
                left: `${8 + i * 7.5}%`, width: '2px', height: '8px',
                background: 'rgba(20,10,5,0.6)',
                transform: `rotate(${-15 + i * 2.5}deg)`,
              }} />
            ))}
          </div>
        </>
      )}

      {/* Blurry wake-up text */}
      {phase === 1 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center" style={{
            opacity: 0.4,
            filter: `blur(${Math.max(0, 8 - eyeOpen * 0.1)}px)`,
            transition: 'all 0.5s ease',
          }}>
            <div className="font-sharetm text-sm tracking-widest text-white mb-2">
              {'> SISTEMA: señales vitales detectadas...'}
            </div>
            <div className="font-rajdhani text-2xl text-white font-bold" style={{ textShadow: '0 0 30px rgba(0,200,255,0.5)' }}>
              ¿Dónde... estoy?
            </div>
          </div>
        </div>
      )}

      {/* Phase 2: Sky revealed - peaceful moment */}
      {phase === 2 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-fade-in-up">
          <div className="text-center">
            <div className="font-rajdhani text-3xl text-white font-bold mb-4"
              style={{ textShadow: '0 0 20px rgba(0,150,255,0.6), 0 2px 4px rgba(0,0,0,0.5)' }}>
              El cielo... es real...
            </div>
            <div className="font-sharetm text-xs tracking-widest text-blue-200" style={{ opacity: 0.7 }}>
              {'> OASIS_SKY.exe — Simulación atmosférica estable'}
            </div>
          </div>
        </div>
      )}

      {/* Phase 3: ROCKET incoming */}
      {phase >= 3 && phase < 5 && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Rocket */}
          <div style={{
            position: 'absolute',
            animation: 'rocket-fly 2.5s ease-in forwards',
            zIndex: 10,
          }}>
            <svg width="120" height="60" viewBox="0 0 120 60">
              {/* Exhaust trail */}
              <ellipse cx="110" cy="30" rx="30" ry="15" fill="rgba(255,100,0,0.6)">
                <animate attributeName="rx" values="30;50;30" dur="0.2s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="120" cy="30" rx="20" ry="10" fill="rgba(255,200,0,0.4)">
                <animate attributeName="rx" values="20;35;20" dur="0.15s" repeatCount="indefinite" />
              </ellipse>
              {/* Rocket body */}
              <path d="M10,20 L70,15 L80,30 L70,45 L10,40 Z" fill="#CC2222" stroke="#FF4444" strokeWidth="1" />
              <path d="M70,15 L90,25 L90,35 L70,45" fill="#991111" />
              {/* Nose cone */}
              <path d="M10,20 L0,30 L10,40" fill="#FF4444" />
              {/* Window */}
              <circle cx="35" cy="30" r="6" fill="#00CCFF" stroke="#006688" strokeWidth="1" opacity="0.8" />
              {/* Fins */}
              <path d="M60,15 L55,5 L50,15" fill="#AA1111" />
              <path d="M60,45 L55,55 L50,45" fill="#AA1111" />
              {/* Flame core */}
              <ellipse cx="95" cy="30" rx="10" ry="6" fill="rgba(255,255,200,0.9)">
                <animate attributeName="ry" values="6;9;6" dur="0.1s" repeatCount="indefinite" />
              </ellipse>
            </svg>
          </div>

          {/* Warning text */}
          {phase === 3 && (
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 animate-pulse">
              <div className="font-orbitron text-xl text-red-500 tracking-widest"
                style={{ textShadow: '0 0 20px rgba(255,0,0,0.8)', animation: 'chromatic-split 0.3s infinite' }}>
                ⚠ ALERTA: OBJETO NO IDENTIFICADO ⚠
              </div>
            </div>
          )}
        </div>
      )}

      {/* Phase 4: IMPACT FLASH */}
      <div className="absolute inset-0 pointer-events-none bg-white transition-opacity"
        style={{
          opacity: flashOpacity,
          transition: 'opacity 0.3s ease-out',
          zIndex: 20,
        }}
      />

      {/* Phase 4: Screen cracks */}
      {phase >= 4 && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 15 }}>
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <filter id="crack-glow">
                <feGaussianBlur stdDeviation="0.3" />
                <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {/* Crack lines from impact point */}
            {Array.from({ length: 20 }).map((_, i) => {
              const angle = (i / 20) * Math.PI * 2;
              const len = 30 + Math.random() * 40;
              const cx = 50 + Math.cos(angle) * 5;
              const cy = 35 + Math.sin(angle) * 5;
              const ex = cx + Math.cos(angle) * len;
              const ey = cy + Math.sin(angle) * len;
              const mx = (cx + ex) / 2 + (Math.random() - 0.5) * 10;
              const my = (cy + ey) / 2 + (Math.random() - 0.5) * 10;
              return (
                <path key={i}
                  d={`M${cx},${cy} Q${mx},${my} ${ex},${ey}`}
                  fill="none" stroke="rgba(200,230,255,0.7)" strokeWidth="0.15"
                  filter="url(#crack-glow)"
                  style={{
                    animation: `crack-expand 0.5s ${i * 0.02}s ease-out forwards`,
                    opacity: 0,
                  }}
                />
              );
            })}
            {/* Impact center glow */}
            <circle cx="50" cy="35" r="8" fill="rgba(255,200,100,0.3)">
              <animate attributeName="r" values="3;15;8" dur="0.5s" fill="freeze" />
              <animate attributeName="opacity" values="1;0.3" dur="1s" fill="freeze" />
            </circle>
          </svg>
        </div>
      )}

      {/* Phase 5: Sky fragments falling */}
      {phase >= 5 && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 12 }}>
          {fragments.map((f) => (
            <SkyFragment key={f.id} {...f} />
          ))}
          {/* Darkness seeping through */}
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse at 50% 35%, rgba(10,0,30,0.7) 0%, rgba(5,0,15,0.4) 40%, transparent 70%)',
            animation: 'crack-expand 2s ease-out forwards',
          }} />
          {/* Dramatic text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center animate-scale-in">
              <div className="font-orbitron text-4xl md:text-6xl font-black tracking-wider mb-4"
                style={{
                  color: '#FF0044',
                  textShadow: '0 0 30px rgba(255,0,68,0.8), 0 0 60px rgba(255,0,68,0.4)',
                  animation: 'chromatic-split 0.2s infinite',
                }}>
                EL CIELO SE ROMPE
              </div>
              <div className="font-sharetm text-sm tracking-widest" style={{ color: '#00F0FF', opacity: 0.8 }}>
                {'> BRECHA DETECTADA EN LA SIMULACIÓN'}
              </div>
              <div className="font-sharetm text-xs tracking-widest mt-2" style={{ color: '#FF6600', opacity: 0.6 }}>
                {'> FRAGMENTOS CAYENDO... SISTEMA INESTABLE'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phase 6: Fade to game */}
      {phase >= 6 && (
        <div className="absolute inset-0 z-30" style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(5,0,15,0.7) 50%, transparent 100%)',
          animation: 'fade-in-up 1.5s ease-out forwards',
        }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center animate-fade-in-up">
              <div className="font-orbitron text-2xl tracking-widest mb-2" style={{ color: '#FFBB33', textShadow: '0 0 20px rgba(255,187,51,0.6)' }}>
                BIENVENIDA AL OASIS
              </div>
              <div className="font-sharetm text-xs tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {'> Iniciando exploración...'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent scanlines */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)',
        zIndex: 25,
      }} />

      {/* Skip button */}
      <button
        onClick={() => setGameState(GameStates.PLAYING)}
        className="absolute bottom-8 right-8 z-40 font-sharetm text-xs tracking-widest cursor-pointer transition-opacity hover:opacity-100"
        style={{ color: 'rgba(255,255,255,0.3)', opacity: 0.5 }}
      >
        SALTAR →
      </button>
    </div>
  );
}
