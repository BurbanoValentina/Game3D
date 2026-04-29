import KeyIcon from './KeyIcon';

export default function TrainingRoomTopBar({ visible, onBack, keys }) {
  return (
    <div
      className={`w-full max-w-3xl px-6 pt-6 flex items-center justify-between transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <button
        onClick={onBack}
        className="oasis-btn px-4 py-2 text-[10px] cursor-pointer"
        style={{ color: 'var(--dark)' }}
      >
        ← MENÚ
      </button>

      <div className="flex items-center gap-3">
        {keys.map((k, i) => (
          <KeyIcon key={i} color={k.c} obtained={k.obtained} size={26} />
        ))}
      </div>
    </div>
  );
}
