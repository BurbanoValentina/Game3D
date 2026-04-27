// ══════════════════════════════════════════════════════
//  LEVEL 2 SKY — Biblioteca de Halliday
//  Warm sepia atmosphere, floating pages, dim candlelight
// ══════════════════════════════════════════════════════

export function buildSky(scene, THREE) {
  const skyGeo = new THREE.BoxGeometry(350, 350, 350);
  const skyCanvas = document.createElement('canvas');
  skyCanvas.width = 1024; skyCanvas.height = 512;
  const ctx = skyCanvas.getContext('2d');

  // Deep warm library gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 512);
  skyGrad.addColorStop(0, '#1A0F05');
  skyGrad.addColorStop(0.15, '#2D1A0D');
  skyGrad.addColorStop(0.3, '#4A2E18');
  skyGrad.addColorStop(0.5, '#6B4423');
  skyGrad.addColorStop(0.7, '#8B6340');
  skyGrad.addColorStop(0.85, '#A8845C');
  skyGrad.addColorStop(1, '#C4A882');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Floating pages
  for (let i = 0; i < 40; i++) {
    const px = Math.random() * 1024;
    const py = 50 + Math.random() * 350;
    const size = 8 + Math.random() * 20;
    const angle = Math.random() * Math.PI * 0.5 - 0.25;
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(angle);
    ctx.fillStyle = `rgba(255,248,230,${0.08 + Math.random() * 0.12})`;
    ctx.fillRect(-size / 2, -size * 0.7, size, size * 1.4);
    // Page lines
    ctx.strokeStyle = `rgba(139,99,64,${0.05 + Math.random() * 0.05})`;
    ctx.lineWidth = 0.5;
    for (let l = 0; l < 5; l++) {
      const ly = -size * 0.5 + l * size * 0.25;
      ctx.beginPath();
      ctx.moveTo(-size * 0.35, ly);
      ctx.lineTo(size * 0.35, ly);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Candle glow spots
  const candlePositions = [
    [180, 300], [400, 250], [650, 320], [850, 280], [100, 380],
  ];
  candlePositions.forEach(([cx, cy]) => {
    const cg = ctx.createRadialGradient(cx, cy, 5, cx, cy, 80);
    cg.addColorStop(0, 'rgba(255,200,100,0.25)');
    cg.addColorStop(0.3, 'rgba(255,170,60,0.12)');
    cg.addColorStop(1, 'rgba(200,120,40,0)');
    ctx.fillStyle = cg;
    ctx.fillRect(cx - 80, cy - 80, 160, 160);
  });

  // Dust motes
  for (let i = 0; i < 200; i++) {
    const dx = Math.random() * 1024;
    const dy = Math.random() * 512;
    ctx.fillStyle = `rgba(255,230,180,${0.1 + Math.random() * 0.2})`;
    ctx.beginPath();
    ctx.arc(dx, dy, 0.5 + Math.random() * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Dark voids between shelves (the "huecos negros")
  for (let i = 0; i < 6; i++) {
    const vx = 80 + Math.random() * 860;
    const vy = 100 + Math.random() * 300;
    const vr = 20 + Math.random() * 40;
    const vg = ctx.createRadialGradient(vx, vy, 0, vx, vy, vr);
    vg.addColorStop(0, 'rgba(0,0,0,0.6)');
    vg.addColorStop(0.5, 'rgba(10,5,15,0.3)');
    vg.addColorStop(1, 'rgba(20,10,5,0)');
    ctx.fillStyle = vg;
    ctx.beginPath();
    ctx.arc(vx, vy, vr, 0, Math.PI * 2);
    ctx.fill();
  }

  // Shelf silhouettes on horizon
  ctx.fillStyle = 'rgba(30,18,8,0.4)';
  for (let i = 0; i < 20; i++) {
    const sx = i * 55 + Math.random() * 20;
    const sh = 40 + Math.random() * 100;
    ctx.fillRect(sx, 430 - sh, 12 + Math.random() * 8, sh + 82);
  }

  const skyTexture = new THREE.CanvasTexture(skyCanvas);
  const skyMat = new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.BackSide });
  const sky = new THREE.Mesh(skyGeo, skyMat);
  scene.add(sky);
  return sky;
}
