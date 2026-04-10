// ══════════════════════════════════════════════════════
//  AMBIENT BUILDER — NPCs, particles, billboards,
//  ghosts, graffiti, illustrations
// ══════════════════════════════════════════════════════

import { GRAFFITI_TEXTS, NEON_EDGE_COLORS } from '../../../constants/gameConstants';

export function buildParticles(scene, THREE, assets) {
  const count = 2000;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const holoColors = [[0, 0.94, 1], [1.0, 0.38, 0.85], [0.38, 1.0, 0.85], [0.85, 0.38, 1.0], [1.0, 0.73, 0.2]];
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 230;
    positions[i * 3 + 1] = Math.random() * 60;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 230;
    const c = holoColors[Math.floor(Math.random() * holoColors.length)];
    colors[i * 3] = c[0]; colors[i * 3 + 1] = c[1]; colors[i * 3 + 2] = c[2];
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const particleMat = new THREE.PointsMaterial({ size: 0.2, vertexColors: true, transparent: true, opacity: 0.45 });
  assets.particles = new THREE.Points(particleGeo, particleMat);
  scene.add(assets.particles);
}

export function buildNeonLights(scene, THREE, assets) {
  for (let i = 0; i < 15; i++) {
    const color = NEON_EDGE_COLORS[Math.floor(Math.random() * NEON_EDGE_COLORS.length)];
    const light = new THREE.PointLight(color, 1.5 + Math.random() * 2.5, 25 + Math.random() * 20);
    light.position.set((Math.random() - 0.5) * 200, 3 + Math.random() * 20, (Math.random() - 0.5) * 200);
    scene.add(light);
    assets.neonLights.push({ light, baseIntensity: light.intensity, phase: Math.random() * Math.PI * 2 });
  }
}

export function buildGraffiti(scene, THREE, assets, buildings) {
  const count = Math.min(buildings.length, GRAFFITI_TEXTS.length);
  for (let i = 0; i < count; i++) {
    const b = buildings[i];
    const g = GRAFFITI_TEXTS[i];
    const side = Math.random() > 0.5 ? 1 : -1;
    const mesh = createNeonText(g.text,
      b.mesh.position.x + side * (b.width / 2 + 0.1),
      5 + Math.random() * 8,
      b.mesh.position.z, g.color, side > 0 ? -Math.PI / 2 : Math.PI / 2, scene, THREE);
    assets.graffitiMeshes.push(mesh);
  }
}

function createNeonText(text, x, y, z, color, rotY, scene, THREE) {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 512, 128);
  ctx.fillStyle = 'rgba(10,9,8,0.6)';
  ctx.fillRect(0, 20, 512, 80);
  ctx.strokeStyle = color; ctx.globalAlpha = 0.3; ctx.lineWidth = 1;
  ctx.strokeRect(4, 22, 504, 76); ctx.globalAlpha = 1;
  ctx.font = 'bold 32px monospace'; ctx.fillStyle = color;
  ctx.shadowColor = color; ctx.shadowBlur = 20;
  ctx.fillText(text, 16, 68); ctx.shadowBlur = 40; ctx.fillText(text, 16, 68);
  ctx.shadowBlur = 0;
  const texture = new THREE.CanvasTexture(canvas);
  const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide, opacity: 0.85 });
  const geo = new THREE.PlaneGeometry(8, 2);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z); mesh.rotation.y = rotY || 0;
  scene.add(mesh);
  return mesh;
}

export function buildNPCs(scene, THREE, assets) {
  for (let i = 0; i < 5; i++) {
    const npcColor = NEON_EDGE_COLORS[Math.floor(Math.random() * NEON_EDGE_COLORS.length)];
    const npcGeo = new THREE.CylinderGeometry(0.3, 0.3, 2.5, 6);
    const npcMat = new THREE.MeshPhongMaterial({
      color: 0x2A2420, emissive: npcColor, emissiveIntensity: 0.1,
      transparent: true, opacity: 0.4, wireframe: Math.random() > 0.5,
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
  const ghostMat = new THREE.MeshPhongMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, transparent: true, opacity: 0, wireframe: true });
  const ghost = new THREE.Mesh(ghostGeo, ghostMat);
  ghost.position.set(0, 1.75, 0);
  scene.add(ghost);
  const trailGeo = new THREE.BufferGeometry();
  const trailPositions = new Float32Array(30 * 3);
  for (let i = 0; i < 30; i++) {
    trailPositions[i * 3] = (Math.random() - 0.5) * 2;
    trailPositions[i * 3 + 1] = Math.random() * 4;
    trailPositions[i * 3 + 2] = (Math.random() - 0.5) * 2;
  }
  trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
  const trailMat = new THREE.PointsMaterial({ color: 0x00f0ff, size: 0.15, transparent: true, opacity: 0 });
  const trail = new THREE.Points(trailGeo, trailMat);
  scene.add(trail);
  assets.memoryGhost = { mesh: ghost, trail, trailMat, baseX: 0, baseZ: 0, visible: false, timer: 0 };
}

export function buildBillboards(scene, THREE) {
  const texts = ['OASIS v2089', 'SECTOR 7G', 'HALLIDAY.SYS', 'EVA_∞', 'ZONA NEÓN'];
  for (let i = 0; i < 4; i++) {
    const billGeo = new THREE.PlaneGeometry(7, 4.5);
    const billCanvas = document.createElement('canvas');
    billCanvas.width = 320; billCanvas.height = 180;
    const bCtx = billCanvas.getContext('2d');
    bCtx.fillStyle = 'rgba(255,235,225,0.8)';
    bCtx.fillRect(0, 0, 320, 180);
    const borderColor = ['#00F0FF', '#FF61D8', '#61FFD8', '#D861FF', '#FFBB33'][i];
    bCtx.strokeStyle = borderColor; bCtx.globalAlpha = 0.3; bCtx.lineWidth = 2;
    bCtx.strokeRect(4, 4, 312, 172); bCtx.globalAlpha = 1;
    bCtx.font = 'bold 24px monospace'; bCtx.fillStyle = borderColor;
    bCtx.shadowColor = borderColor; bCtx.shadowBlur = 15;
    bCtx.fillText(texts[i], 20, 80); bCtx.shadowBlur = 0;
    const billTex = new THREE.CanvasTexture(billCanvas);
    const billMat = new THREE.MeshBasicMaterial({ map: billTex, transparent: true, side: THREE.DoubleSide, opacity: 0.7 });
    const billboard = new THREE.Mesh(billGeo, billMat);
    billboard.position.set((Math.random() - 0.5) * 170, 18 + Math.random() * 20, (Math.random() - 0.5) * 170);
    billboard.rotation.y = Math.random() * Math.PI;
    scene.add(billboard);
  }
}
