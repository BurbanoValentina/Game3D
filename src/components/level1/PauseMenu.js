'use client';

import { useState } from 'react';
import { GameStates } from '../../constants/gameConstants';
import useGameStore from '../../lib/gameStore';
import audioManager from '../../lib/audioManager';

function SliderRow({ label, value, onChange, min = 0, max = 100 }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="font-rajdhani text-xs" style={{ color: 'var(--dark)' }}>{label}</span>
      <div className="flex items-center gap-2">
        <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))}
          className="w-20" style={{ accentColor: 'var(--neon-magenta)' }} />
        <span className="font-sharetm text-[10px] w-6 text-right" style={{ color: 'var(--neon-magenta)' }}>{value}</span>
      </div>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="font-rajdhani text-xs" style={{ color: 'var(--dark)' }}>{label}</span>
      <button onClick={() => onChange(!checked)} className="w-10 h-5 rounded-full transition-colors relative cursor-pointer"
        style={{ background: checked ? 'rgba(255,0,102,0.3)' : 'rgba(168,152,128,0.2)', border: `1px solid ${checked ? 'rgba(255,0,102,0.4)' : 'rgba(168,152,128,0.3)'}` }}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
          style={{ background: checked ? 'var(--neon-magenta)' : 'var(--taupe)' }} />
      </button>
    </div>
  );
}

function SelectRow({ label, value, options, onChange }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="font-rajdhani text-xs" style={{ color: 'var(--dark)' }}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="px-2 py-1 font-sharetm text-[10px] rounded cursor-pointer"
        style={{ background: 'rgba(255,0,102,0.04)', border: '1px solid rgba(255,0,102,0.15)', color: 'var(--dark)', outline: 'none' }}>
        {options.map((opt) => <option key={opt} value={opt} style={{ background: 'var(--cream)' }}>{opt}</option>)}
      </select>
    </div>
  );
}

const TABS = ['PAUSA', 'AUDIO', 'CONTROLES', 'GRÁFICOS', 'ACCESIBILIDAD'];

