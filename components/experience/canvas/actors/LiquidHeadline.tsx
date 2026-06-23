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
    groupRef.current.position.y = 1.5 + progress * 20;
    groupRef.current.position.z = -2 - progress * 10;
    
    // Tilt up as it flies away
    groupRef.current.rotation.x = progress * 0.8;
  });

  // Split text into two lines for better visual composition
  const formattedText = prologue.sceneTitle.replace("Needs More", "Needs More\n");

  return (
    <group ref={groupRef} position={[0, 1.5, -2]}>
      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.4}>
        <Center top>
          <Text3D
            font="/fonts/helvetiker_bold.typeface.json"
            size={1.4}
            height={0.4}
            curveSegments={32}
            bevelEnabled
            bevelThickness={0.06}
            bevelSize={0.03}
            bevelOffset={0}
            bevelSegments={8}
            lineHeight={0.9}
            letterSpacing={-0.03}
          >
            {formattedText}
            
            <MeshTransmissionMaterial
              ref={materialRef}
              backside
              backsideThickness={1.0}
              thickness={1.5}
              roughness={0.08}
              transmission={1.0}
              ior={1.4}
              chromaticAberration={0.06}
              anisotropy={0.2}
              clearcoat={1}
              clearcoatRoughness={0.1}
              color="#e6f2ff"
              attenuationColor="#a6d4ff"
              attenuationDistance={2}
            />
          </Text3D>
        </Center>
      </Float>
    </group>
  );
}
