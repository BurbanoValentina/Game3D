export function createTrainingRoomProps({
  THREE,
  scene,
  camera,
  floorSize,
  halfSize,
  wallHeight,
  accentColors,
}) {
  const particleCount = 600;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(particleCount * 3);
  const pCol = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * floorSize;
    pPos[i * 3 + 1] = Math.random() * wallHeight;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * floorSize;
    const c =
      [[1, 0, 0.4], [0.62, 0, 1], [1, 0.38, 0.85], [0.55, 0.37, 0.34]][
        Math.floor(Math.random() * 4)
      ];
    pCol[i * 3] = c[0];
    pCol[i * 3 + 1] = c[1];
    pCol[i * 3 + 2] = c[2];
  }

  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));

  const particles = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
    }),
  );
  scene.add(particles);

  const cratePositions = [[-8, -8], [8, -8], [-8, 8], [8, 8], [0, -12], [-12, 0], [12, 0], [0, 12]];
  cratePositions.forEach(([cx, cz], i) => {
    const size = 1.2 + Math.random() * 1;
    const crateGeo = new THREE.BoxGeometry(size, size, size);
    const crate = new THREE.Mesh(
      crateGeo,
      new THREE.MeshPhongMaterial({
        color: 0xedcfc5,
        emissive: 0xd4a99a,
        emissiveIntensity: 0.1,
        shininess: 20,
        transparent: true,
        opacity: 0.85,
      }),
    );
    crate.position.set(cx, size / 2, cz);
    crate.castShadow = true;
    scene.add(crate);
    crate.add(
      new THREE.LineSegments(
        new THREE.EdgesGeometry(crateGeo),
        new THREE.LineBasicMaterial({
          color: accentColors[i % accentColors.length],
          transparent: true,
          opacity: 0.3,
        }),
      ),
    );
  });

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(3, 0.12, 16, 48),
    new THREE.MeshBasicMaterial({
      color: 0xff0066,
      transparent: true,
      opacity: 0.12,
    }),
  );
  ring.position.set(0, wallHeight - 2, 0);
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);

  const boundary = halfSize - 1.5;

  const crateColliders = cratePositions.map(([cx, cz]) => ({
    minX: cx - 1.5,
    maxX: cx + 1.5,
    minZ: cz - 1.5,
    maxZ: cz + 1.5,
  }));

  const checkCollision = (x, z) =>
    crateColliders.some((c) => x > c.minX && x < c.maxX && z > c.minZ && z < c.maxZ);

  const player = {
    position: camera.position,
    velocity: { x: 0, y: 0, z: 0 },
    speed: 0.22,
    sprintSpeed: 0.42,
    jumpForce: 0.32,
    grounded: true,
    yaw: 0,
    pitch: 0,
  };

  const mouseState = { x: 0, y: 0 };

  return {
    particles,
    ring,
    boundary,
    checkCollision,
    player,
    mouseState,
  };
}
