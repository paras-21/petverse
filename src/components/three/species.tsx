'use client';

// Pet character models: materials, face kit, accessories and every species (baby + adult form).
// PetModel.tsx animates them through the named Part groups registered in refs.

import { createContext, useContext, type ReactNode, type RefObject } from 'react';
import * as THREE from 'three';
import type { Palette, Species, V3 } from '@/lib/pets';
import { Ball, frontZ, jellyMat, juicy, puffGeometry } from './jelly';

/** True while rendering a baby: Face and Critter switch to extra-cute proportions. */
export const BabyContext = createContext(false);

export type Refs = RefObject<Record<string, THREE.Group | null>>;
export type Mats = ReturnType<typeof makeMats>;

export function makeMats(pal: Palette, env: THREE.Texture) {
  return {
    body: jellyMat(juicy(pal.main), { env, shade: juicy(pal.dark, 0.25, -0.12), rim: 0.5, rimColor: pal.light }),
    dark: jellyMat(juicy(pal.dark, 0.12), { env, shade: juicy(pal.dark, 0.3, -0.25), rim: 0.4, rimColor: pal.light }),
    light: jellyMat(pal.light, { env, glow: 0.08 }),
    belly: jellyMat(pal.belly, { env, glow: 0.08 }),
    accent: jellyMat(juicy(pal.accent), { env, shade: juicy(pal.accent, 0.2, -0.2) }),
    ink: jellyMat('#1a1626', { env, rough: 0.12, glow: 0, gloss: true, rim: 0.12, rimColor: '#8f86c9' }),
    iris: jellyMat(juicy(pal.dark, 0.35, -0.08), { env, rough: 0.15, glow: 0.25, gloss: true, rim: 0 }),
    gear: jellyMat('#2b3040', { env, rough: 0.35, glow: 0, rim: 0.2, rimColor: '#9aa6c8' }),
    gold: jellyMat('#f4c04a', { env, rough: 0.35, metal: 0.85, glow: 0.05, gloss: true, shade: '#b8741f' }),
    white: new THREE.MeshBasicMaterial({ color: '#ffffff' }),
    pink: jellyMat('#ff9db8', { env, glow: 0.1, shade: '#e0678d' }),
    orange: jellyMat('#ffa53d', { env, shade: '#d96a1c' }),
    leaf: jellyMat('#6cc35a', { env, shade: '#3f8f3a' }),
    seed: jellyMat('#5b4636', { env, shade: '#3a2a20' }),
    blush: new THREE.MeshBasicMaterial({ color: '#ff5c93', transparent: true, opacity: 0.62, depthWrite: false }),
  };
}
// materials that light up on hit / evolve
export const FLASHY = ['body', 'dark', 'light', 'belly', 'accent'] as const;

/** Group whose handle is stored in refs[name] so the animator can drive it. */
function Part({ name, refs, p, children }: { name: string; refs: Refs; p: V3; children: ReactNode }) {
  return (
    <group
      position={p}
      ref={(g) => {
        refs.current[name] = g;
      }}
    >
      {children}
    </group>
  );
}

type Surf = (x: number, y: number) => number;
type Ell = [V3, V3];

/** Front surface of a union of ellipsoids (head-local), so face parts sit on muzzles, cheeks, bumps. */
function surfOf(...ells: Ell[]): Surf {
  return (x, y) => {
    let z = -Infinity;
    for (const [c, r] of ells) {
      const k = 1 - ((x - c[0]) / r[0]) ** 2 - ((y - c[1]) / r[1]) ** 2;
      if (k >= 0) z = Math.max(z, c[2] + r[2] * Math.sqrt(k));
    }
    return z === -Infinity ? 0 : z;
  };
}

type Mouth = 'smile' | 'cat' | 'wide' | 'none';

/**
 * Big glossy eyes (two sparkles each), blush cheeks, optional nose and a mouth.
 * surf(x, y) gives the face surface z in head-local space, so every bit hugs the body.
 */
