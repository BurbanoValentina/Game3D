'use client';

import { useMemo, useState, useEffect } from 'react';
import { GameStates } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';
import audioManager from '../../lib/audioManager';

import TrainingRoomBackground from './trainingRoom/TrainingRoomBackground';
import TrainingRoomHeader from './trainingRoom/TrainingRoomHeader';
import TrainingRoomModuleCard from './trainingRoom/TrainingRoomModuleCard';
import TrainingRoomQuote from './trainingRoom/TrainingRoomQuote';
import TrainingRoomTopBar from './trainingRoom/TrainingRoomTopBar';
import { buildTrainingModules, KEY_RING } from './trainingRoom/moduleData';

export default function TrainingRoom() {
  const setGameState = useGameStore((s) => s.setGameState);
  const resetGame = useGameStore((s) => s.resetGame);
  const level1Completed = useGameStore((s) => s.level1Completed);
  const [visible, setVisible] = useState(false);
  const [hoveredModule, setHoveredModule] = useState(null);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const handleTutorial = () => {
    resetGame();
    setGameState(GameStates.TUTORIAL_GAME);
  };

  const handleLevel1 = async () => {
    resetGame();
    await audioManager.init();
    await audioManager.resume();
    setGameState(GameStates.CINEMATIC);
  };

  const handleCredits = () => {
    if (!level1Completed) return;
    setGameState(GameStates.CREDITS);
  };

  const handleBack = () => {
    setGameState(GameStates.MAIN_MENU);
  };

  const modules = useMemo(
    () =>
      buildTrainingModules({
        level1Completed,
        handleTutorial,
        handleLevel1,
        handleCredits,
      }),
    [level1Completed]
  );

  const keys = useMemo(
    () =>
      KEY_RING.map((k) => ({
        c: k.c,
        obtained: k.key === 'level1Completed' ? level1Completed : false,
      })),
    [level1Completed]
  );

  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center space-light-bg overflow-hidden">
      <TrainingRoomBackground />
      <TrainingRoomTopBar visible={visible} onBack={handleBack} keys={keys} />
      <TrainingRoomHeader visible={visible} />

      {/* ── Scrollable Module Grid ── */}
      <div className="flex-1 w-full overflow-y-auto scrollbar-hide px-4 pb-6 pt-4" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 2%, black 95%, transparent)' }}>
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3">
          {modules.map((mod, i) => (
            <TrainingRoomModuleCard
              key={mod.id}
              mod={mod}
              index={i}
              visible={visible}
              hoveredId={hoveredModule}
              setHoveredId={setHoveredModule}
            />
          ))}
        </div>

        <TrainingRoomQuote visible={visible} />
      </div>
    </div>
  );
}
