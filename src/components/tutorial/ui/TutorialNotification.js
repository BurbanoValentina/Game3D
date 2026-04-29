export default function TutorialNotification({
  step,
  progress,
  totalSteps,
  onSkip,
}) {
  if (!step) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center pointer-events-none pb-8 px-4">
      <div className="w-full max-w-lg mb-4 pointer-events-auto">
        <div className="flex items-center justify-between mb-1">
          <span
            className="font-sharetm text-[9px] tracking-[0.4em]"
            style={{ color: 'var(--bronze)' }}
          >
            CALIBRACIÓN — {step.id + 1}/{totalSteps}
          </span>
          <button
            onClick={onSkip}
            className="font-orbitron text-[10px] tracking-widest px-3 py-1 rounded transition-all hover:scale-105 cursor-pointer"
            style={{
              color: 'var(--neon-magenta)',
              background: 'rgba(255,240,235,0.85)',
              border: '1px solid rgba(255,0,102,0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            SALTAR
          </button>
        </div>
        <div
          className="w-full h-[2px] rounded-full overflow-hidden"
          style={{ background: 'rgba(255,0,102,0.08)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${((step.id + 1) / totalSteps) * 100}%`,
              background:
                'linear-gradient(90deg, var(--neon-magenta), var(--neon-violet))',
              boxShadow: '0 0 8px rgba(255,0,102,0.3)',
            }}
          />
        </div>
      </div>

      <div
        className="w-full max-w-lg rounded-lg p-5 pointer-events-auto animate-fade-in-up"
        key={step.id}
        style={{
          background: 'rgba(255,245,240,0.95)',
          border: '1px solid rgba(255,0,102,0.12)',
          boxShadow: '0 0 30px rgba(255,0,102,0.05)',
          backdropFilter: 'blur(15px)',
        }}
      >
        <div className="flex items-start gap-4">
          <div
            className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
            style={{
              background: 'rgba(255,0,102,0.06)',
              border: '1px solid rgba(255,0,102,0.18)',
            }}
          >
            <span
              className="font-orbitron text-[9px] tracking-wider font-bold"
              style={{ color: 'var(--neon-magenta)' }}
            >
              {step.icon}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="font-orbitron text-sm tracking-widest mb-1"
              style={{
                color: 'var(--neon-magenta)',
                textShadow: '0 0 8px rgba(255,0,102,0.3)',
              }}
            >
              {step.title}
            </h3>
            <p
              className="font-rajdhani text-sm leading-relaxed"
              style={{ color: 'var(--dark)' }}
            >
              {step.instruction}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div
                className="flex-1 h-1.5 rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(progress, 100)}%`,
                    background:
                      progress >= 100
                        ? 'var(--neon-green)'
                        : 'linear-gradient(90deg, var(--neon-magenta), var(--neon-violet))',
                    boxShadow:
                      progress >= 100
                        ? '0 0 8px var(--neon-green)'
                        : '0 0 5px rgba(255,0,102,0.3)',
                  }}
                />
              </div>
              <span
                className="font-sharetm text-[10px] tracking-widest flex-shrink-0"
                style={{ color: 'var(--neon-amber)' }}
              >
                {step.subtext}
              </span>
            </div>
          </div>
        </div>
      </div>

      {step.type === 'click' && (
        <p
          className="font-sharetm text-[10px] tracking-widest mt-3 animate-pulse"
          style={{ color: 'rgba(255,0,102,0.5)' }}
        >
          HAZ CLIC EN LA PANTALLA PARA COMENZAR
        </p>
      )}
    </div>
  );
}
