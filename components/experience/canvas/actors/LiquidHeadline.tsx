"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Center, Float, MeshTransmissionMaterial, Text3D } from "@react-three/drei";
import * as THREE from "three";
import { useExperienceStore } from "@/stores/experienceStore";
import { prologue } from "@/content/contentBible";

export function LiquidHeadline() {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<any>(null);
  
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Get prologue progress (0 = top, 1 = scrolled out)
    const progress = useExperienceStore.getState().sectionProgress["prologue"] ?? 0;
    
    // Fly up and towards the camera (penetrate the screen) as we scroll
    groupRef.current.position.y = 0.5 + progress * 10;
    groupRef.current.position.z = -3 + progress * 15; // +Z moves it towards the camera
    
    // Tilt up as it flies away
    groupRef.current.rotation.x = progress * 0.5;
  });

  // Split text into three lines to fit the screen
  const formattedText = "The World\nNeeds More\nDreamers";

  return (
    <group ref={groupRef} position={[0, 0.5, -3]}>
      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.2}>
        <Center>
          <Text3D
            font="/fonts/helvetiker_bold.typeface.json"
            size={0.7}
            height={0.2}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.03}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={4}
            lineHeight={1.2}
            letterSpacing={-0.02}
          >
            {formattedText}
            
            <MeshTransmissionMaterial
              ref={materialRef}
              resolution={256}
              samples={4}
              thickness={0.2}
              roughness={0.15}
              transmission={0.85} // Lowered slightly so the bright color shows through
              ior={1.3}
              chromaticAberration={0.05}
              clearcoat={1}
              clearcoatRoughness={0.1}
              color="#aaddff" // Bright icy blue to make it highly visible against black space
              attenuationColor="#ffffff"
              attenuationDistance={10}
            />
          </Text3D>
        </Center>
      </Float>
    </group>
  );
}
