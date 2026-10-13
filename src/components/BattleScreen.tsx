'use client';

import { useEffect, useRef, useState } from 'react';
import { ADULT_LEVEL, useGame, type BattleReward } from '@/lib/store';
import { damage, hitChance, makeEnemy, maxHp } from '@/lib/battle';
import { sfx } from '@/lib/sfx';
import { PALETTES, type V3 } from '@/lib/pets';
import { Stage } from './three/Stage';
import { ANIM_MS, PetModel, type AnimName, type AnimState } from './three/PetModel';
import { Particles, type ParticlesHandle } from './three/Particles';
import { FloaterLayer, Icon, useFloaters, useTimers } from './ui';

type Side = 'me' | 'foe';
type Phase = 'intro' | 'ready' | 'busy' | 'won' | 'lost';

const POS: Record<Side, V3> = { me: [-1.35, 0, 0], foe: [1.35, 0, 0] };
const FACE = Math.PI / 2 - 0.55;
const SCREEN_X: Record<Side, number> = { me: 30, foe: 70 };

function HpCard({ name, level, hp, max, atk, def, color, align }: { name: string; level: number; hp: number; max: number; atk: number; def: number; color: string; align: 'left' | 'right' }) {
  const pct = (hp / max) * 100;
  const bar = pct > 50 ? 'var(--food)' : pct > 20 ? '#f5b83d' : 'var(--accent)';
  const right = align === 'right';
  return (
    <div className={`flex min-w-0 flex-1 flex-col gap-2 ${right ? 'items-end text-right' : ''}`}>
      <div className={`flex max-w-full items-center gap-2 ${right ? 'flex-row-reverse' : ''}`}>
        <span className="h-3 w-3 shrink-0" style={{ background: color }} />
        <span className="truncate font-display text-xs">{name}</span>
        <span className="shrink-0 bg-bg px-1.5 py-0.5 font-display text-[9px] text-muted">LV{level}</span>
      </div>
      <div className="h-3 w-full bg-line">
        <div
          className={`h-full transition-[width] duration-300 ${right ? 'ml-auto' : ''}`}
          style={{ width: `${pct}%`, background: bar }}
        />
      </div>
      <div className={`flex items-center gap-2 text-base font-semibold text-muted ${right ? 'flex-row-reverse' : ''}`}>
        <span className="whitespace-nowrap text-ink">
          {hp}/{max} HP
        </span>
        <span className="flex items-center gap-1 text-atk">
          <Icon name="bullseye" size={14} />
          {atk}
        </span>
        <span className="flex items-center gap-1 text-def">
          <Icon name="shield" size={14} />
          {def}
        </span>
      </div>
    </div>
  );
}

