"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Center, Environment, Float, MeshTransmissionMaterial, Text3D } from "@react-three/drei";
import * as THREE from "three";
import { useExperienceStore } from "@/stores/experienceStore";
import { useQualityTier } from "@/hooks/useQualityTier";

export function LiquidHeadline() {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  
  // Performance: Get GPU tier to scale heavy material properties
  const tier = useQualityTier();
  const isHighEnd = tier === "high";
  
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

      <Float speed={isHighEnd ? 1.5 : 0} rotationIntensity={0.15} floatIntensity={0.2}>
        <Center>
          <Text3D
            font="/fonts/helvetiker_bold.typeface.json"
            size={0.7}
            height={0.4}              
            curveSegments={isHighEnd ? 24 : 12} // Performance: Lower curve geometry on mobile
            bevelEnabled
            bevelThickness={0.08}     
            bevelSize={0.04}
            bevelOffset={0}
            bevelSegments={isHighEnd ? 12 : 4}  // Performance: Lower bevel geometry on mobile
            lineHeight={1.2}
            letterSpacing={-0.02}
          >
            {formattedText}
            
            <MeshTransmissionMaterial
              resolution={isHighEnd ? 512 : 256} // Performance: Half resolution FBO on mobile
              samples={isHighEnd ? 6 : 3}        // Performance: Fewer samples on mobile
              thickness={1.5}         
              roughness={0.0}         
              transmission={1.0}      
              ior={1.5}               
              chromaticAberration={0.08} 
              clearcoat={1.0}
              clearcoatRoughness={0.0}
              backside={isHighEnd}               // Performance: Disable costly double-refraction on mobile
              backsideThickness={0.5}
              color="#ffffff"         
              attenuationColor="#ffffff"
              attenuationDistance={10}
            />
          </Text3D>
        </Center>
      </Float>
    </group>
  );
}
