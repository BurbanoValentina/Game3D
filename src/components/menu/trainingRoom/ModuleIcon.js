export default function ModuleIcon({ type, color, locked, comingSoon }) {
  const opacity = locked || comingSoon ? 0.3 : 1;
  const stroke = locked || comingSoon ? '#A89880' : color;

  const icons = {
    tutorial: (
      <svg width="44" height="44" viewBox="0 0 44 44" style={{ opacity }}>
        <rect x="6" y="4" width="32" height="36" rx="3" fill="none" stroke={stroke} strokeWidth="1.5" />
        <line x1="12" y1="14" x2="32" y2="14" stroke={stroke} strokeWidth="1" opacity="0.5" />
        <line x1="12" y1="20" x2="28" y2="20" stroke={stroke} strokeWidth="1" opacity="0.4" />
        <line x1="12" y1="26" x2="30" y2="26" stroke={stroke} strokeWidth="1" opacity="0.3" />
        <circle cx="22" cy="34" r="3" fill="none" stroke={stroke} strokeWidth="1" opacity="0.6">
          <animate attributeName="r" values="2.5;3.5;2.5" dur="2s" repeatCount="indefinite" />
        </circle>
        <polygon points="20,8 26,11 20,14" fill={stroke} opacity="0.6" />
      </svg>
    ),
    level: (
      <svg width="44" height="44" viewBox="0 0 44 44" style={{ opacity }}>
        <polygon points="22,3 40,14 40,30 22,41 4,30 4,14" fill="none" stroke={stroke} strokeWidth="1.5" />
        <polygon
          points="22,10 33,17 33,27 22,34 11,27 11,17"
          fill={`${stroke}15`}
          stroke={stroke}
          strokeWidth="0.8"
          opacity="0.5"
        />
        <circle cx="22" cy="22" r="4" fill={stroke} opacity="0.3">
          <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.5s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
    credits: (
      <svg width="44" height="44" viewBox="0 0 44 44" style={{ opacity }}>
        <circle cx="22" cy="16" r="7" fill="none" stroke={stroke} strokeWidth="1.5" />
        <path d="M10,38 Q10,28 22,26 Q34,28 34,38" fill="none" stroke={stroke} strokeWidth="1.5" />
        <circle cx="14" cy="16" r="5" fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.3" />
        <circle cx="30" cy="16" r="5" fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.3" />
      </svg>
    ),
    locked: (
      <svg width="44" height="44" viewBox="0 0 44 44" style={{ opacity: 0.3 }}>
        <rect x="12" y="20" width="20" height="16" rx="2" fill="none" stroke="#A89880" strokeWidth="1.5" />
        <path
          d="M16,20 L16,14 Q16,8 22,8 Q28,8 28,14 L28,20"
          fill="none"
          stroke="#A89880"
          strokeWidth="1.5"
        />
        <circle cx="22" cy="28" r="2" fill="#A89880" opacity="0.5" />
        <line x1="22" y1="30" x2="22" y2="33" stroke="#A89880" strokeWidth="1.5" opacity="0.4" />
      </svg>
    ),
    soon: (
      <svg width="44" height="44" viewBox="0 0 44 44" style={{ opacity: 0.25 }}>
        <circle
          cx="22"
          cy="22"
          r="14"
          fill="none"
          stroke="#A89880"
          strokeWidth="1.5"
          strokeDasharray="4,4"
        />
        <text
          x="22"
          y="26"
          textAnchor="middle"
          fill="#A89880"
          fontSize="10"
          fontFamily="Orbitron"
          fontWeight="700"
        >
          ?
        </text>
      </svg>
    ),
  };

  return icons[type] || icons.soon;
}
