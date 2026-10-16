'use client';

import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { BACKS, COSMETIC_LABEL, FACES, HANDS, HATS, NECKS, type Loadout } from '@/lib/cosmetics';
import { SPECIES, SPECIES_PALETTES } from '@/lib/pets';
import { PetModel, type AnimState } from './three/PetModel';

const IDLE: AnimState = { name: 'idle', id: 0 };
const COLS = 5;
const GAP = 1.25;

const SLOTS = { hat: HATS, face: FACES, neck: NECKS, back: BACKS, hand: HANDS } as const;
type Slot = keyof typeof SLOTS;
const SLOT_NAMES: Slot[] = ['hat', 'face', 'neck', 'back', 'hand'];
const SLOT_LABEL: Record<Slot, string> = { hat: 'Hat', face: 'Face', neck: 'Neck', back: 'Back', hand: 'Hand' };

const pick = (slot: Slot, n: number) => SLOTS[slot][((n % SLOTS[slot].length) + SLOTS[slot].length) % SLOTS[slot].length];
const loadoutOf = (n: Record<Slot, number>) =>
  ({ hat: pick('hat', n.hat), face: pick('face', n.face), neck: pick('neck', n.neck), back: pick('back', n.back), hand: pick('hand', n.hand) }) as Loadout;

/** Mix mode: every pet wears a different combo (shift reshuffles), so many items show at once. */
const mixFor = (i: number, shift: number) =>
  loadoutOf({ hat: 1 + ((i * 3 + shift) % (HATS.length - 1)), face: i + shift, neck: i * 2 + shift + 1, back: i + shift * 2 + 1, hand: i + shift + 1 });

/** Every species side by side: for comparing looks, coats and cosmetics. */
export default function Gallery() {
  const [adult, setAdult] = useState(false);
  const [coat, setCoat] = useState(0);
  const [worn, setWorn] = useState<Record<Slot, number>>({ hat: 0, face: 0, neck: 0, back: 0, hand: 0 });
  const [mix, setMix] = useState<number | null>(null);
  const [turn, setTurn] = useState(0); // degrees; 150 shows backs (wings, capes)
  // ?adult=1&mix=0&hat=2&face=1&neck=1&back=1&hand=1 opens a preset view (handy for screenshots and sharing)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const n = (k: string) => Number(q.get(k) ?? 0) || 0;
    setAdult(q.get('adult') === '1');
    setMix(q.has('mix') ? n('mix') : null);
    setTurn(n('turn'));
    setWorn({ hat: n('hat'), face: n('face'), neck: n('neck'), back: n('back'), hand: n('hand') });
  }, []);
  const look = loadoutOf(worn);
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
        <div className="flex w-full flex-wrap gap-2">
          {SLOT_NAMES.map((slot) => (
            <button
              key={slot}
              className="btn h-11 px-4"
              onClick={() => {
                setMix(null);
                setWorn((w) => ({ ...w, [slot]: w[slot] + 1 }));
              }}
            >
              {SLOT_LABEL[slot]}: {COSMETIC_LABEL[look[slot]]}
            </button>
          ))}
          <button className="btn h-11 px-4" onClick={() => setMix((v) => (v === null ? 0 : v + 1))}>
            {mix === null ? 'Mix all' : 'Shuffle mix'}
          </button>
          <button className="btn h-11 px-4" onClick={() => setTurn((t) => (t ? 0 : 150))}>
            {turn ? 'Turn front' : 'Turn around'}
          </button>
          <button className="btn h-11 px-4" onClick={() => { setMix(null); setWorn({ hat: 0, face: 0, neck: 0, back: 0, hand: 0 }); }}>
            Clear
          </button>
        </div>
        {adult || <p className="w-full text-base text-muted">Babies have no hands, so held items show on adults (and penguins).</p>}
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
                facing={(turn * Math.PI) / 180}
                loadout={mix === null ? look : mixFor(i, mix)}
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
