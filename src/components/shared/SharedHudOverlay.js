// ══════════════════════════════════════════════════════
//  SHARED HUD OVERLAY — All levels
//  Reads currentLevel from store, loads correct data
// ══════════════════════════════════════════════════════

'use client';
import { useState, useMemo } from 'react';
import { LEVEL1_PUZZLES, LEVEL1_TOKENS, KEYS, LEVEL_NAMES } from '../../constants/gameConstants';
import { LEVEL2_PUZZLES, LEVEL2_TOKENS } from '../../constants/level2Constants';
import { LEVEL3_PUZZLES, LEVEL3_TOKENS } from '../../constants/level3Constants';
import { LEVEL4_PUZZLES, LEVEL4_TOKENS } from '../../constants/level4Constants';
import { LEVEL5_PUZZLES, LEVEL5_TOKENS } from '../../constants/level5Constants';
import useGameStore from '../../lib/gameStore';
import audioManager from '../../lib/audioManager';

const LEVEL_DATA = {
  1: { puzzles: LEVEL1_PUZZLES, tokens: LEVEL1_TOKENS, keyPos: { x: 0, z: -95 } },
  2: { puzzles: LEVEL2_PUZZLES, tokens: LEVEL2_TOKENS, keyPos: { x: 0, z: -80 } },
  3: { puzzles: LEVEL3_PUZZLES, tokens: LEVEL3_TOKENS, keyPos: { x: 0, z: -80 } },
  4: { puzzles: LEVEL4_PUZZLES, tokens: LEVEL4_TOKENS, keyPos: { x: 0, z: -80 } },
  5: { puzzles: LEVEL5_PUZZLES, tokens: LEVEL5_TOKENS, keyPos: { x: 0, z: -80 } },
};

function Heart({ active }) {
  return (
    <svg width="18" height="16" viewBox="0 0 18 16">
      <path d="M9 14s-7-4.35-7-8.5C2 3.01 3.79 1.5 6 1.5c1.54 0 2.81.99 3 2.36C9.19 2.49 10.46 1.5 12 1.5c2.21 0 4 1.51 4 3.5C16 9.65 9 14 9 14z"
        fill={active ? '#FF4466' : 'rgba(255,68,102,0.12)'}
        stroke={active ? '#FF4466' : 'rgba(255,68,102,0.2)'}
        strokeWidth="0.8"
        style={{ filter: active ? 'drop-shadow(0 0 4px #FF4466)' : 'none' }}
      />
    </svg>
  );
}

function CoinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="7" fill="#FFBB33" opacity="0.9" stroke="#FF8800" strokeWidth="0.5" style={{ filter: 'drop-shadow(0 0 3px #FFBB33)' }} />
      <text x="8" y="11" textAnchor="middle" fill="#AA6600" fontSize="8" fontWeight="bold" fontFamily="monospace">$</text>
    </svg>
  );
}

function PuzzleTracker({ solved, total, levelColor }) {
  return (
    <svg width="44" height="44" viewBox="0 0 50 50">
      <defs><filter id="ptGlow"><feGaussianBlur stdDeviation="1.5" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
      <circle cx="25" cy="25" r="20" fill="none" stroke={`${levelColor}22`} strokeWidth="2" />
      <circle cx="25" cy="25" r="20" fill="none" stroke={levelColor} strokeWidth="2" strokeLinecap="round" strokeDasharray={`${(solved / total) * 126} 126`} transform="rotate(-90 25 25)" filter="url(#ptGlow)" />
      <text x="25" y="23" textAnchor="middle" fill={levelColor} fontSize="12" fontFamily="Orbitron" fontWeight="700">{solved}</text>
      <text x="25" y="33" textAnchor="middle" fill="#A89880" fontSize="6" fontFamily="Share Tech Mono">/ {total}</text>
    </svg>
  );
}