function Face({
  refs,
  m,
  gap: gap0,
  y,
  surf,
  mouth = 'smile',
  nose,
  noseY = y - 0.075,
}: {
  refs: Refs;
  m: Mats;
  gap: number;
  y: number;
  surf: Surf;
  mouth?: Mouth;
  nose?: 'ink' | 'pink';
  noseY?: number;
}) {
  const baby = useContext(BabyContext);
  const eyeK = baby ? 1.18 : 1; // babies: bigger, wider-set eyes and rosier cheeks
  const gap = gap0 + (baby ? 0.012 : 0);
  const ez = surf(gap, y) - 0.012;
  const cy = y - 0.085 * eyeK;
  const cx = gap + 0.075;
  const blushK = baby ? 1.3 : 1;
  const my = nose ? noseY - 0.035 : y - 0.075;
  const mz = surf(0, my) - 0.002;
  return (
    <>
      <Part name="eyes" refs={refs} p={[0, y, ez]}>
        {[-1, 1].map((s) => (
          <group key={s} position={[s * gap, 0, 0]} rotation={[-0.12, s * 0.34, 0]} scale={eyeK}>
            <Ball p={[0, 0, 0]} r={[0.056, 0.084, 0.032]} mat={m.ink} shadow={false} />
            <Ball p={[0, -0.036, 0.016]} r={[0.04, 0.036, 0.02]} mat={m.iris} shadow={false} />
            <Ball p={[-0.017, 0.032, 0.026]} r={[0.017, 0.019, 0.01]} mat={m.white} shadow={false} />
            <Ball p={[0.018, -0.03, 0.028]} r={0.008} mat={m.white} shadow={false} />
            <Ball p={[0.02, 0.04, 0.024]} r={0.0055} mat={m.white} shadow={false} />
          </group>
        ))}
      </Part>
      {[-1, 1].map((s) => (
        <Ball key={s} p={[s * cx, cy, surf(cx, cy) - 0.006]} r={[0.055 * blushK, 0.032 * blushK, 0.012]} rot={[0, s * 0.55, 0]} mat={m.blush} shadow={false} />
      ))}
      {nose && (
        <Ball
          p={[0, noseY, surf(0, noseY) + 0.002]}
          r={nose === 'ink' ? [0.036, 0.025, 0.022] : [0.026, 0.018, 0.016]}
          mat={nose === 'ink' ? m.ink : m.pink}
          shadow={false}
        />
      )}
      {mouth === 'smile' && (
        <mesh material={m.ink} position={[0, my, mz]} rotation={[-0.25, 0, Math.PI]}>
          <torusGeometry args={[0.022, 0.0075, 8, 20, Math.PI]} />
        </mesh>
      )}
      {mouth === 'cat' &&
        [-1, 1].map((s) => (
          <mesh key={s} material={m.ink} position={[s * 0.017, my + 0.008, mz]} rotation={[-0.25, 0, Math.PI]}>
            <torusGeometry args={[0.017, 0.0065, 8, 20, Math.PI]} />
          </mesh>
        ))}
      {mouth === 'wide' && (
        <mesh material={m.ink} position={[0, y - 0.13, surf(0, y - 0.16) - 0.012]} rotation={[-0.35, 0, Math.PI]}>
          <torusGeometry args={[0.06, 0.008, 8, 28, Math.PI]} />
        </mesh>
      )}
    </>
  );
}

/** Little gold crown with a gem. */
function Crown({ m, p, s = 1 }: { m: Mats; p: V3; s?: number }) {
  return (
    <group position={p} rotation={[-0.1, 0, 0.12]} scale={s}>
      <mesh material={m.gold} castShadow>
        <cylinderGeometry args={[0.13, 0.12, 0.08, 24, 1, true]} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <mesh key={i} material={m.gold} position={[Math.sin(a) * 0.12, 0.08, Math.cos(a) * 0.12]} castShadow>
            <coneGeometry args={[0.035, 0.09, 12]} />
          </mesh>
        );
      })}
      <Ball p={[0, 0, 0.13]} r={0.028} mat={m.accent} />
    </group>
  );
}

/** Ring around the body at height y (world), sized to the body ellipsoid there; optional bell. */
function Collar({ m, c, r, y, bell, mat }: { m: Mats; c: V3; r: V3; y: number; bell?: boolean; mat?: THREE.Material }) {
  const k = Math.sqrt(Math.max(0, 1 - ((y - c[1]) / r[1]) ** 2));
  const rx = r[0] * k;
  const rz = r[2] * k;
  return (
    <group position={[0, y, 0]}>
      <mesh material={mat ?? m.accent} rotation-x={Math.PI / 2} scale={[rx, rz, 1]} castShadow>
        <torusGeometry args={[1, 0.022 / Math.min(rx, rz), 12, 48]} />
      </mesh>
      {bell && <Ball p={[0, -0.035, rz + 0.03]} r={0.045} mat={m.gold} />}
    </group>
  );
}

