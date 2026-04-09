'use client';

// ══════════════════════════════════════════════════════
//  TUTORIAL GAME 3D — Rose/Cream Training Room
//  Light environment with neon accents
// ══════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameStates } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';

// ─── TUTORIAL STEPS ───
const TUTORIAL_STEPS = [
  { id: 0, icon: 'INIT', title: 'SALA DE ENTRENAMIENTO', instruction: 'Protocolo de calibración iniciado. Captura el cursor para activar los controles.', subtext: 'Haz clic en la pantalla para continuar.', type: 'click' },
  { id: 1, icon: 'CAM', title: 'CONTROL VISUAL', instruction: 'Mueve el mouse para ajustar el campo de visión. Reconoce el entorno antes de avanzar.', subtext: 'Mueve el mouse para continuar', type: 'mouse', requiredMouseMove: 300 },
  { id: 2, icon: 'MOV', title: 'DESPLAZAMIENTO', instruction: 'Usa W, A, S y D para desplazarte. W avanza, S retrocede, A y D controlan el movimiento lateral.', subtext: 'Desplázate usando WASD', type: 'move', requiredKeys: ['KeyW', 'KeyA', 'KeyS', 'KeyD'], requiredUnique: 3 },
  { id: 3, icon: 'RUN', title: 'VELOCIDAD', instruction: 'Mantén SHIFT mientras te desplazas para aumentar la velocidad. Necesario para cubrir distancias largas.', subtext: 'Mantén SHIFT + W para correr', type: 'sprint', holdDuration: 1500 },
  { id: 4, icon: 'JMP', title: 'SALTO', instruction: 'Presiona ESPACIO para saltar. Indispensable para superar obstáculos y alcanzar plataformas elevadas.', subtext: 'Ejecuta 2 saltos', type: 'jump', requiredCount: 2 },
  { id: 5, icon: 'END', title: 'CALIBRACIÓN COMPLETA', instruction: 'Los controles básicos han sido registrados. Eva está lista para ingresar al OASIS.', subtext: 'Presiona ENTER o haz clic para continuar', type: 'final' },
];

// ─── NOTIFICATION COMPONENT ───
function TutorialNotification({ step, progress, totalSteps, onSkip }) {
  if (!step) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center pointer-events-none pb-8 px-4">
      <div className="w-full max-w-lg mb-4 pointer-events-auto">
        <div className="flex items-center justify-between mb-1">
          <span className="font-sharetm text-[9px] tracking-[0.4em]" style={{ color: 'var(--bronze)' }}>CALIBRACIÓN — {step.id + 1}/{totalSteps}</span>
          <button onClick={onSkip} className="font-orbitron text-[10px] tracking-widest px-3 py-1 rounded transition-all hover:scale-105 cursor-pointer"
            style={{ color: 'var(--neon-magenta)', background: 'rgba(255,240,235,0.85)', border: '1px solid rgba(255,0,102,0.2)', backdropFilter: 'blur(10px)' }}>SALTAR</button>
        </div>
        <div className="w-full h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(255,0,102,0.08)' }}>
          <div className="h-full rounded-full transition-all duration-500" style={{
            width: `${((step.id + 1) / totalSteps) * 100}%`,
            background: 'linear-gradient(90deg, var(--neon-magenta), var(--neon-violet))',
            boxShadow: '0 0 8px rgba(255,0,102,0.3)',
          }} />
        </div>
      </div>

      <div className="w-full max-w-lg rounded-lg p-5 pointer-events-auto animate-fade-in-up" key={step.id}
        style={{ background: 'rgba(255,245,240,0.95)', border: '1px solid rgba(255,0,102,0.12)', boxShadow: '0 0 30px rgba(255,0,102,0.05)', backdropFilter: 'blur(15px)' }}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(255,0,102,0.06)', border: '1px solid rgba(255,0,102,0.18)' }}>
            <span className="font-orbitron text-[9px] tracking-wider font-bold" style={{ color: 'var(--neon-magenta)' }}>{step.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-orbitron text-sm tracking-widest mb-1" style={{ color: 'var(--neon-magenta)', textShadow: '0 0 8px rgba(255,0,102,0.3)' }}>{step.title}</h3>
            <p className="font-rajdhani text-sm leading-relaxed" style={{ color: 'var(--dark)' }}>{step.instruction}</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-all duration-300" style={{
                  width: `${Math.min(progress, 100)}%`,
                  background: progress >= 100 ? 'var(--neon-green)' : 'linear-gradient(90deg, var(--neon-magenta), var(--neon-violet))',
                  boxShadow: progress >= 100 ? '0 0 8px var(--neon-green)' : '0 0 5px rgba(255,0,102,0.3)',
                }} />
              </div>
              <span className="font-sharetm text-[10px] tracking-widest flex-shrink-0" style={{ color: 'var(--neon-amber)' }}>{step.subtext}</span>
            </div>
          </div>
        </div>
      </div>

      {step.type === 'click' && (
        <p className="font-sharetm text-[10px] tracking-widest mt-3 animate-pulse" style={{ color: 'rgba(255,0,102,0.5)' }}>HAZ CLIC EN LA PANTALLA PARA COMENZAR</p>
      )}
    </div>
  );
}

