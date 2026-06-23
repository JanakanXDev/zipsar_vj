"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useExperienceStore } from "@/stores/experienceStore";
import { prologue } from "@/content/contentBible";

/* Module-level scratch — zero allocation in the frame loop (§5.6). */
const lookTarget = new THREE.Vector3();

const easeInOut = (t: number) => t * t * (3 - 2 * t);

/**
 * Camera controller (Blueprint §6.3 bridge, read side):
 * - Prologue progress (scrubbed, from the store) drives the hero dolly
 *   Space → Earth (z−18) → Cities (z−38) → Dreamer (z−56);
 * - global scroll continues a slow drift for the rest of the film;
 * - pointer adds a damped parallax sway (cursor interaction system);
 * - cinematic breathing: subtle z-oscillation for a "living camera" feel;
 * - per-axis exponential damping = the "heavy film camera" lag.
 */
export function CameraRig() {
  const camera = useThree((state) => state.camera);

  useFrame((state, delta) => {
    const store = useExperienceStore.getState();
    const heroProgress = store.sectionProgress[prologue.id] ?? 0;
    const t = state.clock.elapsedTime;

    const journey = easeInOut(heroProgress) * 62;
    const drift = store.scrollProgress * 6;
    const targetZ = 8 - journey - drift;
    const targetX = store.pointerX * 0.9 + Math.sin(heroProgress * Math.PI) * 1.2;
    const targetY = 1.1 - store.pointerY * 0.55 - heroProgress * 0.8;

    /* Cinematic breathing — subtle slow z-oscillation like a handheld camera */
    const breatheZ = Math.sin(t * 0.22) * 0.12;
    const breatheY = Math.sin(t * 0.17) * 0.05;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 3.2, delta);
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      targetY + breatheY,
      3.2,
      delta,
    );
    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      targetZ + breatheZ,
      3.2,
      delta,
    );

    lookTarget.set(store.pointerX * 0.35, -store.pointerY * 0.2, camera.position.z - 12);
    camera.lookAt(lookTarget);
  });

  return null;
}
