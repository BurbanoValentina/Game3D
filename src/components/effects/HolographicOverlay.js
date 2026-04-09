'use client';

export default function HolographicOverlay() {
  return (
    <>
      {/* Radial glow spots */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: `
          radial-gradient(ellipse at 20% 50%, rgba(255,97,216,0.03) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgba(97,255,216,0.03) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 80%, rgba(216,97,255,0.03) 0%, transparent 50%)
        `,
      }} />

      {/* Holographic shimmer band */}
      <div className="fixed inset-0 pointer-events-none z-0 holo-shimmer" style={{ opacity: 0.4 }} />

      {/* Subtle grid */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: `
          linear-gradient(rgba(255,0,102,0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,0,102,0.015) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />
    </>
  );
}
