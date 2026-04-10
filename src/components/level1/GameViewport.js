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
    scene.fog = new THREE.FogExp2(0x8CC8F0, 0.0018);

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
    scene.add(new THREE.HemisphereLight(0x88BBEE, 0xD4C4A8, 1.0));
    const fillLight = new THREE.DirectionalLight(0xBBDDFF, 0.6);
    fillLight.position.set(-60, 80, -40);
    scene.add(fillLight);

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

    // Ground (250x250)
    const groundGeo = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, 15, 15);
    const groundMat = new THREE.MeshPhongMaterial({
      color: 0x999990, emissive: 0x444440,
      emissiveIntensity: 0.1, shininess: 20,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid
    const grid1 = new THREE.GridHelper(WORLD_SIZE, 40, 0xFF0066, 0xFF0066);
    grid1.material.transparent = true; grid1.material.opacity = 0.03;
    grid1.position.y = 0.01; scene.add(grid1);

    // Edge glow
    const edgeGeo = new THREE.RingGeometry(WORLD_HALF - 5, WORLD_HALF, 64);
    const edgeMat = new THREE.MeshBasicMaterial({ color: 0xFF0066, transparent: true, opacity: 0.06, side: THREE.DoubleSide });
    const edge = new THREE.Mesh(edgeGeo, edgeMat);
    edge.rotation.x = -Math.PI / 2; edge.position.y = 0.03;
    scene.add(edge);

    // 15 unique buildings with flags
    const { buildings, colliders, flags } = BuildingFactory.generateCity(THREE, scene);

    // World assets
    const worldAssets = createWorldAssets(scene, THREE, buildings);
    worldAssets.buildingFlags = flags;

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
