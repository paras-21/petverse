'use client';

import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { V3 } from '@/lib/pets';

export interface Burst {
  pos: V3;
  colors: string[];
  count?: number;
  speed?: number;
  up?: number;
  gravity?: number;
  life?: number;
  size?: number;
}

export interface ParticlesHandle {
  burst: (b: Burst) => void;
}

interface P {
  alive: boolean;
  p: THREE.Vector3;
  v: THREE.Vector3;
  rot: THREE.Euler;
  spin: THREE.Vector3;
  life: number;
  size: number;
  g: number;
}

const MAX = 400;

export const Particles = forwardRef<ParticlesHandle>(function Particles(_props, ref) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const pool = useRef<P[]>(
    Array.from({ length: MAX }, () => ({
      alive: false,
      p: new THREE.Vector3(),
      v: new THREE.Vector3(),
      rot: new THREE.Euler(),
      spin: new THREE.Vector3(),
      life: 0,
      size: 0.08,
      g: 9,
    })),
  );
  const cursor = useRef(0);
  const tmp = useRef(new THREE.Object3D());
  const color = useRef(new THREE.Color());

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const o = new THREE.Object3D();
    o.scale.setScalar(0);
    o.updateMatrix();
    for (let i = 0; i < MAX; i++) {
      mesh.setMatrixAt(i, o.matrix);
      mesh.setColorAt(i, color.current.set('#ffffff'));
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  useImperativeHandle(ref, () => ({
    burst(b) {
      const mesh = meshRef.current;
      if (!mesh) return;
      const n = b.count ?? 16;
      const sp = b.speed ?? 2;
      for (let i = 0; i < n; i++) {
        const idx = cursor.current++ % MAX;
        const q = pool.current[idx];
        q.alive = true;
        q.p.set(
          b.pos[0] + (Math.random() - 0.5) * 0.2,
          b.pos[1] + (Math.random() - 0.5) * 0.2,
          b.pos[2] + (Math.random() - 0.5) * 0.2,
        );
        const a = Math.random() * Math.PI * 2;
        const e = Math.random() * 0.8 + 0.2;
        q.v.set(Math.cos(a) * sp * e, (b.up ?? 2) * (0.6 + Math.random() * 0.6), Math.sin(a) * sp * e);
        q.spin.set(Math.random() * 10, Math.random() * 10, Math.random() * 10);
        q.life = (b.life ?? 1) * (0.7 + Math.random() * 0.5);
        q.size = (b.size ?? 0.08) * (0.7 + Math.random() * 0.6);
        q.g = b.gravity ?? 9;
        mesh.setColorAt(idx, color.current.set(b.colors[i % b.colors.length]));
      }
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    },
  }));

  useFrame((_s, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dt = Math.min(delta, 0.05);
    const o = tmp.current;
    for (let i = 0; i < MAX; i++) {
      const q = pool.current[i];
      if (!q.alive) continue;
      q.life -= dt;
      if (q.life <= 0) {
        q.alive = false;
        o.scale.setScalar(0);
      } else {
        q.v.y -= q.g * dt;
        q.p.addScaledVector(q.v, dt);
        if (q.p.y < q.size / 2) {
          q.p.y = q.size / 2;
          q.v.y *= -0.35;
          q.v.x *= 0.7;
          q.v.z *= 0.7;
        }
        q.rot.x += q.spin.x * dt;
        q.rot.y += q.spin.y * dt;
        o.position.copy(q.p);
        o.rotation.copy(q.rot);
        o.scale.setScalar(q.size * Math.min(1, q.life / 0.3));
      }
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, MAX]} frustumCulled={false}>
      <sphereGeometry args={[0.5, 16, 12]} />
      <meshStandardMaterial roughness={0.25} />
    </instancedMesh>
  );
});
