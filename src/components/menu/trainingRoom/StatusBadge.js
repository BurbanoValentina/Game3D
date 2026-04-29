export default function StatusBadge({ status }) {
  const configs = {
    available: {
      text: 'DISPONIBLE',
      bg: 'rgba(0,255,136,0.08)',
      border: 'rgba(0,255,136,0.25)',
      textColor: '#00FF88',
    },
    locked: {
      text: 'BLOQUEADO',
      bg: 'rgba(168,152,128,0.08)',
      border: 'rgba(168,152,128,0.2)',
      textColor: '#A89880',
    },
    completed: {
      text: 'COMPLETADO',
      bg: 'rgba(0,255,136,0.08)',
      border: 'rgba(0,255,136,0.25)',
      textColor: '#00FF88',
    },
    soon: {
      text: 'PRÓXIMAMENTE',
      bg: 'rgba(168,152,128,0.06)',
      border: 'rgba(168,152,128,0.15)',
      textColor: '#A89880',
    },
  };

  const cfg = configs[status] || configs.soon;

  return (
    <span
      className="font-sharetm text-[8px] tracking-[0.3em] px-2.5 py-1 rounded-sm"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.textColor }}
    >
      {cfg.text}
    </span>
  );
}
