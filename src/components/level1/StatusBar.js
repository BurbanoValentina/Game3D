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

  return (
    <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-1.5"
      style={{ background: 'rgba(255,240,235,0.9)', borderBottom: '1px solid rgba(255,0,102,0.08)', backdropFilter: 'blur(10px)' }}>
      {/* Left: System info */}
      <div className="flex items-center gap-3">
        <svg width="12" height="12" viewBox="0 0 12 12" className="animate-neon-breathe" style={{ color: '#FF0066' }}>
          <polygon points="6,1 11,4 11,8 6,11 1,8 1,4" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="6" cy="6" r="2" fill="currentColor" opacity="0.5" />
        </svg>
        <span className="font-sharetm text-[10px] tracking-widest" style={{ color: 'var(--bronze)' }}>
          OASIS_SYS v2089.3.1 // SECTOR_7G
        </span>
      </div>

      {/* Center: Mission info */}
      <div className="flex items-center gap-2">
        <svg width="10" height="10" viewBox="0 0 10 10" style={{ opacity: blink ? 0.9 : 0.3, transition: 'opacity 0.3s' }}>
          <circle cx="5" cy="5" r="4" fill="none" stroke="#FFBB33" strokeWidth="1" />
          <circle cx="5" cy="5" r="1.5" fill="#FFBB33" opacity="0.5" />
        </svg>
        <span className="font-sharetm text-[10px] tracking-widest" style={{ color: 'var(--neon-amber)', opacity: 0.7 }}>
          MISIÓN: 5 PUZZLES + 3 RECUERDOS → LLAVE ÁMBAR
        </span>
      </div>

      {/* Right: Time */}
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--neon-green)', boxShadow: '0 0 4px var(--neon-green)' }}>
          <div className="w-full h-full rounded-full animate-ping" style={{ background: 'var(--neon-green)', opacity: 0.3 }} />
        </div>
        <span className="font-sharetm text-[10px] tracking-widest" style={{ color: 'var(--neon-magenta)', textShadow: '0 0 5px rgba(255,0,102,0.3)' }}>
          {time}
        </span>
      </div>
    </div>
  );
}
