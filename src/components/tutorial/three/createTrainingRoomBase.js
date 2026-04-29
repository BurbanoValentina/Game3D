export function createTrainingRoomBase({ THREE, container }) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xfff5f0);
  scene.fog = new THREE.FogExp2(0xfff5f0, 0.012);

  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    200,
  );
  camera.position.set(0, 3, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  const accentColors = [0xff61d8, 0x61ffd8, 0xd861ff, 0x00ff88, 0xff0066, 0xffbb33];

  const ambient = new THREE.AmbientLight(0xfff5f0, 0.8);
  scene.add(ambient);

  const mainLight = new THREE.PointLight(0xff0066, 1.8, 50);
  mainLight.position.set(0, 12, 0);
  mainLight.castShadow = true;
  scene.add(mainLight);

  const accentLights = [];
  accentColors.forEach((color, i) => {
    const angle = (i / accentColors.length) * Math.PI * 2;
    const light = new THREE.PointLight(color, 0.8, 30);
    light.position.set(Math.cos(angle) * 18, 5, Math.sin(angle) * 18);
    scene.add(light);
    accentLights.push({ light, phase: i * 1.1 });
  });

  const floorSize = 40;
  const halfSize = floorSize / 2;
  const wallHeight = 15;

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(floorSize, floorSize),
    new THREE.MeshPhongMaterial({
      color: 0xf5e1da,
      emissive: 0xedcfc5,
      emissiveIntensity: 0.15,
      shininess: 40,
      specular: 0xffffff,
    }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const gridHelper = new THREE.GridHelper(floorSize, 40, 0xff0066, 0xff0066);
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.06;
  gridHelper.position.y = 0.02;
  scene.add(gridHelper);

  const wallMat = new THREE.MeshPhongMaterial({
    color: 0xedcfc5,
    emissive: 0xd4a99a,
    emissiveIntensity: 0.1,
    shininess: 15,
    transparent: true,
    opacity: 0.92,
  });

  [
    { pos: [0, wallHeight / 2, -halfSize], rot: [0, 0, 0] },
    { pos: [0, wallHeight / 2, halfSize], rot: [0, Math.PI, 0] },
    { pos: [-halfSize, wallHeight / 2, 0], rot: [0, Math.PI / 2, 0] },
    { pos: [halfSize, wallHeight / 2, 0], rot: [0, -Math.PI / 2, 0] },
  ].forEach((cfg) => {
    const geo = new THREE.PlaneGeometry(floorSize, wallHeight);
    const wall = new THREE.Mesh(geo, wallMat.clone());
    wall.position.set(...cfg.pos);
    wall.rotation.set(...cfg.rot);
    wall.receiveShadow = true;
    scene.add(wall);

    wall.add(
      new THREE.LineSegments(
        new THREE.EdgesGeometry(geo),
        new THREE.LineBasicMaterial({
          color: 0xff0066,
          transparent: true,
          opacity: 0.08,
        }),
      ),
    );
  });

  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(floorSize, floorSize),
    new THREE.MeshPhongMaterial({
      color: 0xfff5f0,
      emissive: 0xf5e1da,
      emissiveIntensity: 0.1,
      side: THREE.DoubleSide,
    }),
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = wallHeight;
  scene.add(ceiling);

  const createWallText = (text, x, y, z, rotY, color) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 512, 128);
    ctx.font = 'bold 36px monospace';
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 20;
    ctx.textAlign = 'center';
    ctx.fillText(text, 256, 75);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      side: THREE.DoubleSide,
      opacity: 0.8,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(10, 2.5), mat);
    mesh.position.set(x, y, z);
    mesh.rotation.y = rotY;
    scene.add(mesh);
  };

  createWallText('SALA DE ENTRENAMIENTO', 0, 10, -halfSize + 0.2, 0, '#FF0066');
  createWallText(
    'OASIS // TRAINING',
    halfSize - 0.2,
    10,
    0,
    -Math.PI / 2,
    '#9D00FF',
  );
  createWallText('EVA_STRIDER_∞', -halfSize + 0.2, 10, 0, Math.PI / 2, '#FF0066');
  createWallText('PREPARACIÓN', 0, 10, halfSize - 0.2, Math.PI, '#8B5E55');

  [[-14, -14], [14, -14], [-14, 14], [14, 14], [-14, 0], [14, 0], [0, -14], [0, 14]].forEach(
    ([px, pz]) => {
      const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, wallHeight, 6),
        new THREE.MeshPhongMaterial({
          color: 0xff0066,
          emissive: 0xd4a99a,
          transparent: true,
          opacity: 0.08,
          wireframe: true,
        }),
      );
      pillar.position.set(px, wallHeight / 2, pz);
      scene.add(pillar);
    },
  );

  return {
    scene,
    camera,
    renderer,
    mainLight,
    accentLights,
    accentColors,
    floorSize,
    halfSize,
    wallHeight,
  };
}
