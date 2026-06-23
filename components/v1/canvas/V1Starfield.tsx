"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Restrained starfield — "Space. Earth horizon. Stars." (not excessive
 * particles). One buffered Points cloud, time-based intro fade-in, a
 * barely-there drift. White with faint cool tint.
 */
export function V1Starfield({ count = 2200 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 60;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 40 + 6;
      arr[i * 3 + 2] = -10 - Math.random() * 40;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (matRef.current) {
      matRef.current.opacity = THREE.MathUtils.clamp((state.clock.elapsedTime - 0.3) / 2, 0, 0.9);
    }
    if (pointsRef.current) pointsRef.current.rotation.z += delta * 0.002;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.06}
        sizeAttenuation
        color="#cfe6ff"
        transparent
        opacity={0}
        depthWrite={false}
      />
    </points>
  );
}
