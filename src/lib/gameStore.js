// ══════════════════════════════════════════════════════
//  ZUSTAND GAME STORE — MULTI-LEVEL
// ══════════════════════════════════════════════════════

import { create } from 'zustand';
import { GameStates, PLAYER_CONFIG, TOTAL_LEVELS } from '../constants/gameConstants';

const useGameStore = create((set, get) => ({
  // ─── Game State Machine ───
  gameState: GameStates.LOADING,
  previousState: null,
  setGameState: (newState) => set((state) => ({ previousState: state.gameState, gameState: newState })),

  // ─── Current Level ───
  currentLevel: 1,
  setCurrentLevel: (level) => set({ currentLevel: level }),

  // ─── Level Completion Flags ───
  level1Completed: false,
  level2Completed: false,
  level3Completed: false,
  level4Completed: false,
  level5Completed: false,
  setLevel1Completed: (val) => set({ level1Completed: val }),
  setLevel2Completed: (val) => set({ level2Completed: val }),
  setLevel3Completed: (val) => set({ level3Completed: val }),
  setLevel4Completed: (val) => set({ level4Completed: val }),
  setLevel5Completed: (val) => set({ level5Completed: val }),
  setLevelCompleted: (level, val) => {
    const key = `level${level}Completed`;
    set({ [key]: val });
  },
  isLevelUnlocked: (level) => {
    if (level === 1) return true;
    const s = get();
    return s[`level${level - 1}Completed`] === true;
  },

  // ─── Level Progression ───
  advanceToNextLevel: () => {
    const s = get();
    const nextLevel = s.currentLevel + 1;
    if (nextLevel <= TOTAL_LEVELS) {
      s.setLevelCompleted(s.currentLevel, true);
      set({
        currentLevel: nextLevel,
        lives: PLAYER_CONFIG.initialLives,
        coins: s.coins, // keep coins across levels
        memoryAvailable: true, memoryActive: false, memoryTimer: 0,
        puzzlesSolved: 0, currentPuzzle: null, puzzleInput: '', showHint: false,
        collectedTokens: [], memoriesFound: 0, currentTokenData: null,
        screamerActive: false, screamerColor: 'red',
        playerX: 0, playerZ: 0,
        keyObtained: false, checkpointsReached: [], systemLogs: [],
        bootText: [], bootComplete: false, cinematicText: '', cinematicDone: false,
        glitchIntensity: 0, interactionPrompt: '', showMap: false, victoryChoice: null,
        levelTimeRemaining: 900, levelTimerActive: false,
      });
    }
  },

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
  totalPuzzles: 3,
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

  // ─── Level Timer (15 min = 900 seconds) ───
  levelTimeRemaining: 900,
  levelTimerActive: false,
  setLevelTimeRemaining: (val) => set({ levelTimeRemaining: val }),
  setLevelTimerActive: (val) => set({ levelTimerActive: val }),

  // ─── Level Progress ───
  keyObtained: false,
  checkpointsReached: [],
  systemLogs: [],
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

  // ─── Superadmin ───
  superadminMode: false,
  setSuperadminMode: (val) => set({ superadminMode: val }),
  jumpToLevel: (level, direct = false) => {
    const s = get();
    // Mark all previous levels as completed so unlock checks pass
    const completionUpdates = {};
    for (let i = 1; i < level; i++) completionUpdates[`level${i}Completed`] = true;
    set({
      ...completionUpdates,
      currentLevel: level,
      lives: PLAYER_CONFIG.initialLives,
      memoryAvailable: true, memoryActive: false, memoryTimer: 0,
      puzzlesSolved: 0, currentPuzzle: null, puzzleInput: '', showHint: false,
      collectedTokens: [], memoriesFound: 0, currentTokenData: null,
      screamerActive: false, screamerColor: 'red',
      playerX: 0, playerZ: 0,
      keyObtained: false, checkpointsReached: [], systemLogs: [],
      bootText: [], bootComplete: false, cinematicText: '', cinematicDone: false,
      glitchIntensity: 0, interactionPrompt: '', showMap: false, victoryChoice: null,
      levelTimeRemaining: 900, levelTimerActive: false,
      gameState: direct ? 'PLAYING' : 'BOOT',
      previousState: s.gameState,
    });
  },

  // ─── Full Reset ───
  resetGame: () => set({
    currentLevel: 1,
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
    levelTimeRemaining: 900, levelTimerActive: false,
  }),

  // ─── Reset current level only ───
  resetCurrentLevel: () => set((s) => ({
    lives: PLAYER_CONFIG.initialLives,
    memoryAvailable: true, memoryActive: false, memoryTimer: 0,
    puzzlesSolved: 0, currentPuzzle: null, puzzleInput: '', showHint: false,
    collectedTokens: [], memoriesFound: 0, currentTokenData: null,
    screamerActive: false, screamerColor: 'red',
    playerX: 0, playerZ: 0,
    keyObtained: false, checkpointsReached: [], systemLogs: [],
    bootText: [], bootComplete: false, cinematicText: '', cinematicDone: false,
    glitchIntensity: 0, interactionPrompt: '', showMap: false, victoryChoice: null,
    levelTimeRemaining: 900, levelTimerActive: false,
  })),
}));

export default useGameStore;
