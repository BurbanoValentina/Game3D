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
 * Creates flag + name sign positioned BESIDE the building (not underneath)
 * Flag stands upright on a pole, sign is a vertical panel next to the building
 */
export function createBuildingFlag(buildingData, buildingHeight, buildingWidth, buildingDepth, THREE, scene) {
  const { x, z, name, location, flagColors } = buildingData;
  const group = new THREE.Group();

  // Offset to place elements outside the building footprint
  const offsetX = buildingWidth / 2 + 4;

  // ── Flag on a pole (vertical, beside the building) ──
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
  const flagGeo = new THREE.PlaneGeometry(4, 2.5);
  const flag = new THREE.Mesh(flagGeo, flagMat);
  flag.position.set(2, 7, 0); // Up on the pole, offset from pole center
  group.add(flag);

  // Flag pole
  const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 9, 6);
  const poleMat = new THREE.MeshPhongMaterial({ color: 0x888888, emissive: 0x222222 });
  const pole = new THREE.Mesh(poleGeo, poleMat);
  pole.position.set(0, 4.5, 0);
  group.add(pole);

  // ── Name sign (vertical panel beside the building) ──
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 512; signCanvas.height = 128;
  const sCtx = signCanvas.getContext('2d');
  sCtx.fillStyle = 'rgba(10,10,20,0.92)';
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
  // Corner accents
  sCtx.fillStyle = '#ffbb33';
  sCtx.fillRect(4, 4, 10, 3); sCtx.fillRect(4, 4, 3, 10);
  sCtx.fillRect(498, 4, 10, 3); sCtx.fillRect(505, 4, 3, 10);
  sCtx.fillRect(4, 121, 10, 3); sCtx.fillRect(4, 114, 3, 10);
  sCtx.fillRect(498, 121, 10, 3); sCtx.fillRect(505, 114, 3, 10);

  const signTex = new THREE.CanvasTexture(signCanvas);
  const signMat = new THREE.MeshBasicMaterial({
    map: signTex, transparent: true, side: THREE.DoubleSide, opacity: 0.95,
  });
  const signGeo = new THREE.PlaneGeometry(7, 1.8);
  const sign = new THREE.Mesh(signGeo, signMat);
  sign.position.set(0, 2.2, 0); // Vertical, lower than flag
  group.add(sign);

  // Neon glow line under the sign
  const glowGeo = new THREE.PlaneGeometry(7, 0.1);
  const glowMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.4 });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  glow.position.set(0, 1.25, 0);
  group.add(glow);

  // Position the group BESIDE the building (not on top of it)
  group.position.set(x + offsetX, 0, z);
  group.userData.isBillboard = true; // Face the player

  scene.add(group);
  return group;
}
