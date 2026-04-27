// ══════════════════════════════════════════════════════
//  LEVEL 4 GAME VIEWPORT — Puente Suspendido
//  Deep void, emerald code bridge, fragile beauty
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
    scene.background = new THREE.Color(0x050510);
    scene.fog = new THREE.FogExp2(0x081018, 0.003);
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth/container.clientHeight, 0.1, 400);
    camera.position.set(0, PLAYER_CONFIG.height, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.3;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    const glitchCanvas = document.createElement('canvas');
    glitchCanvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:5;';
    container.appendChild(glitchCanvas);
    const glitchCtx = glitchCanvas.getContext('2d');

    // Deep emerald lighting
    scene.add(new THREE.AmbientLight(0x103020, 0.5));
    const sun = new THREE.DirectionalLight(0x88FFAA, 1.2);
    sun.position.set(50, 130, 50); sun.castShadow = true;
    sun.shadow.mapSize.set(1024,1024); sun.shadow.camera.near=10; sun.shadow.camera.far=300;
    sun.shadow.camera.left=-150; sun.shadow.camera.right=150; sun.shadow.camera.top=150; sun.shadow.camera.bottom=-150;
    scene.add(sun);
    scene.add(new THREE.HemisphereLight(0x226644, 0x050510, 0.6));
    [{pos:[0,8,0],color:0x00FF88,i:1.8},{pos:[50,5,-40],color:0x00f0ff,i:1.2},
     {pos:[-60,5,50],color:0x00FF88,i:1.5},{pos:[70,5,70],color:0x61FFD8,i:1.0},
     {pos:[-80,5,-70],color:0x00FF88,i:1.5}].forEach(({pos,color,i})=>{
      const l=new THREE.PointLight(color,i,40); l.position.set(...pos); scene.add(l);
    });

    // Bridge ground — dark void with emerald code lines
    const groundGeo = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, 50, 50);
    const gv = groundGeo.attributes.position.array;
    for(let i=0;i<gv.length;i+=3){const x=gv[i],y=gv[i+1];if(Math.abs(x)>6||Math.abs(y)>6)gv[i+2]=(Math.sin(x*0.2)*Math.cos(y*0.2))*0.2;}
    groundGeo.computeVertexNormals();
    const gc = document.createElement('canvas'); gc.width=512; gc.height=512;
    const gx = gc.getContext('2d');
    gx.fillStyle='#040810'; gx.fillRect(0,0,512,512);
    // Code-like lines
    gx.strokeStyle='rgba(0,255,136,0.04)'; gx.lineWidth=0.5;
    for(let i=0;i<50;i++){gx.beginPath();let px=Math.random()*512,py=Math.random()*512;gx.moveTo(px,py);for(let s=0;s<4;s++){Math.random()>0.5?px+=(Math.random()-0.5)*60:py+=(Math.random()-0.5)*60;gx.lineTo(px,py);}gx.stroke();}
    // Green circuit dots
    for(let i=0;i<500;i++){gx.fillStyle=`rgba(0,255,136,${0.02+Math.random()*0.04})`;gx.fillRect(Math.random()*512,Math.random()*512,1+Math.random(),1+Math.random());}
    // Void shimmer
    gx.fillStyle='rgba(0,240,255,0.02)'; for(let i=0;i<10;i++){const cx=Math.random()*512,cy=Math.random()*512;gx.beginPath();gx.arc(cx,cy,20+Math.random()*30,0,Math.PI*2);gx.fill();}

    const groundTex = new THREE.CanvasTexture(gc);
    groundTex.wrapS=THREE.RepeatWrapping; groundTex.wrapT=THREE.RepeatWrapping; groundTex.repeat.set(8,8);
    const ground = new THREE.Mesh(groundGeo, new THREE.MeshPhongMaterial({map:groundTex,color:0x103020,emissive:0x051510,emissiveIntensity:0.3,shininess:15}));
    ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; scene.add(ground);

    const glowRingMat=new THREE.MeshBasicMaterial({color:0x00FF88,transparent:true,opacity:0.04,side:THREE.DoubleSide});
    const glowRing=new THREE.Mesh(new THREE.RingGeometry(20,22,64),glowRingMat);
    glowRing.rotation.x=-Math.PI/2; glowRing.position.y=0.02; scene.add(glowRing);
    const grid1=new THREE.GridHelper(WORLD_SIZE,40,0x00FF88,0x00FF88);
    grid1.material.transparent=true; grid1.material.opacity=0.02; grid1.position.y=0.01; scene.add(grid1);
    const edge=new THREE.Mesh(new THREE.RingGeometry(WORLD_HALF-5,WORLD_HALF,64),new THREE.MeshBasicMaterial({color:0x00FF88,transparent:true,opacity:0.08,side:THREE.DoubleSide}));
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
