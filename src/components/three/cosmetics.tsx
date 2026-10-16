'use client';

// Cosmetic items, built from the same jelly primitives as the pets. Every item hangs off a slot anchor that each
// species places (head top, eyes, neck ring, back, right hand), so one item fits all ten species.

import { createContext, useContext, useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NO_LOADOUT, type Loadout } from '@/lib/cosmetics';
import type { V3 } from '@/lib/pets';
import { Ball } from './jelly';
import type { Mats } from './species';

/** Cosmetics the pet is wearing. An occupied slot replaces the species' own prop in that spot. */
export const LoadoutContext = createContext<Loadout>(NO_LOADOUT);

// ---- shared shapes ----

function starShape(inner = 0.45) {
  const s = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const a = Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 ? inner : 1;
    if (i) s.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    else s.moveTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  s.closePath();
  return s;
}

function heartShape() {
  const h = new THREE.Shape();
  h.moveTo(0, -1);
  h.bezierCurveTo(-0.2, -0.75, -1.1, -0.35, -1, 0.3);
  h.bezierCurveTo(-0.95, 0.85, -0.3, 1, 0, 0.55);
  h.bezierCurveTo(0.3, 1, 0.95, 0.85, 1, 0.3);
  h.bezierCurveTo(1.1, -0.35, 0.2, -0.75, 0, -1);
  return h;
}

const puffy = { depth: 0.3, bevelEnabled: true, bevelThickness: 0.15, bevelSize: 0.12, bevelSegments: 4, curveSegments: 20 };
const STAR_GEO = new THREE.ExtrudeGeometry(starShape(), puffy).center();
const HEART_GEO = new THREE.ExtrudeGeometry(heartShape(), puffy).center();

/** Chunky 3D star / heart, about 2·s wide, facing +z. */
function Star({ mat, p, s, rot }: { mat: THREE.Material; p: V3; s: number; rot?: V3 }) {
  return <mesh geometry={STAR_GEO} material={mat} position={p} rotation={rot} scale={[s, s, s * 0.6]} castShadow />;
}
function Heart({ mat, p, s, rot }: { mat: THREE.Material; p: V3; s: number; rot?: V3 }) {
  return <mesh geometry={HEART_GEO} material={mat} position={p} rotation={rot} scale={[s, s, s * 0.6]} castShadow />;
}

/** Half dome (hat crowns, caps). */
function Dome({ mat, r, sq = [1, 1, 1], p = [0, 0, 0] }: { mat: THREE.Material; r: number; sq?: V3; p?: V3 }) {
  return (
    <mesh material={mat} position={p} scale={sq} castShadow>
      <sphereGeometry args={[r, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
    </mesh>
  );
}

/** Points spread over a dome of radius r (squash sq), for seeds and spots. */
function domeDots(r: number, sq: V3, rings: [number, number][]) {
  const out: V3[] = [];
  for (const [phi, n] of rings)
    for (let i = 0; i < n; i++) {
      const th = (i / n) * Math.PI * 2 + phi * 3;
      out.push([r * sq[0] * Math.sin(phi) * Math.sin(th), r * sq[1] * Math.cos(phi), r * sq[2] * Math.sin(phi) * Math.cos(th)]);
    }
  return out;
}

/** Group that turns on its y axis (propellers) or sways around z (balloons). */
function Motion({ spin = 0, sway = 0, rate = 1.6, base = [0, 0, 0], p, children }: { spin?: number; sway?: number; rate?: number; base?: V3; p?: V3; children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((st, dt) => {
    const g = ref.current;
    if (!g) return;
    if (spin) g.rotation.y += spin * dt;
    if (sway) g.rotation.z = base[2] + Math.sin(st.clock.elapsedTime * rate) * sway;
  });
  return (
    <group ref={ref} position={p} rotation={base}>
      {children}
    </group>
  );
}

/** One wing that flaps around the body's vertical axis; side = -1 left, 1 right. */
function Wing({ side, rate, amp, children }: { side: number; rate: number; amp: number; children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((st) => {
    if (ref.current) ref.current.rotation.y = side * (0.55 + Math.sin(st.clock.elapsedTime * rate) * amp);
  });
  return (
    <group ref={ref} position={[side * 0.05, 0.03, -0.02]}>
      {children}
    </group>
  );
}

/** Ring of beads around the body ellipse at the neck (lei, pearls). */
function Beads({ rx, rz, n, r, mats }: { rx: number; rz: number; n: number; r: number; mats: THREE.Material[] }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        return <Ball key={i} p={[rx * Math.sin(a), 0, rz * Math.cos(a)]} r={r} mat={mats[i % mats.length]} />;
      })}
    </>
  );
}

