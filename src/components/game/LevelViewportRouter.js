// ══════════════════════════════════════════════════════
//  LEVEL VIEWPORT ROUTER
//  Renders the correct GameViewport based on currentLevel
// ══════════════════════════════════════════════════════

'use client';
import useGameStore from '../../lib/gameStore';
import GameViewport1 from '../level1/GameViewport';
import GameViewport2 from '../level2/GameViewport';
import GameViewport3 from '../level3/GameViewport';
import GameViewport4 from '../level4/GameViewport';
import GameViewport5 from '../level5/GameViewport';

const VIEWPORTS = {
  1: GameViewport1,
  2: GameViewport2,
  3: GameViewport3,
  4: GameViewport4,
  5: GameViewport5,
};

export default function LevelViewportRouter() {
  const currentLevel = useGameStore((s) => s.currentLevel);
  const Viewport = VIEWPORTS[currentLevel] || GameViewport1;
  return <Viewport key={`level-${currentLevel}`} />;
}
