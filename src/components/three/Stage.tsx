'use client';

import { useMemo, useRef, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { hash3, type V3 } from '@/lib/pets';
import { Ball, jellyMat, useGlossEnv, useMats } from './jelly';

function CameraRig({ target }: { target: V3 }) {
  const base = useRef<THREE.Vector3 | null>(null);
  useFrame(({ camera, clock }) => {
    if (!base.current) base.current = camera.position.clone();
    const t = clock.elapsedTime;
    camera.position.x = base.current.x + Math.sin(t * 0.25) * 0.15;
    camera.position.y = base.current.y + Math.sin(t * 0.33) * 0.05;
    camera.lookAt(target[0], target[1], target[2]);
  });
  return null;
}

/** Soft toy-like (semi-matte) material for scenery so the glossy pets stay the star. */
function useSceneMats<T extends Record<string, string>>(colors: T, rough = 0.55) {
  const env = useGlossEnv();
  return useMats(
    () =>
      Object.fromEntries(
        Object.entries(colors).map(([k, c]) => {
          const m = jellyMat(c, { env, rough, glow: 0.03, rim: 0.12 });
          if (rough >= 0.8) m.clearcoat = 0; // matte floors: no hot specular spot
          return [k, m];
        }),
      ) as Record<keyof T, THREE.MeshPhysicalMaterial>,
    [env],
  );
}

const ISLAND_COLORS = {
  grass: '#7fd36b',
  grassLight: '#a4e38a',
  soil: '#d39a62',
  soilDark: '#b67a47',
  trunk: '#a8693a',
  leaf: '#5fc46a',
  leafLight: '#86d86f',
  rock: '#b9c0cc',
  stem: '#5aa65a',
  petal1: '#ffd06e',
  petal2: '#ff9fbf',
  petal3: '#ffffff',
  petal4: '#b9a3f2',
  center: '#ffb347',
};
type IslandMats = Record<keyof typeof ISLAND_COLORS, THREE.MeshPhysicalMaterial>;

function Tree({ m, p, s = 1, seed = 0 }: { m: IslandMats; p: V3; s?: number; seed?: number }) {
  return (
    <group position={p} scale={s}>
      <mesh material={m.trunk} position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.1, 0.6, 16]} />
      </mesh>
      <Ball p={[0, 0.82, 0]} r={0.36} mat={m.leaf} />
      <Ball p={[0.2 + seed * 0.05, 0.68, 0.12]} r={0.24} mat={m.leafLight} />
      <Ball p={[-0.22, 0.7, -0.05]} r={0.25} mat={m.leaf} />
      <Ball p={[0.02, 1.08, 0.04]} r={0.2} mat={m.leafLight} />
    </group>
  );
}

function Flower({ m, p, petal }: { m: IslandMats; p: V3; petal: THREE.Material }) {
  return (
    <group position={p}>
      <mesh material={m.stem} position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.12, 6]} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return <Ball key={i} p={[Math.sin(a) * 0.035, 0.13, Math.cos(a) * 0.035]} r={0.028} mat={petal} shadow={false} />;
      })}
      <Ball p={[0, 0.135, 0]} r={0.022} mat={m.center} shadow={false} />
    </group>
  );
}

const FLOWERS: [number, number, 'petal1' | 'petal2' | 'petal3' | 'petal4'][] = [
  [-1.6, 0.9, 'petal1'], [1.7, -0.4, 'petal2'], [-1.2, -1.5, 'petal3'], [1.4, 1.1, 'petal1'],
  [-2.0, -0.3, 'petal4'], [0.7, -1.9, 'petal1'], [2.0, 0.5, 'petal3'], [-0.7, 1.8, 'petal4'],
  [0.9, 1.7, 'petal2'], [-1.9, 0.4, 'petal2'],
];