/** Thin ring hugging the body ellipse; the tube stays `tube` thick on every axis. */
function Band({ rx, rz, tube, mat }: { rx: number; rz: number; tube: number; mat: THREE.Material }) {
  const k = Math.min(rx, rz);
  return (
    <mesh material={mat} rotation-x={Math.PI / 2} scale={[rx, rz, k]} castShadow>
      <torusGeometry args={[1, tube / k, 12, 48]} />
    </mesh>
  );
}

// ---- items that species also use as built-in props ----

/** Little gold crown with a gem. */
export function Crown({ m, p, s = 1 }: { m: Mats; p: V3; s?: number }) {
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

export function Bow({ m, p, rot = [0, 0, 0], s = 1, mat }: { m: Mats; p: V3; rot?: V3; s?: number; mat?: THREE.Material }) {
  const mt = mat ?? m.accent;
  return (
    <group position={p} rotation={rot} scale={s}>
      {[-1, 1].map((k) => (
        <Ball key={k} p={[k * 0.055, 0, 0]} r={[0.055, 0.04, 0.025]} rot={[0, 0, k * 0.3]} mat={mt} />
      ))}
      <Ball p={[0, 0, 0.01]} r={0.025} mat={mt} />
    </group>
  );
}

// ---- slots ----

/** Hat slot, head-local: y = top of the head. Items are built for a ~0.42 wide head; s rescales per species. */
export function HatSlot({ m, y, z = 0, s = 1 }: { m: Mats; y: number; z?: number; s?: number }) {
  const { hat } = useContext(LoadoutContext);
  if (hat === 'none') return null;
  return (
    <group position={[0, y, z]} scale={s}>
      {hat === 'party' && (
        <group position={[0.02, -0.02, 0]} rotation={[-0.1, 0, -0.2]}>
          <mesh material={m.cloth} position={[0, 0.13, 0]} castShadow>
            <coneGeometry args={[0.12, 0.28, 28]} />
          </mesh>
          {[0.06, 0.15].map((h) => (
            <mesh key={h} material={m.cream} position={[0, h - 0.01, 0]} rotation-x={Math.PI / 2}>
              <torusGeometry args={[0.12 * (1 - h / 0.28) + 0.004, 0.012, 8, 28]} />
            </mesh>
          ))}
          <Ball p={[0, 0.28, 0]} r={0.042} mat={m.cream} />
        </group>
      )}
      {hat === 'beanie' && (
        <group position={[0, -0.13, 0.01]} rotation={[-0.12, 0, 0]}>
          <Dome mat={m.cloth2} r={0.3} sq={[1.05, 0.75, 1]} />
          <mesh material={m.cream} rotation-x={Math.PI / 2} scale={[1.06, 1, 1]}>
            <torusGeometry args={[0.3, 0.045, 12, 40]} />
          </mesh>
          <Ball p={[0, 0.26, 0]} r={0.06} mat={m.cream} />
        </group>
      )}
      {hat === 'tophat' && (
        <group position={[0.02, -0.01, 0]} rotation={[-0.08, 0, -0.14]}>
          <mesh material={m.ink} castShadow>
            <cylinderGeometry args={[0.17, 0.17, 0.02, 32]} />
          </mesh>
          <mesh material={m.ink} position={[0, 0.11, 0]} castShadow>
            <cylinderGeometry args={[0.11, 0.115, 0.2, 32]} />
          </mesh>
          <mesh material={m.cloth} position={[0, 0.04, 0]}>
            <cylinderGeometry args={[0.118, 0.118, 0.04, 32]} />
          </mesh>
        </group>
      )}
      {hat === 'crown' && <Crown m={m} p={[0, 0.01, 0.02]} />}
      {hat === 'flower' && (
        <group position={[0.13, -0.03, 0.06]} rotation={[0.35, 0.2, -0.45]}>
          {[0, 1, 2, 3, 4].map((i) => {
            const a = (i / 5) * Math.PI * 2;
            return <Ball key={i} p={[Math.sin(a) * 0.05, Math.cos(a) * 0.05, 0]} r={[0.042, 0.032, 0.018]} rot={[0, 0, -a]} mat={m.pink} />;
          })}
          <Ball p={[0, 0, 0.012]} r={0.03} mat={m.gold} />
          <Ball p={[-0.06, -0.07, -0.01]} r={[0.05, 0.022, 0.012]} rot={[0, 0, 0.7]} mat={m.leaf} />
        </group>
      )}
      {hat === 'halo' && (
        <Motion sway={0.06} rate={1.2} p={[0, 0.13, 0]}>
          <mesh material={m.gold} rotation-x={Math.PI / 2 - 0.2} castShadow>
            <torusGeometry args={[0.15, 0.018, 12, 40]} />
          </mesh>
        </Motion>
      )}
      {hat === 'bunnyears' && (
        <group position={[0, -0.03, -0.02]}>
          <mesh material={m.cloth} position={[0, -0.3, 0]}>
            <torusGeometry args={[0.34, 0.022, 10, 40, Math.PI]} />
          </mesh>
          {[-1, 1].map((k) => (
            <group key={k} position={[k * 0.11, 0.02, 0]} rotation={[-0.15, 0, -k * 0.25]}>
              <Ball p={[0, 0.15, 0]} r={[0.06, 0.16, 0.04]} mat={m.cream} />
              <Ball p={[0, 0.15, 0.026]} r={[0.033, 0.11, 0.02]} mat={m.pink} shadow={false} />
            </group>
          ))}
        </group>
      )}
      {hat === 'froghat' && (
        <group position={[0, -0.1, 0]}>
          <Dome mat={m.leaf} r={0.27} sq={[1, 0.8, 1]} />
          <mesh material={m.leaf} rotation-x={Math.PI / 2}>
            <torusGeometry args={[0.28, 0.04, 10, 40]} />
          </mesh>
          {[-1, 1].map((k) => (
            <group key={k} position={[k * 0.1, 0.2, 0.07]}>
              <Ball p={[0, 0, 0]} r={0.07} mat={m.leaf} />
              <Ball p={[0, 0.01, 0.05]} r={[0.045, 0.05, 0.03]} mat={m.cream} shadow={false} />
              <Ball p={[0, 0.005, 0.075]} r={[0.025, 0.03, 0.015]} mat={m.ink} shadow={false} />
            </group>
          ))}
          <mesh material={m.ink} position={[0, 0.13, 0.205]} rotation={[-0.6, 0, Math.PI]}>
            <torusGeometry args={[0.04, 0.008, 8, 20, Math.PI]} />
          </mesh>
        </group>
      )}
      {hat === 'chef' && (
        <group position={[0, -0.03, 0]} rotation={[-0.1, 0, 0.08]}>
          <mesh material={m.cream} position={[0, 0.07, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.14, 0.16, 28]} />
          </mesh>
          <Ball p={[0, 0.22, 0]} r={0.13} mat={m.cream} />
          {[-1, 1].map((k) => (
            <Ball key={`x${k}`} p={[k * 0.1, 0.18, 0]} r={0.1} mat={m.cream} />
          ))}
          {[-1, 1].map((k) => (
            <Ball key={`z${k}`} p={[0, 0.18, k * 0.09]} r={0.1} mat={m.cream} />
          ))}
        </group>
      )}
      {hat === 'witch' && (
        <group position={[0, -0.01, 0]} rotation={[-0.12, 0, -0.1]}>
          <mesh material={m.lav} castShadow>
            <cylinderGeometry args={[0.26, 0.26, 0.02, 36]} />
          </mesh>
          <mesh material={m.lav} position={[0, 0.2, 0]} castShadow>
            <coneGeometry args={[0.15, 0.38, 28]} />
          </mesh>
          <mesh material={m.sun} position={[0, 0.03, 0]}>
            <cylinderGeometry args={[0.142, 0.145, 0.045, 28]} />
          </mesh>
          <mesh material={m.lav} position={[0.05, 0.41, -0.01]} rotation={[0, 0, -0.9]} castShadow>
            <coneGeometry args={[0.045, 0.13, 16]} />
          </mesh>
          <Star mat={m.sun} p={[0, 0.03, 0.15]} s={0.032} />
        </group>
      )}
      {hat === 'strawberry' && (
        <group position={[0, -0.12, 0.01]} rotation={[-0.1, 0, 0]}>
          <Dome mat={m.berry} r={0.29} sq={[1.04, 0.95, 1]} />
          {domeDots(0.29, [1.05, 0.96, 1.01], [
            [0.55, 6],
            [1.0, 9],
            [1.35, 10],
          ]).map((p, i) => (
            <Ball key={i} p={p} r={[0.014, 0.02, 0.012]} mat={m.cream} shadow={false} />
          ))}
          {[0, 1, 2, 3, 4].map((i) => {
            const a = (i / 5) * Math.PI * 2;
            return <Ball key={i} p={[Math.sin(a) * 0.07, 0.27, Math.cos(a) * 0.07]} r={[0.075, 0.02, 0.035]} rot={[0, a + Math.PI / 2, -0.3]} mat={m.leaf} />;
          })}
          <mesh material={m.leaf} position={[0, 0.31, 0]}>
            <cylinderGeometry args={[0.014, 0.018, 0.07, 10]} />
          </mesh>
        </group>
      )}
      {hat === 'mushroom' && (
        <group position={[0, -0.11, 0]} rotation={[-0.08, 0, 0.1]}>
          <Dome mat={m.berry} r={0.34} sq={[1, 0.62, 1]} />
          {domeDots(0.34, [1.01, 0.63, 1.01], [
            [0.05, 1],
            [0.75, 5],
            [1.25, 7],
          ]).map((p, i) => (
            <Ball key={i} p={p} r={[0.045, 0.03, 0.045]} mat={m.cream} shadow={false} />
          ))}
        </group>
      )}
      {hat === 'propeller' && (
        <group position={[0, -0.12, 0]}>
          <Dome mat={m.cloth2} r={0.27} sq={[1.05, 0.7, 1]} />
          {[0, 1, 2].map((i) => (
            <mesh key={i} material={i % 2 ? m.sun : m.cloth} rotation={[0, (i * Math.PI) / 3, 0]} scale={[1.06, 0.71, 1.01]}>
              <sphereGeometry args={[0.27, 32, 8, 0, 0.35, 0, Math.PI / 2]} />
            </mesh>
          ))}
          <Ball p={[0, 0.0, 0.25]} r={[0.13, 0.02, 0.09]} mat={m.cloth} />
          <mesh material={m.gold} position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.08, 8]} />
          </mesh>
          <Motion spin={7} p={[0, 0.26, 0]}>
            <Ball p={[0.11, 0, 0]} r={[0.11, 0.012, 0.035]} rot={[0.3, 0, 0]} mat={m.sun} />
            <Ball p={[-0.11, 0, 0]} r={[0.11, 0.012, 0.035]} rot={[-0.3, 0, 0]} mat={m.cloth} />
            <Ball p={[0, 0, 0]} r={0.024} mat={m.gold} />
          </Motion>
        </group>
      )}
      {hat === 'starclip' && (
        <>
          <Star mat={m.sun} p={[0.14, -0.05, 0.1]} s={0.05} rot={[0.3, 0.4, -0.3]} />
          <Star mat={m.cloth2} p={[0.22, -0.1, 0.03]} s={0.03} rot={[0.2, 0.8, 0.4]} />
          <Heart mat={m.pink} p={[0.06, -0.01, 0.13]} s={0.025} rot={[0.4, 0.2, -0.2]} />
        </>
      )}
    </group>
  );
}

