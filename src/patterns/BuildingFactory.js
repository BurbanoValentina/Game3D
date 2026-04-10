// ══════════════════════════════════════════════════════
//  BUILDING FACTORY — 15 Unique Iconic Buildings
//  Each with flag, name sign, real-world colors
// ══════════════════════════════════════════════════════

import { BUILDING_CONFIGS } from '../constants/gameConstants';
import { ICONIC_BUILDINGS } from '../constants/buildingData';
import { createBuildingTexture } from './BuildingTextures';
import { createBuildingFlag } from './BuildingHelpers';
import { createPyramid, createGherkin, createFlatiron, createTwistTower, createGeodesic, createSpiral, createLotus } from './BuildingShapesA';
import { createHabitat, createDome, createCubeHouse, createRadialTower, createStandardBox } from './BuildingShapesB';

const rand = (min, max) => min + Math.random() * (max - min);

const SHAPE_CREATORS = {
  pyramid: createPyramid,
  gherkin: createGherkin,
  flatiron: createFlatiron,
  twistTower: createTwistTower,
  geodesic: createGeodesic,
  spiral: createSpiral,
  lotus: createLotus,
  habitat: createHabitat,
  dome: createDome,
  cubeHouse: createCubeHouse,
  radialTower: createRadialTower,
};

const BuildingFactory = {
  create(type, x, z, THREE, overrideColor) {
    const cfg = BUILDING_CONFIGS[type] || BUILDING_CONFIGS.block;
    const w = rand(cfg.wRange[0], cfg.wRange[1]);
    const h = rand(cfg.hRange[0], cfg.hRange[1]);
    const d = rand(cfg.dRange[0], cfg.dRange[1]);
    const neonColor = overrideColor || 0x00f0ff;
    const codeTexture = createBuildingTexture(w, h, neonColor, THREE);

    let mesh;
    const creator = SHAPE_CREATORS[type];

    if (creator) {
      mesh = creator(x, z, w, h, d, neonColor, codeTexture, THREE);
    } else {
      // Standard box for skyscraper, tower, block, neonTower
      mesh = createStandardBox(x, z, w, h, d, neonColor, codeTexture, THREE);
    }

    mesh.userData.isGlitching = false;
    mesh.userData.glitchPhase = 0;
    mesh.userData.originalPosition = mesh.position.clone();
    mesh.userData.originalScale = mesh.scale.clone();
    mesh.userData.neonColor = neonColor;

    return { mesh, height: h, width: w, depth: d, neonColor, type };
  },

  triggerGlitchDestruction(building) {
    const mesh = building.mesh;
    if (mesh.userData.isGlitching) return;
    mesh.userData.isGlitching = true;
    mesh.userData.glitchPhase = 0;
  },

  updateGlitchDestruction(building) {
    const mesh = building.mesh;
    if (!mesh.userData.isGlitching) return;
    mesh.userData.glitchPhase += 1;
    const phase = mesh.userData.glitchPhase;
    if (phase < 30) {
      mesh.position.x = mesh.userData.originalPosition.x + (Math.random() - 0.5) * 0.5;
    } else if (phase < 250) {
      const t = Math.min(1, (phase - 30) / 220);
      mesh.position.x = mesh.userData.originalPosition.x + Math.sin(phase * 0.3) * (0.3 * (1 - t));
    } else {
      mesh.userData.isGlitching = false;
      mesh.scale.copy(mesh.userData.originalScale);
      mesh.position.copy(mesh.userData.originalPosition);
    }
  },

  /**
   * Generate the city with exactly 15 unique iconic buildings
   * Each placed at fixed positions with flag/name sign
   */
  generateCity(THREE, scene) {
    const buildings = [];
    const colliders = [];
    const flags = [];
    const padding = 3;

    ICONIC_BUILDINGS.forEach((bData) => {
      const building = BuildingFactory.create(
        bData.type, bData.x, bData.z, THREE, bData.accentColor
      );

      scene.add(building.mesh);
      buildings.push(building);

      // Add collider
      colliders.push({
        minX: bData.x - building.width / 2 - padding,
        maxX: bData.x + building.width / 2 + padding,
        minZ: bData.z - building.depth / 2 - padding,
        maxZ: bData.z + building.depth / 2 + padding,
      });

      // Add flag with name and location
      const flag = createBuildingFlag(bData, building.height, THREE, scene);
      flags.push(flag);
    });

    return { buildings, colliders, flags };
  },
};

export default BuildingFactory;
