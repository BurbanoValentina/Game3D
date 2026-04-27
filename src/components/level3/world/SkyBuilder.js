// ══════════════════════════════════════════════════════
//  LEVEL 3 SKY — Arena Digital
//  Electric purple/crimson sky, giant screens, lightning
// ══════════════════════════════════════════════════════

export function buildSky(scene, THREE) {
  const skyGeo = new THREE.BoxGeometry(350, 350, 350);
  const skyCanvas = document.createElement('canvas');
  skyCanvas.width = 1024; skyCanvas.height = 512;
  const ctx = skyCanvas.getContext('2d');

  // Electric dark gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 512);
  skyGrad.addColorStop(0, '#0A0015');
  skyGrad.addColorStop(0.15, '#1A0030');
  skyGrad.addColorStop(0.3, '#2A0045');
  skyGrad.addColorStop(0.5, '#3D0060');
  skyGrad.addColorStop(0.7, '#5A0080');
  skyGrad.addColorStop(0.85, '#400030');
  skyGrad.addColorStop(1, '#200020');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Giant floating screens
  const screens = [[150, 120, 180, 100], [500, 80, 200, 120], [800, 150, 160, 90]];
  screens.forEach(([sx, sy, sw, sh]) => {
    ctx.fillStyle = 'rgba(220,20,60,0.08)';
    ctx.fillRect(sx, sy, sw, sh);
    ctx.strokeStyle = 'rgba(220,20,60,0.4)'; ctx.lineWidth = 2;
    ctx.strokeRect(sx, sy, sw, sh);
    // Scoreboard numbers
    ctx.font = 'bold 28px monospace'; ctx.fillStyle = 'rgba(220,20,60,0.3)';
    ctx.fillText(Math.floor(Math.random() * 9999).toString(), sx + 20, sy + sh / 2 + 10);
    // Static noise
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.05})`;
      ctx.fillRect(sx + Math.random() * sw, sy + Math.random() * sh, 2, 1);
    }
  });

  // Lightning bolts
  ctx.strokeStyle = 'rgba(220,20,60,0.15)'; ctx.lineWidth = 1.5;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    let lx = Math.random() * 1024, ly = 0;
    ctx.moveTo(lx, ly);
    for (let s = 0; s < 8; s++) {
      lx += (Math.random() - 0.5) * 60; ly += 30 + Math.random() * 40;
      ctx.lineTo(lx, ly);
    }
    ctx.stroke();
  }

  // Electric particles
  for (let i = 0; i < 300; i++) {
    const colors = ['rgba(220,20,60,0.3)', 'rgba(255,0,102,0.2)', 'rgba(157,0,255,0.2)', 'rgba(255,68,68,0.15)'];
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.beginPath();
    ctx.arc(Math.random() * 1024, Math.random() * 512, 0.5 + Math.random() * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Arena silhouette on horizon
  ctx.fillStyle = 'rgba(20,0,30,0.6)';
  ctx.beginPath(); ctx.moveTo(0, 450);
  for (let x = 0; x <= 1024; x += 40) {
    const h = 20 + Math.sin(x * 0.02) * 15 + Math.random() * 10;
    ctx.lineTo(x, 450 - h);
  }
  ctx.lineTo(1024, 512); ctx.lineTo(0, 512); ctx.closePath(); ctx.fill();
  // Coliseum arches
  for (let i = 0; i < 15; i++) {
    const ax = 30 + i * 70;
    ctx.strokeStyle = 'rgba(220,20,60,0.12)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(ax, 445, 18, Math.PI, 0); ctx.stroke();
  }

  const skyTexture = new THREE.CanvasTexture(skyCanvas);
  const sky = new THREE.Mesh(skyGeo, new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.BackSide }));
  scene.add(sky);
  return sky;
}
