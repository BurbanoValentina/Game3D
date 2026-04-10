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
 * Creates a flag pole with name sign on top of a building
 */
export function createBuildingFlag(buildingData, buildingHeight, THREE, scene) {
  const { x, z, name, location, flagColors } = buildingData;
  const group = new THREE.Group();

  // Flag pole
  const poleH = 8;
  const poleMat = new THREE.MeshPhongMaterial({ color: 0x888888, shininess: 60 });
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, poleH, 6), poleMat);
  pole.position.y = poleH / 2;
  group.add(pole);

  // Pole top ball
  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 8, 8),
    new THREE.MeshPhongMaterial({ color: 0xffbb33, emissive: 0xaa7700, shininess: 100 })
  );
  ball.position.y = poleH;
  group.add(ball);

  // Flag (3 color stripes)
  const flagCanvas = document.createElement('canvas');
  flagCanvas.width = 128; flagCanvas.height = 80;
  const fCtx = flagCanvas.getContext('2d');
  const stripeW = 128 / flagColors.length;
  flagColors.forEach((c, i) => {
    fCtx.fillStyle = c;
    fCtx.fillRect(i * stripeW, 0, stripeW, 80);
  });
  // Add slight transparency
  fCtx.fillStyle = 'rgba(255,255,255,0.1)';
  fCtx.fillRect(0, 0, 128, 80);

  const flagTex = new THREE.CanvasTexture(flagCanvas);
  const flagMat = new THREE.MeshBasicMaterial({
    map: flagTex, transparent: true, opacity: 0.9,
    side: THREE.DoubleSide,
  });
  const flagGeo = new THREE.PlaneGeometry(3, 1.8);
  const flag = new THREE.Mesh(flagGeo, flagMat);
  flag.position.set(1.6, poleH - 1, 0);
  group.add(flag);

  // Name sign below flag
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 512; signCanvas.height = 128;
  const sCtx = signCanvas.getContext('2d');
  // Background
  sCtx.fillStyle = 'rgba(10,10,20,0.85)';
  sCtx.fillRect(0, 0, 512, 128);
  // Border
  sCtx.strokeStyle = '#00f0ff';
  sCtx.lineWidth = 2;
  sCtx.strokeRect(2, 2, 508, 124);
  // Name
  sCtx.font = 'bold 28px monospace';
  sCtx.fillStyle = '#ffffff';
  sCtx.shadowColor = '#00f0ff';
  sCtx.shadowBlur = 10;
  sCtx.textAlign = 'center';
  sCtx.fillText(name, 256, 50);
  // Location
  sCtx.font = '18px monospace';
  sCtx.fillStyle = '#00f0ff';
  sCtx.shadowBlur = 5;
  sCtx.fillText(location, 256, 90);
  sCtx.shadowBlur = 0;
  // Corner decorations
  sCtx.fillStyle = '#ffbb33';
  sCtx.fillRect(4, 4, 8, 2); sCtx.fillRect(4, 4, 2, 8);
  sCtx.fillRect(500, 4, 8, 2); sCtx.fillRect(506, 4, 2, 8);
  sCtx.fillRect(4, 122, 8, 2); sCtx.fillRect(4, 116, 2, 8);
  sCtx.fillRect(500, 122, 8, 2); sCtx.fillRect(506, 116, 2, 8);

  const signTex = new THREE.CanvasTexture(signCanvas);
  const signMat = new THREE.MeshBasicMaterial({
    map: signTex, transparent: true, side: THREE.DoubleSide, opacity: 0.95,
  });
  const signGeo = new THREE.PlaneGeometry(6, 1.5);
  const sign = new THREE.Mesh(signGeo, signMat);
  sign.position.set(0, -1.5, 0);
  group.add(sign);

  // Position the group on top of the building
  group.position.set(x, buildingHeight + 1, z);

  // Make sign always face camera by adding billboard behavior
  group.userData.isBillboard = true;

  scene.add(group);
  return group;
}
