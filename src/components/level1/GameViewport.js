// ══════════════════════════════════════════════════════
//  GAME VIEWPORT — Reduced world 250x250
//  15 unique iconic buildings with flags
// ══════════════════════════════════════════════════════

'use client';
import { useEffect, useRef, useCallback } from 'react';
import { GameStates, PLAYER_CONFIG, WORLD_SIZE, WORLD_HALF } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';
import EventBus from '../../patterns/EventBus';
import { InputManager } from '../../patterns/CommandSystem';
import BuildingFactory from '../../patterns/BuildingFactory';
import audioManager from '../../lib/audioManager';
import { createWorldAssets } from './WorldBuilder';
import { createGameLoop } from './GameLoop';
import HudOverlay from './HudOverlay';

export default function GameViewport() {
  const mountRef = useRef(null);
  const gameRef = useRef(null);
  const inputManager = useRef(null);
  const gameState = useGameStore((s) => s.gameState);
  const stateRef = useRef(gameState);

  useEffect(() => { stateRef.current = gameState; }, [gameState]);

  const initGame = useCallback(async () => {
    if (!mountRef.current || gameRef.current) return;
    const container = mountRef.current;
    const THREE = await import('three');

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x6CB4E8);
    scene.fog = new THREE.FogExp2(0x8CC8F0, 0.008);

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 400);
    camera.position.set(0, PLAYER_CONFIG.height, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const glitchCanvas = document.createElement('canvas');
    glitchCanvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:5;';
    container.appendChild(glitchCanvas);
    const glitchCtx = glitchCanvas.getContext('2d');

    // Lighting
    scene.add(new THREE.AmbientLight(0xC8E6F8, 1.2));
    const sunLight = new THREE.DirectionalLight(0xFFEEDD, 2.0);
    sunLight.position.set(80, 150, 60);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(1024, 1024);
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 300;
    sunLight.shadow.camera.left = -150;
    sunLight.shadow.camera.right = 150;
    sunLight.shadow.camera.top = 150;
    sunLight.shadow.camera.bottom = -150;
    scene.add(sunLight);
    scene.add(new THREE.HemisphereLight(0x88BBEE, 0xD4C4A8, 0.9));
    const fillLight = new THREE.DirectionalLight(0xBBDDFF, 0.6);
    fillLight.position.set(-60, 80, -40);
    scene.add(fillLight);
    const mistLight = new THREE.PointLight(0xBBDDEE, 0.5, 120);
    mistLight.position.set(0, 30, 0);
    scene.add(mistLight);

    // Accent lights
    [
      { pos: [0, 8, 0], color: 0xFF0066, intensity: 1.5 },
      { pos: [55, 5, -45], color: 0xFFBB33, intensity: 1.2 },
      { pos: [-70, 5, 60], color: 0x9D00FF, intensity: 1.2 },
      { pos: [90, 5, 85], color: 0xFF61D8, intensity: 1.2 },
      { pos: [-100, 5, -90], color: 0x00FF88, intensity: 1.2 },
    ].forEach(({ pos, color, intensity }) => {
      const l = new THREE.PointLight(color, intensity, 40);
      l.position.set(...pos);
      scene.add(l);
    });

    // Ground (250x250) — Futuristic Cyber Terrain
    const groundGeo = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, 60, 60);
    // Subtle vertex displacement for terrain feel
    const groundVerts = groundGeo.attributes.position.array;
    for (let i = 0; i < groundVerts.length; i += 3) {
      const x = groundVerts[i], y = groundVerts[i + 1];
      // Skip center area (roads) — keep flat
      if (Math.abs(x) > 6 || Math.abs(y) > 6) {
        groundVerts[i + 2] = (Math.sin(x * 0.3) * Math.cos(y * 0.3)) * 0.15;
      }
    }
    groundGeo.computeVertexNormals();

    // Cyber grass texture via canvas
    const groundCanvas = document.createElement('canvas');
    groundCanvas.width = 512; groundCanvas.height = 512;
    const gCtx = groundCanvas.getContext('2d');
    // Base dark green-teal gradient
    const gGrad = gCtx.createRadialGradient(256, 256, 50, 256, 256, 360);
    gGrad.addColorStop(0, '#1a3a2a');
    gGrad.addColorStop(0.5, '#0d2820');
    gGrad.addColorStop(1, '#0a1f18');
    gCtx.fillStyle = gGrad;
    gCtx.fillRect(0, 0, 512, 512);
    // Hex grid pattern
    gCtx.strokeStyle = 'rgba(0,240,255,0.06)';
    gCtx.lineWidth = 0.5;
    const hexSize = 24;
    for (let row = 0; row < 30; row++) {
      for (let col = 0; col < 30; col++) {
        const cx = col * hexSize * 1.5 + (row % 2) * hexSize * 0.75;
        const cy = row * hexSize * 0.866;
        gCtx.beginPath();
        for (let s = 0; s < 6; s++) {
          const angle = (Math.PI / 3) * s - Math.PI / 6;
          const hx = cx + hexSize * 0.4 * Math.cos(angle);
          const hy = cy + hexSize * 0.4 * Math.sin(angle);
          s === 0 ? gCtx.moveTo(hx, hy) : gCtx.lineTo(hx, hy);
        }
        gCtx.closePath();
        gCtx.stroke();
      }
    }
    // Scattered bright dots (bioluminescent grass)
    for (let i = 0; i < 1200; i++) {
      const dx = Math.random() * 512, dy = Math.random() * 512;
      const colors = ['rgba(0,255,136,0.3)', 'rgba(0,240,255,0.2)', 'rgba(97,255,216,0.25)', 'rgba(255,97,216,0.12)'];
      gCtx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      gCtx.fillRect(dx, dy, 1 + Math.random() * 2, 1 + Math.random() * 2);
    }
    // Dark pores for texture depth
    for (let i = 0; i < 900; i++) {
      const dx = Math.random() * 512, dy = Math.random() * 512;
      const r = 0.6 + Math.random() * 1.6;
      gCtx.fillStyle = 'rgba(10,20,18,0.35)';
      gCtx.beginPath();
      gCtx.arc(dx, dy, r, 0, Math.PI * 2);
      gCtx.fill();
    }
    // Circuit traces
    gCtx.strokeStyle = 'rgba(0,240,255,0.04)';
    gCtx.lineWidth = 1;
    for (let i = 0; i < 15; i++) {
      gCtx.beginPath();
      let px = Math.random() * 512, py = Math.random() * 512;
      gCtx.moveTo(px, py);
      for (let s = 0; s < 5; s++) {
        if (Math.random() > 0.5) px += (Math.random() - 0.5) * 80;
        else py += (Math.random() - 0.5) * 80;
        gCtx.lineTo(px, py);
      }
      gCtx.stroke();
    }

    const groundTexture = new THREE.CanvasTexture(groundCanvas);
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(8, 8);

    const groundMat = new THREE.MeshPhongMaterial({
      map: groundTexture,
      color: 0x88aa88,
      emissive: 0x112218,
      emissiveIntensity: 0.3,
      shininess: 15,
      specular: 0x225533,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Animated ground glow ring (pulse effect)
    const glowRingGeo = new THREE.RingGeometry(20, 22, 64);
    const glowRingMat = new THREE.MeshBasicMaterial({
      color: 0x00FF88, transparent: true, opacity: 0.04, side: THREE.DoubleSide,
    });
    const glowRing = new THREE.Mesh(glowRingGeo, glowRingMat);
    glowRing.rotation.x = -Math.PI / 2; glowRing.position.y = 0.02;
    scene.add(glowRing);

    // Grid — subtle neon
    const grid1 = new THREE.GridHelper(WORLD_SIZE, 40, 0x00FF88, 0x00FF88);
    grid1.material.transparent = true; grid1.material.opacity = 0.02;
    grid1.position.y = 0.01; scene.add(grid1);

    // Edge glow — green cyber border
    const edgeGeo = new THREE.RingGeometry(WORLD_HALF - 5, WORLD_HALF, 64);
    const edgeMat = new THREE.MeshBasicMaterial({ color: 0x00FF88, transparent: true, opacity: 0.08, side: THREE.DoubleSide });
    const edge = new THREE.Mesh(edgeGeo, edgeMat);
    edge.rotation.x = -Math.PI / 2; edge.position.y = 0.03;
    scene.add(edge);

    // Inner cyber glow ring
    const innerEdge = new THREE.Mesh(
      new THREE.RingGeometry(WORLD_HALF - 8, WORLD_HALF - 6, 64),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.03, side: THREE.DoubleSide })
    );
    innerEdge.rotation.x = -Math.PI / 2; innerEdge.position.y = 0.025;
    scene.add(innerEdge);

    // 15 unique buildings with flags
    const { buildings, colliders, flags } = BuildingFactory.generateCity(THREE, scene);

    // World assets
    const worldAssets = createWorldAssets(scene, THREE, buildings);
    worldAssets.buildingFlags = flags;
    worldAssets.glowRing = glowRing;
    worldAssets.glowRingMat = glowRingMat;

    // Input
    inputManager.current = new InputManager();
    inputManager.current.activate();

    const onPointerLock = () => {
      if (stateRef.current === GameStates.PLAYING) renderer.domElement.requestPointerLock();
    };
    renderer.domElement.addEventListener('click', onPointerLock);

    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
      glitchCanvas.width = container.clientWidth;
      glitchCanvas.height = container.clientHeight;
    };
    window.addEventListener('resize', onResize);
    onResize();

    const player = {
      position: camera.position,
      velocity: { x: 0, y: 0, z: 0 },
      speed: PLAYER_CONFIG.speed,
      jumpForce: PLAYER_CONFIG.jumpForce,
      grounded: true, yaw: 0, pitch: 0,
    };

    const loopCleanup = createGameLoop({
      THREE, scene, camera, renderer,
      player, colliders, worldAssets,
      inputManager: inputManager.current,
      stateRef, glitchCanvas, glitchCtx,
      container, buildings,
    });

    gameRef.current = {
      cleanup: () => {
        loopCleanup();
        inputManager.current?.deactivate();
        renderer.domElement.removeEventListener('click', onPointerLock);
        window.removeEventListener('resize', onResize);
        renderer.dispose();
        EventBus.clear();
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
        if (container.contains(glitchCanvas)) container.removeChild(glitchCanvas);
      },
    };
  }, []);

  useEffect(() => {
    initGame();
    return () => { gameRef.current?.cleanup(); gameRef.current = null; };
  }, [initGame]);

  return (
    <div className="absolute inset-0">
      <div ref={mountRef} className="absolute inset-0" style={{ cursor: 'none' }} />
      <HudOverlay />
    </div>
  );
}
