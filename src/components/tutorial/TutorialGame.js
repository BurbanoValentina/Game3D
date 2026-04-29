'use client';

// ══════════════════════════════════════════════════════
//  TUTORIAL GAME 3D — Rose/Cream Training Room
//  Light environment with neon accents
// ══════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameStates } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';
import { TUTORIAL_STEPS } from './tutorialSteps';
import TutorialNotification from './ui/TutorialNotification';
import SuccessFlash from './ui/SuccessFlash';
import Crosshair from './ui/Crosshair';
import { initTutorialTrainingRoom } from './three/initTutorialTrainingRoom';

// ═══════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════
export default function TutorialGame() {
  const setGameState = useGameStore((s) => s.setGameState);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pointerLocked, setPointerLocked] = useState(false);

  const mountRef = useRef(null);
  const gameRef = useRef(null);
  const stepRef = useRef(0);
  const progressRef = useRef(0);
  const keysUsed = useRef(new Set());
  const jumpCount = useRef(0);
  const mouseAccum = useRef(0);
  const sprintStart = useRef(null);
  const sprintDone = useRef(false);
  const keysDown = useRef({});
  const advancingRef = useRef(false);

  const step = TUTORIAL_STEPS[currentStep];
  const totalSteps = TUTORIAL_STEPS.length;

  useEffect(() => { stepRef.current = currentStep; }, [currentStep]);
  useEffect(() => { progressRef.current = progress; }, [progress]);

  const advanceStep = useCallback(() => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      advancingRef.current = false;
      setCurrentStep((s) => {
        const next = s + 1;
        if (next < TUTORIAL_STEPS.length) {
          setProgress(0); progressRef.current = 0; keysUsed.current = new Set();
          jumpCount.current = 0; mouseAccum.current = 0; sprintStart.current = null; sprintDone.current = false;
        }
        return Math.min(next, TUTORIAL_STEPS.length - 1);
      });
    }, 900);
  }, []);

  const handleSkip = useCallback(async () => {
    if (document.pointerLockElement) document.exitPointerLock();
    setGameState(GameStates.TRAINING_ROOM);
  }, [setGameState]);

  const handleFinish = useCallback(async () => {
    if (document.pointerLockElement) document.exitPointerLock();
    setGameState(GameStates.TRAINING_ROOM);
  }, [setGameState]);

  // ═══════════════════════════════════════
  //  THREE.JS DARK CYBERPUNK TRAINING ROOM
  // ═══════════════════════════════════════
  useEffect(() => {
    if (!mountRef.current || gameRef.current) return;
    const container = mountRef.current;
    let didCancel = false;
    let cleanup = null;

    (async () => {
      cleanup = await initTutorialTrainingRoom({
        container,
        tutorialSteps: TUTORIAL_STEPS,
        stepRef,
        advancingRef,
        keysDown,
        keysUsed,
        jumpCount,
        mouseAccum,
        sprintStart,
        sprintDone,
        setProgress,
        setPointerLocked,
        onAdvanceStep: advanceStep,
        onFinish: handleFinish,
      });

      if (didCancel) {
        cleanup?.();
        return;
      }

      gameRef.current = { cleanup };
    })();

    return () => {
      didCancel = true;
      if (gameRef.current?.cleanup) gameRef.current.cleanup();
      else cleanup?.();
      gameRef.current = null;
    };
  }, [advanceStep, handleFinish]);

  return (
    <div className="fixed inset-0 z-50">
      <div ref={mountRef} className="absolute inset-0" style={{ cursor: pointerLocked ? 'none' : 'pointer' }} />
      {pointerLocked && <Crosshair />}
      <TutorialNotification step={step} progress={progress} totalSteps={totalSteps} onSkip={handleSkip} />
      <SuccessFlash show={showSuccess} />
      <div className="fixed inset-0 pointer-events-none z-[45]" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,0,102,0.015) 0px, rgba(255,0,102,0.015) 1px, transparent 1px, transparent 4px)',
      }} />
    </div>
  );
}
