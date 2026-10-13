'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PALETTES, type Species, type V3 } from '@/lib/pets';
import { contactShadowTexture, useGlossEnv, useMats } from './jelly';
import { BabyContext, FLASHY, makeMats, SPECIES_VIEW } from './species';

export type AnimName =
  | 'idle'
  | 'hungry'
  | 'sleep'
  | 'eat'
  | 'happy'
  | 'train'
  | 'attack'
  | 'hit'
  | 'dodge'
  | 'faint'
  | 'win'
  | 'pop'
  | 'evolve';

export interface AnimState {
  name: AnimName;
  id: number;
}

// 0 = looping / held pose
export const ANIM_MS: Record<AnimName, number> = {
  idle: 0,
  hungry: 0,
  sleep: 0,
  faint: 0,
  win: 0,
  eat: 1800,
  happy: 1200,
  train: 1200,
  attack: 700,
  hit: 550,
  dodge: 500,
  pop: 800,
  evolve: 2200,
};

const clamp01 = (k: number) => Math.max(0, Math.min(1, k));
const easeOut = (k: number) => 1 - (1 - k) ** 3;
const easeInOut = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2);
const elasticOut = (k: number) =>
  k <= 0 ? 0 : k >= 1 ? 1 : 2 ** (-10 * k) * Math.sin(((k * 10 - 0.75) * 2 * Math.PI) / 3) + 1;
const bounceOut = (k: number) => {
  const n = 7.5625;
  const d = 2.75;
  if (k < 1 / d) return n * k * k;
  if (k < 2 / d) return n * (k -= 1.5 / d) * k + 0.75;
  if (k < 2.5 / d) return n * (k -= 2.25 / d) * k + 0.9375;
  return n * (k -= 2.625 / d) * k + 0.984375;
};

const RED = new THREE.Color('#ff3040');
const GOLD = new THREE.Color('#fff2a0');

interface Props {
  species: Species;
  palette: number;
  adult: boolean;
  anim: AnimState;
  position?: V3;
  facing?: number; // yaw
  dir?: [number, number]; // world xz direction for lunges
  lunge?: number;
  seed?: number;
  onTap?: () => void;
}

