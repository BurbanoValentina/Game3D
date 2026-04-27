// ══════════════════════════════════════════════════════
//  LEVEL 2 GAME VIEWPORT — Biblioteca de Halliday
//  Warm sepia library, wooden floors, candlelight
// ══════════════════════════════════════════════════════

'use client';
import { useEffect, useRef, useCallback } from 'react';
import { GameStates, PLAYER_CONFIG, WORLD_SIZE, WORLD_HALF } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';
import EventBus from '../../patterns/EventBus';
import { InputManager } from '../../patterns/CommandSystem';
import { buildEnvironment } from './world/EnvironmentBuilder';
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
    scene.background = new THREE.Color(0x2A1810);
    scene.fog = new THREE.FogExp2(0x3A2818, 0.005);

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 400);
    camera.position.set(0, PLAYER_CONFIG.height, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const glitchCanvas = document.createElement('canvas');
    glitchCanvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:5;';
    container.appendChild(glitchCanvas);
    const glitchCtx = glitchCanvas.getContext('2d');

    // Warm library lighting
    scene.add(new THREE.AmbientLight(0xDDB888, 0.8));
    const sunLight = new THREE.DirectionalLight(0xFFDDBB, 1.5);
    sunLight.position.set(40, 100, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(1024, 1024);
    sunLight.shadow.camera.near = 10; sunLight.shadow.camera.far = 300;
    sunLight.shadow.camera.left = -150; sunLight.shadow.camera.right = 150;
    sunLight.shadow.camera.top = 150; sunLight.shadow.camera.bottom = -150;
    scene.add(sunLight);
    scene.add(new THREE.HemisphereLight(0xDDA866, 0x4A3020, 0.8));

    // Accent lights — candles and indigo
    [{ pos: [0, 6, 0], color: 0xFFAA44, i: 2.0 },
     { pos: [50, 5, -40], color: 0x4B0082, i: 1.0 },
     { pos: [-60, 5, 50], color: 0xFFAA44, i: 1.5 },
     { pos: [70, 5, 70], color: 0x9D00FF, i: 1.0 },
     { pos: [-80, 5, -70], color: 0xFFAA44, i: 1.5 },
    ].forEach(({ pos, color, i }) => {
      const l = new THREE.PointLight(color, i, 40);
      l.position.set(...pos); scene.add(l);
    });

    // Ground — Dark wooden floor
    const groundGeo = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, 40, 40);
    const gc = document.createElement('canvas'); gc.width = 512; gc.height = 512;
    const gx = gc.getContext('2d');
    const gg = gx.createRadialGradient(256,256,50,256,256,360);
    gg.addColorStop(0,'#3A2818'); gg.addColorStop(0.5,'#2A1A10'); gg.addColorStop(1,'#1A0F08');
    gx.fillStyle = gg; gx.fillRect(0,0,512,512);
    gx.strokeStyle = 'rgba(80,50,30,0.3)'; gx.lineWidth = 1;
    for (let i=0;i<32;i++){gx.beginPath();gx.moveTo(0,i*16);gx.lineTo(512,i*16);gx.stroke();}
    for (let i=0;i<8;i++){const x=i*64;gx.beginPath();gx.moveTo(x,0);gx.lineTo(x,512);gx.stroke();}
    gx.strokeStyle='rgba(75,0,130,0.06)'; gx.lineWidth=0.8;
    for(let i=0;i<8;i++){gx.beginPath();gx.arc(Math.random()*512,Math.random()*512,15+Math.random()*25,0,Math.PI*2);gx.stroke();}
    for(let i=0;i<300;i++){gx.fillStyle=`rgba(255,200,120,${0.02+Math.random()*0.03})`;gx.fillRect(Math.random()*512,Math.random()*512,1+Math.random()*2,1+Math.random()*2);}

    const groundTex = new THREE.CanvasTexture(gc);
    groundTex.wrapS = THREE.RepeatWrapping; groundTex.wrapT = THREE.RepeatWrapping; groundTex.repeat.set(8,8);
    const groundMat = new THREE.MeshPhongMaterial({ map: groundTex, color: 0x6B4423, emissive: 0x1A0A05, emissiveIntensity: 0.2, shininess: 20 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

    // Glow ring & edge
    const glowRingMat = new THREE.MeshBasicMaterial({ color: 0x4B0082, transparent: true, opacity: 0.04, side: THREE.DoubleSide });
    const glowRing = new THREE.Mesh(new THREE.RingGeometry(20,22,64), glowRingMat);
    glowRing.rotation.x = -Math.PI/2; glowRing.position.y = 0.02; scene.add(glowRing);
    const grid1 = new THREE.GridHelper(WORLD_SIZE,40,0x4B0082,0x4B0082);
    grid1.material.transparent=true; grid1.material.opacity=0.02; grid1.position.y=0.01; scene.add(grid1);
    const edge = new THREE.Mesh(new THREE.RingGeometry(WORLD_HALF-5,WORLD_HALF,64), new THREE.MeshBasicMaterial({color:0x4B0082,transparent:true,opacity:0.08,side:THREE.DoubleSide}));
    edge.rotation.x=-Math.PI/2; edge.position.y=0.03; scene.add(edge);

    // Bookshelves
    const { buildings, colliders } = buildEnvironment(scene, THREE);
    const worldAssets = createWorldAssets(scene, THREE, buildings);
    worldAssets.glowRing = glowRing; worldAssets.glowRingMat = glowRingMat;

    inputManager.current = new InputManager(); inputManager.current.activate();
    const onPointerLock = () => { if(stateRef.current===GameStates.PLAYING) renderer.domElement.requestPointerLock(); };
    renderer.domElement.addEventListener('click', onPointerLock);
    const onResize = () => {
      camera.aspect=container.clientWidth/container.clientHeight; camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth,container.clientHeight);
      glitchCanvas.width=container.clientWidth; glitchCanvas.height=container.clientHeight;
    };
    window.addEventListener('resize', onResize); onResize();

    const player = { position: camera.position, velocity:{x:0,y:0,z:0}, speed:PLAYER_CONFIG.speed, jumpForce:PLAYER_CONFIG.jumpForce, grounded:true, yaw:0, pitch:0 };

    const loopCleanup = createGameLoop({ THREE, scene, camera, renderer, player, colliders, worldAssets, inputManager:inputManager.current, stateRef, glitchCanvas, glitchCtx, container, buildings });

    gameRef.current = { cleanup: () => {
      loopCleanup(); inputManager.current?.deactivate();
      renderer.domElement.removeEventListener('click',onPointerLock); window.removeEventListener('resize',onResize);
      renderer.dispose(); EventBus.clear();
      if(container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      if(container.contains(glitchCanvas)) container.removeChild(glitchCanvas);
    }};
  }, []);

  useEffect(() => { initGame(); return () => { gameRef.current?.cleanup(); gameRef.current=null; }; }, [initGame]);

  return (<div className="absolute inset-0"><div ref={mountRef} className="absolute inset-0" style={{cursor:'none'}} /><HudOverlay /></div>);
}
