// ══════════════════════════════════════════════════════
//  LEVEL 5 GAME VIEWPORT — Corazón del OASIS
//  Crystalline white, fragmenting reality, all colors
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
  const mountRef = useRef(null); const gameRef = useRef(null); const inputManager = useRef(null);
  const gameState = useGameStore(s => s.gameState);
  const stateRef = useRef(gameState);
  useEffect(() => { stateRef.current = gameState; }, [gameState]);

  const initGame = useCallback(async () => {
    if (!mountRef.current || gameRef.current) return;
    const container = mountRef.current;
    const THREE = await import('three');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0A0A15);
    scene.fog = new THREE.FogExp2(0x101020, 0.003);
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth/container.clientHeight, 0.1, 400);
    camera.position.set(0, PLAYER_CONFIG.height, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.5;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    const glitchCanvas = document.createElement('canvas');
    glitchCanvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:5;';
    container.appendChild(glitchCanvas);
    const glitchCtx = glitchCanvas.getContext('2d');

    // Prismatic white lighting with all previous level accent colors
    scene.add(new THREE.AmbientLight(0xCCCCDD, 0.7));
    const sun = new THREE.DirectionalLight(0xFFFFEE, 1.6);
    sun.position.set(70, 140, 50); sun.castShadow = true;
    sun.shadow.mapSize.set(1024,1024); sun.shadow.camera.near=10; sun.shadow.camera.far=300;
    sun.shadow.camera.left=-150; sun.shadow.camera.right=150; sun.shadow.camera.top=150; sun.shadow.camera.bottom=-150;
    scene.add(sun);
    scene.add(new THREE.HemisphereLight(0xDDDDFF, 0x101020, 0.6));
    // All key colors as accents
    [{pos:[0,8,0],color:0xFFFFFF,i:2.0},{pos:[50,5,-40],color:0xFFBB33,i:1.0},
     {pos:[-60,5,50],color:0x4B0082,i:1.0},{pos:[70,5,70],color:0xDC143C,i:1.0},
     {pos:[-80,5,-70],color:0x00FF88,i:1.0}].forEach(({pos,color,i})=>{
      const l=new THREE.PointLight(color,i,40); l.position.set(...pos); scene.add(l);
    });

    // Core ground — glass/crystal with prismatic reflections
    const groundGeo = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, 50, 50);
    const gc = document.createElement('canvas'); gc.width=512; gc.height=512;
    const gx = gc.getContext('2d');
    gx.fillStyle='#0A0A15'; gx.fillRect(0,0,512,512);
    // Prismatic hex grid
    gx.strokeStyle='rgba(255,255,255,0.04)'; gx.lineWidth=0.5;
    const hs=20;
    for(let r=0;r<30;r++)for(let c=0;c<30;c++){
      const cx=c*hs*1.5+(r%2)*hs*0.75, cy=r*hs*0.866;
      gx.beginPath();
      for(let s=0;s<6;s++){const a=(Math.PI/3)*s-Math.PI/6;const hx=cx+hs*0.4*Math.cos(a);const hy=cy+hs*0.4*Math.sin(a);s===0?gx.moveTo(hx,hy):gx.lineTo(hx,hy);}
      gx.closePath(); gx.stroke();
    }
    // All key colors as dots
    const keyColors = ['rgba(255,187,51,0.06)','rgba(75,0,130,0.06)','rgba(220,20,60,0.06)','rgba(0,255,136,0.06)','rgba(255,255,255,0.08)'];
    for(let i=0;i<600;i++){gx.fillStyle=keyColors[Math.floor(Math.random()*keyColors.length)];gx.fillRect(Math.random()*512,Math.random()*512,1+Math.random()*2,1+Math.random()*2);}

    const groundTex = new THREE.CanvasTexture(gc);
    groundTex.wrapS=THREE.RepeatWrapping; groundTex.wrapT=THREE.RepeatWrapping; groundTex.repeat.set(8,8);
    const ground = new THREE.Mesh(groundGeo, new THREE.MeshPhongMaterial({map:groundTex,color:0x334455,emissive:0x101020,emissiveIntensity:0.3,shininess:40,specular:0x445566}));
    ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; scene.add(ground);

    const glowRingMat=new THREE.MeshBasicMaterial({color:0xFFFFFF,transparent:true,opacity:0.04,side:THREE.DoubleSide});
    const glowRing=new THREE.Mesh(new THREE.RingGeometry(20,22,64),glowRingMat);
    glowRing.rotation.x=-Math.PI/2; glowRing.position.y=0.02; scene.add(glowRing);
    const grid1=new THREE.GridHelper(WORLD_SIZE,40,0xFFFFFF,0xFFFFFF);
    grid1.material.transparent=true; grid1.material.opacity=0.02; grid1.position.y=0.01; scene.add(grid1);
    const edge=new THREE.Mesh(new THREE.RingGeometry(WORLD_HALF-5,WORLD_HALF,64),new THREE.MeshBasicMaterial({color:0xFFFFFF,transparent:true,opacity:0.08,side:THREE.DoubleSide}));
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