export function PetModel({
  species,
  palette,
  adult,
  anim,
  position = [0, 0, 0],
  facing = 0,
  dir = [0, 1],
  lunge = 1.2,
  seed = 0,
  onTap,
}: Props) {
  const env = useGlossEnv();
  const mats = useMats(() => makeMats(PALETTES[palette % PALETTES.length], env), [palette, env]);
  const View = SPECIES_VIEW[species];
  const rootRef = useRef<THREE.Group>(null);
  const shadowRef = useRef<THREE.Mesh>(null);
  const refs = useRef<Record<string, THREE.Group | null>>({});
  const lastId = useRef(-1);
  const t0 = useRef(0);
  const baseScale = adult ? 1.05 : 0.85;

  useFrame((state) => {
    const root = rootRef.current;
    if (!root) return;
    const T = state.clock.elapsedTime;
    if (anim.id !== lastId.current) {
      lastId.current = anim.id;
      t0.current = T;
    }
    const t = T - t0.current;

    let fwd = 0, side = 0, py = 0, rx = 0, ry = 0, rz = 0;
    let gs = 1;
    // babies breathe with a softer, bigger jelly wobble
    const br = Math.sin(T * (adult ? 2.4 : 3) + seed) * (adult ? 0.03 : 0.045);
    let sy = 1 + br, sx = 1 - br * 0.5, sz = 1 - br * 0.5;
    let headRx = 0;
    let headRy = Math.sin(T * 0.7 + seed) * 0.2;
    if (!adult && anim.name === 'idle') {
      // curious head tilt + a little happy boing every few seconds
      rz = Math.sin(T * 0.9 + seed) * 0.06;
      const ph = (T + seed * 2.3) % 4.2;
      if (ph < 0.55) {
        const k = ph / 0.55;
        py = Math.sin(k * Math.PI) * 0.12;
        const land = k < 0.15 || k > 0.85 ? 0.1 : -0.05;
        sy *= 1 - land;
        sx *= 1 + land * 0.6;
        sz *= 1 + land * 0.6;
      }
    }
    let eye = (T + seed * 1.7) % 3.6 < 0.13 ? 0.1 : 1;
    let tail = Math.sin(T * 5 + seed) * 0.35;
    let legs = 0;
    let wing = 0.15 + Math.sin(T * 2.5) * 0.12;
    let flash = 0;
    let flashColor = RED;

    switch (anim.name) {
      case 'hungry':
        headRx = 0.4;
        headRy *= 0.3;
        eye = Math.min(eye, 0.5);
        tail *= 0.2;
        side = Math.sin(T * 1.3) * 0.03;
        break;
      case 'sleep': {
        sy = 0.82 + Math.sin(T * 1.3) * 0.04;
        sx = sz = 1.06;
        headRx = 0.5;
        headRy = 0;
        eye = 0.08;
        tail = 0;
        wing = 0.05;
        break;
      }
      case 'eat': {
        const bite = 0.5 - 0.5 * Math.cos((t * 2 * Math.PI) / 0.6);
        headRx = 0.05 + bite * 0.6;
        fwd = 0.05 * bite;
        eye = bite > 0.6 ? 0.3 : 1;
        tail = Math.sin(T * 12) * 0.5;
        break;
      }
      case 'happy': {
        const k = clamp01(t / 1.2);
        const hop = Math.abs(Math.sin(k * Math.PI * 2));
        py = hop * 0.5;
        ry = easeInOut(k) * Math.PI * 2;
        eye = 0.35;
        tail = Math.sin(T * 22) * 0.6;
        legs = Math.sin(T * 22) * 0.7;
        wing = 0.3 + Math.sin(T * 20) * 0.4;
        if (hop < 0.15 && k < 0.98) {
          sy *= 0.86;
          sx *= 1.07;
          sz *= 1.07;
        }
        break;
      }
      case 'train': {
        const p = Math.abs(Math.sin(t * Math.PI * 3));
        py = p * 0.25;
        rx = 0.2 * p;
        fwd = p * 0.1;
        legs = Math.sin(T * 25) * 0.7;
        eye = 0.4;
        wing = 0.3 + Math.sin(T * 25) * 0.4;
        break;
      }
      case 'attack': {
        if (t < 0.15) {
          const k = t / 0.15;
          fwd = -0.25 * easeOut(k);
          rx = -0.2 * k;
        } else if (t < 0.32) {
          const k = (t - 0.15) / 0.17;
          fwd = -0.25 + (lunge + 0.25) * easeOut(k);
          rx = 0.35;
          legs = Math.sin(T * 30) * 0.8;
        } else {
          const k = clamp01((t - 0.32) / 0.38);
          fwd = lunge * (1 - easeInOut(k));
          rx = 0.35 * (1 - k);
        }
        eye = 0.6;
        tail = Math.sin(T * 25) * 0.5;
        wing = 0.5;
        break;
      }
      case 'hit': {
        const k = clamp01(t / 0.55);
        fwd = -0.5 * (k < 0.25 ? easeOut(k / 0.25) : 1 - easeInOut((k - 0.25) / 0.75));
        side = Math.sin(t * 80) * 0.05 * (1 - k);
        rx = -0.25 * (1 - k);
        eye = 0.12;
        flash = 1 - k;
        break;
      }
      case 'dodge': {
        const k = clamp01(t / 0.5);
        side = Math.sin(k * Math.PI) * 0.7;
        py = Math.sin(k * Math.PI) * 0.2;
        rz = -Math.sin(k * Math.PI) * 0.2;
        break;
      }
      case 'faint': {
        const k = clamp01(t / 0.7);
        rz = bounceOut(k) * (Math.PI / 2);
        sy = sx = sz = 1;
        eye = 0.08;
        tail = 0;
        legs = 0.6;
        wing = 0;
        headRy = 0;
        break;
      }
      case 'win':
        py = Math.abs(Math.sin(T * 6)) * 0.35;
        ry = Math.sin(T * 3) * 0.4;
        eye = 0.35;
        tail = Math.sin(T * 22) * 0.6;
        legs = Math.sin(T * 22) * 0.5;
        wing = 0.3 + Math.sin(T * 18) * 0.4;
        break;
      case 'pop': {
        const k = clamp01(t / 0.8);
        gs = elasticOut(k);
        if (k < 0.7) eye = 0.35;
        break;
      }
      case 'evolve': {
        const k = clamp01(t / 2.2);
        ry = easeInOut(k) * Math.PI * 6;
        py = Math.sin(k * Math.PI) * 0.7;
        gs = 1 + Math.sin(k * Math.PI) * 0.15;
        flash = Math.sin(k * Math.PI);
        flashColor = GOLD;
        eye = 0.35;
        break;
      }
    }

    const [dx, dz] = dir;
    const ox = dx * fwd + dz * side;
    const oz = dz * fwd - dx * side;
    root.position.set(ox, py, oz);
    const sh = shadowRef.current;
    if (sh) {
      // contact shadow follows the pet on the ground and fades as it jumps
      const lift = Math.max(0, py);
      sh.position.set(ox, 0.006, oz);
      sh.scale.setScalar(baseScale * gs * (1 - Math.min(0.5, lift * 0.8)));
      (sh.material as THREE.MeshBasicMaterial).opacity = anim.name === 'faint' ? 0.5 : 1 - Math.min(0.7, lift * 1.4);
    }
    root.rotation.order = 'YXZ';
    root.rotation.set(rx, facing + ry, rz);
    const s = baseScale * gs;
    root.scale.set(sx * s, sy * s, sz * s);

    const r = refs.current;
    if (r.head) {
      r.head.rotation.set(headRx, headRy, 0);
    }
    if (r.eyes) r.eyes.scale.set(1, eye, 1);
    if (r.tail) r.tail.rotation.set(0, tail, 0);
    if (r.legFL) r.legFL.rotation.x = legs;
    if (r.legBR) r.legBR.rotation.x = legs;
    if (r.legFR) r.legFR.rotation.x = -legs;
    if (r.legBL) r.legBL.rotation.x = -legs;
    if (r.wingL) r.wingL.rotation.z = -wing;
    if (r.wingR) r.wingR.rotation.z = wing;

    for (const k of FLASHY) {
      const m = mats[k];
      m.emissive.copy(m.userData.baseEmissive);
      if (flash > 0) m.emissive.lerp(flashColor, flash * 0.8);
    }
  });

  return (
    <group position={position}>
      <mesh ref={shadowRef} rotation-x={-Math.PI / 2} renderOrder={-1}>
        <planeGeometry args={[1.05, 1.05]} />
        <meshBasicMaterial map={contactShadowTexture()} transparent depthWrite={false} />
      </mesh>
      <group
        ref={rootRef}
        onClick={(e) => {
          if (!onTap || e.delta > 8) return; // ignore drags (camera orbit)
          e.stopPropagation();
          onTap();
        }}
      >
        <BabyContext.Provider value={!adult}>
          <View refs={refs} m={mats} adult={adult} />
        </BabyContext.Provider>
      </group>
    </group>
  );
}
