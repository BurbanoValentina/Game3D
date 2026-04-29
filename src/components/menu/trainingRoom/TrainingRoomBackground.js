export default function TrainingRoomBackground() {
  return (
    <>
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,0,102,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,102,0.015) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 10%, rgba(0,240,255,0.03) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(255,0,102,0.02) 0%, transparent 40%)',
        }}
      />

      {/* Scanlines */}
      <div
        className="fixed inset-0 pointer-events-none z-20"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,0,102,0.006) 0px, rgba(255,0,102,0.006) 1px, transparent 1px, transparent 4px)',
        }}
      />
    </>
  );
}
