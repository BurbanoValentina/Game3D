// ══════════════════════════════════════════════════════
//  BUILDING SHAPES A — Special architecture types
//  pyramid, gherkin, flatiron, twistTower, geodesic, spiral, lotus
// ══════════════════════════════════════════════════════

import { addNeonEdges } from './BuildingHelpers';

export function createPyramid(x, z, w, h, d, neonColor, tex, THREE) {
  const geo = new THREE.ConeGeometry(w / 2, h, 4);
  const mat = new THREE.MeshPhongMaterial({ map: tex, color: 0xD9CDB8, emissive: new THREE.Color(neonColor).multiplyScalar(0.04), shininess: 80, transparent: true, opacity: 0.92 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, h / 2, z);
  mesh.rotation.y = Math.PI / 4;
  addNeonEdges(mesh, geo, neonColor, THREE, 0.4);
  const tip = new THREE.PointLight(neonColor, 1.5, 15);
  tip.position.y = h / 2;
  mesh.add(tip);
  return mesh;
}

export function createGherkin(x, z, w, h, d, neonColor, tex, THREE) {
  const group = new THREE.Group();
  const segments = 8;
  const segH = h / segments;
  for (let i = 0; i < segments; i++) {
    const t = i / (segments - 1);
    const profile = 1 - 1.8 * Math.pow(t - 0.4, 2);
    const radius = (w / 2) * Math.max(0.4, profile);
    const nt = (i + 1) / (segments - 1);
    const topR = (w / 2) * Math.max(0.4, 1 - 1.8 * Math.pow(nt - 0.4, 2));
    const segGeo = new THREE.CylinderGeometry(topR, radius, segH, 8);
    const segMat = new THREE.MeshPhongMaterial({ map: tex, color: 0xD9CDB8, emissive: new THREE.Color(neonColor).multiplyScalar(0.03 + t * 0.02), shininess: 100, transparent: true, opacity: 0.9 });
    const seg = new THREE.Mesh(segGeo, segMat);
    seg.position.y = segH * i + segH / 2;
    group.add(seg);
    if (i > 0) {
      const ringGeo = new THREE.TorusGeometry(radius + 0.2, 0.08, 6, 16);
      const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: neonColor, transparent: true, opacity: 0.25 }));
      ring.position.y = segH * i; ring.rotation.x = Math.PI / 2;
      group.add(ring);
    }
  }
  const domeGeo = new THREE.SphereGeometry(w * 0.2, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  const dome = new THREE.Mesh(domeGeo, new THREE.MeshPhongMaterial({ color: neonColor, emissive: neonColor, emissiveIntensity: 0.1, transparent: true, opacity: 0.35 }));
  dome.position.y = h;
  group.add(dome);
  group.position.set(x, 0, z);
  return group;
}

export function createFlatiron(x, z, w, h, d, neonColor, tex, THREE) {
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2, -d / 2); shape.lineTo(w / 2, -d / 2); shape.lineTo(0, d / 2); shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: false });
  const mat = new THREE.MeshPhongMaterial({ map: tex, color: 0xD9CDB8, emissive: new THREE.Color(neonColor).multiplyScalar(0.04), shininess: 70, transparent: true, opacity: 0.93 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(x, 0, z);
  addNeonEdges(mesh, geo, neonColor, THREE);
  return mesh;
}

export function createTwistTower(x, z, w, h, d, neonColor, tex, THREE) {
  const group = new THREE.Group();
  const floors = 10;
  const floorH = h / floors;
  const totalTwist = Math.PI * 0.6;
  for (let i = 0; i < floors; i++) {
    const floorGeo = new THREE.BoxGeometry(w, floorH * 0.92, d);
    const floorMat = new THREE.MeshPhongMaterial({ map: tex, color: 0xD9CDB8, emissive: new THREE.Color(neonColor).multiplyScalar(0.03 + (i / floors) * 0.03), shininess: 80, transparent: true, opacity: 0.92 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = floorH * i + floorH / 2;
    floor.rotation.y = (totalTwist / floors) * i;
    addNeonEdges(floor, floorGeo, neonColor, THREE, 0.15 + (i / floors) * 0.2);
    group.add(floor);
  }
  const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 6, 4), new THREE.MeshBasicMaterial({ color: neonColor, transparent: true, opacity: 0.5 }));
  ant.position.y = h + 3;
  group.add(ant);
  group.add(new THREE.PointLight(neonColor, 2, 20)).position.y = h + 6;
  group.position.set(x, 0, z);
  return group;
}

export function createGeodesic(x, z, w, h, d, neonColor, tex, THREE) {
  const group = new THREE.Group();
  const radius = w / 2;
  const sphereGeo = new THREE.IcosahedronGeometry(radius, 1);
  const sphereMat = new THREE.MeshPhongMaterial({ map: tex, color: 0xD9CDB8, emissive: new THREE.Color(neonColor).multiplyScalar(0.05), shininess: 120, transparent: true, opacity: 0.85, flatShading: true });
  const sphere = new THREE.Mesh(sphereGeo, sphereMat);
  sphere.position.y = radius + h * 0.2;
  group.add(sphere);
  const wireGeo = new THREE.IcosahedronGeometry(radius + 0.1, 2);
  group.add(new THREE.LineSegments(new THREE.WireframeGeometry(wireGeo), new THREE.LineBasicMaterial({ color: neonColor, transparent: true, opacity: 0.35 }))).position.y = radius + h * 0.2;
  for (let i = 0; i < 4; i++) {
    const angle = (Math.PI / 2) * i + Math.PI / 4;
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.6, radius * 1.2, 6), new THREE.MeshPhongMaterial({ color: 0xD9CDB8, emissive: new THREE.Color(neonColor).multiplyScalar(0.02), shininess: 60 }));
    pillar.position.set(Math.cos(angle) * radius * 0.5, radius * 0.4, Math.sin(angle) * radius * 0.5);
    group.add(pillar);
  }
  group.add(new THREE.PointLight(neonColor, 2, radius * 3)).position.y = radius + h * 0.2;
  group.position.set(x, 0, z);
  return group;
}

