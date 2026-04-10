// ══════════════════════════════════════════════════════
//  ROCKET ANIMATION — Rocket destroys sky, reveals galaxy
//  Cinematic sequence during awakening finale
// ══════════════════════════════════════════════════════

'use client';
import { useEffect, useRef, useState } from 'react';

export default function RocketAnimation({ active, onImpact, onComplete }) {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState('idle'); // idle, launch, impact, shatter, done

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
    let rocketY = H + 100;
    const targetY = H * 0.2; // sky area
    const skyPieces = [];
    let impactDone = false;

    setPhase('launch');

    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, W, H);

      // PHASE 1: Rocket ascending (frames 0-90)
      if (frame < 90) {
        const progress = frame / 90;
        const eased = 1 - Math.pow(1 - progress, 3);
        rocketY = H + 100 - (H + 100 - targetY) * eased;

        // Rocket body
        drawRocket(ctx, rocketX, rocketY, frame);

        // Exhaust trail
        drawExhaust(ctx, rocketX, rocketY, H, frame);

        // Screen rumble intensifies
        if (frame > 60) {
          const shake = (frame - 60) / 30 * 4;
          canvas.style.transform = `translate(${(Math.random()-0.5)*shake}px, ${(Math.random()-0.5)*shake}px)`;
        }
      }
      // PHASE 2: Impact (frames 90-120)
      else if (frame < 120) {
        if (!impactDone) {
          impactDone = true;
          setPhase('impact');
          onImpact?.();
          // Generate sky pieces
          for (let i = 0; i < 40; i++) {
            skyPieces.push({
              x: W * 0.3 + Math.random() * W * 0.4,
              y: Math.random() * H * 0.4,
              vx: (Math.random() - 0.5) * 8,
              vy: 2 + Math.random() * 6,
              rot: Math.random() * Math.PI * 2,
              vr: (Math.random() - 0.5) * 0.2,
              w: 20 + Math.random() * 60,
              h: 15 + Math.random() * 40,
              color: `rgba(${100+Math.random()*100},${150+Math.random()*100},${200+Math.random()*55},0.7)`,
            });
          }
          if (navigator.vibrate) navigator.vibrate([200, 100, 300, 100, 500]);
        }

        // Impact flash
        const flashAlpha = 1 - (frame - 90) / 30;
        ctx.fillStyle = `rgba(255,255,255,${flashAlpha * 0.8})`;
        ctx.fillRect(0, 0, W, H);

        // Galaxy reveal (dark void with stars)
        drawGalaxyHole(ctx, rocketX, targetY, (frame - 90) / 30, W, H);

        // Heavy shake
        const shake = 15 * (1 - (frame - 90) / 30);
        canvas.style.transform = `translate(${(Math.random()-0.5)*shake}px, ${(Math.random()-0.5)*shake}px)`;
      }
      // PHASE 3: Sky falling (frames 120-240)
      else if (frame < 240) {
        setPhase('shatter');
        const fallProgress = (frame - 120) / 120;

        // Galaxy hole grows
        drawGalaxyHole(ctx, rocketX, targetY, 1 + fallProgress * 0.5, W, H);

        // Sky pieces falling
        skyPieces.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.15;
          p.rot += p.vr;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
          // Crack pattern on piece
          ctx.strokeStyle = 'rgba(255,255,255,0.4)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(-p.w/4, -p.h/2);
          ctx.lineTo(p.w/4, p.h/2);
          ctx.stroke();
          ctx.restore();
        });

        // Fading shake
        const shake = 5 * (1 - fallProgress);
        canvas.style.transform = `translate(${(Math.random()-0.5)*shake}px, ${(Math.random()-0.5)*shake}px)`;
      }
      // PHASE 4: Fade out
      else {
        setPhase('done');
        canvas.style.transform = '';
        const fadeOut = Math.min(1, (frame - 240) / 30);
        ctx.globalAlpha = 1 - fadeOut;
        drawGalaxyHole(ctx, rocketX, targetY, 1.5, W, H);
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

function drawGalaxyHole(ctx, cx, cy, scale, W, H) {
  const radius = 80 * scale;
  // Dark void
  const voidGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  voidGrad.addColorStop(0, 'rgba(5,0,20,0.95)');
  voidGrad.addColorStop(0.5, 'rgba(10,5,40,0.8)');
  voidGrad.addColorStop(0.8, 'rgba(20,10,60,0.4)');
  voidGrad.addColorStop(1, 'rgba(40,20,80,0)');
  ctx.fillStyle = voidGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
  // Stars inside
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.85, 0, Math.PI * 2);
  ctx.clip();
  for (let i = 0; i < 50; i++) {
    const sx = cx + (Math.random() - 0.5) * radius * 2;
    const sy = cy + (Math.random() - 0.5) * radius * 2;
    ctx.fillStyle = ['#fff', '#aaddff', '#ffddaa', '#ddaaff'][Math.floor(Math.random()*4)];
    ctx.globalAlpha = 0.4 + Math.random() * 0.6;
    ctx.beginPath();
    ctx.arc(sx, sy, 0.5 + Math.random() * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  // Nebula
  const nebGrad = ctx.createRadialGradient(cx-20, cy+10, 0, cx, cy, radius*0.6);
  nebGrad.addColorStop(0, 'rgba(100,50,200,0.3)');
  nebGrad.addColorStop(0.5, 'rgba(50,100,200,0.15)');
  nebGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = nebGrad;
  ctx.globalAlpha = 0.5;
  ctx.fillRect(cx-radius, cy-radius, radius*2, radius*2);
  ctx.globalAlpha = 1;
  ctx.restore();
}
