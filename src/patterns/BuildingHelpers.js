// ══════════════════════════════════════════════════════
//  BUILDING HELPERS — Shared utilities
//  Neon edges, flag creation, label signs
// ══════════════════════════════════════════════════════

export function addNeonEdges(mesh, geo, neonColor, THREE, opacity = 0.3) {
  const edges = new THREE.EdgesGeometry(geo);
  mesh.add(new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
    color: neonColor, transparent: true, opacity,
  })));
}

/**
 * Creates a flat ground plaque (flag + name sign) at the base of a building
 */
export function createBuildingFlag(buildingData, buildingHeight, THREE, scene) {
  const { x, z, name, location, flagColors } = buildingData;
  const group = new THREE.Group();

  // Flat flag decal on the ground
  const flagCanvas = document.createElement('canvas');
  flagCanvas.width = 128; flagCanvas.height = 80;
  const fCtx = flagCanvas.getContext('2d');
  const stripeW = 128 / flagColors.length;
  flagColors.forEach((c, i) => {
    fCtx.fillStyle = c;
    fCtx.fillRect(i * stripeW, 0, stripeW, 80);
  });
  fCtx.fillStyle = 'rgba(255,255,255,0.1)';
  fCtx.fillRect(0, 0, 128, 80);

  const flagTex = new THREE.CanvasTexture(flagCanvas);
  const flagMat = new THREE.MeshBasicMaterial({
    map: flagTex, transparent: true, opacity: 0.95, side: THREE.DoubleSide,
  });
  const flagGeo = new THREE.PlaneGeometry(5, 3);
  const flag = new THREE.Mesh(flagGeo, flagMat);
  flag.rotation.x = -Math.PI / 2; // lay flat on ground
  flag.position.set(0, 0.16, -2.5);
  group.add(flag);

  // Flat name sign on the ground next to the flag
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 512; signCanvas.height = 128;
  const sCtx = signCanvas.getContext('2d');
  sCtx.fillStyle = 'rgba(10,10,20,0.9)';
  sCtx.fillRect(0, 0, 512, 128);
  sCtx.strokeStyle = '#00f0ff';
  sCtx.lineWidth = 3;
  sCtx.strokeRect(2, 2, 508, 124);
  sCtx.font = 'bold 36px monospace';
  sCtx.fillStyle = '#ffffff';
  sCtx.shadowColor = '#00f0ff';
  sCtx.shadowBlur = 12;
  sCtx.textAlign = 'center';
  sCtx.fillText(name, 256, 55);
  sCtx.font = '22px monospace';
  sCtx.fillStyle = '#00f0ff';
  sCtx.shadowBlur = 6;
  sCtx.fillText(location, 256, 95);
  sCtx.shadowBlur = 0;
  sCtx.fillStyle = '#ffbb33';
  sCtx.fillRect(4, 4, 10, 3); sCtx.fillRect(4, 4, 3, 10);
  sCtx.fillRect(498, 4, 10, 3); sCtx.fillRect(505, 4, 3, 10);
  sCtx.fillRect(4, 121, 10, 3); sCtx.fillRect(4, 114, 3, 10);
  sCtx.fillRect(498, 121, 10, 3); sCtx.fillRect(505, 114, 3, 10);

  const signTex = new THREE.CanvasTexture(signCanvas);
  const signMat = new THREE.MeshBasicMaterial({
    map: signTex, transparent: true, side: THREE.DoubleSide, opacity: 0.95,
  });
  const signGeo = new THREE.PlaneGeometry(8, 2);
  const sign = new THREE.Mesh(signGeo, signMat);
  sign.rotation.x = -Math.PI / 2;
  sign.position.set(0, 0.17, 1.5);
  group.add(sign);

  // Position the group on the ground at the building's base (offset slightly outward)
  group.position.set(x, 0, z);
  group.userData.isBillboard = false;

  scene.add(group);
  return group;
}
