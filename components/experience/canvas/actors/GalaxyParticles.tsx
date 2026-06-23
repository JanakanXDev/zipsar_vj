"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperienceStore, type QualityTier } from "@/stores/experienceStore";
import { finale } from "@/content/contentBible";

const COUNT: Record<QualityTier, number> = { high: 9000, mid: 5000, low: 2000 };

const INNER = new THREE.Color("#a78bfa");
const OUTER = new THREE.Color("#00bfff");

/**
 * Galaxy particles — 3-arm spiral, additive blending, one draw call.
 * Idle: slow rotation. Finale ("stars converging"): the galaxy
 * contracts and spins up, driven by the finale section's scrubbed
 * progress read straight from the store (§6.3) — no React re-renders.
 */
export function GalaxyParticles({ tier }: { tier: QualityTier }) {
  const groupRef = useRef<THREE.Group>(null);
  const count = COUNT[tier];

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();
    const arms = 3;
    const radiusMax = 42;

    for (let i = 0; i < count; i++) {
      const radius = Math.pow(Math.random(), 0.65) * radiusMax;
      const armAngle = ((i % arms) / arms) * Math.PI * 2;
      const spin = radius * 0.28;
      const spread = (1 - radius / radiusMax) * 3 + 0.6;
      positions[i * 3] = Math.cos(armAngle + spin) * radius + (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.6;
      positions[i * 3 + 2] = Math.sin(armAngle + spin) * radius + (Math.random() - 0.5) * spread;

      color.copy(INNER).lerp(OUTER, radius / radiusMax);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { positions, colors };
  }, [count]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const converge = useExperienceStore.getState().sectionProgress[finale.id] ?? 0;
    group.rotation.y += delta * (0.02 + converge * 0.3);
    const scale = 1 - converge * 0.55;
    group.scale.x = THREE.MathUtils.damp(group.scale.x, scale, 4, delta);
    group.scale.y = THREE.MathUtils.damp(group.scale.y, scale, 4, delta);
    group.scale.z = THREE.MathUtils.damp(group.scale.z, scale, 4, delta);
  });

  return (
    <group ref={groupRef} position={[0, -8, -130]} rotation={[0.45, 0, 0.1]}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.22}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
