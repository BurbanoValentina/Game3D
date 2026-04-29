// ══════════════════════════════════════════════════════
//  ROCKET ANIMATION — Rocket destroys sky, reveals galaxy
//  Cinematic sequence during awakening finale
// ══════════════════════════════════════════════════════

'use client';
import { useEffect, useRef, useState } from 'react';
import audioManager from '../../../lib/audioManager';

export default function RocketAnimation({ active, onImpact, onComplete }) {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState('idle'); // idle, launch, glitch, done

  useEffect(() => {
    if (!active) { setPhase('idle'); return; }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const W = canvas.width, H = canvas.height;

    let frame = 0;
    const rocketX = W * 0.5;
    let rocketY = H + 140;
    const targetY = H * 0.2; // sky area
    let impactDone = false;
    let launchSoundPlayed = false;

    setPhase('launch');

    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, W, H);

      // PHASE 1: Rocket ascending (frames 0-60)
      if (frame < 60) {
        // Play launch sound once
        if (!launchSoundPlayed) {
          launchSoundPlayed = true;
          audioManager.playRocketLaunch();
        }
        const progress = frame / 60;
        const eased = 1 - Math.pow(1 - progress, 3);
        rocketY = H + 100 - (H + 100 - targetY) * eased;

        // Rocket icon (large, ominous)
        drawRocketIcon(ctx, rocketX, rocketY, H, frame);

        // Screen rumble intensifies
        if (frame > 40) {
          const shake = (frame - 40) / 20 * 4;
          canvas.style.transform = `translate(${(Math.random()-0.5)*shake}px, ${(Math.random()-0.5)*shake}px)`;
        }
      }
      // PHASE 2: Glitch warning (frames 60-120)
      else if (frame < 120) {
        if (!impactDone) {
          impactDone = true;
          setPhase('glitch');
          onImpact?.();
          if (navigator.vibrate) navigator.vibrate([120, 80, 120]);
        }

        // Keep rocket visible with heavy jitter
        drawRocketIcon(ctx, rocketX, targetY, H, frame, true);

        // Glitch overlay + warning text
        drawGlitchOverlay(ctx, W, H, frame, true);

        const shake = 6 + Math.sin(frame * 0.8) * 3;
        canvas.style.transform = `translate(${(Math.random() - 0.5) * shake}px, ${(Math.random() - 0.5) * shake}px)`;
      }
      // PHASE 3: Fade out
      else {
        setPhase('done');
        canvas.style.transform = '';
        const fadeOut = Math.min(1, (frame - 120) / 20);
        ctx.globalAlpha = 1 - fadeOut;
        drawRocketIcon(ctx, rocketX, targetY, H, frame, true);
        drawGlitchOverlay(ctx, W, H, frame + 20, true);
        ctx.globalAlpha = 1;
        if (fadeOut >= 1) {
          onComplete?.();
          return;
        }
      }

      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [active, onImpact, onComplete]);

  if (!active && phase === 'idle') return null;

  return (
    <canvas ref={canvasRef} style={{
      position: 'fixed', inset: 0, zIndex: 10002,
      pointerEvents: 'none',
    }} />
  );
}

