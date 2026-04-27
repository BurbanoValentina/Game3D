// ══════════════════════════════════════════════════════
//  LEVEL 2 GAME ELEMENTS — Puzzles, tokens, parkour, key
//  Biblioteca de Halliday — Themed in indigo/amber
// ══════════════════════════════════════════════════════

import { LEVEL2_PUZZLES, LEVEL2_CHECKPOINTS, LEVEL2_TOKENS, LEVEL2_PARKOUR } from '../../../constants/level2Constants';
import { NEON_EDGE_COLORS } from '../../../constants/gameConstants';

export function buildPuzzleMarkers(scene, THREE, assets) {
  LEVEL2_PUZZLES.forEach((p) => {
    const py = p.position.y || 0;
    const pillarGeo = new THREE.CylinderGeometry(0.5, 0.7, 4, 6);
    const pillarMat = new THREE.MeshPhongMaterial({ color: 0x4B0082, emissive: 0x2A004A, transparent: true, opacity: 0.15, wireframe: true });
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    pillar.position.set(p.position.x, py + 2, p.position.z);
    scene.add(pillar);

    const cubeGeo = new THREE.OctahedronGeometry(1.0);
    const cubeMat = new THREE.MeshPhongMaterial({ color: 0x9D00FF, emissive: 0x4B0082, transparent: true, opacity: 0.85, shininess: 100 });
    const cube = new THREE.Mesh(cubeGeo, cubeMat);
    cube.position.set(p.position.x, py + 5, p.position.z);
    scene.add(cube);

    const ringGeo = new THREE.TorusGeometry(2, 0.06, 8, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x4B0082, transparent: true, opacity: 0.25 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(p.position.x, py + 0.3, p.position.z);
    ring.rotation.x = -Math.PI / 2;
    scene.add(ring);

    const cubeLight = new THREE.PointLight(0x9D00FF, 5, 30);
    cubeLight.position.copy(cube.position);
    scene.add(cubeLight);

    const beamH = 140;
    const beamGeo = new THREE.CylinderGeometry(0.3, 1.5, beamH, 8, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0x4B0082, transparent: true, opacity: 0.06, side: THREE.DoubleSide });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(p.position.x, beamH / 2, p.position.z);
    scene.add(beam);

    const coreGeo = new THREE.CylinderGeometry(0.1, 0.5, beamH, 6, 1, true);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xFFD700, transparent: true, opacity: 0.12, side: THREE.DoubleSide });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.set(p.position.x, beamH / 2, p.position.z);
    scene.add(core);

    assets.lightBeams.push({ beam, core, puzzleId: p.id });
    assets.puzzleMarkers.push({ pillar, cube, ring, light: cubeLight, puzzleId: p.id });
  });
}

export function buildTokenMarkers(scene, THREE, assets) {
  LEVEL2_TOKENS.forEach((token) => {
    const tokenColor = token.type === 'memory' ? 0xFFD700 : 0x9D00FF;
    const tokenGeo = new THREE.OctahedronGeometry(1.2);
    const tokenMat = new THREE.MeshPhongMaterial({ color: tokenColor, emissive: tokenColor, emissiveIntensity: 0.3, transparent: true, opacity: 0.7, shininess: 120 });
    const tokenMesh = new THREE.Mesh(tokenGeo, tokenMat);
    tokenMesh.position.set(token.position.x, 2.5, token.position.z);
    scene.add(tokenMesh);

    const tokenLight = new THREE.PointLight(tokenColor, 2, 15);
    tokenLight.position.set(token.position.x, 3, token.position.z);
    scene.add(tokenLight);

    const circleGeo = new THREE.RingGeometry(1.5, 1.8, 32);
    const circleMat = new THREE.MeshBasicMaterial({ color: tokenColor, transparent: true, opacity: 0.15, side: THREE.DoubleSide });
    const circle = new THREE.Mesh(circleGeo, circleMat);
    circle.rotation.x = -Math.PI / 2;
    circle.position.set(token.position.x, 0.05, token.position.z);
    scene.add(circle);

    assets.tokenMarkers.push({ mesh: tokenMesh, light: tokenLight, circle, tokenId: token.id, type: token.type, collected: false, phase: Math.random() * Math.PI * 2 });
  });
}

