// ══════════════════════════════════════════════════════
//  PATTERN: Factory — Iconic Futuristic Architecture
//  Pyramids, Gherkins, Flatirons, Twist Towers,
//  Geodesic Spheres, Spirals, Lotus, Habitat Cubes,
//  Domes, Cube Houses, Radial Towers
// ══════════════════════════════════════════════════════

import { BUILDING_CONFIGS, NEON_EDGE_COLORS } from '../constants/gameConstants';

const rand = (min, max) => min + Math.random() * (max - min);
const NEON_HEX = ['#00F0FF', '#FF0066', '#9D00FF', '#00FF88', '#FF6600', '#FF61D8', '#61FFD8', '#D861FF'];

const CODE_SNIPPETS = [
  'function init() {', 'const OASIS = new World();', 'if (eva.alive) {',
  'return keyAmbar;', 'class Tower extends Node {', 'async load() {',
  'export default OASIS;', 'while (system.active) {',
  'try { decrypt(); }', 'import { Key } from "halliday";',
  'eva.solve(puzzle);', 'render(scene, camera);',
  '// TODO: find keys', 'suyin.echo();', 'zuri.memory();',
];

const BuildingFactory = {
  _createHDTexture(width, height, accentColor, THREE, style) {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const hex = typeof accentColor === 'number' ? '#' + accentColor.toString(16).padStart(6, '0') : accentColor;

    ctx.fillStyle = '#E8DDD5';
    ctx.fillRect(0, 0, 256, 512);

    const baseGrad = ctx.createLinearGradient(0, 0, 0, 512);
    baseGrad.addColorStop(0, 'rgba(220,210,200,0.5)');
    baseGrad.addColorStop(0.5, 'rgba(235,225,215,0.3)');
    baseGrad.addColorStop(1, 'rgba(210,200,190,0.6)');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, 256, 512);

    ctx.strokeStyle = `${hex}08`;
    ctx.lineWidth = 0.5;
    for (let y = 0; y < 512; y += 16) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke(); }
    for (let x = 0; x < 256; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1024); ctx.stroke(); }

    ctx.font = '10px monospace';
    for (let i = 0; i < 25; i++) {
      if (Math.random() > 0.5) continue;
      const snippet = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
      ctx.fillStyle = Math.random() > 0.85 ? hex : '#8B7766';
      ctx.globalAlpha = Math.random() > 0.85 ? 0.18 : 0.06;
      ctx.fillText(snippet, 8 + Math.floor(Math.random() * 3) * 14, i * 20 + 12);
    }
    ctx.globalAlpha = 1;

    const winCols = Math.max(3, Math.floor(width / 2.5));
    const winRows = Math.max(6, Math.floor(height / 4));
    const cellW = 240 / winCols;
    const cellH = 480 / winRows;

    for (let row = 0; row < winRows; row++) {
      for (let col = 0; col < winCols; col++) {
        const wx = 8 + col * cellW + 2;
        const wy = 16 + row * cellH + 2;
        const ww = cellW * 0.6;
        const wh = cellH * 0.5;
        if (Math.random() > 0.6) {
          ctx.fillStyle = Math.random() > 0.7 ? hex : '#CCBB99';
          ctx.globalAlpha = 0.06 + Math.random() * 0.14;
          ctx.fillRect(wx, wy, ww, wh);
          ctx.globalAlpha = 0.03;
          ctx.fillRect(wx - 1, wy - 1, ww + 2, wh + 2);
          ctx.strokeStyle = hex;
          ctx.globalAlpha = 0.08;
          ctx.lineWidth = 0.5;
          ctx.strokeRect(wx, wy, ww, wh);
        } else {
          ctx.fillStyle = '#BBAA99';
          ctx.globalAlpha = 0.4;
          ctx.fillRect(wx, wy, ww, wh);
        }
      }
    }
    ctx.globalAlpha = 1;

    for (let b = 0; b < 4; b++) {
      const by = 100 + b * 110 + Math.random() * 40;
      ctx.fillStyle = hex;
      ctx.globalAlpha = 0.06;
      ctx.fillRect(0, by, 256, 2);
      ctx.globalAlpha = 0.03;
      ctx.fillRect(0, by - 3, 256, 8);
    }
    ctx.globalAlpha = 1;

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  },

  // ── Helper: add neon edges to any geometry ──
  _addNeonEdges(mesh, geo, neonColor, THREE, opacity = 0.3) {
    const edges = new THREE.EdgesGeometry(geo);
    mesh.add(new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: neonColor, transparent: true, opacity })));
  },

  create(type, x, z, THREE) {
    const cfg = BUILDING_CONFIGS[type] || BUILDING_CONFIGS.block;
    const w = rand(cfg.wRange[0], cfg.wRange[1]);
    const h = rand(cfg.hRange[0], cfg.hRange[1]);
    const d = rand(cfg.dRange[0], cfg.dRange[1]);
    const neonColor = NEON_EDGE_COLORS[Math.floor(Math.random() * NEON_EDGE_COLORS.length)];
    const codeTexture = this._createHDTexture(w, h, neonColor, THREE, type);

    let mesh;

    if (type === 'pyramid') {
      // ── PYRAMID (Louvre / Luxor) ──
      const geo = new THREE.ConeGeometry(w / 2, h, 4);
      const mat = new THREE.MeshPhongMaterial({
        map: codeTexture, color: 0xD9CDB8,
        emissive: new THREE.Color(neonColor).multiplyScalar(0.04),
        shininess: 80, transparent: true, opacity: 0.92,
      });
      mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, h / 2, z);
      mesh.rotation.y = Math.PI / 4;
      this._addNeonEdges(mesh, geo, neonColor, THREE, 0.4);
      const tipLight = new THREE.PointLight(neonColor, 1.5, 15);
      tipLight.position.y = h / 2;
      mesh.add(tipLight);

    } else if (type === 'gherkin') {
      // ── GHERKIN (curved cylindrical tower) ──
      const group = new THREE.Group();
      const segments = 8;
      const segH = h / segments;
      for (let i = 0; i < segments; i++) {
        const t = i / (segments - 1);
        const profile = 1 - 1.8 * Math.pow(t - 0.4, 2);
        const radius = (w / 2) * Math.max(0.4, profile);
        const nextT = (i + 1) / (segments - 1);
        const nextProfile = 1 - 1.8 * Math.pow(nextT - 0.4, 2);
        const topRadius = (w / 2) * Math.max(0.4, nextProfile);
        const segGeo = new THREE.CylinderGeometry(topRadius, radius, segH, 8);
        const segMat = new THREE.MeshPhongMaterial({
          map: codeTexture, color: 0xD9CDB8,
          emissive: new THREE.Color(neonColor).multiplyScalar(0.03 + t * 0.02),
          shininess: 100, transparent: true, opacity: 0.9,
        });
        const seg = new THREE.Mesh(segGeo, segMat);
        seg.position.y = segH * i + segH / 2;
        group.add(seg);
        if (i > 0) {
          const ringGeo = new THREE.TorusGeometry(radius + 0.2, 0.08, 6, 16);
          const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: neonColor, transparent: true, opacity: 0.25 }));
          ring.position.y = segH * i;
          ring.rotation.x = Math.PI / 2;
          group.add(ring);
        }
      }
      const domeGeo = new THREE.SphereGeometry(w * 0.2, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
      const dome = new THREE.Mesh(domeGeo, new THREE.MeshPhongMaterial({ color: neonColor, emissive: neonColor, emissiveIntensity: 0.1, transparent: true, opacity: 0.35 }));
      dome.position.y = h;
      group.add(dome);
      group.position.set(x, 0, z);
      mesh = group;

    } else if (type === 'flatiron') {
      // ── FLATIRON (triangular thin building) ──
      const shape = new THREE.Shape();
      shape.moveTo(-w / 2, -d / 2);
      shape.lineTo(w / 2, -d / 2);
      shape.lineTo(0, d / 2);
      shape.closePath();
      const geo = new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: false });
      const mat = new THREE.MeshPhongMaterial({
        map: codeTexture, color: 0xD9CDB8,
        emissive: new THREE.Color(neonColor).multiplyScalar(0.04),
        shininess: 70, transparent: true, opacity: 0.93,
      });
      mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(x, 0, z);
      this._addNeonEdges(mesh, geo, neonColor, THREE);

    } else if (type === 'twistTower') {
      // ── TWIST TOWER (Turning Torso) ──
      const group = new THREE.Group();
      const floors = 10;
      const floorH = h / floors;
      const totalTwist = Math.PI * 0.6;
      for (let i = 0; i < floors; i++) {
        const floorGeo = new THREE.BoxGeometry(w, floorH * 0.92, d);
        const floorMat = new THREE.MeshPhongMaterial({
          map: codeTexture, color: 0xD9CDB8,
          emissive: new THREE.Color(neonColor).multiplyScalar(0.03 + (i / floors) * 0.03),
          shininess: 80, transparent: true, opacity: 0.92,
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.position.y = floorH * i + floorH / 2;
        floor.rotation.y = (totalTwist / floors) * i;
        this._addNeonEdges(floor, floorGeo, neonColor, THREE, 0.15 + (i / floors) * 0.2);
        group.add(floor);
      }
      const antGeo = new THREE.CylinderGeometry(0.15, 0.15, 6, 4);
      const ant = new THREE.Mesh(antGeo, new THREE.MeshBasicMaterial({ color: neonColor, transparent: true, opacity: 0.5 }));
      ant.position.y = h + 3;
      group.add(ant);
      const topLight = new THREE.PointLight(neonColor, 2, 20);
      topLight.position.y = h + 6;
      group.add(topLight);
      group.position.set(x, 0, z);
      mesh = group;

    } else if (type === 'geodesic') {
      // ── GEODESIC SPHERE (Spaceship Earth / EPCOT) ──
      const group = new THREE.Group();
      const radius = w / 2;
      const sphereGeo = new THREE.IcosahedronGeometry(radius, 1);
      const sphereMat = new THREE.MeshPhongMaterial({
        map: codeTexture, color: 0xD9CDB8,
        emissive: new THREE.Color(neonColor).multiplyScalar(0.05),
        shininess: 120, transparent: true, opacity: 0.85,
        flatShading: true,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.y = radius + h * 0.2;
      group.add(sphere);
      // Wireframe geodesic lines
      const wireGeo = new THREE.IcosahedronGeometry(radius + 0.1, 2);
      const wire = new THREE.LineSegments(
        new THREE.WireframeGeometry(wireGeo),
        new THREE.LineBasicMaterial({ color: neonColor, transparent: true, opacity: 0.35 })
      );
      wire.position.y = radius + h * 0.2;
      group.add(wire);
      // Support pillars (4 angled legs)
      for (let i = 0; i < 4; i++) {
        const angle = (Math.PI / 2) * i + Math.PI / 4;
        const pillarGeo = new THREE.CylinderGeometry(0.3, 0.6, radius * 1.2, 6);
        const pillar = new THREE.Mesh(pillarGeo, new THREE.MeshPhongMaterial({ color: 0xD9CDB8, emissive: new THREE.Color(neonColor).multiplyScalar(0.02), shininess: 60 }));
        pillar.position.set(Math.cos(angle) * radius * 0.5, radius * 0.4, Math.sin(angle) * radius * 0.5);
        pillar.rotation.z = Math.cos(angle) * 0.2;
        pillar.rotation.x = -Math.sin(angle) * 0.2;
        group.add(pillar);
      }
      // Inner glow
      const innerLight = new THREE.PointLight(neonColor, 2, radius * 3);
      innerLight.position.y = radius + h * 0.2;
      group.add(innerLight);
      group.position.set(x, 0, z);
      mesh = group;

    } else if (type === 'spiral') {
      // ── SPIRAL (Guggenheim Museum) ──
      const group = new THREE.Group();
      const rings = 7;
      const ringH = h / rings;
      for (let i = 0; i < rings; i++) {
        const t = i / rings;
        const r = (w / 2) * (0.6 + t * 0.5); // expanding radius upward
        const torusGeo = new THREE.TorusGeometry(r, ringH * 0.4, 6, 12);
        const torusMat = new THREE.MeshPhongMaterial({
          map: codeTexture, color: 0xD9CDB8,
          emissive: new THREE.Color(neonColor).multiplyScalar(0.03 + t * 0.03),
          shininess: 90, transparent: true, opacity: 0.88,
        });
        const ring = new THREE.Mesh(torusGeo, torusMat);
        ring.position.y = ringH * i + ringH / 2;
        ring.rotation.x = Math.PI / 2;
        ring.rotation.z = t * Math.PI * 0.8;
        group.add(ring);
        // Neon ring highlight
        const glowRing = new THREE.Mesh(
          new THREE.TorusGeometry(r + 0.15, 0.06, 4, 12),
          new THREE.MeshBasicMaterial({ color: neonColor, transparent: true, opacity: 0.3 })
        );
        glowRing.position.copy(ring.position);
        glowRing.rotation.copy(ring.rotation);
        group.add(glowRing);
      }
      // Central column
      const colGeo = new THREE.CylinderGeometry(w * 0.08, w * 0.12, h, 8);
      const col = new THREE.Mesh(colGeo, new THREE.MeshPhongMaterial({ color: 0xD9CDB8, emissive: new THREE.Color(neonColor).multiplyScalar(0.04), shininess: 60 }));
      col.position.y = h / 2;
      group.add(col);
      const topLight = new THREE.PointLight(neonColor, 1.5, 20);
      topLight.position.y = h + 2;
      group.add(topLight);
      group.position.set(x, 0, z);
      mesh = group;

    } else if (type === 'lotus') {
      // ── LOTUS (Lotus Temple — petal geometry) ──
      const group = new THREE.Group();
      const petals = 8;
      for (let i = 0; i < petals; i++) {
        const angle = (Math.PI * 2 / petals) * i;
        // Outer petal
        const petalGeo = new THREE.SphereGeometry(w * 0.35, 6, 8, 0, Math.PI, 0, Math.PI * 0.6);
        const petalMat = new THREE.MeshPhongMaterial({
          color: 0xD9CDB8, emissive: new THREE.Color(neonColor).multiplyScalar(0.04),
          shininess: 100, transparent: true, opacity: 0.85, side: THREE.DoubleSide,
        });
        const petal = new THREE.Mesh(petalGeo, petalMat);
        petal.position.set(Math.cos(angle) * w * 0.25, h * 0.3, Math.sin(angle) * w * 0.25);
        petal.rotation.y = -angle;
        petal.rotation.x = -0.3;
        petal.scale.set(1, 1.5, 0.5);
        this._addNeonEdges(petal, petalGeo, neonColor, THREE, 0.25);
        group.add(petal);
        // Inner petal (smaller, more upright)
        const innerPetal = petal.clone();
        innerPetal.position.set(Math.cos(angle) * w * 0.12, h * 0.45, Math.sin(angle) * w * 0.12);
        innerPetal.scale.set(0.6, 1.8, 0.35);
        innerPetal.rotation.x = -0.6;
        group.add(innerPetal);
      }
      // Central dome
      const domeGeo = new THREE.SphereGeometry(w * 0.15, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2);
      const dome = new THREE.Mesh(domeGeo, new THREE.MeshPhongMaterial({ color: neonColor, emissive: neonColor, emissiveIntensity: 0.15, transparent: true, opacity: 0.4 }));
      dome.position.y = h * 0.5;
      group.add(dome);
      // Base platform
      const baseGeo = new THREE.CylinderGeometry(w * 0.5, w * 0.55, h * 0.15, 16);
      const base = new THREE.Mesh(baseGeo, new THREE.MeshPhongMaterial({ color: 0xD9CDB8, emissive: new THREE.Color(neonColor).multiplyScalar(0.02), shininess: 40 }));
      base.position.y = h * 0.075;
      group.add(base);
      const centerLight = new THREE.PointLight(neonColor, 2, 20);
      centerLight.position.y = h * 0.6;
      group.add(centerLight);
      group.position.set(x, 0, z);
      mesh = group;

    } else if (type === 'habitat') {
      // ── HABITAT 67 (stacked modular cubes) ──
      const group = new THREE.Group();
      const cubeSize = w * 0.25;
      const layers = Math.floor(h / cubeSize);
      for (let layer = 0; layer < layers; layer++) {
        const cubesInLayer = Math.max(1, 4 - layer);
        for (let c = 0; c < cubesInLayer; c++) {
          const cubeGeo = new THREE.BoxGeometry(cubeSize * (0.8 + Math.random() * 0.4), cubeSize * (0.7 + Math.random() * 0.5), cubeSize * (0.8 + Math.random() * 0.4));
          const cubeMat = new THREE.MeshPhongMaterial({
            map: codeTexture, color: 0xD9CDB8,
            emissive: new THREE.Color(neonColor).multiplyScalar(0.03 + Math.random() * 0.03),
            shininess: 70, transparent: true, opacity: 0.9,
          });
          const cube = new THREE.Mesh(cubeGeo, cubeMat);
          const offsetX = (c - cubesInLayer / 2) * cubeSize * 1.1 + (Math.random() - 0.5) * cubeSize * 0.3;
          const offsetZ = (Math.random() - 0.5) * cubeSize * 0.6;
          cube.position.set(offsetX, layer * cubeSize * 0.9 + cubeSize / 2, offsetZ);
          cube.rotation.y = Math.random() * 0.3 - 0.15;
          this._addNeonEdges(cube, cubeGeo, neonColor, THREE, 0.2 + Math.random() * 0.2);
          group.add(cube);
        }
      }
      // Bridge connections between some cubes
      for (let i = 0; i < 3; i++) {
        const bridgeGeo = new THREE.BoxGeometry(cubeSize * 0.15, cubeSize * 0.1, cubeSize * 0.8);
        const bridge = new THREE.Mesh(bridgeGeo, new THREE.MeshBasicMaterial({ color: neonColor, transparent: true, opacity: 0.2 }));
        bridge.position.set((Math.random() - 0.5) * w * 0.3, cubeSize * (1 + i) * 0.9, 0);
        bridge.rotation.y = Math.random() * Math.PI;
        group.add(bridge);
      }
      group.position.set(x, 0, z);
      mesh = group;

    } else if (type === 'dome') {
      // ── DOME (National Centre for Performing Arts — elliptical) ──
      const group = new THREE.Group();
      const rx = w / 2;
      const ry = h * 0.8;
      const rz = d / 2;
      const domeGeo = new THREE.SphereGeometry(1, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2);
      const domeMat = new THREE.MeshPhongMaterial({
        map: codeTexture, color: 0xD9CDB8,
        emissive: new THREE.Color(neonColor).multiplyScalar(0.05),
        shininess: 120, transparent: true, opacity: 0.8,
      });
      const dome = new THREE.Mesh(domeGeo, domeMat);
      dome.scale.set(rx, ry, rz);
      group.add(dome);
      // Wireframe rings
      for (let i = 1; i <= 3; i++) {
        const ringGeo = new THREE.TorusGeometry(rx * (0.3 + i * 0.2), 0.06, 4, 32);
        const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: neonColor, transparent: true, opacity: 0.3 }));
        ring.position.y = ry * (i * 0.2);
        ring.rotation.x = Math.PI / 2;
        ring.scale.set(1, 1, rz / rx);
        group.add(ring);
      }
      // Reflection pool base
      const poolGeo = new THREE.CylinderGeometry(rx * 1.2, rx * 1.2, 0.3, 32);
      const pool = new THREE.Mesh(poolGeo, new THREE.MeshPhongMaterial({ color: 0x1a2a3a, emissive: new THREE.Color(neonColor).multiplyScalar(0.03), shininess: 200, transparent: true, opacity: 0.5 }));
      pool.position.y = -0.15;
      group.add(pool);
      const innerLight = new THREE.PointLight(neonColor, 1.5, rx * 3);
      innerLight.position.y = ry * 0.5;
      group.add(innerLight);
      group.position.set(x, 0, z);
      mesh = group;

    } else if (type === 'cubeHouse') {
      // ── CUBE HOUSES (Rotterdam — tilted cubes on pillars) ──
      const group = new THREE.Group();
      const cubeSize = w * 0.7;
      const pillarH = h * 0.5;
      const cubes = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < cubes; i++) {
        // Pillar
        const pillarGeo = new THREE.CylinderGeometry(cubeSize * 0.08, cubeSize * 0.12, pillarH, 6);
        const pillar = new THREE.Mesh(pillarGeo, new THREE.MeshPhongMaterial({ color: 0xD9CDB8, emissive: new THREE.Color(neonColor).multiplyScalar(0.02), shininess: 60 }));
        const px = (i - cubes / 2) * cubeSize * 0.9;
        pillar.position.set(px, pillarH / 2, 0);
        group.add(pillar);
        // Tilted cube on top
        const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const cubeMat = new THREE.MeshPhongMaterial({
          map: codeTexture, color: 0xD9CDB8,
          emissive: new THREE.Color(neonColor).multiplyScalar(0.04),
          shininess: 80, transparent: true, opacity: 0.9,
        });
        const cube = new THREE.Mesh(cubeGeo, cubeMat);
        cube.position.set(px, pillarH + cubeSize * 0.35, 0);
        cube.rotation.set(Math.PI / 4, 0, Math.PI / 4); // 45° tilt
        this._addNeonEdges(cube, cubeGeo, neonColor, THREE, 0.35);
        group.add(cube);
      }
      // Connecting walkways
      for (let i = 0; i < cubes - 1; i++) {
        const bridgeGeo = new THREE.BoxGeometry(cubeSize * 0.7, cubeSize * 0.06, cubeSize * 0.15);
        const bridge = new THREE.Mesh(bridgeGeo, new THREE.MeshBasicMaterial({ color: neonColor, transparent: true, opacity: 0.2 }));
        bridge.position.set((i - cubes / 2 + 0.5) * cubeSize * 0.9, pillarH + cubeSize * 0.1, 0);
        group.add(bridge);
      }
      group.position.set(x, 0, z);
      mesh = group;

    } else if (type === 'radialTower') {
      // ── RADIAL TOWER (Burj Khalifa — radial geometry, stepped) ──
      const group = new THREE.Group();
      const sections = 5;
      let currentH = 0;
      for (let s = 0; s < sections; s++) {
        const t = s / sections;
        const sectionH = (h / sections) * (1 - t * 0.15);
        const radius = (w / 2) * (1 - t * 0.5);
        // 3-winged cross section (Y-shape)
        for (let wing = 0; wing < 3; wing++) {
          const angle = (Math.PI * 2 / 3) * wing;
          const wingW = radius * 0.35;
          const wingD = radius * 1.2;
          const wingGeo = new THREE.BoxGeometry(wingW, sectionH, wingD);
          const wingMat = new THREE.MeshPhongMaterial({
            map: codeTexture, color: 0xD9CDB8,
            emissive: new THREE.Color(neonColor).multiplyScalar(0.03 + t * 0.04),
            shininess: 90, transparent: true, opacity: 0.9,
          });
          const wingMesh = new THREE.Mesh(wingGeo, wingMat);
          wingMesh.position.set(Math.cos(angle) * radius * 0.3, currentH + sectionH / 2, Math.sin(angle) * radius * 0.3);
          wingMesh.rotation.y = angle;
          this._addNeonEdges(wingMesh, wingGeo, neonColor, THREE, 0.2);
          group.add(wingMesh);
        }
        // Connecting center cylinder
        const coreGeo = new THREE.CylinderGeometry(radius * 0.2, radius * 0.25, sectionH, 6);
        const core = new THREE.Mesh(coreGeo, new THREE.MeshPhongMaterial({
          color: 0xD9CDB8, emissive: new THREE.Color(neonColor).multiplyScalar(0.04), shininess: 80, transparent: true, opacity: 0.9,
        }));
        core.position.y = currentH + sectionH / 2;
        group.add(core);
        // Setback ring
        const setbackRing = new THREE.Mesh(
          new THREE.TorusGeometry(radius * 0.6, 0.08, 4, 18),
          new THREE.MeshBasicMaterial({ color: neonColor, transparent: true, opacity: 0.25 })
        );
        setbackRing.position.y = currentH;
        setbackRing.rotation.x = Math.PI / 2;
        group.add(setbackRing);
        currentH += sectionH;
      }
      // Spire
      const spireGeo = new THREE.ConeGeometry(w * 0.04, h * 0.2, 4);
      const spire = new THREE.Mesh(spireGeo, new THREE.MeshBasicMaterial({ color: neonColor, transparent: true, opacity: 0.6 }));
      spire.position.y = currentH + h * 0.1;
      group.add(spire);
      const topLight = new THREE.PointLight(neonColor, 3, 30);
      topLight.position.y = currentH + h * 0.2;
      group.add(topLight);
      group.position.set(x, 0, z);
      mesh = group;

    } else {
      // ── STANDARD BOX BUILDINGS (skyscraper, tower, block, neonTower) ──
      const geo = new THREE.BoxGeometry(w, h, d);
      const mat = new THREE.MeshPhongMaterial({
        map: codeTexture, color: 0xD9CDB8,
        emissive: new THREE.Color(neonColor).multiplyScalar(0.03),
        shininess: 60, transparent: true, opacity: 0.95,
        specular: new THREE.Color(0x333333),
      });
      mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, h / 2, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      this._addNeonEdges(mesh, geo, neonColor, THREE, 0.25 + Math.random() * 0.3);

      // Top strip
      const stripGeo = new THREE.BoxGeometry(w * 0.8, 0.3, d * 0.8);
      const stripMesh = new THREE.Mesh(stripGeo, new THREE.MeshBasicMaterial({ color: neonColor, transparent: true, opacity: 0.15 }));
      stripMesh.position.y = h / 2 + 0.2;
      mesh.add(stripMesh);

      // Antenna for tall buildings
      if (h > 40 && Math.random() > 0.4) {
        const antennaGeo = new THREE.CylinderGeometry(0.1, 0.1, 8, 4);
        const antenna = new THREE.Mesh(antennaGeo, new THREE.MeshBasicMaterial({ color: neonColor, transparent: true, opacity: 0.4 }));
        antenna.position.y = h / 2 + 4;
        mesh.add(antenna);
        const lightGeo = new THREE.SphereGeometry(0.3, 8, 8);
        const light = new THREE.Mesh(lightGeo, new THREE.MeshBasicMaterial({ color: neonColor, transparent: true, opacity: 0.8 }));
        light.position.y = h / 2 + 8;
        mesh.add(light);
      }

      // Billboard on tall buildings
      if (h > 50 && Math.random() > 0.6) {
        const billGeo = new THREE.PlaneGeometry(w * 0.7, 3);
        const billCanvas = document.createElement('canvas');
        billCanvas.width = 256; billCanvas.height = 64;
        const bCtx = billCanvas.getContext('2d');
        bCtx.fillStyle = 'rgba(255,235,225,0.8)'; bCtx.fillRect(0, 0, 256, 64);
        const hexC = '#' + neonColor.toString(16).padStart(6, '0');
        bCtx.strokeStyle = hexC; bCtx.globalAlpha = 0.4; bCtx.lineWidth = 1;
        bCtx.strokeRect(2, 2, 252, 60); bCtx.globalAlpha = 1;
        bCtx.font = 'bold 20px monospace'; bCtx.fillStyle = hexC;
        bCtx.shadowColor = hexC; bCtx.shadowBlur = 10;
        const texts = ['OASIS v2089', 'EVA_∞', 'SECTOR_7G', 'HALLIDAY.SYS', 'FIND KEYS'];
        bCtx.fillText(texts[Math.floor(Math.random() * texts.length)], 10, 40);
        const billTex = new THREE.CanvasTexture(billCanvas);
        const billboard = new THREE.Mesh(billGeo, new THREE.MeshBasicMaterial({ map: billTex, transparent: true, side: THREE.DoubleSide, opacity: 0.6 }));
        billboard.position.set(w / 2 + 0.1, h * 0.3, 0);
        billboard.rotation.y = Math.PI / 2;
        mesh.add(billboard);
      }

      mesh.userData.material = mat;
      mesh.userData.wireframe = mesh.children[0];
    }

    mesh.userData.isGlitching = false;
    mesh.userData.glitchPhase = 0;
    mesh.userData.originalPosition = mesh.position.clone();
    mesh.userData.originalScale = mesh.scale.clone();
    mesh.userData.neonColor = neonColor;

    return { mesh, height: h, width: w, depth: d, neonColor, type };
  },

  triggerGlitchDestruction(building, THREE, scene) {
    const mesh = building.mesh;
    if (mesh.userData.isGlitching) return;
    mesh.userData.isGlitching = true;
    mesh.userData.glitchPhase = 0;
  },

  updateGlitchDestruction(building, time, THREE, scene) {
    const mesh = building.mesh;
    if (!mesh.userData.isGlitching) return;
    mesh.userData.glitchPhase += 1;
    const phase = mesh.userData.glitchPhase;
    if (phase < 30) {
      mesh.position.x = mesh.userData.originalPosition.x + (Math.random() - 0.5) * 0.5;
    } else if (phase < 250) {
      const t = Math.min(1, (phase - 30) / 220);
      mesh.scale.y = mesh.userData.originalScale.y * (1 - t * 0.3 + t * 0.3);
      mesh.position.x = mesh.userData.originalPosition.x + Math.sin(phase * 0.3) * (0.3 * (1 - t));
    } else {
      mesh.userData.isGlitching = false;
      mesh.scale.copy(mesh.userData.originalScale);
      mesh.position.copy(mesh.userData.originalPosition);
    }
  },

  generateCity(count, THREE, options = {}) {
    const { spread = 320, clearZone = 20, clearPush = 28 } = options;
    const types = Object.keys(BUILDING_CONFIGS);
    const buildings = [];
    const colliders = [];
    const padding = 3;
    const streetW = 12; // street width + sidewalk margin

    // Helper: check if a new building box overlaps any existing one
    const overlaps = (minX, maxX, minZ, maxZ) => {
      for (const c of colliders) {
        if (minX < c.maxX && maxX > c.minX && minZ < c.maxZ && maxZ > c.minZ) {
          return true;
        }
      }
      return false;
    };

    // Helper: check if position is on a street
    const onStreet = (bx, bz, halfW, halfD) => {
      // N-S main road (x=0)
      if (Math.abs(bx) - halfW < streetW / 2) return true;
      // E-W main road (z=0)
      if (Math.abs(bz) - halfD < streetW / 2) return true;
      return false;
    };

    let attempts = 0;
    const maxAttempts = count * 10;

    while (buildings.length < count && attempts < maxAttempts) {
      attempts++;
      const type = types[Math.floor(Math.random() * types.length)];
      const cfg = BUILDING_CONFIGS[type] || BUILDING_CONFIGS.block;

      const estW = (cfg.wRange[0] + cfg.wRange[1]) / 2;
      const estD = (cfg.dRange[0] + cfg.dRange[1]) / 2;

      let bx = (Math.random() - 0.5) * spread;
      let bz = (Math.random() - 0.5) * spread;

      // Push away from spawn center
      if (Math.abs(bx) < clearZone && Math.abs(bz) < clearZone) {
        bx += bx >= 0 ? clearPush : -clearPush;
        bz += bz >= 0 ? clearPush : -clearPush;
      }

      const halfW = estW / 2 + padding;
      const halfD = estD / 2 + padding;

      // Skip if on a street
      if (onStreet(bx, bz, halfW, halfD)) continue;

      // Skip if overlaps another building
      if (overlaps(bx - halfW, bx + halfW, bz - halfD, bz + halfD)) continue;

      const building = BuildingFactory.create(type, bx, bz, THREE);
      buildings.push(building);
      colliders.push({
        minX: bx - building.width / 2 - padding,
        maxX: bx + building.width / 2 + padding,
        minZ: bz - building.depth / 2 - padding,
        maxZ: bz + building.depth / 2 + padding,
      });
    }
    return { buildings, colliders };
  },
};

export default BuildingFactory;
