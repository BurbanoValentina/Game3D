'use client';

import { GameStates } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';
import audioManager from '../../lib/audioManager';

function SectionIcon({ type }) {
  const icons = {
    audio: <><circle cx="8" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1" /><path d="M11,5 Q14,8 11,11" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" /><path d="M13,3 Q17,8 13,13" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.4" /></>,
    controls: <><rect x="3" y="4" width="10" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1" /><circle cx="8" cy="8" r="1.5" fill="currentColor" opacity="0.5" /><line x1="5" y1="8" x2="3" y2="10" stroke="currentColor" strokeWidth="0.8" /><line x1="11" y1="8" x2="13" y2="10" stroke="currentColor" strokeWidth="0.8" /></>,
    graphics: <><rect x="2" y="3" width="12" height="9" rx="1" fill="none" stroke="currentColor" strokeWidth="1" /><line x1="2" y1="14" x2="14" y2="14" stroke="currentColor" strokeWidth="0.8" /><rect x="6" y="12" width="4" height="2" fill="currentColor" opacity="0.3" /></>,
    access: <><circle cx="8" cy="6" r="3" fill="none" stroke="currentColor" strokeWidth="1" /><path d="M3,14 Q3,10 8,10 Q13,10 13,14" fill="none" stroke="currentColor" strokeWidth="1" /></>,
  };
  return <svg width="16" height="16" viewBox="0 0 16 16" style={{ color: 'inherit' }}>{icons[type]}</svg>;
}

function SliderRow({ label, sub, value, onChange, min = 0, max = 100 }) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(255,0,102,0.03)' }}>
      <div>
        <div className="font-rajdhani text-sm font-medium" style={{ color: 'var(--dark)' }}>{label}</div>
        <div className="font-sharetm text-[9px] tracking-widest" style={{ color: 'var(--bronze)' }}>{sub}</div>
      </div>
      <div className="flex items-center gap-3">
        <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))}
          className="w-28" style={{ accentColor: 'var(--neon-magenta)' }} />
        <span className="font-orbitron text-xs w-8 text-right" style={{ color: 'var(--neon-magenta)', textShadow: '0 0 5px rgba(255,0,102,0.3)' }}>{value}</span>
      </div>
    </div>
  );
}

function ToggleRow({ label, sub, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(255,0,102,0.03)' }}>
      <div>
        <div className="font-rajdhani text-sm font-medium" style={{ color: 'var(--dark)' }}>{label}</div>
        <div className="font-sharetm text-[9px] tracking-widest" style={{ color: 'var(--bronze)' }}>{sub}</div>
      </div>
      <button onClick={() => onChange(!checked)} className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer`}
        style={{ background: checked ? 'rgba(255,0,102,0.3)' : 'rgba(168,152,128,0.2)', boxShadow: checked ? '0 0 12px rgba(255,0,102,0.2)' : 'none', border: `1px solid ${checked ? 'rgba(255,0,102,0.4)' : 'rgba(168,152,128,0.2)'}` }}>
        <div className={`absolute top-0.5 w-5 h-5 rounded-full shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-0.5'}`}
          style={{ background: checked ? 'var(--neon-magenta)' : 'var(--taupe)' }} />
      </button>
    </div>
  );
}

function SelectRow({ label, sub, value, options, onChange }) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(255,0,102,0.03)' }}>
      <div>
        <div className="font-rajdhani text-sm font-medium" style={{ color: 'var(--dark)' }}>{label}</div>
        <div className="font-sharetm text-[9px] tracking-widest" style={{ color: 'var(--bronze)' }}>{sub}</div>
      </div>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="px-3 py-1.5 font-sharetm text-xs rounded cursor-pointer"
        style={{ background: 'rgba(255,0,102,0.04)', border: '1px solid rgba(255,0,102,0.15)', color: 'var(--dark)', outline: 'none' }}>
        {options.map((opt) => <option key={opt} value={opt} style={{ background: 'var(--cream)' }}>{opt}</option>)}
      </select>
    </div>
  );
}