export function buildParkourBlocks(scene, THREE, assets) {
  const parkourColors = [0x4B0082, 0x9D00FF, 0xFFD700, 0x8B4513, 0xFF6600, 0xD861FF, 0x61FFD8, 0x00f0ff];
  LEVEL2_PARKOUR.forEach((parkour) => {
    const parkourColor = parkourColors[parkour.puzzleId % parkourColors.length];
    parkour.blocks.forEach((block) => {
      const blockGeo = new THREE.BoxGeometry(block.w, block.h, block.d);
      const hexColor = '#' + parkourColor.toString(16).padStart(6, '0');
      const blockCanvas = document.createElement('canvas');
      blockCanvas.width = 64; blockCanvas.height = 64;
      const bCtx = blockCanvas.getContext('2d');
      bCtx.fillStyle = 'rgba(42,24,16,0.9)';
      bCtx.fillRect(0, 0, 64, 64);
      bCtx.strokeStyle = hexColor; bCtx.globalAlpha = 0.3; bCtx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        bCtx.beginPath(); bCtx.moveTo(i*16,0); bCtx.lineTo(i*16,64); bCtx.stroke();
        bCtx.beginPath(); bCtx.moveTo(0,i*16); bCtx.lineTo(64,i*16); bCtx.stroke();
      }
      bCtx.globalAlpha = 1;
      const blockTex = new THREE.CanvasTexture(blockCanvas);
      const blockMat = new THREE.MeshPhongMaterial({
        map: blockTex, color: 0x2A1810,
        emissive: new THREE.Color(parkourColor).multiplyScalar(0.08),
        transparent: true, opacity: 0.9, shininess: 80,
      });
      const blockMesh = new THREE.Mesh(blockGeo, blockMat);
      blockMesh.position.set(block.x, block.y, block.z);
      scene.add(blockMesh);
      const edges = new THREE.EdgesGeometry(blockGeo);
      blockMesh.add(new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: parkourColor, transparent: true, opacity: 0.5 })));
      assets.parkourBlocks.push({ mesh: blockMesh, x: block.x, y: block.y, z: block.z, w: block.w, h: block.h, d: block.d, baseY: block.y, phase: Math.random() * Math.PI * 2 });
    });
  });
}

export function buildKeyAndCheckpoints(scene, THREE, assets) {
  const keyGeo = new THREE.TorusKnotGeometry(1.2, 0.3, 80, 12);
  assets.keyMat = new THREE.MeshPhongMaterial({ color: 0x4B0082, emissive: 0x9D00FF, transparent: true, opacity: 0, shininess: 100 });
  assets.keyMesh = new THREE.Mesh(keyGeo, assets.keyMat);
  assets.keyMesh.position.set(0, 4, -80);
  scene.add(assets.keyMesh);
  assets.keyLight = new THREE.PointLight(0x4B0082, 0, 35);
  assets.keyLight.position.set(0, 4, -80);
  scene.add(assets.keyLight);

  LEVEL2_CHECKPOINTS.forEach((cp) => {
    const ringGeo = new THREE.RingGeometry(2, 2.3, 6);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xFFD700, transparent: true, opacity: 0.15, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2; ring.position.set(cp.x, 0.05, cp.z);
    scene.add(ring);
    const innerGeo = new THREE.RingGeometry(0.8, 1, 6);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0xFFD700, transparent: true, opacity: 0.08, side: THREE.DoubleSide });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    inner.rotation.x = -Math.PI / 2; inner.position.set(cp.x, 0.06, cp.z);
    scene.add(inner);
    assets.checkpointMeshes.push({ mesh: ring, inner, ...cp, reached: false });
  });
}