export default function PauseMenu() {
  const setGameState = useGameStore((s) => s.setGameState);
  const resetGame = useGameStore((s) => s.resetGame);
  const settings = useGameStore((s) => s.settings);
  const updateSetting = useGameStore((s) => s.updateSetting);
  const [tab, setTab] = useState(0);

  const handleResume = () => setGameState(GameStates.PLAYING);
  const handleQuit = () => { audioManager.stopAll(); resetGame(); setGameState(GameStates.TRAINING_ROOM); };

  const handleVolumeChange = (key, val) => {
    updateSetting(key, val);
    if (key === 'masterVolume') audioManager.setMasterVolume(val);
    if (key === 'musicVolume') audioManager.setMusicVolume(val);
    if (key === 'sfxVolume') audioManager.setSfxVolume(val);
  };

  const renderTabContent = () => {
    switch (tab) {
      case 0: // PAUSA
        return (
          <div className="space-y-3 mt-4">
            <svg width="40" height="40" viewBox="0 0 40 40" className="mx-auto mb-3">
              <polygon points="20,4 34,12 34,28 20,36 6,28 6,12" fill="rgba(255,0,102,0.04)" stroke="#FF0066" strokeWidth="1" opacity="0.5" />
              <rect x="14" y="14" width="4" height="12" rx="1" fill="#FF0066" opacity="0.7" />
              <rect x="22" y="14" width="4" height="12" rx="1" fill="#FF0066" opacity="0.7" />
            </svg>
            <p className="font-sharetm text-[9px] tracking-widest mb-4 text-center" style={{ color: 'var(--bronze)' }}>SISTEMA EN ESPERA — OASIS v2089</p>
            <button onClick={handleResume} className="oasis-btn-premium w-full py-3 text-center cursor-pointer" style={{ color: 'var(--neon-green)', borderColor: 'rgba(0,255,136,0.3)' }}>
              CONTINUAR
            </button>
            <button onClick={handleQuit} className="oasis-btn w-full py-3 text-center cursor-pointer" style={{ color: 'var(--neon-magenta)', borderColor: 'rgba(255,0,102,0.2)', background: 'rgba(255,0,102,0.03)' }}>
              SALIR AL MENÚ
            </button>
          </div>
        );
      case 1: // AUDIO
        return (
          <div className="mt-3">
            <SliderRow label="Volumen General" value={settings.masterVolume} onChange={(v) => handleVolumeChange('masterVolume', v)} />
            <SliderRow label="Música" value={settings.musicVolume} onChange={(v) => handleVolumeChange('musicVolume', v)} />
            <SliderRow label="Efectos" value={settings.sfxVolume} onChange={(v) => handleVolumeChange('sfxVolume', v)} />
            <SliderRow label="Voces" value={settings.voiceVolume} onChange={(v) => updateSetting('voiceVolume', v)} />
          </div>
        );
      case 2: // CONTROLES
        return (
          <div className="mt-3">
            <SliderRow label="Sensibilidad Mouse" value={settings.sensitivity} min={1} max={10} onChange={(v) => updateSetting('sensitivity', v)} />
            <ToggleRow label="Vibración" checked={settings.vibration} onChange={(v) => updateSetting('vibration', v)} />
          </div>
        );
      case 3: // GRÁFICOS
        return (
          <div className="mt-3">
            <SelectRow label="Calidad Visual" value={settings.graphicsQuality} options={['ULTRA', 'ALTA', 'MEDIA', 'BAJA']} onChange={(v) => updateSetting('graphicsQuality', v)} />
            <ToggleRow label="Efecto Glitch" checked={settings.glitchEffect} onChange={(v) => updateSetting('glitchEffect', v)} />
            <ToggleRow label="Líneas CRT" checked={settings.crtLines} onChange={(v) => updateSetting('crtLines', v)} />
          </div>
        );
      case 4: // ACCESIBILIDAD
        return (
          <div className="mt-3">
            <ToggleRow label="Subtítulos" checked={settings.subtitles} onChange={(v) => updateSetting('subtitles', v)} />
            <ToggleRow label="Reducir Parpadeo" checked={settings.reduceFlashing} onChange={(v) => updateSetting('reduceFlashing', v)} />
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center" style={{ background: 'rgba(255,245,240,0.92)', backdropFilter: 'blur(12px)' }}>
      <div className="text-center rounded-lg p-6 max-w-sm w-full mx-4 relative" style={{
        background: 'rgba(255,235,225,0.95)', border: '1px solid rgba(255,0,102,0.1)',
        boxShadow: '0 0 60px rgba(255,0,102,0.03)',
      }}>
        {/* Tab navigation */}
        <div className="flex gap-1 mb-3 overflow-x-auto scrollbar-hide">
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} className="font-sharetm text-[8px] tracking-widest px-2 py-1.5 rounded transition-all cursor-pointer whitespace-nowrap" style={{
              background: tab === i ? 'rgba(255,0,102,0.08)' : 'transparent',
              color: tab === i ? 'var(--neon-magenta)' : 'var(--bronze)',
              border: tab === i ? '1px solid rgba(255,0,102,0.2)' : '1px solid transparent',
            }}>{t}</button>
          ))}
        </div>

        {/* Divider */}
        <div className="h-[1px] w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,0,102,0.15), transparent)' }} />

        {/* Tab content */}
        <div className="min-h-[200px]">
          {renderTabContent()}
        </div>

        {/* Resume hint */}
        {tab !== 0 && (
          <button onClick={handleResume} className="mt-4 font-sharetm text-[9px] tracking-widest hover:underline cursor-pointer" style={{ color: 'var(--bronze)' }}>
            ESC PARA CONTINUAR
          </button>
        )}

        {/* Corner decorations */}
        <div className="absolute top-3 left-3 w-3 h-3 border-t border-l" style={{ borderColor: 'rgba(255,0,102,0.15)' }} />
        <div className="absolute top-3 right-3 w-3 h-3 border-t border-r" style={{ borderColor: 'rgba(255,0,102,0.15)' }} />
        <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l" style={{ borderColor: 'rgba(255,0,102,0.15)' }} />
        <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r" style={{ borderColor: 'rgba(255,0,102,0.15)' }} />
      </div>
    </div>
  );
}
