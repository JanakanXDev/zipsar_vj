"use client";

import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useExperienceStore } from "@/stores/experienceStore";
import { V1HeroScene } from "./V1HeroScene";

/**
 * V1 hero WebGL layer. Premium settings (AA on — the scene is light:
 * one sphere + a small point cloud). Renders only while `active`
 * (in view + tab visible) to protect 60fps and battery. Forwards the
 * pointer to the store for the Earth's subtle parallax tilt.
 */
export default function V1Canvas({ active }: { active: boolean }) {
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      useExperienceStore
        .getState()
        .setPointer(
          (event.clientX / window.innerWidth) * 2 - 1,
          (event.clientY / window.innerHeight) * 2 - 1,
        );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 45, position: [0, 0, 6], near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "never"}
    >
      <V1HeroScene />
    </Canvas>
  );
}
