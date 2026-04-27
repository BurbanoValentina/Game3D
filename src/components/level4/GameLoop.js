// ══════════════════════════════════════════════════════
//  LEVEL 4 GAME LOOP
// ══════════════════════════════════════════════════════

import { GameStates, PLAYER_CONFIG, MEMORY_CONFIG, WORLD_HALF } from '../../constants/gameConstants';
import { LEVEL4_PUZZLES, LEVEL4_TOKENS } from '../../constants/level4Constants';
import useGameStore from '../../lib/gameStore';
import EventBus from '../../patterns/EventBus';
import audioManager from '../../lib/audioManager';

export function createGameLoop({ THREE, scene, camera, renderer, player, colliders, worldAssets, inputManager, stateRef, glitchCanvas, glitchCtx, container }) {
  const store = useGameStore.getState;
  const setState = useGameStore.setState;
  let animId, time = 0;
  let memoryEchoActive = false, memoryEchoTimer = 0;
  const solvedPuzzles = new Set();
  const collectedTokenIds = new Set();
  const unsubs = [];
  let levelTimerInterval = null;

  const startLevelTimer = () => {
    if (levelTimerInterval) return;
    setState({ levelTimerActive: true });
    levelTimerInterval = setInterval(() => {
      const s = store();
      if (stateRef.current !== GameStates.PLAYING) return;
      const newTime = s.levelTimeRemaining - 1;
      setState({ levelTimeRemaining: newTime });
      if (newTime === 60 || newTime === 30 || (newTime <= 10 && newTime > 0)) audioManager.playTimerWarning();
      if (newTime <= 0) {
        clearInterval(levelTimerInterval); levelTimerInterval = null;
        setState({ lives: 0, levelTimerActive: false });
        useGameStore.getState().setGameState(GameStates.GAME_OVER);
        document.exitPointerLock(); addLog('⏰ TIEMPO AGOTADO');
      }
    }, 1000);
  };
  const checkStartTimer = () => { if (!levelTimerInterval && stateRef.current === GameStates.PLAYING) startLevelTimer(); };

  unsubs.push(EventBus.on('activateMemory', () => {
    if (memoryEchoActive || !store().memoryAvailable) return;
    memoryEchoActive = true; memoryEchoTimer = MEMORY_CONFIG.durationFrames;
    setState({ memoryActive: true, memoryAvailable: false });
    worldAssets.memoryGhost.mesh.material.opacity = 0.3;
    audioManager.playInteract();
  }));

  unsubs.push(EventBus.on('interact', (pos) => {
    LEVEL4_PUZZLES.forEach((p) => {
      const dx = pos.x-p.position.x, dz = pos.z-p.position.z;
      const dy = pos.y-(p.position.y||0);
      if (Math.sqrt(dx*dx+dz*dz) < 8 && (!p.position.y||Math.abs(dy)<8) && !solvedPuzzles.has(p.id)) {
        setState({ currentPuzzle: p });
        useGameStore.getState().setGameState(GameStates.PUZZLE);
        document.exitPointerLock(); audioManager.playInteract();
      }
    });
    LEVEL4_TOKENS.forEach((token) => {
      const dx = pos.x-token.position.x, dz = pos.z-token.position.z;
      if (Math.sqrt(dx*dx+dz*dz) < 4 && !collectedTokenIds.has(token.id)) {
        collectedTokenIds.add(token.id); store().addCollectedToken(token.id);
        const marker = worldAssets.tokenMarkers.find(m => m.tokenId === token.id);
        if (marker) { marker.collected = true; marker.mesh.visible = false; marker.light.intensity = 0; marker.circle.visible = false; }
        if (token.type === 'memory') {
          setState({ currentTokenData: token }); store().incrementMemories(); store().addCoins(150);
          useGameStore.getState().setGameState(GameStates.TOKEN_MEMORY); document.exitPointerLock();
          addLog('RECUERDO: '+token.title+' — +150');
        } else {
          setState({ screamerActive: true, screamerColor: token.color || 'red' });
          useGameStore.getState().setGameState(GameStates.SCREAMER); document.exitPointerLock();
          store().removeLife();
          if (store().lives <= 0) setTimeout(() => useGameStore.getState().setGameState(GameStates.GAME_OVER), 3000);
          addLog('⚠ TRAMPA — '+token.title+' — VIDA -1');
        }
        audioManager.playInteract();
      }
    });
    const s = store();
    if (solvedPuzzles.size >= 5 && s.memoriesFound >= 3) {
      const dkx = pos.x, dkz = pos.z - (-80);
      if (Math.sqrt(dkx*dkx + dkz*dkz) < 6) {
        setState({ keyObtained: true }); useGameStore.getState().setGameState(GameStates.KEY_OBTAINED); document.exitPointerLock();
      }
    }
  }));

  unsubs.push(EventBus.on('puzzleSolved', (id) => {
    solvedPuzzles.add(id);
    const puzzle = LEVEL4_PUZZLES.find(p => p.id === id);
    setState({ puzzlesSolved: solvedPuzzles.size }); store().addCoins(puzzle ? puzzle.reward : 300);
    const marker = worldAssets.puzzleMarkers.find(m => m.puzzleId === id);
    if (marker) { marker.cube.material.color.set(0x00ff88); marker.cube.material.emissive.set(0x00aa55); marker.light.color.set(0x00ff88); }
    const beam = worldAssets.lightBeams.find(b => b.puzzleId === id);
    if (beam) { beam.beam.material.opacity = 0.02; beam.core.material.opacity = 0.04; }
    if (solvedPuzzles.size >= 5 && store().memoriesFound >= 3) {
      worldAssets.keyMat.opacity = 0.9; worldAssets.keyLight.intensity = 5;
      addLog('>>> LLAVE ESMERALDA DETECTADA');
    }
    addLog('PUZZLE '+id+' RESUELTO — +'+(puzzle?puzzle.reward:300));
  }));

  unsubs.push(EventBus.on('puzzleFailed', () => { store().removeLife(); addLog('RESPUESTA INCORRECTA — VIDA -1'); audioManager.playGlitch(); }));
  unsubs.push(EventBus.on('togglePause', () => {
    if (stateRef.current === GameStates.PLAYING) { useGameStore.getState().setGameState(GameStates.PAUSED); document.exitPointerLock(); }
    else if (stateRef.current === GameStates.PAUSED) { useGameStore.getState().setGameState(GameStates.PLAYING); }
  }));

  const addLog = (msg) => { setState({ systemLogs: [...store().systemLogs.slice(-8), '['+new Date().toLocaleTimeString()+'] '+msg] }); };
  const checkCollision = (x, z) => { for (const c of colliders) { if (x>c.minX&&x<c.maxX&&z>c.minZ&&z<c.maxZ) return true; } return false; };
  const checkParkourLanding = (px, py, pz) => {
    for (const block of worldAssets.parkourBlocks) {
      const hw=block.w/2+0.5,hd=block.d/2+0.5,topY=block.mesh.position.y+block.h/2;
      if(px>block.x-hw&&px<block.x+hw&&pz>block.z-hd&&pz<block.z+hd&&py>=topY&&py<=topY+2&&player.velocity.y<=0) return topY+PLAYER_CONFIG.height;
    }
    return null;
  };

  const loop = () => {
    animId = requestAnimationFrame(loop); time += 0.016;
    if (stateRef.current !== GameStates.PLAYING) { renderer.render(scene, camera); return; }
    checkStartTimer();
    player.velocity.x=0; player.velocity.z=0; player.sprinting=false;
    inputManager.processInput(player);
    if(player.sprinting){const m=PLAYER_CONFIG.sprintSpeed/PLAYER_CONFIG.speed;player.velocity.x*=m;player.velocity.z*=m;}
    const mouse=inputManager.consumeMouse();
    player.yaw-=mouse.x*0.002; player.pitch-=mouse.y*0.002;
    player.pitch=Math.max(-Math.PI/2.5,Math.min(Math.PI/2.5,player.pitch));
    camera.rotation.order='YXZ'; camera.rotation.y=player.yaw; camera.rotation.x=player.pitch;
    const quat=new THREE.Quaternion().setFromEuler(new THREE.Euler(0,player.yaw,0));
    const fwd=new THREE.Vector3(0,0,player.velocity.z).applyQuaternion(quat);
    const str=new THREE.Vector3(player.velocity.x,0,0).applyQuaternion(quat);
    const nx=player.position.x+fwd.x+str.x, nz=player.position.z+fwd.z+str.z;
    if(!checkCollision(nx,player.position.z)) player.position.x=nx;
    if(!checkCollision(player.position.x,nz)) player.position.z=nz;
    player.velocity.y-=PLAYER_CONFIG.gravity; player.position.y+=player.velocity.y;
    const py=checkParkourLanding(player.position.x,player.position.y,player.position.z);
    if(py!==null&&player.velocity.y<=0){player.position.y=py;player.velocity.y=0;player.grounded=true;}
    else if(player.position.y<=PLAYER_CONFIG.height){player.position.y=PLAYER_CONFIG.height;player.velocity.y=0;player.grounded=true;}
    player.position.x=Math.max(-WORLD_HALF,Math.min(WORLD_HALF,player.position.x));
    player.position.z=Math.max(-WORLD_HALF,Math.min(WORLD_HALF,player.position.z));
    setState({playerX:player.position.x,playerZ:player.position.z});
    if(memoryEchoActive){memoryEchoTimer--;setState({memoryTimer:Math.ceil(memoryEchoTimer/60)});const g=worldAssets.memoryGhost;g.mesh.material.opacity=0.3+Math.sin(time*4)*0.15;g.mesh.position.x=player.position.x+Math.sin(time*2)*5;g.mesh.position.z=player.position.z+Math.cos(time*2)*5;if(memoryEchoTimer<=0){memoryEchoActive=false;g.mesh.material.opacity=0;setState({memoryActive:false});}}
    worldAssets.neonLights.forEach(nl=>{nl.light.intensity=nl.baseIntensity*(0.6+0.4*Math.sin(time*2+nl.phase));});
    const pa=worldAssets.particles.geometry.attributes.position.array;
    for(let i=0;i<pa.length/3;i++){pa[i*3+1]+=Math.sin(time+i)*0.008;if(pa[i*3+1]>50)pa[i*3+1]=0;}
    worldAssets.particles.geometry.attributes.position.needsUpdate=true;
    worldAssets.puzzleMarkers.forEach(pm=>{pm.cube.rotation.x=time*0.8;pm.cube.rotation.y=time*1.2;pm.cube.position.y+=Math.sin(time*2)*0.3-Math.sin((time-0.016)*2)*0.3;});
    worldAssets.lightBeams.forEach(lb=>{lb.beam.material.opacity=0.04+Math.sin(time*1.5)*0.02;lb.core.material.opacity=0.08+Math.sin(time*2)*0.04;lb.beam.rotation.y=time*0.1;});
    worldAssets.parkourBlocks.forEach(pb=>{pb.mesh.position.y=pb.baseY+Math.sin(time*0.8+pb.phase)*0.3;});
    worldAssets.tokenMarkers.forEach(tm=>{if(!tm.collected){tm.mesh.rotation.y=time*1.5+tm.phase;tm.mesh.position.y=2.5+Math.sin(time*1.2+tm.phase)*0.4;}});
    if(worldAssets.glowRing){const s=1+Math.sin(time*0.5)*0.3;worldAssets.glowRing.scale.set(s,s,1);worldAssets.glowRingMat.opacity=0.02+Math.sin(time*0.8)*0.02;}
    const st=store();
    if(solvedPuzzles.size>=5&&st.memoriesFound>=3){worldAssets.keyMesh.rotation.x=time*0.5;worldAssets.keyMesh.rotation.y=time*0.8;worldAssets.keyMesh.position.y=4+Math.sin(time*1.5)*0.8;}
    worldAssets.npcs.forEach(n=>{n.mesh.position.x=n.baseX+Math.sin(time*0.5+n.loopPhase)*2;n.mesh.position.z=n.baseZ+Math.cos(time*0.5+n.loopPhase)*2;n.mesh.material.opacity=0.3+Math.sin(time*10+n.loopPhase)*0.2;});
    worldAssets.checkpointMeshes.forEach(cp=>{const dx=player.position.x-cp.x,dz=player.position.z-cp.z;if(Math.sqrt(dx*dx+dz*dz)<3&&!cp.reached){cp.reached=true;cp.mesh.material.color.set(0xffbb33);cp.mesh.material.opacity=0.5;setState({checkpointsReached:[...store().checkpointsReached,cp.label]});addLog('CHECKPOINT: '+cp.label);}});
    let near=false;
    LEVEL4_PUZZLES.forEach(p=>{const dx=player.position.x-p.position.x,dz=player.position.z-p.position.z;if(Math.sqrt(dx*dx+dz*dz)<7&&!solvedPuzzles.has(p.id)){near=true;setState({interactionPrompt:'[E] '+p.title});}});
    LEVEL4_TOKENS.forEach(t=>{const dx=player.position.x-t.position.x,dz=player.position.z-t.position.z;if(Math.sqrt(dx*dx+dz*dz)<5&&!collectedTokenIds.has(t.id)){near=true;setState({interactionPrompt:t.type==='memory'?'🔮 [E] Recuerdo':'❓ [E] Token'});}});
    if(solvedPuzzles.size>=5&&st.memoriesFound>=3){const dkx=player.position.x,dkz=player.position.z-(-80);if(Math.sqrt(dkx*dkx+dkz*dkz)<7){near=true;setState({interactionPrompt:'[E] LLAVE ESMERALDA'});}}
    if(!near) setState({interactionPrompt:''});
    if(!memoryEchoActive&&Math.random()<0.001){const g=worldAssets.memoryGhost;g.mesh.material.opacity=0.12;g.mesh.position.set(player.position.x+(Math.random()-0.5)*20,1.75,player.position.z+(Math.random()-0.5)*20);setTimeout(()=>{g.mesh.material.opacity=0;},2000);}
    if(glitchCanvas.width!==container.clientWidth){glitchCanvas.width=container.clientWidth;glitchCanvas.height=container.clientHeight;}
    glitchCtx.clearRect(0,0,glitchCanvas.width,glitchCanvas.height);
    glitchCtx.fillStyle='rgba(20,0,30,0.01)';
    for(let y=0;y<glitchCanvas.height;y+=4)glitchCtx.fillRect(0,y,glitchCanvas.width,1);
    renderer.render(scene,camera);
  };
  loop();
  return () => { cancelAnimationFrame(animId); unsubs.forEach(u=>u()); if(levelTimerInterval)clearInterval(levelTimerInterval); };
}
