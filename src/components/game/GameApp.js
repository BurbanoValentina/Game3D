'use client';

// ══════════════════════════════════════════════════════
//  GAME APP — Space Station Orchestrator
// ══════════════════════════════════════════════════════

import { useEffect, useCallback } from 'react';
import { GameStates } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';
import audioManager from '../../lib/audioManager';

import LoaderScreen from '../menu/LoaderScreen';
import LandingPage from '../menu/LandingPage';
import RegisterScreen from '../registro/RegisterScreen';
import LoginScreen from '../registro/LoginScreen';
import MainMenu from '../menu/MainMenu';
import TrainingRoom from '../menu/TrainingRoom';
import SettingsScreen from '../ajustes/SettingsScreen';
import TutorialScreen from '../tutorial/TutorialScreen';
import TutorialGame from '../tutorial/TutorialGame';
import CreditsScreen from '../credits/CreditsScreen';
import BootSequence from '../tutorial/BootSequence';
import CinematicScreen from '../tutorial/CinematicScreen';
import GameViewport from '../level1/GameViewport';
import PuzzleModal from '../level1/PuzzleModal';
import KeyObtainedScreen from '../level1/KeyObtainedScreen';
import VictoryScreen from '../level1/VictoryScreen';
import GameOverScreen from '../level1/GameOverScreen';
import PauseMenu from '../level1/PauseMenu';
import ScreamerOverlay from '../level1/ScreamerOverlay';
import TokenMemoryOverlay from '../level1/TokenMemoryOverlay';
import StatusBar from '../level1/StatusBar';
import HolographicOverlay from '../effects/HolographicOverlay';

export default function GameApp() {
  const gameState = useGameStore((s) => s.gameState);
  const setGameState = useGameStore((s) => s.setGameState);

  useEffect(() => {
    const timer = setTimeout(() => setGameState(GameStates.LANDING), 2800);
    return () => clearTimeout(timer);
  }, [setGameState]);

  const handleFirstInteraction = useCallback(async () => {
    if (!audioManager.initialized) {
      await audioManager.init();
      await audioManager.resume();
    }
    window.removeEventListener('click', handleFirstInteraction);
    window.removeEventListener('keydown', handleFirstInteraction);
  }, []);

  useEffect(() => {
    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [handleFirstInteraction]);

  useEffect(() => {
    return () => { audioManager.dispose(); };
  }, []);

  // States that keep the 3D viewport alive behind overlays
  const viewportStates = [
    GameStates.PLAYING, GameStates.PUZZLE, GameStates.MEMORY,
    GameStates.PAUSED, GameStates.SCREAMER, GameStates.TOKEN_MEMORY,
  ];

  const showStatusBar = ![
    GameStates.LOADING, GameStates.LANDING, GameStates.REGISTER,
    GameStates.LOGIN, GameStates.TUTORIAL, GameStates.TUTORIAL_GAME,
    GameStates.CREDITS, GameStates.TRAINING_ROOM,
  ].includes(gameState);

  return (
    <div className="fixed inset-0 overflow-hidden noise crt-overlay" style={{ background: 'var(--cream)' }}>
      <HolographicOverlay />
      {showStatusBar && <StatusBar />}

      {gameState === GameStates.LOADING && <LoaderScreen />}
      {gameState === GameStates.LANDING && <LandingPage />}
      {gameState === GameStates.REGISTER && <RegisterScreen />}
      {gameState === GameStates.LOGIN && <LoginScreen />}
      {gameState === GameStates.MAIN_MENU && <MainMenu />}
      {gameState === GameStates.TRAINING_ROOM && <TrainingRoom />}
      {gameState === GameStates.SETTINGS && <SettingsScreen />}
      {gameState === GameStates.TUTORIAL && <TutorialScreen />}
      {gameState === GameStates.TUTORIAL_GAME && <TutorialGame />}
      {gameState === GameStates.CREDITS && <CreditsScreen />}
      {gameState === GameStates.BOOT && <BootSequence />}
      {gameState === GameStates.CINEMATIC && <CinematicScreen />}

      {viewportStates.includes(gameState) && <GameViewport />}

      {gameState === GameStates.PUZZLE && <PuzzleModal />}
      {gameState === GameStates.PAUSED && <PauseMenu />}
      {gameState === GameStates.SCREAMER && <ScreamerOverlay />}
      {gameState === GameStates.TOKEN_MEMORY && <TokenMemoryOverlay />}
      {gameState === GameStates.KEY_OBTAINED && <KeyObtainedScreen />}
      {gameState === GameStates.VICTORY && <VictoryScreen />}
      {gameState === GameStates.GAME_OVER && <GameOverScreen />}
    </div>
  );
}
