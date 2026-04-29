// ══════════════════════════════════════════════════════
//  PROP BUILDER — Trees, rocks, lamps, benches, etc.
//  Reduced counts for smaller 250x250 world
// ══════════════════════════════════════════════════════

import { ICONIC_BUILDINGS } from '../../../constants/buildingData';

export function buildProps(scene, THREE, streetW) {
  const spread = 210;

  buildTrees(scene, THREE, streetW, spread);
  buildRocks(scene, THREE, streetW, spread);
  buildFlowers(scene, THREE, streetW, spread);
  buildLamps(scene, THREE, streetW);
  buildBenches(scene, THREE, streetW);
  buildTrashCans(scene, THREE, streetW);
  buildHydrants(scene, THREE, streetW);
}

const isNearBuilding = (x, z, minDist = 20) => {
  return ICONIC_BUILDINGS.some((b) => {
    const dx = x - b.x;
    const dz = z - b.z;
    return Math.sqrt(dx * dx + dz * dz) < minDist;
  });
};

const isNearStreet = (x, z, streetW) => {
  return Math.abs(x) < streetW + 2 || Math.abs(z) < streetW + 2;
};

function buildTrees(scene, THREE, streetW, spread) {
  // Regular trees
  for (let i = 0; i < 20; i++) {
    let tx = (Math.random() - 0.5) * spread;
    let tz = (Math.random() - 0.5) * spread;
    if (Math.abs(tx) < streetW + 3 && Math.abs(tz) < 130) continue;
    if (Math.abs(tz) < streetW + 3 && Math.abs(tx) < 130) continue;

    const treeGroup = new THREE.Group();
    const trunkH = 2 + Math.random() * 2;
    const trunkR = 0.2 + Math.random() * 0.15;
    const trunkGeo = new THREE.CylinderGeometry(trunkR, trunkR * 1.3, trunkH, 6);
    const trunkMat = new THREE.MeshPhongMaterial({ color: 0x4a3525, emissive: 0x1a0a05, shininess: 20 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = trunkH / 2;
    treeGroup.add(trunk);

    const foliageColor = [0x228855, 0x33aa66, 0x22aa44, 0x44bb55][Math.floor(Math.random() * 4)];
    const layers = 2 + Math.floor(Math.random() * 2);
    for (let l = 0; l < layers; l++) {
      const layerR = (2.5 - l * 0.6) * (0.8 + Math.random() * 0.4);
      const layerH = 2.5 - l * 0.3;
      const foliageGeo = new THREE.ConeGeometry(layerR, layerH, 5 + Math.floor(Math.random() * 3));
      const foliageMat = new THREE.MeshPhongMaterial({
        color: foliageColor, emissive: 0x112211, shininess: 30, flatShading: true,
      });
      const foliage = new THREE.Mesh(foliageGeo, foliageMat);
      foliage.position.y = trunkH + l * 1.5 + layerH / 2;
      foliage.rotation.y = Math.random() * Math.PI;
      treeGroup.add(foliage);
    }
    treeGroup.position.set(tx, 0, tz);
    scene.add(treeGroup);
  }

  // ── NEON COLORFUL TREES (cyberpunk bioluminescent) ──
  const neonTreeColors = [
    { foliage: 0xFF61D8, emissive: 0xFF0066, trunk: 0x3a2535 },  // Pink
    { foliage: 0x00F0FF, emissive: 0x0088AA, trunk: 0x1a2a35 },  // Cyan
    { foliage: 0x9D00FF, emissive: 0x6600AA, trunk: 0x2a1a35 },  // Purple
    { foliage: 0x61FFD8, emissive: 0x00AA88, trunk: 0x1a3530 },  // Mint
    { foliage: 0xFFBB33, emissive: 0xCC8800, trunk: 0x352a1a },  // Amber
    { foliage: 0xFF6600, emissive: 0xAA4400, trunk: 0x35201a },  // Orange
    { foliage: 0xD861FF, emissive: 0x8800CC, trunk: 0x2a1a35 },  // Violet
    { foliage: 0x00FF88, emissive: 0x00AA55, trunk: 0x1a3525 },  // Neon green
  ];

  for (let i = 0; i < 35; i++) {
    let tx = (Math.random() - 0.5) * spread;
    let tz = (Math.random() - 0.5) * spread;
    if (Math.abs(tx) < streetW + 3 && Math.abs(tz) < 130) continue;
    if (Math.abs(tz) < streetW + 3 && Math.abs(tx) < 130) continue;

    const neonColor = neonTreeColors[Math.floor(Math.random() * neonTreeColors.length)];
    const treeGroup = new THREE.Group();
    const trunkH = 3 + Math.random() * 3;
    const trunkR = 0.15 + Math.random() * 0.1;

    // Glowing trunk
    const trunkGeo = new THREE.CylinderGeometry(trunkR, trunkR * 1.2, trunkH, 6);
    const trunkMat = new THREE.MeshPhongMaterial({
      color: neonColor.trunk, emissive: neonColor.emissive, emissiveIntensity: 0.15, shininess: 40,
    });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = trunkH / 2;
    treeGroup.add(trunk);

    // Glowing sphere / ico foliage
    const shapeType = Math.random();
    if (shapeType < 0.4) {
      // Sphere tree
      const sphereR = 2 + Math.random() * 1.5;
      const foliageGeo = new THREE.IcosahedronGeometry(sphereR, 1);
      const foliageMat = new THREE.MeshPhongMaterial({
        color: neonColor.foliage, emissive: neonColor.emissive, emissiveIntensity: 0.3,
        transparent: true, opacity: 0.75, flatShading: true,
      });
      const foliage = new THREE.Mesh(foliageGeo, foliageMat);
      foliage.position.y = trunkH + sphereR * 0.7;
      treeGroup.add(foliage);
    } else if (shapeType < 0.7) {
      // Multi-layer neon cones
      const layers = 3;
      for (let l = 0; l < layers; l++) {
        const layerR = (3 - l * 0.8) * (0.7 + Math.random() * 0.3);
        const layerH = 2.5 - l * 0.4;
        const foliageGeo = new THREE.ConeGeometry(layerR, layerH, 6);
        const foliageMat = new THREE.MeshPhongMaterial({
          color: neonColor.foliage, emissive: neonColor.emissive, emissiveIntensity: 0.25,
          transparent: true, opacity: 0.7, flatShading: true,
        });
        const foliage = new THREE.Mesh(foliageGeo, foliageMat);
        foliage.position.y = trunkH + l * 1.8 + layerH / 2;
        foliage.rotation.y = Math.random() * Math.PI;
        treeGroup.add(foliage);
      }
    } else {
      // Crystal tree — dodecahedron top
      const crystalR = 1.5 + Math.random() * 1.5;
      const crystalGeo = new THREE.DodecahedronGeometry(crystalR, 0);
      const crystalMat = new THREE.MeshPhongMaterial({
        color: neonColor.foliage, emissive: neonColor.emissive, emissiveIntensity: 0.4,
        transparent: true, opacity: 0.6, flatShading: true, wireframe: Math.random() > 0.5,
      });
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      crystal.position.y = trunkH + crystalR;
      crystal.rotation.set(Math.random(), Math.random(), Math.random());
      treeGroup.add(crystal);
    }

    // Small point light at canopy
    const light = new THREE.PointLight(neonColor.foliage, 0.5 + Math.random() * 0.5, 8);
    light.position.y = trunkH + 2;
    treeGroup.add(light);

    treeGroup.position.set(tx, 0, tz);
    scene.add(treeGroup);
  }
}

function buildRocks(scene, THREE, streetW, spread) {
  for (let i = 0; i < 10; i++) {
    let rx = (Math.random() - 0.5) * spread;
    let rz = (Math.random() - 0.5) * spread;
    if (Math.abs(rx) < streetW + 2 && Math.abs(rz) < 130) continue;
    if (Math.abs(rz) < streetW + 2 && Math.abs(rx) < 130) continue;
    const s = 0.5 + Math.random() * 1.5;
    const rockGeos = [
      () => new THREE.DodecahedronGeometry(s, 0),
      () => new THREE.IcosahedronGeometry(s, 0),
      () => new THREE.OctahedronGeometry(s, 0),
    ];
    const rockGeo = rockGeos[Math.floor(Math.random() * 3)]();
    const rockMat = new THREE.MeshPhongMaterial({
      color: [0x665544, 0x777766, 0x555544][Math.floor(Math.random() * 3)],
      emissive: 0x111111, shininess: 15, flatShading: true,
    });
    const rock = new THREE.Mesh(rockGeo, rockMat);
    rock.position.set(rx, s * 0.4, rz);
    rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * 0.5);
    rock.scale.set(1, 0.6 + Math.random() * 0.4, 1 + Math.random() * 0.5);
    scene.add(rock);
  }
}

function buildLamps(scene, THREE, streetW) {
  const lampColor = 0xffbb33;
  const lampPositions = [
    { x: 22, z: -62 },
    { x: -26, z: 66 },
    { x: 64, z: 18 },
    { x: -68, z: -30 },
  ];
  lampPositions.forEach(({ x: lx, z: lz }) => {
    if (isNearStreet(lx, lz, streetW) || isNearBuilding(lx, lz)) return;

    const lampGroup = new THREE.Group();
    const poleMat = new THREE.MeshPhongMaterial({ color: 0x444444, emissive: 0x111111, shininess: 40 });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 7, 8), poleMat);
    pole.position.y = 3.5;
    lampGroup.add(pole);

    const arm = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.08, 0.08), poleMat);
    arm.position.set(0.75, 7, 0);
    lampGroup.add(arm);

    const housingMat = new THREE.MeshBasicMaterial({ color: lampColor, transparent: true, opacity: 0.6 });
    const housing = new THREE.Mesh(new THREE.OctahedronGeometry(0.4, 0), housingMat);
    housing.position.set(1.5, 6.8, 0);
    housing.scale.y = 0.5;
    lampGroup.add(housing);

    const lampLight = new THREE.PointLight(lampColor, 1.2, 18);
    lampLight.position.set(1.5, 6.5, 0);
    lampGroup.add(lampLight);

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.3, 8), poleMat);
    base.position.y = 0.15;
    lampGroup.add(base);

    lampGroup.position.set(lx, 0, lz);
    scene.add(lampGroup);
  });
}