/** Face slot: sits over both eyes (eye gap, height and surface come from Face). */
export function FaceSlot({ m, gap, y, z, k, surf }: { m: Mats; gap: number; y: number; z: number; k: number; surf: (x: number, y: number) => number }) {
  const { face } = useContext(LoadoutContext);
  if (face === 'none') return null;
  if (face === 'stickers') {
    const cy = y - 0.1 * k;
    const cx = gap + 0.09;
    return (
      <>
        <Star mat={m.sun} p={[-cx, cy, surf(cx, cy) + 0.006]} s={0.03} rot={[0, -0.55, 0.2]} />
        <Heart mat={m.pink} p={[cx, cy, surf(cx, cy) + 0.006]} s={0.026} rot={[0, 0.55, -0.15]} />
      </>
    );
  }
  const ring = 0.082 * k;
  const bridge = Math.max(0.02, 2 * gap - 2 * ring * Math.cos(0.34));
  const frame = face === 'glasses' ? m.gold : face === 'shades' ? m.ink : face === 'hearts' ? m.cloth : m.sun;
  return (
    <group position={[0, y, z + 0.035]}>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * gap, 0, 0]} rotation={[-0.12, s * 0.34, 0]}>
          {face === 'glasses' && (
            <>
              <mesh material={m.lens} position={[0, 0, 0.002]}>
                <circleGeometry args={[ring, 32]} />
              </mesh>
              <mesh material={m.gold}>
                <torusGeometry args={[ring, 0.01, 10, 36]} />
              </mesh>
            </>
          )}
          {face === 'shades' && (
            <>
              <Ball p={[0, 0, 0.004]} r={[ring * 1.08, ring * 0.92, 0.018]} mat={m.ink} shadow={false} />
              <mesh material={m.ink} scale={[1.08, 0.92, 1]}>
                <torusGeometry args={[ring, 0.01, 10, 36]} />
              </mesh>
              <Ball p={[-ring * 0.4, ring * 0.35, 0.02]} r={[0.018, 0.012, 0.006]} mat={m.white} shadow={false} />
            </>
          )}
          {face === 'hearts' && (
            <>
              <Heart mat={m.cloth} p={[0, 0, 0.006]} s={ring * 1.05} />
              <Ball p={[-ring * 0.45, ring * 0.3, 0.035]} r={[0.016, 0.011, 0.006]} mat={m.white} shadow={false} />
            </>
          )}
          {face === 'stars' && (
            <>
              <Star mat={m.sun} p={[0, 0, 0.006]} s={ring * 1.25} />
              <Ball p={[-ring * 0.3, ring * 0.35, 0.035]} r={[0.014, 0.01, 0.006]} mat={m.white} shadow={false} />
            </>
          )}
        </group>
      ))}
      <mesh material={frame} position={[0, 0.012, 0.012]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.008, 0.008, bridge, 8]} />
      </mesh>
    </group>
  );
}

