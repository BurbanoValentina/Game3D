// ══════════════════════════════════════════════════════
//  SHARED HUD OVERLAY — Level-aware minimap and UI
//  Works for all levels 1–5
// ══════════════════════════════════════════════════════

'use client';
import { useState, useMemo } from 'react';
import { LEVEL1_PUZZLES, LEVEL1_TOKENS, LEVEL_NAMES } from '../../constants/gameConstants';
import { LEVEL2_PUZZLES, LEVEL2_TOKENS } from '../../constants/level2Constants';
import { LEVEL3_PUZZLES, LEVEL3_TOKENS } from '../../constants/level3Constants';
import { LEVEL4_PUZZLES, LEVEL4_TOKENS } from '../../constants/level4Constants';
import { LEVEL5_PUZZLES, LEVEL5_TOKENS } from '../../constants/level5Constants';
import useGameStore from '../../lib/gameStore';
import audioManager from '../../lib/audioManager';

const PUZZLE_MAP = { 1: LEVEL1_PUZZLES, 2: LEVEL2_PUZZLES, 3: LEVEL3_PUZZLES, 4: LEVEL4_PUZZLES, 5: LEVEL5_PUZZLES };
const TOKEN_MAP = { 1: LEVEL1_TOKENS, 2: LEVEL2_TOKENS, 3: LEVEL3_TOKENS, 4: LEVEL4_TOKENS, 5: LEVEL5_TOKENS };
const KEY_Z = { 1: -95, 2: -80, 3: -80, 4: -80, 5: -80 };

function Heart({ active }) {
  return (<svg width="18" height="16" viewBox="0 0 18 16">
    <path d="M9 14s-7-4.35-7-8.5C2 3.01 3.79 1.5 6 1.5c1.54 0 2.81.99 3 2.36C9.19 2.49 10.46 1.5 12 1.5c2.21 0 4 1.51 4 3.5C16 9.65 9 14 9 14z"
      fill={active?'#FF4466':'rgba(255,68,102,0.12)'} stroke={active?'#FF4466':'rgba(255,68,102,0.2)'} strokeWidth="0.8"
      style={{filter:active?'drop-shadow(0 0 4px #FF4466)':'none'}} />
  </svg>);
}

