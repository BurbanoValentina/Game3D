'use client';

import { useCallback } from 'react';
import { GameStates } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';
import EventBus from '../../patterns/EventBus';
import audioManager from '../../lib/audioManager';

export default function PuzzleModal() {
  const setGameState = useGameStore((s) => s.setGameState);
  const currentPuzzle = useGameStore((s) => s.currentPuzzle);
  const puzzleInput = useGameStore((s) => s.puzzleInput);
  const showHint = useGameStore((s) => s.showHint);
  const setPuzzleInput = useGameStore((s) => s.setPuzzleInput);
  const setShowHint = useGameStore((s) => s.setShowHint);
  const setCurrentPuzzle = useGameStore((s) => s.setCurrentPuzzle);
  const lives = useGameStore((s) => s.lives);

  const submitPuzzle = useCallback(() => {
    if (!currentPuzzle) return;
    if (puzzleInput.toLowerCase().trim() === currentPuzzle.answer.toLowerCase()) {
      // Correct!
      EventBus.emit('puzzleSolved', currentPuzzle.id);
      audioManager.playPuzzleSolve();
      setCurrentPuzzle(null); setPuzzleInput(''); setShowHint(false);
      setGameState(GameStates.PLAYING);
    } else {
      // Wrong! Lose 1 life
      EventBus.emit('puzzleFailed');
      setPuzzleInput('');
      // Check if game over
      if (lives <= 1) {
        setCurrentPuzzle(null); setPuzzleInput(''); setShowHint(false);
      }
    }
  }, [currentPuzzle, puzzleInput, lives, setGameState, setCurrentPuzzle, setPuzzleInput, setShowHint]);

  const handleCancel = () => {
    setCurrentPuzzle(null); setPuzzleInput(''); setShowHint(false);
    setGameState(GameStates.PLAYING);
  };

  if (!currentPuzzle) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center" style={{ background: 'rgba(255,240,235,0.9)', backdropFilter: 'blur(12px)' }}>
      <div className="w-full max-w-lg mx-4 rounded-lg p-8 relative" style={{
        background: 'rgba(255,235,225,0.95)', border: '1px solid rgba(255,0,102,0.15)',
        boxShadow: '0 0 60px rgba(255,0,102,0.03), inset 0 1px 0 rgba(255,0,102,0.04)',
      }}>
        {/* Terminal header */}
        <div className="flex items-center gap-2 mb-1 pb-3" style={{ borderBottom: '1px solid rgba(255,0,102,0.04)' }}>
          <div className="w-2 h-2 rounded-full" style={{ background: 'var(--neon-amber)', boxShadow: '0 0 6px var(--neon-amber)' }}>
            <div className="w-full h-full rounded-full animate-ping" style={{ background: 'var(--neon-amber)', opacity: 0.3 }} />
          </div>
          <span className="font-orbitron text-xs tracking-widest" style={{ color: 'var(--neon-amber)', textShadow: '0 0 8px rgba(255,187,51,0.3)' }}>
            TERMINAL #{currentPuzzle.id}
          </span>
          {currentPuzzle.title && (
            <span className="font-sharetm text-[9px] tracking-widest ml-auto" style={{ color: 'var(--bronze)' }}>
              {currentPuzzle.title}
            </span>
          )}
        </div>

        {/* Warning */}
        <div className="flex items-center gap-2 my-3 px-3 py-1.5 rounded" style={{ background: 'rgba(255,68,102,0.05)', border: '1px solid rgba(255,68,102,0.15)' }}>
          <span className="text-sm">❤️</span>
          <span className="font-sharetm text-[10px]" style={{ color: '#FF4466' }}>
            ¡Cuidado! Respuesta incorrecta = perder 1 vida
          </span>
        </div>

        {/* Puzzle ID */}
        <div className="flex items-center gap-2 my-4">
          <svg width="20" height="20" viewBox="0 0 20 20">
            <rect x="2" y="2" width="16" height="16" rx="2" fill="none" stroke="rgba(255,187,51,0.3)" strokeWidth="1" />
            <text x="10" y="13" textAnchor="middle" fill="#FFBB33" fontSize="8" fontFamily="Orbitron">{currentPuzzle.id}</text>
          </svg>
          <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(90deg, rgba(255,187,51,0.2), transparent)' }} />
        </div>

        {/* Question */}
        <div className="pl-4 mb-6 relative" style={{ borderLeft: '2px solid rgba(255,0,102,0.2)' }}>
          <div className="absolute left-[-5px] top-2 w-2 h-2 rounded-full" style={{ background: 'var(--neon-cyan)', boxShadow: '0 0 6px var(--neon-cyan)' }} />
          <p className="font-rajdhani text-base leading-relaxed" style={{ color: 'var(--dark)' }}>
            {currentPuzzle.question}
          </p>
        </div>

        {/* Hint */}
        {showHint && (
          <div className="mb-4 px-3 py-2 rounded" style={{ background: 'rgba(157,0,255,0.05)', border: '1px solid rgba(157,0,255,0.15)' }}>
            <div className="flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill="none" stroke="#9D00FF" strokeWidth="0.8" /><text x="6" y="8.5" textAnchor="middle" fill="#9D00FF" fontSize="7" fontFamily="Share Tech Mono">?</text></svg>
              <span className="font-sharetm text-xs" style={{ color: 'var(--neon-violet)', opacity: 0.7 }}>{currentPuzzle.hint}</span>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex gap-3 mb-4">
          <input type="text" value={puzzleInput} onChange={(e) => setPuzzleInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitPuzzle()} placeholder="Ingresa tu respuesta..."
            className="futuristic-input flex-1" autoFocus />
          <button onClick={submitPuzzle} className="px-6 py-3 rounded font-orbitron text-xs tracking-widest transition-all hover:shadow-lg cursor-pointer"
            style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.3)', color: 'var(--neon-green)', clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}>
            ENVIAR
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <button onClick={() => setShowHint(true)} className="font-sharetm text-xs hover:underline cursor-pointer" style={{ color: 'var(--neon-violet)', opacity: showHint ? 0 : 0.5 }}>
            {showHint ? '' : '¿Necesitas una pista?'}
          </button>
          <button onClick={handleCancel} className="font-sharetm text-xs hover:underline flex items-center gap-1 cursor-pointer" style={{ color: 'var(--neon-magenta)', opacity: 0.5 }}>
            <svg width="8" height="8" viewBox="0 0 8 8"><line x1="1" y1="1" x2="7" y2="7" stroke="currentColor" strokeWidth="1" /><line x1="7" y1="1" x2="1" y2="7" stroke="currentColor" strokeWidth="1" /></svg>
            CANCELAR [ESC]
          </button>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t border-l" style={{ borderColor: 'rgba(255,0,102,0.2)' }} />
        <div className="absolute top-2 right-2 w-4 h-4 border-t border-r" style={{ borderColor: 'rgba(255,0,102,0.2)' }} />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l" style={{ borderColor: 'rgba(255,0,102,0.2)' }} />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r" style={{ borderColor: 'rgba(255,0,102,0.2)' }} />
      </div>
    </div>
  );
}
