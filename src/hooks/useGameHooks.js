// ══════════════════════════════════════════════════════
//  CUSTOM HOOKS
//  Hooks reutilizables para el juego OASIS
// ══════════════════════════════════════════════════════

import { useEffect, useRef, useState, useCallback } from 'react';
import useGameStore from '../lib/gameStore';
import { GameStates, StateTransitions } from '../constants/gameConstants';

/**
 * Hook para transiciones de estado validadas
 */
export function useGameTransition() {
  const gameState = useGameStore((s) => s.gameState);
  const setGameState = useGameStore((s) => s.setGameState);

  const transition = useCallback((newState) => {
    const allowed = StateTransitions[gameState] || [];
    if (allowed.includes(newState)) {
      setGameState(newState);
      return true;
    }
    console.warn(
      `[GameTransition] Invalid: ${gameState} → ${newState}. Allowed: ${allowed.join(', ')}`
    );
    return false;
  }, [gameState, setGameState]);

  return { gameState, transition };
}

/**
 * Hook para animación de entrada con delay
 */
export function useAnimateIn(delay = 0) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return visible;
}

/**
 * Hook para intervalo con cleanup
 */
export function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

/**
 * Hook para detección de tecla
 */
export function useKeyPress(targetKey) {
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const down = (e) => { if (e.key === targetKey) setPressed(true); };
    const up = (e) => { if (e.key === targetKey) setPressed(false); };

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);

    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [targetKey]);

  return pressed;
}

/**
 * Hook para typewriter effect
 */
export function useTypewriter(text, speed = 40) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let idx = 0;

    const interval = setInterval(() => {
      if (idx < text.length) {
        setDisplayed(text.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, done };
}
