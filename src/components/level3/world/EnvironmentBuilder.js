// ══════════════════════════════════════════════════════
//  LEVEL 3 ENVIRONMENT — Arena/Coliseum structures
//  Stadium walls, pillars, giant screens
// ══════════════════════════════════════════════════════

const ARENA_CONFIGS = [
  { x: 40, z: -55, w: 8, h: 35, d: 5, rot: 0.3, type: 'pillar' },
  { x: -50, z: -40, w: 6, h: 45, d: 6, rot: -0.1, type: 'wall' },
  { x: 65, z: 25, w: 5, h: 30, d: 8, rot: 0.5, type: 'screen' },
  { x: -35, z: 50, w: 10, h: 40, d: 5, rot: -0.2, type: 'wall' },
  { x: 20, z: -75, w: 7, h: 50, d: 6, rot: 0, type: 'pillar' },
  { x: -70, z: 15, w: 5, h: 38, d: 7, rot: 0.4, type: 'screen' },
  { x: 80, z: -25, w: 8, h: 42, d: 5, rot: -0.3, type: 'wall' },
  { x: -25, z: -65, w: 6, h: 36, d: 6, rot: 0.15, type: 'pillar' },
  { x: 55, z: 55, w: 7, h: 44, d: 5, rot: -0.4, type: 'screen' },
  { x: -80, z: -55, w: 5, h: 48, d: 8, rot: 0.2, type: 'wall' },
  { x: 75, z: 65, w: 6, h: 32, d: 6, rot: 0, type: 'pillar' },
  { x: -60, z: 65, w: 8, h: 38, d: 5, rot: -0.1, type: 'wall' },
  { x: 30, z: 40, w: 5, h: 28, d: 7, rot: 0.35, type: 'screen' },
  { x: -15, z: 35, w: 6, h: 46, d: 6, rot: -0.25, type: 'pillar' },
  { x: 70, z: -65, w: 7, h: 40, d: 5, rot: 0.1, type: 'wall' },
];

function createArenaTexture(type) {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (type === 'screen') {
    ctx.fillStyle = '#0A0015'; ctx.fillRect(0, 0, 256, 512);
    // Screen static
    for (let i = 0; i < 500; i++) {
      ctx.fillStyle = `rgba(220,20,60,${Math.random() * 0.15})`;
      ctx.fillRect(Math.random() * 256, Math.random() * 512, 2 + Math.random() * 4, 1);
    }
    // Score numbers
    ctx.font = 'bold 48px monospace'; ctx.fillStyle = 'rgba(220,20,60,0.5)';
    ctx.fillText(String(Math.floor(Math.random() * 9999)), 30, 200);
    ctx.fillText(String(Math.floor(Math.random() * 9999)), 30, 380);
    ctx.strokeStyle = 'rgba(220,20,60,0.3)'; ctx.lineWidth = 2; ctx.strokeRect(10, 10, 236, 492);
  } else if (type === 'pillar') {
    ctx.fillStyle = '#150020'; ctx.fillRect(0, 0, 256, 512);
    // Vertical glow lines
    ctx.strokeStyle = 'rgba(220,20,60,0.2)'; ctx.lineWidth = 2;
    for (let x = 0; x < 256; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke(); }
    // Decorative arches
    ctx.strokeStyle = 'rgba(157,0,255,0.15)'; ctx.lineWidth = 1;
    for (let y = 0; y < 512; y += 80) { ctx.beginPath(); ctx.arc(128, y, 40, Math.PI, 0); ctx.stroke(); }
  } else {
    ctx.fillStyle = '#100018'; ctx.fillRect(0, 0, 256, 512);
    // Brick pattern
    ctx.strokeStyle = 'rgba(220,20,60,0.08)'; ctx.lineWidth = 1;
    for (let y = 0; y < 512; y += 16) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(256, y); ctx.stroke();
      const off = (y / 16) % 2 === 0 ? 0 : 32;
      for (let x = off; x < 256; x += 64) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 16); ctx.stroke(); }
    }
  }
  return canvas;
}

export function buildEnvironment(scene, THREE) {
  const buildings = [], colliders = [];

  ARENA_CONFIGS.forEach((cfg) => {
    const texCanvas = createArenaTexture(cfg.type);
    const texture = new THREE.CanvasTexture(texCanvas);
    const geo = new THREE.BoxGeometry(cfg.w, cfg.h, cfg.d);
    const mat = new THREE.MeshPhongMaterial({
      map: texture, color: 0x2A0040, emissive: 0x200030, emissiveIntensity: 0.15, shininess: 30,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(cfg.x, cfg.h / 2, cfg.z);
    mesh.rotation.y = cfg.rot;
    mesh.castShadow = true; mesh.receiveShadow = true;
    scene.add(mesh);

    const edges = new THREE.EdgesGeometry(geo);
    mesh.add(new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xDC143C, transparent: true, opacity: 0.2 })));
    buildings.push({ mesh, width: cfg.w, depth: cfg.d, height: cfg.h });

    const halfW = cfg.w / 2 + 1, halfD = cfg.d / 2 + 1;
    colliders.push({ minX: cfg.x - halfW, maxX: cfg.x + halfW, minZ: cfg.z - halfD, maxZ: cfg.z + halfD });
  });

  return { buildings, colliders };
}
