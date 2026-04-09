'use client';

import dynamic from 'next/dynamic';

// Carga dinámica sin SSR (Three.js necesita window)
const GameApp = dynamic(() => import('../components/game/GameApp'), {
  ssr: false,
  loading: () => <LoadingFallback />,
});

function LoadingFallback() {
  return (
    <div className="fixed inset-0 space-light-bg flex items-center justify-center">
      <div className="text-center">
        <div className="mb-6">
          <span className="font-orbitron text-4xl tracking-[0.3em] text-oasis-bronze">
            OASIS
          </span>
        </div>
        <div className="w-64 h-1 bg-oasis-sand rounded-full overflow-hidden mx-auto">
          <div
            className="h-full rounded-full animate-corruption"
            style={{
              width: '60%',
              background: 'linear-gradient(90deg, #00f0ff, #FF61D8, #61FFD8)',
              backgroundSize: '200% 100%',
            }}
          />
        </div>
        <p className="mt-4 font-sharetm text-xs tracking-widest text-oasis-taupe">
          INICIALIZANDO SISTEMAS...
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  return <GameApp />;
}
