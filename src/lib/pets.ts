export type V3 = [number, number, number];

export type Species =
  | 'blob'
  | 'pup'
  | 'drako'
  | 'cat'
  | 'bunny'
  | 'bear'
  | 'frog'
  | 'penguin'
  | 'fox'
  | 'hamster';
export const SPECIES: Species[] = ['blob', 'pup', 'drako', 'cat', 'bunny', 'bear', 'frog', 'penguin', 'fox', 'hamster'];

export interface Palette {
  name: string;
  main: string;
  dark: string;
  light: string;
  belly: string;
  accent: string;
}

export const PALETTES: Palette[] = [
  // 0-5: candy pastels
  { name: 'Peach', main: '#ffb08a', dark: '#e07a62', light: '#ffe0bf', belly: '#fff5ea', accent: '#ffd06e' },
  { name: 'Sky', main: '#86c3fa', dark: '#5b8fdc', light: '#cbe7ff', belly: '#f2f9ff', accent: '#ffd06e' },
  { name: 'Mint', main: '#86d8a9', dark: '#4aa983', light: '#c9f2da', belly: '#f2fff6', accent: '#ff9f86' },
  { name: 'Lilac', main: '#bfa3ef', dark: '#8a6ec8', light: '#e5d8ff', belly: '#fbf7ff', accent: '#7fd6e6' },
  { name: 'Rose', main: '#ffa3c2', dark: '#de6f96', light: '#ffd9e7', belly: '#fff6fa', accent: '#7fb6ff' },
  { name: 'Butter', main: '#ffd56e', dark: '#dba23e', light: '#fff0b8', belly: '#fffbea', accent: '#ff8d8d' },
  // 6-12: natural coats for real-animal pets
  { name: 'Ginger', main: '#f2a65a', dark: '#c9733a', light: '#ffd9a8', belly: '#fff3e2', accent: '#5bb8e8' },
  { name: 'Cocoa', main: '#a8795a', dark: '#7a523b', light: '#d9b596', belly: '#f3e3d3', accent: '#ff7d7d' },
  { name: 'Cream', main: '#f3dcb8', dark: '#cfae83', light: '#fff2dc', belly: '#fffaf1', accent: '#ff8fb1' },
  { name: 'Snow', main: '#f4f2f7', dark: '#c9c4d6', light: '#ffffff', belly: '#ffffff', accent: '#ff9fbf' },
  { name: 'Smoke', main: '#a9adbd', dark: '#767b8f', light: '#d7dae4', belly: '#f2f3f7', accent: '#ffcf5a' },
  { name: 'Ink', main: '#4a4b5e', dark: '#2e2f3d', light: '#7d7f96', belly: '#f6f4f0', accent: '#ffb347' },
  { name: 'Leaf', main: '#8fd46b', dark: '#5ea546', light: '#cdf0b4', belly: '#f6fbe8', accent: '#ff8d8d' },
];

// Real animals hatch in believable coats (plus a couple of candy ones for fun);
// the fantasy pets keep the full pastel range.
const PASTELS = [0, 1, 2, 3, 4, 5];
export const SPECIES_PALETTES: Record<Species, number[]> = {
  blob: PASTELS,
  drako: PASTELS,
  pup: [6, 7, 8, 9, 11, 0],
  cat: [6, 7, 8, 9, 10, 11, 3],
  bunny: [9, 8, 10, 7, 4],
  bear: [7, 8, 9, 6, 5],
  frog: [12, 2, 5, 1],
  penguin: [11, 10, 1],
  fox: [6, 9, 8],
  hamster: [6, 8, 10, 9],
};

export function randomPalette(species: Species, rnd = Math.random) {
  const list = SPECIES_PALETTES[species];
  return list[Math.floor(rnd() * list.length)];
}

export function hash3(x: number, y: number, z: number): number {
  let h =
    Math.imul(Math.floor(x * 7 + 1000), 374761393) ^
    Math.imul(Math.floor(y * 7 + 1000), 668265263) ^
    Math.imul(Math.floor(z * 7 + 1000), 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
