// ══════════════════════════════════════════════════════
//  AWAKENING OVERLAY — Full cinematic sequence
//  1. Eyes open (blinking) 2. Head raises
//  3. See the world 4. Rocket destroys sky
//  5. Galaxy revealed 6. Sky falls → PLAYING
// ══════════════════════════════════════════════════════

'use client';
import { useState, useCallback } from 'react';
import { GameStates } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';
import EyeOpening from './effects/EyeOpening';
import HeadRaiseOverlay from './effects/HeadRaiseOverlay';
import RocketAnimation from './effects/RocketAnimation';

export default function AwakeningOverlay() {
  const gameState = useGameStore((s) => s.gameState);
  const setGameState = useGameStore((s) => s.setGameState);

  const [phase, setPhase] = useState('eyes'); // eyes → head → look → rocket → done
  const [showHud, setShowHud] = useState(false);

  const isActive = gameState === GameStates.AWAKENING;

  const onEyesComplete = useCallback(() => {
    setPhase('head');
  }, []);

  const onHeadComplete = useCallback(() => {
    setPhase('look');
    // Brief pause to see the world, then rocket
    setTimeout(() => setPhase('rocket'), 2500);
  }, []);

  const onRocketImpact = useCallback(() => {
    // Screen shakes handled inside RocketAnimation
    if (navigator.vibrate) navigator.vibrate([300, 100, 500]);
  }, []);

  const onRocketComplete = useCallback(() => {
    setPhase('done');
    setShowHud(true);
    // Transition to playing
    setTimeout(() => {
      setGameState(GameStates.PLAYING);
    }, 500);
  }, [setGameState]);

  if (!isActive && phase === 'done') return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      pointerEvents: phase === 'done' ? 'none' : 'auto',
    }}>
      {/* Phase 1: Eyes opening */}
      {phase === 'eyes' && (
        <EyeOpening active={true} onComplete={onEyesComplete} />
      )}

      {/* Phase 2: Head raising */}
      {phase === 'head' && (
        <HeadRaiseOverlay active={true} onComplete={onHeadComplete} />
      )}

      {/* Phase 3: Looking around - subtle overlay */}
      {phase === 'look' && (
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none',
        }}>
          {/* Subtle vignette */}
          <div style={{
            position: 'absolute', inset: 0,
            boxShadow: 'inset 0 0 80px rgba(0,0,0,0.3)',
          }} />
          {/* System text */}
          <div style={{
            position: 'absolute', bottom: '8%', left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'monospace', fontSize: 'clamp(0.8rem, 2vw, 1.2rem)',
              color: '#00f0ff', letterSpacing: '0.2em',
              textShadow: '0 0 10px #00f0ff',
              animation: 'systemPulse 1s ease-in-out infinite',
            }}>
              SISTEMA NEURAL CONECTADO
            </div>
            <div style={{
              fontFamily: 'monospace', fontSize: '0.7rem',
              color: 'rgba(255,187,51,0.6)', marginTop: '0.5rem',
              letterSpacing: '0.3em',
            }}>
              UBICACIÓN: CIUDAD NEÓN — SECTOR 0
            </div>
          </div>
        </div>
      )}

      {/* Phase 4: Rocket destroys sky */}
      {phase === 'rocket' && (
        <RocketAnimation
          active={true}
          onImpact={onRocketImpact}
          onComplete={onRocketComplete}
        />
      )}

      {/* HUD fade-in hint */}
      {showHud && (
        <div style={{
          position: 'fixed', bottom: '5%', left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'monospace', fontSize: '0.9rem',
          color: '#00f0ff', letterSpacing: '0.15em',
          textShadow: '0 0 8px #00f0ff',
          animation: 'fadeInUp 1s ease-out forwards',
          pointerEvents: 'none',
        }}>
          HAZ CLIC PARA COMENZAR — USA WASD PARA MOVERTE
        </div>
      )}

      <style jsx>{`
        @keyframes systemPulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
