// ══════════════════════════════════════════════════════
//  GAME ELEMENTS — Puzzles, tokens, key, checkpoints,
//  parkour blocks, light beams
// ══════════════════════════════════════════════════════

import { LEVEL1_PUZZLES, LEVEL1_CHECKPOINTS, LEVEL1_TOKENS, LEVEL1_PARKOUR, NEON_EDGE_COLORS, WORLD_HALF } from '../../../constants/gameConstants';

const clampToWorld = (v) => Math.max(-WORLD_HALF + 10, Math.min(WORLD_HALF - 10, v));

export function buildPuzzleMarkers(scene, THREE, assets) {
  LEVEL1_PUZZLES.forEach((p) => {
    const px = clampToWorld(p.position.x);
    const pz = clampToWorld(p.position.z);
    const py = p.position.y || 0;
    const pillarGeo = new THREE.CylinderGeometry(0.5, 0.7, 4, 6);
    const pillarMat = new THREE.MeshPhongMaterial({ color: 0x00f0ff, emissive: 0x005566, transparent: true, opacity: 0.15, wireframe: true });
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    pillar.position.set(px, py + 2, pz);
    scene.add(pillar);

    const cubeGeo = new THREE.OctahedronGeometry(1.0);
    const cubeMat = new THREE.MeshPhongMaterial({ color: 0xffaa00, emissive: 0xff6600, transparent: true, opacity: 0.85, shininess: 100 });
    const cube = new THREE.Mesh(cubeGeo, cubeMat);
    cube.position.set(px, py + 5, pz);
    scene.add(cube);

    const ringGeo = new THREE.TorusGeometry(2, 0.06, 8, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.25 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(px, py + 0.3, pz);
    ring.rotation.x = -Math.PI / 2;
    scene.add(ring);

    const cubeLight = new THREE.PointLight(0xffaa00, 5, 30);
    cubeLight.position.copy(cube.position);
    scene.add(cubeLight);

    // Light beam
    const beamH = 140;
    const beamGeo = new THREE.CylinderGeometry(0.3, 1.5, beamH, 8, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.06, side: THREE.DoubleSide });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(px, beamH / 2, pz);
    scene.add(beam);

    const coreGeo = new THREE.CylinderGeometry(0.1, 0.5, beamH, 6, 1, true);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffbb33, transparent: true, opacity: 0.12, side: THREE.DoubleSide });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.set(px, beamH / 2, pz);
    scene.add(core);

    assets.lightBeams.push({ beam, core, puzzleId: p.id });
    assets.puzzleMarkers.push({ pillar, cube, ring, light: cubeLight, puzzleId: p.id });
  });
}

export function buildTokenMarkers(scene, THREE, assets) {
  LEVEL1_TOKENS.forEach((token) => {
    const tx = clampToWorld(token.position.x);
    const tz = clampToWorld(token.position.z);
    const tokenColor = 0xffbb33;
    const tokenGeo = new THREE.OctahedronGeometry(1.2);
    const tokenMat = new THREE.MeshPhongMaterial({ color: tokenColor, emissive: 0xaa7700, transparent: true, opacity: 0.7, shininess: 120 });
    const tokenMesh = new THREE.Mesh(tokenGeo, tokenMat);
    tokenMesh.position.set(tx, 2.5, tz);
    scene.add(tokenMesh);

    const tokenLight = new THREE.PointLight(tokenColor, 2, 15);
    tokenLight.position.set(tx, 3, tz);
    scene.add(tokenLight);

    const circleGeo = new THREE.RingGeometry(1.5, 1.8, 32);
    const circleMat = new THREE.MeshBasicMaterial({ color: tokenColor, transparent: true, opacity: 0.15, side: THREE.DoubleSide });
    const circle = new THREE.Mesh(circleGeo, circleMat);
    circle.rotation.x = -Math.PI / 2;
    circle.position.set(tx, 0.05, tz);
    scene.add(circle);

    assets.tokenMarkers.push({ mesh: tokenMesh, light: tokenLight, circle, tokenId: token.id, type: token.type, collected: false, phase: Math.random() * Math.PI * 2 });
  });
}

export function buildParkourBlocks(scene, THREE, assets) {
  LEVEL1_PARKOUR.forEach((parkour) => {
    const parkourColor = NEON_EDGE_COLORS[parkour.puzzleId % NEON_EDGE_COLORS.length];
    parkour.blocks.forEach((block) => {
      const blockGeo = new THREE.BoxGeometry(block.w, block.h, block.d);
      const hexColor = '#' + parkourColor.toString(16).padStart(6, '0');
      const blockCanvas = document.createElement('canvas');
      blockCanvas.width = 64; blockCanvas.height = 64;
      const bCtx = blockCanvas.getContext('2d');
      bCtx.fillStyle = 'rgba(20,15,30,0.9)';
      bCtx.fillRect(0, 0, 64, 64);
      bCtx.strokeStyle = hexColor; bCtx.globalAlpha = 0.3; bCtx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        bCtx.beginPath(); bCtx.moveTo(i*16,0); bCtx.lineTo(i*16,64); bCtx.stroke();
        bCtx.beginPath(); bCtx.moveTo(0,i*16); bCtx.lineTo(64,i*16); bCtx.stroke();
      }
      bCtx.globalAlpha = 0.5; bCtx.fillStyle = hexColor;
      for (let gx = 0; gx <= 4; gx++) for (let gy = 0; gy <= 4; gy++) {
        bCtx.beginPath(); bCtx.arc(gx*16, gy*16, 2, 0, Math.PI*2); bCtx.fill();
      }
      bCtx.globalAlpha = 1;
      const blockTex = new THREE.CanvasTexture(blockCanvas);
      const blockMat = new THREE.MeshPhongMaterial({
        map: blockTex, color: 0x1a1625,
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
  // Key — position updated for smaller world
  const keyGeo = new THREE.TorusKnotGeometry(1.2, 0.3, 80, 12);
  assets.keyMat = new THREE.MeshPhongMaterial({ color: 0xffbb33, emissive: 0xff8800, transparent: true, opacity: 0, shininess: 100 });
  assets.keyMesh = new THREE.Mesh(keyGeo, assets.keyMat);
  assets.keyMesh.position.set(clampToWorld(0), 4, clampToWorld(-75));
  scene.add(assets.keyMesh);
  assets.keyLight = new THREE.PointLight(0xffbb33, 0, 35);
  assets.keyLight.position.set(clampToWorld(0), 4, clampToWorld(-75));
  scene.add(assets.keyLight);

  // Checkpoints
  LEVEL1_CHECKPOINTS.forEach((cp) => {
    const cx = clampToWorld(cp.x);
    const cz = clampToWorld(cp.z);
    const ringGeo = new THREE.RingGeometry(2, 2.3, 6);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.15, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2; ring.position.set(cx, 0.05, cz);
    scene.add(ring);
    const innerGeo = new THREE.RingGeometry(0.8, 1, 6);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.08, side: THREE.DoubleSide });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    inner.rotation.x = -Math.PI / 2; inner.position.set(cx, 0.06, cz);
    scene.add(inner);
    assets.checkpointMeshes.push({ mesh: ring, inner, ...cp, x: cx, z: cz, reached: false });
  });
}