function buildBenches(scene, THREE, streetW) {
  const benchMat = new THREE.MeshPhongMaterial({ color: 0x553322, emissive: 0x110500, shininess: 25 });
  const metalMat = new THREE.MeshPhongMaterial({ color: 0x555555, emissive: 0x111111, shininess: 60 });
  const benchPositions = [
    { x: -12, z: -70, rot: 0 },
    { x: 28, z: 72, rot: Math.PI / 2 },
  ];
  benchPositions.forEach(({ x: bx, z: bz, rot }) => {
    if (isNearStreet(bx, bz, streetW) || isNearBuilding(bx, bz)) return;
    const benchGroup = new THREE.Group();
    benchGroup.add(new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.12, 0.7), benchMat));
    benchGroup.children[0].position.y = 0.65;
    benchGroup.add(new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.8, 0.08), benchMat));
    benchGroup.children[1].position.set(0, 1.1, -0.3);
    for (let leg = 0; leg < 4; leg++) {
      const legM = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.65, 0.08), metalMat);
      legM.position.set((leg < 2 ? -1 : 1), 0.32, (leg % 2 === 0 ? -0.25 : 0.25));
      benchGroup.add(legM);
    }
    benchGroup.position.set(bx, 0, bz);
    benchGroup.rotation.y = rot;
    scene.add(benchGroup);
  });
}

