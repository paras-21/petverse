'use client';

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { SPECIES, SPECIES_PALETTES } from '@/lib/pets';
import { PetModel, type AnimState } from './three/PetModel';

const IDLE: AnimState = { name: 'idle', id: 0 };
const COLS = 5;
const GAP = 1.25;

/** Every species side by side: for comparing looks and coats. */
export default function Gallery() {
  const [adult, setAdult] = useState(false);
  const [coat, setCoat] = useState(0);
  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-[960px] flex-col gap-4 px-4 py-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-lg">Pet gallery</h1>
        <div className="flex gap-2">
          <button className="btn h-11 px-4" onClick={() => setAdult((a) => !a)}>
            {adult ? 'Show babies' : 'Show adults'}
          </button>
          <button className="btn h-11 px-4" onClick={() => setCoat((c) => c + 1)}>
            Next coat
          </button>
        </div>
      </header>
      <div className="pixel-frame scene scene-sky aspect-[5/3] w-full">
        <Canvas shadows="soft" flat dpr={[1, 2]} camera={{ position: [0, 2.3, 6.3], fov: 38 }}>
          <hemisphereLight args={['#ffffff', '#bfe3b0', 1.7]} />
          <directionalLight position={[2.5, 5, 3]} intensity={1.35} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={4} shadow-camera-bottom={-4} />
          <directionalLight position={[-3, 2, -2]} intensity={0.45} color="#ffe7c2" />
          <directionalLight position={[0, 1.5, 4]} intensity={0.35} color="#fff6ee" />
          <OrbitControls target={[0, 0.6, 0]} enablePan={false} />
          <mesh rotation-x={-Math.PI / 2} receiveShadow>
            <circleGeometry args={[5, 64]} />
            <meshStandardMaterial color="#a4e38a" roughness={0.9} />
          </mesh>
          {SPECIES.map((sp, i) => {
            const pals = SPECIES_PALETTES[sp];
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            return (
              <PetModel
                key={sp}
                species={sp}
                palette={pals[coat % pals.length]}
                adult={adult}
                anim={IDLE}
                seed={i}
                position={[(col - (COLS - 1) / 2) * GAP, 0, (0.5 - row) * GAP * 1.1]}
              />
            );
          })}
        </Canvas>
      </div>
      <p className="text-base text-muted">
        Front row: {SPECIES.slice(0, COLS).join(', ')}. Back row: {SPECIES.slice(COLS).join(', ')}.
      </p>
    </main>
  );
}
