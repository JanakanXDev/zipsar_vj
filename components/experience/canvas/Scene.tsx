"use client";

import type { QualityTier } from "@/stores/experienceStore";
import { CameraRig } from "./CameraRig";
import { Starfield } from "./actors/Starfield";
import { GalaxyParticles } from "./actors/GalaxyParticles";
import { FloatingParticles } from "./actors/FloatingParticles";
import { StoryProps } from "./actors/StoryProps";

/**
 * The cosmic world — one continuous scene the camera travels through
 * (Blueprint §5.2). Particles are single-draw-call buffers; props are
 * placeholder meshes positioned along the camera path.
 */
export function Scene({ tier }: { tier: QualityTier }) {
  return (
    <>
      <color attach="background" args={["#06060a"]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 8, 4]} intensity={0.7} color="#aab2c8" />

      <CameraRig />
      <Starfield tier={tier} />
      <GalaxyParticles tier={tier} />
      <FloatingParticles tier={tier} />
      <StoryProps />
    </>
  );
}
