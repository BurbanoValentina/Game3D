// ══════════════════════════════════════════════════════
//  WORLD BUILDER — Orchestrator
//  Imports from modular sub-builders
//  Blue sky, clouds, galaxy breach, city elements
// ══════════════════════════════════════════════════════

import { buildSky } from './world/SkyBuilder';
import { buildStreets } from './world/StreetBuilder';
import { buildProps } from './world/PropBuilder';
import { buildPuzzleMarkers, buildTokenMarkers, buildParkourBlocks, buildKeyAndCheckpoints } from './world/GameElementsBuilder';
import { buildParticles, buildNeonLights, buildGraffiti, buildNPCs, buildGhost, buildBillboards } from './world/AmbientBuilder';
import { buildIllustrations } from './world/IllustrationBuilder';

/**
 * Creates all world assets for Level 1
 * Reduced world: 250x250 with 15 unique buildings
 */
export function createWorldAssets(scene, THREE, buildings) {
  const assets = {
    neonLights: [],
    puzzleMarkers: [],
    checkpointMeshes: [],
    npcs: [],
    particles: null,
    graffitiMeshes: [],
    memoryGhost: null,
    keyMesh: null,
    keyLight: null,
    keyMat: null,
    parkourBlocks: [],
    tokenMarkers: [],
    lightBeams: [],
    illustrations: {},
  };

  // ── Sky with clouds + glass breach galaxy ──
  buildSky(scene, THREE);

  // ── Neon point lights ──
  buildNeonLights(scene, THREE, assets);

  // ── Graffiti on buildings ──
  buildGraffiti(scene, THREE, assets, buildings);

  // ── Floating particles ──
  buildParticles(scene, THREE, assets);

  // ── Puzzle markers + light beams ──
  buildPuzzleMarkers(scene, THREE, assets);

  // ── Parkour blocks ──
  buildParkourBlocks(scene, THREE, assets);

  // ── Token markers ──
  buildTokenMarkers(scene, THREE, assets);

  // ── Key + Checkpoints ──
  buildKeyAndCheckpoints(scene, THREE, assets);

  // ── Ghost ──
  buildGhost(scene, THREE, assets);

  // ── NPCs ──
  buildNPCs(scene, THREE, assets);

  // ── Holographic billboards ──
  buildBillboards(scene, THREE);

  // ── Streets, sidewalks, crosswalks ──
  const streetW = buildStreets(scene, THREE);

  // ── Trees, rocks, lamps, benches, etc. ──
  buildProps(scene, THREE, streetW);

  // ── Memory illustrations ──
  assets.illustrations = buildIllustrations(THREE);

  return assets;
}
