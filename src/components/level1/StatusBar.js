'use client';

import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [time, setTime] = useState('00:00:00');
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const update = () => { const now = new Date(); setTime(now.toLocaleTimeString('es-ES', { hour12: false })); };
    update();
    const interval = setInterval(update, 1000);
    const blinkInt = setInterval(() => setBlink(b => !b), 800);
    return () => { clearInterval(interval); clearInterval(blinkInt); };
  }, []);

  return null;
}
