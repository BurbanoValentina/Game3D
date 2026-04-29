import { attachTrainingRoomControls } from './attachTrainingRoomControls';
import { createTrainingRoomWorld } from './createTrainingRoomWorld';
import { startTrainingRoomLoop } from './startTrainingRoomLoop';

export async function initTutorialTrainingRoom(args) {
  const THREE = await import('three');

  const world = createTrainingRoomWorld({ THREE, container: args.container });
  const detachControls = attachTrainingRoomControls({
    ...args,
    container: args.container,
    renderer: world.renderer,
    camera: world.camera,
    player: world.player,
    mouseState: world.mouseState,
  });

  const stopLoop = startTrainingRoomLoop({
    THREE,
    ...world,
    ...args,
  });

  return () => {
    stopLoop?.();
    detachControls?.();
    if (document.pointerLockElement) document.exitPointerLock();
    world.dispose?.();
  };
}