function Bow({ m, p, rot = [0, 0, 0], s = 1 }: { m: Mats; p: V3; rot?: V3; s?: number }) {
  return (
    <group position={p} rotation={rot} scale={s}>
      {[-1, 1].map((k) => (
        <Ball key={k} p={[k * 0.055, 0, 0]} r={[0.055, 0.04, 0.025]} rot={[0, 0, k * 0.3]} mat={m.accent} />
      ))}
      <Ball p={[0, 0, 0.01]} r={0.025} mat={m.accent} />
    </group>
  );
}

/** Cone ear with a pink (or custom) inner ear and optional dark tip. */
function PointyEar({ m, p, side, r, h, tip, inner }: { m: Mats; p: V3; side: number; r: number; h: number; tip?: boolean; inner?: THREE.Material }) {
  return (
    <group position={p} rotation={[-0.15, 0, -side * 0.38]}>
      <mesh material={m.body} position={[0, h / 2, 0]} scale={[1, 1, 0.7]} castShadow>
        <coneGeometry args={[r, h, 20]} />
      </mesh>
      <mesh material={inner ?? m.pink} position={[0, h * 0.42, r * 0.38]} scale={[1, 1, 0.35]}>
        <coneGeometry args={[r * 0.58, h * 0.68, 16]} />
      </mesh>
      {tip && (
        <mesh material={m.dark} position={[0, h * 0.86, 0]} scale={[1, 1, 0.72]}>
          <coneGeometry args={[r * 0.3, h * 0.3, 16]} />
        </mesh>
      )}
    </group>
  );
}

function Feet({ refs, m, y = 0.06, gap = 0.16, z = 0.16, s = 1 }: { refs: Refs; m: THREE.Material; y?: number; gap?: number; z?: number; s?: number }) {
  return (
    <>
      {(['legFL', 'legFR'] as const).map((name, i) => (
        <Part key={name} name={name} refs={refs} p={[(i ? 1 : -1) * gap, y + 0.06, z - 0.04]}>
          <Ball p={[0, -0.06, 0.04]} r={[0.1 * s, 0.065 * s, 0.11 * s]} mat={m} />
        </Part>
      ))}
    </>
  );
}


// ---- Body frame shared by most species ----
// Baby: one round ball that is all head (classic chibi).
// Adult: the same head, a bit smaller, sitting on its own body, with arms and bigger feet.

type SpeciesProps = { refs: Refs; m: Mats; adult: boolean };

const HEAD0: V3 = [0, 0, 0];
const CRIT_C: V3 = [0, 0.4, 0];
const CRIT_R: V3 = [0.42, 0.37, 0.38];
const ADULT_BODY: Ell = [
  [0, 0.31, 0],
  [0.3, 0.28, 0.27],
];
const ADULT_HEAD_C: V3 = [0, 0.76, 0.03];
const ADULT_HEAD_S = 0.88;
const BABY_REAR: V3 = [0, 0.22, -0.33];

/** Baby hair curl / fluff on top of the head (head-local, y = top of head). */
function Tuft({ m, y, mat }: { m: Mats; y: number; mat?: THREE.Material }) {
  const mt = mat ?? m.body;
  return (
    <group position={[0, y - 0.03, 0.02]} rotation={[0.25, 0, 0]}>
      <Ball p={[0, 0, 0]} r={[0.06, 0.055, 0.05]} mat={mt} />
      <Ball p={[0.035, 0.055, 0]} r={[0.04, 0.04, 0.035]} mat={mt} />
      <Ball p={[0.07, 0.085, 0]} r={0.024} mat={mt} />
    </group>
  );
}

/** Height on the adult body where a collar/scarf sits, below the head. */
const neckY = (b: Ell) => b[0][1] + b[1][1] * 0.5;

