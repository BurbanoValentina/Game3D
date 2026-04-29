import { KeyRound } from 'lucide-react';

export default function KeyIcon({ color, obtained, size = 20 }) {
  const baseStroke = obtained ? '#D4A99A' : 'rgba(212,169,154,0.35)';

  return (
    <div className="relative" aria-hidden="true">
      <KeyRound
        size={size}
        stroke={baseStroke}
        strokeWidth={1.8}
        style={{
          filter: 'drop-shadow(0 0 6px rgba(212,169,154,0.45))',
          opacity: obtained ? 0.9 : 0.45,
        }}
      />
      <KeyRound
        size={size}
        stroke={color}
        strokeWidth={1.6}
        className="absolute inset-0"
        style={{ filter: `drop-shadow(0 0 8px ${color}66)`, opacity: obtained ? 0.95 : 0.3 }}
      />
    </div>
  );
}