function drawRocket(ctx, x, y, frame) {
  ctx.save();
  ctx.translate(x, y);

  // ── Main body (cylindrical, with metallic gradient) ──
  const bodyGrad = ctx.createLinearGradient(-14, 0, 14, 0);
  bodyGrad.addColorStop(0, '#6a6a72');
  bodyGrad.addColorStop(0.25, '#d8d8e0');
  bodyGrad.addColorStop(0.5, '#ffffff');
  bodyGrad.addColorStop(0.75, '#d8d8e0');
  bodyGrad.addColorStop(1, '#5a5a62');
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.moveTo(-12, -25);
  ctx.lineTo(-12, 22);
  ctx.lineTo(12, 22);
  ctx.lineTo(12, -25);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#2a2a30';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Body panel lines (rivets / segments)
  ctx.strokeStyle = 'rgba(40,40,50,0.5)';
  ctx.lineWidth = 0.6;
  [-12, 0, 12].forEach(py => {
    ctx.beginPath(); ctx.moveTo(-12, py); ctx.lineTo(12, py); ctx.stroke();
  });

  // ── Nose cone (red, smooth curve) ──
  const noseGrad = ctx.createLinearGradient(-12, -45, 12, -25);
  noseGrad.addColorStop(0, '#992200');
  noseGrad.addColorStop(0.5, '#ee3300');
  noseGrad.addColorStop(1, '#661100');
  ctx.fillStyle = noseGrad;
  ctx.beginPath();
  ctx.moveTo(-12, -25);
  ctx.quadraticCurveTo(-12, -50, 0, -52);
  ctx.quadraticCurveTo(12, -50, 12, -25);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#2a0000';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Nose tip highlight
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.beginPath();
  ctx.ellipse(-3, -45, 2, 5, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // ── Window (porthole with rim) ──
  ctx.fillStyle = '#1a1a2a';
  ctx.beginPath(); ctx.arc(0, -10, 5, 0, Math.PI * 2); ctx.fill();
  const winGrad = ctx.createRadialGradient(-1, -11, 0, 0, -10, 5);
  winGrad.addColorStop(0, '#aef6ff');
  winGrad.addColorStop(0.6, '#00b8d4');
  winGrad.addColorStop(1, '#003a4a');
  ctx.fillStyle = winGrad;
  ctx.beginPath(); ctx.arc(0, -10, 4, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 0.8;
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.beginPath(); ctx.arc(-1.5, -11.5, 1.2, 0, Math.PI * 2); ctx.fill();

  // ── Fins (red, triangular, with shading) ──
  // Left fin
  const finGradL = ctx.createLinearGradient(-22, 0, -12, 0);
  finGradL.addColorStop(0, '#661100');
  finGradL.addColorStop(1, '#cc2200');
  ctx.fillStyle = finGradL;
  ctx.beginPath();
  ctx.moveTo(-12, 5);
  ctx.lineTo(-24, 24);
  ctx.lineTo(-12, 22);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#2a0000'; ctx.lineWidth = 0.8; ctx.stroke();
  // Right fin
  const finGradR = ctx.createLinearGradient(12, 0, 22, 0);
  finGradR.addColorStop(0, '#cc2200');
  finGradR.addColorStop(1, '#661100');
  ctx.fillStyle = finGradR;
  ctx.beginPath();
  ctx.moveTo(12, 5);
  ctx.lineTo(24, 24);
  ctx.lineTo(12, 22);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Center fin (back)
  ctx.fillStyle = '#882200';
  ctx.beginPath();
  ctx.moveTo(-3, 22); ctx.lineTo(0, 28); ctx.lineTo(3, 22); ctx.closePath();
  ctx.fill();

  // ── Engine nozzle ──
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.moveTo(-7, 22);
  ctx.lineTo(-9, 28);
  ctx.lineTo(9, 28);
  ctx.lineTo(7, 22);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#555'; ctx.lineWidth = 0.8; ctx.stroke();

  // ── "USA" / mission stripe ──
  ctx.fillStyle = '#cc0000';
  ctx.fillRect(-12, -2, 24, 1.5);
  ctx.fillStyle = '#003a8c';
  ctx.fillRect(-12, 0, 24, 1.5);

  ctx.restore();
}

function drawExhaust(ctx, x, y, H, frame) {
  for (let i = 0; i < 15; i++) {
    const age = i * 4;
    const ex = x + (Math.random() - 0.5) * (10 + age * 0.5);
    const ey = y + 25 + age * 3;
    if (ey > H) continue;
    const size = 3 + age * 0.8;
    const alpha = Math.max(0, 0.6 - age * 0.04);
    const colors = ['#ff6600', '#ff4400', '#ffaa00', '#ff8800'];
    ctx.fillStyle = colors[i % 4];
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(ex, ey, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawRocketIcon(ctx, x, y, H, frame, violent = false) {
  const baseSize = Math.min(H * 0.28, 180);
  const size = violent ? baseSize * 1.08 : baseSize;
  const jitter = violent ? 6 : 2;
  const jx = (Math.random() - 0.5) * jitter;
  const jy = (Math.random() - 0.5) * jitter;

  ctx.save();
  ctx.translate(x + jx, y + jy);
  ctx.fillStyle = '#FF0066';
  ctx.shadowColor = 'rgba(255,0,102,0.7)';
  ctx.shadowBlur = violent ? 24 : 12;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 ${size}px "Material Symbols Outlined", sans-serif`;
  ctx.fillText('coronavirus', 0, 0);
  ctx.restore();

  if (!violent) {
    drawExhaust(ctx, x, y, H, frame);
  }
}

function drawGlitchOverlay(ctx, W, H, frame, violent = false) {
  // Scanlines
  ctx.fillStyle = violent ? 'rgba(255,0,102,0.06)' : 'rgba(255,0,102,0.03)';
  for (let y = 0; y < H; y += 3) {
    ctx.fillRect(0, y, W, 1);
  }

  // Glitch bars
  const bars = violent ? 18 : 8;
  for (let i = 0; i < bars; i++) {
    const h = 6 + Math.random() * (violent ? 36 : 18);
    const y = Math.random() * (H - h);
    ctx.fillStyle = `rgba(255,0,102,${0.1 + Math.random() * (violent ? 0.25 : 0.1)})`;
    ctx.fillRect(0, y, W, h);
  }

  // Impact flash burst
  if (violent && frame < 90) {
    const burst = Math.max(0, 1 - (frame - 60) / 20);
    ctx.fillStyle = `rgba(255,60,90,${0.5 * burst})`;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = `rgba(255,255,255,${0.35 * burst})`;
    ctx.fillRect(0, 0, W, H);
  }

  // Warning text with jitter
  const jitterX = (Math.random() - 0.5) * (violent ? 14 : 6);
  const jitterY = (Math.random() - 0.5) * (violent ? 10 : 6);
  ctx.save();
  ctx.translate(W / 2 + jitterX, H * 0.18 + jitterY);
  ctx.font = `700 ${violent ? 28 : 20}px Orbitron, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,0,102,0.9)';
  ctx.shadowColor = 'rgba(255,0,102,0.6)';
  ctx.shadowBlur = violent ? 20 : 12;
  ctx.fillText('SISTEMA DAÑADO', 0, 0);
  ctx.font = `500 ${violent ? 12 : 10}px Share Tech Mono, monospace`;
  ctx.fillStyle = 'rgba(255,187,51,0.85)';
  ctx.shadowBlur = violent ? 12 : 6;
  ctx.fillText('ERROR // SECUENCIA INESTABLE', 0, violent ? 22 : 18);
  ctx.restore();
}
