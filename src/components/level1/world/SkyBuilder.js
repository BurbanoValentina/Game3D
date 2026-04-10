// ══════════════════════════════════════════════════════
//  SKY BUILDER — Blue sky, clouds, sun, glass breach
//  Creates the skybox with realistic sky + galaxy hole
// ══════════════════════════════════════════════════════

export function buildSky(scene, THREE) {
  const skyGeo = new THREE.BoxGeometry(350, 350, 350);
  const skyCanvas = document.createElement('canvas');
  skyCanvas.width = 1024; skyCanvas.height = 512;
  const ctx = skyCanvas.getContext('2d');

  // Blue sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 512);
  skyGrad.addColorStop(0, '#0A1628');
  skyGrad.addColorStop(0.1, '#1A3A5C');
  skyGrad.addColorStop(0.25, '#2E6B9E');
  skyGrad.addColorStop(0.45, '#4A9BD9');
  skyGrad.addColorStop(0.6, '#6CB4E8');
  skyGrad.addColorStop(0.75, '#8CC8F0');
  skyGrad.addColorStop(0.88, '#C8E6F8');
  skyGrad.addColorStop(1, '#E8D8C8');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Draw clouds
  drawClouds(ctx);

  // Sun glow
  drawSun(ctx, 200, 90);

  // Glass breach with galaxy
  drawGlassBreach(ctx, 620, 160, 90);

  // Horizon details
  drawHorizon(ctx);

  const skyTexture = new THREE.CanvasTexture(skyCanvas);
  const skyMat = new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.BackSide });
  const sky = new THREE.Mesh(skyGeo, skyMat);
  scene.add(sky);
  return sky;
}