function Critter({
  refs,
  m,
  adult,
  C = CRIT_C,
  R = CRIT_R,
  head,
  bodyExtra,
  extra,
  tail,
  belly,
  feet,
  feetGap = 0.16,
  arms,
  hand,
  tuft = true,
}: SpeciesProps & {
  C?: V3;
  R?: V3;
  /** head-local extras (ears, face, hats); identical in both forms */
  head: ReactNode;
  bodyExtra?: (body: Ell | null) => ReactNode;
  /** root-level extras (e.g. wings) */
  extra?: (body: Ell | null) => ReactNode;
  tail?: ReactNode;
  belly?: boolean;
  feet?: THREE.Material;
  feetGap?: number;
  /** adult arms; false for species with wings */
  arms?: THREE.Material | false;
  /** item held in the adult's right hand */
  hand?: ReactNode;
  /** baby hair curl; off when the head top is already busy (frog eye bumps) */
  tuft?: boolean;
}) {
  const body = adult ? ADULT_BODY : null;
  const [bc, br] = body ?? [C, R];
  const rear: V3 = body ? [0, bc[1] - 0.04, bc[2] - br[2] + 0.03] : BABY_REAR;
  return (
    <>
      <Part name="body" refs={refs} p={[0, 0, 0]}>
        {body && <Ball p={bc} r={br} mat={m.body} />}
        {belly &&
          (body ? (
            <Ball p={[0, bc[1] - 0.03, bc[2] + br[2] - 0.11]} r={[0.19, 0.17, 0.13]} mat={m.belly} />
          ) : (
            <Ball p={[0, 0.2, 0.17]} r={[0.22, 0.15, 0.2]} mat={m.belly} />
          ))}
        {bodyExtra?.(body)}
      </Part>
      <Part name="head" refs={refs} p={body ? ADULT_HEAD_C : C}>
        {/* babies are squishier mochi: a touch wider and shorter */}
        <group scale={body ? ADULT_HEAD_S : [1.05, 0.94, 1.03]}>
          <Ball p={HEAD0} r={R} mat={m.body} />
          {head}
          {!body && tuft && <Tuft m={m} y={R[1]} />}
        </group>
      </Part>
      {tail && (
        <Part name="tail" refs={refs} p={rear}>
          {tail}
        </Part>
      )}
      {body &&
        arms !== false &&
        [-1, 1].map((s) => (
          <Part key={s} name={s < 0 ? 'wingL' : 'wingR'} refs={refs} p={[s * (br[0] - 0.03), bc[1] + br[1] * 0.4, bc[2] + 0.05]}>
            <Ball p={[s * 0.035, -0.085, 0.02]} r={[0.065, 0.11, 0.07]} rot={[0.2, 0, s * 0.35]} mat={arms ?? m.body} />
            {s > 0 && hand}
          </Part>
        ))}
      {extra?.(body)}
      <Feet refs={refs} m={feet ?? m.body} gap={body ? 0.13 : feetGap} z={body ? 0.12 : 0.16} s={body ? 1.15 : 1} />
    </>
  );
}

// ---- Fantasy pets ----

// Cloud puff: one smooth scalloped body. Adult: bigger, gold crown, little puff arms.
const BLOB_C: V3 = [0, 0.4, 0];
const BLOB_R: V3 = [0.38, 0.32, 0.34];
const BLOB_GEO = puffGeometry(
  BLOB_R,
  [
    [-0.8, 0.5, -0.15, 0.13],
    [0.8, 0.5, -0.15, 0.13],
    [-0.32, 1, -0.15, 0.15],
    [0.34, 1, -0.15, 0.15],
    [-1, -0.25, -0.15, 0.12],
    [1, -0.25, -0.15, 0.12],
    [0, 0.6, -0.8, 0.12],
    [-0.6, 0.3, -0.8, 0.1],
    [0.6, 0.3, -0.8, 0.1],
  ],
  16,
);

function Blob({ refs, m, adult }: SpeciesProps) {
  const k = adult ? 1.2 : 1;
  return (
    <group scale={k}>
      <Part name="body" refs={refs} p={[0, 0.02, 0]}>
        <mesh geometry={BLOB_GEO} material={m.body} position={BLOB_C} castShadow />
        <Part name="head" refs={refs} p={BLOB_C}>
          <Face refs={refs} m={m} gap={0.11} y={0.04} surf={(x, y) => frontZ([0, 0, 0], BLOB_R, x, y)} />
          {adult ? <Crown m={m} p={[0, 0.44, 0.02]} /> : <Tuft m={m} y={0.44} />}
        </Part>
      </Part>
      {adult &&
        [-1, 1].map((s) => (
          <Part key={s} name={s < 0 ? 'wingL' : 'wingR'} refs={refs} p={[s * 0.4, 0.34, 0.08]}>
            <Ball p={[s * 0.05, -0.02, 0]} r={[0.09, 0.075, 0.08]} mat={m.body} />
          </Part>
        ))}
    </group>
  );
}

// Jelly bean dragon. Adult: proper head on a body, big wings and horns, back spikes, longer tail.
const DRAKO_C: V3 = [0, 0.43, 0];
const DRAKO_R: V3 = [0.38, 0.42, 0.36];

