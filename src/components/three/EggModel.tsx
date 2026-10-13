'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { hash3, PALETTES, type V3 } from '@/lib/pets';
import { Ball, jellyMat, juicy, useGlossEnv, useMats } from './jelly';

const GLOW = new THREE.Color('#ffcf5a');
const EGG_H = 0.36; // half height

// Egg profile: wider bottom, pointier top. theta 0 = bottom pole, PI = top pole.
function eggRadius(theta: number) {
  return 0.29 * Math.sin(theta) * (1 + 0.12 * Math.cos(theta));
}
const EGG_GEO = new THREE.LatheGeometry(
  Array.from({ length: 41 }, (_, i) => {
    const th = (i / 40) * Math.PI;
    return new THREE.Vector2(eggRadius(th), -Math.cos(th) * EGG_H);
  }),
  64,
);

/** Point on the egg surface at polar angle theta and azimuth phi (0 = facing +z). */
function onEgg(theta: number, phi: number, lift = 0): V3 {
  const r = eggRadius(theta) + lift;
  return [Math.sin(phi) * r, -Math.cos(theta) * EGG_H, Math.cos(phi) * r];
}

const SPOTS: [number, number, number][] = [
  [1.9, 0.5, 0.07],
  [1.2, -0.7, 0.06],
  [2.3, -1.6, 0.05],
  [1.5, 1.9, 0.065],
  [2.0, 2.9, 0.06],
  [1.1, 3.9, 0.055],
  [2.4, 4.8, 0.05],
  [0.9, 1.1, 0.045],
];

// zig-zag crack across the front, revealed one segment per tap
const CRACK = Array.from({ length: 9 }, (_, i) => [1.75 + (i % 2 ? 0.13 : -0.13), -0.95 + i * 0.24] as const);

export function Nest() {
  const env = useGlossEnv();
  const m = useMats(
    () => ({
      straw: jellyMat('#c98d4f', { env, rough: 0.7, glow: 0.05 }),
      twig: jellyMat('#a96a35', { env, rough: 0.75, glow: 0.03 }),
    }),
    [env],
  );
  return (
    <group position={[0, 0.06, 0]}>
      <mesh material={m.straw} rotation-x={Math.PI / 2} castShadow receiveShadow>
        <torusGeometry args={[0.3, 0.09, 20, 48]} />
      </mesh>
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return (
          <Ball
            key={i}
            p={[Math.sin(a) * 0.32, 0.05 + hash3(i, 1, 1) * 0.03, Math.cos(a) * 0.32]}
            r={[0.03, 0.03, 0.13]}
            rot={[0.3, a + 1.2, 0.2]}
            mat={m.twig}
          />
        );
      })}
    </group>
  );
}

interface Props {
  palette: number;
  cracks: number; // 0..1
  tapId: number;
  onTap?: () => void;
}

export function EggModel({ palette, cracks, tapId, onTap }: Props) {
  const env = useGlossEnv();
  const pal = PALETTES[palette % PALETTES.length];
  const m = useMats(
    () => ({
      shell: jellyMat(pal.belly, { env, rough: 0.5, glow: 0.12 }),
      spot: jellyMat(juicy(pal.main), { env }),
      crack: jellyMat('#3a2c3f', { env, rough: 0.5, glow: 0 }),
    }),
    [pal, env],
  );
  const shown = Math.round(cracks * (CRACK.length - 1));
  const crackSegs = useMemo(() => {
    const segs: { p: V3; len: number; rot: THREE.Euler }[] = [];
    for (let i = 0; i < shown; i++) {
      const a = new THREE.Vector3(...onEgg(CRACK[i][0], CRACK[i][1], 0.004));
      const b = new THREE.Vector3(...onEgg(CRACK[i + 1][0], CRACK[i + 1][1], 0.004));
      const mid = a.clone().add(b).multiplyScalar(0.5);
      const dir = b.clone().sub(a);
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
      segs.push({ p: [mid.x, mid.y, mid.z], len: dir.length(), rot: new THREE.Euler().setFromQuaternion(q) });
    }
    return segs;
  }, [shown]);

  const ref = useRef<THREE.Group>(null);
  const last = useRef(tapId);
  const t0 = useRef(-10);

  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    const T = clock.elapsedTime;
    if (tapId !== last.current) {
      last.current = tapId;
      t0.current = T;
    }
    const t = T - t0.current;
    const hit = Math.sin(t * 28) * 0.2 * Math.exp(-t * 5);
    // restless wobble that grows as it cracks
    const idle = (T % 2.4 < 0.5 ? Math.sin(T * 30) * 0.05 : 0) * (0.5 + cracks * 1.5);
    g.rotation.z = hit + idle;
    const squash = Math.exp(-t * 10) * 0.12;
    g.scale.set(1 + squash, 1 - squash, 1 + squash);
    // light leaks out right before hatching
    const glow = cracks >= 0.8 ? 0.2 + Math.sin(T * 8) * 0.12 : 0;
    for (const mat of [m.shell, m.spot]) {
      mat.emissive.copy(mat.userData.baseEmissive).lerp(GLOW, Math.min(1, glow + Math.exp(-t * 8) * 0.25));
    }
  });

  return (
    <group
      ref={ref}
      onClick={(e) => {
        if (!onTap || e.delta > 8) return; // ignore drags (camera orbit)
        e.stopPropagation();
        onTap();
      }}
    >
      <group position={[0, EGG_H + 0.04, 0]}>
        <mesh geometry={EGG_GEO} material={m.shell} castShadow />
        {SPOTS.map(([th, ph, r], i) => (
          <Ball key={i} p={onEgg(th, ph, -r * 0.6)} r={[r, r, r]} mat={m.spot} shadow={false} />
        ))}
        {crackSegs.map((s, i) => (
          <mesh key={i} material={m.crack} position={s.p} rotation={s.rot}>
            <cylinderGeometry args={[0.009, 0.009, s.len + 0.012, 6]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
