export function attachTrainingRoomControls({
  container,
  renderer,
  camera,
  tutorialSteps,
  stepRef,
  advancingRef,
  keysDown,
  keysUsed,
  jumpCount,
  mouseAccum,
  sprintStart,
  setProgress,
  setPointerLocked,
  onAdvanceStep,
  onFinish,
  player,
  mouseState,
}) {
  const onKeyDown = (e) => {
    keysDown.current[e.code] = true;
    const t = tutorialSteps[stepRef.current];
    if (!t || advancingRef.current) return;

    if (t.type === 'jump' && e.code === 'Space' && player.grounded) {
      player.velocity.y = player.jumpForce;
      player.grounded = false;
      jumpCount.current++;
      setProgress(Math.min((jumpCount.current / t.requiredCount) * 100, 100));
      if (jumpCount.current >= t.requiredCount) onAdvanceStep();
    }

    if (t.type === 'move' && t.requiredKeys.includes(e.code)) {
      keysUsed.current.add(e.code);
      setProgress(Math.min((keysUsed.current.size / t.requiredUnique) * 100, 100));
      if (keysUsed.current.size >= t.requiredUnique) onAdvanceStep();
    }

    if (t.type === 'final' && e.code === 'Enter') onFinish();
  };

  const onKeyUp = (e) => {
    keysDown.current[e.code] = false;
    const t = tutorialSteps[stepRef.current];
    if (t?.type === 'sprint' && e.code === 'ShiftLeft') sprintStart.current = null;
  };

  const onMouseMove = (e) => {
    if (!document.pointerLockElement) return;
    mouseState.x += e.movementX;
    mouseState.y += e.movementY;

    const t = tutorialSteps[stepRef.current];
    if (t?.type === 'mouse' && !advancingRef.current) {
      mouseAccum.current += Math.abs(e.movementX) + Math.abs(e.movementY);
      setProgress(Math.min((mouseAccum.current / t.requiredMouseMove) * 100, 100));
      if (mouseAccum.current >= t.requiredMouseMove) onAdvanceStep();
    }
  };

  const onPointerLockChange = () => {
    const locked = !!document.pointerLockElement;
    setPointerLocked(locked);
    if (!locked) return;

    const t = tutorialSteps[stepRef.current];
    if (t?.type === 'click' && !advancingRef.current) {
      setProgress(100);
      onAdvanceStep();
    }
  };

  const onClick = () => {
    if (!document.pointerLockElement) renderer.domElement.requestPointerLock();
    if (tutorialSteps[stepRef.current]?.type === 'final') onFinish();
  };

  const onResize = () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('pointerlockchange', onPointerLockChange);
  renderer.domElement.addEventListener('click', onClick);
  window.addEventListener('resize', onResize);

  return () => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('pointerlockchange', onPointerLockChange);
    renderer.domElement.removeEventListener('click', onClick);
    window.removeEventListener('resize', onResize);
  };
}
