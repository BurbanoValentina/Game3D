'use client';

// ══════════════════════════════════════════════════════
//  CHARACTERS SCREEN — Selección de personajes
//  Eva (activa), Suyin y Zuri (eliminadas)
// ══════════════════════════════════════════════════════

import { useState } from 'react';
import { GameStates, CHARACTERS } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';

function CharacterCard({ charKey, data, selected, onSelect }) {
  const isEliminated = data.status === 'ELIMINADA';

  return (
    <div
      onClick={() => !isEliminated && onSelect(charKey)}
      className={`relative glass rounded-xl p-6 transition-all duration-300 cursor-pointer ${
        selected ? 'ring-2 scale-[1.02]' : 'hover:scale-[1.01]'
      } ${isEliminated ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
      style={{
        ringColor: selected ? data.color : 'transparent',
        boxShadow: selected ? `0 0 30px ${data.color}22` : 'none',
      }}
    >
      {/* Status badge */}
      {isEliminated && (
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[8px] font-orbitron tracking-widest"
          style={{ background: 'rgba(255,0,102,0.1)', color: '#ff0066', border: '1px solid rgba(255,0,102,0.2)' }}>
          ELIMINADA
        </div>
      )}

      {/* Avatar placeholder */}
      <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${data.color}15, ${data.color}30)`,
          border: `2px solid ${data.color}44`,
          boxShadow: `0 0 20px ${data.color}15`,
        }}>
        <span className="font-orbitron text-xl font-bold" style={{ color: data.color }}>
          {data.name[0]}
        </span>
      </div>

      {/* Name & Role */}
      <div className="text-center mb-4">
        <h3 className="font-orbitron text-lg tracking-widest text-oasis-dark">{data.name}</h3>
        <p className="font-rajdhani text-sm text-oasis-taupe">{data.role}</p>
      </div>

      {/* Skills */}
      <div className="space-y-1.5">
        {data.skills.map((skill, i) => (
          <div key={i} className="flex items-center gap-2 px-2 py-1 rounded"
            style={{ background: `${data.color}08` }}>
            <span className="text-xs">{skill.icon}</span>
            <span className="font-sharetm text-[10px] tracking-wide text-oasis-bronze">
              {skill.name}
            </span>
          </div>
        ))}
      </div>

      {/* Select button */}
      {!isEliminated && (
        <button
          className="w-full mt-4 py-2 rounded font-orbitron text-[10px] tracking-widest transition-all"
          style={{
            background: selected ? `${data.color}15` : 'transparent',
            border: `1px solid ${data.color}33`,
            color: selected ? data.color : 'var(--taupe)',
          }}
        >
          {selected ? '✓ SELECCIONADA' : 'SELECCIONAR'}
        </button>
      )}
    </div>
  );
}

export default function CharactersScreen() {
  const setGameState = useGameStore((s) => s.setGameState);
  const selectedCharacter = useGameStore((s) => s.selectedCharacter);
  const setSelectedCharacter = useGameStore((s) => s.setSelectedCharacter);

  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center pt-16 pb-8 px-6 overflow-y-auto">
      <h2 className="font-orbitron text-2xl tracking-[0.3em] text-oasis-dark mb-1">
        Personajes
      </h2>
      <p className="font-sharetm text-[10px] tracking-widest text-oasis-taupe mb-8">
        SELECCIONA TU OPERARIA — OASIS SQUAD ALPHA
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {Object.entries(CHARACTERS).map(([key, data]) => (
          <CharacterCard
            key={key}
            charKey={key}
            data={data}
            selected={selectedCharacter === key}
            onSelect={setSelectedCharacter}
          />
        ))}
      </div>

      {/* Lore text */}
      <div className="mt-8 max-w-lg text-center">
        <p className="font-rajdhani text-xs text-oasis-warm italic leading-relaxed">
          Suyin y Zuri fueron eliminadas por el Protocolo Veneno_Zagar.
          Sus avatares no pueden regenerarse. Solo Eva continúa.
        </p>
      </div>

      <button
        onClick={() => setGameState(GameStates.MAIN_MENU)}
        className="oasis-btn mt-8"
      >
        ← VOLVER AL MENÚ
      </button>
    </div>
  );
}
