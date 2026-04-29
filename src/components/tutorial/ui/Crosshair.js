export default function Crosshair() {
  return (
    <div className="fixed inset-0 z-[50] flex items-center justify-center pointer-events-none">
      <svg width="28" height="28" viewBox="0 0 28 28">
        <line x1="14" y1="2" x2="14" y2="8" stroke="#FF0066" strokeWidth="1" opacity="0.5" />
        <line x1="14" y1="20" x2="14" y2="26" stroke="#FF0066" strokeWidth="1" opacity="0.5" />
        <line x1="2" y1="14" x2="8" y2="14" stroke="#FF0066" strokeWidth="1" opacity="0.5" />
        <line x1="20" y1="14" x2="26" y2="14" stroke="#FF0066" strokeWidth="1" opacity="0.5" />
        <circle cx="14" cy="14" r="2" fill="#FF0066" opacity="0.6">
          <animate attributeName="r" values="1.5;2.5;1.5" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}
