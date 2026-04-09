'use client';

import { useState, useEffect } from 'react';
import { GameStates } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';

export default function ScreamerOverlay() {
  const screamerActive = useGameStore((s) => s.screamerActive);
  const screamerColor = useGameStore((s) => s.screamerColor);
  const setGameState = useGameStore((s) => s.setGameState);
  const [phase, setPhase] = useState(0);
  const [shakeX, setShakeX] = useState(0);
  const [shakeY, setShakeY] = useState(0);
  const [glitchLines, setGlitchLines] = useState([]);

  const isRed = screamerColor === 'red';
  const mainColor = isRed ? '#FF0000' : '#00FF00';
  const darkColor = isRed ? '#660000' : '#006600';
  const virusText = isRed ? '⚠ VIRUS DETECTED ⚠' : '⚠ MALWARE INFILTRATED ⚠';

  useEffect(() => {
    if (!screamerActive) return;
    const interval = setInterval(() => {
      const lines = [];
      for (let i = 0; i < 15; i++) {
        lines.push({ y: Math.random() * 100, h: 0.5 + Math.random() * 3, offset: (Math.random() - 0.5) * 40, opacity: 0.3 + Math.random() * 0.7 });
      }
      setGlitchLines(lines);
      setShakeX((Math.random() - 0.5) * 30);
      setShakeY((Math.random() - 0.5) * 20);
    }, 50);
    return () => clearInterval(interval);
  }, [screamerActive]);

  useEffect(() => {
    if (!screamerActive) { setPhase(0); return; }
    setPhase(1);
    const t1 = setTimeout(() => setPhase(2), 200);
    const t2 = setTimeout(() => setPhase(3), 600);
    const t3 = setTimeout(() => setPhase(4), 1500);
    const t4 = setTimeout(() => setPhase(5), 2800);
    const t5 = setTimeout(() => {
      useGameStore.setState({ screamerActive: false });
      setGameState(GameStates.PLAYING);
    }, 3500);
    return () => { [t1, t2, t3, t4, t5].forEach(clearTimeout); };
  }, [screamerActive, setGameState]);

  if (!screamerActive) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" style={{ transform: `translate(${shakeX}px, ${shakeY}px)` }}>
      <div className="absolute inset-0" style={{
        background: phase <= 2 ? mainColor : `radial-gradient(ellipse at center, ${darkColor} 0%, #000000 70%)`,
        opacity: phase === 1 ? 1 : phase === 2 ? 0.8 : phase <= 4 ? 0.95 : 0.5,
      }} />
      {glitchLines.map((line, i) => (
        <div key={i} className="absolute left-0 right-0" style={{ top: `${line.y}%`, height: `${line.h}%`, background: mainColor, opacity: line.opacity * 0.3, transform: `translateX(${line.offset}px)` }} />
      ))}
      <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)', pointerEvents: 'none' }} />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {phase >= 3 && (
          <div className="mb-8" style={{ animation: 'pulse 0.2s infinite' }}>
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="80" r="60" fill="none" stroke={mainColor} strokeWidth="4" opacity="0.8" />
              <circle cx="75" cy="65" r="15" fill={mainColor} opacity="0.9"><animate attributeName="r" values="12;18;12" dur="0.3s" repeatCount="indefinite" /></circle>
              <circle cx="125" cy="65" r="15" fill={mainColor} opacity="0.9"><animate attributeName="r" values="12;18;12" dur="0.3s" repeatCount="indefinite" /></circle>
              <path d="M80,100 L90,110 L100,100 L110,110 L120,100" fill="none" stroke={mainColor} strokeWidth="3" />
              <line x1="50" y1="150" x2="150" y2="170" stroke={mainColor} strokeWidth="4" opacity="0.7" />
              <line x1="150" y1="150" x2="50" y2="170" stroke={mainColor} strokeWidth="4" opacity="0.7" />
            </svg>
          </div>
        )}
        {phase >= 4 && (
          <div className="text-center px-8">
            <div className="font-orbitron text-3xl md:text-5xl font-black tracking-wider mb-4" style={{ color: mainColor, textShadow: `0 0 20px ${mainColor}, 0 0 40px ${mainColor}, 0 0 80px ${darkColor}`, animation: 'pulse 0.15s infinite' }}>
              {virusText}
            </div>
            <div className="font-sharetm text-lg" style={{ color: mainColor, opacity: 0.7 }}>SISTEMA COMPROMETIDO — VIDA -1</div>
            <div className="font-sharetm text-sm mt-4" style={{ color: mainColor, opacity: 0.4 }}>{'>'} RESTAURANDO SISTEMA...</div>
          </div>
        )}
        {phase >= 2 && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="absolute font-mono text-xs" style={{ left: `${(i * 37) % 100}%`, top: `${(i * 23) % 100}%`, color: mainColor, opacity: 0.2 + (i % 5) * 0.1, fontSize: `${8 + (i % 4) * 3}px` }}>
                {(0xDEADBEEF + i * 0x1337).toString(16).toUpperCase().slice(0, 8)}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at center, transparent 30%, ${darkColor} 100%)`, opacity: 0.5 }} />
    </div>
  );
}
