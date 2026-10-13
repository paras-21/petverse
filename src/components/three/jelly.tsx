'use client';

import { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { V3 } from '@/lib/pets';

// One prefiltered studio env map per renderer: gives the jelly its glossy reflections
// without touching the voxel scenery (which keeps plain lighting).
const envCache = new WeakMap<THREE.WebGLRenderer, THREE.Texture>();

export function useGlossEnv(): THREE.Texture {
  const gl = useThree((s) => s.gl);
  return useMemo(() => {
    let tex = envCache.get(gl);
    if (!tex) {
      const pmrem = new THREE.PMREMGenerator(gl);
      tex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      pmrem.dispose();
      envCache.set(gl, tex);
    }
    return tex;
  }, [gl]);
}

export const SPHERE = new THREE.SphereGeometry(1, 48, 32);

export interface JellyOpts {
  env: THREE.Texture;
  rough?: number;
  metal?: number;
  glow?: number; // fake subsurface: a little of the base color added as emission
  /** "Painted" toy look: color multiplier on the side facing away from the key light. */
  shade?: string;
  /** Strength of the soft fresnel rim glow. */
  rim?: number;
  rimColor?: string;
  /** Shiny lacquer (eyes, metal). Off by default: characters read as soft matte vinyl/plush. */
  gloss?: boolean;
}

/**
 * Patches MeshPhysicalMaterial with an illustrated gradient (bright upper-left, palette-dark lower-right,
 * like a vinyl toy render) and a soft rim light. Uses the view-space normal, so every character
 * reads the same from any camera angle.
 */
function paint(m: THREE.MeshPhysicalMaterial, shade: THREE.Color, rim: number, rimColor: THREE.Color) {
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uShade = { value: shade };
    sh.uniforms.uRim = { value: rim };
    sh.uniforms.uRimColor = { value: rimColor };
    sh.fragmentShader = sh.fragmentShader
      .replace(
        'void main() {',
        'uniform vec3 uShade;\nuniform float uRim;\nuniform vec3 uRimColor;\nvoid main() {',
      )
      .replace(
        '#include <normal_fragment_maps>',
        `#include <normal_fragment_maps>
        float paintK = smoothstep(-0.75, 0.85, dot(normal, normalize(vec3(-0.45, 0.8, 0.4))));
        diffuseColor.rgb *= mix(uShade, vec3(1.08), paintK);`,
      )
      .replace(
        '#include <opaque_fragment>',
        `float rimK = pow(1.0 - saturate(dot(normal, normalize(vViewPosition))), 2.6);
        outgoingLight += uRimColor * rimK * uRim;
        #include <opaque_fragment>`,
      );
  };
  m.customProgramCacheKey = () => 'jelly-paint';
}

export function jellyMat(
  color: string,
  { env, rough, metal = 0, glow = 0.04, shade, rim = 0.35, rimColor = '#ffffff', gloss = false }: JellyOpts,
) {
  const c = new THREE.Color(color);
  const m = new THREE.MeshPhysicalMaterial(
    gloss
      ? {
          color: c,
          roughness: rough ?? 0.3,
          metalness: metal,
          clearcoat: 1,
          clearcoatRoughness: 0.06,
          envMap: env,
          envMapIntensity: 0.5,
        }
      : {
          // soft: broad dim highlight + velvety sheen at the edges, no mirror reflections
          color: c,
          roughness: rough ?? 0.72,
          metalness: metal,
          specularIntensity: 0.25,
          sheen: 0.6,
          sheenRoughness: 0.85,
          sheenColor: c.clone().lerp(new THREE.Color('#ffffff'), 0.6),
          envMap: env,
          envMapIntensity: 0.35,
        },
  );
  m.emissive.copy(c).multiplyScalar(glow);
  m.userData.baseEmissive = m.emissive.clone();
  // default shade: a cool, slightly purple shadow so dark sides stay colorful, not gray
  const sc = shade ? new THREE.Color(shade) : new THREE.Color(0.66, 0.64, 0.78);
  if (shade) sc.setRGB(Math.min(1, sc.r / Math.max(c.r, 0.05)), Math.min(1, sc.g / Math.max(c.g, 0.05)), Math.min(1, sc.b / Math.max(c.b, 0.05)));
  paint(m, sc, rim, new THREE.Color(rimColor));
  return m;
}

/**
 * One smooth body mesh: an ellipsoid with soft bumps pushed out along `lobes` directions.
 * Gives cloud/puff silhouettes without the seams of overlapping spheres.
 */
export function puffGeometry(radii: V3, lobes: [number, number, number, number][], sharp = 9) {
  const g = new THREE.SphereGeometry(1, 128, 96);
  const pos = g.attributes.position;
  const d = new THREE.Vector3();
  const dirs = lobes.map(([x, y, z, a]) => [new THREE.Vector3(x, y, z).normalize(), a] as const);
  for (let i = 0; i < pos.count; i++) {
    d.fromBufferAttribute(pos, i).normalize();
    let bump = 0;
    for (const [l, a] of dirs) bump += a * Math.exp(-(1 - d.dot(l)) * sharp);
    pos.setXYZ(i, d.x * (radii[0] + bump), d.y * (radii[1] + bump), d.z * (radii[2] + bump));
  }
  g.computeVertexNormals();
  return g;
}

let shadowTex: THREE.Texture | null = null;
/** Soft radial blob used as a contact shadow under characters. */
export function contactShadowTexture() {
  if (shadowTex) return shadowTex;
  const cv = document.createElement('canvas');
  cv.width = cv.height = 128;
  const ctx = cv.getContext('2d')!;
  const gr = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(40,30,70,0.55)');
  gr.addColorStop(0.55, 'rgba(40,30,70,0.22)');
  gr.addColorStop(1, 'rgba(40,30,70,0)');
  ctx.fillStyle = gr;
  ctx.fillRect(0, 0, 128, 128);
  shadowTex = new THREE.CanvasTexture(cv);
  shadowTex.colorSpace = THREE.SRGBColorSpace;
  return shadowTex;
}

/** Punchier version of a pastel palette color, closer to a candy/jelly toy. */
export function juicy(hex: string, sat = 0.3, light = -0.06) {
  return '#' + new THREE.Color(hex).offsetHSL(0, sat, light).getHexString();
}

export function useMats<T extends Record<string, THREE.Material>>(make: () => T, deps: unknown[]): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mats = useMemo(make, deps);
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);
  return mats;
}

interface BallProps {
  p: V3;
  r: V3 | number;
  mat: THREE.Material;
  rot?: V3;
  shadow?: boolean;
}

/** Ellipsoid primitive: every character is built out of these. */
export function Ball({ p, r, mat, rot, shadow = true }: BallProps) {
  return (
    <mesh
      geometry={SPHERE}
      material={mat}
      position={p}
      rotation={rot}
      scale={typeof r === 'number' ? [r, r, r] : r}
      castShadow={shadow}
    />
  );
}

/** z of a point on the front of an ellipsoid (center c, radii r) at the given x, y. */
export function frontZ(c: V3, r: V3, x: number, y: number) {
  const k = 1 - ((x - c[0]) / r[0]) ** 2 - ((y - c[1]) / r[1]) ** 2;
  return c[2] + r[2] * Math.sqrt(Math.max(0, k));
}
