// ══════════════════════════════════════════════════════
//  TOKEN MEMORY OVERLAY — Memory recall with suffering
//  Screen glitches like VHS, character suffers the pain
//  of remembering — then sees the memory image
// ══════════════════════════════════════════════════════

'use client';
import { useState, useEffect, useCallback } from 'react';
import { GameStates } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';
import MemoryGlitchEffect from './effects/MemoryGlitchEffect';

export default function TokenMemoryOverlay() {
  const setGameState = useGameStore((s) => s.setGameState);
  const tokenData = useGameStore((s) => s.currentTokenData);
  const [phase, setPhase] = useState('glitch');
  // glitch → reveal → reading → fadeout
  const [shakeStyle, setShakeStyle] = useState({});

  useEffect(() => {
    if (navigator.vibrate) navigator.vibrate([50, 30, 50, 30, 100, 50, 150]);

    // Shake during glitch phase
    let frame = 0;
    const doShake = () => {
      frame++;
      if (frame > 90) { setShakeStyle({}); return; }
      const decay = 1 - frame / 90;
      const i = 12 * decay;
      setShakeStyle({
        transform: `translate(${(Math.random()-0.5)*i}px, ${(Math.random()-0.5)*i}px)`,
      });
      requestAnimationFrame(doShake);
    };
    requestAnimationFrame(doShake);

    const t1 = setTimeout(() => setPhase('reveal'), 2000);
    return () => clearTimeout(t1);
  }, []);

  const handleContinue = useCallback(() => {
    setPhase('fadeout');
    setTimeout(() => setGameState(GameStates.PLAYING), 600);
  }, [setGameState]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9500,
      ...shakeStyle,
    }}>
      {/* Memory glitch VHS effect */}
      <MemoryGlitchEffect
        active={phase === 'glitch'}
        onComplete={() => {}}
      />

      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: phase === 'glitch'
          ? 'rgba(0,0,0,0.85)'
          : 'rgba(0,0,0,0.92)',
        transition: 'background 0.5s',
      }} />

      {/* Glitch phase — suffering */}
      {phase === 'glitch' && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          {/* Brain pain icon */}
          <div style={{
            fontSize: 'clamp(4rem, 12vw, 8rem)',
            animation: 'memoryShake 0.1s infinite',
            filter: 'drop-shadow(0 0 20px #00f0ff)',
          }}>
            🧠
          </div>

          <div style={{
            fontFamily: 'monospace', fontWeight: 900,
            fontSize: 'clamp(1.2rem, 4vw, 2.5rem)',
            color: '#00f0ff',
            textShadow: '0 0 15px #00f0ff, 0 0 30px #00f0ff',
            animation: 'memGlitchText 0.12s infinite',
            marginTop: '1rem', textAlign: 'center',
          }}>
            RECUERDO DETECTADO
          </div>

          <div style={{
            fontFamily: 'monospace', fontSize: '0.8rem',
            color: '#ff6688', marginTop: '0.8rem',
            animation: 'painFlicker 0.2s infinite alternate',
          }}>
            ⚡ DOLOR NEURAL — PROCESANDO MEMORIA ⚡
          </div>

          {/* Static bars */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: `${Math.random() * 100}%`,
              left: 0, right: 0,
              height: `${2 + Math.random() * 6}px`,
              background: `rgba(0,240,255,${0.05 + Math.random() * 0.1})`,
              animation: `staticBar ${0.1+Math.random()*0.2}s infinite alternate`,
            }} />
          ))}
        </div>
      )}

      {/* Reveal phase — memory image appears */}
      {(phase === 'reveal' || phase === 'reading' || phase === 'fadeout') && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          animation: 'memoryFadeIn 1s ease-out',
          padding: '2rem',
        }}>
          {/* Holographic frame */}
          <div style={{
            position: 'relative', maxWidth: '500px', width: '90%',
            background: 'rgba(10,15,25,0.9)',
            border: '2px solid rgba(0,240,255,0.4)',
            borderRadius: '12px', padding: '1.5rem',
            boxShadow: '0 0 30px rgba(0,240,255,0.2), inset 0 0 30px rgba(0,240,255,0.05)',
          }}>
            {/* Header */}
            <div style={{
              fontFamily: 'monospace', fontSize: '0.7rem',
              color: 'rgba(0,240,255,0.5)', letterSpacing: '0.2em',
              marginBottom: '0.5rem',
            }}>
              // FRAGMENTO DE MEMORIA RECUPERADO
            </div>

            {/* Title */}
            <div style={{
              fontFamily: 'monospace', fontWeight: 900,
              fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
              color: '#00f0ff',
              textShadow: '0 0 10px rgba(0,240,255,0.5)',
              marginBottom: '1rem',
            }}>
              {tokenData?.title || 'RECUERDO'}
            </div>

            {/* Memory image placeholder */}
            <div style={{
              width: '100%', aspectRatio: '1',
              background: 'rgba(0,240,255,0.05)',
              border: '1px solid rgba(0,240,255,0.2)',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Scan line effect on image */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
                pointerEvents: 'none', zIndex: 1,
              }} />
              <div style={{
                fontSize: '4rem',
                filter: 'drop-shadow(0 0 15px rgba(0,240,255,0.3))',
              }}>
                {tokenData?.image === 'girls_together' ? '👩‍👩‍👧' :
                 tokenData?.image === 'girls_fighting' ? '💔' : '👴💻'}
              </div>
            </div>

            {/* Memory text */}
            <div style={{
              fontFamily: 'monospace', fontSize: 'clamp(0.8rem, 2vw, 1rem)',
              color: 'rgba(200,220,240,0.8)',
              marginTop: '1rem', lineHeight: '1.6',
              fontStyle: 'italic',
            }}>
              "{tokenData?.text || '...'}"
            </div>

            {/* Coins earned */}
            <div style={{
              fontFamily: 'monospace', fontSize: '0.8rem',
              color: '#ffbb33', marginTop: '1rem',
              textShadow: '0 0 8px rgba(255,187,51,0.5)',
            }}>
              +150 MONEDAS
            </div>

            {/* Continue button */}
            <button
              onClick={handleContinue}
              style={{
                marginTop: '1.5rem', width: '100%',
                padding: '0.8rem', fontFamily: 'monospace',
                fontSize: '1rem', fontWeight: 700,
                color: '#00f0ff', background: 'rgba(0,240,255,0.08)',
                border: '1px solid rgba(0,240,255,0.4)',
                borderRadius: '6px', cursor: 'pointer',
                letterSpacing: '0.15em',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(0,240,255,0.2)';
                e.target.style.boxShadow = '0 0 20px rgba(0,240,255,0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(0,240,255,0.08)';
                e.target.style.boxShadow = 'none';
              }}
            >
              CONTINUAR ▶
            </button>

            {/* Corner decorations */}
            {['top-left','top-right','bottom-left','bottom-right'].map(pos => (
              <div key={pos} style={{
                position: 'absolute',
                [pos.includes('top') ? 'top' : 'bottom']: '-1px',
                [pos.includes('left') ? 'left' : 'right']: '-1px',
                width: '12px', height: '12px',
                borderTop: pos.includes('top') ? '2px solid #00f0ff' : 'none',
                borderBottom: pos.includes('bottom') ? '2px solid #00f0ff' : 'none',
                borderLeft: pos.includes('left') ? '2px solid #00f0ff' : 'none',
                borderRight: pos.includes('right') ? '2px solid #00f0ff' : 'none',
              }} />
            ))}
          </div>
        </div>
      )}

      {/* Fadeout */}
      {phase === 'fadeout' && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9700,
          background: 'rgba(0,0,0,0.5)',
          animation: 'fadeOut 0.6s ease-out forwards',
          pointerEvents: 'none',
        }} />
      )}

      <style jsx>{`
        @keyframes memoryShake {
          0% { transform: translate(0,0) rotate(0); }
          25% { transform: translate(-4px,2px) rotate(-2deg); }
          75% { transform: translate(3px,-2px) rotate(2deg); }
        }
        @keyframes memGlitchText {
          0%,100% { transform: skewX(0); }
          30% { transform: skewX(-3deg) translate(-2px,0); }
          70% { transform: skewX(2deg) translate(2px,0); }
        }
        @keyframes painFlicker { from { opacity:0.5; } to { opacity:1; } }
        @keyframes staticBar { from { transform:translateX(-5px); } to { transform:translateX(5px); } }
        @keyframes memoryFadeIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
        @keyframes fadeOut { from { opacity:1; } to { opacity:0; } }
      `}</style>
    </div>
  );
}
