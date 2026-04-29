export default function TrainingRoomQuote({ visible }) {
  return (
    <div className={`text-center mt-8 mb-4 transition-all duration-1000 delay-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div
        className="w-12 h-[1px] mx-auto mb-4"
        style={{ background: 'linear-gradient(90deg, transparent, var(--neon-amber), transparent)' }}
      />
      <p
        className="font-rajdhani text-[11px] tracking-[0.12em] italic leading-relaxed"
        style={{ color: 'var(--darker)', opacity: 0.6 }}
      >
        &ldquo;El verdadero entrenamiento no es aprender a jugar. Es aprender a no rendirse.&rdquo;
      </p>
      <p
        className="font-sharetm text-[8px] tracking-widest mt-2"
        style={{ color: 'var(--bronze)', opacity: 0.4 }}
      >
        — SISTEMA OASIS, 2089
      </p>
    </div>
  );
}
