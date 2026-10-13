'use client';

import { useEffect, useRef, useState } from 'react';
import { ADULT_LEVEL, battleBlocker, useGame, xpNeed, type LevelInfo } from '@/lib/store';
import { sfx } from '@/lib/sfx';
import { Stage, Shroom } from './three/Stage';
import { ANIM_MS, PetModel, type AnimName, type AnimState } from './three/PetModel';
import { Particles, type ParticlesHandle } from './three/Particles';
import { FloaterLayer, Icon, StatBar, Toast, useFloaters, useTimers } from './ui';

const CONFETTI = ['#ffd27a', '#8cc8ff', '#ffa8c5', '#8fdcb0', '#c4a8f0'];

export function HomeScreen({ onBattle }: { onBattle: () => void }) {
  const pet = useGame((s) => s.pet)!;
  const muted = useGame((s) => s.muted);
  const { feed, play, pat, toggleSleep, train, rename, reset, setMuted } = useGame.getState();

  const { after } = useTimers();
  const [floaters, addFloater] = useFloaters(after);
  const particles = useRef<ParticlesHandle>(null);

  const [oneShot, setOneShot] = useState<AnimState | null>(null);
  const [eatId, setEatId] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [holdBaby, setHoldBaby] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const animId = useRef(10);
  const toastId = useRef(0);

  useEffect(() => after(() => setShowHint(false), 6000), [after]);

  const busy = oneShot !== null;
  const adult = pet.level >= ADULT_LEVEL && !holdBaby;
  const baseAnim: AnimName = pet.sleeping ? 'sleep' : pet.hunger < 25 ? 'hungry' : 'idle';
  const anim: AnimState = oneShot ?? { name: baseAnim, id: 0 };

  function playAnim(name: AnimName, ms = ANIM_MS[name]) {
    const id = ++animId.current;
    setOneShot({ name, id });
    after(() => setOneShot((cur) => (cur?.id === id ? null : cur)), ms);
  }

  function say(text: string) {
    const id = ++toastId.current;
    setToast(text);
    after(() => {
      if (toastId.current === id) setToast(null);
    }, 1600);
  }

  function fail(msg?: string) {
    sfx.error();
    if (msg) say(msg);
  }

  function celebrate(lvl: LevelInfo | undefined, delay: number) {
    if (!lvl?.levelUp) return;
    after(() => {
      sfx.levelUp();
      addFloater({ text: `LEVEL ${lvl.level}!`, x: 50, y: 22, color: 'var(--accent)', big: true });
      particles.current?.burst({ pos: [0, 1.2, 0], colors: CONFETTI, count: 40, speed: 2, up: 3, size: 0.06, life: 1.4 });
      if (lvl.evolved) {
        setHoldBaby(true);
        after(() => {
          sfx.evolve();
          say('It evolved!');
          playAnim('evolve');
          after(() => {
            setHoldBaby(false);
            particles.current?.burst({ pos: [0, 0.9, 0], colors: ['#fff2a0', '#ffffff', '#ffcd75'], count: 60, speed: 3, up: 3, size: 0.08, life: 1.5 });
          }, 1100);
        }, 900);
      }
    }, delay);
  }

  function onFeed() {
    if (busy) return;
    const r = feed();
    if (!r.ok) return fail(r.msg);
    playAnim('eat');
    setEatId((i) => i + 1);
    [300, 900, 1500].forEach((ms) =>
      after(() => {
        sfx.bite();
        particles.current?.burst({ pos: [0, 0.35, 0.75], colors: ['#e04848', '#f4f4f4'], count: 7, speed: 1.2, up: 1.6, size: 0.045, life: 0.7 });
      }, ms),
    );
    after(() => addFloater({ text: '+FOOD', x: 50, y: 30, color: 'var(--food)' }), 1600);
  }

  function onPlay() {
    if (busy) return;
    const r = play();
    if (!r.ok) return fail(r.msg);
    playAnim('happy');
    sfx.happy();
    particles.current?.burst({ pos: [0, 1.2, 0.2], colors: ['#ffa8c5', '#ff7fa8', '#ffd9e6'], count: 16, speed: 1.2, up: 2.5, gravity: 2, size: 0.07, life: 1.3 });
    addFloater({ text: '+JOY', x: 50, y: 30, color: 'var(--joy)' });
  }

  function onTrain() {
    if (busy) return;
    const r = train();
    if (!r.ok) return fail(r.msg);
    playAnim('train');
    sfx.train();
    after(() => {
      sfx.gain();
      addFloater({ text: `+${r.amount} ${r.stat}`, x: 50, y: 26, color: r.stat === 'ATK' ? 'var(--atk)' : 'var(--def)', big: true });
      particles.current?.burst({ pos: [0, 0.8, 0], colors: ['#ffcd75', '#ffffff'], count: 20, speed: 2.2, up: 2, size: 0.05 });
    }, 1150);
    celebrate(r.lvl, 1500);
  }

  function onSleep() {
    if (busy) return;
    const asleep = toggleSleep();
    if (asleep) sfx.sleep();
    else sfx.wake();
    say(asleep ? 'Good night...' : 'Good morning!');
  }

  function onPat() {
    if (busy) return;
    if (pet.sleeping) return say('Zzz...');
    pat();
    playAnim('happy');
    sfx.happy();
    particles.current?.burst({ pos: [0, 1.2, 0.2], colors: ['#f592b8', '#ffd1e3'], count: 8, speed: 1, up: 2, gravity: 2, size: 0.06 });
  }

  function onBattleClick() {
    if (busy) return;
    const block = battleBlocker(pet);
    if (block) return fail(block);
    sfx.click();
    onBattle();
  }

  const need = xpNeed(pet.level);
  const xpPct = Math.min(100, (pet.xp / need) * 100);

  const actions = [
    { label: 'Feed', color: 'var(--food)', icon: 'cake', fn: onFeed },
    { label: 'Play', color: 'var(--joy)', icon: 'mood-happy', fn: onPlay },
    { label: 'Train', color: 'var(--atk)', icon: 'human-run', fn: onTrain },
    pet.sleeping
      ? { label: 'Wake', color: '#d99a12', icon: 'sun', fn: onSleep }
      : { label: 'Sleep', color: '#6f63c9', icon: 'moon', fn: onSleep },
  ];

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-[440px] flex-col gap-4 px-4 pb-8 pt-5">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {editing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const v = new FormData(e.currentTarget).get('name');
                rename(String(v ?? '').trim());
                setEditing(false);
              }}
            >
              <input
                name="name"
                defaultValue={pet.name}
                maxLength={12}
                autoFocus
                onBlur={(e) => {
                  rename(e.target.value.trim());
                  setEditing(false);
                }}
                aria-label="Pet name"
                className="chip w-full max-w-[220px] font-display text-base text-ink outline-none"
              />
            </form>
          ) : (
            <button onClick={() => setEditing(true)} className="flex max-w-full items-center gap-2 text-left" title="Rename">
              <span className="truncate font-display text-lg leading-tight">{pet.name}</span>
              <Icon name="edit" size={18} className="text-muted" />
            </button>
          )}
          <div className="mt-3 flex items-center gap-2">
            <span className="bg-accent px-2 py-0.5 font-display text-[10px] text-white">LV{pet.level}</span>
            <div className="flex h-3 w-24 gap-[2px]" aria-label={`${pet.xp} of ${need} xp`}>
              {Array.from({ length: 8 }, (_, i) => (
                <span key={i} className="flex-1" style={{ background: i < Math.round(xpPct / 12.5) ? 'var(--accent)' : 'var(--line)' }} />
              ))}
            </div>
            <span className="text-base font-semibold text-muted">
              {pet.xp}/{need} XP
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div className="chip" aria-label={`${pet.points} points`}>
            <span className="text-[#e0a21b]">
              <Icon name="coin" size={20} />
            </span>
            <span className="font-display text-xs">{pet.points}</span>
          </div>
          <button
            aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
            className="chip h-9 w-9 justify-center text-muted"
            onClick={() => {
              setMuted(!muted);
              if (muted) sfx.click();
            }}
          >
            <Icon name={muted ? 'volume-x' : 'volume-2'} size={20} />
          </button>
        </div>
      </header>

      <div className="pixel-frame scene scene-sky aspect-square w-full cursor-grab select-none active:cursor-grabbing">
        <Stage variant="island">
          <PetModel species={pet.species} palette={pet.palette} adult={adult} anim={anim} seed={pet.seed} onTap={onPat} />
          {oneShot?.name === 'eat' && <Shroom key={eatId} position={[0, 0, 0.62]} />}
          <Particles ref={particles} />
        </Stage>
        {showHint && (
          <span className="chip pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 whitespace-nowrap text-base font-semibold text-muted">
            Drag to look. Tap {pet.name}!
          </span>
        )}
        {pet.sleeping && (
          <>
            <span className="zzz text-base" style={{ left: '55%', top: '36%' }}>Z</span>
            <span className="zzz text-xs" style={{ left: '57%', top: '36%', animationDelay: '0.8s' }}>z</span>
            <span className="zzz text-lg" style={{ left: '54%', top: '36%', animationDelay: '1.6s' }}>Z</span>
          </>
        )}
        <FloaterLayer list={floaters} />
        <Toast text={toast} />
      </div>

      <section className="card flex flex-col gap-3 p-4">
        <StatBar label="Food" value={pet.hunger} color="var(--food)" icon="cake" />
        <StatBar label="Energy" value={pet.energy} color="var(--energy)" icon="zap" />
        <StatBar label="Joy" value={pet.joy} color="var(--joy)" icon="heart" />
        <div className="mt-1 flex justify-around border-t-4 border-dotted border-line pt-3">
          <span className="flex items-center gap-2 font-display text-xs text-atk" aria-label={`Attack ${pet.atk}`}>
            <Icon name="bullseye" size={22} /> ATK {pet.atk}
          </span>
          <span className="flex items-center gap-2 font-display text-xs text-def" aria-label={`Defense ${pet.def}`}>
            <Icon name="shield" size={22} /> DEF {pet.def}
          </span>
        </div>
      </section>

      <nav className="grid grid-cols-4 gap-2" aria-label="Care">
        {actions.map((a) => (
          <button key={a.label} className="action" onClick={a.fn} disabled={busy}>
            <span className="action-icon" style={{ background: `color-mix(in srgb, ${a.color} 16%, white)`, color: a.color }}>
              <Icon name={a.icon} size={28} />
            </span>
            {a.label}
          </button>
        ))}
      </nav>

      <button className="btn btn-primary h-14" onClick={onBattleClick} disabled={busy}>
        <Icon name="gamepad" size={24} />
        BATTLE!
      </button>

      <button
        onClick={() => {
          if (!confirmReset) {
            setConfirmReset(true);
            after(() => setConfirmReset(false), 3000);
            return;
          }
          reset();
        }}
        className={`mx-auto text-lg font-semibold ${confirmReset ? 'text-accent' : 'text-muted hover:text-ink'}`}
      >
        {confirmReset ? 'Tap again to start over' : 'Start a new egg'}
      </button>
    </main>
  );
}