function Minimap({ playerX, playerZ, puzzlesSolved, collectedTokens, levelPuzzles, levelTokens, keyPos }) {
  const mapSize = 160;
  const mapScale = mapSize / 250;
  const cx = mapSize / 2 + playerX * mapScale;
  const cz = mapSize / 2 + playerZ * mapScale;

  return (
    <div className="relative" style={{
      width: mapSize, height: mapSize,
      background: 'rgba(255,240,235,0.9)', border: '1px solid rgba(255,0,102,0.2)',
      borderRadius: 8, overflow: 'hidden', boxShadow: '0 0 20px rgba(255,0,102,0.04)',
    }}>
      <svg width={mapSize} height={mapSize} viewBox={`0 0 ${mapSize} ${mapSize}`}>
        {[0.25, 0.5, 0.75].map((f) => (
          <g key={f}>
            <line x1={f * mapSize} y1="0" x2={f * mapSize} y2={mapSize} stroke="rgba(255,0,102,0.04)" strokeWidth="0.5" />
            <line x1="0" y1={f * mapSize} x2={mapSize} y2={f * mapSize} stroke="rgba(255,0,102,0.04)" strokeWidth="0.5" />
          </g>
        ))}

        {levelPuzzles.map((p) => {
          const px = mapSize / 2 + p.position.x * mapScale;
          const pz = mapSize / 2 + p.position.z * mapScale;
          const solved = puzzlesSolved >= p.id;
          return (
            <g key={p.id}>
              <circle cx={px} cy={pz} r="4" fill={solved ? 'rgba(0,255,136,0.6)' : 'rgba(255,170,0,0.6)'} />
              {!solved && <circle cx={px} cy={pz} r="6" fill="none" stroke="rgba(255,170,0,0.3)" strokeWidth="0.5">
                <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
              </circle>}
            </g>
          );
        })}

        {levelTokens.map((t) => {
          const tx = mapSize / 2 + t.position.x * mapScale;
          const tz = mapSize / 2 + t.position.z * mapScale;
          const collected = collectedTokens.includes(t.id);
          const fill = collected ? 'rgba(0,255,136,0.7)' : 'rgba(255,187,51,0.7)';
          return (
            <g key={t.id}>
              <rect x={tx - 3} y={tz - 3} width="6" height="6" fill={fill} stroke={fill} strokeWidth="0.5" transform={`rotate(45 ${tx} ${tz})`} />
            </g>
          );
        })}

        <circle cx={mapSize / 2 + keyPos.x * mapScale} cy={mapSize / 2 + keyPos.z * mapScale} r="3" fill="rgba(255,187,51,0.4)" stroke="rgba(255,187,51,0.6)" strokeWidth="0.5" />

        <circle cx={cx} cy={cz} r="3.5" fill="#FF0066" style={{ filter: 'drop-shadow(0 0 3px #FF0066)' }}>
          <animate attributeName="r" values="3;4;3" dur="1.5s" repeatCount="indefinite" />
        </circle>
      </svg>
      <div className="absolute bottom-1 left-2 font-sharetm text-[7px] tracking-widest" style={{ color: 'rgba(255,0,102,0.5)' }}>MAPA</div>
    </div>
  );
}

function MusicToggle() {
  const [musicOn, setMusicOn] = useState(true);
  const toggle = () => { const enabled = audioManager.toggleMusic(); setMusicOn(enabled); };
  return (
    <div className="absolute bottom-4 right-4 pointer-events-auto">
      <button onClick={toggle} className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all hover:scale-105"
        style={{ background: 'rgba(255,245,240,0.85)', border: `1px solid ${musicOn ? 'rgba(0,240,255,0.3)' : 'rgba(255,0,102,0.2)'}` }}>
        <svg width="16" height="16" viewBox="0 0 16 16">
          {musicOn ? (<><rect x="2" y="4" width="3" height="8" rx="0.5" fill="#00f0ff" opacity="0.8" /><path d="M5,4 L12,1.5 V14.5 L5,12 Z" fill="#00f0ff" opacity="0.6" /></>)
            : (<><rect x="2" y="4" width="3" height="8" rx="0.5" fill="#FF0066" opacity="0.4" /><line x1="2" y1="2" x2="14" y2="14" stroke="#FF0066" strokeWidth="1.5" opacity="0.7" /></>)}
        </svg>
        <span className="font-sharetm text-[9px] tracking-widest" style={{ color: musicOn ? '#00f0ff' : 'rgba(255,0,102,0.5)' }}>
          {musicOn ? 'ON' : 'OFF'}
        </span>
      </button>
    </div>
  );
}