function Minimap({ playerX, playerZ, puzzlesSolved, collectedTokens, puzzles, tokens, keyZ }) {
  const ms = 160, sc = ms / 250;
  const cx = ms/2 + playerX*sc, cz = ms/2 + playerZ*sc;
  return (
    <div className="relative" style={{ width:ms, height:ms, background:'rgba(255,240,235,0.9)', border:'1px solid rgba(255,0,102,0.2)', borderRadius:8, overflow:'hidden', boxShadow:'0 0 20px rgba(255,0,102,0.04)' }}>
      <svg width={ms} height={ms} viewBox={`0 0 ${ms} ${ms}`}>
        {[0.25,0.5,0.75].map(f=>(<g key={f}><line x1={f*ms} y1="0" x2={f*ms} y2={ms} stroke="rgba(255,0,102,0.04)" strokeWidth="0.5"/><line x1="0" y1={f*ms} x2={ms} y2={f*ms} stroke="rgba(255,0,102,0.04)" strokeWidth="0.5"/></g>))}
        {puzzles.map(p=>{const px=ms/2+p.position.x*sc,pz=ms/2+p.position.z*sc,sv=puzzlesSolved>=p.id;return(<g key={p.id}><circle cx={px} cy={pz} r="4" fill={sv?'rgba(0,255,136,0.6)':'rgba(255,170,0,0.6)'}/>{!sv&&<circle cx={px} cy={pz} r="6" fill="none" stroke="rgba(255,170,0,0.3)" strokeWidth="0.5"><animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite"/></circle>}</g>);})}
        {tokens.map(t=>{const tx=ms/2+t.position.x*sc,tz=ms/2+t.position.z*sc,co=collectedTokens.includes(t.id);return(<g key={t.id}><rect x={tx-3} y={tz-3} width="6" height="6" fill={co?'rgba(0,255,136,0.7)':'rgba(255,187,51,0.7)'} stroke={co?'rgba(0,255,136,0.9)':'rgba(255,187,51,0.9)'} strokeWidth="0.5" transform={`rotate(45 ${tx} ${tz})`}/></g>);})}
        <circle cx={ms/2} cy={ms/2+keyZ*sc} r="3" fill="rgba(255,187,51,0.4)" stroke="rgba(255,187,51,0.6)" strokeWidth="0.5"/>
        <circle cx={cx} cy={cz} r="3.5" fill="#FF0066" style={{filter:'drop-shadow(0 0 3px #FF0066)'}}><animate attributeName="r" values="3;4;3" dur="1.5s" repeatCount="indefinite"/></circle>
      </svg>
      <div className="absolute bottom-1 left-2 font-sharetm text-[7px] tracking-widest" style={{color:'rgba(255,0,102,0.5)'}}>MAPA</div>
    </div>
  );
}

function MusicToggle() {
  const [musicOn, setMusicOn] = useState(true);
  const toggle = () => setMusicOn(audioManager.toggleMusic());
  return (
    <div className="absolute bottom-4 right-4 pointer-events-auto">
      <button onClick={toggle} className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all hover:scale-105"
        style={{ background:'rgba(255,245,240,0.85)', border:`1px solid ${musicOn?'rgba(0,240,255,0.3)':'rgba(255,0,102,0.2)'}` }}>
        <svg width="16" height="16" viewBox="0 0 16 16">{musicOn?(<><rect x="2" y="4" width="3" height="8" rx="0.5" fill="#00f0ff" opacity="0.8"/><path d="M5,4 L12,1.5 V14.5 L5,12 Z" fill="#00f0ff" opacity="0.6"/></>):(<><rect x="2" y="4" width="3" height="8" rx="0.5" fill="#FF0066" opacity="0.4"/><line x1="2" y1="2" x2="14" y2="14" stroke="#FF0066" strokeWidth="1.5" opacity="0.7"/></>)}</svg>
        <span className="font-sharetm text-[9px] tracking-widest" style={{color:musicOn?'#00f0ff':'rgba(255,0,102,0.5)'}}>{musicOn?'ON':'OFF'}</span>
      </button>
    </div>
  );
}

export default function LevelHudOverlay() {
  const lives = useGameStore(s => s.lives);
  const coins = useGameStore(s => s.coins);
  const puzzlesSolved = useGameStore(s => s.puzzlesSolved);
  const totalPuzzles = useGameStore(s => s.totalPuzzles);
  const memoriesFound = useGameStore(s => s.memoriesFound);
  const totalMemories = useGameStore(s => s.totalMemories);
  const memoryActive = useGameStore(s => s.memoryActive);
  const memoryAvailable = useGameStore(s => s.memoryAvailable);
  const memoryTimer = useGameStore(s => s.memoryTimer);
  const interactionPrompt = useGameStore(s => s.interactionPrompt);
  const systemLogs = useGameStore(s => s.systemLogs);
  const playerX = useGameStore(s => s.playerX);
  const playerZ = useGameStore(s => s.playerZ);
  const collectedTokens = useGameStore(s => s.collectedTokens);
  const levelTimeRemaining = useGameStore(s => s.levelTimeRemaining);
  const currentLevel = useGameStore(s => s.currentLevel);

  const puzzles = PUZZLE_MAP[currentLevel] || LEVEL1_PUZZLES;
  const tokens = TOKEN_MAP[currentLevel] || LEVEL1_TOKENS;
  const keyZ = KEY_Z[currentLevel] || -80;
  const levelName = LEVEL_NAMES[currentLevel] || 'NIVEL ?';

  const timerMin = Math.floor(levelTimeRemaining / 60);
  const timerSec = levelTimeRemaining % 60;
  const timerStr = `${String(timerMin).padStart(2,'0')}:${String(timerSec).padStart(2,'0')}`;
  const timerUrgent = levelTimeRemaining <= 60;
  const timerCritical = levelTimeRemaining <= 30;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <div className="absolute top-0 left-0 right-0 p-4 flex items-start justify-between">
        {/* Left: Player info */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <svg width="32" height="32" viewBox="0 0 32 32"><polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="rgba(255,0,102,0.08)" stroke="#FF0066" strokeWidth="0.8" opacity="0.6"/><text x="16" y="19" textAnchor="middle" fill="#FF0066" fontSize="10" fontFamily="Orbitron" fontWeight="600">E</text></svg>
            <div>
              <div className="font-orbitron text-xs tracking-widest" style={{color:'var(--neon-magenta)',textShadow:'0 0 8px rgba(255,0,102,0.3)'}}>EVA_STRIDER_∞</div>
              <div className="mt-1"><div className="flex items-center gap-0.5">{[0,1,2,3,4].map(i=><Heart key={i} active={i<lives}/>)}</div><div className="flex items-center gap-0.5 mt-0.5">{[5,6,7,8,9].map(i=><Heart key={i} active={i<lives}/>)}</div></div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-11">
            <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="#FFBB33" opacity="0.9" stroke="#FF8800" strokeWidth="0.5"/><text x="8" y="11" textAnchor="middle" fill="#AA6600" fontSize="8" fontWeight="bold" fontFamily="monospace">$</text></svg>
            <span className="font-orbitron text-sm font-bold" style={{color:'#FFBB33',textShadow:'0 0 8px rgba(255,187,51,0.3)'}}>{coins}</span>
          </div>
          <div className="flex items-center gap-2 ml-11">
            <span className="text-sm">🔮</span>
            <span className="font-sharetm text-[10px] tracking-widest" style={{color:'#D861FF'}}>RECUERDOS: {memoriesFound}/{totalMemories}</span>
          </div>
        </div>

        {/* Center: Level name + Timer */}
        <div className="text-center">
          <div className="font-orbitron text-[10px] tracking-[0.4em] animate-flicker" style={{color:'var(--darker)'}}>NIVEL {currentLevel}</div>
          <div className="font-rajdhani text-sm tracking-widest font-bold" style={{color:'var(--neon-amber)',textShadow:'0 0 8px rgba(255,187,51,0.2)'}}>{levelName}</div>
          <div className="mt-2 flex items-center justify-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="6" fill="none" stroke={timerCritical?'#FF0044':timerUrgent?'#FFBB33':'#00f0ff'} strokeWidth="1" opacity="0.6"/><line x1="7" y1="3" x2="7" y2="7" stroke={timerCritical?'#FF0044':timerUrgent?'#FFBB33':'#00f0ff'} strokeWidth="1"/></svg>
            <span className={`font-orbitron text-lg font-bold tracking-widest ${timerCritical?'animate-pulse':''}`}
              style={{color:timerCritical?'#FF0044':timerUrgent?'#FFBB33':'#00f0ff',textShadow:`0 0 12px ${timerCritical?'rgba(255,0,68,0.6)':timerUrgent?'rgba(255,187,51,0.4)':'rgba(0,240,255,0.3)'}`}}>{timerStr}</span>
          </div>
          {timerUrgent && <div className="font-sharetm text-[8px] tracking-widest animate-pulse" style={{color:timerCritical?'#FF0044':'#FFBB33'}}>{timerCritical?'⚠ TIEMPO CRÍTICO ⚠':'⏰ TIEMPO BAJO'}</div>}
        </div>

        {/* Right: Minimap + Puzzles */}
        <div className="flex flex-col items-end gap-3">
          <Minimap playerX={playerX} playerZ={playerZ} puzzlesSolved={puzzlesSolved} collectedTokens={collectedTokens} puzzles={puzzles} tokens={tokens} keyZ={keyZ}/>
          <div className="flex items-center gap-3">
            <span className="font-sharetm text-[9px] tracking-widest" style={{color:'var(--neon-violet)',opacity:0.6}}>PUZZLES</span>
            <svg width="44" height="44" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="none" stroke="rgba(157,0,255,0.1)" strokeWidth="2"/><circle cx="25" cy="25" r="20" fill="none" stroke="#9D00FF" strokeWidth="2" strokeLinecap="round" strokeDasharray={`${(puzzlesSolved/totalPuzzles)*126} 126`} transform="rotate(-90 25 25)"/><text x="25" y="23" textAnchor="middle" fill="#9D00FF" fontSize="12" fontFamily="Orbitron" fontWeight="700">{puzzlesSolved}</text><text x="25" y="33" textAnchor="middle" fill="#A89880" fontSize="6" fontFamily="Share Tech Mono">/ {totalPuzzles}</text></svg>
          </div>
        </div>
      </div>

      {memoryActive && (<div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center"><div className="rounded-lg px-6 py-2" style={{background:'rgba(255,245,240,0.85)',border:'1px solid rgba(255,0,102,0.2)'}}><span className="font-orbitron text-xs" style={{color:'var(--neon-magenta)'}}>MEMORIA ACTIVA — {memoryTimer}s</span></div></div>)}
      {!memoryActive && memoryAvailable && (<div className="absolute bottom-32 right-4 pointer-events-auto text-center"><div className="font-sharetm text-[10px] mb-1 tracking-widest" style={{color:'var(--darker)'}}>[Q]</div><div className="rounded px-3 py-1 font-sharetm text-[10px]" style={{background:'rgba(255,0,102,0.04)',border:'1px solid rgba(255,0,102,0.15)',color:'var(--neon-magenta)',opacity:0.6}}>MEMORIA</div></div>)}
      <MusicToggle />
      {interactionPrompt && (<div className="absolute bottom-44 left-1/2 -translate-x-1/2"><div className="rounded-lg px-6 py-2 animate-pulse" style={{background:'rgba(255,245,240,0.85)',border:'1px solid rgba(255,187,51,0.25)'}}><span className="font-sharetm text-xs" style={{color:'var(--neon-amber)'}}>{interactionPrompt}</span></div></div>)}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><svg width="28" height="28" viewBox="0 0 28 28"><line x1="14" y1="2" x2="14" y2="8" stroke="#FF0066" strokeWidth="1" opacity="0.5"/><line x1="14" y1="20" x2="14" y2="26" stroke="#FF0066" strokeWidth="1" opacity="0.5"/><line x1="2" y1="14" x2="8" y2="14" stroke="#FF0066" strokeWidth="1" opacity="0.5"/><line x1="20" y1="14" x2="26" y2="14" stroke="#FF0066" strokeWidth="1" opacity="0.5"/><circle cx="14" cy="14" r="2" fill="#FF0066" opacity="0.6"><animate attributeName="r" values="1.5;2.5;1.5" dur="2s" repeatCount="indefinite"/></circle></svg></div>
      <div className="absolute bottom-20 left-4 max-w-sm">{systemLogs.slice(-4).map((log,i)=>(<div key={i} className="font-sharetm text-[9px] py-0.5" style={{color:log.includes('LLAVE')?'var(--neon-amber)':log.includes('PUZZLE')||log.includes('RECUERDO')?'var(--neon-green)':log.includes('TRAMPA')?'var(--neon-magenta)':'var(--taupe)',opacity:0.3+(i/6)}}><span style={{color:'var(--bronze)',opacity:0.3,marginRight:4}}>▸</span>{log}</div>))}</div>
    </div>
  );
}
