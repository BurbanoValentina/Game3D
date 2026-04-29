export default function TrainingRoomHeader({ visible }) {
  return (
    <div
      className={`text-center mt-6 mb-2 transition-all duration-800 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <div className="flex items-center justify-center gap-3 mb-2" />
      <h1
        className="font-orbitron text-2xl md:text-3xl tracking-[0.25em] font-bold"
        style={{ color: 'var(--dark)' }}
      >
        SISTEMA DE MÓDULOS
      </h1>
      <div
        className="w-40 h-[2px] mx-auto mt-3"
        style={{
          background: 'linear-gradient(90deg, transparent, #00F0FF, #FF61D8, #FFBB33, transparent)',
        }}
      />
    </div>
  );
}
