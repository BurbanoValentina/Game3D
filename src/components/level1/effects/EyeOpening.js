// ══════════════════════════════════════════════════════
//  EYE OPENING — Eyelids open revealing the world
//  Player "wakes up" — like opening your eyes
//  Supports fast=true for the second awakening (post-shock)
// ══════════════════════════════════════════════════════

'use client';
import { useState, useEffect } from 'react';

export default function EyeOpening({ active, onComplete, fast = false }) {
  const [openAmount, setOpenAmount] = useState(0);
  const [blurAmount, setBlurAmount] = useState(fast ? 10 : 20);
  const [blinkCount, setBlinks] = useState(0);

  useEffect(() => {
    if (!active) return;
    let frame = 0;

    // Fast mode: shorter, no blinks — just a smooth quick open
    const totalFrames = fast ? 80 : 180;

    const animate = () => {
      frame++;
      const progress = frame / totalFrames;

      if (fast) {
        // ── FAST MODE: Quick smooth open (post-shock reopen) ──
        if (frame < 15) {
          // Slight flutter
          setOpenAmount(Math.sin((frame / 15) * Math.PI) * 0.1);
          setBlinks(1);
        } else {
          // Smooth open
          const openProg = (frame - 15) / (totalFrames - 15);
          const eased = 1 - Math.pow(1 - openProg, 2);
          setOpenAmount(eased);
          setBlurAmount(10 * (1 - eased));
          if (frame === 20) setBlinks(3);
        }
      } else {
        // ── NORMAL MODE: Slow blinking pattern ──
        if (frame < 30) {
          // First blink
          const blinkProg = frame / 30;
          setOpenAmount(Math.sin(blinkProg * Math.PI) * 0.15);
          if (frame === 15) setBlinks(1);
        } else if (frame < 50) {
          // Close again
          setOpenAmount(0.02);
        } else if (frame < 80) {
          // Second blink - slightly more open
          const blinkProg = (frame - 50) / 30;
          setOpenAmount(Math.sin(blinkProg * Math.PI) * 0.3);
          if (frame === 65) setBlinks(2);
        } else if (frame < 95) {
          // Close briefly
          setOpenAmount(0.05);
        } else {
          // Final slow open
          const openProg = (frame - 95) / (totalFrames - 95);
          const eased = 1 - Math.pow(1 - openProg, 3);
          setOpenAmount(eased);
          setBlurAmount(20 * (1 - eased));
          if (frame === 100) setBlinks(3);
        }
      }

      if (frame >= totalFrames) {
        setOpenAmount(1);
        setBlurAmount(0);
        setTimeout(() => onComplete?.(), 200);
        return;
      }
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [active, onComplete, fast]);

  if (!active && openAmount >= 1) return null;

  const gapHeight = openAmount * 100;
  const topLid = 50 - gapHeight / 2;
  const bottomLid = 50 + gapHeight / 2;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10001,
      pointerEvents: openAmount >= 1 ? 'none' : 'auto',
    }}>
      {/* Blur the world behind */}
      <div style={{
        position: 'absolute', inset: 0,
        backdropFilter: `blur(${blurAmount}px)`,
        WebkitBackdropFilter: `blur(${blurAmount}px)`,
        pointerEvents: 'none',
        opacity: blurAmount > 0 ? 1 : 0,
        transition: 'opacity 0.3s',
      }} />

      {/* Top eyelid */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: `${topLid}%`,
        background: 'linear-gradient(to bottom, #000000, #0a0505)',
        borderBottom: openAmount > 0.05 ? '3px solid rgba(80,40,30,0.6)' : 'none',
        transition: 'none',
      }}>
        {/* Eyelash details */}
        {openAmount > 0.1 && openAmount < 0.9 && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: '8px',
            background: 'linear-gradient(to bottom, transparent, rgba(40,20,15,0.8))',
          }}>
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} style={{
                position: 'absolute',
                bottom: '-6px',
                left: `${i * 3.3}%`,
                width: '2px',
                height: `${4 + Math.random() * 6}px`,
                background: 'rgba(30,15,10,0.7)',
                transform: `rotate(${(i - 15) * 1.5}deg)`,
                transformOrigin: 'top center',
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom eyelid */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: `${100 - bottomLid}%`,
        background: 'linear-gradient(to top, #000000, #0a0505)',
        borderTop: openAmount > 0.05 ? '2px solid rgba(80,40,30,0.4)' : 'none',
      }} />

      {/* Eye moisture/reflection when partially open */}
      {openAmount > 0.1 && openAmount < 0.8 && (
        <div style={{
          position: 'absolute',
          top: `${topLid}%`,
          left: '30%', right: '30%',
          height: `${gapHeight}%`,
          background: 'radial-gradient(ellipse, rgba(200,220,255,0.08), transparent)',
          pointerEvents: 'none',
        }} />
      )}

      {/* Text during blinks */}
      {blinkCount > 0 && blinkCount < 3 && openAmount < 0.2 && (
        <div style={{
          position: 'absolute',
          top: '48%', left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'rgba(0,240,255,0.4)',
          fontFamily: 'monospace',
          fontSize: '0.8rem',
          letterSpacing: '0.3em',
          opacity: 0.6,
        }}>
          {fast
            ? (blinkCount === 1 ? '¿QUÉ FUE ESO...?' : 'REACTIVANDO...')
            : (blinkCount === 1 ? 'SISTEMA INICIANDO...' : 'CONECTANDO NEURAL...')
          }
        </div>
      )}
    </div>
  );
}
