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

              {/* Memory SVG Illustrations */}
              {tokenData?.image === 'girls_together' ? (
                <svg width="200" height="200" viewBox="0 0 200 200" style={{ filter: 'drop-shadow(0 0 15px rgba(0,240,255,0.3))' }}>
                  {/* Three friends together */}
                  <circle cx="70" cy="60" r="18" fill="none" stroke="#00f0ff" strokeWidth="1.5" opacity="0.7"/>
                  <circle cx="100" cy="55" r="18" fill="none" stroke="#FF61D8" strokeWidth="1.5" opacity="0.7"/>
                  <circle cx="130" cy="60" r="18" fill="none" stroke="#61FFD8" strokeWidth="1.5" opacity="0.7"/>
                  <line x1="70" y1="78" x2="70" y2="130" stroke="#00f0ff" strokeWidth="1.5" opacity="0.6"/>
                  <line x1="100" y1="73" x2="100" y2="130" stroke="#FF61D8" strokeWidth="1.5" opacity="0.6"/>
                  <line x1="130" y1="78" x2="130" y2="130" stroke="#61FFD8" strokeWidth="1.5" opacity="0.6"/>
                  {/* Arms linked */}
                  <path d="M70,100 Q85,95 100,100" fill="none" stroke="#D861FF" strokeWidth="1" opacity="0.5"/>
                  <path d="M100,100 Q115,95 130,100" fill="none" stroke="#D861FF" strokeWidth="1" opacity="0.5"/>
                  {/* Heart above */}
                  <path d="M100,30 C95,22 82,22 82,32 C82,42 100,50 100,50 C100,50 118,42 118,32 C118,22 105,22 100,30" fill="none" stroke="#FF61D8" strokeWidth="1.5" opacity="0.6">
                    <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite"/>
                  </path>
                  {/* Stars */}
                  <circle cx="40" cy="40" r="2" fill="#FFBB33" opacity="0.5"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.5s" repeatCount="indefinite"/></circle>
                  <circle cx="160" cy="35" r="2" fill="#FFBB33" opacity="0.5"><animate attributeName="opacity" values="0.5;0.9;0.5" dur="2s" repeatCount="indefinite"/></circle>
                  <text x="100" y="170" textAnchor="middle" fill="#00f0ff" fontSize="10" fontFamily="monospace" opacity="0.5">JUNTAS.mem</text>
                </svg>
              ) : tokenData?.image === 'girls_fighting' ? (
                <svg width="200" height="200" viewBox="0 0 200 200" style={{ filter: 'drop-shadow(0 0 15px rgba(255,0,102,0.3))' }}>
                  {/* Two figures apart, broken connection */}
                  <circle cx="60" cy="60" r="18" fill="none" stroke="#FF0066" strokeWidth="1.5" opacity="0.7"/>
                  <circle cx="140" cy="60" r="18" fill="none" stroke="#FF0066" strokeWidth="1.5" opacity="0.7"/>
                  <line x1="60" y1="78" x2="60" y2="130" stroke="#FF0066" strokeWidth="1.5" opacity="0.6"/>
                  <line x1="140" y1="78" x2="140" y2="130" stroke="#FF0066" strokeWidth="1.5" opacity="0.6"/>
                  {/* Lightning bolt between them */}
                  <polyline points="88,70 95,85 90,88 100,110" fill="none" stroke="#FFBB33" strokeWidth="2" opacity="0.7">
                    <animate attributeName="opacity" values="0.3;0.9;0.3" dur="0.5s" repeatCount="indefinite"/>
                  </polyline>
                  {/* Broken heart */}
                  <path d="M100,35 C95,27 82,27 82,37 C82,47 100,55 100,55" fill="none" stroke="#FF0066" strokeWidth="1.5" opacity="0.6"/>
                  <path d="M100,35 C105,27 118,27 118,37 C118,47 100,55 100,55" fill="none" stroke="#FF0066" strokeWidth="1.5" opacity="0.6"/>
                  <line x1="96" y1="32" x2="104" y2="55" stroke="#FF4466" strokeWidth="2" opacity="0.8"/>
                  {/* Glitch fragments */}
                  <rect x="70" y="140" width="60" height="3" fill="#FF0066" opacity="0.3"><animate attributeName="width" values="60;30;60" dur="0.3s" repeatCount="indefinite"/></rect>
                  <text x="100" y="170" textAnchor="middle" fill="#FF0066" fontSize="10" fontFamily="monospace" opacity="0.5">PELEA.mem</text>
                </svg>
              ) : (
                <svg width="200" height="200" viewBox="0 0 200 200" style={{ filter: 'drop-shadow(0 0 15px rgba(97,255,216,0.3))' }}>
                  {/* Grandpa and young Eva at computer */}
                  <circle cx="70" cy="55" r="20" fill="none" stroke="#61FFD8" strokeWidth="1.5" opacity="0.7"/>
                  <circle cx="130" cy="60" r="15" fill="none" stroke="#00f0ff" strokeWidth="1.5" opacity="0.7"/>
                  <line x1="70" y1="75" x2="70" y2="130" stroke="#61FFD8" strokeWidth="1.5" opacity="0.6"/>
                  <line x1="130" y1="75" x2="130" y2="120" stroke="#00f0ff" strokeWidth="1.5" opacity="0.6"/>
                  {/* Computer screen */}
                  <rect x="85" y="90" width="30" height="22" rx="2" fill="none" stroke="#FFBB33" strokeWidth="1.5" opacity="0.6"/>
                  <rect x="95" y="112" width="10" height="8" fill="none" stroke="#FFBB33" strokeWidth="1" opacity="0.4"/>
                  {/* Code on screen */}
                  <line x1="89" y1="96" x2="108" y2="96" stroke="#00FF88" strokeWidth="1" opacity="0.5"/>
                  <line x1="89" y1="100" x2="103" y2="100" stroke="#00f0ff" strokeWidth="1" opacity="0.4"/>
                  <line x1="89" y1="104" x2="111" y2="104" stroke="#FF61D8" strokeWidth="1" opacity="0.3"/>
                  {/* Warmth glow */}
                  <circle cx="100" cy="100" r="50" fill="none" stroke="#61FFD8" strokeWidth="0.5" opacity="0.2">
                    <animate attributeName="r" values="45;55;45" dur="3s" repeatCount="indefinite"/>
                  </circle>
                  <text x="100" y="170" textAnchor="middle" fill="#61FFD8" fontSize="10" fontFamily="monospace" opacity="0.5">ABUELO.mem</text>
                </svg>
              )}
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