function Island() {
  const m = useSceneMats(ISLAND_COLORS) as IslandMats;
  return (
    <group>
      {/* grass cap with a rounded rim */}
      <mesh material={m.grass} position={[0, -0.08, 0]} receiveShadow>
        <cylinderGeometry args={[2.6, 2.6, 0.16, 96]} />
      </mesh>
      <mesh material={m.grass} position={[0, -0.08, 0]} rotation-x={Math.PI / 2} receiveShadow>
        <torusGeometry args={[2.6, 0.08, 16, 96]} />
      </mesh>
      {(
        [
          [-0.9, 0.6, 0.55],
          [1.1, -0.9, 0.45],
          [0.4, 1.4, 0.35],
          [-1.5, -0.9, 0.4],
        ] as const
      ).map(([x, z, r], i) => (
        <mesh key={i} material={m.grassLight} position={[x, 0.002, z]} rotation-x={-Math.PI / 2} receiveShadow>
          <circleGeometry args={[r, 40]} />
        </mesh>
      ))}
      {/* soil underside */}
      <mesh material={m.soil} position={[0, -0.6, 0]}>
        <cylinderGeometry args={[2.62, 1.7, 0.9, 96]} />
      </mesh>
      <mesh material={m.soilDark} position={[0, -1.25, 0]}>
        <cylinderGeometry args={[1.7, 0.6, 0.45, 64]} />
      </mesh>
      <Tree m={m} p={[-1.6, 0, -1.3]} s={1.1} />
      <Tree m={m} p={[1.8, 0, -1.1]} s={0.85} seed={1} />
      {(
        [
          [1.3, 1.5, 1],
          [-1.9, 1.1, 0.7],
          [0.4, -2.1, 0.85],
        ] as const
      ).map(([x, z, s], i) => (
        <group key={i} position={[x, 0, z]} scale={s} rotation-y={i}>
          <Ball p={[0, 0.06, 0]} r={[0.17, 0.12, 0.14]} mat={m.rock} />
          <Ball p={[0.13, 0.04, 0.06]} r={[0.09, 0.07, 0.08]} mat={m.rock} />
        </group>
      ))}
      {FLOWERS.map(([x, z, c], i) => (
        <Flower key={i} m={m} p={[x, 0, z]} petal={m[c]} />
      ))}
    </group>
  );
}

const CLOUD_SEEDS: V3[] = [
  [-4, 2.6, -4],
  [1, 3.2, -5],
  [5, 2.3, -4.5],
];
const CLOUD_PUFFS: [number, number, number, number][] = [
  [0, 0, 0, 0.45],
  [-0.5, -0.1, 0, 0.32],
  [0.52, -0.08, 0, 0.35],
  [0.2, 0.25, 0, 0.32],
  [-0.25, 0.2, 0, 0.28],
];

function Clouds() {
  const m = useSceneMats({ cloud: '#ffffff' }, 0.7);
  const refs = useRef<(THREE.Group | null)[]>([]);
  useFrame(({ clock }) => {
    refs.current.forEach((g, i) => {
      if (!g) return;
      const x = CLOUD_SEEDS[i][0] + clock.elapsedTime * (0.12 + i * 0.04);
      g.position.x = ((x + 9) % 18) - 9;
    });
  });
  return (
    <>
      {CLOUD_SEEDS.map((p, i) => (
        <group
          key={i}
          position={p}
          ref={(g) => {
            refs.current[i] = g;
          }}
        >
          {CLOUD_PUFFS.map(([x, y, z, r], j) => (
            <Ball key={j} p={[x, y, z]} r={[r, r * 0.85, r * 0.8]} mat={m.cloud} shadow={false} />
          ))}
        </group>
      ))}
    </>
  );
}

