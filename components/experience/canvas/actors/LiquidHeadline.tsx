"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Center, Environment, Float, MeshTransmissionMaterial, Text3D } from "@react-three/drei";
import * as THREE from "three";
import { useExperienceStore } from "@/stores/experienceStore";
import { prologue } from "@/content/contentBible";

export function LiquidHeadline() {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<any>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Get prologue progress (0 = top, 1 = scrolled out)
    const progress = useExperienceStore.getState().sectionProgress["prologue"] ?? 0;
    
    // Fly up and towards the camera (penetrate the screen) as we scroll
    groupRef.current.position.y = 0.5 + progress * 10;
    groupRef.current.position.z = -3 + progress * 15;
    
    // Tilt up as it flies away
    groupRef.current.rotation.x = progress * 0.5;

    // Animate the rim light to orbit the text, creating sweeping edge caustics
    if (lightRef.current) {
      const t = state.clock.getElapsedTime() * 0.5;
      lightRef.current.position.x = Math.sin(t) * 4;
      lightRef.current.position.y = Math.cos(t * 1.2) * 2;
      lightRef.current.position.z = Math.sin(t * 0.8) * 3 + 2; // Keep it generally in front/sides
    }
  });

  // Split text into three lines to fit the screen
  const formattedText = "The World\nNeeds More\nDreamers";

  return (
    <group ref={groupRef} position={[0, 0.5, -3]}>
      {/* Invisible environment map specifically to provide complex reflections for the glass */}
      <Environment preset="city" />
      
      {/* Dynamic rim light to trace the crystal edges */}
      <pointLight ref={lightRef} intensity={2.5} color="#cceeff" distance={10} decay={2} />

      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.2}>
        <Center>
          <Text3D
            font="/fonts/helvetiker_bold.typeface.json"
            size={0.7}
            height={0.4}              // Increased depth for true 3D volume
            curveSegments={24}        // Smooth out the curves
            bevelEnabled
            bevelThickness={0.08}     // Thick bevel for rounded convex face
            bevelSize={0.04}
            bevelOffset={0}
            bevelSegments={12}        // High detail bevel for crystal edges
            lineHeight={1.2}
            letterSpacing={-0.02}
          >
            {formattedText}
            
            <MeshTransmissionMaterial
              ref={materialRef}
              resolution={512}        // Higher res for clean refraction
              samples={6}
              thickness={1.5}         // Physical thickness of the glass lens
              roughness={0.0}         // Flawless polish
              transmission={1.0}      // 100% glass
              ior={1.5}               // Real crystal IOR
              chromaticAberration={0.08} // Stronger dispersion at edges
              clearcoat={1.0}
              clearcoatRoughness={0.0}
              backside={true}         // Render inner faces for double-refraction
              backsideThickness={0.5}
              color="#ffffff"         // Pure clear glass
              attenuationColor="#ffffff"
              attenuationDistance={10}
            />
          </Text3D>
        </Center>
      </Float>
    </group>
  );
}