/** Neck slot: wraps the body ellipsoid (c, r) at height y, same frame as Collar. */
export function NeckSlot({ m, c, r, y }: { m: Mats; c: V3; r: V3; y: number }) {
  const { neck } = useContext(LoadoutContext);
  if (neck === 'none') return null;
  const k = Math.sqrt(Math.max(0, 1 - ((y - c[1]) / r[1]) ** 2));
  const rx = r[0] * k + 0.015;
  const rz = r[2] * k + 0.015;
  const front: V3 = [c[0], y, c[2] + rz];
  if (neck === 'bowtie') return <Bow m={m} mat={m.cloth} p={[front[0], y, front[2] + 0.02]} s={0.95} />;
  return (
    <group position={[c[0], y, c[2]]}>
      {neck === 'scarf' && (
        <>
          <Band rx={rx} rz={rz} tube={0.045} mat={m.cloth} />
          <Ball p={[0.12, -0.08, rz * 0.92]} r={[0.05, 0.1, 0.026]} rot={[0.25, 0, 0.25]} mat={m.cloth} />
          <Ball p={[0.18, -0.06, rz * 0.82]} r={[0.045, 0.085, 0.024]} rot={[0.25, 0.4, 0.55]} mat={m.cloth} />
        </>
      )}
      {neck === 'lei' && <Beads rx={rx + 0.01} rz={rz + 0.01} n={18} r={0.042} mats={[m.pink, m.cream, m.sun, m.berry]} />}
      {neck === 'pearls' && (
        <>
          <Beads rx={rx} rz={rz} n={24} r={0.026} mats={[m.cream]} />
          <Ball p={[0, -0.05, rz + 0.01]} r={0.04} mat={m.pink} />
        </>
      )}
      {neck === 'bandana' && (
        <>
          <Band rx={rx} rz={rz} tube={0.022} mat={m.cloth2} />
          <mesh material={m.cloth2} position={[0, -0.06, rz + 0.005]} rotation={[Math.PI - 0.25, 0, 0]} scale={[1, 1, 0.3]} castShadow>
            <coneGeometry args={[0.13, 0.16, 3]} />
          </mesh>
          {[
            [-0.05, -0.03],
            [0.05, -0.03],
            [0, -0.08],
          ].map(([x, yy], i) => (
            <Ball key={i} p={[x, yy, rz + 0.035]} r={[0.012, 0.012, 0.005]} mat={m.cream} shadow={false} />
          ))}
        </>
      )}
      {neck === 'bell' && (
        <>
          <Band rx={rx} rz={rz} tube={0.024} mat={m.cloth} />
          <Ball p={[0, -0.04, rz + 0.03]} r={0.048} mat={m.gold} />
          <Ball p={[0, -0.07, rz + 0.06]} r={[0.02, 0.008, 0.01]} mat={m.ink} shadow={false} />
        </>
      )}
    </group>
  );
}

