import KeyIcon from './KeyIcon';
import ModuleIcon from './ModuleIcon';
import StatusBadge from './StatusBadge';

export default function TrainingRoomModuleCard({ mod, index, visible, hoveredId, setHoveredId }) {
  const isHovered = hoveredId === mod.id;
  const isDisabled = mod.disabled;
  const isSoon = mod.status === 'soon';
  const isLocked = mod.status === 'locked';

  const clipPath =
    'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))';

  const accentColor = isHovered ? mod.color : 'rgba(255,0,102,0.15)';
  const accentOpacity = isHovered ? 0.8 : 0.3;
  const titleColor =
    isHovered && !isDisabled ? mod.color : isSoon || isLocked ? 'rgba(168,152,128,0.5)' : 'var(--dark)';

  return (
    <button
      onClick={mod.action}
      onMouseEnter={() => !isDisabled && setHoveredId(mod.id)}
      onMouseLeave={() => setHoveredId(null)}
      disabled={isDisabled}
      className={`relative text-left w-full rounded-lg p-5 transition-all duration-500 group ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{
        transitionDelay: `${200 + index * 80}ms`,
        background: isHovered ? `linear-gradient(135deg, ${mod.color}08, ${mod.color}03)` : isSoon || isLocked ? 'rgba(168,152,128,0.03)' : 'rgba(255,240,235,0.6)',
        border: `1px solid ${isHovered ? `${mod.color}40` : isSoon || isLocked ? 'rgba(168,152,128,0.1)' : 'rgba(255,0,102,0.08)'}`,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        boxShadow: isHovered ? `0 0 30px ${mod.color}10, inset 0 0 30px ${mod.color}03` : 'none',
        clipPath,
      }}
    >
      {/* Corner accents */}
      {!isSoon && !isLocked && (
        <>
          <div className="absolute top-0 left-0 w-3 h-[1px] transition-all duration-300" style={{ background: accentColor, opacity: accentOpacity }} />
          <div className="absolute top-0 left-0 w-[1px] h-3 transition-all duration-300" style={{ background: accentColor, opacity: accentOpacity }} />
          <div className="absolute bottom-0 right-0 w-3 h-[1px] transition-all duration-300" style={{ background: accentColor, opacity: accentOpacity }} />
          <div className="absolute bottom-0 right-0 w-[1px] h-3 transition-all duration-300" style={{ background: accentColor, opacity: accentOpacity }} />
        </>
      )}

      <div className="flex items-start gap-4">
        {/* Index */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <span className="font-sharetm text-[10px] tracking-widest" style={{ color: isSoon || isLocked ? 'rgba(168,152,128,0.4)' : 'var(--bronze)' }}>
            {mod.idx}
          </span>
          <ModuleIcon type={mod.icon} color={mod.color} locked={isLocked} comingSoon={isSoon} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3
              className="font-orbitron text-sm tracking-[0.2em] transition-colors duration-300"
              style={{ color: titleColor, textShadow: isHovered && !isDisabled ? `0 0 10px ${mod.color}40` : 'none' }}
            >
              {mod.title}
            </h3>
            <StatusBadge status={mod.status} />
          </div>

          <p
            className="font-rajdhani text-xs tracking-wider mb-2"
            style={{ color: isSoon || isLocked ? 'rgba(168,152,128,0.4)' : 'var(--neon-magenta)', opacity: isSoon || isLocked ? 0.6 : 0.7 }}
          >
            {mod.subtitle}
          </p>

          <p
            className="font-rajdhani text-[12px] leading-relaxed"
            style={{ color: isSoon || isLocked ? 'rgba(168,152,128,0.4)' : 'var(--darker)', opacity: isSoon || isLocked ? 0.7 : 0.85 }}
          >
            {mod.desc}
          </p>

          {/* Key indicator for levels */}
          {mod.keyColor && (
            <div className="flex items-center gap-2 mt-3">
              <div style={{ opacity: isSoon ? 0.2 : 0.7 }}>
                <KeyIcon color={mod.keyColor} obtained={!isSoon} size={16} />
              </div>
              <span
                className="font-sharetm text-[9px] tracking-[0.2em]"
                style={{
                  color: isSoon ? 'rgba(168,152,128,0.3)' : mod.keyColor,
                  opacity: isSoon ? 0.5 : 0.7,
                  textShadow: !isSoon && mod.status === 'completed' ? `0 0 8px ${mod.keyColor}40` : 'none',
                }}
              >
                {mod.keyName}
              </span>
              {mod.status === 'completed' && (
                <svg width="12" height="12" viewBox="0 0 12 12">
                  <path d="M2,6 L5,9 L10,3" fill="none" stroke="#00FF88" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </div>
          )}

          {/* Lock message */}
          {isLocked && (
            <div className="flex items-center gap-2 mt-3">
              <svg width="10" height="10" viewBox="0 0 10 10">
                <rect x="2" y="5" width="6" height="4" rx="0.5" fill="none" stroke="#A89880" strokeWidth="0.8" opacity="0.4" />
                <path
                  d="M3.5,5 L3.5,3.5 Q3.5,1.5 5,1.5 Q6.5,1.5 6.5,3.5 L6.5,5"
                  fill="none"
                  stroke="#A89880"
                  strokeWidth="0.8"
                  opacity="0.4"
                />
              </svg>
              <span className="font-sharetm text-[8px] tracking-[0.15em]" style={{ color: '#A89880', opacity: 0.5 }}>
                COMPLETA NIVEL 1 PARA DESBLOQUEAR
              </span>
            </div>
          )}
        </div>

        {/* Arrow for available modules */}
        {!isDisabled && (
          <div className="flex-shrink-0 self-center">
            <svg
              width="8"
              height="14"
              viewBox="0 0 8 14"
              style={{ color: mod.color, opacity: isHovered ? 0.8 : 0.2, transition: 'all 0.3s', transform: isHovered ? 'translateX(2px)' : 'none' }}
            >
              <path d="M1,1 L7,7 L1,13" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        )}
      </div>

      {/* Hover scan effect */}
      {isHovered && !isDisabled && (
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg"
          style={{ clipPath }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-[1px]"
            style={{ background: `linear-gradient(90deg, transparent, ${mod.color}40, transparent)`, animation: 'scan-line 2s linear infinite' }}
          />
        </div>
      )}
    </button>
  );
}
