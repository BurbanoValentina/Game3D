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
import CinematicScreen from '../tutorial/CinematicScreen';
import LevelViewportRouter from '../game/LevelViewportRouter';
import SuperAdminPanel from '../game/SuperAdminPanel';
import PuzzleModal from '../level1/PuzzleModal';
import KeyObtainedScreen from '../level1/KeyObtainedScreen';
import VictoryScreen from '../level1/VictoryScreen';
import GameOverScreen from '../level1/GameOverScreen';
import PauseMenu from '../level1/PauseMenu';
import ScreamerOverlay from '../level1/ScreamerOverlay';
import TokenMemoryOverlay from '../level1/TokenMemoryOverlay';
import AwakeningOverlay from '../level1/AwakeningOverlay';
import WrongAnswerOverlay from '../level1/WrongAnswerOverlay';
import StatusBar from '../level1/StatusBar';
import HolographicOverlay from '../effects/HolographicOverlay';

export default function GameApp() {
  const gameState        = useGameStore((s) => s.gameState);
  const setGameState     = useGameStore((s) => s.setGameState);
  const superadminMode   = useGameStore((s) => s.superadminMode);

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

  // ─── Music scene management based on game state ───
  useEffect(() => {
    if (!audioManager.initialized) return;
    const musicMap = {
      [GameStates.LOADING]: 'menu',
      [GameStates.LANDING]: 'menu',
      [GameStates.REGISTER]: 'menu',
      [GameStates.LOGIN]: 'menu',
      [GameStates.MAIN_MENU]: 'menu',
      [GameStates.TRAINING_ROOM]: 'menu',
      [GameStates.SETTINGS]: 'menu',
      [GameStates.TUTORIAL]: 'tutorial',
      [GameStates.TUTORIAL_GAME]: 'tutorial',
      [GameStates.CREDITS]: 'menu',
      [GameStates.BOOT]: 'narration',
      [GameStates.CINEMATIC]: 'narration',
      [GameStates.AWAKENING]: 'narration',
      [GameStates.PLAYING]: 'gameplay',
      [GameStates.PUZZLE]: 'gameplay',
      [GameStates.PAUSED]: 'gameplay',
      [GameStates.WRONG_ANSWER]: 'error',
      [GameStates.TOKEN_MEMORY]: 'memory',
      [GameStates.MEMORY]: 'gameplay',
      [GameStates.SCREAMER]: 'error',
      [GameStates.KEY_OBTAINED]: 'victory',
      [GameStates.VICTORY]: 'victory',
      [GameStates.GAME_OVER]: 'gameover',
    };
    const scene = musicMap[gameState];
    if (scene) audioManager.playScene(scene);
  }, [gameState]);

  useEffect(() => {
    return () => { audioManager.dispose(); };
  }, []);

  // States that keep the 3D viewport alive behind overlays
  const viewportStates = [
    GameStates.PLAYING, GameStates.PUZZLE, GameStates.MEMORY,
    GameStates.PAUSED, GameStates.SCREAMER, GameStates.TOKEN_MEMORY,
    GameStates.AWAKENING, GameStates.WRONG_ANSWER,
  ];

  const showStatusBar = ![
    GameStates.LOADING, GameStates.LANDING, GameStates.REGISTER,
    GameStates.LOGIN, GameStates.TUTORIAL, GameStates.TUTORIAL_GAME,
    GameStates.CREDITS, GameStates.TRAINING_ROOM, GameStates.AWAKENING,
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
      {gameState === GameStates.CINEMATIC && <CinematicScreen />}

      {viewportStates.includes(gameState) && <LevelViewportRouter />}

      {gameState === GameStates.AWAKENING && <AwakeningOverlay />}
      {gameState === GameStates.PUZZLE && <PuzzleModal />}
      {gameState === GameStates.PAUSED && <PauseMenu />}
      {gameState === GameStates.SCREAMER && <ScreamerOverlay />}
      {gameState === GameStates.TOKEN_MEMORY && <TokenMemoryOverlay />}
      {gameState === GameStates.WRONG_ANSWER && <WrongAnswerOverlay />}
      {gameState === GameStates.KEY_OBTAINED && <KeyObtainedScreen />}
      {gameState === GameStates.VICTORY && <VictoryScreen />}
      {gameState === GameStates.GAME_OVER && <GameOverScreen />}

      {superadminMode && <SuperAdminPanel />}
    </div>
  );
}