function Drako({ refs, m, adult }: SpeciesProps) {
  const hornH = adult ? 0.22 : 0.12;
  const wing = adult ? 1.35 : 0.9;
  const tailK = adult ? 1.35 : 1;
  return (
    <Critter
      refs={refs}
      m={m}
      adult={adult}
      C={DRAKO_C}
      R={DRAKO_R}
      belly
      arms={false}
      head={
        <>
          {[-1, 1].map((s) => (
            <mesh key={s} material={m.light} position={[s * 0.15, 0.37 + hornH / 2, -0.04]} rotation={[-0.25, 0, -s * 0.35]} castShadow>
              <coneGeometry args={[0.055, hornH, 16]} />
            </mesh>
          ))}
          <Face refs={refs} m={m} gap={0.13} y={0.09} surf={(x, y) => frontZ(HEAD0, DRAKO_R, x, y)} />
        </>
      }
      bodyExtra={(b) => {
        const [c, r] = b ?? [DRAKO_C, DRAKO_R];
        return [0.75, 0.45, 0.15].map((t, i) => {
          const y = c[1] - r[1] + t * 2 * r[1] * 0.85;
          const z = c[2] - frontZ([0, c[1], 0], r, 0, y) + 0.02;
          return (
            <mesh key={i} material={m.accent} position={[0, y, z]} rotation={[-1.9 + i * 0.35, 0, 0]} castShadow>
              <coneGeometry args={[0.05, adult ? 0.13 : 0.1, 12]} />
            </mesh>
          );
        });
      }}
      extra={(b) =>
        [-1, 1].map((s) => (
          <Part
            key={s}
            name={s < 0 ? 'wingL' : 'wingR'}
            refs={refs}
            p={b ? [s * 0.16, b[0][1] + b[1][1] * 0.25, b[0][2] - b[1][2] + 0.04] : [s * 0.26, 0.55, -0.24]}
          >
            <Ball p={[s * 0.15 * wing, 0.04, 0]} r={[0.17 * wing, 0.11 * wing, 0.025]} rot={[0, s * 0.5, s * 0.35]} mat={m.dark} />
          </Part>
        ))
      }
      tail={
        <group scale={tailK} position={[0, -0.04, 0]}>
          <mesh material={m.body} position={[0, 0, -0.1]} rotation={[-1.25, 0, 0]} castShadow>
            <coneGeometry args={[0.07, 0.24, 16]} />
          </mesh>
          <Ball p={[0, 0.04, -0.22]} r={[0.07, 0.05, 0.04]} rot={[0.3, 0, Math.PI / 4]} mat={m.accent} />
        </group>
      }
    />
  );
}

// ---- Real-pet chibis ----

