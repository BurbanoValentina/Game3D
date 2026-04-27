// ══════════════════════════════════════════════════════
//  LEVEL 2 ENVIRONMENT — Bookshelves as structures
//  Giant library shelves with book textures
// ══════════════════════════════════════════════════════

const SHELF_CONFIGS = [
  { x: 35, z: -50, w: 6, h: 45, d: 6, rot: 0.2 },
  { x: -45, z: -35, w: 8, h: 55, d: 5, rot: -0.1 },
  { x: 60, z: 30, w: 5, h: 40, d: 7, rot: 0.4 },
  { x: -30, z: 55, w: 7, h: 50, d: 6, rot: -0.3 },
  { x: 15, z: -70, w: 6, h: 60, d: 5, rot: 0 },
  { x: -65, z: 10, w: 5, h: 35, d: 8, rot: 0.5 },
  { x: 75, z: -20, w: 8, h: 48, d: 6, rot: -0.2 },
  { x: -20, z: -60, w: 6, h: 42, d: 5, rot: 0.1 },
  { x: 50, z: 60, w: 7, h: 38, d: 6, rot: -0.4 },
  { x: -75, z: -50, w: 5, h: 52, d: 7, rot: 0.3 },
  { x: 80, z: 70, w: 6, h: 44, d: 5, rot: 0 },
  { x: -55, z: 70, w: 8, h: 46, d: 6, rot: -0.15 },
  { x: 25, z: 45, w: 5, h: 36, d: 6, rot: 0.25 },
  { x: -10, z: 30, w: 7, h: 58, d: 5, rot: -0.35 },
  { x: 65, z: -60, w: 6, h: 50, d: 7, rot: 0.15 },
];

function createBookTexture(w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Dark wood base
  ctx.fillStyle = '#2A1810';
  ctx.fillRect(0, 0, 256, 512);

  // Wood grain
  ctx.strokeStyle = 'rgba(60,35,20,0.4)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 30; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * 17 + Math.random() * 5);
    ctx.bezierCurveTo(80, i * 17 + Math.random() * 10, 170, i * 17 - Math.random() * 8, 256, i * 17 + Math.random() * 5);
    ctx.stroke();
  }

  // Book rows (horizontal shelves with colored book spines)
  const shelfCount = 8 + Math.floor(Math.random() * 4);
  const shelfH = 512 / shelfCount;
  const bookColors = [
    '#8B4513', '#A0522D', '#654321', '#3E2723', '#4A148C',
    '#1A237E', '#004D40', '#B71C1C', '#E65100', '#F57F17',
    '#2E1A47', '#1B3A2A', '#4A2020', '#2B3A4A', '#5A3A1A',
  ];

  for (let s = 0; s < shelfCount; s++) {
    const sy = s * shelfH;
    // Shelf line
    ctx.fillStyle = 'rgba(80,50,30,0.9)';
    ctx.fillRect(0, sy + shelfH - 3, 256, 3);

    // Books on shelf
    let bx = 2;
    while (bx < 252) {
      const bw = 4 + Math.random() * 12;
      const bh = shelfH - 6 - Math.random() * 8;
      const color = bookColors[Math.floor(Math.random() * bookColors.length)];
      ctx.fillStyle = color;
      ctx.fillRect(bx, sy + shelfH - 3 - bh, bw, bh);
      // Spine highlight
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fillRect(bx + 1, sy + shelfH - 3 - bh, 1, bh);
      // Gold text line
      if (Math.random() > 0.5) {
        ctx.fillStyle = 'rgba(218,165,32,0.3)';
        ctx.fillRect(bx + 2, sy + shelfH - 3 - bh * 0.4, bw - 4, 1);
      }
      bx += bw + 1;
    }
  }

  // Indigo glow accent (level color)
  ctx.fillStyle = 'rgba(75,0,130,0.04)';
  ctx.fillRect(0, 0, 256, 512);

  return canvas;
}

export function buildEnvironment(scene, THREE) {
  const buildings = [];
  const colliders = [];

  SHELF_CONFIGS.forEach((cfg, i) => {
    const texCanvas = createBookTexture(cfg.w, cfg.h);
    const texture = new THREE.CanvasTexture(texCanvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    const geo = new THREE.BoxGeometry(cfg.w, cfg.h, cfg.d);
    const mat = new THREE.MeshPhongMaterial({
      map: texture,
      color: 0x4A3020,
      emissive: 0x1A0A05,
      emissiveIntensity: 0.2,
      shininess: 10,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(cfg.x, cfg.h / 2, cfg.z);
    mesh.rotation.y = cfg.rot;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    // Edges for structure visibility
    const edges = new THREE.EdgesGeometry(geo);
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x4B0082, transparent: true, opacity: 0.15 });
    mesh.add(new THREE.LineSegments(edges, edgeMat));

    buildings.push({ mesh, width: cfg.w, depth: cfg.d, height: cfg.h });

    // Collider (axis-aligned approximation)
    const halfW = cfg.w / 2 + 1;
    const halfD = cfg.d / 2 + 1;
    colliders.push({
      minX: cfg.x - halfW, maxX: cfg.x + halfW,
      minZ: cfg.z - halfD, maxZ: cfg.z + halfD,
    });
  });

  return { buildings, colliders };
}