export function BattleScreen({ onExit }: { onExit: () => void }) {
  const pet = useGame((s) => s.pet)!;
  const battleEnd = useGame((s) => s.battleEnd);
  const [enemy] = useState(() => makeEnemy(pet));
  const [myMax] = useState(() => maxHp(pet.level));
  const [stats] = useState(() => ({ atk: pet.atk, def: pet.def, level: pet.level }));

  const { after, wait } = useTimers();
  const [floaters, addFloater] = useFloaters(after);
  const particles = useRef<ParticlesHandle>(null);

  const [hp, setHp] = useState<Record<Side, number>>({ me: myMax, foe: enemy.hp });
  const hpRef = useRef(hp);
  const [anims, setAnims] = useState<Record<Side, AnimState>>({ me: { name: 'idle', id: 0 }, foe: { name: 'pop', id: 1 } });
  const animId = useRef(10);
  const [phase, setPhase] = useState<Phase>('intro');
  const [log, setLog] = useState(`A wild ${enemy.name} appears!`);
  const [reward, setReward] = useState<BattleReward | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sfx.pop();
    after(() => setPhase('ready'), 900);
  }, [after]);

  function animate(side: Side, name: AnimName) {
    const id = ++animId.current;
    setAnims((a) => ({ ...a, [side]: { name, id } }));
    const ms = ANIM_MS[name];
    if (ms) after(() => setAnims((a) => (a[side].id === id ? { ...a, [side]: { name: 'idle', id: 0 } } : a)), ms);
  }

  const nameOf = (s: Side) => (s === 'me' ? pet.name : enemy.name);

  // one attack; returns true if the defender fainted
  async function strike(attacker: Side): Promise<boolean> {
    const defender: Side = attacker === 'me' ? 'foe' : 'me';
    const atk = attacker === 'me' ? stats.atk : enemy.atk;
    const def = attacker === 'me' ? enemy.def : stats.def;

    setLog(`${nameOf(attacker)} bonks!`);
    animate(attacker, 'attack');
    sfx.whoosh();
    await wait(320);

    const target = POS[defender];
    if (Math.random() >= hitChance(atk, def)) {
      animate(defender, 'dodge');
      sfx.miss();
      addFloater({ text: 'MISS', x: SCREEN_X[defender], y: 34, color: 'var(--muted)' });
      setLog(`${nameOf(defender)} dodged!`);
      await wait(600);
      return false;
    }

    const crit = Math.random() < 0.12;
    const dmg = damage(atk, crit);
    const left = Math.max(0, hpRef.current[defender] - dmg);
    hpRef.current = { ...hpRef.current, [defender]: left };
    setHp(hpRef.current);
    animate(defender, 'hit');
    if (crit) {
      sfx.crit();
      const el = stageRef.current;
      if (el) {
        el.classList.remove('shake');
        void el.offsetWidth; // restart the CSS animation
        el.classList.add('shake');
      }
    } else sfx.hit();
    particles.current?.burst({
      pos: [target[0], 0.7, target[2] + 0.2],
      colors: crit ? ['#ffcd75', '#ffffff', '#ef7d57'] : ['#ffffff', '#ffcd75'],
      count: crit ? 26 : 14,
      speed: crit ? 3 : 2,
      up: 2,
      size: 0.06,
      life: 0.8,
    });
    addFloater({ text: `-${dmg}`, x: SCREEN_X[defender], y: 30, color: crit ? 'var(--accent)' : 'var(--ink)', big: crit });
    if (crit) addFloater({ text: 'CRIT!', x: SCREEN_X[defender], y: 18, color: '#e0a21b' });
    setLog(crit ? `Critical bonk! -${dmg}` : `${nameOf(defender)} took ${dmg}`);
    await wait(650);
    return left <= 0;
  }

  function finish(won: boolean) {
    const loser: Side = won ? 'foe' : 'me';
    const winner: Side = won ? 'me' : 'foe';
    animate(loser, 'faint');
    after(() => animate(winner, 'win'), 500);
    const r = battleEnd(won, enemy.level);
    setReward(r);
    setPhase(won ? 'won' : 'lost');
    setLog(won ? `${enemy.name} fainted!` : `${pet.name} fainted...`);
    after(() => (won ? sfx.win() : sfx.lose()), 400);
    if (won) {
      after(() => particles.current?.burst({ pos: [POS.me[0], 1.2, 0], colors: ['#ffd27a', '#8cc8ff', '#ffa8c5', '#8fdcb0'], count: 40, speed: 2, up: 3, size: 0.06, life: 1.4 }), 600);
    }
    if (r.lvl.levelUp) after(() => sfx.levelUp(), 1600);
  }

  async function bonk() {
    if (phase !== 'ready') return;
    setPhase('busy');
    if (await strike('me')) return finish(true);
    await wait(250);
    if (await strike('foe')) return finish(false);
    setLog('Your turn!');
    setPhase('ready');
  }

  const done = phase === 'won' || phase === 'lost';
  const chance = Math.round(hitChance(stats.atk, enemy.def) * 100);

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-[440px] flex-col gap-4 px-4 pb-6 pt-5">
      <section className="card flex items-start gap-3 p-4">
        <HpCard name={pet.name} level={stats.level} hp={hp.me} max={myMax} atk={stats.atk} def={stats.def} color={PALETTES[pet.palette].main} align="left" />
        <span className="self-center font-display text-xs text-accent">VS</span>
        <HpCard name={enemy.name} level={enemy.level} hp={hp.foe} max={enemy.hp} atk={enemy.atk} def={enemy.def} color={PALETTES[enemy.palette].main} align="right" />
      </section>

      <div ref={stageRef} className="pixel-frame scene scene-dusk aspect-[4/3] w-full">
        <Stage variant="arena">
          <PetModel
            species={pet.species}
            palette={pet.palette}
            adult={pet.level >= ADULT_LEVEL}
            anim={anims.me}
            position={POS.me}
            facing={FACE}
            dir={[1, 0]}
            lunge={1.4}
            seed={pet.seed}
          />
          <PetModel
            species={enemy.species}
            palette={enemy.palette}
            adult={enemy.level >= ADULT_LEVEL}
            anim={anims.foe}
            position={POS.foe}
            facing={-FACE}
            dir={[-1, 0]}
            lunge={1.4}
            seed={enemy.seed}
          />
          <Particles ref={particles} />
        </Stage>
        <FloaterLayer list={floaters} />
        {done && reward && (
          <div className="absolute inset-0 grid place-items-center bg-ink/30">
            <div className="card pop-in flex min-w-[220px] flex-col items-center gap-2 px-7 py-6 text-center">
              <span className={phase === 'won' ? 'text-[#e0a21b]' : 'text-muted'}>
                <Icon name="trophy" size={48} />
              </span>
              <p className="font-display text-base">{phase === 'won' ? 'YOU WIN!' : 'YOU LOST'}</p>
              <div className="mt-1 flex gap-4 text-xl font-semibold">
                <span className="text-def">+{reward.xp} XP</span>
                <span className={reward.points >= 0 ? 'text-food' : 'text-accent'}>
                  {reward.points > 0 ? '+' : ''}
                  {reward.points} PTS
                </span>
              </div>
              {reward.lvl.levelUp && <p className="blink font-display text-xs text-accent">LEVEL {reward.lvl.level}!</p>}
            </div>
          </div>
        )}
      </div>

      <p className="min-h-[1.5em] text-center text-xl font-semibold text-ink" aria-live="polite">
        {log}
      </p>

      {done ? (
        <button
          className="btn btn-primary h-14"
          onClick={() => {
            sfx.click();
            onExit();
          }}
        >
          BACK HOME
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-[1fr_auto] gap-3">
            <button className="btn btn-primary h-14" onClick={bonk} disabled={phase !== 'ready'}>
              <Icon name="zap" size={24} />
              BONK!
            </button>
            <button
              className="btn btn-ghost h-14 px-5"
              onClick={() => {
                sfx.click();
                onExit();
              }}
              disabled={phase !== 'ready'}
            >
              RUN
            </button>
          </div>
          <p className="text-center text-lg font-medium text-muted">{chance}% chance to hit</p>
        </div>
      )}
    </main>
  );
}
