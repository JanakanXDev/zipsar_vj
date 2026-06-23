"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { QualityTier } from "@/stores/experienceStore";

const COUNT: Record<QualityTier, number> = { high: 4200, mid: 2600, low: 900 };

/* Star palette: white core, blue/purple tints (tokens.css neons). */
const PALETTE = [
  new THREE.Color("#f2f4ff"),
  new THREE.Color("#7fd4ff"),
  new THREE.Color("#c7b8fd"),
];

/**
 * Starfield — single buffered Points cloud spanning the full camera
 * journey (z −170 → +30). One draw call; drift rotation only — depth
 * parallax comes free from camera travel. Zero per-frame allocation.
 */
export function Starfield({ tier }: { tier: QualityTier }) {
  const groupRef = useRef<THREE.Group>(null);
  const count = COUNT[tier];

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 180;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 110;
      positions[i * 3 + 2] = 30 - Math.random() * 200;
      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)]!;
      const intensity = 0.55 + Math.random() * 0.45;
      colors[i * 3] = color.r * intensity;
      colors[i * 3 + 1] = color.g * intensity;
      colors[i * 3 + 2] = color.b * intensity;
    }
    return { positions, colors };
  }, [count]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    group.rotation.z += delta * 0.0035;
  });

  return (
    <group ref={groupRef}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.14}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
