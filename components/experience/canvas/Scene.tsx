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
 *
 * Visual upgrades:
 * - fogExp2: atmospheric depth haze between objects
 * - Cooler ambient + warmer point light for color temperature variation
 * - Hemisphere light: sky=cool, ground=warm for realistic scene lighting
 */
export function Scene({ tier }: { tier: QualityTier }) {
  return (
    <>
      <color attach="background" args={["#06060a"]} />

      {/* Atmospheric fog — adds perceived depth */}
      <fogExp2 attach="fog" args={["#07070e", 0.0045]} />

      {/* Cool ambient — the void of space */}
      <ambientLight intensity={0.28} color="#a8b4d8" />

      {/* Key directional light — cool spacecraft/moonlight */}
      <directionalLight position={[6, 8, 4]} intensity={0.65} color="#b0c4ee" />

      {/* Warm fill light — counterbalances the cool, suggests city warmth */}
      <directionalLight position={[-8, -4, 2]} intensity={0.18} color="#ffcba4" />

      {/* Hemisphere: cool sky, warm earth — natural environmental feel */}
      <hemisphereLight
        args={[undefined, undefined, 0.15]}
        color="#5588cc"
        groundColor="#664422"
        position={[0, 1, 0]}
      />

      <CameraRig />
      <Starfield tier={tier} />
      <GalaxyParticles tier={tier} />
      <FloatingParticles tier={tier} />
      <StoryProps />
    </>
  );
}
