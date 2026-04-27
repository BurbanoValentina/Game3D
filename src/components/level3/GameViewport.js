// ══════════════════════════════════════════════════════
//  LEVEL 3 GAME VIEWPORT — Arena Digital
//  Electric crimson coliseum, scorching atmosphere
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
  const gameState = useGameStore(s => s.gameState);
  const stateRef = useRef(gameState);
  useEffect(() => { stateRef.current = gameState; }, [gameState]);

  const initGame = useCallback(async () => {
    if (!mountRef.current || gameRef.current) return;
    const container = mountRef.current;
    const THREE = await import('three');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x150020);
    scene.fog = new THREE.FogExp2(0x200030, 0.004);
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth/container.clientHeight, 0.1, 400);
    camera.position.set(0, PLAYER_CONFIG.height, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.4;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    const glitchCanvas = document.createElement('canvas');
    glitchCanvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:5;';
    container.appendChild(glitchCanvas);
    const glitchCtx = glitchCanvas.getContext('2d');

    // Electric crimson lighting
    scene.add(new THREE.AmbientLight(0x5A0040, 0.6));
    const sun = new THREE.DirectionalLight(0xFF6688, 1.8);
    sun.position.set(60, 120, 40); sun.castShadow = true;
    sun.shadow.mapSize.set(1024,1024); sun.shadow.camera.near=10; sun.shadow.camera.far=300;
    sun.shadow.camera.left=-150; sun.shadow.camera.right=150; sun.shadow.camera.top=150; sun.shadow.camera.bottom=-150;
    scene.add(sun);
    scene.add(new THREE.HemisphereLight(0xCC4466, 0x200020, 0.7));
    [{pos:[0,8,0],color:0xDC143C,i:2.0},{pos:[55,5,-45],color:0xFF0066,i:1.5},
     {pos:[-70,5,60],color:0x9D00FF,i:1.2},{pos:[90,5,85],color:0xFFD700,i:1.0},
     {pos:[-100,5,-90],color:0xDC143C,i:1.5}].forEach(({pos,color,i})=>{
      const l=new THREE.PointLight(color,i,40); l.position.set(...pos); scene.add(l);
    });

    // Arena ground — dark stone with crimson grid
    const groundGeo = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, 40, 40);
    const gc = document.createElement('canvas'); gc.width=512; gc.height=512;
    const gx = gc.getContext('2d');
    const gg = gx.createRadialGradient(256,256,50,256,256,360);
    gg.addColorStop(0,'#1A0020'); gg.addColorStop(0.5,'#120015'); gg.addColorStop(1,'#0A000D');
    gx.fillStyle=gg; gx.fillRect(0,0,512,512);
    // Crimson grid
    gx.strokeStyle='rgba(220,20,60,0.08)'; gx.lineWidth=0.5;
    for(let i=0;i<32;i++){gx.beginPath();gx.moveTo(i*16,0);gx.lineTo(i*16,512);gx.stroke();gx.beginPath();gx.moveTo(0,i*16);gx.lineTo(512,i*16);gx.stroke();}
    // Arena circle
    gx.strokeStyle='rgba(220,20,60,0.1)'; gx.lineWidth=2;
    gx.beginPath(); gx.arc(256,256,200,0,Math.PI*2); gx.stroke();
    gx.beginPath(); gx.arc(256,256,150,0,Math.PI*2); gx.stroke();
    // Sparks
    for(let i=0;i<400;i++){gx.fillStyle=`rgba(220,20,60,${0.03+Math.random()*0.05})`;gx.fillRect(Math.random()*512,Math.random()*512,1+Math.random()*2,1+Math.random()*2);}

    const groundTex = new THREE.CanvasTexture(gc);
    groundTex.wrapS=THREE.RepeatWrapping; groundTex.wrapT=THREE.RepeatWrapping; groundTex.repeat.set(8,8);
    const ground = new THREE.Mesh(groundGeo, new THREE.MeshPhongMaterial({map:groundTex,color:0x3A1030,emissive:0x150010,emissiveIntensity:0.2,shininess:25}));
    ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; scene.add(ground);

    const glowRingMat=new THREE.MeshBasicMaterial({color:0xDC143C,transparent:true,opacity:0.04,side:THREE.DoubleSide});
    const glowRing=new THREE.Mesh(new THREE.RingGeometry(20,22,64),glowRingMat);
    glowRing.rotation.x=-Math.PI/2; glowRing.position.y=0.02; scene.add(glowRing);
    const grid1=new THREE.GridHelper(WORLD_SIZE,40,0xDC143C,0xDC143C);
    grid1.material.transparent=true; grid1.material.opacity=0.02; grid1.position.y=0.01; scene.add(grid1);
    const edge=new THREE.Mesh(new THREE.RingGeometry(WORLD_HALF-5,WORLD_HALF,64),new THREE.MeshBasicMaterial({color:0xDC143C,transparent:true,opacity:0.08,side:THREE.DoubleSide}));
    edge.rotation.x=-Math.PI/2; edge.position.y=0.03; scene.add(edge);

    const {buildings,colliders}=buildEnvironment(scene,THREE);
    const worldAssets=createWorldAssets(scene,THREE,buildings);
    worldAssets.glowRing=glowRing; worldAssets.glowRingMat=glowRingMat;

    inputManager.current=new InputManager(); inputManager.current.activate();
    const onPointerLock=()=>{if(stateRef.current===GameStates.PLAYING)renderer.domElement.requestPointerLock();};
    renderer.domElement.addEventListener('click',onPointerLock);
    const onResize=()=>{camera.aspect=container.clientWidth/container.clientHeight;camera.updateProjectionMatrix();renderer.setSize(container.clientWidth,container.clientHeight);glitchCanvas.width=container.clientWidth;glitchCanvas.height=container.clientHeight;};
    window.addEventListener('resize',onResize); onResize();
    const player={position:camera.position,velocity:{x:0,y:0,z:0},speed:PLAYER_CONFIG.speed,jumpForce:PLAYER_CONFIG.jumpForce,grounded:true,yaw:0,pitch:0};
    const loopCleanup=createGameLoop({THREE,scene,camera,renderer,player,colliders,worldAssets,inputManager:inputManager.current,stateRef,glitchCanvas,glitchCtx,container,buildings});

    gameRef.current={cleanup:()=>{loopCleanup();inputManager.current?.deactivate();renderer.domElement.removeEventListener('click',onPointerLock);window.removeEventListener('resize',onResize);renderer.dispose();EventBus.clear();if(container.contains(renderer.domElement))container.removeChild(renderer.domElement);if(container.contains(glitchCanvas))container.removeChild(glitchCanvas);}};
  }, []);

  useEffect(()=>{initGame();return()=>{gameRef.current?.cleanup();gameRef.current=null;};}, [initGame]);
  return (<div className="absolute inset-0"><div ref={mountRef} className="absolute inset-0" style={{cursor:'none'}}/><HudOverlay/></div>);
}
