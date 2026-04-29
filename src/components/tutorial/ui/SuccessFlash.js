export default function SuccessFlash({ show }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center pointer-events-none animate-fade-in-up">
      <div
        className="px-8 py-4 rounded-lg"
        style={{
          background: 'rgba(0,255,136,0.1)',
          border: '1px solid rgba(0,255,136,0.3)',
          boxShadow: '0 0 40px rgba(0,255,136,0.15)',
        }}
      >
        <span
          className="font-orbitron text-xl tracking-[0.3em]"
          style={{
            color: 'var(--neon-green)',
            textShadow: '0 0 15px rgba(0,255,136,0.5)',
          }}
        >
          COMPLETADO
        </span>
      </div>
    </div>
  );
}