function drawCloud(ctx, cx, cy, scale, opacity) {
  const puffs = [
    { dx: 0, dy: 0, rx: 60 * scale, ry: 30 * scale },
    { dx: -40 * scale, dy: 5, rx: 45 * scale, ry: 25 * scale },
    { dx: 40 * scale, dy: 5, rx: 50 * scale, ry: 22 * scale },
    { dx: -70 * scale, dy: 10, rx: 35 * scale, ry: 18 * scale },
    { dx: 65 * scale, dy: 8, rx: 40 * scale, ry: 20 * scale },
    { dx: -20 * scale, dy: -12, rx: 50 * scale, ry: 28 * scale },
    { dx: 25 * scale, dy: -10, rx: 45 * scale, ry: 26 * scale },
  ];
  puffs.forEach(p => {
    const cg = ctx.createRadialGradient(cx + p.dx, cy + p.dy, 0, cx + p.dx, cy + p.dy, p.rx);
    cg.addColorStop(0, `rgba(255,255,255,${0.7 * opacity})`);
    cg.addColorStop(0.3, `rgba(245,248,255,${0.5 * opacity})`);
    cg.addColorStop(0.6, `rgba(220,235,250,${0.25 * opacity})`);
    cg.addColorStop(1, 'rgba(200,220,240,0)');
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.ellipse(cx + p.dx, cy + p.dy, p.rx, p.ry, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  // Shadow
  const sg = ctx.createRadialGradient(cx, cy + 15 * scale, 0, cx, cy + 15 * scale, 70 * scale);
  sg.addColorStop(0, `rgba(100,130,170,${0.12 * opacity})`);
  sg.addColorStop(1, 'rgba(100,130,170,0)');
  ctx.fillStyle = sg;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 15 * scale, 70 * scale, 15 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawClouds(ctx) {
  const clouds = [
    [150, 80, 1.2, 1.0], [420, 120, 1.5, 0.9], [700, 70, 1.0, 0.85],
    [280, 200, 0.8, 0.7], [550, 180, 1.1, 0.75], [850, 160, 0.9, 0.8],
    [80, 250, 0.7, 0.6], [620, 260, 0.6, 0.55], [950, 100, 1.3, 0.85],
  ];
  clouds.forEach(c => drawCloud(ctx, ...c));
  for (let i = 0; i < 15; i++) {
    drawCloud(ctx, Math.random() * 1024, 50 + Math.random() * 280, 0.2 + Math.random() * 0.4, 0.3 + Math.random() * 0.3);
  }
}

function drawSun(ctx, x, y) {
  const sg = ctx.createRadialGradient(x, y, 10, x, y, 200);
  sg.addColorStop(0, 'rgba(255,250,220,0.95)');
  sg.addColorStop(0.08, 'rgba(255,240,180,0.8)');
  sg.addColorStop(0.2, 'rgba(255,220,140,0.4)');
  sg.addColorStop(0.4, 'rgba(255,200,100,0.12)');
  sg.addColorStop(1, 'rgba(150,170,200,0)');
  ctx.fillStyle = sg;
  ctx.fillRect(0, 0, 1024, 512);
  ctx.beginPath();
  ctx.arc(x, y, 28, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,252,240,0.98)';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, y, 35, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,245,200,0.25)';
  ctx.fill();
}

function drawGlassBreach(ctx, hx, hy, hR) {
  // Galaxy void
  const vg = ctx.createRadialGradient(hx, hy, 0, hx, hy, hR);
  vg.addColorStop(0, 'rgba(5,0,15,0.95)');
  vg.addColorStop(0.4, 'rgba(10,5,30,0.85)');
  vg.addColorStop(0.7, 'rgba(20,10,50,0.6)');
  vg.addColorStop(1, 'rgba(60,40,100,0)');
  ctx.fillStyle = vg;
  ctx.beginPath(); ctx.arc(hx, hy, hR, 0, Math.PI * 2); ctx.fill();

  // Stars + nebula inside
  ctx.save();
  ctx.beginPath(); ctx.arc(hx, hy, hR * 0.75, 0, Math.PI * 2); ctx.clip();
  for (let i = 0; i < 60; i++) {
    ctx.fillStyle = ['#fff', '#aaddff', '#ffddaa', '#dd88ff'][Math.floor(Math.random()*4)];
    ctx.globalAlpha = 0.3 + Math.random() * 0.7;
    ctx.beginPath();
    ctx.arc(hx + (Math.random()-0.5)*hR*1.5, hy + (Math.random()-0.5)*hR*1.5, 0.5 + Math.random() * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  // Nebula colors
  const ng = ctx.createRadialGradient(hx-15, hy+10, 0, hx, hy, hR*0.6);
  ng.addColorStop(0, 'rgba(120,40,200,0.3)');
  ng.addColorStop(0.5, 'rgba(40,80,200,0.15)');
  ng.addColorStop(1, 'transparent');
  ctx.globalAlpha = 0.5; ctx.fillStyle = ng;
  ctx.fillRect(hx-hR, hy-hR, hR*2, hR*2);
  ctx.globalAlpha = 1; ctx.restore();

  // Glass cracks
  ctx.save();
  ctx.strokeStyle = 'rgba(200,220,255,0.6)';
  ctx.lineWidth = 1.5;
  ctx.shadowColor = 'rgba(150,200,255,0.8)'; ctx.shadowBlur = 4;
  for (let i = 0; i < 18; i++) {
    const angle = (i / 18) * Math.PI * 2 + (Math.random()-0.5) * 0.3;
    const len = hR + 20 + Math.random() * 80;
    ctx.beginPath();
    let cx = hx + Math.cos(angle) * hR * 0.7;
    let cy = hy + Math.sin(angle) * hR * 0.7;
    ctx.moveTo(cx, cy);
    for (let s = 0; s < 5 + Math.floor(Math.random()*4); s++) {
      const p = (s+1) / 6;
      ctx.lineTo(hx + Math.cos(angle)*len*p + (Math.random()-0.5)*20,
                 hy + Math.sin(angle)*len*p + (Math.random()-0.5)*20);
    }
    ctx.stroke();
  }
  ctx.shadowBlur = 0; ctx.restore();

  // Glass glow
  const gg = ctx.createRadialGradient(hx, hy, hR*0.8, hx, hy, hR*1.3);
  gg.addColorStop(0, 'rgba(180,210,255,0.15)');
  gg.addColorStop(1, 'rgba(120,180,255,0)');
  ctx.fillStyle = gg;
  ctx.fillRect(hx-hR*1.5, hy-hR*1.5, hR*3, hR*3);
}

function drawHorizon(ctx) {
  for (let s = 0; s < 6; s++) {
    ctx.globalAlpha = 0.06 + Math.random() * 0.04;
    ctx.fillStyle = s % 2 === 0 ? '#C8A888' : '#A8C8D8';
    ctx.fillRect(Math.random() * 1024, 380 + Math.random() * 80, 150 + Math.random() * 250, 1 + Math.random() * 3);
  }
  ctx.globalAlpha = 0.08;
  for (let t = 0; t < 10; t++) {
    ctx.fillStyle = '#3A5A7A';
    ctx.fillRect(30 + t * 100, 435 - 20 - Math.random() * 40, 6 + Math.random() * 16, 20 + Math.random() * 40);
  }
  ctx.globalAlpha = 1;
}