export default function SettingsScreen() {
  const setGameState = useGameStore((s) => s.setGameState);
  const settings = useGameStore((s) => s.settings);
  const updateSetting = useGameStore((s) => s.updateSetting);

  const handleVolumeChange = (key, val) => {
    updateSetting(key, val);
    if (key === 'masterVolume') audioManager.setMasterVolume(val);
    if (key === 'musicVolume') audioManager.setMusicVolume(val);
    if (key === 'sfxVolume') audioManager.setSfxVolume(val);
  };

  const sections = [
    { id: 'audio', icon: 'audio', title: 'AUDIO', color: 'var(--neon-magenta)', content: (
      <>
        <SliderRow label="Volumen General" sub="MASTER OUTPUT" value={settings.masterVolume} onChange={(v) => handleVolumeChange('masterVolume', v)} />
        <SliderRow label="Música" sub="SOUNDTRACK" value={settings.musicVolume} onChange={(v) => handleVolumeChange('musicVolume', v)} />
        <SliderRow label="Efectos" sub="SFX / GLITCH" value={settings.sfxVolume} onChange={(v) => handleVolumeChange('sfxVolume', v)} />
        <SliderRow label="Voces" sub="DIÁLOGOS" value={settings.voiceVolume} onChange={(v) => updateSetting('voiceVolume', v)} />
      </>
    )},
    { id: 'controls', icon: 'controls', title: 'CONTROLES', color: 'var(--darker)', content: (
      <>
        <SliderRow label="Sensibilidad" sub="MOUSE" value={settings.sensitivity} min={1} max={10} onChange={(v) => updateSetting('sensitivity', v)} />
        <ToggleRow label="Vibración" sub="HAPTIC FEEDBACK" checked={settings.vibration} onChange={(v) => updateSetting('vibration', v)} />
      </>
    )},
    { id: 'graphics', icon: 'graphics', title: 'GRÁFICOS', color: 'var(--holo-pink)', content: (
      <>
        <SelectRow label="Calidad Visual" sub="RENDER PRESET" value={settings.graphicsQuality} options={['ULTRA', 'ALTA', 'MEDIA', 'BAJA']} onChange={(v) => updateSetting('graphicsQuality', v)} />
        <ToggleRow label="Efecto Glitch" sub="CORRUPCIÓN VISUAL" checked={settings.glitchEffect} onChange={(v) => updateSetting('glitchEffect', v)} />
        <ToggleRow label="Líneas CRT" sub="RETRO SCANLINES" checked={settings.crtLines} onChange={(v) => updateSetting('crtLines', v)} />
      </>
    )},
    { id: 'access', icon: 'access', title: 'ACCESIBILIDAD', color: 'var(--darker)', content: (
      <>
        <ToggleRow label="Subtítulos" sub="CLOSED CAPTIONS" checked={settings.subtitles} onChange={(v) => updateSetting('subtitles', v)} />
        <ToggleRow label="Reducir Parpadeo" sub="PHOTOSENSITIVITY" checked={settings.reduceFlashing} onChange={(v) => updateSetting('reduceFlashing', v)} />
      </>
    )},
  ];

  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center pt-16 pb-8 px-6 overflow-y-auto scrollbar-hide space-light-bg">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,0,102,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,102,0.01) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      <h2 className="font-orbitron text-2xl tracking-[0.3em] mb-1 relative z-10" style={{ color: 'var(--dark)' }}>Ajustes</h2>
      <p className="font-sharetm text-[10px] tracking-widest mb-8 relative z-10" style={{ color: 'var(--bronze)' }}>CONFIGURACIÓN DEL SISTEMA</p>

      <div className="w-full max-w-lg space-y-4 relative z-10">
        {sections.map((sec) => (
          <section key={sec.id} className="rounded-lg p-5" style={{ background: 'rgba(255,235,225,0.85)', border: '1px solid rgba(255,0,102,0.04)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div style={{ color: sec.color }}><SectionIcon type={sec.icon} /></div>
              <h3 className="font-orbitron text-xs tracking-widest" style={{ color: sec.color }}>{sec.title}</h3>
              <div className="flex-1 h-[1px]" style={{ background: `linear-gradient(90deg, ${sec.color}33, transparent)` }} />
            </div>
            {sec.content}
          </section>
        ))}
      </div>

      <button onClick={() => setGameState(GameStates.MAIN_MENU)} className="oasis-btn mt-8 relative z-10 cursor-pointer" style={{ color: 'var(--dark)' }}>
        ← VOLVER AL MENÚ
      </button>
    </div>
  );
}