export function createSpiral(x, z, w, h, d, neonColor, tex, THREE) {
  const group = new THREE.Group();
  const rings = 7;
  const ringH = h / rings;
  for (let i = 0; i < rings; i++) {
    const t = i / rings;
    const r = (w / 2) * (0.6 + t * 0.5);
    const torusGeo = new THREE.TorusGeometry(r, ringH * 0.4, 6, 12);
    const ring = new THREE.Mesh(torusGeo, new THREE.MeshPhongMaterial({ map: tex, color: 0xD9CDB8, emissive: new THREE.Color(neonColor).multiplyScalar(0.03 + t * 0.03), shininess: 90, transparent: true, opacity: 0.88 }));
    ring.position.y = ringH * i + ringH / 2; ring.rotation.x = Math.PI / 2; ring.rotation.z = t * Math.PI * 0.8;
    group.add(ring);
  }
  const col = new THREE.Mesh(new THREE.CylinderGeometry(w * 0.08, w * 0.12, h, 8), new THREE.MeshPhongMaterial({ color: 0xD9CDB8, emissive: new THREE.Color(neonColor).multiplyScalar(0.04), shininess: 60 }));
  col.position.y = h / 2;
  group.add(col);
  group.add(new THREE.PointLight(neonColor, 1.5, 20)).position.y = h + 2;
  group.position.set(x, 0, z);
  return group;
}

export function createLotus(x, z, w, h, d, neonColor, tex, THREE) {
  const group = new THREE.Group();
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 / 8) * i;
    const petalGeo = new THREE.SphereGeometry(w * 0.35, 6, 8, 0, Math.PI, 0, Math.PI * 0.6);
    const petalMat = new THREE.MeshPhongMaterial({ color: 0xD9CDB8, emissive: new THREE.Color(neonColor).multiplyScalar(0.04), shininess: 100, transparent: true, opacity: 0.85, side: THREE.DoubleSide });
    const petal = new THREE.Mesh(petalGeo, petalMat);
    petal.position.set(Math.cos(angle) * w * 0.25, h * 0.3, Math.sin(angle) * w * 0.25);
    petal.rotation.y = -angle; petal.rotation.x = -0.3; petal.scale.set(1, 1.5, 0.5);
    group.add(petal);
    const inner = petal.clone();
    inner.position.set(Math.cos(angle) * w * 0.12, h * 0.45, Math.sin(angle) * w * 0.12);
    inner.scale.set(0.6, 1.8, 0.35); inner.rotation.x = -0.6;
    group.add(inner);
  }
  const dome = new THREE.Mesh(new THREE.SphereGeometry(w * 0.15, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshPhongMaterial({ color: neonColor, emissive: neonColor, emissiveIntensity: 0.15, transparent: true, opacity: 0.4 }));
  dome.position.y = h * 0.5;
  group.add(dome);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(w * 0.5, w * 0.55, h * 0.15, 16), new THREE.MeshPhongMaterial({ color: 0xD9CDB8, emissive: new THREE.Color(neonColor).multiplyScalar(0.02), shininess: 40 }));
  base.position.y = h * 0.075;
  group.add(base);
  group.add(new THREE.PointLight(neonColor, 2, 20)).position.y = h * 0.6;
  group.position.set(x, 0, z);
  return group;
}
