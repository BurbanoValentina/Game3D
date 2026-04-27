// ══════════════════════════════════════════════════════
//  LEVEL 2 WORLD BUILDER — Biblioteca de Halliday
//  Warm library with bookshelves, candle lights
// ══════════════════════════════════════════════════════

import { buildSky } from './world/SkyBuilder';
import { buildPuzzleMarkers, buildTokenMarkers, buildParkourBlocks, buildKeyAndCheckpoints } from './world/GameElementsBuilder';
import { buildParticles, buildNeonLights, buildGraffiti, buildNPCs, buildGhost, buildBillboards } from './world/AmbientBuilder';

export function createWorldAssets(scene, THREE, buildings) {
  const assets = {
    neonLights: [], puzzleMarkers: [], checkpointMeshes: [], npcs: [],
    particles: null, graffitiMeshes: [], memoryGhost: null,
    keyMesh: null, keyLight: null, keyMat: null,
    parkourBlocks: [], tokenMarkers: [], lightBeams: [], illustrations: {},
  };

  buildSky(scene, THREE);
  buildNeonLights(scene, THREE, assets);
  buildGraffiti(scene, THREE, assets, buildings);
  buildParticles(scene, THREE, assets);
  buildPuzzleMarkers(scene, THREE, assets);
  buildParkourBlocks(scene, THREE, assets);
  buildTokenMarkers(scene, THREE, assets);
  buildKeyAndCheckpoints(scene, THREE, assets);
  buildGhost(scene, THREE, assets);
  buildNPCs(scene, THREE, assets);
  buildBillboards(scene, THREE);

  return assets;
}