// Mochi pup: floppy ears, button nose. Adult: longer ears, headphones.
function Pup({ refs, m, adult }: SpeciesProps) {
  const surf = surfOf([HEAD0, CRIT_R]);
  return (
    <Critter
      refs={refs}
      m={m}
      adult={adult}
      belly={adult}
      head={
        <>
          {[-1, 1].map((s) => (
            <Ball key={s} p={[s * 0.36, adult ? 0.08 : 0.12, -0.02]} r={[0.09, adult ? 0.24 : 0.19, 0.08]} rot={[0, 0, s * 0.45]} mat={m.dark} />
          ))}
          <Face refs={refs} m={m} gap={0.13} y={0.07} surf={surf} nose="ink" />
          {adult && (
            <group position={[0, 0.02, -0.02]}>
              <mesh material={m.gear} castShadow>
                <torusGeometry args={[0.43, 0.03, 12, 48, Math.PI]} />
              </mesh>
              {[-1, 1].map((s) => (
                <group key={s} position={[s * 0.43, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <mesh material={m.gear} castShadow>
                    <cylinderGeometry args={[0.11, 0.11, 0.09, 28]} />
                  </mesh>
                  <mesh material={m.accent} position={[0, s * 0.05, 0]}>
                    <cylinderGeometry args={[0.07, 0.07, 0.02, 28]} />
                  </mesh>
                </group>
              ))}
            </group>
          )}
        </>
      }
      tail={<Ball p={[0, 0.06, -0.04]} r={0.08} mat={m.light} />}
    />
  );
}

// Cat: pointy ears, tabby stripes, whiskers. Adult: cheek tufts, long curled tail, bell collar.
function Cat({ refs, m, adult }: SpeciesProps) {
  const surf = surfOf([HEAD0, CRIT_R]);
  const segs = adult ? 7 : 4;
  const tailH = adult ? 0.5 : 0.3;
  return (
    <Critter
      refs={refs}
      m={m}
      adult={adult}
      belly
      feet={m.belly}
      arms={m.body}
      bodyExtra={(b) => b && <Collar m={m} c={b[0]} r={b[1]} y={neckY(b)} bell />}
      head={
        <>
          {[-1, 1].map((s) => (
            <PointyEar key={s} m={m} side={s} p={[s * 0.2, 0.27, -0.02]} r={0.1} h={adult ? 0.21 : 0.17} />
          ))}
          {[-0.06, 0, 0.06].map((x, i) => (
            <Ball key={i} p={[x, 0.27 - (i === 1 ? 0 : 0.015), surf(x, 0.27) - 0.02]} r={[0.016, 0.045, 0.02]} rot={[-0.7, 0, -x * 3]} mat={m.dark} shadow={false} />
          ))}
          {adult &&
            [-1, 1].map((s) => (
              <mesh key={s} material={m.body} position={[s * 0.41, -0.08, 0.02]} rotation={[0, 0, s * -1.9]} castShadow>
                <coneGeometry args={[0.06, 0.13, 14]} />
              </mesh>
            ))}
          <Face refs={refs} m={m} gap={0.13} y={0.07} surf={surf} nose="pink" mouth="cat" />
          {[-1, 1].map((s) =>
            [0, 1].map((k) => (
              <mesh key={`${s}${k}`} material={m.ink} position={[s * 0.27, -0.02 - k * 0.03, surf(0.25, -0.02) - 0.02]} rotation={[0, 0, Math.PI / 2 + s * (k ? -0.12 : 0.1)]}>
                <cylinderGeometry args={[0.0035, 0.0035, 0.11, 6]} />
              </mesh>
            )),
          )}
        </>
      }
      tail={Array.from({ length: segs }, (_, i) => {
        const t = i / (segs - 1);
        return (
          <Ball
            key={i}
            p={[0, 0.02 + t * tailH, -0.05 - Math.sin(t * Math.PI * 0.85) * (adult ? 0.12 : 0.07)]}
            r={0.062 - t * 0.008}
            mat={i === segs - 1 ? m.dark : m.body}
          />
        );
      })}
    />
  );
}

// Bunny: long ears, fluffy tail. Adult: longer ears with a bow, holds a carrot.
function Bunny({ refs, m, adult }: SpeciesProps) {
  const surf = surfOf([HEAD0, CRIT_R]);
  const ear = adult ? 1.25 : 1;
  return (
    <Critter
      refs={refs}
      m={m}
      adult={adult}
      belly
      head={
        <>
          {[-1, 1].map((s) => (
            <group key={s} position={[s * 0.12, 0.3, -0.03]} rotation={[-0.15, 0, -s * 0.14]} scale={[1, ear, 1]}>
              <Ball p={[0, 0.19, 0]} r={[0.075, 0.21, 0.055]} mat={m.body} />
              <Ball p={[0, 0.19, 0.035]} r={[0.042, 0.15, 0.025]} mat={m.pink} shadow={false} />
            </group>
          ))}
          {adult && <Bow m={m} p={[0.15, 0.36, 0.03]} rot={[0, 0, -0.4]} />}
          <Face refs={refs} m={m} gap={0.13} y={0.06} surf={surf} nose="pink" mouth="cat" />
        </>
      }
      hand={
        <group position={[-0.02, -0.17, 0.12]} rotation={[0.9, 0, 0.9]} scale={1.3}>
          <mesh material={m.orange} rotation={[Math.PI, 0, 0]} castShadow>
            <coneGeometry args={[0.035, 0.16, 14]} />
          </mesh>
          {[-1, 0, 1].map((k) => (
            <Ball key={k} p={[k * 0.018, 0.1, 0]} r={[0.012, 0.04, 0.012]} rot={[0, 0, k * 0.4]} mat={m.leaf} />
          ))}
        </group>
      }
      tail={<Ball p={[0, 0.02, -0.04]} r={adult ? 0.12 : 0.1} mat={m.belly} />}
    />
  );
}

// Bear: round ears, light muzzle. Adult: belly patch, scarf.
function Bear({ refs, m, adult }: SpeciesProps) {
  const muzzleC: V3 = [0, -0.06, frontZ(HEAD0, CRIT_R, 0, -0.06) - 0.05];
  const muzzleR: V3 = [0.13, 0.09, 0.08];
  const surf = surfOf([HEAD0, CRIT_R], [muzzleC, muzzleR]);
  return (
    <Critter
      refs={refs}
      m={m}
      adult={adult}
      belly={adult}
      bodyExtra={(b) =>
        b && (
          <>
            <Collar m={m} c={b[0]} r={b[1]} y={neckY(b)} />
            <Ball p={[0.13, neckY(b) - 0.08, b[1][2] - 0.02]} r={[0.05, 0.09, 0.03]} rot={[0.2, 0, 0.3]} mat={m.accent} />
          </>
        )
      }
      head={
        <>
          {[-1, 1].map((s) => (
            <group key={s} position={[s * 0.26, 0.27, -0.03]}>
              <Ball p={[0, 0, 0]} r={[0.1, 0.1, 0.07]} mat={m.body} />
              <Ball p={[0, -0.005, 0.045]} r={[0.055, 0.055, 0.03]} mat={m.light} shadow={false} />
            </group>
          ))}
          <Ball p={muzzleC} r={muzzleR} mat={m.belly} />
          <Face refs={refs} m={m} gap={0.14} y={0.08} surf={surf} nose="ink" noseY={-0.02} />
        </>
      }
      tail={<Ball p={[0, 0.02, -0.02]} r={0.065} mat={m.body} />}
    />
  );
}

// Fox: big tipped ears, white muzzle, bushy tail. Adult: chest fluff, bigger tail, scarf.
function Fox({ refs, m, adult }: SpeciesProps) {
  const muzzleC: V3 = [0, -0.07, frontZ(HEAD0, CRIT_R, 0, -0.07) - 0.07];
  const muzzleR: V3 = [0.2, 0.11, 0.1];
  const surf = surfOf([HEAD0, CRIT_R], [muzzleC, muzzleR]);
  return (
    <Critter
      refs={refs}
      m={m}
      adult={adult}
      belly
      feet={m.dark}
      arms={m.dark}
      bodyExtra={(b) =>
        b && <Ball p={[0, neckY(b) - 0.02, b[0][2] + b[1][2] - 0.06]} r={[0.15, 0.11, 0.09]} mat={m.belly} />
      }
      head={
        <>
          {[-1, 1].map((s) => (
            <PointyEar key={s} m={m} side={s} p={[s * 0.2, 0.26, -0.03]} r={0.12} h={adult ? 0.27 : 0.22} tip inner={m.belly} />
          ))}
          <Ball p={muzzleC} r={muzzleR} mat={m.belly} />
          <Face refs={refs} m={m} gap={0.13} y={0.08} surf={surf} nose="ink" noseY={-0.04} />
        </>
      }
      tail={
        <group scale={adult ? 1.4 : 1}>
          <Ball p={[0, 0.07, -0.13]} r={[0.13, 0.13, 0.22]} rot={[0.7, 0, 0]} mat={m.body} />
          <Ball p={[0, 0.2, -0.27]} r={[0.1, 0.1, 0.11]} rot={[0.7, 0, 0]} mat={m.belly} />
        </group>
      }
    />
  );
}

// Hamster: chubby with cheek pouches and buck teeth. Adult: bow, hugs a sunflower seed.
const HAM_C: V3 = [0, 0.37, 0];
const HAM_R: V3 = [0.44, 0.35, 0.4];

function Hamster({ refs, m, adult }: SpeciesProps) {
  const cheeks: Ell[] = [-1, 1].map((s) => [[s * 0.2, -0.07, frontZ(HEAD0, HAM_R, 0.2, -0.07) - 0.1], [0.13, 0.11, 0.12]]);
  const surf = surfOf([HEAD0, HAM_R], ...cheeks);
  const noseY = -0.02;
  return (
    <Critter
      refs={refs}
      m={m}
      adult={adult}
      C={HAM_C}
      R={HAM_R}
      belly
      feet={m.pink}
      feetGap={0.15}
      bodyExtra={(b) =>
        b && (
          <group position={[0, b[0][1] + 0.02, b[0][2] + b[1][2] + 0.02]} rotation={[-0.3, 0, 0.15]}>
            <Ball p={[0, 0, 0]} r={[0.055, 0.085, 0.035]} mat={m.seed} />
            {[-1, 1].map((k) => (
              <Ball key={k} p={[k * 0.022, 0, 0.026]} r={[0.008, 0.07, 0.01]} mat={m.light} shadow={false} />
            ))}
          </group>
        )
      }
      head={
        <>
          {[-1, 1].map((s) => (
            <group key={s} position={[s * 0.25, 0.25, -0.04]}>
              <Ball p={[0, 0, 0]} r={[0.075, 0.075, 0.05]} mat={m.body} />
              <Ball p={[0, 0, 0.03]} r={[0.045, 0.045, 0.025]} mat={m.pink} shadow={false} />
            </group>
          ))}
          {cheeks.map(([c, r], i) => (
            <Ball key={i} p={c} r={r} mat={m.belly} />
          ))}
          {adult && <Bow m={m} p={[-0.13, 0.31, 0.06]} rot={[-0.4, 0, 0.35]} />}
          <Face refs={refs} m={m} gap={0.12} y={0.07} surf={surf} nose="pink" noseY={noseY} mouth="cat" />
          {[-1, 1].map((s) => (
            <mesh key={s} material={m.white} position={[s * 0.011, noseY - 0.072, surf(0, noseY - 0.07) - 0.004]}>
              <boxGeometry args={[0.018, 0.024, 0.008]} />
            </mesh>
          ))}
        </>
      }
    />
  );
}

// Frog: eyes on top bumps, wide grin. Adult: frog prince crown.
const FROG_C: V3 = [0, 0.34, 0];
const FROG_R: V3 = [0.46, 0.32, 0.4];

function Frog({ refs, m, adult }: SpeciesProps) {
  const bumps: Ell[] = [-1, 1].map((s) => [[s * 0.17, 0.25, 0.04], [0.13, 0.13, 0.12]]);
  const surf = surfOf([HEAD0, FROG_R], ...bumps);
  return (
    <Critter
      refs={refs}
      m={m}
      adult={adult}
      C={FROG_C}
      R={FROG_R}
      tuft={false}
      belly
      feet={m.dark}
      feetGap={0.2}
      head={
        <>
          {bumps.map(([c, r], i) => (
            <Ball key={i} p={c} r={r} mat={m.body} />
          ))}
          {adult && <Crown m={m} p={[0, 0.33, -0.04]} s={0.85} />}
          <Face refs={refs} m={m} gap={0.17} y={0.27} surf={surf} mouth="wide" />
        </>
      }
    />
  );
}

// Penguin: white face mask and belly, beak, flippers. Adult: grows tall, head tuft, bow tie.
function Penguin({ refs, m, adult }: SpeciesProps) {
  const R: V3 = adult ? [0.42, 0.56, 0.4] : [0.38, 0.44, 0.36];
  const C: V3 = [0, R[1], 0];
  const maskC: V3 = [0, -R[1] * 0.14, R[2] * 0.28];
  const maskR: V3 = [R[0] * 0.82, R[1] * 0.82, R[2] * 0.86];
  const surf = surfOf([HEAD0, R], [maskC, maskR]);
  const faceY = R[1] * 0.25;
  const flip = adult ? 1.3 : 1;
  return (
    <>
      <Part name="body" refs={refs} p={[0, 0, 0]}>
        <Ball p={C} r={R} mat={m.body} />
        <Ball p={[maskC[0], C[1] + maskC[1], maskC[2]]} r={maskR} mat={m.belly} />
        {adult && <Bow m={m} p={[0, C[1] - R[1] * 0.32, surf(0, -R[1] * 0.32) + 0.01]} s={1.1} />}
      </Part>
      <Part name="head" refs={refs} p={C}>
        <Face refs={refs} m={m} gap={0.12} y={faceY} surf={surf} mouth="none" />
        <mesh material={m.orange} position={[0, faceY - 0.08, surf(0, faceY - 0.08) + 0.03]} rotation={[Math.PI / 2 - 0.15, 0, 0]} scale={[1.3, 1, 0.7]} castShadow>
          <coneGeometry args={[0.04, 0.08, 16]} />
        </mesh>
        {!adult && <Tuft m={m} y={R[1]} />}
        {adult &&
          [-1, 0, 1].map((k) => (
            <mesh key={k} material={m.body} position={[k * 0.04, R[1] - 0.01, 0.02]} rotation={[0.2, 0, -k * 0.5]} castShadow>
              <coneGeometry args={[0.03, 0.12, 12]} />
            </mesh>
          ))}
      </Part>
      {[-1, 1].map((s) => (
        <Part key={s} name={s < 0 ? 'wingL' : 'wingR'} refs={refs} p={[s * (R[0] - 0.03), C[1] + 0.05, -0.02]}>
          <Ball p={[s * 0.02, -0.14 * flip, 0]} r={[0.05, 0.17 * flip, 0.1]} rot={[0, 0, s * 0.25]} mat={m.body} />
        </Part>
      ))}
      <Feet refs={refs} m={m.orange} gap={0.13} s={adult ? 1.15 : 1} />
    </>
  );
}

export const SPECIES_VIEW: Record<Species, (p: SpeciesProps) => ReactNode> = {
  blob: Blob,
  pup: Pup,
  drako: Drako,
  cat: Cat,
  bunny: Bunny,
  bear: Bear,
  frog: Frog,
  penguin: Penguin,
  fox: Fox,
  hamster: Hamster,
};
