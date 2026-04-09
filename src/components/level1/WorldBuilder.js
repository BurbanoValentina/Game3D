// ══════════════════════════════════════════════════════
//  WORLD BUILDER — SPACE STATION + FUTURISTIC CITY
//  Light beams, parkour, tokens, SVG illustrations
// ══════════════════════════════════════════════════════

import { LEVEL1_PUZZLES, LEVEL1_CHECKPOINTS, LEVEL1_TOKENS, LEVEL1_PARKOUR, GRAFFITI_TEXTS, NEON_EDGE_COLORS } from '../../constants/gameConstants';

// ── SVG Image Generator (Canvas-based illustrations) ──
function createSVGIllustration(type, THREE) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, 512, 512);

  if (type === 'girls_together') {
    // Three girls standing together, futuristic anime style
    ctx.fillStyle = 'rgba(255,240,235,0.9)';
    ctx.fillRect(0, 0, 512, 512);
    // Background glow
    const grd = ctx.createRadialGradient(256, 300, 50, 256, 300, 250);
    grd.addColorStop(0, 'rgba(0,240,255,0.15)');
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 512, 512);
    // Girl 1 (Eva - cyan)
    drawFuturisticGirl(ctx, 160, 180, '#00F0FF', '#0088AA', 'E');
    // Girl 2 (Suyin - green)
    drawFuturisticGirl(ctx, 256, 170, '#00FF88', '#00AA55', 'S');
    // Girl 3 (Zuri - pink)
    drawFuturisticGirl(ctx, 352, 180, '#FF0066', '#AA0044', 'Z');
    // Connecting lines between them
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(190, 250); ctx.lineTo(326, 250); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(230, 240); ctx.lineTo(282, 240); ctx.stroke();
    // Title
    ctx.font = 'bold 18px monospace';
    ctx.fillStyle = '#00F0FF';
    ctx.shadowColor = '#00F0FF';
    ctx.shadowBlur = 10;
    ctx.textAlign = 'center';
    ctx.fillText('JUNTAS', 256, 460);
    ctx.shadowBlur = 0;
    ctx.font = '10px monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillText('// memory_fragment_001', 256, 485);
  }
  else if (type === 'girls_fighting') {
    ctx.fillStyle = 'rgba(255,235,225,0.9)';
    ctx.fillRect(0, 0, 512, 512);
    // Red tension glow
    const grd = ctx.createRadialGradient(256, 256, 30, 256, 256, 250);
    grd.addColorStop(0, 'rgba(255,0,102,0.2)');
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 512, 512);
    // Girl 1 facing right
    drawFuturisticGirl(ctx, 140, 180, '#00F0FF', '#005577', 'E');
    // Girl 3 facing left
    drawFuturisticGirl(ctx, 372, 180, '#FF0066', '#770022', 'Z');
    // Lightning/conflict between them
    ctx.strokeStyle = '#FF0066';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#FF0066';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.moveTo(210, 230); ctx.lineTo(240, 250); ctx.lineTo(220, 270);
    ctx.lineTo(260, 290); ctx.lineTo(240, 310); ctx.lineTo(280, 330);
    ctx.stroke();
    ctx.strokeStyle = '#00F0FF';
    ctx.beginPath();
    ctx.moveTo(302, 230); ctx.lineTo(272, 250); ctx.lineTo(292, 270);
    ctx.lineTo(252, 290); ctx.lineTo(272, 310); ctx.lineTo(232, 330);
    ctx.stroke();
    ctx.shadowBlur = 0;
    // Broken heart in center
    ctx.fillStyle = 'rgba(255,0,102,0.5)';
    ctx.font = '40px serif';
    ctx.textAlign = 'center';
    ctx.fillText('💔', 256, 270);
    // Title
    ctx.font = 'bold 18px monospace';
    ctx.fillStyle = '#FF0066';
    ctx.shadowColor = '#FF0066';
    ctx.shadowBlur = 10;
    ctx.fillText('LA PELEA', 256, 460);
    ctx.shadowBlur = 0;
  }
  else if (type === 'eva_grandpa') {
    ctx.fillStyle = 'rgba(255,245,240,0.9)';
    ctx.fillRect(0, 0, 512, 512);
    // Warm golden glow
    const grd = ctx.createRadialGradient(256, 280, 50, 256, 280, 220);
    grd.addColorStop(0, 'rgba(255,187,51,0.15)');
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 512, 512);
    // Eva (smaller, young)
    drawFuturisticGirl(ctx, 200, 200, '#00F0FF', '#005577', 'E', 0.8);
    // Grandpa (taller, wise)
    drawGrandpa(ctx, 312, 160);
    // Computer screen between them
    ctx.fillStyle = 'rgba(0,240,255,0.1)';
    ctx.strokeStyle = '#FFBB33';
    ctx.lineWidth = 1;
    ctx.fillRect(230, 340, 52, 35);
    ctx.strokeRect(230, 340, 52, 35);
    // Code on screen
    ctx.font = '6px monospace';
    ctx.fillStyle = '#00FF88';
    ctx.textAlign = 'left';
    ctx.fillText('print("hola")', 234, 355);
    ctx.fillText('# mi primer', 234, 363);
    ctx.fillText('# programa', 234, 371);
    // Title
    ctx.textAlign = 'center';
    ctx.font = 'bold 18px monospace';
    ctx.fillStyle = '#FFBB33';
    ctx.shadowColor = '#FFBB33';
    ctx.shadowBlur = 10;
    ctx.fillText('EL ABUELO', 256, 460);
    ctx.shadowBlur = 0;
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function drawFuturisticGirl(ctx, x, y, color, darkColor, letter, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  // Head (circle)
  ctx.beginPath();
  ctx.arc(0, 0, 28, 0, Math.PI * 2);
  ctx.fillStyle = darkColor;
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
  // Hair flowing
  ctx.beginPath();
  ctx.moveTo(-28, -5);
  ctx.quadraticCurveTo(-40, 30, -25, 70);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(28, -5);
  ctx.quadraticCurveTo(40, 30, 25, 70);
  ctx.stroke();
  // Eyes (neon dots)
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(-10, -3, 4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(10, -3, 4, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  // Mouth
  ctx.beginPath();
  ctx.arc(0, 10, 6, 0, Math.PI);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // Body (geometric suit)
  ctx.beginPath();
  ctx.moveTo(-20, 35);
  ctx.lineTo(-25, 120);
  ctx.lineTo(25, 120);
  ctx.lineTo(20, 35);
  ctx.closePath();
  ctx.fillStyle = darkColor;
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // Suit detail lines
  ctx.beginPath();
  ctx.moveTo(0, 40);
  ctx.lineTo(0, 115);
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.5;
  ctx.globalAlpha = 0.5;
  ctx.stroke();
  ctx.globalAlpha = 1;
  // Arms
  ctx.beginPath();
  ctx.moveTo(-20, 45);
  ctx.lineTo(-35, 90);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(20, 45);
  ctx.lineTo(35, 90);
  ctx.stroke();
  // Legs
  ctx.beginPath();
  ctx.moveTo(-10, 120);
  ctx.lineTo(-15, 180);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(10, 120);
  ctx.lineTo(15, 180);
  ctx.stroke();
  // Letter badge
  ctx.font = 'bold 14px monospace';
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.fillText(letter, 0, 80);
  ctx.restore();
}

function drawGrandpa(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);
  // Head
  ctx.beginPath();
  ctx.arc(0, 0, 32, 0, Math.PI * 2);
  ctx.fillStyle = '#554433';
  ctx.fill();
  ctx.strokeStyle = '#FFBB33';
  ctx.lineWidth = 2;
  ctx.stroke();
  // Glasses
  ctx.strokeStyle = '#FFBB33';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-18, -8, 14, 12);
  ctx.strokeRect(4, -8, 14, 12);
  ctx.beginPath(); ctx.moveTo(-4, -2); ctx.lineTo(4, -2); ctx.stroke();
  // Eyes behind glasses
  ctx.fillStyle = '#FFBB33';
  ctx.beginPath(); ctx.arc(-11, -2, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(11, -2, 2.5, 0, Math.PI * 2); ctx.fill();
  // Smile
  ctx.beginPath();
  ctx.arc(0, 10, 8, 0.1, Math.PI - 0.1);
  ctx.strokeStyle = '#FFBB33';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // Beard
  ctx.beginPath();
  ctx.moveTo(-20, 15);
  ctx.quadraticCurveTo(-15, 45, 0, 50);
  ctx.quadraticCurveTo(15, 45, 20, 15);
  ctx.fillStyle = 'rgba(200,180,150,0.3)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,187,51,0.4)';
  ctx.lineWidth = 1;
  ctx.stroke();
  // Body (lab coat style)
  ctx.beginPath();
  ctx.moveTo(-25, 40);
  ctx.lineTo(-30, 160);
  ctx.lineTo(30, 160);
  ctx.lineTo(25, 40);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fill();
  ctx.strokeStyle = '#FFBB33';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // Coat line
  ctx.beginPath();
  ctx.moveTo(0, 45);
  ctx.lineTo(0, 155);
  ctx.strokeStyle = 'rgba(255,187,51,0.3)';
  ctx.lineWidth = 0.5;
  ctx.stroke();
  // Arms
  ctx.strokeStyle = '#FFBB33';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-25, 50); ctx.lineTo(-40, 110); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(25, 50); ctx.lineTo(40, 110); ctx.stroke();
  // Legs
  ctx.beginPath(); ctx.moveTo(-12, 160); ctx.lineTo(-15, 220); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(12, 160); ctx.lineTo(15, 220); ctx.stroke();
  ctx.restore();
}

