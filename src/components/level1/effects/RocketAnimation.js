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
  // Body
  ctx.fillStyle = '#ddd';
  ctx.beginPath();
  ctx.moveTo(0, -40);
  ctx.lineTo(-12, 20);
  ctx.lineTo(12, 20);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#ff4400';
  ctx.lineWidth = 2;
  ctx.stroke();
  // Nose cone
  ctx.fillStyle = '#ff4400';
  ctx.beginPath();
  ctx.moveTo(0, -40);
  ctx.lineTo(-6, -25);
  ctx.lineTo(6, -25);
  ctx.closePath();
  ctx.fill();
  // Fins
  ctx.fillStyle = '#cc3300';
  ctx.beginPath();
  ctx.moveTo(-12, 15); ctx.lineTo(-22, 25); ctx.lineTo(-12, 20); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(12, 15); ctx.lineTo(22, 25); ctx.lineTo(12, 20); ctx.fill();
  // Window
  ctx.fillStyle = '#00f0ff';
  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(0, -10, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
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
