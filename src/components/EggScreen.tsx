'use client';

import { useRef, useState } from 'react';
import { EGG_TAPS, useGame } from '@/lib/store';
import { PALETTES } from '@/lib/pets';
import { sfx } from '@/lib/sfx';
import { Stage } from './three/Stage';
import { EggModel, Nest } from './three/EggModel';
import { PetModel, type AnimState } from './three/PetModel';
import { Particles, type ParticlesHandle } from './three/Particles';
import { useTimers } from './ui';

const NAME_IDEAS = ['Bit', 'Pip', 'Nibbles', 'Voxie', 'Tofu', 'Pixel', 'Bloop', 'Sprout'];

export function EggScreen() {
  const egg = useGame((s) => s.egg);
  const tapEgg = useGame((s) => s.tapEgg);
  const hatch = useGame((s) => s.hatch);
  const { after } = useTimers();
  const particles = useRef<ParticlesHandle>(null);

  const [phase, setPhase] = useState<'egg' | 'hatching' | 'naming'>(egg.taps >= EGG_TAPS ? 'naming' : 'egg');
  const [tapId, setTapId] = useState(0);
  const [anim, setAnim] = useState<AnimState>({ name: 'idle', id: 0 });
  const [flashId, setFlashId] = useState(0);
  const [name, setName] = useState(() => NAME_IDEAS[Math.floor(Math.random() * NAME_IDEAS.length)]);

  const pal = PALETTES[egg.palette];

  function onTap() {
    if (phase !== 'egg') return;
    const taps = tapEgg();
    setTapId((i) => i + 1);
    if (taps < EGG_TAPS) {
      if (taps >= 2) sfx.crack();
      else sfx.tap();
      if (taps >= 2) particles.current?.burst({ pos: [0, 0.8, 0.5], colors: ['#fff4dd', pal.main], count: 5, speed: 1, up: 2, size: 0.05 });
      return;
    }
    sfx.hatch();
    setFlashId((i) => i + 1);
    particles.current?.burst({ pos: [0, 0.7, 0], colors: ['#fff4dd', '#f0dfc0', pal.main], count: 70, speed: 3, up: 4, size: 0.1, life: 1.6 });
    setPhase('hatching');
    setAnim({ name: 'pop', id: 1 });
    after(() => {
      setAnim({ name: 'happy', id: 2 });
      sfx.happy();
      particles.current?.burst({ pos: [0, 1.2, 0], colors: ['#ffd27a', '#8cc8ff', '#ffa8c5', '#8fdcb0'], count: 40, speed: 2, up: 3, size: 0.06, life: 1.4 });
    }, 800);
    after(() => {
      setAnim({ name: 'idle', id: 3 });
      setPhase('naming');
    }, 2000);
  }

  function confirmName() {
    sfx.levelUp();
    hatch(name.trim());
  }

  const left = EGG_TAPS - egg.taps;

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-[440px] flex-col gap-5 px-4 pb-6 pt-6">
      <header>
        <h1 className="font-display text-2xl text-ink">PETVERSE</h1>
        <p className="mt-3 text-xl font-medium text-muted">
          {phase === 'naming' ? 'Say hello to your new friend.' : 'Something is wiggling inside this egg.'}
        </p>
      </header>

      <div
        role="button"
        tabIndex={0}
        aria-label="Tap the egg"
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onTap()}
        className="pixel-frame scene scene-sky aspect-square w-full cursor-grab select-none active:cursor-grabbing"
      >
        <Stage variant="island">
          <Nest />
          {phase === 'egg' ? (
            <EggModel palette={egg.palette} cracks={egg.taps / EGG_TAPS} tapId={tapId} onTap={onTap} />
          ) : (
            <PetModel species={egg.species} palette={egg.palette} adult={false} anim={anim} />
          )}
          <Particles ref={particles} />
        </Stage>
        {flashId > 0 && <div key={flashId} className="flash pointer-events-none absolute inset-0 bg-white" />}
        {phase === 'egg' && (
          <div className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center">
            <span className="chip nudge px-3 py-2 font-display text-xs text-ink">
              {egg.taps === 0 ? 'TAP THE EGG!' : `${left} MORE ${left === 1 ? 'TAP' : 'TAPS'}`}
            </span>
          </div>
        )}
        {phase === 'hatching' && (
          <div className="pointer-events-none absolute inset-x-0 top-5 flex justify-center">
            <span className="chip pop-in px-3 py-2 font-display text-sm text-accent">IT HATCHED!</span>
          </div>
        )}
      </div>

      {phase === 'egg' && (
        <div className="flex justify-center gap-2" aria-label={`${egg.taps} of ${EGG_TAPS} taps`}>
          {Array.from({ length: EGG_TAPS }, (_, i) => (
            <span
              key={i}
              className="h-4"
              style={{ width: 16, background: i < egg.taps ? 'var(--accent)' : 'var(--line)' }}
            />
          ))}
        </div>
      )}

      {phase === 'naming' && (
        <form
          className="card pop-in flex flex-col gap-3 p-5"
          onSubmit={(e) => {
            e.preventDefault();
            confirmName();
          }}
        >
          <label htmlFor="pet-name" className="font-display text-xs text-ink">
            NAME YOUR PET
          </label>
          <input
            id="pet-name"
            value={name}
            maxLength={12}
            autoFocus
            onChange={(e) => setName(e.target.value)}
            className="bg-bg px-4 py-3 text-2xl font-semibold text-ink outline-none ring-accent focus:ring-4"
          />
          <button type="submit" className="btn btn-primary mt-2 h-14">
            START!
          </button>
        </form>
      )}
    </main>
  );
}
