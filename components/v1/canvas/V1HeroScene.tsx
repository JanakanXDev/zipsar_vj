"use client";

import { V1Earth } from "./V1Earth";
import { V1Starfield } from "./V1Starfield";

/**
 * The hero cosmos: pure-black space, a sun light (for the cloud shell),
 * a restrained starfield, and the photoreal Earth on the horizon.
 * The Earth shader computes its own day/night lighting; the directional
 * light only lights the cloud shell so clouds darken on the night side.
 */
export function V1HeroScene() {
  return (
    <>
      <color attach="background" args={["#050505"]} />
      <ambientLight intensity={0.06} />
      <directionalLight position={[-6, 3.2, 8]} intensity={1.3} color="#ffffff" />
      <V1Starfield />
      <V1Earth />
    </>
  );
}
