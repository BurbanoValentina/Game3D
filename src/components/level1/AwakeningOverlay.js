// ══════════════════════════════════════════════════════
//  AWAKENING OVERLAY — Roblox-style cinematic sequence
//  1. Eyes slowly open (blinking/blurry)
//  2. Head raises, sees the city
//  3. Rocket launches across the sky
//  4. Impact → eyes close from shock (screen goes black)
//  5. Eyes reopen → fully awake → PLAYING
// ══════════════════════════════════════════════════════

'use client';
import { useState, useEffect, useCallback } from 'react';
import { GameStates } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';
import EyeOpening from './effects/EyeOpening';
import HeadRaiseOverlay from './effects/HeadRaiseOverlay';
import RocketAnimation from './effects/RocketAnimation';

// ─── Blackout sub-component ───
function BlackoutOverlay({ active, onComplete }) {
  const [opacity, setOpacity] = useState(0);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!active) return;
    let frame = 0;

    const animate = () => {
      frame++;
      // Quick fade to black (eyes close) 0-40
      if (frame <= 40) {
        setOpacity((frame / 40) * (frame / 40));
      }
      // Hold black + text 40-120
      else if (frame <= 120) {
        setOpacity(1);
        if (frame === 60) setText('...');
        if (frame === 80) setText('RECALIBRANDO VISIÓN...');
        if (frame === 110) setText('');
      }
      // Fade from black 120-160
      else if (frame <= 160) {
        setOpacity(1 - (frame - 120) / 40);
      }
      // Done
      else {
        setOpacity(0);
        onComplete?.();
        return;
      }
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [active, onComplete]);

  if (!active && opacity <= 0) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10003,
      background: `rgba(0,0,0,${opacity})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: opacity > 0.5 ? 'auto' : 'none',
    }}>
      {text && (
        <div style={{
          fontFamily: 'monospace',
          fontSize: 'clamp(0.8rem, 2vw, 1.1rem)',
          color: 'rgba(0,240,255,0.6)',
          letterSpacing: '0.3em',
          textShadow: '0 0 12px rgba(0,240,255,0.4)',
          animation: 'subtlePulse 1.5s ease-in-out infinite',
        }}>
          {text}
        </div>
      )}
      <style jsx>{`
        @keyframes subtlePulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Main Overlay ───
export default function AwakeningOverlay() {
  const gameState = useGameStore((s) => s.gameState);
  const setGameState = useGameStore((s) => s.setGameState);

  // Phases: eyes → head → look → rocket → blackout → reopen → done
  const [phase, setPhase] = useState('eyes');
  const [showHud, setShowHud] = useState(false);

  const isActive = gameState === GameStates.AWAKENING;

  const onEyesComplete = useCallback(() => {
    setPhase('head');
  }, []);

  const onHeadComplete = useCallback(() => {
    setPhase('look');
    setTimeout(() => setPhase('rocket'), 2200);
  }, []);

  const onRocketImpact = useCallback(() => {
    if (navigator.vibrate) navigator.vibrate([300, 100, 500]);
  }, []);

  const onRocketComplete = useCallback(() => {
    // After rocket → blackout (eyes close from shock)
    setPhase('blackout');
  }, []);

  const onBlackoutComplete = useCallback(() => {
    // Eyes reopen for the second time (fully awake now)
    setPhase('reopen');
  }, []);

  const onReopenComplete = useCallback(() => {
    setPhase('done');
    setShowHud(true);
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
      {/* Phase 1: First eye opening — groggy, blinking */}
      {phase === 'eyes' && (
        <EyeOpening active={true} onComplete={onEyesComplete} />
      )}

      {/* Phase 2: Head raising */}
      {phase === 'head' && (
        <HeadRaiseOverlay active={true} onComplete={onHeadComplete} />
      )}

      {/* Phase 3: Looking around — brief moment of calm */}
      {phase === 'look' && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', inset: 0,
            boxShadow: 'inset 0 0 80px rgba(0,0,0,0.3)',
          }} />
          <div style={{
            position: 'absolute', bottom: '8%', left: '50%',
            transform: 'translateX(-50%)', textAlign: 'center',
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

      {/* Phase 4: Rocket flies and impacts */}
      {phase === 'rocket' && (
        <RocketAnimation
          active={true}
          onImpact={onRocketImpact}
          onComplete={onRocketComplete}
        />
      )}

      {/* Phase 5: Blackout — eyes close from rocket shock */}
      {phase === 'blackout' && (
        <BlackoutOverlay active={true} onComplete={onBlackoutComplete} />
      )}

      {/* Phase 6: Eyes reopen — fully awake this time (fast opening) */}
      {phase === 'reopen' && (
        <EyeOpening active={true} onComplete={onReopenComplete} fast={true} />
      )}

      {/* HUD hint */}
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