export default function SharedHudOverlay() {
  const lives = useGameStore((s) => s.lives);
  const coins = useGameStore((s) => s.coins);
  const puzzlesSolved = useGameStore((s) => s.puzzlesSolved);
  const totalPuzzles = useGameStore((s) => s.totalPuzzles);
  const memoriesFound = useGameStore((s) => s.memoriesFound);
  const totalMemories = useGameStore((s) => s.totalMemories);
  const memoryActive = useGameStore((s) => s.memoryActive);
  const memoryAvailable = useGameStore((s) => s.memoryAvailable);
  const memoryTimer = useGameStore((s) => s.memoryTimer);
  const interactionPrompt = useGameStore((s) => s.interactionPrompt);
  const systemLogs = useGameStore((s) => s.systemLogs);
  const playerX = useGameStore((s) => s.playerX);
  const playerZ = useGameStore((s) => s.playerZ);
  const collectedTokens = useGameStore((s) => s.collectedTokens);
  const levelTimeRemaining = useGameStore((s) => s.levelTimeRemaining);
  const currentLevel = useGameStore((s) => s.currentLevel);

  const ld = LEVEL_DATA[currentLevel] || LEVEL_DATA[1];
  const key = KEYS[currentLevel - 1];
  const levelName = LEVEL_NAMES[currentLevel] || 'NIVEL';
  const levelColor = key?.color || '#FF0066';

  const timerMin = Math.floor(levelTimeRemaining / 60);
  const timerSec = levelTimeRemaining % 60;
  const timerStr = `${String(timerMin).padStart(2, '0')}:${String(timerSec).padStart(2, '0')}`;
  const timerUrgent = levelTimeRemaining <= 60;
  const timerCritical = levelTimeRemaining <= 30;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <div className="absolute top-0 left-0 right-0 p-4 flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <svg width="32" height="32" viewBox="0 0 32 32">
              <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="rgba(255,0,102,0.08)" stroke="#FF0066" strokeWidth="0.8" opacity="0.6" />
              <text x="16" y="19" textAnchor="middle" fill="#FF0066" fontSize="10" fontFamily="Orbitron" fontWeight="600">E</text>
            </svg>
            <div>
              <div className="font-orbitron text-xs tracking-widest" style={{ color: 'var(--neon-magenta)', textShadow: '0 0 8px rgba(255,0,102,0.3)' }}>EVA_STRIDER_∞</div>
              <div className="mt-1">
                <div className="flex items-center gap-0.5">{[0,1,2,3,4].map((i) => <Heart key={i} active={i < lives} />)}</div>
                <div className="flex items-center gap-0.5 mt-0.5">{[5,6,7,8,9].map((i) => <Heart key={i} active={i < lives} />)}</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-11"><CoinIcon /><span className="font-orbitron text-sm font-bold" style={{ color: '#FFBB33' }}>{coins}</span></div>
          <div className="flex items-center gap-2 ml-11"><span className="text-sm">🔮</span><span className="font-sharetm text-[10px] tracking-widest" style={{ color: '#D861FF' }}>RECUERDOS: {memoriesFound}/{totalMemories}</span></div>
        </div>

        <div className="text-center">
          <div className="font-orbitron text-[10px] tracking-[0.4em] animate-flicker" style={{ color: 'var(--darker)' }}>NIVEL {currentLevel}</div>
          <div className="font-rajdhani text-sm tracking-widest font-bold" style={{ color: levelColor, textShadow: `0 0 8px ${levelColor}44` }}>{levelName}</div>
          <div className="mt-2 flex items-center justify-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14">
              <circle cx="7" cy="7" r="6" fill="none" stroke={timerCritical ? '#FF0044' : timerUrgent ? '#FFBB33' : '#00f0ff'} strokeWidth="1" opacity="0.6" />
              <line x1="7" y1="3" x2="7" y2="7" stroke={timerCritical ? '#FF0044' : timerUrgent ? '#FFBB33' : '#00f0ff'} strokeWidth="1" />
            </svg>
            <span className={`font-orbitron text-lg font-bold tracking-widest ${timerCritical ? 'animate-pulse' : ''}`}
              style={{ color: timerCritical ? '#FF0044' : timerUrgent ? '#FFBB33' : '#00f0ff' }}>{timerStr}</span>
          </div>
          {timerUrgent && <div className="font-sharetm text-[8px] tracking-widest animate-pulse" style={{ color: timerCritical ? '#FF0044' : '#FFBB33' }}>{timerCritical ? '⚠ TIEMPO CRÍTICO ⚠' : '⏰ TIEMPO BAJO'}</div>}
        </div>

        <div className="flex flex-col items-end gap-3">
          <Minimap playerX={playerX} playerZ={playerZ} puzzlesSolved={puzzlesSolved} collectedTokens={collectedTokens} levelPuzzles={ld.puzzles} levelTokens={ld.tokens} keyPos={ld.keyPos} />
          <div className="flex items-center gap-3">
            <span className="font-sharetm text-[9px] tracking-widest" style={{ color: levelColor, opacity: 0.6 }}>PUZZLES</span>
            <PuzzleTracker solved={puzzlesSolved} total={totalPuzzles} levelColor={levelColor} />
          </div>
        </div>
      </div>

      {memoryActive && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center">
          <div className="rounded-lg px-6 py-2" style={{ background: 'rgba(255,245,240,0.85)', border: '1px solid rgba(255,0,102,0.2)' }}>
            <span className="font-orbitron text-xs" style={{ color: 'var(--neon-magenta)' }}>MEMORIA ACTIVA — {memoryTimer}s</span>
          </div>
        </div>
      )}

      {!memoryActive && memoryAvailable && (
        <div className="absolute bottom-32 right-4 pointer-events-auto text-center">
          <div className="font-sharetm text-[10px] mb-1 tracking-widest" style={{ color: 'var(--darker)' }}>[Q]</div>
          <div className="rounded px-3 py-1 font-sharetm text-[10px]" style={{ background: 'rgba(255,0,102,0.04)', border: '1px solid rgba(255,0,102,0.15)', color: 'var(--neon-magenta)', opacity: 0.6 }}>MEMORIA</div>
        </div>
      )}

      <MusicToggle />

      {interactionPrompt && (
        <div className="absolute bottom-44 left-1/2 -translate-x-1/2">
          <div className="rounded-lg px-6 py-2 animate-pulse" style={{ background: 'rgba(255,245,240,0.85)', border: '1px solid rgba(255,187,51,0.25)' }}>
            <span className="font-sharetm text-xs" style={{ color: 'var(--neon-amber)' }}>{interactionPrompt}</span>
          </div>
        </div>
      )}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <svg width="28" height="28" viewBox="0 0 28 28">
          <line x1="14" y1="2" x2="14" y2="8" stroke="#FF0066" strokeWidth="1" opacity="0.5" />
          <line x1="14" y1="20" x2="14" y2="26" stroke="#FF0066" strokeWidth="1" opacity="0.5" />
          <line x1="2" y1="14" x2="8" y2="14" stroke="#FF0066" strokeWidth="1" opacity="0.5" />
          <line x1="20" y1="14" x2="26" y2="14" stroke="#FF0066" strokeWidth="1" opacity="0.5" />
          <circle cx="14" cy="14" r="2" fill="#FF0066" opacity="0.6"><animate attributeName="r" values="1.5;2.5;1.5" dur="2s" repeatCount="indefinite" /></circle>
        </svg>
      </div>

      <div className="absolute bottom-20 left-4 max-w-sm">
        {systemLogs.slice(-4).map((log, i) => (
          <div key={i} className="font-sharetm text-[9px] py-0.5" style={{
            color: log.includes('LLAVE') ? 'var(--neon-amber)' : log.includes('PUZZLE') || log.includes('RECUERDO') ? 'var(--neon-green)' : log.includes('TRAMPA') ? 'var(--neon-magenta)' : 'var(--taupe)',
            opacity: 0.3 + (i / 6),
          }}>
            <span style={{ color: 'var(--bronze)', opacity: 0.3, marginRight: 4 }}>▸</span>{log}
          </div>
        ))}
      </div>
    </div>
  );
}