function SuccessFlash({ show }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center pointer-events-none animate-fade-in-up">
      <div className="px-8 py-4 rounded-lg" style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', boxShadow: '0 0 40px rgba(0,255,136,0.15)' }}>
        <span className="font-orbitron text-xl tracking-[0.3em]" style={{ color: 'var(--neon-green)', textShadow: '0 0 15px rgba(0,255,136,0.5)' }}>COMPLETADO</span>
      </div>
    </div>
  );
}

function Crosshair() {
  return (
    <div className="fixed inset-0 z-[50] flex items-center justify-center pointer-events-none">
      <svg width="28" height="28" viewBox="0 0 28 28">
        <line x1="14" y1="2" x2="14" y2="8" stroke="#FF0066" strokeWidth="1" opacity="0.5" />
        <line x1="14" y1="20" x2="14" y2="26" stroke="#FF0066" strokeWidth="1" opacity="0.5" />
        <line x1="2" y1="14" x2="8" y2="14" stroke="#FF0066" strokeWidth="1" opacity="0.5" />
        <line x1="20" y1="14" x2="26" y2="14" stroke="#FF0066" strokeWidth="1" opacity="0.5" />
        <circle cx="14" cy="14" r="2" fill="#FF0066" opacity="0.6"><animate attributeName="r" values="1.5;2.5;1.5" dur="2s" repeatCount="indefinite" /></circle>
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════
export default function TutorialGame() {
  const setGameState = useGameStore((s) => s.setGameState);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pointerLocked, setPointerLocked] = useState(false);

  const mountRef = useRef(null);
  const gameRef = useRef(null);
  const stepRef = useRef(0);
  const progressRef = useRef(0);
  const keysUsed = useRef(new Set());
  const jumpCount = useRef(0);
  const mouseAccum = useRef(0);
  const sprintStart = useRef(null);
  const sprintDone = useRef(false);
  const keysDown = useRef({});
  const advancingRef = useRef(false);

  const step = TUTORIAL_STEPS[currentStep];
  const totalSteps = TUTORIAL_STEPS.length;

  useEffect(() => { stepRef.current = currentStep; }, [currentStep]);
  useEffect(() => { progressRef.current = progress; }, [progress]);

  const advanceStep = useCallback(() => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      advancingRef.current = false;
      setCurrentStep((s) => {
        const next = s + 1;
        if (next < TUTORIAL_STEPS.length) {
          setProgress(0); progressRef.current = 0; keysUsed.current = new Set();
          jumpCount.current = 0; mouseAccum.current = 0; sprintStart.current = null; sprintDone.current = false;
        }
        return Math.min(next, TUTORIAL_STEPS.length - 1);
      });
    }, 900);
  }, []);

  const handleSkip = useCallback(async () => {
    if (document.pointerLockElement) document.exitPointerLock();
    setGameState(GameStates.TRAINING_ROOM);
  }, [setGameState]);

  const handleFinish = useCallback(async () => {
    if (document.pointerLockElement) document.exitPointerLock();
    setGameState(GameStates.TRAINING_ROOM);
  }, [setGameState]);

  // ═══════════════════════════════════════
  //  THREE.JS DARK CYBERPUNK TRAINING ROOM
  // ═══════════════════════════════════════
  useEffect(() => {
    if (!mountRef.current || gameRef.current) return;
    const container = mountRef.current;
    let animId;
    let disposed = false;

    (async () => {
      const THREE = await import('three');

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xFFF5F0);
      scene.fog = new THREE.FogExp2(0xFFF5F0, 0.012);

      const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 200);
      camera.position.set(0, 3, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      container.appendChild(renderer.domElement);

      // Lighting
      const ambient = new THREE.AmbientLight(0xFFF5F0, 0.8);
      scene.add(ambient);

      const mainLight = new THREE.PointLight(0xFF0066, 1.8, 50);
      mainLight.position.set(0, 12, 0);
      mainLight.castShadow = true;
      scene.add(mainLight);

      const accentColors = [0xFF61D8, 0x61FFD8, 0xD861FF, 0x00FF88, 0xFF0066, 0xFFBB33];
      const accentLights = [];
      accentColors.forEach((color, i) => {
        const angle = (i / accentColors.length) * Math.PI * 2;
        const light = new THREE.PointLight(color, 0.8, 30);
        light.position.set(Math.cos(angle) * 18, 5, Math.sin(angle) * 18);
        scene.add(light);
        accentLights.push({ light, phase: i * 1.1 });
      });

      // Floor
      const floorSize = 40;
      const floorGeo = new THREE.PlaneGeometry(floorSize, floorSize);
      const floorMat = new THREE.MeshPhongMaterial({ color: 0xF5E1DA, emissive: 0xEDCFC5, emissiveIntensity: 0.15, shininess: 40, specular: 0xFFFFFF });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      scene.add(floor);

      const gridHelper = new THREE.GridHelper(floorSize, 40, 0xFF0066, 0xFF0066);
      gridHelper.material.transparent = true;
      gridHelper.material.opacity = 0.06;
      gridHelper.position.y = 0.02;
      scene.add(gridHelper);

      // Walls
      const wallHeight = 15;
      const halfSize = floorSize / 2;
      const wallMat = new THREE.MeshPhongMaterial({ color: 0xEDCFC5, emissive: 0xD4A99A, emissiveIntensity: 0.1, shininess: 15, transparent: true, opacity: 0.92 });

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
        const edgeGeo = new THREE.EdgesGeometry(geo);
        const edgeMat = new THREE.LineBasicMaterial({ color: 0xFF0066, transparent: true, opacity: 0.08 });
        wall.add(new THREE.LineSegments(edgeGeo, edgeMat));
      });

      // Ceiling
      const ceilGeo = new THREE.PlaneGeometry(floorSize, floorSize);
      const ceilMat = new THREE.MeshPhongMaterial({ color: 0xFFF5F0, emissive: 0xF5E1DA, emissiveIntensity: 0.1, side: THREE.DoubleSide });
      const ceiling = new THREE.Mesh(ceilGeo, ceilMat);
      ceiling.rotation.x = Math.PI / 2;
      ceiling.position.y = wallHeight;
      scene.add(ceiling);

      // Wall text
      function createWallText(text, x, y, z, rotY, color) {
        const canvas = document.createElement('canvas');
        canvas.width = 512; canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 512, 128);
        ctx.font = 'bold 36px monospace';
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 20;
        ctx.textAlign = 'center';
        ctx.fillText(text, 256, 75);
        const tex = new THREE.CanvasTexture(canvas);
        const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, opacity: 0.8 });
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(10, 2.5), mat);
        mesh.position.set(x, y, z);
        mesh.rotation.y = rotY;
        scene.add(mesh);
      }

      createWallText('SALA DE ENTRENAMIENTO', 0, 10, -halfSize + 0.2, 0, '#FF0066');
      createWallText('OASIS // TRAINING', halfSize - 0.2, 10, 0, -Math.PI / 2, '#9D00FF');
      createWallText('EVA_STRIDER_∞', -halfSize + 0.2, 10, 0, Math.PI / 2, '#FF0066');
      createWallText('PREPARACIÓN', 0, 10, halfSize - 0.2, Math.PI, '#8B5E55');

      // Holographic pillars
      [[-14, -14], [14, -14], [-14, 14], [14, 14], [-14, 0], [14, 0], [0, -14], [0, 14]].forEach(([px, pz]) => {
        const pillarGeo = new THREE.CylinderGeometry(0.4, 0.4, wallHeight, 6);
        const pillarMat = new THREE.MeshPhongMaterial({ color: 0xFF0066, emissive: 0xD4A99A, transparent: true, opacity: 0.08, wireframe: true });
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.set(px, wallHeight / 2, pz);
        scene.add(pillar);
      });

      // Particles
      const particleCount = 600;
      const pGeo = new THREE.BufferGeometry();
      const pPos = new Float32Array(particleCount * 3);
      const pCol = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        pPos[i * 3] = (Math.random() - 0.5) * floorSize;
        pPos[i * 3 + 1] = Math.random() * wallHeight;
        pPos[i * 3 + 2] = (Math.random() - 0.5) * floorSize;
        const c = [[1, 0, 0.4], [0.62, 0, 1], [1, 0.38, 0.85], [0.55, 0.37, 0.34]][Math.floor(Math.random() * 4)];
        pCol[i * 3] = c[0]; pCol[i * 3 + 1] = c[1]; pCol[i * 3 + 2] = c[2];
      }
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
      pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
      const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 0.12, vertexColors: true, transparent: true, opacity: 0.35 }));
      scene.add(particles);

      // Obstacle crates
      const cratePositions = [[-8, -8], [8, -8], [-8, 8], [8, 8], [0, -12], [-12, 0], [12, 0], [0, 12]];
      cratePositions.forEach(([cx, cz], i) => {
        const size = 1.2 + Math.random() * 1;
        const crateGeo = new THREE.BoxGeometry(size, size, size);
        const crateMat = new THREE.MeshPhongMaterial({ color: 0xEDCFC5, emissive: 0xD4A99A, emissiveIntensity: 0.1, shininess: 20, transparent: true, opacity: 0.85 });
        const crate = new THREE.Mesh(crateGeo, crateMat);
        crate.position.set(cx, size / 2, cz);
        crate.castShadow = true;
        scene.add(crate);
        const edges = new THREE.EdgesGeometry(crateGeo);
        const lineMat = new THREE.LineBasicMaterial({ color: accentColors[i % accentColors.length], transparent: true, opacity: 0.3 });
        crate.add(new THREE.LineSegments(edges, lineMat));
      });

      // Ceiling ring
      const ringGeo = new THREE.TorusGeometry(3, 0.12, 16, 48);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xFF0066, transparent: true, opacity: 0.12 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(0, wallHeight - 2, 0);
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);

      // Player
      const player = { position: camera.position, velocity: { x: 0, y: 0, z: 0 }, speed: 0.22, sprintSpeed: 0.42, jumpForce: 0.32, grounded: true, yaw: 0, pitch: 0 };
      const mouseState = { x: 0, y: 0 };
      const boundary = halfSize - 1.5;
      const crateColliders = cratePositions.map(([cx, cz]) => ({ minX: cx - 1.5, maxX: cx + 1.5, minZ: cz - 1.5, maxZ: cz + 1.5 }));
      const checkCollision = (x, z) => crateColliders.some(c => x > c.minX && x < c.maxX && z > c.minZ && z < c.maxZ);

      // Input listeners
      const onKeyDown = (e) => {
        keysDown.current[e.code] = true;
        const s = stepRef.current;
        const t = TUTORIAL_STEPS[s];
        if (!t || advancingRef.current) return;
        if (t.type === 'jump' && e.code === 'Space' && player.grounded) {
          player.velocity.y = player.jumpForce; player.grounded = false; jumpCount.current++;
          setProgress(Math.min((jumpCount.current / t.requiredCount) * 100, 100));
          if (jumpCount.current >= t.requiredCount) advanceStep();
        }
        if (t.type === 'move' && t.requiredKeys.includes(e.code)) {
          keysUsed.current.add(e.code);
          setProgress(Math.min((keysUsed.current.size / t.requiredUnique) * 100, 100));
          if (keysUsed.current.size >= t.requiredUnique) advanceStep();
        }
        if (t.type === 'final' && e.code === 'Enter') handleFinish();
      };
      const onKeyUp = (e) => {
        keysDown.current[e.code] = false;
        const t = TUTORIAL_STEPS[stepRef.current];
        if (t?.type === 'sprint' && e.code === 'ShiftLeft') sprintStart.current = null;
      };
      const onMouseMove = (e) => {
        if (!document.pointerLockElement) return;
        mouseState.x += e.movementX; mouseState.y += e.movementY;
        const t = TUTORIAL_STEPS[stepRef.current];
        if (t?.type === 'mouse' && !advancingRef.current) {
          mouseAccum.current += Math.abs(e.movementX) + Math.abs(e.movementY);
          setProgress(Math.min((mouseAccum.current / t.requiredMouseMove) * 100, 100));
          if (mouseAccum.current >= t.requiredMouseMove) advanceStep();
        }
      };
      const onPointerLockChange = () => {
        const locked = !!document.pointerLockElement;
        setPointerLocked(locked);
        if (locked) {
          const t = TUTORIAL_STEPS[stepRef.current];
          if (t?.type === 'click' && !advancingRef.current) { setProgress(100); advanceStep(); }
        }
      };
      const onClick = () => {
        if (!document.pointerLockElement) renderer.domElement.requestPointerLock();
        if (TUTORIAL_STEPS[stepRef.current]?.type === 'final') handleFinish();
      };

      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('keyup', onKeyUp);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('pointerlockchange', onPointerLockChange);
      renderer.domElement.addEventListener('click', onClick);

      const onResize = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener('resize', onResize);

      // Animation loop
      let time = 0;
      const loop = () => {
        if (disposed) return;
        animId = requestAnimationFrame(loop);
        time += 0.016;

        const sensitivity = 0.002;
        player.yaw -= mouseState.x * sensitivity;
        player.pitch -= mouseState.y * sensitivity;
        player.pitch = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, player.pitch));
        mouseState.x = 0; mouseState.y = 0;
        camera.rotation.order = 'YXZ';
        camera.rotation.y = player.yaw;
        camera.rotation.x = player.pitch;

        const keys = keysDown.current;
        let vx = 0, vz = 0;
        if (keys['KeyW']) vz = -player.speed;
        if (keys['KeyS']) vz = player.speed;
        if (keys['KeyA']) vx = -player.speed;
        if (keys['KeyD']) vx = player.speed;

        const sprinting = keys['ShiftLeft'] && (vx !== 0 || vz !== 0);
        if (sprinting) {
          const mul = player.sprintSpeed / player.speed;
          vx *= mul; vz *= mul;
          const st = TUTORIAL_STEPS[stepRef.current];
          if (st?.type === 'sprint' && !sprintDone.current && !advancingRef.current) {
            if (!sprintStart.current) sprintStart.current = Date.now();
            const elapsed = Date.now() - sprintStart.current;
            setProgress(Math.min((elapsed / st.holdDuration) * 100, 100));
            if (elapsed >= st.holdDuration) { sprintDone.current = true; advanceStep(); }
          }
        } else {
          const st = TUTORIAL_STEPS[stepRef.current];
          if (st?.type === 'sprint' && !sprintDone.current) { sprintStart.current = null; setProgress(0); }
        }

        const euler = new THREE.Euler(0, player.yaw, 0);
        const quat = new THREE.Quaternion().setFromEuler(euler);
        const forward = new THREE.Vector3(0, 0, vz).applyQuaternion(quat);
        const strafe = new THREE.Vector3(vx, 0, 0).applyQuaternion(quat);
        const newX = player.position.x + forward.x + strafe.x;
        const newZ = player.position.z + forward.z + strafe.z;
        if (!checkCollision(newX, player.position.z)) player.position.x = Math.max(-boundary, Math.min(boundary, newX));
        if (!checkCollision(player.position.x, newZ)) player.position.z = Math.max(-boundary, Math.min(boundary, newZ));

        player.velocity.y -= 0.012;
        player.position.y += player.velocity.y;
        if (player.position.y <= 3) { player.position.y = 3; player.velocity.y = 0; player.grounded = true; }

        accentLights.forEach((al) => { al.light.intensity = 0.6 + 0.3 * Math.sin(time * 1.5 + al.phase); });
        mainLight.intensity = 1.5 + 0.3 * Math.sin(time * 0.8);

        const pArr = particles.geometry.attributes.position.array;
        for (let i = 0; i < pArr.length / 3; i++) {
          pArr[i * 3 + 1] += Math.sin(time * 0.5 + i * 0.3) * 0.004;
          if (pArr[i * 3 + 1] > wallHeight) pArr[i * 3 + 1] = 0.5;
        }
        particles.geometry.attributes.position.needsUpdate = true;
        ring.rotation.z = time * 0.3;
        ring.material.opacity = 0.1 + 0.08 * Math.sin(time * 1.2);

        renderer.render(scene, camera);
      };
      loop();

      gameRef.current = {
        cleanup: () => {
          disposed = true; cancelAnimationFrame(animId);
          window.removeEventListener('keydown', onKeyDown);
          window.removeEventListener('keyup', onKeyUp);
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('pointerlockchange', onPointerLockChange);
          renderer.domElement.removeEventListener('click', onClick);
          window.removeEventListener('resize', onResize);
          if (document.pointerLockElement) document.exitPointerLock();
          renderer.dispose();
          if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
        },
      };
    })();

    return () => { gameRef.current?.cleanup(); gameRef.current = null; };
  }, [advanceStep, handleFinish]);

  return (
    <div className="fixed inset-0 z-50">
      <div ref={mountRef} className="absolute inset-0" style={{ cursor: pointerLocked ? 'none' : 'pointer' }} />
      {pointerLocked && <Crosshair />}
      <TutorialNotification step={step} progress={progress} totalSteps={totalSteps} onSkip={handleSkip} />
      <SuccessFlash show={showSuccess} />
      <div className="fixed inset-0 pointer-events-none z-[45]" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,0,102,0.015) 0px, rgba(255,0,102,0.015) 1px, transparent 1px, transparent 4px)',
      }} />
    </div>
  );
}
