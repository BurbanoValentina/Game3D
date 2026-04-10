// ══════════════════════════════════════════════════════
//  BUILDING SHAPES B — More architecture types
//  habitat, dome, cubeHouse, radialTower, standard box
// ══════════════════════════════════════════════════════

import { addNeonEdges } from './BuildingHelpers';

export function createHabitat(x, z, w, h, d, neonColor, tex, THREE) {
  const group = new THREE.Group();
  const cubeSize = w * 0.25;
  const layers = Math.floor(h / cubeSize);
  for (let layer = 0; layer < layers; layer++) {
    const count = Math.max(1, 4 - layer);
    for (let c = 0; c < count; c++) {
      const cubeGeo = new THREE.BoxGeometry(
        cubeSize * (0.8 + Math.random() * 0.4),
        cubeSize * (0.7 + Math.random() * 0.5),
        cubeSize * (0.8 + Math.random() * 0.4)
      );
      const cubeMat = new THREE.MeshPhongMaterial({
        map: tex, color: 0xD9CDB8,
        emissive: new THREE.Color(neonColor).multiplyScalar(0.03 + Math.random() * 0.03),
        shininess: 70, transparent: true, opacity: 0.9,
      });
      const cube = new THREE.Mesh(cubeGeo, cubeMat);
      const ox = (c - count / 2) * cubeSize * 1.1 + (Math.random() - 0.5) * cubeSize * 0.3;
      cube.position.set(ox, layer * cubeSize * 0.9 + cubeSize / 2, (Math.random() - 0.5) * cubeSize * 0.6);
      cube.rotation.y = Math.random() * 0.3 - 0.15;
      addNeonEdges(cube, cubeGeo, neonColor, THREE, 0.2 + Math.random() * 0.2);
      group.add(cube);
    }
  }
  for (let i = 0; i < 3; i++) {
    const bridge = new THREE.Mesh(
      new THREE.BoxGeometry(cubeSize * 0.15, cubeSize * 0.1, cubeSize * 0.8),
      new THREE.MeshBasicMaterial({ color: neonColor, transparent: true, opacity: 0.2 })
    );
    bridge.position.set((Math.random() - 0.5) * w * 0.3, cubeSize * (1 + i) * 0.9, 0);
    group.add(bridge);
  }
  group.position.set(x, 0, z);
  return group;
}

export function createDome(x, z, w, h, d, neonColor, tex, THREE) {
  const group = new THREE.Group();
  const rx = w / 2, ry = h * 0.8, rz = d / 2;
  const domeGeo = new THREE.SphereGeometry(1, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2);
  const domeMat = new THREE.MeshPhongMaterial({
    map: tex, color: 0xD9CDB8, emissive: new THREE.Color(neonColor).multiplyScalar(0.05),
    shininess: 120, transparent: true, opacity: 0.8,
  });
  const dome = new THREE.Mesh(domeGeo, domeMat);
  dome.scale.set(rx, ry, rz);
  group.add(dome);
  for (let i = 1; i <= 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(rx * (0.3 + i * 0.2), 0.06, 4, 32),
      new THREE.MeshBasicMaterial({ color: neonColor, transparent: true, opacity: 0.3 })
    );
    ring.position.y = ry * (i * 0.2); ring.rotation.x = Math.PI / 2;
    ring.scale.set(1, 1, rz / rx);
    group.add(ring);
  }
  const pool = new THREE.Mesh(
    new THREE.CylinderGeometry(rx * 1.2, rx * 1.2, 0.3, 32),
    new THREE.MeshPhongMaterial({ color: 0x1a2a3a, emissive: new THREE.Color(neonColor).multiplyScalar(0.03), shininess: 200, transparent: true, opacity: 0.5 })
  );
  pool.position.y = -0.15;
  group.add(pool);
  group.add(new THREE.PointLight(neonColor, 1.5, rx * 3)).position.y = ry * 0.5;
  group.position.set(x, 0, z);
  return group;
}

