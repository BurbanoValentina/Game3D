// ══════════════════════════════════════════════════════
//  WRONG ANSWER OVERLAY — MAXIMUM INTENSITY
//  Character suffers, screen distorts, giant PERDISTE UNA VIDA
//  Player FEELS the consequence of a wrong answer
// ══════════════════════════════════════════════════════

'use client';
import { useState, useEffect, useCallback } from 'react';
import { GameStates } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';
import GlitchDistortion from './effects/GlitchDistortion';
import DamageVignette from './effects/DamageVignette';
import LifeLostBanner from './effects/LifeLostBanner';

export default function WrongAnswerOverlay() {
  const setGameState = useGameStore((s) => s.setGameState);
  const lives = useGameStore((s) => s.lives);
  const [phase, setPhase] = useState('impact');
  // impact → suffering → lifeLost → recover
  const [shakeStyle, setShakeStyle] = useState({});

  useEffect(() => {
    // Vibrate device
    if (navigator.vibrate) {
      navigator.vibrate([150, 50, 150, 50, 300, 100, 200]);
    }

    // Screen shake
    let frame = 0;
    const doShake = () => {
      frame++;
      if (frame > 120) { setShakeStyle({}); return; }
      const decay = 1 - frame / 120;
      const i = 20 * decay;
      setShakeStyle({
        transform: `translate(${(Math.random()-0.5)*i}px, ${(Math.random()-0.5)*i}px) rotate(${(Math.random()-0.5)*i*0.15}deg)`,
      });
      requestAnimationFrame(doShake);
    };
    requestAnimationFrame(doShake);

    // Phase sequence
    const t1 = setTimeout(() => setPhase('suffering'), 800);
    const t2 = setTimeout(() => setPhase('lifeLost'), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const onBannerComplete = useCallback(() => {
    setPhase('recover');
    setTimeout(() => {
      if (lives <= 0) {
        setGameState(GameStates.GAME_OVER);
      } else {
        setGameState(GameStates.PLAYING);
      }
    }, 500);
  }, [lives, setGameState]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9500,
      ...shakeStyle,
    }}>
      {/* Glitch distortion */}
      <GlitchDistortion
        active={phase !== 'recover'}
        intensity={phase === 'impact' ? 1.2 : phase === 'suffering' ? 0.8 : 0.3}
        color="#ff0044"
      />

      {/* Damage vignette */}
      <DamageVignette active={phase !== 'recover'} color="red" />

      {/* Impact phase — wrong answer slam */}
      {phase === 'impact' && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9600,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.6)',
          pointerEvents: 'none',
        }}>
          <div style={{
            fontSize: 'clamp(4rem, 15vw, 12rem)',
            fontFamily: 'monospace', fontWeight: 900,
            color: '#FF0044',
            textShadow: '0 0 40px #ff0044, 0 0 80px #ff0044',
            animation: 'wrongSlam 0.3s ease-out',
          }}>
            ✖
          </div>
        </div>
      )}

      {/* Suffering phase — character pain visualization */}
      {phase === 'suffering' && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9600,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.75)',
          pointerEvents: 'none',
        }}>
          {/* Pain waves radiating from center */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: `${30 + i * 20}vmin`,
              height: `${30 + i * 20}vmin`,
              border: '2px solid rgba(255,0,68,0.3)',
              borderRadius: '50%',
              animation: `painWave 1s ease-out ${i * 0.15}s infinite`,
            }} />
          ))}

          {/* Error messages */}
          <div style={{
            fontFamily: 'monospace', fontWeight: 900,
            fontSize: 'clamp(1.5rem, 5vw, 3.5rem)',
            color: '#FF0044',
            textShadow: '0 0 20px #ff0044',
            animation: 'sufferGlitch 0.1s infinite',
            textAlign: 'center',
          }}>
            RESPUESTA INCORRECTA
          </div>

          <div style={{
            fontFamily: 'monospace',
            fontSize: 'clamp(0.8rem, 2.5vw, 1.5rem)',
            color: '#FF6666', marginTop: '1rem',
            animation: 'flickerText 0.15s infinite alternate',
            textAlign: 'center',
          }}>
            ⚡ DESCARGA NEURAL DETECTADA ⚡
          </div>

          {/* Heartbeat line */}
          <svg width="300" height="60" style={{
            marginTop: '1.5rem',
            filter: 'drop-shadow(0 0 10px #ff0044)',
          }}>
            <polyline
              fill="none" stroke="#FF0044" strokeWidth="2"
              points="0,30 40,30 50,10 60,50 70,20 80,40 90,30 120,30 140,5 150,55 160,15 170,45 180,30 300,30"
              style={{ animation: 'heartbeat 0.8s infinite' }}
            />
          </svg>

          {/* Suffering glitch text fragments */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: `${10 + Math.random() * 80}%`,
              left: `${Math.random() * 80}%`,
              fontFamily: 'monospace',
              fontSize: `${0.5 + Math.random() * 0.6}rem`,
              color: '#ff4466',
              opacity: 0.2 + Math.random() * 0.3,
              animation: `driftText ${1+Math.random()}s infinite alternate`,
            }}>
              {['ERROR', 'PAIN++', 'WRONG', 'FAIL', 'DAMAGE',
                'CORRUPT', 'INVALID', 'DENIED'][i]}
            </div>
          ))}
        </div>
      )}

      {/* Life Lost Banner */}
      <LifeLostBanner
        active={phase === 'lifeLost'}
        livesLeft={lives}
        onComplete={onBannerComplete}
      />

      {/* Recovery fade */}
      {phase === 'recover' && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9700,
          background: 'rgba(0,0,0,0.4)',
          animation: 'fadeOutOverlay 0.5s ease-out forwards',
          pointerEvents: 'none',
        }} />
      )}

      <style jsx>{`
        @keyframes wrongSlam {
          0% { transform: scale(3); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes painWave {
          0% { transform: scale(0.5); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes sufferGlitch {
          0% { transform: translate(0,0) skewX(0); }
          25% { transform: translate(-3px,2px) skewX(-3deg); }
          50% { transform: translate(4px,-1px) skewX(2deg); }
          75% { transform: translate(-2px,-2px) skewX(-1deg); }
          100% { transform: translate(0,0) skewX(0); }
        }
        @keyframes flickerText {
          from { opacity: 0.6; }
          to { opacity: 1; }
        }
        @keyframes heartbeat {
          0%,100% { opacity: 0.8; }
          50% { opacity: 1; stroke-width: 3; }
        }
        @keyframes driftText {
          from { transform: translateX(-5px); }
          to { transform: translateX(5px); }
        }
        @keyframes fadeOutOverlay {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
