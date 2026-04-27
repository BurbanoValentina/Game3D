// ══════════════════════════════════════════════════════
//  LEVEL 2 AMBIENT — Library atmosphere
//  Floating pages, candle lights, scholar NPCs, ghost
// ══════════════════════════════════════════════════════

import { LEVEL2_GRAFFITI } from '../../../constants/level2Constants';

const LIBRARY_COLORS = [0x4B0082, 0x9D00FF, 0xFFD700, 0x8B4513, 0xFF6600, 0xD861FF, 0x61FFD8, 0x00f0ff];

export function buildParticles(scene, THREE, assets) {
  const count = 2000;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const dustColors = [[1.0, 0.85, 0.55], [0.95, 0.75, 0.4], [0.9, 0.7, 0.35], [0.3, 0, 0.5], [1.0, 0.9, 0.7]];
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 230;
    positions[i * 3 + 1] = Math.random() * 60;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 230;
    const c = dustColors[Math.floor(Math.random() * dustColors.length)];
    colors[i * 3] = c[0]; colors[i * 3 + 1] = c[1]; colors[i * 3 + 2] = c[2];
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const particleMat = new THREE.PointsMaterial({ size: 0.15, vertexColors: true, transparent: true, opacity: 0.5 });
  assets.particles = new THREE.Points(particleGeo, particleMat);
  scene.add(assets.particles);
}

export function buildNeonLights(scene, THREE, assets) {
  // Candle-like warm lights throughout the library
  for (let i = 0; i < 15; i++) {
    const isCandle = Math.random() > 0.3;
    const color = isCandle ? 0xFFAA44 : LIBRARY_COLORS[Math.floor(Math.random() * LIBRARY_COLORS.length)];
    const light = new THREE.PointLight(color, isCandle ? 2.5 : 1.5, 25 + Math.random() * 20);
    light.position.set((Math.random() - 0.5) * 200, 3 + Math.random() * 15, (Math.random() - 0.5) * 200);
    scene.add(light);
    assets.neonLights.push({ light, baseIntensity: light.intensity, phase: Math.random() * Math.PI * 2 });
  }
}

export function buildGraffiti(scene, THREE, assets, buildings) {
  const count = Math.min(buildings.length, LEVEL2_GRAFFITI.length);
  for (let i = 0; i < count; i++) {
    const b = buildings[i];
    const g = LEVEL2_GRAFFITI[i];
    const side = Math.random() > 0.5 ? 1 : -1;
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 512, 128);
    ctx.fillStyle = 'rgba(30,18,10,0.6)';
    ctx.fillRect(0, 20, 512, 80);
    ctx.strokeStyle = g.color; ctx.globalAlpha = 0.3; ctx.lineWidth = 1;
    ctx.strokeRect(4, 22, 504, 76); ctx.globalAlpha = 1;
    ctx.font = 'bold 32px monospace'; ctx.fillStyle = g.color;
    ctx.shadowColor = g.color; ctx.shadowBlur = 20;
    ctx.fillText(g.text, 16, 68); ctx.shadowBlur = 0;
    const texture = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide, opacity: 0.85 });
    const geo = new THREE.PlaneGeometry(8, 2);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(b.mesh.position.x + side * (b.width / 2 + 0.1), 5 + Math.random() * 8, b.mesh.position.z);
    mesh.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2;
    scene.add(mesh);
    assets.graffitiMeshes.push(mesh);
  }
}

export function buildNPCs(scene, THREE, assets) {
  // Scholar NPCs — translucent figures reading books
  for (let i = 0; i < 5; i++) {
    const npcGeo = new THREE.CylinderGeometry(0.3, 0.3, 2.5, 6);
    const npcMat = new THREE.MeshPhongMaterial({
      color: 0x4A3020, emissive: 0x4B0082, emissiveIntensity: 0.1,
      transparent: true, opacity: 0.35, wireframe: Math.random() > 0.5,
    });
    const npc = new THREE.Mesh(npcGeo, npcMat);
    const npcX = (Math.random() - 0.5) * 100;
    const npcZ = (Math.random() - 0.5) * 100;
    npc.position.set(npcX, 1.25, npcZ);
    scene.add(npc);
    assets.npcs.push({ mesh: npc, baseX: npcX, baseZ: npcZ, loopPhase: Math.random() * Math.PI * 2 });
  }
}

export function buildGhost(scene, THREE, assets) {
  const ghostGeo = new THREE.CylinderGeometry(0.4, 0.6, 3.5, 6);
  const ghostMat = new THREE.MeshPhongMaterial({ color: 0x4B0082, emissive: 0x4B0082, transparent: true, opacity: 0, wireframe: true });
  const ghost = new THREE.Mesh(ghostGeo, ghostMat);
  ghost.position.set(0, 1.75, 0);
  scene.add(ghost);
  const trailGeo = new THREE.BufferGeometry();
  const trailPos = new Float32Array(30 * 3);
  for (let i = 0; i < 30; i++) { trailPos[i*3]=(Math.random()-0.5)*2; trailPos[i*3+1]=Math.random()*4; trailPos[i*3+2]=(Math.random()-0.5)*2; }
  trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
  const trailMat = new THREE.PointsMaterial({ color: 0x4B0082, size: 0.15, transparent: true, opacity: 0 });
  const trail = new THREE.Points(trailGeo, trailMat);
  scene.add(trail);
  assets.memoryGhost = { mesh: ghost, trail, trailMat, visible: false, timer: 0 };
}

export function buildBillboards(scene, THREE) {
  const texts = ['HALLIDAY.LIB', 'SECTOR MEMORIA', 'ARCHIVO ∞', 'ÍNDICE SECRETO'];
  for (let i = 0; i < 4; i++) {
    const billGeo = new THREE.PlaneGeometry(7, 4.5);
    const billCanvas = document.createElement('canvas');
    billCanvas.width = 320; billCanvas.height = 180;
    const bCtx = billCanvas.getContext('2d');
    bCtx.fillStyle = 'rgba(42,24,16,0.8)';
    bCtx.fillRect(0, 0, 320, 180);
    const bc = ['#4B0082', '#FFD700', '#9D00FF', '#FF6600'][i];
    bCtx.strokeStyle = bc; bCtx.globalAlpha = 0.3; bCtx.lineWidth = 2;
    bCtx.strokeRect(4, 4, 312, 172); bCtx.globalAlpha = 1;
    bCtx.font = 'bold 24px monospace'; bCtx.fillStyle = bc;
    bCtx.shadowColor = bc; bCtx.shadowBlur = 15;
    bCtx.fillText(texts[i], 20, 80); bCtx.shadowBlur = 0;
    const billTex = new THREE.CanvasTexture(billCanvas);
    const billMat = new THREE.MeshBasicMaterial({ map: billTex, transparent: true, side: THREE.DoubleSide, opacity: 0.7 });
    const billboard = new THREE.Mesh(billGeo, billMat);
    billboard.position.set((Math.random()-0.5)*170, 18+Math.random()*20, (Math.random()-0.5)*170);
    billboard.rotation.y = Math.random() * Math.PI;
    scene.add(billboard);
  }
}