export function createCubeHouse(x, z, w, h, d, neonColor, tex, THREE) {
  const group = new THREE.Group();
  const cubeSize = w * 0.7;
  const pillarH = h * 0.5;
  const cubes = 3 + Math.floor(Math.random() * 2);
  for (let i = 0; i < cubes; i++) {
    const px = (i - cubes / 2) * cubeSize * 0.9;
    const pillar = new THREE.Mesh(
      new THREE.CylinderGeometry(cubeSize * 0.08, cubeSize * 0.12, pillarH, 6),
      new THREE.MeshPhongMaterial({ color: 0xD9CDB8, emissive: new THREE.Color(neonColor).multiplyScalar(0.02), shininess: 60 })
    );
    pillar.position.set(px, pillarH / 2, 0);
    group.add(pillar);
    const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cube = new THREE.Mesh(cubeGeo, new THREE.MeshPhongMaterial({
      map: tex, color: 0xD9CDB8, emissive: new THREE.Color(neonColor).multiplyScalar(0.04),
      shininess: 80, transparent: true, opacity: 0.9,
    }));
    cube.position.set(px, pillarH + cubeSize * 0.35, 0);
    cube.rotation.set(Math.PI / 4, 0, Math.PI / 4);
    addNeonEdges(cube, cubeGeo, neonColor, THREE, 0.35);
    group.add(cube);
  }
  for (let i = 0; i < cubes - 1; i++) {
    const bridge = new THREE.Mesh(
      new THREE.BoxGeometry(cubeSize * 0.7, cubeSize * 0.06, cubeSize * 0.15),
      new THREE.MeshBasicMaterial({ color: neonColor, transparent: true, opacity: 0.2 })
    );
    bridge.position.set((i - cubes / 2 + 0.5) * cubeSize * 0.9, pillarH + cubeSize * 0.1, 0);
    group.add(bridge);
  }
  group.position.set(x, 0, z);
  return group;
}

export function createRadialTower(x, z, w, h, d, neonColor, tex, THREE) {
  const group = new THREE.Group();
  const sections = 5;
  let currentH = 0;
  for (let s = 0; s < sections; s++) {
    const t = s / sections;
    const sH = (h / sections) * (1 - t * 0.15);
    const radius = (w / 2) * (1 - t * 0.5);
    for (let wing = 0; wing < 3; wing++) {
      const angle = (Math.PI * 2 / 3) * wing;
      const wingGeo = new THREE.BoxGeometry(radius * 0.35, sH, radius * 1.2);
      const wingMesh = new THREE.Mesh(wingGeo, new THREE.MeshPhongMaterial({
        map: tex, color: 0xD9CDB8, emissive: new THREE.Color(neonColor).multiplyScalar(0.03 + t * 0.04),
        shininess: 90, transparent: true, opacity: 0.9,
      }));
      wingMesh.position.set(Math.cos(angle) * radius * 0.3, currentH + sH / 2, Math.sin(angle) * radius * 0.3);
      wingMesh.rotation.y = angle;
      addNeonEdges(wingMesh, wingGeo, neonColor, THREE, 0.2);
      group.add(wingMesh);
    }
    const core = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.2, radius * 0.25, sH, 6),
      new THREE.MeshPhongMaterial({ color: 0xD9CDB8, emissive: new THREE.Color(neonColor).multiplyScalar(0.04), shininess: 80, transparent: true, opacity: 0.9 })
    );
    core.position.y = currentH + sH / 2;
    group.add(core);
    currentH += sH;
  }
  const spire = new THREE.Mesh(new THREE.ConeGeometry(w * 0.04, h * 0.2, 4), new THREE.MeshBasicMaterial({ color: neonColor, transparent: true, opacity: 0.6 }));
  spire.position.y = currentH + h * 0.1;
  group.add(spire);
  group.add(new THREE.PointLight(neonColor, 3, 30)).position.y = currentH + h * 0.2;
  group.position.set(x, 0, z);
  return group;
}

export function createStandardBox(x, z, w, h, d, neonColor, tex, THREE) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshPhongMaterial({
    map: tex, color: 0xD9CDB8, emissive: new THREE.Color(neonColor).multiplyScalar(0.03),
    shininess: 60, transparent: true, opacity: 0.95, specular: new THREE.Color(0x333333),
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, h / 2, z);
  mesh.castShadow = true; mesh.receiveShadow = true;
  addNeonEdges(mesh, geo, neonColor, THREE, 0.25 + Math.random() * 0.3);
  const strip = new THREE.Mesh(new THREE.BoxGeometry(w * 0.8, 0.3, d * 0.8), new THREE.MeshBasicMaterial({ color: neonColor, transparent: true, opacity: 0.15 }));
  strip.position.y = h / 2 + 0.2;
  mesh.add(strip);
  if (h > 40) {
    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 8, 4), new THREE.MeshBasicMaterial({ color: neonColor, transparent: true, opacity: 0.4 }));
    antenna.position.y = h / 2 + 4;
    mesh.add(antenna);
  }
  return mesh;
}
