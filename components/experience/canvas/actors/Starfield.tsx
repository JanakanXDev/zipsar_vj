"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { QualityTier } from "@/stores/experienceStore";

const COUNT: Record<QualityTier, number> = { high: 5200, mid: 3000, low: 900 };
/* Secondary sparse layer — larger, slower, for parallax depth */
const COUNT_BG: Record<QualityTier, number> = { high: 800, mid: 400, low: 0 };

/* Star palette: white core, blue/purple tints (tokens.css neons). */
const PALETTE = [
  new THREE.Color("#f2f4ff"),
  new THREE.Color("#7fd4ff"),
  new THREE.Color("#c7b8fd"),
  new THREE.Color("#a8d8f8"),
];

/* Brighter "hero stars" — a small number of prominent stars */
const HERO_STARS = [
  { pos: [-25, 12, -40] as [number, number, number], color: "#7fd4ff" },
  { pos: [32, -8, -65] as [number, number, number], color: "#c7b8fd" },
  { pos: [-14, -18, -90] as [number, number, number], color: "#f2f4ff" },
  { pos: [18, 22, -55] as [number, number, number], color: "#7fd4ff" },
];

/**
 * Starfield — dual-layer: dense foreground cloud + sparse background
 * layer that moves at a fractionally different rotation speed (parallax
 * depth). Three hero stars flicker distinctly.
 * One draw call per layer; zero per-frame allocation.
 */
export function Starfield({ tier }: { tier: QualityTier }) {
  const groupRef = useRef<THREE.Group>(null);
  const bgGroupRef = useRef<THREE.Group>(null);
  const count = COUNT[tier];
  const bgCount = COUNT_BG[tier];

  /* Foreground star buffer */
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

  /* Background star buffer — sparser, larger, different spatial range */
  const { bgPositions, bgColors } = useMemo(() => {
    const bgPositions = new Float32Array(bgCount * 3);
    const bgColors = new Float32Array(bgCount * 3);
    for (let i = 0; i < bgCount; i++) {
      bgPositions[i * 3] = (Math.random() - 0.5) * 280;
      bgPositions[i * 3 + 1] = (Math.random() - 0.5) * 160;
      bgPositions[i * 3 + 2] = 30 - Math.random() * 240;
      const color = PALETTE[Math.floor(Math.random() * 2)]!; // mostly white/blue
      bgColors[i * 3] = color.r * (0.25 + Math.random() * 0.35);
      bgColors[i * 3 + 1] = color.g * (0.25 + Math.random() * 0.35);
      bgColors[i * 3 + 2] = color.b * (0.25 + Math.random() * 0.35);
    }
    return { bgPositions, bgColors };
  }, [bgCount]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    const bgGroup = bgGroupRef.current;
    if (!group) return;

    /* Foreground: standard slow drift */
    group.rotation.z += delta * 0.0035;

    /* Background: slightly faster rotation for parallax depth effect */
    if (bgGroup) bgGroup.rotation.z += delta * 0.0018;
  });

  return (
    <group>
      {/* Foreground star layer */}
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

      {/* Background star layer — sparser, larger, slower rotation */}
      {bgCount > 0 && (
        <group ref={bgGroupRef}>
          <points frustumCulled={false}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[bgPositions, 3]} />
              <bufferAttribute attach="attributes-color" args={[bgColors, 3]} />
            </bufferGeometry>
            <pointsMaterial
              size={0.28}
              sizeAttenuation
              vertexColors
              transparent
              opacity={0.55}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </points>
        </group>
      )}

      {/* Hero stars — individually flickering bright points (uses pointsMaterial directly, no ref needed for flicker) */}
      {HERO_STARS.map((star, i) => {
        const col = new THREE.Color(star.color);
        const pos = new Float32Array([star.pos[0], star.pos[1], star.pos[2]]);
        const cols = new Float32Array([col.r, col.g, col.b]);
        return (
          <points key={i} frustumCulled={false}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[pos, 3]} />
              <bufferAttribute attach="attributes-color" args={[cols, 3]} />
            </bufferGeometry>
            <pointsMaterial
              size={0.6}
              sizeAttenuation
              vertexColors
              transparent
              opacity={0.85}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </points>
        );
      })}
    </group>
  );
}
