"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { useExperienceStore } from "@/stores/experienceStore";
import { useQualityTier } from "@/hooks/useQualityTier";
import { Scene } from "./Scene";

/**
 * The persistent WebGL film layer (Blueprint §5.1):
 * - fixed, aria-hidden, pointer-events none — DOM owns all input;
 * - DPR clamped by GPU tier; PerformanceMonitor steps it DOWN only
 *   (never back up — no oscillation, §9.3);
 * - pointer is forwarded to the store from a window listener;
 * - context loss flips webglOk → the shell unmounts to the CSS poster.
 */
export default function ExperienceCanvas() {
  const tier = useQualityTier();
  const [dprMax, setDprMax] = useState(1.5);
  const [active, setActive] = useState(true);

  useEffect(() => {
    setDprMax((current) => Math.min(current, tier === "high" ? 2 : tier === "mid" ? 1.5 : 1));
  }, [tier]);

  /* Stop rendering entirely while the tab is hidden — no background
     GPU/CPU work (Blueprint §5.1, §9.3). */
  useEffect(() => {
    const onVisibility = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  /* Cursor interaction system — normalized −1..1, one store write per move. */
  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      useExperienceStore
        .getState()
        .setPointer(
          (event.clientX / window.innerWidth) * 2 - 1,
          (event.clientY / window.innerHeight) * 2 - 1,
        );
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-(--z-canvas)">
      <Canvas
        dpr={[1, dprMax]}
        camera={{ fov: 50, position: [0, 1.1, 8], near: 0.1, far: 320 }}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        frameloop={active ? "always" : "never"}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (event) => {
            event.preventDefault();
            useExperienceStore.getState().setWebglOk(false);
          });
        }}
      >
        <PerformanceMonitor onDecline={() => setDprMax((d) => Math.max(1, d - 0.25))}>
          <Suspense fallback={null}>
            <Scene tier={tier} />
          </Suspense>
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