// ── Neon Text Creator ──
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
  ctx.font = '10px monospace'; ctx.fillStyle = color; ctx.globalAlpha = 0.3;
  ctx.fillText('// MEMORIAL_DATA', 16, 36); ctx.globalAlpha = 1;
  const texture = new THREE.CanvasTexture(canvas);
  const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide, opacity: 0.85 });
  const geo = new THREE.PlaneGeometry(8, 2);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z); mesh.rotation.y = rotY || 0;
  scene.add(mesh);
  return mesh;
}

/**
 * Creates all world assets for Level 1
 */
export function createWorldAssets(scene, THREE, buildings) {
  const assets = {
    neonLights: [], puzzleMarkers: [], checkpointMeshes: [],
    npcs: [], particles: null, graffitiMeshes: [],
    suyinGhost: null, zuriGhost: null,
    keyMesh: null, keyLight: null, keyMat: null,
    parkourBlocks: [], tokenMarkers: [],
    lightBeams: [], illustrations: {},
  };

  // ═══════════════════════════════════════
  //  BRIGHT ROSE/CREAM SKY (Futuristic Sunset)
  // ═══════════════════════════════════════
  const skyGeo = new THREE.BoxGeometry(500, 500, 500);
  const skyCanvas = document.createElement('canvas');
  skyCanvas.width = 1024; skyCanvas.height = 512;
  const skyCtx = skyCanvas.getContext('2d');

  // Rose/cream gradient sky
  const skyGrad = skyCtx.createLinearGradient(0, 0, 0, 512);
  skyGrad.addColorStop(0, '#FFD4C8');    // warm peach top
  skyGrad.addColorStop(0.15, '#FFDDD4'); // rose
  skyGrad.addColorStop(0.3, '#FFE8E1');  // rose-pale
  skyGrad.addColorStop(0.5, '#FFF0EB');  // cream rose
  skyGrad.addColorStop(0.7, '#FFF5F0');  // cream
  skyGrad.addColorStop(0.85, '#FDDDD4'); // rose mid
  skyGrad.addColorStop(1, '#F8C8BC');    // rose blush (horizon)
  skyCtx.fillStyle = skyGrad;
  skyCtx.fillRect(0, 0, 1024, 512);

  // Soft cloud formations
  for (let c = 0; c < 18; c++) {
    const cx = Math.random() * 512;
    const cy = 40 + Math.random() * 250;
    const cw = 100 + Math.random() * 200;
    const ch = 20 + Math.random() * 50;
    const cloudGrad = skyCtx.createRadialGradient(cx, cy, 0, cx, cy, cw * 0.5);
    cloudGrad.addColorStop(0, 'rgba(255,255,255,0.35)');
    cloudGrad.addColorStop(0.3, 'rgba(255,240,235,0.25)');
    cloudGrad.addColorStop(0.6, 'rgba(255,220,210,0.12)');
    cloudGrad.addColorStop(1, 'rgba(255,210,200,0)');
    skyCtx.fillStyle = cloudGrad;
    skyCtx.beginPath();
    skyCtx.ellipse(cx, cy, cw * 0.5, ch * 0.5, 0, 0, Math.PI * 2);
    skyCtx.fill();
  }

  // Sun glow (warm golden-pink)
  const sunX = 200, sunY = 90;
  const sunGrad = skyCtx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 200);
  sunGrad.addColorStop(0, 'rgba(255,240,200,0.9)');
  sunGrad.addColorStop(0.1, 'rgba(255,220,180,0.6)');
  sunGrad.addColorStop(0.3, 'rgba(255,180,140,0.25)');
  sunGrad.addColorStop(0.6, 'rgba(255,150,120,0.08)');
  sunGrad.addColorStop(1, 'rgba(255,130,100,0)');
  skyCtx.fillStyle = sunGrad;
  skyCtx.fillRect(0, 0, 1024, 512);
  // Sun disc
  skyCtx.beginPath();
  skyCtx.arc(sunX, sunY, 30, 0, Math.PI * 2);
  skyCtx.fillStyle = 'rgba(255,250,230,0.95)';
  skyCtx.fill();

  // Soft pink light streaks near horizon
  for (let s = 0; s < 8; s++) {
    const sx = Math.random() * 512;
    const sy = 350 + Math.random() * 100;
    skyCtx.globalAlpha = 0.08 + Math.random() * 0.06;
    skyCtx.fillStyle = s % 2 === 0 ? '#FF9988' : '#FFBBAA';
    skyCtx.fillRect(sx, sy, 200 + Math.random() * 300, 2 + Math.random() * 4);
  }
  skyCtx.globalAlpha = 1;

  // Distant geometric structures (futuristic horizon)
  skyCtx.globalAlpha = 0.06;
  for (let t = 0; t < 12; t++) {
    const tx = 50 + t * 80;
    const th = 30 + Math.random() * 80;
    const tw = 8 + Math.random() * 20;
    skyCtx.fillStyle = '#AA7766';
    skyCtx.fillRect(tx, 425 - th, tw, th);
  }
  skyCtx.globalAlpha = 1;

  const skyTexture = new THREE.CanvasTexture(skyCanvas);
  const skyMat = new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.BackSide });
  const sky = new THREE.Mesh(skyGeo, skyMat);
  scene.add(sky);

  // ═══════════════════════════════════════
  //  NEON POINT LIGHTS
  // ═══════════════════════════════════════
  for (let i = 0; i < 20; i++) {
    const color = NEON_EDGE_COLORS[Math.floor(Math.random() * NEON_EDGE_COLORS.length)];
    const light = new THREE.PointLight(color, 1.5 + Math.random() * 2.5, 30 + Math.random() * 25);
    light.position.set((Math.random() - 0.5) * 300, 3 + Math.random() * 25, (Math.random() - 0.5) * 300);
    scene.add(light);
    assets.neonLights.push({ light, baseIntensity: light.intensity, phase: Math.random() * Math.PI * 2 });
  }

  // ═══════════════════════════════════════
  //  GRAFFITI
  // ═══════════════════════════════════════
  buildings.slice(0, 14).forEach((b, i) => {
    const g = GRAFFITI_TEXTS[i % GRAFFITI_TEXTS.length];
    const side = Math.random() > 0.5 ? 1 : -1;
    const mesh = createNeonText(g.text, b.mesh.position.x + side * (b.width / 2 + 0.1), 5 + Math.random() * 10, b.mesh.position.z, g.color, side > 0 ? -Math.PI / 2 : Math.PI / 2, scene, THREE);
    assets.graffitiMeshes.push(mesh);
  });

  // ═══════════════════════════════════════
  //  FLOATING PARTICLES
  // ═══════════════════════════════════════
  const particleCount = 3000;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 350;
    positions[i * 3 + 1] = Math.random() * 80;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 350;
    const holoColors = [[0, 0.94, 1], [1.0, 0.38, 0.85], [0.38, 1.0, 0.85], [0.85, 0.38, 1.0], [1.0, 0.73, 0.2]];
    const c = holoColors[Math.floor(Math.random() * holoColors.length)];
    colors[i * 3] = c[0]; colors[i * 3 + 1] = c[1]; colors[i * 3 + 2] = c[2];
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const particleMat = new THREE.PointsMaterial({ size: 0.2, vertexColors: true, transparent: true, opacity: 0.45 });
  assets.particles = new THREE.Points(particleGeo, particleMat);
  scene.add(assets.particles);

  // ═══════════════════════════════════════
  //  PUZZLE ZONES with LIGHT BEAMS (positioned at parkour top y=18)
  // ═══════════════════════════════════════
  LEVEL1_PUZZLES.forEach((p) => {
    const py = p.position.y || 0; // puzzle height (18 for parkour-top puzzles)

    // Terminal pillar
    const pillarGeo = new THREE.CylinderGeometry(0.5, 0.7, 4, 6);
    const pillarMat = new THREE.MeshPhongMaterial({ color: 0x00f0ff, emissive: 0x005566, transparent: true, opacity: 0.15, wireframe: true });
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    pillar.position.set(p.position.x, py + 2, p.position.z);
    scene.add(pillar);

    // Floating data crystal (above pillar)
    const cubeGeo = new THREE.OctahedronGeometry(1.0);
    const cubeMat = new THREE.MeshPhongMaterial({ color: 0xffaa00, emissive: 0xff6600, transparent: true, opacity: 0.85, shininess: 100 });
    const cube = new THREE.Mesh(cubeGeo, cubeMat);
    cube.position.set(p.position.x, py + 5, p.position.z);
    scene.add(cube);

    // Holographic ring on platform
    const ringGeo = new THREE.TorusGeometry(2, 0.06, 8, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.25 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(p.position.x, py + 0.3, p.position.z);
    ring.rotation.x = -Math.PI / 2;
    scene.add(ring);

    const cubeLight = new THREE.PointLight(0xffaa00, 5, 30);
    cubeLight.position.copy(cube.position);
    scene.add(cubeLight);

    // ★ LIGHT BEAM — from ground to sky (always visible for navigation)
    const beamHeight = 180;
    const beamGeo = new THREE.CylinderGeometry(0.3, 1.5, beamHeight, 8, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.06,
      side: THREE.DoubleSide,
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(p.position.x, beamHeight / 2, p.position.z);
    scene.add(beam);

    // Inner bright core beam
    const coreGeo = new THREE.CylinderGeometry(0.1, 0.5, beamHeight, 6, 1, true);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffbb33, transparent: true, opacity: 0.12, side: THREE.DoubleSide });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.set(p.position.x, beamHeight / 2, p.position.z);
    scene.add(core);

    assets.lightBeams.push({ beam, core, puzzleId: p.id });
    assets.puzzleMarkers.push({ pillar, cube, ring, light: cubeLight, puzzleId: p.id });
  });

  // ═══════════════════════════════════════
  //  PARKOUR BLOCKS (Minecraft-style floating)
  // ═══════════════════════════════════════
  LEVEL1_PARKOUR.forEach((parkour) => {
    const parkourColor = NEON_EDGE_COLORS[parkour.puzzleId % NEON_EDGE_COLORS.length];
    parkour.blocks.forEach((block) => {
      const blockGeo = new THREE.BoxGeometry(block.w, block.h, block.d);
      // Minecraft-like material with grid pattern
      const blockCanvas = document.createElement('canvas');
      blockCanvas.width = 64; blockCanvas.height = 64;
      const bCtx = blockCanvas.getContext('2d');
      // Base color
      const hexColor = '#' + parkourColor.toString(16).padStart(6, '0');
      bCtx.fillStyle = 'rgba(20,15,30,0.9)';
      bCtx.fillRect(0, 0, 64, 64);
      // Grid pattern (minecraft-like)
      bCtx.strokeStyle = hexColor;
      bCtx.globalAlpha = 0.3;
      bCtx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        bCtx.beginPath(); bCtx.moveTo(i * 16, 0); bCtx.lineTo(i * 16, 64); bCtx.stroke();
        bCtx.beginPath(); bCtx.moveTo(0, i * 16); bCtx.lineTo(64, i * 16); bCtx.stroke();
      }
      bCtx.globalAlpha = 1;
      // Glow dots at intersections
      bCtx.fillStyle = hexColor;
      for (let gx = 0; gx <= 4; gx++) {
        for (let gy = 0; gy <= 4; gy++) {
          bCtx.globalAlpha = 0.5;
          bCtx.beginPath();
          bCtx.arc(gx * 16, gy * 16, 2, 0, Math.PI * 2);
          bCtx.fill();
        }
      }
      bCtx.globalAlpha = 1;

      const blockTex = new THREE.CanvasTexture(blockCanvas);
      blockTex.wrapS = THREE.RepeatWrapping;
      blockTex.wrapT = THREE.RepeatWrapping;

      const blockMat = new THREE.MeshPhongMaterial({
        map: blockTex,
        color: 0x1a1625,
        emissive: new THREE.Color(parkourColor).multiplyScalar(0.08),
        transparent: true,
        opacity: 0.9,
        shininess: 80,
      });
      const blockMesh = new THREE.Mesh(blockGeo, blockMat);
      blockMesh.position.set(block.x, block.y, block.z);
      scene.add(blockMesh);

      // Neon edges
      const edges = new THREE.EdgesGeometry(blockGeo);
      const edgeMat = new THREE.LineBasicMaterial({ color: parkourColor, transparent: true, opacity: 0.5 });
      const wire = new THREE.LineSegments(edges, edgeMat);
      blockMesh.add(wire);

      assets.parkourBlocks.push({
        mesh: blockMesh,
        x: block.x, y: block.y, z: block.z,
        w: block.w, h: block.h, d: block.d,
        baseY: block.y,
        phase: Math.random() * Math.PI * 2,
      });
    });
  });

  // ═══════════════════════════════════════
  //  TOKEN MARKERS (Collectible floating tokens)
  // ═══════════════════════════════════════
  LEVEL1_TOKENS.forEach((token) => {
    // ALL tokens are yellow — green when collected (handled in GameLoop)
    const tokenColor = 0xffbb33;

    // Floating diamond shape
    const tokenGeo = new THREE.OctahedronGeometry(1.2);
    const tokenMat = new THREE.MeshPhongMaterial({
      color: tokenColor,
      emissive: 0xaa7700,
      transparent: true,
      opacity: 0.7,
      shininess: 120,
    });
    const tokenMesh = new THREE.Mesh(tokenGeo, tokenMat);
    tokenMesh.position.set(token.position.x, 2.5, token.position.z);
    scene.add(tokenMesh);

    // Glow light
    const tokenLight = new THREE.PointLight(tokenColor, 2, 15);
    tokenLight.position.set(token.position.x, 3, token.position.z);
    scene.add(tokenLight);

    // Ground circle indicator
    const circleGeo = new THREE.RingGeometry(1.5, 1.8, 32);
    const circleMat = new THREE.MeshBasicMaterial({
      color: tokenColor, transparent: true, opacity: 0.15, side: THREE.DoubleSide,
    });
    const circle = new THREE.Mesh(circleGeo, circleMat);
    circle.rotation.x = -Math.PI / 2;
    circle.position.set(token.position.x, 0.05, token.position.z);
    scene.add(circle);

    assets.tokenMarkers.push({
      mesh: tokenMesh, light: tokenLight, circle,
      tokenId: token.id, type: token.type,
      collected: false, phase: Math.random() * Math.PI * 2,
    });
  });

  // ═══════════════════════════════════════
  //  KEY (Llave Ámbar)
  // ═══════════════════════════════════════
  const keyGeo = new THREE.TorusKnotGeometry(1.2, 0.3, 80, 12);
  assets.keyMat = new THREE.MeshPhongMaterial({ color: 0xffbb33, emissive: 0xff8800, transparent: true, opacity: 0, shininess: 100 });
  assets.keyMesh = new THREE.Mesh(keyGeo, assets.keyMat);
  assets.keyMesh.position.set(0, 4, -140);
  scene.add(assets.keyMesh);
  assets.keyLight = new THREE.PointLight(0xffbb33, 0, 35);
  assets.keyLight.position.set(0, 4, -140);
  scene.add(assets.keyLight);

  // ═══════════════════════════════════════
  //  CHECKPOINTS
  // ═══════════════════════════════════════
  LEVEL1_CHECKPOINTS.forEach((cp) => {
    const ringGeo = new THREE.RingGeometry(2, 2.3, 6);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.15, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(cp.x, 0.05, cp.z);
    scene.add(ring);
    const innerGeo = new THREE.RingGeometry(0.8, 1, 6);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.08, side: THREE.DoubleSide });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    inner.rotation.x = -Math.PI / 2;
    inner.position.set(cp.x, 0.06, cp.z);
    scene.add(inner);
    assets.checkpointMeshes.push({ mesh: ring, inner, ...cp, reached: false });
  });

  // ═══════════════════════════════════════
  //  GHOST SILHOUETTES
  // ═══════════════════════════════════════
  const createGhost = (color, startX, startZ) => {
    const ghostGeo = new THREE.CylinderGeometry(0.4, 0.6, 3.5, 6);
    const ghostMat = new THREE.MeshPhongMaterial({ color, emissive: color, transparent: true, opacity: 0, wireframe: true });
    const ghost = new THREE.Mesh(ghostGeo, ghostMat);
    ghost.position.set(startX, 1.75, startZ);
    scene.add(ghost);
    const trailGeo = new THREE.BufferGeometry();
    const trailPositions = new Float32Array(30 * 3);
    for (let i = 0; i < 30; i++) {
      trailPositions[i * 3] = startX + (Math.random() - 0.5) * 2;
      trailPositions[i * 3 + 1] = Math.random() * 4;
      trailPositions[i * 3 + 2] = startZ + (Math.random() - 0.5) * 2;
    }
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    const trailMat = new THREE.PointsMaterial({ color, size: 0.15, transparent: true, opacity: 0 });
    const trail = new THREE.Points(trailGeo, trailMat);
    scene.add(trail);
    return { mesh: ghost, trail, trailMat, baseX: startX, baseZ: startZ, visible: false, timer: 0 };
  };
  assets.suyinGhost = createGhost(0x00f0ff, 30, -20);
  assets.zuriGhost = createGhost(0xff0066, -30, 20);

  // ═══════════════════════════════════════
  //  NPCs
  // ═══════════════════════════════════════
  for (let i = 0; i < 6; i++) {
    const npcColor = NEON_EDGE_COLORS[Math.floor(Math.random() * NEON_EDGE_COLORS.length)];
    const npcGeo = new THREE.CylinderGeometry(0.3, 0.3, 2.5, 6);
    const npcMat = new THREE.MeshPhongMaterial({ color: 0x2A2420, emissive: npcColor, emissiveIntensity: 0.1, transparent: true, opacity: 0.4, wireframe: Math.random() > 0.5 });
    const npc = new THREE.Mesh(npcGeo, npcMat);
    const npcX = (Math.random() - 0.5) * 150;
    const npcZ = (Math.random() - 0.5) * 150;
    npc.position.set(npcX, 1.25, npcZ);
    scene.add(npc);
    assets.npcs.push({ mesh: npc, baseX: npcX, baseZ: npcZ, loopPhase: Math.random() * Math.PI * 2 });
  }

  // ═══════════════════════════════════════
  //  HOLOGRAPHIC BILLBOARDS
  // ═══════════════════════════════════════
  for (let i = 0; i < 5; i++) {
    const billGeo = new THREE.PlaneGeometry(7, 4.5);
    const billCanvas = document.createElement('canvas');
    billCanvas.width = 320; billCanvas.height = 180;
    const bCtx = billCanvas.getContext('2d');
    bCtx.fillStyle = 'rgba(255,235,225,0.8)';
    bCtx.fillRect(0, 0, 320, 180);
    const borderColor = ['#00F0FF', '#FF61D8', '#61FFD8', '#D861FF', '#FFBB33', '#00FF88', '#FF0066', '#9D00FF', '#FF6600', '#00AAFF'][i];
    bCtx.strokeStyle = borderColor; bCtx.globalAlpha = 0.3; bCtx.lineWidth = 2;
    bCtx.strokeRect(4, 4, 312, 172); bCtx.globalAlpha = 1;
    bCtx.font = 'bold 24px monospace'; bCtx.fillStyle = borderColor;
    bCtx.shadowColor = borderColor; bCtx.shadowBlur = 15;
    const billTexts = ['OASIS v2089', 'SECTOR 7G', 'HALLIDAY.SYS', 'IOI // DANGER', 'EVA_∞', 'ZONA ROJA', 'CORRUPTED', 'FIND KEYS', 'PARKOUR_ON', 'SPACE_DOCK'];
    bCtx.fillText(billTexts[i], 20, 80);
    bCtx.font = '10px monospace'; bCtx.fillStyle = borderColor; bCtx.globalAlpha = 0.3;
    bCtx.fillText('// SYSTEM_BROADCAST', 20, 40); bCtx.globalAlpha = 1;
    const billTex = new THREE.CanvasTexture(billCanvas);
    const billMat = new THREE.MeshBasicMaterial({ map: billTex, transparent: true, side: THREE.DoubleSide, opacity: 0.7 });
    const billboard = new THREE.Mesh(billGeo, billMat);
    const bx = (Math.random() - 0.5) * 250;
    const bz = (Math.random() - 0.5) * 250;
    billboard.position.set(bx, 18 + Math.random() * 30, bz);
    billboard.rotation.y = Math.random() * Math.PI;
    scene.add(billboard);
  }

  // ═══════════════════════════════════════
  //  CITY GROUND — Streets, Trees, Rocks, Furniture
  // ═══════════════════════════════════════

  // ── MAIN STREETS (cross-shaped roads) ──
  const streetMat = new THREE.MeshPhongMaterial({ color: 0x333338, emissive: 0x111115, shininess: 20 });
  const streetW = 8;
  // North-South main road
  const nsStreet = new THREE.Mesh(new THREE.BoxGeometry(streetW, 0.15, 400), streetMat);
  nsStreet.position.set(0, 0.08, 0);
  scene.add(nsStreet);
  // East-West main road
  const ewStreet = new THREE.Mesh(new THREE.BoxGeometry(400, 0.15, streetW), streetMat);
  ewStreet.position.set(0, 0.08, 0);
  scene.add(ewStreet);
  // Secondary diagonal streets
  for (let s = 0; s < 4; s++) {
    const angle = (Math.PI / 4) + (Math.PI / 2) * s;
    const secStreet = new THREE.Mesh(new THREE.BoxGeometry(5, 0.12, 250), streetMat);
    secStreet.position.set(Math.cos(angle) * 30, 0.06, Math.sin(angle) * 30);
    secStreet.rotation.y = angle;
    scene.add(secStreet);
  }
  // Street lane markings (dashed center lines)
  for (let axis = 0; axis < 2; axis++) {
    for (let d = -190; d < 190; d += 8) {
      const dashGeo = new THREE.BoxGeometry(axis === 0 ? 0.3 : 3, 0.17, axis === 0 ? 3 : 0.3);
      const dash = new THREE.Mesh(dashGeo, new THREE.MeshBasicMaterial({ color: 0xffbb33, transparent: true, opacity: 0.5 }));
      dash.position.set(axis === 0 ? 0 : d, 0.09, axis === 0 ? d : 0);
      scene.add(dash);
    }
  }
  // Sidewalk edges along main roads
  const sidewalkMat = new THREE.MeshPhongMaterial({ color: 0x555550, emissive: 0x111110, shininess: 10 });
  for (let side = -1; side <= 1; side += 2) {
    const swNS = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.25, 400), sidewalkMat);
    swNS.position.set(side * (streetW / 2 + 0.75), 0.13, 0);
    scene.add(swNS);
    const swEW = new THREE.Mesh(new THREE.BoxGeometry(400, 0.25, 1.5), sidewalkMat);
    swEW.position.set(0, 0.13, side * (streetW / 2 + 0.75));
    scene.add(swEW);
  }

  // ── GEOMETRIC TREES ──
  const treePositions = [];
  for (let i = 0; i < 45; i++) {
    let tx = (Math.random() - 0.5) * 340;
    let tz = (Math.random() - 0.5) * 340;
    // Avoid streets
    if (Math.abs(tx) < streetW + 3 && Math.abs(tz) < 200) continue;
    if (Math.abs(tz) < streetW + 3 && Math.abs(tx) < 200) continue;
    treePositions.push({ x: tx, z: tz });
  }
  treePositions.forEach(({ x: tx, z: tz }) => {
    const treeGroup = new THREE.Group();
    const trunkH = 2 + Math.random() * 2;
    const trunkR = 0.2 + Math.random() * 0.15;
    // Geometric trunk (hexagonal prism)
    const trunkGeo = new THREE.CylinderGeometry(trunkR, trunkR * 1.3, trunkH, 6);
    const trunkMat = new THREE.MeshPhongMaterial({ color: 0x4a3525, emissive: 0x1a0a05, shininess: 20 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = trunkH / 2;
    treeGroup.add(trunk);
    // Foliage — stacked pyramids (low-poly geometric)
    const foliageColor = [0x228855, 0x33aa66, 0x22aa44, 0x44bb55][Math.floor(Math.random() * 4)];
    const layers = 2 + Math.floor(Math.random() * 2);
    for (let l = 0; l < layers; l++) {
      const layerR = (2.5 - l * 0.6) * (0.8 + Math.random() * 0.4);
      const layerH = 2.5 - l * 0.3;
      const foliageGeo = new THREE.ConeGeometry(layerR, layerH, 5 + Math.floor(Math.random() * 3));
      const foliageMat = new THREE.MeshPhongMaterial({ color: foliageColor, emissive: 0x112211, shininess: 30, flatShading: true });
      const foliage = new THREE.Mesh(foliageGeo, foliageMat);
      foliage.position.y = trunkH + l * 1.5 + layerH / 2;
      foliage.rotation.y = Math.random() * Math.PI;
      treeGroup.add(foliage);
    }
    treeGroup.position.set(tx, 0, tz);
    scene.add(treeGroup);
  });

  // ── GEOMETRIC ROCKS ──
  for (let i = 0; i < 18; i++) {
    let rx = (Math.random() - 0.5) * 320;
    let rz = (Math.random() - 0.5) * 320;
    if (Math.abs(rx) < streetW + 2 && Math.abs(rz) < 200) continue;
    if (Math.abs(rz) < streetW + 2 && Math.abs(rx) < 200) continue;
    const rockSize = 0.5 + Math.random() * 1.5;
    const rockTypes = [
      () => new THREE.DodecahedronGeometry(rockSize, 0),
      () => new THREE.IcosahedronGeometry(rockSize, 0),
      () => new THREE.OctahedronGeometry(rockSize, 0),
    ];
    const rockGeo = rockTypes[Math.floor(Math.random() * rockTypes.length)]();
    const rockMat = new THREE.MeshPhongMaterial({
      color: [0x665544, 0x777766, 0x555544, 0x887766][Math.floor(Math.random() * 4)],
      emissive: 0x111111, shininess: 15, flatShading: true,
    });
    const rock = new THREE.Mesh(rockGeo, rockMat);
    rock.position.set(rx, rockSize * 0.4, rz);
    rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * 0.5);
    rock.scale.set(1, 0.6 + Math.random() * 0.4, 1 + Math.random() * 0.5);
    scene.add(rock);
  }

  // ── LAMPPOSTS ──
  const lampColor = 0xffbb33;
  for (let i = 0; i < 15; i++) {
    const side = Math.random() > 0.5 ? 1 : -1;
    const isNS = Math.random() > 0.5;
    const pos = (Math.random() - 0.5) * 350;
    const lx = isNS ? side * (streetW / 2 + 2.5) : pos;
    const lz = isNS ? pos : side * (streetW / 2 + 2.5);

    const lampGroup = new THREE.Group();
    // Pole (octagonal)
    const poleGeo = new THREE.CylinderGeometry(0.12, 0.15, 7, 8);
    const poleMat = new THREE.MeshPhongMaterial({ color: 0x444444, emissive: 0x111111, shininess: 40 });
    lampGroup.add(new THREE.Mesh(poleGeo, poleMat));
    lampGroup.children[0].position.y = 3.5;
    // Arm
    const armGeo = new THREE.BoxGeometry(1.5, 0.08, 0.08);
    const arm = new THREE.Mesh(armGeo, poleMat);
    arm.position.set(0.75, 7, 0);
    lampGroup.add(arm);
    // Light housing (geometric)
    const housingGeo = new THREE.OctahedronGeometry(0.4, 0);
    const housingMat = new THREE.MeshBasicMaterial({ color: lampColor, transparent: true, opacity: 0.6 });
    const housing = new THREE.Mesh(housingGeo, housingMat);
    housing.position.set(1.5, 6.8, 0);
    housing.scale.y = 0.5;
    lampGroup.add(housing);
    // Point light
    const lampLight = new THREE.PointLight(lampColor, 1.2, 18);
    lampLight.position.set(1.5, 6.5, 0);
    lampGroup.add(lampLight);
    // Base
    const baseGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.3, 8);
    lampGroup.add(new THREE.Mesh(baseGeo, poleMat));
    lampGroup.children[lampGroup.children.length - 1].position.y = 0.15;

    lampGroup.position.set(lx, 0, lz);
    scene.add(lampGroup);
  }

  // ── BENCHES ──
  const benchMat = new THREE.MeshPhongMaterial({ color: 0x553322, emissive: 0x110500, shininess: 25 });
  const metalMat = new THREE.MeshPhongMaterial({ color: 0x555555, emissive: 0x111111, shininess: 60 });
  for (let i = 0; i < 8; i++) {
    const side = Math.random() > 0.5 ? 1 : -1;
    const isNS = Math.random() > 0.5;
    const pos = (Math.random() - 0.5) * 300;
    const bx = isNS ? side * (streetW / 2 + 3.5) : pos;
    const bz = isNS ? pos : side * (streetW / 2 + 3.5);

    const benchGroup = new THREE.Group();
    // Seat
    benchGroup.add(new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.12, 0.7), benchMat));
    benchGroup.children[0].position.y = 0.65;
    // Back
    benchGroup.add(new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.8, 0.08), benchMat));
    benchGroup.children[1].position.set(0, 1.1, -0.3);
    // Legs (4)
    for (let leg = 0; leg < 4; leg++) {
      const legMesh = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.65, 0.08), metalMat);
      legMesh.position.set((leg < 2 ? -1 : 1) * 1, 0.32, (leg % 2 === 0 ? -0.25 : 0.25));
      benchGroup.add(legMesh);
    }
    benchGroup.position.set(bx, 0, bz);
    benchGroup.rotation.y = isNS ? 0 : Math.PI / 2;
    scene.add(benchGroup);
  }

  // ── TRASH CANS ──
  for (let i = 0; i < 10; i++) {
    const side = Math.random() > 0.5 ? 1 : -1;
    const isNS = Math.random() > 0.5;
    const pos = (Math.random() - 0.5) * 340;
    const tcx = isNS ? side * (streetW / 2 + 2) : pos;
    const tcz = isNS ? pos : side * (streetW / 2 + 2);

    const trashGroup = new THREE.Group();
    // Body (hexagonal cylinder)
    const bodyGeo = new THREE.CylinderGeometry(0.4, 0.35, 1.2, 6);
    const bodyMat = new THREE.MeshPhongMaterial({ color: 0x444455, emissive: 0x111115, shininess: 30 });
    trashGroup.add(new THREE.Mesh(bodyGeo, bodyMat));
    trashGroup.children[0].position.y = 0.6;
    // Lid (slightly wider hexagon)
    const lidGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.08, 6);
    const lidMat = new THREE.MeshPhongMaterial({ color: 0x555566, emissive: 0x111115, shininess: 50 });
    trashGroup.add(new THREE.Mesh(lidGeo, lidMat));
    trashGroup.children[1].position.y = 1.24;
    // Neon recycling ring
    const neonRingGeo = new THREE.TorusGeometry(0.42, 0.02, 4, 6);
    const neonRingMat = new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.4 });
    const neonRing = new THREE.Mesh(neonRingGeo, neonRingMat);
    neonRing.position.y = 0.9;
    neonRing.rotation.x = Math.PI / 2;
    trashGroup.add(neonRing);

    trashGroup.position.set(tcx, 0, tcz);
    scene.add(trashGroup);
  }

  // ── CROSSWALK MARKINGS ──
  const crosswalkMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
  // At the intersection center
  for (let dir = 0; dir < 4; dir++) {
    const angle = (Math.PI / 2) * dir;
    for (let stripe = 0; stripe < 5; stripe++) {
      const stripeGeo = new THREE.BoxGeometry(0.5, 0.17, streetW - 1);
      const s = new THREE.Mesh(stripeGeo, crosswalkMat);
      const offset = (stripe - 2) * 1.2;
      s.position.set(
        Math.cos(angle) * (streetW / 2 + 4) + Math.sin(angle) * offset,
        0.09,
        Math.sin(angle) * (streetW / 2 + 4) - Math.cos(angle) * offset
      );
      s.rotation.y = angle;
      scene.add(s);
    }
  }

  // ── SMALL DECORATIVE ELEMENTS ──
  // Fire hydrants
  for (let i = 0; i < 5; i++) {
    const hx = (Math.random() - 0.5) * 300;
    const hz = (Math.random() - 0.5) * 300;
    if (Math.abs(hx) < streetW + 1) continue;
    const hydrantGroup = new THREE.Group();
    const hydrantBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.25, 0.8, 6),
      new THREE.MeshPhongMaterial({ color: 0xcc2222, emissive: 0x330000, shininess: 40 })
    );
    hydrantBody.position.y = 0.4;
    hydrantGroup.add(hydrantBody);
    const hydrantTop = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 6, 4, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshPhongMaterial({ color: 0xcc2222, emissive: 0x330000, shininess: 40 })
    );
    hydrantTop.position.y = 0.8;
    hydrantGroup.add(hydrantTop);
    hydrantGroup.position.set(hx, 0, hz);
    scene.add(hydrantGroup);
  }

  // ═══════════════════════════════════════
  //  PRE-GENERATE SVG ILLUSTRATIONS
  // ═══════════════════════════════════════
  assets.illustrations = {
    girls_together: createSVGIllustration('girls_together', THREE),
    girls_fighting: createSVGIllustration('girls_fighting', THREE),
    eva_grandpa: createSVGIllustration('eva_grandpa', THREE),
  };

  return assets;
}
