'use client';

import dynamic from 'next/dynamic';

// three.js + localStorage state: client only
const Game = dynamic(() => import('@/components/Game'), {
  ssr: false,
  loading: () => (
    <div className="grid min-h-dvh place-items-center text-xs text-mist">
      <span className="blink">LOADING...</span>
    </div>
  ),
});

export default function Page() {
  return <Game />;
}