function Arena() {
  const m = useSceneMats({
    floor: '#cfc3f3',
    ring: '#b3a2ec',
    base: '#9c8ad8',
    pillar: '#e9e2ff',
    orb: '#ffd36e',
  }, 0.85);
  const stars = useMemo(
    () => Array.from({ length: 50 }, (_, i) => [(hash3(i, 1, 2) - 0.5) * 24, 1.5 + hash3(i, 3, 4) * 6, -8] as V3),
    [],
  );
  return (
    <group>
      <mesh material={m.floor} position={[0, -0.08, 0]} receiveShadow>
        <cylinderGeometry args={[2.9, 2.9, 0.16, 96]} />
      </mesh>
      <mesh material={m.floor} position={[0, -0.08, 0]} rotation-x={Math.PI / 2} receiveShadow>
        <torusGeometry args={[2.9, 0.08, 16, 96]} />
      </mesh>
      <mesh material={m.ring} position={[0, 0.003, 0]} rotation-x={-Math.PI / 2} receiveShadow>
        <ringGeometry args={[1.05, 1.2, 64]} />
      </mesh>
      <mesh material={m.ring} position={[0, 0.003, 0]} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[0.1, 5.6]} />
      </mesh>
      <mesh material={m.base} position={[0, -0.55, 0]}>
        <cylinderGeometry args={[2.9, 2.2, 0.8, 96]} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 2.3, 0, -1.2]}>
          <mesh material={m.pillar} position={[0, 0.55, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.2, 1.1, 24]} />
          </mesh>
          <Ball p={[0, 1.22, 0]} r={0.2} mat={m.orb} />
        </group>
      ))}
      {stars.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.045, 8, 6]} />
          <meshBasicMaterial color={i % 3 ? '#ffffff' : '#fff2b8'} />
        </mesh>
      ))}
    </group>
  );
}

const SHROOM_DOTS: V3[] = [
  [0, 0.21, 0.06],
  [0.1, 0.17, 0.08],
  [-0.1, 0.18, 0.05],
  [0.05, 0.17, -0.1],
  [-0.08, 0.15, -0.09],
];

export function Shroom({ position }: { position: V3 }) {
  const m = useSceneMats({ cap: '#ff5a5f', stem: '#fff1dc', dot: '#ffffff' }, 0.6);
  const ref = useRef<THREE.Group>(null);
  const t0 = useRef<number | null>(null);
  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    if (t0.current === null) t0.current = clock.elapsedTime;
    const t = clock.elapsedTime - t0.current;
    const bites = Math.min(3, Math.floor((t + 0.3) / 0.6));
    const target = t < 0.15 ? t / 0.15 : 1 - bites / 3;
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, target, 0.4));
  });
  return (
    <group ref={ref} position={position} scale={0}>
      <mesh material={m.stem} position={[0, 0.06, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.065, 0.12, 20]} />
      </mesh>
      <mesh material={m.cap} position={[0, 0.1, 0]} castShadow>
        <sphereGeometry args={[0.14, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      {SHROOM_DOTS.map((p, i) => (
        <Ball key={i} p={p} r={[0.025, 0.012, 0.025]} rot={[p[2] * 6, 0, -p[0] * 6]} mat={m.dot} shadow={false} />
      ))}
    </group>
  );
}

interface StageProps {
  children: ReactNode;
  variant: 'island' | 'arena';
}

export function Stage({ children, variant }: StageProps) {
  const arena = variant === 'arena';
  return (
    <Canvas
      shadows="soft"
      flat
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: arena ? [0, 1.75, 4.9] : [1.45, 1.4, 3.05], fov: 38 }}
    >
      {!arena && <fog attach="fog" args={['#e6f2ff', 7, 15]} />}
      <hemisphereLight args={['#ffffff', arena ? '#cbbcf0' : '#bfe3b0', 1.7]} />
      <directionalLight
        position={[2.5, 5, 3]}
        intensity={1.35}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-3.5}
        shadow-camera-right={3.5}
        shadow-camera-top={3.5}
        shadow-camera-bottom={-3.5}
        shadow-bias={-0.0005}
        shadow-normalBias={0.015}
      />
      <directionalLight position={[-3, 2, -2]} intensity={0.45} color="#ffe7c2" />
      <directionalLight position={[0, 1.5, 4]} intensity={0.35} color="#fff6ee" />
      {arena ? (
        <CameraRig target={[0, 0.55, 0]} />
      ) : (
        <OrbitControls
          target={[0, 0.55, 0]}
          enablePan={false}
          enableDamping
          rotateSpeed={0.7}
          minDistance={2.4}
          maxDistance={6.5}
          minPolarAngle={0.35}
          maxPolarAngle={1.42}
        />
      )}
      {arena ? <Arena /> : <Island />}
      {!arena && <Clouds />}
      {children}
    </Canvas>
  );
}
