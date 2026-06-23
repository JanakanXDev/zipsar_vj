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
    
    // Fly up and back as we scroll
    groupRef.current.position.y = 0.5 + progress * 20;
    groupRef.current.position.z = -3 - progress * 10;
    
    // Tilt up as it flies away
    groupRef.current.rotation.x = progress * 0.8;
  });

  // Split text into two lines for better visual composition
  const formattedText = prologue.sceneTitle.replace("Needs More", "Needs More\n");

  return (
    <group ref={groupRef} position={[0, 0.5, -3]}>
      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.2}>
        <Center>
          <Text3D
            font="/fonts/helvetiker_bold.typeface.json"
            size={0.65}
            height={0.15}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.015}
            bevelOffset={0}
            bevelSegments={3}
            lineHeight={1.1}
            letterSpacing={-0.02}
          >
            {formattedText}
            
            <MeshTransmissionMaterial
              ref={materialRef}
              resolution={256}
              samples={4}
              thickness={0.5}
              roughness={0.1}
              transmission={1.0}
              ior={1.2}
              chromaticAberration={0.04}
              clearcoat={1}
              clearcoatRoughness={0.1}
              color="white"
              attenuationColor="#a6d4ff"
              attenuationDistance={5}
            />
          </Text3D>
        </Center>
      </Float>
    </group>
  );
}