function buildTrashCans(scene, THREE, streetW) {
  const trashPositions = [
    { x: 12, z: 46 },
    { x: -42, z: -44 },
  ];
  trashPositions.forEach(({ x: tcx, z: tcz }) => {
    if (isNearStreet(tcx, tcz, streetW) || isNearBuilding(tcx, tcz)) return;
    const trashGroup = new THREE.Group();
    const bodyMat = new THREE.MeshPhongMaterial({ color: 0x444455, emissive: 0x111115, shininess: 30 });
    trashGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.35, 1.2, 6), bodyMat));
    trashGroup.children[0].position.y = 0.6;
    const lidMat = new THREE.MeshPhongMaterial({ color: 0x555566, shininess: 50 });
    trashGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.08, 6), lidMat));
    trashGroup.children[1].position.y = 1.24;
    const neonRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.42, 0.02, 4, 6),
      new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.4 })
    );
    neonRing.position.y = 0.9; neonRing.rotation.x = Math.PI / 2;
    trashGroup.add(neonRing);
    trashGroup.position.set(tcx, 0, tcz);
    scene.add(trashGroup);
  });
}

function buildHydrants(scene, THREE, streetW) {
  const hydrantPositions = [
    { x: 40, z: -40 },
    { x: -60, z: 28 },
  ];
  hydrantPositions.forEach(({ x: hx, z: hz }) => {
    if (isNearStreet(hx, hz, streetW) || isNearBuilding(hx, hz)) return;
    const hydrantGroup = new THREE.Group();
    const mat = new THREE.MeshPhongMaterial({ color: 0xcc2222, emissive: 0x330000, shininess: 40 });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 0.8, 6), mat);
    body.position.y = 0.4;
    hydrantGroup.add(body);
    const top = new THREE.Mesh(new THREE.SphereGeometry(0.22, 6, 4, 0, Math.PI * 2, 0, Math.PI / 2), mat);
    top.position.y = 0.8;
    hydrantGroup.add(top);
    hydrantGroup.position.set(hx, 0, hz);
    scene.add(hydrantGroup);
  });
}

function buildFlowers(scene, THREE, streetW, spread) {
  const colors = [0xff61d8, 0x61ffd8, 0xffbb33, 0x00ff88, 0xd861ff];
  for (let i = 0; i < 90; i++) {
    let fx = (Math.random() - 0.5) * (spread - 10);
    let fz = (Math.random() - 0.5) * (spread - 10);
    if (isNearStreet(fx, fz, streetW) || isNearBuilding(fx, fz, 18)) continue;
    const petal = new THREE.Mesh(
      new THREE.CircleGeometry(0.25 + Math.random() * 0.15, 6),
      new THREE.MeshBasicMaterial({ color: colors[Math.floor(Math.random() * colors.length)], transparent: true, opacity: 0.65 })
    );
    petal.rotation.x = -Math.PI / 2;
    petal.position.set(fx, 0.03 + Math.random() * 0.02, fz);
    scene.add(petal);
  }
}
