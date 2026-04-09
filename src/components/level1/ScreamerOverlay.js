'use client';

import { useState, useEffect, useRef } from 'react';
import { GameStates } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';

// ═══════════════════════════════════════════════════════════
//  SCREAMER OVERLAY — GLITCH/VIRUS PICKUP
//  Screen breaks like glass, violent vibration, distortion,
//  character suffers from the virus infection
// ═══════════════════════════════════════════════════════════

export default function ScreamerOverlay() {
  const screamerActive = useGameStore((s) => s.screamerActive);
  const screamerColor = useGameStore((s) => s.screamerColor);
  const setGameState = useGameStore((s) => s.setGameState);
  const [phase, setPhase] = useState(0);
  const [shakeX, setShakeX] = useState(0);
  const [shakeY, setShakeY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [glitchBars, setGlitchBars] = useState([]);
  const [cracks, setCracks] = useState([]);
  const [fragments, setFragments] = useState([]);
  const intervalRef = useRef(null);

  const isRed = screamerColor === 'red';
  const mainColor = isRed ? '#FF0000' : '#00FF00';
  const darkColor = isRed ? '#660000' : '#006600';
  const glowColor = isRed ? 'rgba(255,0,0,' : 'rgba(0,255,0,';
  const virusText = isRed ? '⚠ VIRUS DETECTADO ⚠' : '⚠ MALWARE INFILTRADO ⚠';

  // Vibration API
  useEffect(() => {
    if (!screamerActive) return;
    if (navigator.vibrate) {
      navigator.vibrate([200, 30, 100, 30, 300, 50, 200, 30, 150, 30, 250, 50, 100]);
    }
    return () => { if (navigator.vibrate) navigator.vibrate(0); };
  }, [screamerActive]);

  // Generate screen cracks on mount
  useEffect(() => {
    if (!screamerActive) return;
    const newCracks = [];
    const impactX = 45 + Math.random() * 10;
    const impactY = 40 + Math.random() * 20;
    for (let i = 0; i < 25; i++) {
      const angle = (i / 25) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const length = 15 + Math.random() * 45;
      const segments = [];
      let cx = impactX, cy = impactY;
      const steps = 3 + Math.floor(Math.random() * 4);
      for (let s = 0; s < steps; s++) {
        const nx = cx + (Math.cos(angle) * length / steps) + (Math.random() - 0.5) * 8;
        const ny = cy + (Math.sin(angle) * length / steps) + (Math.random() - 0.5) * 8;
        segments.push({ x1: cx, y1: cy, x2: nx, y2: ny });
        cx = nx; cy = ny;
      }
      newCracks.push({ segments, delay: i * 0.015 });
    }
    setCracks(newCracks);

    // Screen fragments
    const frags = [];
    for (let i = 0; i < 20; i++) {
      frags.push({
        x: impactX + (Math.random() - 0.5) * 30,
        y: impactY + (Math.random() - 0.5) * 20,
        size: 5 + Math.random() * 15,
        rotation: Math.random() * 360,
        delay: 0.3 + Math.random() * 0.5,
        color: mainColor,
      });
    }
    setFragments(frags);
  }, [screamerActive, mainColor]);

  // Phase progression
  useEffect(() => {
    if (!screamerActive) { setPhase(0); return; }
    setPhase(0);
    const t0 = setTimeout(() => setPhase(1), 300);
    const t1 = setTimeout(() => setPhase(2), 1000);
    const t2 = setTimeout(() => setPhase(3), 2500);
    const t3 = setTimeout(() => setPhase(4), 4000);
    const t4 = setTimeout(() => {
      useGameStore.setState({ screamerActive: false });
      setGameState(GameStates.PLAYING);
    }, 5000);
    return () => [t0, t1, t2, t3, t4].forEach(clearTimeout);
  }, [screamerActive, setGameState]);

  // Continuous shake + glitch effect
  useEffect(() => {
    if (!screamerActive) return;
    intervalRef.current = setInterval(() => {
      const intensity = phase === 0 ? 50 : phase === 1 ? 35 : phase === 2 ? 20 : phase === 3 ? 10 : 3;
      setShakeX((Math.random() - 0.5) * intensity);
      setShakeY((Math.random() - 0.5) * intensity);
      setRotation((Math.random() - 0.5) * (phase <= 1 ? 4 : 1));

      const bars = [];
      const barCount = phase <= 1 ? 25 : phase <= 2 ? 15 : 5;
      for (let i = 0; i < barCount; i++) {
        bars.push({
          top: Math.random() * 100,
          height: 0.3 + Math.random() * (phase <= 1 ? 5 : 2),
          offset: (Math.random() - 0.5) * 80,
          opacity: 0.2 + Math.random() * 0.6,
          hue: Math.random() > 0.7,
        });
      }
      setGlitchBars(bars);
    }, 35);
    return () => clearInterval(intervalRef.current);
  }, [screamerActive, phase]);

  if (!screamerActive) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" style={{
      transform: `translate(${shakeX}px, ${shakeY}px) rotate(${rotation}deg)`,
      animation: phase <= 2 ? 'distortion-wave 0.3s infinite' : 'none',
    }}>
      {/* Phase 0: WHITE FLASH — screen break impact */}
      {phase === 0 && (
        <div className="absolute inset-0" style={{
          background: mainColor,
          animation: 'glass-shatter 0.3s ease-out',
        }} />
      )}

      {/* Base dark background */}
      <div className="absolute inset-0" style={{
        background: phase <= 1
          ? mainColor
          : `radial-gradient(ellipse at center, ${darkColor} 0%, #000000 70%)`,
        opacity: phase === 0 ? 1 : phase === 1 ? 0.8 : 0.95,
        transition: 'all 0.3s ease',
      }} />

      {/* ══ SCREEN CRACK EFFECT ══ */}
      {phase >= 1 && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none"
          style={{ zIndex: 5, filter: `drop-shadow(0 0 3px ${mainColor})` }}>
          {cracks.map((crack, ci) => (
            crack.segments.map((seg, si) => (
              <line key={`${ci}-${si}`}
                x1={seg.x1} y1={seg.y1}
                x2={seg.x2} y2={seg.y2}
                stroke={mainColor}
                strokeWidth={0.2 + Math.random() * 0.2}
                opacity={0.6 + Math.random() * 0.4}
                style={{
                  animation: `crack-expand 0.3s ${crack.delay + si * 0.02}s ease-out forwards`,
                }}
              />
            ))
          ))}
          <circle cx="47" cy="48" r="5" fill={mainColor} opacity="0.4">
            <animate attributeName="r" values="2;8;3" dur="0.5s" fill="freeze" />
            <animate attributeName="opacity" values="0.8;0.2;0.3" dur="0.5s" fill="freeze" />
          </circle>
        </svg>
      )}

      {/* ══ FALLING SCREEN FRAGMENTS ══ */}
      {phase >= 1 && fragments.map((frag, i) => (
        <div key={i} className="absolute" style={{
          left: `${frag.x}%`,
          top: `${frag.y}%`,
          width: `${frag.size}vw`,
          height: `${frag.size * 0.6}vw`,
          background: `linear-gradient(135deg, ${frag.color}33 0%, transparent 50%, ${frag.color}22 100%)`,
          border: `1px solid ${frag.color}55`,
          transform: `rotate(${frag.rotation}deg)`,
          animation: `sky-fall ${1.5 + Math.random()}s ${frag.delay}s ease-in forwards`,
          clipPath: 'polygon(15% 0%, 100% 10%, 85% 100%, 0% 80%)',
        }} />
      ))}

      {/* ══ SUFFERING CHARACTER ══ */}
      {phase >= 2 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: 0.25, zIndex: 3 }}>
          <svg width="280" height="350" viewBox="0 0 280 350" style={{
            animation: 'screen-shake-heavy 0.1s infinite',
            filter: `drop-shadow(0 0 20px ${mainColor})`,
          }}>
            <g transform="translate(140, 80)">
              <ellipse cx="0" cy="0" rx="28" ry="32" fill="none" stroke={mainColor} strokeWidth="2.5" opacity="0.7">
                <animate attributeName="rx" values="28;30;26;28" dur="0.2s" repeatCount="indefinite" />
              </ellipse>
              {/* Eyes X — virus effect */}
              <g opacity="0.9">
                <line x1="-18" y1="-10" x2="-8" y2="0" stroke={mainColor} strokeWidth="3" />
                <line x1="-8" y1="-10" x2="-18" y2="0" stroke={mainColor} strokeWidth="3" />
                <line x1="8" y1="-10" x2="18" y2="0" stroke={mainColor} strokeWidth="3" />
                <line x1="18" y1="-10" x2="8" y2="0" stroke={mainColor} strokeWidth="3" />
              </g>
              {/* Mouth scream */}
              <ellipse cx="0" cy="15" rx="12" ry="8" fill="none" stroke={mainColor} strokeWidth="2">
                <animate attributeName="ry" values="8;12;8" dur="0.15s" repeatCount="indefinite" />
              </ellipse>
              {/* Virus particles converging */}
              {Array.from({ length: 20 }).map((_, i) => {
                const angle = (i / 20) * Math.PI * 2;
                const dist = 35 + Math.random() * 50;
                return (
                  <circle key={i}
                    cx={Math.cos(angle) * dist}
                    cy={Math.sin(angle) * dist}
                    r={1.5 + Math.random() * 2}
                    fill={mainColor} opacity="0.5">
                    <animate attributeName="cx" values={`${Math.cos(angle) * dist};${Math.cos(angle) * 20};${Math.cos(angle) * dist}`} dur={`${0.5 + Math.random()}s`} repeatCount="indefinite" />
                    <animate attributeName="cy" values={`${Math.sin(angle) * dist};${Math.sin(angle) * 20};${Math.sin(angle) * dist}`} dur={`${0.5 + Math.random()}s`} repeatCount="indefinite" />
                  </circle>
                );
              })}
              {/* Body convulsing */}
              <path d="M-20,40 Q-25,100 -15,160 Q0,170 15,160 Q25,100 20,40" fill="none" stroke={mainColor} strokeWidth="2" opacity="0.5">
                <animate attributeName="d" values="M-20,40 Q-25,100 -15,160 Q0,170 15,160 Q25,100 20,40;M-22,40 Q-20,95 -18,160 Q0,175 18,160 Q20,95 22,40;M-20,40 Q-25,100 -15,160 Q0,170 15,160 Q25,100 20,40" dur="0.2s" repeatCount="indefinite" />
              </path>
              {/* Arms flailing */}
              <path d="M-20,50 Q-50,30 -55,60" fill="none" stroke={mainColor} strokeWidth="2.5" strokeLinecap="round">
                <animate attributeName="d" values="M-20,50 Q-50,30 -55,60;M-20,50 Q-45,20 -60,45;M-20,50 Q-50,30 -55,60" dur="0.15s" repeatCount="indefinite" />
              </path>
              <path d="M20,50 Q50,30 55,60" fill="none" stroke={mainColor} strokeWidth="2.5" strokeLinecap="round">
                <animate attributeName="d" values="M20,50 Q50,30 55,60;M20,50 Q45,20 60,45;M20,50 Q50,30 55,60" dur="0.15s" repeatCount="indefinite" />
              </path>
            </g>
          </svg>
        </div>
      )}

      {/* Horizontal glitch bars */}
      {glitchBars.map((bar, i) => (
        <div key={i} className="absolute left-0 right-0" style={{
          top: `${bar.top}%`,
          height: `${bar.height}%`,
          background: bar.hue ? `${glowColor}${bar.opacity})` : mainColor,
          opacity: bar.opacity * 0.4,
          transform: `translateX(${bar.offset}px)`,
          mixBlendMode: 'screen',
        }} />
      ))}

      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)',
        zIndex: 6,
      }} />

      {/* ══ VIRUS TEXT ══ */}
      {phase >= 3 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ zIndex: 8 }}>
          <div className="text-center px-8">
            <div className="font-orbitron text-4xl md:text-6xl font-black tracking-wider mb-4" style={{
              color: mainColor,
              textShadow: `0 0 30px ${mainColor}, 0 0 60px ${mainColor}, 0 0 120px ${darkColor}`,
              animation: 'chromatic-split 0.12s infinite',
            }}>
              {virusText}
            </div>
            <div className="font-sharetm text-lg mb-2" style={{ color: mainColor, opacity: 0.8 }}>
              SISTEMA COMPROMETIDO — VIDA -1
            </div>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: mainColor, boxShadow: `0 0 8px ${mainColor}` }} />
              <span className="font-sharetm text-sm" style={{ color: mainColor, opacity: 0.5 }}>
                {'>'} RESTAURANDO SISTEMA...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Hex codes */}
      {phase >= 2 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2 }}>
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="absolute font-mono" style={{
              left: `${(i * 37 + 5) % 100}%`,
              top: `${(i * 23 + 7) % 100}%`,
              color: mainColor,
              opacity: 0.15 + (i % 5) * 0.05,
              fontSize: `${6 + (i % 4) * 3}px`,
              animation: `vhs-tracking ${0.5 + (i % 3) * 0.3}s infinite`,
            }}>
              {(0xDEADBEEF + i * 0x1337).toString(16).toUpperCase().slice(0, 8)}
            </div>
          ))}
        </div>
      )}

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse at center, transparent 20%, ${darkColor} 100%)`,
        opacity: 0.6,
        zIndex: 7,
      }} />
    </div>
  );
}
