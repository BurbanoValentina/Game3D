export function startTrainingRoomLoop({
  THREE,
  scene,
  camera,
  renderer,
  mainLight,
  accentLights,
  particles,
  ring,
  player,
  mouseState,
  wallHeight,
  boundary,
  checkCollision,
  keysDown,
  tutorialSteps,
  stepRef,
  sprintStart,
  sprintDone,
  advancingRef,
  setProgress,
  onAdvanceStep,
}) {
  let disposed = false;
  let animId;
  let time = 0;

  const loop = () => {
    if (disposed) return;
    animId = requestAnimationFrame(loop);
    time += 0.016;

    const sensitivity = 0.002;
    player.yaw -= mouseState.x * sensitivity;
    player.pitch -= mouseState.y * sensitivity;
    player.pitch = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, player.pitch));
    mouseState.x = 0;
    mouseState.y = 0;

    camera.rotation.order = 'YXZ';
    camera.rotation.y = player.yaw;
    camera.rotation.x = player.pitch;

    const keys = keysDown.current;
    let vx = 0;
    let vz = 0;
    if (keys['KeyW']) vz = -player.speed;
    if (keys['KeyS']) vz = player.speed;
    if (keys['KeyA']) vx = -player.speed;
    if (keys['KeyD']) vx = player.speed;

    const sprinting = keys['ShiftLeft'] && (vx !== 0 || vz !== 0);
    if (sprinting) {
      const mul = player.sprintSpeed / player.speed;
      vx *= mul;
      vz *= mul;

      const st = tutorialSteps[stepRef.current];
      if (st?.type === 'sprint' && !sprintDone.current && !advancingRef.current) {
        if (!sprintStart.current) sprintStart.current = Date.now();
        const elapsed = Date.now() - sprintStart.current;
        setProgress(Math.min((elapsed / st.holdDuration) * 100, 100));
        if (elapsed >= st.holdDuration) {
          sprintDone.current = true;
          onAdvanceStep();
        }
      }
    } else {
      const st = tutorialSteps[stepRef.current];
      if (st?.type === 'sprint' && !sprintDone.current) {
        sprintStart.current = null;
        setProgress(0);
      }
    }

    const euler = new THREE.Euler(0, player.yaw, 0);
    const quat = new THREE.Quaternion().setFromEuler(euler);
    const forward = new THREE.Vector3(0, 0, vz).applyQuaternion(quat);
    const strafe = new THREE.Vector3(vx, 0, 0).applyQuaternion(quat);

    const newX = player.position.x + forward.x + strafe.x;
    const newZ = player.position.z + forward.z + strafe.z;

    if (!checkCollision(newX, player.position.z)) {
      player.position.x = Math.max(-boundary, Math.min(boundary, newX));
    }
    if (!checkCollision(player.position.x, newZ)) {
      player.position.z = Math.max(-boundary, Math.min(boundary, newZ));
    }

    player.velocity.y -= 0.012;
    player.position.y += player.velocity.y;
    if (player.position.y <= 3) {
      player.position.y = 3;
      player.velocity.y = 0;
      player.grounded = true;
    }

    accentLights.forEach((al) => {
      al.light.intensity = 0.6 + 0.3 * Math.sin(time * 1.5 + al.phase);
    });
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

  return () => {
    disposed = true;
    cancelAnimationFrame(animId);
  };
}