/** Back slot: centred on the back of the body ellipsoid (c, r). */
export function BackSlot({ m, c, r }: { m: Mats; c: V3; r: V3 }) {
  const { back } = useContext(LoadoutContext);
  if (back === 'none') return null;
  const y = c[1] + r[1] * 0.15;
  const z = c[2] - r[2] * 0.97;
  if (back === 'cape') {
    // hangs from the shoulders down the back half only, tipped back so it drapes instead of wrapping like a skirt
    const top = c[1] + r[1] * 0.85;
    const h = r[1] * 1.5;
    return (
      <group position={[c[0], top, c[2] - r[2] * 0.25]} rotation-x={-0.22}>
        <mesh material={m.cape} position={[0, -h / 2, 0]} castShadow>
          <cylinderGeometry args={[r[0] * 0.55, r[0] * 1.15, h, 32, 1, true, Math.PI / 2 + 0.25, Math.PI - 0.5]} />
        </mesh>
        <mesh material={m.gold} rotation={[-Math.PI / 2, 0, 0.25]}>
          <torusGeometry args={[r[0] * 0.55, 0.018, 8, 32, Math.PI - 0.5]} />
        </mesh>
        <Star mat={m.sun} p={[0, -h * 0.45, -r[0] * 0.86]} s={0.05} rot={[0.12, Math.PI, 0]} />
      </group>
    );
  }
  return (
    <group position={[c[0], y, z]}>
      {back === 'angel' &&
        [-1, 1].map((s) => (
          <Wing key={s} side={s} rate={2.2} amp={0.12}>
            <Ball p={[s * 0.17, 0.05, 0]} r={[0.18, 0.1, 0.03]} rot={[0, 0, s * 0.35]} mat={m.cream} />
            <Ball p={[s * 0.15, -0.04, 0]} r={[0.14, 0.07, 0.028]} rot={[0, 0, s * 0.1]} mat={m.cream} />
            <Ball p={[s * 0.11, -0.11, 0]} r={[0.1, 0.05, 0.026]} rot={[0, 0, -s * 0.15]} mat={m.cream} />
          </Wing>
        ))}
      {back === 'bat' &&
        [-1, 1].map((s) => (
          <Wing key={s} side={s} rate={4} amp={0.18}>
            <Ball p={[s * 0.13, 0.06, 0]} r={[0.15, 0.05, 0.02]} rot={[0, 0, s * 0.55]} mat={m.batwing} />
            <Ball p={[s * 0.17, -0.01, 0]} r={[0.15, 0.05, 0.02]} rot={[0, 0, s * 0.1]} mat={m.batwing} />
            <Ball p={[s * 0.14, -0.08, 0]} r={[0.12, 0.045, 0.02]} rot={[0, 0, -s * 0.3]} mat={m.batwing} />
            <Ball p={[s * 0.27, 0.14, 0]} r={0.022} mat={m.batwing} />
          </Wing>
        ))}
      {back === 'butterfly' &&
        [-1, 1].map((s) => (
          <Wing key={s} side={s} rate={7} amp={0.3}>
            <Ball p={[s * 0.15, 0.08, 0]} r={[0.16, 0.12, 0.015]} rot={[0, 0, s * 0.5]} mat={m.pink} />
            <Ball p={[s * 0.12, -0.07, 0]} r={[0.11, 0.09, 0.015]} rot={[0, 0, -s * 0.4]} mat={m.mint} />
            {[-1, 1].map((f) => (
              <Ball key={f} p={[s * 0.2, 0.11, f * 0.014]} r={[0.035, 0.03, 0.006]} mat={m.cream} shadow={false} />
            ))}
          </Wing>
        ))}
      {back === 'backpack' && (
        <group position={[0, -0.05, -0.05]}>
          <Ball p={[0, 0, 0]} r={[0.17, 0.19, 0.1]} mat={m.cloth2} />
          <Ball p={[0, 0.13, 0.01]} r={[0.16, 0.06, 0.09]} mat={m.cloth} />
          <Ball p={[0, -0.07, -0.08]} r={[0.1, 0.08, 0.04]} mat={m.cream} />
          <Ball p={[0, 0.1, -0.085]} r={0.022} mat={m.gold} />
          <Star mat={m.sun} p={[0.16, -0.08, -0.04]} s={0.03} rot={[0, 1.2, 0.3]} />
        </group>
      )}
      {back === 'balloon' && (
        <Motion sway={0.08} base={[-0.25, 0, -0.22]} p={[0.06, 0, -0.03]}>
          <mesh material={m.cream} position={[0, 0.38, 0]}>
            <cylinderGeometry args={[0.004, 0.004, 0.76, 6]} />
          </mesh>
          <mesh material={m.berry} position={[0, 0.775, 0]}>
            <coneGeometry args={[0.025, 0.04, 10]} />
          </mesh>
          <Ball p={[0, 0.95, 0]} r={[0.15, 0.18, 0.15]} mat={m.berry} />
          <Ball p={[-0.05, 1.01, 0.12]} r={[0.03, 0.045, 0.01]} rot={[0, 0, 0.4]} mat={m.white} shadow={false} />
        </Motion>
      )}
    </group>
  );
}

