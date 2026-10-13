import { randomPalette, SPECIES, type Species } from './pets';
import type { Pet } from './store';

export interface Enemy {
  name: string;
  species: Species;
  palette: number;
  level: number;
  atk: number;
  def: number;
  hp: number;
  seed: number;
}

const NAMES = ['Bonky', 'Grub', 'Mochi', 'Zappy', 'Nugget', 'Pixel', 'Chomp', 'Biscuit', 'Gizmo', 'Turbo', 'Pebble', 'Fizz'];

const randInt = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));
const pick = <T,>(a: T[]) => a[randInt(0, a.length - 1)];

export const maxHp = (level: number) => 60 + level * 12;

export function makeEnemy(p: Pet): Enemy {
  const level = Math.max(1, p.level + randInt(-1, 1));
  const power = 10 + (level - 1) * 2.2;
  const species = pick(SPECIES);
  return {
    name: pick(NAMES),
    species,
    palette: randomPalette(species),
    level,
    atk: Math.max(5, Math.round(power + randInt(-2, 3))),
    def: Math.max(5, Math.round(power + randInt(-2, 3))),
    hp: maxHp(level),
    seed: Math.random() * 10,
  };
}

// Same rule as FrenPet: chance = ATK / (ATK + DEF)
export const hitChance = (atk: number, def: number) => atk / (atk + def);

export function damage(atk: number, crit: boolean) {
  const base = 12 + atk * 0.6;
  return Math.round(base * (0.85 + Math.random() * 0.3) * (crit ? 1.6 : 1));
}
