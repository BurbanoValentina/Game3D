// ══════════════════════════════════════════════════════
//  SCREAMER OVERLAY — MAXIMUM INTENSITY
//  Screen breaks, vibration, character suffers from virus
//  Like Doors from Roblox — TERRIFYING experience
// ══════════════════════════════════════════════════════

'use client';
import { useState, useEffect, useCallback } from 'react';
import { GameStates } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';
import ScreenCrack from './effects/ScreenCrack';
import GlitchDistortion from './effects/GlitchDistortion';
import DamageVignette from './effects/DamageVignette';
import LifeLostBanner from './effects/LifeLostBanner';

export default function ScreamerOverlay() {
  const setGameState = useGameStore((s) => s.setGameState);
  const lives = useGameStore((s) => s.lives);
  const screamerColor = useGameStore((s) => s.screamerColor) || 'red';

  const [phase, setPhase] = useState('crack');
  // crack → glitch → virus → lifeLost → fadeout
  const [shakeStyle, setShakeStyle] = useState({});

  // MEGA SHAKE on mount
  useEffect(() => {
    if (navigator.vibrate) {
      navigator.vibrate([100, 30, 100, 30, 200, 50, 300, 50, 500]);
    }
    // Shake the entire viewport
    let frame = 0;
    const maxFrames = 180;
    const doShake = () => {
      frame++;
      if (frame > maxFrames) {
        setShakeStyle({});
        return;
      }
      const decay = 1 - frame / maxFrames;
      const intensity = 25 * decay;
      setShakeStyle({
        transform: `translate(${(Math.random()-0.5)*intensity}px, ${(Math.random()-0.5)*intensity}px) rotate(${(Math.random()-0.5)*intensity*0.2}deg)`,
      });
      requestAnimationFrame(doShake);
    };
    requestAnimationFrame(doShake);

    // Phase timing
    const t1 = setTimeout(() => setPhase('glitch'), 500);
    const t2 = setTimeout(() => setPhase('virus'), 1500);
    const t3 = setTimeout(() => setPhase('lifeLost'), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const onLifeLostComplete = useCallback(() => {
    setPhase('fadeout');
    setTimeout(() => {
      if (lives <= 0) {
        setGameState(GameStates.GAME_OVER);
      } else {
        setGameState(GameStates.PLAYING);
      }
    }, 600);
  }, [lives, setGameState]);

  const color = screamerColor === 'green' ? '#00ff44' : '#ff0044';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9500,
      ...shakeStyle,
    }}>
      {/* Screen crack effect */}
      <ScreenCrack
        active={phase === 'crack' || phase === 'glitch'}
        color={color}
      />

      {/* Heavy glitch distortion */}
      <GlitchDistortion
        active={phase !== 'fadeout'}
        intensity={phase === 'glitch' || phase === 'virus' ? 1.5 : 0.5}
        color={color}
      />

      {/* Damage red vignette */}
      <DamageVignette
        active={phase !== 'fadeout'}
        color={screamerColor}
      />

      {/* VIRUS WARNING — fills screen */}
      {(phase === 'virus' || phase === 'glitch') && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9600,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: `rgba(0,0,0,${phase === 'virus' ? 0.7 : 0.4})`,
          pointerEvents: 'none',
        }}>
          {/* Skull / virus icon */}
          <div style={{
            fontSize: 'clamp(5rem, 20vw, 15rem)',
            animation: 'virusShake 0.08s infinite',
            filter: `drop-shadow(0 0 30px ${color})`,
          }}>
            {screamerColor === 'green' ? '🦠' : '💀'}
          </div>

          {/* Warning text */}
          <div style={{
            fontFamily: 'monospace', fontWeight: 900,
            fontSize: 'clamp(1.5rem, 6vw, 4rem)',
            color: color, letterSpacing: '0.1em',
            textShadow: `0 0 20px ${color}, 0 0 40px ${color}`,
            animation: 'textGlitch2 0.1s infinite',
            marginTop: '1rem',
          }}>
            {screamerColor === 'green' ? '⚠ MALWARE DETECTADO ⚠' : '☠ VIRUS INFILTRADO ☠'}
          </div>

          {/* Suffering indicator */}
          <div style={{
            fontFamily: 'monospace', fontSize: '1rem',
            color: '#ff6666', marginTop: '1.5rem',
            animation: 'painPulse 0.3s infinite alternate',
            letterSpacing: '0.2em',
          }}>
            {'▓'.repeat(20)} DAÑO AL SISTEMA {'▓'.repeat(20)}
          </div>

          {/* Character suffering lines */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: `${15 + i * 14}%`,
              left: `${Math.random() * 60}%`,
              fontFamily: 'monospace',
              fontSize: `${0.6 + Math.random() * 0.5}rem`,
              color: color,
              opacity: 0.3 + Math.random() * 0.4,
              animation: `slideGlitch ${0.2+Math.random()*0.3}s infinite alternate`,
              whiteSpace: 'nowrap',
            }}>
              {['EVA.pain++', 'NEURAL_DAMAGE', 'SYSTEM_CORRUPT',
                'HELP.exe FAILED', 'MEMORY_LEAK', '0xDEAD'][i]}
            </div>
          ))}
        </div>
      )}

      {/* Life Lost Banner */}
      <LifeLostBanner
        active={phase === 'lifeLost'}
        livesLeft={lives}
        onComplete={onLifeLostComplete}
      />

      {/* Fade out overlay */}
      {phase === 'fadeout' && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9700,
          background: 'rgba(0,0,0,0.5)',
          animation: 'fadeOutOverlay 0.6s ease-out forwards',
          pointerEvents: 'none',
        }} />
      )}

      <style jsx>{`
        @keyframes virusShake {
          0% { transform: translate(0,0) rotate(0deg); }
          25% { transform: translate(-5px,3px) rotate(-3deg); }
          50% { transform: translate(5px,-2px) rotate(2deg); }
          75% { transform: translate(-3px,-3px) rotate(-1deg); }
          100% { transform: translate(3px,2px) rotate(1deg); }
        }
        @keyframes textGlitch2 {
          0% { transform: skewX(0deg) translate(0,0); }
          20% { transform: skewX(-5deg) translate(-3px,1px); }
          40% { transform: skewX(3deg) translate(2px,-1px); }
          60% { transform: skewX(-2deg) translate(-1px,2px); }
          80% { transform: skewX(4deg) translate(3px,-2px); }
          100% { transform: skewX(0deg) translate(0,0); }
        }
        @keyframes painPulse {
          from { opacity: 0.5; color: #ff4444; }
          to { opacity: 1; color: #ff0000; }
        }
        @keyframes slideGlitch {
          from { transform: translateX(-10px); opacity: 0.2; }
          to { transform: translateX(10px); opacity: 0.6; }
        }
        @keyframes fadeOutOverlay {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
