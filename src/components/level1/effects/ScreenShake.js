// ══════════════════════════════════════════════════════
//  SCREEN SHAKE — Intense vibration for damage events
//  Like Doors from Roblox — you FEEL the impact
// ══════════════════════════════════════════════════════

import { useEffect, useRef, useCallback } from 'react';

export function useScreenShake() {
  const containerRef = useRef(null);
  const animIdRef = useRef(null);

  const shake = useCallback((intensity = 20, duration = 600, decay = true) => {
    const el = containerRef.current || document.body;
    const start = performance.now();

    // Also trigger device vibration if available
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200, 100, 300]);
    }

    const doShake = (now) => {
      const elapsed = now - start;
      if (elapsed > duration) {
        el.style.transform = '';
        el.style.filter = '';
        return;
      }
      const progress = elapsed / duration;
      const currentIntensity = decay ? intensity * (1 - progress) : intensity;
      const x = (Math.random() - 0.5) * currentIntensity * 2;
      const y = (Math.random() - 0.5) * currentIntensity * 2;
      const rotation = (Math.random() - 0.5) * currentIntensity * 0.3;
      const scale = 1 + Math.random() * 0.02 * (currentIntensity / 20);

      el.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`;

      // Random color aberration
      if (Math.random() > 0.7) {
        const hue = Math.random() * 30 - 15;
        el.style.filter = `hue-rotate(${hue}deg) saturate(${1.2 + Math.random() * 0.5})`;
      }

      animIdRef.current = requestAnimationFrame(doShake);
    };
    cancelAnimationFrame(animIdRef.current);
    requestAnimationFrame(doShake);
  }, []);

  const megaShake = useCallback(() => {
    shake(35, 1200, true);
  }, [shake]);

  const damageShake = useCallback(() => {
    shake(25, 800, true);
  }, [shake]);

  const glitchShake = useCallback(() => {
    shake(15, 500, false);
  }, [shake]);

  useEffect(() => {
    return () => cancelAnimationFrame(animIdRef.current);
  }, []);

  return { containerRef, shake, megaShake, damageShake, glitchShake };
}

export default useScreenShake;
