// ══════════════════════════════════════════════════════
//  ZUSTAND GAME STORE — ACTUALIZADO
// ══════════════════════════════════════════════════════

import { create } from 'zustand';
import { GameStates, PLAYER_CONFIG } from '../constants/gameConstants';

const useGameStore = create((set, get) => ({
  // ─── Game State Machine ───
  gameState: GameStates.LOADING,
  previousState: null,
  setGameState: (newState) => set((state) => ({ previousState: state.gameState, gameState: newState })),

  // ─── Player Stats (10 lives + coins) ───
  lives: PLAYER_CONFIG.initialLives,
  coins: PLAYER_CONFIG.initialCoins,
  setLives: (lives) => set({ lives: Math.max(0, lives) }),
  addCoins: (amount) => set((s) => ({ coins: s.coins + amount })),
  removeLife: () => set((s) => ({ lives: Math.max(0, s.lives - 1) })),

  // ─── Memory Echo ───
  memoryAvailable: true,
  memoryActive: false,
  memoryTimer: 0,
  setMemoryAvailable: (val) => set({ memoryAvailable: val }),
  setMemoryActive: (val) => set({ memoryActive: val }),
  setMemoryTimer: (val) => set({ memoryTimer: val }),

  // ─── Puzzles ───
  puzzlesSolved: 0,
  currentPuzzle: null,
  puzzleInput: '',
  showHint: false,
  totalPuzzles: 5,
  setPuzzlesSolved: (val) => set({ puzzlesSolved: val }),
  setCurrentPuzzle: (puzzle) => set({ currentPuzzle: puzzle }),
  setPuzzleInput: (val) => set({ puzzleInput: val }),
  setShowHint: (val) => set({ showHint: val }),

  // ─── Token System ───
  collectedTokens: [],
  memoriesFound: 0,
  totalMemories: 3,
  currentTokenData: null,
  screamerActive: false,
  screamerColor: 'red',
  addCollectedToken: (id) => set((s) => ({ collectedTokens: [...s.collectedTokens, id] })),
  setCurrentTokenData: (data) => set({ currentTokenData: data }),
  setScreamerActive: (active, color) => set({ screamerActive: active, screamerColor: color || 'red' }),
  incrementMemories: () => set((s) => ({ memoriesFound: s.memoriesFound + 1 })),

  // ─── Player Position (for minimap) ───
  playerX: 0,
  playerZ: 0,
  setPlayerPosition: (x, z) => set({ playerX: x, playerZ: z }),

  // ─── Level Progress ───
  keyObtained: false,
  checkpointsReached: [],
  systemLogs: [],
  currentLevel: 1,
  setKeyObtained: (val) => set({ keyObtained: val }),
  addCheckpoint: (label) => set((s) => ({ checkpointsReached: [...s.checkpointsReached, label] })),
  addLog: (msg) => set((s) => ({ systemLogs: [...s.systemLogs.slice(-8), `[${new Date().toLocaleTimeString()}] ${msg}`] })),

  // ─── Boot Sequence ───
  bootText: [],
  bootComplete: false,
  cinematicText: '',
  cinematicDone: false,
  addBootLine: (text) => set((s) => ({ bootText: [...s.bootText, text] })),
  setBootComplete: (val) => set({ bootComplete: val }),
  setCinematicText: (val) => set({ cinematicText: val }),
  setCinematicDone: (val) => set({ cinematicDone: val }),

  // ─── Visual Effects ───
  glitchIntensity: 0,
  interactionPrompt: '',
  showMap: false,
  setGlitchIntensity: (val) => set({ glitchIntensity: val }),
  setInteractionPrompt: (val) => set({ interactionPrompt: val }),
  setShowMap: (val) => set({ showMap: val }),

  // ─── Settings ───
  settings: {
    masterVolume: 80, musicVolume: 65, sfxVolume: 90, voiceVolume: 100,
    sensitivity: 5, vibration: true, graphicsQuality: 'ALTA',
    glitchEffect: true, crtLines: true, subtitles: false, reduceFlashing: false,
  },
  updateSetting: (key, value) => set((s) => ({ settings: { ...s.settings, [key]: value } })),

  // ─── Selected Character ───
  selectedCharacter: 'eva',
  setSelectedCharacter: (char) => set({ selectedCharacter: char }),

  // ─── Victory ───
  victoryChoice: null,
  setVictoryChoice: (choice) => set({ victoryChoice: choice }),

  // ─── Audio State ───
  audioInitialized: false,
  setAudioInitialized: (val) => set({ audioInitialized: val }),

  // ─── Full Reset ───
  resetGame: () => set({
    lives: PLAYER_CONFIG.initialLives,
    coins: PLAYER_CONFIG.initialCoins,
    memoryAvailable: true, memoryActive: false, memoryTimer: 0,
    puzzlesSolved: 0, currentPuzzle: null, puzzleInput: '', showHint: false,
    collectedTokens: [], memoriesFound: 0, currentTokenData: null,
    screamerActive: false, screamerColor: 'red',
    playerX: 0, playerZ: 0,
    keyObtained: false, checkpointsReached: [], systemLogs: [],
    bootText: [], bootComplete: false, cinematicText: '', cinematicDone: false,
    glitchIntensity: 0, interactionPrompt: '', showMap: false, victoryChoice: null,
  }),
}));

export default useGameStore;