/** Hand slot: p = the paw, in the right arm's frame. Items stand up out of the paw. */
export function HandSlot({ m, p }: { m: Mats; p: V3 }) {
  const { hand } = useContext(LoadoutContext);
  if (hand === 'none') return null;
  return (
    <group position={p} rotation={[0.25, 0, -0.25]}>
      {hand === 'icecream' && (
        <>
          <mesh material={m.orange} position={[0, 0.03, 0]} rotation-x={Math.PI} castShadow>
            <coneGeometry args={[0.05, 0.14, 16]} />
          </mesh>
          <Ball p={[0, 0.12, 0]} r={0.056} mat={m.pink} />
          <Ball p={[0, 0.19, 0]} r={0.05} mat={m.cream} />
          <Ball p={[0.005, 0.245, 0.01]} r={0.02} mat={m.berry} />
        </>
      )}
      {hand === 'lollipop' && (
        <>
          <mesh material={m.cream} position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.2, 8]} />
          </mesh>
          <mesh material={m.berry} position={[0, 0.24, 0]} rotation-x={Math.PI / 2} castShadow>
            <cylinderGeometry args={[0.085, 0.085, 0.03, 32]} />
          </mesh>
          {[0.055, 0.028].map((rr) => (
            <mesh key={rr} material={m.cream} position={[0, 0.24, 0.016]}>
              <torusGeometry args={[rr, 0.01, 8, 28]} />
            </mesh>
          ))}
        </>
      )}
      {hand === 'wand' && (
        <>
          <mesh material={m.lav} position={[0, 0.09, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.22, 8]} />
          </mesh>
          <Motion spin={2} p={[0, 0.25, 0]}>
            <Star mat={m.sun} p={[0, 0, 0]} s={0.05} />
          </Motion>
          {[
            [0.08, 0.3],
            [-0.07, 0.33],
            [0.05, 0.37],
          ].map(([x, yy], i) => (
            <Ball key={i} p={[x, yy, 0]} r={0.012} mat={m.cream} shadow={false} />
          ))}
        </>
      )}
      {hand === 'sunflower' && (
        <>
          <mesh material={m.leaf} position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.26, 8]} />
          </mesh>
          <Ball p={[0.035, 0.07, 0]} r={[0.04, 0.015, 0.02]} rot={[0, 0, 0.5]} mat={m.leaf} />
          <group position={[0, 0.25, 0.01]}>
            {Array.from({ length: 10 }, (_, i) => {
              const a = (i / 10) * Math.PI * 2;
              return <Ball key={i} p={[Math.sin(a) * 0.06, Math.cos(a) * 0.06, 0]} r={[0.035, 0.018, 0.01]} rot={[0, 0, Math.PI / 2 - a]} mat={m.sun} />;
            })}
            <Ball p={[0, 0, 0.008]} r={[0.042, 0.042, 0.02]} mat={m.choco} />
          </group>
        </>
      )}
    </group>
  );
}
