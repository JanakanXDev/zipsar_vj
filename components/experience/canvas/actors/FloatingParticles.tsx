"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useExperienceStore, type QualityTier } from "@/stores/experienceStore";

const COUNT: Record<QualityTier, number> = { high: 150, mid: 100, low: 50 };

/**
 * Floating particles — ambient dust that travels with the camera and
 * leans gently toward the pointer (cursor interaction system). Small
 * CPU-updated buffer (≤150), zero allocation in the frame loop.
 */
export function FloatingParticles({ tier }: { tier: QualityTier }) {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const camera = useThree((state) => state.camera);
  const count = COUNT[tier];

  const { base, phase, speed, positions } = useMemo(() => {
    const base = new Float32Array(count * 3);
    const phase = new Float32Array(count);
    const speed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      base[i * 3] = (Math.random() - 0.5) * 18;
      base[i * 3 + 1] = (Math.random() - 0.5) * 10;
      base[i * 3 + 2] = -(Math.random() * 16 + 2);
      phase[i] = Math.random() * Math.PI * 2;
      speed[i] = 0.3 + Math.random() * 0.5;
    }
    return { base, phase, speed, positions: base.slice() };
  }, [count]);

  useFrame((state, delta) => {
    const points = pointsRef.current;
    const group = groupRef.current;
    if (!points || !group) return;

    /* Travel with the camera. */
    group.position.z = camera.position.z;

    const store = useExperienceStore.getState();
    const pullX = store.pointerX * 2.2;
    const pullY = -store.pointerY * 1.4;
    const t = state.clock.elapsedTime;

    const attr = points.geometry.getAttribute("position") as THREE.BufferAttribute;
    const array = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const targetX = base[i3]! + Math.sin(t * speed[i]! + phase[i]!) * 0.8 + pullX;
      const targetY = base[i3 + 1]! + Math.cos(t * speed[i]! * 0.8 + phase[i]!) * 0.6 + pullY;
      array[i3] = THREE.MathUtils.damp(array[i3]!, targetX, 1.5, delta);
      array[i3 + 1] = THREE.MathUtils.damp(array[i3 + 1]!, targetY, 1.5, delta);
    }
    attr.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          sizeAttenuation
          color="#7fd4ff"
          transparent
          opacity={0.7}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
