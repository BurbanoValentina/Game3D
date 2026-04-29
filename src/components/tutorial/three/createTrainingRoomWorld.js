import { createTrainingRoomBase } from './createTrainingRoomBase';
import { createTrainingRoomProps } from './createTrainingRoomProps';

export function createTrainingRoomWorld({ THREE, container }) {
  const base = createTrainingRoomBase({ THREE, container });
  const props = createTrainingRoomProps({
    THREE,
    scene: base.scene,
    camera: base.camera,
    floorSize: base.floorSize,
    halfSize: base.halfSize,
    wallHeight: base.wallHeight,
    accentColors: base.accentColors,
  });

  const dispose = () => {
    base.renderer.dispose();
    if (container.contains(base.renderer.domElement)) {
      container.removeChild(base.renderer.domElement);
    }
  };

  return {
    scene: base.scene,
    camera: base.camera,
    renderer: base.renderer,
    mainLight: base.mainLight,
    accentLights: base.accentLights,
    wallHeight: base.wallHeight,
    particles: props.particles,
    ring: props.ring,
    player: props.player,
    mouseState: props.mouseState,
    boundary: props.boundary,
    checkCollision: props.checkCollision,
    dispose,
  };
}
