import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { randomPalette, SPECIES, type Species } from './pets';

export const EGG_TAPS = 6;
export const ADULT_LEVEL = 3;
export const xpNeed = (level: number) => 40 + level * 30;

export interface Pet {
  name: string;
  species: Species;
  palette: number;
  seed: number;
  level: number;
  xp: number;
  atk: number;
  def: number;
  points: number;
  hunger: number;
  energy: number;
  joy: number;
  sleeping: boolean;
  wins: number;
  losses: number;
  born: number;
}

export interface Egg {
  species: Species;
  palette: number;
  taps: number;
}

export interface LevelInfo {
  levelUp: boolean;
  evolved: boolean;
  level: number;
}

export interface ActionResult {
  ok: boolean;
  msg?: string;
}

export interface TrainResult extends ActionResult {
  stat?: 'ATK' | 'DEF';
  amount?: number;
  lvl?: LevelInfo;
}

export interface BattleReward {
  xp: number;
  points: number;
  lvl: LevelInfo;
}

interface GameState {
  egg: Egg;
  pet: Pet | null;
  lastTick: number;
  muted: boolean;
  tapEgg: () => number;
  hatch: (name: string) => void;
  feed: () => ActionResult;
  play: () => ActionResult;
  pat: () => void;
  toggleSleep: () => boolean;
  train: () => TrainResult;
  battleEnd: (win: boolean, enemyLevel: number) => BattleReward;
  tick: () => void;
  rename: (name: string) => void;
  reset: () => void;
  setMuted: (m: boolean) => void;
}

const randInt = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));
const clamp = (v: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));

function newEgg(): Egg {
  const species = SPECIES[randInt(0, SPECIES.length - 1)];
  return { species, palette: randomPalette(species), taps: 0 };
}

function gainXp(p: Pet, amount: number): [Pet, LevelInfo] {
  let { level, xp, atk, def } = p;
  const wasAdult = level >= ADULT_LEVEL;
  xp += amount;
  let levelUp = false;
  while (xp >= xpNeed(level)) {
    xp -= xpNeed(level);
    level++;
    atk++;
    def++;
    levelUp = true;
  }
  return [{ ...p, level, xp, atk, def }, { levelUp, evolved: !wasAdult && level >= ADULT_LEVEL, level }];
}

export function battleBlocker(p: Pet): string | null {
  if (p.sleeping) return 'Shh... sleeping';
  if (p.hunger < 15) return 'Too hungry to fight!';
  if (p.energy < 15) return 'Too tired to fight!';
  return null;
}

export const useGame = create<GameState>()(
  persist(
    (set, get) => {
      const patch = (fn: (p: Pet) => Pet) => {
        const p = get().pet;
        if (p) set({ pet: fn(p) });
      };

      return {
        egg: newEgg(),
        pet: null,
        lastTick: Date.now(),
        muted: false,

        tapEgg: () => {
          const taps = Math.min(EGG_TAPS, get().egg.taps + 1);
          set({ egg: { ...get().egg, taps } });
          return taps;
        },

        hatch: (name) => {
          const { egg } = get();
          set({
            pet: {
              name: name.slice(0, 12) || 'Bit',
              species: egg.species,
              palette: egg.palette,
              seed: Math.random() * 10,
              level: 1,
              xp: 0,
              atk: 10,
              def: 10,
              points: 0,
              hunger: 70,
              energy: 80,
              joy: 70,
              sleeping: false,
              wins: 0,
              losses: 0,
              born: Date.now(),
            },
            lastTick: Date.now(),
          });
        },

        feed: () => {
          const p = get().pet;
          if (!p) return { ok: false };
          if (p.sleeping) return { ok: false, msg: 'Shh... sleeping' };
          if (p.hunger >= 95) return { ok: false, msg: 'Not hungry!' };
          const [next] = gainXp({ ...p, hunger: clamp(p.hunger + 30), joy: clamp(p.joy + 5) }, 5);
          set({ pet: next });
          return { ok: true };
        },

        play: () => {
          const p = get().pet;
          if (!p) return { ok: false };
          if (p.sleeping) return { ok: false, msg: 'Shh... sleeping' };
          if (p.energy < 10) return { ok: false, msg: 'Too tired...' };
          const [next] = gainXp(
            { ...p, joy: clamp(p.joy + 20), energy: clamp(p.energy - 10), hunger: clamp(p.hunger - 5) },
            5,
          );
          set({ pet: next });
          return { ok: true };
        },

        pat: () => patch((p) => ({ ...p, joy: clamp(p.joy + 2) })),

        toggleSleep: () => {
          const p = get().pet;
          if (!p) return false;
          set({ pet: { ...p, sleeping: !p.sleeping } });
          return !p.sleeping;
        },

        train: () => {
          const p = get().pet;
          if (!p) return { ok: false };
          if (p.sleeping) return { ok: false, msg: 'Shh... sleeping' };
          if (p.energy < 20) return { ok: false, msg: 'Need 20 energy' };
          if (p.hunger < 10) return { ok: false, msg: 'Too hungry!' };
          const r = Math.random();
          const amount = r < 0.6 ? 1 : r < 0.9 ? 2 : 3;
          const stat: 'ATK' | 'DEF' = Math.random() < 0.5 ? 'ATK' : 'DEF';
          const trained = {
            ...p,
            energy: clamp(p.energy - 20),
            hunger: clamp(p.hunger - 8),
            atk: p.atk + (stat === 'ATK' ? amount : 0),
            def: p.def + (stat === 'DEF' ? amount : 0),
          };
          const [next, lvl] = gainXp(trained, 10);
          set({ pet: next });
          return { ok: true, stat, amount, lvl };
        },

        battleEnd: (win, enemyLevel) => {
          const p = get().pet!;
          const xp = win ? 25 + enemyLevel * 5 : 8;
          const points = win ? 40 + enemyLevel * 15 + randInt(0, 30) : -Math.min(p.points, 20 + enemyLevel * 5);
          const [next, lvl] = gainXp(
            {
              ...p,
              points: p.points + points,
              hunger: clamp(p.hunger - 12),
              energy: clamp(p.energy - 15),
              joy: clamp(p.joy + (win ? 10 : -8)),
              wins: p.wins + (win ? 1 : 0),
              losses: p.losses + (win ? 0 : 1),
            },
            xp,
          );
          set({ pet: next });
          return { xp, points, lvl };
        },

        tick: () => {
          const now = Date.now();
          const mins = Math.min((now - get().lastTick) / 60000, 60 * 24 * 7);
          const p = get().pet;
          if (!p) {
            set({ lastTick: now });
            return;
          }
          set({
            lastTick: now,
            pet: {
              ...p,
              hunger: clamp(p.hunger - mins * 0.5),
              joy: clamp(p.joy - mins * 0.35),
              energy: clamp(p.sleeping ? p.energy + mins * 6 : p.energy - mins * 0.3),
            },
          });
        },

        rename: (name) => patch((p) => ({ ...p, name: name.slice(0, 12) || p.name })),
        reset: () => set({ pet: null, egg: newEgg(), lastTick: Date.now() }),
        setMuted: (muted) => set({ muted }),
      };
    },
    { name: 'petverse-pet', version: 1 },
  ),
);
