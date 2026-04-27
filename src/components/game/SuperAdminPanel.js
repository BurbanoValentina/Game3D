'use client';

import { useState } from 'react';
import useGameStore from '../../lib/gameStore';
import { GameStates, LEVEL_NAMES, LEVEL_WORLDS } from '../../constants/gameConstants';

const STATES_MENU = [
  GameStates.MAIN_MENU,
  GameStates.TRAINING_ROOM,
  GameStates.TUTORIAL,
  GameStates.CREDITS,
];

export default function SuperAdminPanel() {
  const [collapsed, setCollapsed] = useState(false);

  const currentLevel    = useGameStore((s) => s.currentLevel);
  const gameState       = useGameStore((s) => s.gameState);
  const jumpToLevel      = useGameStore((s) => s.jumpToLevel);
  const setGameState     = useGameStore((s) => s.setGameState);
  const setSuperadminMode = useGameStore((s) => s.setSuperadminMode);
  const completions = useGameStore((s) => ({
    1: s.level1Completed,
    2: s.level2Completed,
    3: s.level3Completed,
    4: s.level4Completed,
    5: s.level5Completed,
  }));

  const panelStyle = {
    position: 'fixed',
    bottom: 16,
    right: 16,
    zIndex: 99999,
    background: 'rgba(4, 10, 6, 0.96)',
    border: '1px solid #00ff88',
    borderRadius: 6,
    fontFamily: "'Courier New', monospace",
    color: '#00ff88',
    minWidth: collapsed ? 'auto' : 260,
    boxShadow: '0 0 20px rgba(0,255,136,0.25)',
    userSelect: 'none',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '7px 10px',
    borderBottom: collapsed ? 'none' : '1px solid #003322',
    cursor: 'pointer',
    gap: 8,
  };

  const btnBase = {
    fontFamily: 'inherit',
    fontSize: 10,
    letterSpacing: 1,
    cursor: 'pointer',
    border: '1px solid',
    borderRadius: 3,
    padding: '4px 8px',
    transition: 'all 0.15s',
  };

  if (collapsed) {
    return (
      <div style={panelStyle}>
        <div style={headerStyle} onClick={() => setCollapsed(false)}>
          <span style={{ fontSize: 10, letterSpacing: 2, color: '#ff6600' }}>⚡ SA</span>
        </div>
      </div>
    );
  }

  return (
    <div style={panelStyle}>
      {/* Header */}
      <div style={headerStyle} onClick={() => setCollapsed(true)}>
        <span style={{ fontSize: 10, letterSpacing: 2, color: '#ff6600' }}>⚡ SUPERADMIN DEV PANEL</span>
        <span style={{ fontSize: 10, color: '#555' }}>▼</span>
      </div>

      <div style={{ padding: '10px 12px' }}>
        {/* Current status */}
        <div style={{ marginBottom: 10, fontSize: 10, lineHeight: 1.6 }}>
          <span style={{ color: '#555' }}>ESTADO: </span>
          <span style={{ color: '#fff' }}>{gameState}</span>
          <br />
          <span style={{ color: '#555' }}>NIVEL:  </span>
          <span style={{ color: '#fff' }}>{currentLevel} — {LEVEL_NAMES[currentLevel]}</span>
        </div>

        {/* Level jump buttons */}
        <div style={{ fontSize: 9, color: '#555', letterSpacing: 2, marginBottom: 6 }}>SALTAR A NIVEL ─────────</div>
        {[1, 2, 3, 4, 5].map((lvl) => (
          <div key={lvl} style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
            <button
              onClick={() => jumpToLevel(lvl, false)}
              style={{
                ...btnBase,
                flex: 1,
                textAlign: 'left',
                background: currentLevel === lvl ? 'rgba(0,255,136,0.08)' : 'transparent',
                borderColor: currentLevel === lvl ? '#00ff88' : '#1a3326',
                color: currentLevel === lvl ? '#00ff88' : '#5a9a78',
              }}
              title={LEVEL_WORLDS[lvl]}
            >
              {completions[lvl] ? '✓' : '○'} NVL {lvl} — {LEVEL_NAMES[lvl].slice(0, 16)}…
            </button>
            <button
              onClick={() => jumpToLevel(lvl, true)}
              style={{
                ...btnBase,
                background: 'transparent',
                borderColor: '#1a2a1f',
                color: '#3a6a50',
                padding: '4px 7px',
              }}
              title="Saltar directo a PLAYING (sin intro)"
            >
              ▶
            </button>
          </div>
        ))}

        {/* Quick state navigation */}
        <div style={{ fontSize: 9, color: '#555', letterSpacing: 2, margin: '10px 0 6px' }}>NAVEGAR A ───────────────</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {STATES_MENU.map((state) => (
            <button
              key={state}
              onClick={() => setGameState(state)}
              style={{
                ...btnBase,
                background: gameState === state ? 'rgba(0,255,136,0.08)' : 'transparent',
                borderColor: '#1a3326',
                color: '#5a9a78',
                fontSize: 9,
              }}
            >
              {state.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Close panel */}
        <button
          onClick={() => setSuperadminMode(false)}
          style={{
            ...btnBase,
            width: '100%',
            marginTop: 10,
            background: 'rgba(80,0,0,0.4)',
            borderColor: '#ff3300',
            color: '#ff5533',
            textAlign: 'center',
            fontSize: 9,
            letterSpacing: 2,
          }}
        >
          CERRAR SESIÓN ADMIN
        </button>
      </div>
    </div>
  );
}
