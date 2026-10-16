// Cosmetic slots a pet can wear. Each slot holds at most one item; 'none' leaves the species' own look.

export const HATS = [
  'none', 'party', 'beanie', 'tophat', 'crown', 'flower', 'halo',
  'bunnyears', 'froghat', 'chef', 'witch', 'strawberry', 'mushroom', 'propeller', 'starclip',
] as const;
export const FACES = ['none', 'glasses', 'shades', 'hearts', 'stars', 'stickers'] as const;
export const NECKS = ['none', 'scarf', 'bowtie', 'lei', 'bandana', 'pearls', 'bell'] as const;
export const BACKS = ['none', 'angel', 'bat', 'butterfly', 'backpack', 'cape', 'balloon'] as const;
/** held in the right hand: adults with arms only (babies have no hands) */
export const HANDS = ['none', 'icecream', 'lollipop', 'wand', 'sunflower'] as const;

export type HatId = (typeof HATS)[number];
export type FaceId = (typeof FACES)[number];
export type NeckId = (typeof NECKS)[number];
export type BackId = (typeof BACKS)[number];
export type HandId = (typeof HANDS)[number];

export interface Loadout {
  hat: HatId;
  face: FaceId;
  neck: NeckId;
  back: BackId;
  hand: HandId;
}

export const NO_LOADOUT: Loadout = { hat: 'none', face: 'none', neck: 'none', back: 'none', hand: 'none' };

export const COSMETIC_LABEL: Record<HatId | FaceId | NeckId | BackId | HandId, string> = {
  none: 'None',
  party: 'Party hat',
  beanie: 'Beanie',
  tophat: 'Top hat',
  crown: 'Crown',
  flower: 'Flower',
  halo: 'Halo',
  bunnyears: 'Bunny ears',
  froghat: 'Frog hat',
  chef: 'Chef hat',
  witch: 'Witch hat',
  strawberry: 'Strawberry hat',
  mushroom: 'Mushroom cap',
  propeller: 'Propeller cap',
  starclip: 'Star clip',
  glasses: 'Round glasses',
  shades: 'Shades',
  hearts: 'Heart glasses',
  stars: 'Star glasses',
  stickers: 'Cheek stickers',
  scarf: 'Scarf',
  bowtie: 'Bow tie',
  lei: 'Flower lei',
  bandana: 'Bandana',
  pearls: 'Pearls',
  bell: 'Bell collar',
  angel: 'Angel wings',
  bat: 'Bat wings',
  butterfly: 'Butterfly wings',
  backpack: 'Backpack',
  cape: 'Hero cape',
  balloon: 'Balloon',
  icecream: 'Ice cream',
  lollipop: 'Lollipop',
  wand: 'Star wand',
  sunflower: 'Sunflower',
};
