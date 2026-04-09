// ══════════════════════════════════════════════════════
//  GAME LOOP — Updated
//  Input, physics, parkour, tokens, no corruption
// ══════════════════════════════════════════════════════

import { GameStates, LEVEL1_PUZZLES, LEVEL1_TOKENS, PLAYER_CONFIG, MEMORY_CONFIG } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';
import EventBus from '../../patterns/EventBus';
import audioManager from '../../lib/audioManager';

export function createGameLoop({
  THREE, scene, camera, renderer,
  player, colliders, worldAssets,
  inputManager, stateRef,
  glitchCanvas, glitchCtx, container,
}) {
  const store = useGameStore.getState;
  const setState = useGameStore.setState;

  let animId;
  let time = 0;
  let memoryEchoActive = false;
  let memoryEchoTimer = 0;
  const solvedPuzzles = new Set();
  const collectedTokenIds = new Set();

  const unsubs = [];

  // ─── MEMORY ECHO ───
  unsubs.push(EventBus.on('activateMemory', () => {
    if (memoryEchoActive || !store().memoryAvailable) return;
    memoryEchoActive = true;
    memoryEchoTimer = MEMORY_CONFIG.durationFrames;
    setState({ memoryActive: true, memoryAvailable: false });
    worldAssets.memoryGhost.visible = true;
    audioManager.playInteract();
  }));

  // ─── INTERACT ───
  unsubs.push(EventBus.on('interact', (pos) => {
    // Check puzzle zones (puzzles are at y=18, player needs to be on top platform)
    LEVEL1_PUZZLES.forEach((p) => {
      const dx = pos.x - p.position.x;
      const dz = pos.z - p.position.z;
      const dy = pos.y - (p.position.y || 0);
      const horizDist = Math.sqrt(dx * dx + dz * dz);
      const vertClose = !p.position.y || Math.abs(dy) < 8; // within 8 units vertically
      if (horizDist < 8 && vertClose && !solvedPuzzles.has(p.id)) {
        setState({ currentPuzzle: p });
        useGameStore.getState().setGameState(GameStates.PUZZLE);
        document.exitPointerLock();
        audioManager.playInteract();
      }
    });

    // Check tokens
    LEVEL1_TOKENS.forEach((token) => {
      const dx = pos.x - token.position.x;
      const dz = pos.z - token.position.z;
      if (Math.sqrt(dx * dx + dz * dz) < 4 && !collectedTokenIds.has(token.id)) {
        collectedTokenIds.add(token.id);
        store().addCollectedToken(token.id);

        // Hide token mesh
        const marker = worldAssets.tokenMarkers.find((m) => m.tokenId === token.id);
        if (marker) {
          marker.collected = true;
          marker.mesh.visible = false;
          marker.light.intensity = 0;
          marker.circle.visible = false;
        }

        if (token.type === 'memory') {
          // Show memory image
          setState({ currentTokenData: token });
          store().incrementMemories();
          store().addCoins(150);
          useGameStore.getState().setGameState(GameStates.TOKEN_MEMORY);
          document.exitPointerLock();
          addLog(`RECUERDO ENCONTRADO: ${token.title} — MONEDAS +150`);
        } else {
          // SCREAMER!
          setState({ screamerActive: true, screamerColor: token.color || 'red' });
          useGameStore.getState().setGameState(GameStates.SCREAMER);
          document.exitPointerLock();
          // Lose 1 life
          store().removeLife();
          if (store().lives <= 0) {
            setTimeout(() => {
              useGameStore.getState().setGameState(GameStates.GAME_OVER);
            }, 3000);
          }
          addLog(`⚠ TRAMPA ACTIVADA — ${token.title} — VIDA -1`);
        }
        audioManager.playInteract();
      }
    });

    // Check key (5 puzzles + 3 memories needed)
    const s = store();
    if (solvedPuzzles.size >= 5 && s.memoriesFound >= 3) {
      const dkx = pos.x - 0;
      const dkz = pos.z - (-140);
      if (Math.sqrt(dkx * dkx + dkz * dkz) < 6) {
        setState({ keyObtained: true });
        useGameStore.getState().setGameState(GameStates.KEY_OBTAINED);
        document.exitPointerLock();
      }
    }
  }));

  // ─── PUZZLE SOLVED ───
  unsubs.push(EventBus.on('puzzleSolved', (id) => {
    solvedPuzzles.add(id);
    const puzzle = LEVEL1_PUZZLES.find((p) => p.id === id);
    const reward = puzzle ? puzzle.reward : 250;
    setState({ puzzlesSolved: solvedPuzzles.size });
    store().addCoins(reward);

    // Update marker
    const marker = worldAssets.puzzleMarkers.find((m) => m.puzzleId === id);
    if (marker) {
      marker.cube.material.color.set(0x00ff88);
      marker.cube.material.emissive.set(0x00aa55);
      marker.light.color.set(0x00ff88);
    }

    // Hide light beam when solved
    const beam = worldAssets.lightBeams.find((b) => b.puzzleId === id);
    if (beam) {
      beam.beam.material.opacity = 0.02;
      beam.core.material.opacity = 0.04;
    }

    // Reveal key when all 5 puzzles + 3 memories done
    const s = store();
    if (solvedPuzzles.size >= 5 && s.memoriesFound >= 3) {
      worldAssets.keyMat.opacity = 0.9;
      worldAssets.keyLight.intensity = 5;
      addLog('>>> LLAVE ÁMBAR DETECTADA — COORDENADAS: (0, 4, -140)');
    }
    addLog(`PUZZLE ${id} RESUELTO — MONEDAS +${reward}`);
  }));

  // ─── PUZZLE FAILED ───
  unsubs.push(EventBus.on('puzzleFailed', () => {
    store().removeLife();
    addLog('RESPUESTA INCORRECTA — VIDA -1');
    audioManager.playGlitch();
  }));

  unsubs.push(EventBus.on('togglePause', () => {
    const current = stateRef.current;
    if (current === GameStates.PLAYING) {
      useGameStore.getState().setGameState(GameStates.PAUSED);
      document.exitPointerLock();
    } else if (current === GameStates.PAUSED) {
      useGameStore.getState().setGameState(GameStates.PLAYING);
    }
  }));

  const addLog = (msg) => {
    const logs = store().systemLogs;
    setState({ systemLogs: [...logs.slice(-8), `[${new Date().toLocaleTimeString()}] ${msg}`] });
  };

  // ─── COLLISION CHECK (buildings + parkour blocks) ───
  const checkCollision = (x, z) => {
    for (const c of colliders) {
      if (x > c.minX && x < c.maxX && z > c.minZ && z < c.maxZ) return true;
    }
    return false;
  };

  // ─── PARKOUR PLATFORM CHECK ───
  const checkParkourLanding = (px, py, pz) => {
    for (const block of worldAssets.parkourBlocks) {
      const halfW = block.w / 2 + 0.5;
      const halfD = block.d / 2 + 0.5;
      const topY = block.mesh.position.y + block.h / 2;
      if (
        px > block.x - halfW && px < block.x + halfW &&
        pz > block.z - halfD && pz < block.z + halfD &&
        py >= topY && py <= topY + 2 &&
        player.velocity.y <= 0
      ) {
        return topY + PLAYER_CONFIG.height;
      }
    }
    return null;
  };

  // ═══════════════════════════════════════
  //  MAIN LOOP
  // ═══════════════════════════════════════
  const loop = () => {
    animId = requestAnimationFrame(loop);
    time += 0.016;

    if (stateRef.current !== GameStates.PLAYING) {
      renderer.render(scene, camera);
      return;
    }

    // ── Input ──
    player.velocity.x = 0;
    player.velocity.z = 0;
    player.sprinting = false;
    inputManager.processInput(player);

    if (player.sprinting) {
      const sprintMul = PLAYER_CONFIG.sprintSpeed / PLAYER_CONFIG.speed;
      player.velocity.x *= sprintMul;
      player.velocity.z *= sprintMul;
    }

    // ── Camera ──
    const mouse = inputManager.consumeMouse();
    player.yaw -= mouse.x * 0.002;
    player.pitch -= mouse.y * 0.002;
    player.pitch = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, player.pitch));
    camera.rotation.order = 'YXZ';
    camera.rotation.y = player.yaw;
    camera.rotation.x = player.pitch;

    // ── Movement with collision ──
    const euler = new THREE.Euler(0, player.yaw, 0);
    const quat = new THREE.Quaternion().setFromEuler(euler);
    const forward = new THREE.Vector3(0, 0, player.velocity.z).applyQuaternion(quat);
    const strafe = new THREE.Vector3(player.velocity.x, 0, 0).applyQuaternion(quat);
    const newX = player.position.x + forward.x + strafe.x;
    const newZ = player.position.z + forward.z + strafe.z;
    if (!checkCollision(newX, player.position.z)) player.position.x = newX;
    if (!checkCollision(player.position.x, newZ)) player.position.z = newZ;

    // ── Gravity & Jump with Parkour ──
    player.velocity.y -= PLAYER_CONFIG.gravity;
    player.position.y += player.velocity.y;

    const parkourY = checkParkourLanding(player.position.x, player.position.y, player.position.z);
    if (parkourY !== null && player.velocity.y <= 0) {
      player.position.y = parkourY;
      player.velocity.y = 0;
      player.grounded = true;
    } else if (player.position.y <= PLAYER_CONFIG.height) {
      player.position.y = PLAYER_CONFIG.height;
      player.velocity.y = 0;
      player.grounded = true;
    }

    // ── Boundary (400x400 map) ──
    player.position.x = Math.max(-200, Math.min(200, player.position.x));
    player.position.z = Math.max(-200, Math.min(200, player.position.z));

    // ── Update player position for minimap ──
    setState({ playerX: player.position.x, playerZ: player.position.z });

    // ── Memory Echo ──
    if (memoryEchoActive) {
      memoryEchoTimer--;
      setState({ memoryTimer: Math.ceil(memoryEchoTimer / 60) });
      const ghost = worldAssets.memoryGhost;
      ghost.mesh.material.opacity = 0.3 + Math.sin(time * 4) * 0.15;
      ghost.mesh.position.x = player.position.x + Math.sin(time * 2) * 5;
      ghost.mesh.position.z = player.position.z + Math.cos(time * 2) * 5;
      if (memoryEchoTimer <= 0) {
        memoryEchoActive = false;
        ghost.mesh.material.opacity = 0;
        setState({ memoryActive: false });
      }
    }

    // ── Animate Neon Lights ──
    worldAssets.neonLights.forEach((nl) => {
      nl.light.intensity = nl.baseIntensity * (0.6 + 0.4 * Math.sin(time * 2 + nl.phase));
    });

    // ── Animate Particles ──
    const posArr = worldAssets.particles.geometry.attributes.position.array;
    for (let i = 0; i < posArr.length / 3; i++) {
      posArr[i * 3 + 1] += Math.sin(time + i) * 0.008;
      if (posArr[i * 3 + 1] > 60) posArr[i * 3 + 1] = 0;
    }
    worldAssets.particles.geometry.attributes.position.needsUpdate = true;

    // ── Animate Puzzle Markers (at platform height) ──
    worldAssets.puzzleMarkers.forEach((pm) => {
      pm.cube.rotation.x = time * 0.8;
      pm.cube.rotation.y = time * 1.2;
      // Crystal floats above its base position
      const baseY = pm.cube.position.y;
      pm.cube.position.y = baseY + Math.sin(time * 2) * 0.3 - Math.sin((time - 0.016) * 2) * 0.3;
    });

    // ── Animate Light Beams ──
    worldAssets.lightBeams.forEach((lb) => {
      lb.beam.material.opacity = 0.04 + Math.sin(time * 1.5) * 0.02;
      lb.core.material.opacity = 0.08 + Math.sin(time * 2) * 0.04;
      lb.beam.rotation.y = time * 0.1;
    });

    // ── Animate Parkour Blocks (gentle float) ──
    worldAssets.parkourBlocks.forEach((pb) => {
      pb.mesh.position.y = pb.baseY + Math.sin(time * 0.8 + pb.phase) * 0.3;
    });

    // ── Animate Tokens ──
    worldAssets.tokenMarkers.forEach((tm) => {
      if (!tm.collected) {
        tm.mesh.rotation.y = time * 1.5 + tm.phase;
        tm.mesh.rotation.x = Math.sin(time * 0.5 + tm.phase) * 0.3;
        tm.mesh.position.y = 2.5 + Math.sin(time * 1.2 + tm.phase) * 0.4;
      }
    });

    // ── Animate Key ──
    const s = store();
    if (solvedPuzzles.size >= 5 && s.memoriesFound >= 3) {
      worldAssets.keyMesh.rotation.x = time * 0.5;
      worldAssets.keyMesh.rotation.y = time * 0.8;
      worldAssets.keyMesh.position.y = 4 + Math.sin(time * 1.5) * 0.8;
    }

    // ── NPC Loops ──
    worldAssets.npcs.forEach((npc) => {
      npc.mesh.position.x = npc.baseX + Math.sin(time * 0.5 + npc.loopPhase) * 2;
      npc.mesh.position.z = npc.baseZ + Math.cos(time * 0.5 + npc.loopPhase) * 2;
      npc.mesh.material.opacity = 0.3 + Math.sin(time * 10 + npc.loopPhase) * 0.2;
    });

    // ── Checkpoint Detection ──
    worldAssets.checkpointMeshes.forEach((cp) => {
      const dx = player.position.x - cp.x;
      const dz = player.position.z - cp.z;
      if (Math.sqrt(dx * dx + dz * dz) < 3 && !cp.reached) {
        cp.reached = true;
        cp.mesh.material.color.set(0xffbb33);
        cp.mesh.material.opacity = 0.5;
        setState({ checkpointsReached: [...store().checkpointsReached, cp.label] });
        addLog(`CHECKPOINT: ${cp.label}`);
      }
    });

    // ── Interaction Prompts ──
    let nearSomething = false;
    LEVEL1_PUZZLES.forEach((p) => {
      const dx = player.position.x - p.position.x;
      const dz = player.position.z - p.position.z;
      if (Math.sqrt(dx * dx + dz * dz) < 7 && !solvedPuzzles.has(p.id)) {
        nearSomething = true;
        setState({ interactionPrompt: `Presiona [E] para resolver: ${p.title}` });
      }
    });

    LEVEL1_TOKENS.forEach((token) => {
      const dx = player.position.x - token.position.x;
      const dz = player.position.z - token.position.z;
      if (Math.sqrt(dx * dx + dz * dz) < 5 && !collectedTokenIds.has(token.id)) {
        nearSomething = true;
        const label = token.type === 'memory' ? '🔮 Presiona [E] para recoger recuerdo' : '❓ Presiona [E] para recoger token';
        setState({ interactionPrompt: label });
      }
    });

    if (solvedPuzzles.size >= 5 && s.memoriesFound >= 3) {
      const dkx = player.position.x;
      const dkz = player.position.z + 140;
      if (Math.sqrt(dkx * dkx + dkz * dkz) < 7) {
        nearSomething = true;
        setState({ interactionPrompt: 'Presiona [E] para tomar la LLAVE ÁMBAR' });
      }
    }
    if (!nearSomething) setState({ interactionPrompt: '' });

    // ── Random Ghost Appearances ──
    if (!memoryEchoActive && Math.random() < 0.001) {
      const ghost = worldAssets.memoryGhost;
      ghost.mesh.material.opacity = 0.12;
      ghost.mesh.position.set(player.position.x + (Math.random() - 0.5) * 20, 1.75, player.position.z + (Math.random() - 0.5) * 20);
      setTimeout(() => { ghost.mesh.material.opacity = 0; }, 2000);
    }

    // ── Glitch Post-processing (subtle, no corruption) ──
    if (glitchCanvas.width !== container.clientWidth) {
      glitchCanvas.width = container.clientWidth;
      glitchCanvas.height = container.clientHeight;
    }
    glitchCtx.clearRect(0, 0, glitchCanvas.width, glitchCanvas.height);
    // Subtle scanlines only
    glitchCtx.fillStyle = 'rgba(42,36,32,0.008)';
    for (let y = 0; y < glitchCanvas.height; y += 4) {
      glitchCtx.fillRect(0, y, glitchCanvas.width, 1);
    }

    renderer.render(scene, camera);
  };

  loop();
  return () => { cancelAnimationFrame(animId); unsubs.forEach((u) => u()); };
}
